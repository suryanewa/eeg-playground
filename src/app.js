import { colorToCSS, generateRandomColorRamp } from "fettepalette";
import { generateColorRamp } from "rampensau";
import { Poline } from "poline";
import { rybHsl2rgb } from "rybitten";
import {
  GemSmokeShapes,
  HalftoneCmykTypes,
  HalftoneDotsGrids,
  HalftoneDotsTypes,
  LiquidMetalShapes,
  ShaderFitOptions,
  ShaderMount,
  gemSmokeFragmentShader,
  getShaderColorFromString,
  getShaderNoiseTexture,
  halftoneCmykFragmentShader,
  halftoneDotsFragmentShader,
  heatmapFragmentShader,
  liquidMetalFragmentShader,
} from "@paper-design/shaders";

const shaderLayer = document.querySelector("#shader-layer");
const grid = document.querySelector("#logo-grid");
const shuffleButton = document.querySelector("#shuffle-button");
const settingsButton = document.querySelector("#settings-button");
const settingsPopover = document.querySelector("#settings-popover");
const settingsGradientToggle = document.querySelector("#settings-gradient");
const settingsFontButton = document.querySelector("#settings-font-button");
const settingsFontOptions = document.querySelector("#settings-font-options");
const settingsFontOptionButtons = [...document.querySelectorAll(".font-picker-option")];
const dialog = document.querySelector("#logo-dialog");
const fullscreenLogo = document.querySelector("#fullscreen-logo");
const closeButton = dialog.querySelector(".close-button");
const previousButton = dialog.querySelector(".nav-button--previous");
const nextButton = dialog.querySelector(".nav-button--next");
const logoOrder = [
  6, 9, 90, 13, 14, 16, 15, 96, 25, 67, 70, 71, 76,
  77, 78, 18, 12, 43, 17, 100, 37, 101, 38, 10, 11, 24, 26, 58, 80,
  82, 86, 106, 1, 60, 21, 22, 27, 105, 127, 129, 61,
  31, 36, 133, 134, 135, 136, 137, 138, 7, 8, 40, 41, 113, 114, 115, 116, 117, 118, 119, 79, 140, 139, 57, 62, 81, 83, 50, 97, 44, 45, 46, 47,
  48, 51, 52, 53, 54, 55, 56, 68, 69, 84, 85, 102, 49, 89, 91, 92,
  93, 94, 95, 103, 39, 122, 123, 124, 125, 126, 130, 120, 121, 3, 4, 5, 23, 65, 42, 63, 64, 73, 74, 87, 88,
  108, 109, 110, 98, 111, 112, 72, 131, 132, 19, 20, 99, 2, 33, 59, 75,
];
const logoCount = logoOrder.length;
let currentLogoId = logoId(logoOrder[0]);
let draggedTile = null;
let draggedTiles = [];
let pointerDrag = null;
let suppressNextClick = false;
let dragPreview = null;
let gradientMode = false;
let gridLogoScale = 1;
let fullscreenLogoScale = 1;
const defaultPalette = { ink: "#111111", paper: "#ffffff", ratio: 21, source: "Default" };
const invertedPalette = { ink: "#ffffff", paper: "#111111", ratio: 21, source: "Inverted" };
let currentPalette = defaultPalette;
let currentShaderIndex = -1;
let selectedFont = settingsFontButton.textContent.trim();
let lockupMode = false;
let shaderMount = null;
let fullscreenShaderMount = null;
const perIconShaderMounts = new Map();
const perIconLogoImageCache = new Map();
const perIconShaderPending = new Set();
const minLogoScale = 0.5;
const maxLogoScale = 1.5;
let shaderToken = 0;
const lockupText = "EEG";
const lockupCanvas = document.createElement("canvas");
const lockupFontFamilies = {
  Helvetica: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
  Inter: 'Inter, "Inter Tight", Arial, sans-serif',
  "Inter Tight": '"Inter Tight", Inter, Arial, sans-serif',
  "Open Runde": '"Open Runde", "Arial Rounded MT Bold", Arial, sans-serif',
  "Vercel Geist": '"Vercel Geist", Geist, Inter, Arial, sans-serif',
  Gotham: 'Gotham, Montserrat, "Helvetica Neue", Arial, sans-serif',
  "SF Pro": '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
  "Google Sans": '"Google Sans", "Product Sans", Arial, sans-serif',
  Manrope: 'Manrope, Inter, Arial, sans-serif',
  Satoshi: 'Satoshi, Inter, Arial, sans-serif',
};

function logoId(id) {
  return String(id).padStart(3, "0");
}

function logoPath(id) {
  return `assets/logos/logo-${logoId(id)}.svg`;
}

function logoMarkup(id) {
  return window.LOGO_SVGS?.[logoId(id)] ?? "";
}

function gridBaseColumns() {
  return window.matchMedia("(max-width: 720px)").matches ? 4 : 8;
}

function gridColumnsForScale(scale) {
  const baseColumns = gridBaseColumns();
  const maxColumns = baseColumns <= 4 ? 11 : 15;
  const progress = (Math.min(maxLogoScale, Math.max(minLogoScale, scale)) - minLogoScale)
    / (maxLogoScale - minLogoScale);
  return Math.max(1, Math.round(maxColumns - progress * (maxColumns - 1)));
}

function updateGridColumns() {
  document.documentElement.style.setProperty("--grid-columns", String(gridColumnsForScale(gridLogoScale)));
}

function clampLogoScale(nextScale) {
  return Math.min(maxLogoScale, Math.max(minLogoScale, Math.round(nextScale * 100) / 100));
}

function setGridLogoScale(nextScale) {
  gridLogoScale = clampLogoScale(nextScale);
  document.documentElement.style.setProperty("--grid-logo-scale", String(gridLogoScale));
  updateGridColumns();
  scheduleLogoShaderMask();
}

function setFullscreenLogoScale(nextScale) {
  fullscreenLogoScale = clampLogoScale(nextScale);
  document.documentElement.style.setProperty("--fullscreen-logo-scale", String(fullscreenLogoScale));
  if (!dialog.open) return;
  if (lockupMode) {
    scheduleLockupLayout();
  } else {
    mountFullscreenShader();
  }
}

function resizeActiveLogoView(delta) {
  if (dialog.open) {
    setFullscreenLogoScale(fullscreenLogoScale + delta);
  } else {
    setGridLogoScale(gridLogoScale + delta);
  }
}

updateGridColumns();

function selectedFontFamily() {
  return lockupFontFamilies[selectedFont] ?? lockupFontFamilies.Helvetica;
}

function lockupMarkup(id) {
  return `<div class="fullscreen-lockup" aria-hidden="true">
    <span class="fullscreen-logo-art fullscreen-lockup-mark">${logoMarkup(id)}</span>
    <span class="fullscreen-lockup-text">${lockupText}</span>
  </div>`;
}

function fullscreenMarkup(id) {
  return lockupMode
    ? lockupMarkup(id)
    : `<span class="fullscreen-logo-art" aria-hidden="true">${logoMarkup(id)}</span>`;
}

function measureLockupText(fontSize, fontFamily) {
  const context = lockupCanvas.getContext("2d");
  context.font = `700 ${fontSize}px ${fontFamily}`;
  const metrics = context.measureText(lockupText);
  const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  return {
    width: metrics.width,
    height: height || fontSize * 0.72,
  };
}

function cropLockupSvgToArtwork() {
  const svg = fullscreenLogo.querySelector(".fullscreen-lockup-mark svg");
  if (!svg) return 1;

  try {
    const box = svg.getBBox();
    if (box.width <= 0 || box.height <= 0) return 1;

    const padding = Math.max(box.width, box.height) * 0.035;
    const viewBoxWidth = box.width + padding * 2;
    const viewBoxHeight = box.height + padding * 2;
    svg.setAttribute("viewBox", [
      box.x - padding,
      box.y - padding,
      viewBoxWidth,
      viewBoxHeight,
    ].map((value) => Number(value.toFixed(2))).join(" "));
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    return viewBoxWidth / viewBoxHeight;
  } catch {
    // Some SVG states cannot be measured immediately; the default viewBox still renders safely.
    return 1;
  }
}

function updateLockupLayout() {
  if (!dialog.open || !lockupMode) return;

  const markAspect = cropLockupSvgToArtwork();

  const box = fullscreenLogo.getBoundingClientRect();
  if (!box.width || !box.height) return;

  const fontFamily = selectedFontFamily();
  const maxWidth = box.width * 0.9;
  const maxHeight = box.height * 0.62;
  let fontSize = Math.min(maxHeight, maxWidth * 0.28);

  for (let pass = 0; pass < 5; pass += 1) {
    const textMetrics = measureLockupText(fontSize, fontFamily);
    const markHeight = fontSize * 1.02;
    const markWidth = markHeight * markAspect;
    const gap = Math.min(84, Math.max(22, fontSize * 0.27));
    const totalWidth = markWidth + gap + textMetrics.width;
    const totalHeight = Math.max(markHeight, fontSize);
    const scale = Math.min(1, maxWidth / totalWidth, maxHeight / totalHeight);

    fontSize *= scale;
  }

  const textMetrics = measureLockupText(fontSize, fontFamily);
  const markHeight = fontSize * 1.02;
  const markWidth = markHeight * markAspect;
  const gap = Math.min(84, Math.max(22, fontSize * 0.27));

  document.documentElement.style.setProperty("--lockup-font-family", fontFamily);
  document.documentElement.style.setProperty("--lockup-font-size", `${fontSize.toFixed(2)}px`);
  document.documentElement.style.setProperty("--lockup-mark-height", `${markHeight.toFixed(2)}px`);
  document.documentElement.style.setProperty("--lockup-mark-width", `${markWidth.toFixed(2)}px`);
  document.documentElement.style.setProperty("--lockup-gap", `${gap.toFixed(2)}px`);
}

function scheduleLockupLayout() {
  window.requestAnimationFrame(() => {
    updateLockupLayout();
    if (dialog.open && lockupMode && currentShaderIndex >= 0) mountFullscreenShader();
    document.fonts?.ready?.then(() => {
      updateLockupLayout();
      if (dialog.open && lockupMode && currentShaderIndex >= 0) mountFullscreenShader();
    });
  });
}

function renderFullscreenLogo() {
  fullscreenLogo.classList.toggle("is-lockup", lockupMode);
  fullscreenLogo.innerHTML = fullscreenMarkup(currentLogoId);
  fullscreenLogo.setAttribute(
    "aria-label",
    lockupMode
      ? `EEG logo exploration ${currentLogoId} lockup with EEG text`
      : `EEG logo exploration ${currentLogoId}`,
  );

  if (lockupMode) {
    disposeFullscreenShader();
    updateLockupLayout();
    scheduleLockupLayout();
    if (currentShaderIndex >= 0) mountFullscreenShader();
  } else if (dialog.open) {
    mountFullscreenShader();
  }
}

function setLockupMode(enabled) {
  lockupMode = enabled;
  if (dialog.open) renderFullscreenLogo();
}

function toggleLockupMode() {
  setLockupMode(!lockupMode);
}

function showLogoById(id) {
  currentLogoId = logoId(id);
  renderFullscreenLogo();
}

function showAdjacentLogo(offset) {
  const order = tileOrder();
  const position = order.indexOf(currentLogoId);
  const nextPosition = ((position + offset) % order.length + order.length) % order.length;
  showLogoById(Number(order[nextPosition]));
}

function openLogoDialog(id) {
  document.activeElement?.blur?.();
  lockupMode = false;
  showLogoById(id);
  dialog.showModal();
  dialog.focus({ preventScroll: true });
  mountFullscreenShader();
}

logoOrder.forEach((id, position) => {
  const tile = document.createElement("figure");
  const button = document.createElement("button");
  const logo = document.createElement("span");

  tile.className = "logo-tile";
  tile.dataset.logoIndex = String(id);
  tile.dataset.logoId = logoId(id);
  tile.dataset.sortIndex = String(position);
  button.className = "logo-button";
  button.type = "button";
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `Fullscreen EEG logo exploration ${logoId(id)}`);
  logo.className = "logo-art";
  logo.setAttribute("aria-hidden", "true");
  logo.innerHTML = logoMarkup(id);

  button.addEventListener("click", (event) => {
    if (suppressNextClick) {
      event.preventDefault();
      suppressNextClick = false;
      return;
    }

    if (event.shiftKey) {
      event.preventDefault();
      tile.classList.toggle("is-selected");
      button.setAttribute("aria-pressed", String(tile.classList.contains("is-selected")));
      setStatus(`${grid.querySelectorAll(".is-selected").length} selected`);
      return;
    }

    openLogoDialog(id);
  });

  button.append(logo);
  tile.append(button);
  grid.append(tile);
});

function tileOrder() {
  return [...grid.querySelectorAll(".logo-tile")].map((tile) => tile.dataset.logoId);
}

function setStatus() {
}

function closeFontPicker() {
  settingsFontOptions.hidden = true;
  settingsFontButton.setAttribute("aria-expanded", "false");
}

function toggleFontPicker() {
  const nextOpen = settingsFontOptions.hidden;
  settingsFontOptions.hidden = !nextOpen;
  settingsFontButton.setAttribute("aria-expanded", String(nextOpen));
}

function closeSettingsPopover() {
  closeFontPicker();
  settingsPopover.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
}

function toggleSettingsPopover() {
  const nextOpen = settingsPopover.hidden;
  settingsPopover.hidden = !nextOpen;
  settingsButton.setAttribute("aria-expanded", String(nextOpen));
}

function clearSelection() {
  const selectedTiles = grid.querySelectorAll(".logo-tile.is-selected");
  if (!selectedTiles.length) return;

  selectedTiles.forEach((tile) => {
    tile.classList.remove("is-selected");
    tile.querySelector(".logo-button").setAttribute("aria-pressed", "false");
  });
  setStatus("Selection cleared");
}

function insertionAnchorFromPreview(x, y) {
  const stationaryTiles = [...grid.querySelectorAll(".logo-tile:not(.is-dragging)")];
  const firstTile = stationaryTiles[0] ?? draggedTiles[0];
  if (!firstTile || !dragPreview) return null;

  const gridBox = grid.getBoundingClientRect();
  const tileBox = firstTile.getBoundingClientRect();
  const tileWidth = tileBox.width;
  const tileHeight = tileBox.height;
  const previewWidth = Number(dragPreview.dataset.width);
  const previewHeight = Number(dragPreview.dataset.height);
  const preview = {
    left: x - previewWidth / 2,
    right: x + previewWidth / 2,
    top: y - previewHeight / 2,
    bottom: y + previewHeight / 2,
  };
  const dx = x - pointerDrag.lastX;
  const dy = y - pointerDrag.lastY;
  const edgeBias = 0.22;
  const useHorizontalEdge = Math.abs(dx) >= Math.abs(dy);
  const useVerticalEdge = Math.abs(dy) > Math.abs(dx);
  const slotX = useHorizontalEdge
    ? (dx >= 0 ? preview.right - tileWidth * edgeBias : preview.left + tileWidth * edgeBias)
    : x;
  const slotY = useVerticalEdge
    ? (dy >= 0 ? preview.bottom - tileHeight * edgeBias : preview.top + tileHeight * edgeBias)
    : y;
  const columns = Math.max(1, Math.round(gridBox.width / tileWidth));
  const rows = Math.ceil((stationaryTiles.length + draggedTiles.length) / columns);
  const column = Math.max(0, Math.min(columns - 1, Math.floor((slotX - gridBox.left) / tileWidth)));
  const row = Math.max(0, Math.min(rows - 1, Math.floor((slotY - gridBox.top) / tileHeight)));
  const insertionIndex = Math.max(0, Math.min(stationaryTiles.length, row * columns + column));

  return stationaryTiles[insertionIndex] ?? null;
}

function updateDragPreview(x, y) {
  if (!dragPreview) return;

  const width = Number(dragPreview.dataset.width);
  const height = Number(dragPreview.dataset.height);
  dragPreview.style.transform = `translate3d(${x - width / 2}px, ${y - height / 2}px, 0)`;
}

function createDragPreview(tile, x, y) {
  const box = tile.getBoundingClientRect();
  const clone = tile.cloneNode(true);
  dragPreview = document.createElement("div");

  clone.classList.remove("is-dragging", "is-drop-target");
  clone.querySelector(".logo-button")?.setAttribute("tabindex", "-1");

  dragPreview.className = "drag-preview";
  dragPreview.dataset.width = String(box.width);
  dragPreview.dataset.height = String(box.height);
  dragPreview.style.width = `${box.width}px`;
  dragPreview.style.height = `${box.height}px`;

  if (draggedTiles.length > 1) {
    dragPreview.dataset.count = String(draggedTiles.length);
  }

  dragPreview.append(clone);
  document.body.append(dragPreview);
  updateDragPreview(x, y);
}

function removeDragPreview() {
  dragPreview?.remove();
  dragPreview = null;
}

function startReorderDrag(tile, x, y) {
  draggedTile = tile;
  draggedTiles = tile.classList.contains("is-selected")
    ? [...grid.querySelectorAll(".logo-tile.is-selected")]
    : [tile];
  draggedTiles.forEach((selectedTile) => selectedTile.classList.add("is-dragging"));
  document.body.classList.add("is-reordering");
  createDragPreview(tile, x, y);
}

function moveDraggedTiles(x, y) {
  if (!draggedTile) return;

  const anchor = insertionAnchorFromPreview(x, y);
  grid.querySelectorAll(".is-drop-target").forEach((tile) => tile.classList.remove("is-drop-target"));

  if (anchor) {
    anchor.classList.add("is-drop-target");
    draggedTiles.forEach((tile) => grid.insertBefore(tile, anchor));
  } else {
    draggedTiles.forEach((tile) => grid.append(tile));
  }
  scheduleLogoShaderMask();
  schedulePerIconShaderSync();
}

function finishReorderDrag() {
  draggedTiles.forEach((tile) => tile.classList.remove("is-dragging"));
  grid.querySelectorAll(".is-drop-target").forEach((tile) => tile.classList.remove("is-drop-target"));
  document.body.classList.remove("is-reordering");
  removeDragPreview();
  draggedTile = null;
  draggedTiles = [];
  scheduleLogoShaderMask();
  schedulePerIconShaderSync();
}

grid.addEventListener("pointerdown", (event) => {
  const tile = event.target.closest(".logo-tile");
  if (!tile || event.button !== 0 || event.shiftKey || dialog.open) return;

  if (!tile.classList.contains("is-selected")) {
    clearSelection();
  }

  pointerDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    tile,
    started: false,
  };
  tile.setPointerCapture(event.pointerId);
});

grid.addEventListener("pointermove", (event) => {
  if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;

  const distance = Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY);
  if (!pointerDrag.started && distance > 6) {
    pointerDrag.started = true;
    suppressNextClick = true;
    startReorderDrag(pointerDrag.tile, event.clientX, event.clientY);
  }

  if (pointerDrag.started) {
    event.preventDefault();
    updateDragPreview(event.clientX, event.clientY);
    moveDraggedTiles(event.clientX, event.clientY);
    pointerDrag.lastX = event.clientX;
    pointerDrag.lastY = event.clientY;
  }
});

function endPointerDrag(event) {
  if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;

  if (pointerDrag.started) {
    event.preventDefault();
    finishReorderDrag();
    window.setTimeout(() => {
      suppressNextClick = false;
    }, 0);
  } else if (event.type === "pointerup" && !event.shiftKey) {
    event.preventDefault();
    suppressNextClick = true;
    openLogoDialog(pointerDrag.tile.dataset.logoId);
    window.setTimeout(() => {
      suppressNextClick = false;
    }, 0);
  }

  pointerDrag = null;
}

grid.addEventListener("pointerup", endPointerDrag);
grid.addEventListener("pointercancel", endPointerDrag);

function randomizeLogoOrder() {
  const tiles = [...grid.querySelectorAll(".logo-tile")];

  for (let index = tiles.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [tiles[index], tiles[swapIndex]] = [tiles[swapIndex], tiles[index]];
  }

  tiles.forEach((tile) => grid.append(tile));
  clearSelection();
  scheduleLogoShaderMask();
  schedulePerIconShaderSync();
  setStatus("Randomized order");
}

shuffleButton.addEventListener("click", randomizeLogoOrder);

document.addEventListener("pointerdown", (event) => {
  if (!settingsPopover.hidden && !event.target.closest(".utility-dock")) {
    closeSettingsPopover();
  }

  if (event.shiftKey) return;
  if (dialog.open) return;
  if (event.target.closest(".logo-tile.is-selected")) return;

  clearSelection();
});

function closeDialog() {
  disposeFullscreenShader();
  dialog.close();
  document.activeElement?.blur?.();
  lockupMode = false;
  fullscreenLogo.classList.remove("is-lockup");
  fullscreenLogo.innerHTML = "";
  fullscreenLogo.setAttribute("aria-label", "");
}

closeButton.addEventListener("click", closeDialog);

[closeButton, previousButton, nextButton].forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
  });
});

previousButton.addEventListener("click", () => {
  showAdjacentLogo(-1);
  dialog.focus({ preventScroll: true });
});

nextButton.addEventListener("click", () => {
  showAdjacentLogo(1);
  dialog.focus({ preventScroll: true });
});

dialog.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    toggleLockupMode();
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showAdjacentLogo(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showAdjacentLogo(1);
  }
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

dialog.addEventListener("cancel", () => {
  disposeFullscreenShader();
  lockupMode = false;
  fullscreenLogo.classList.remove("is-lockup");
  fullscreenLogo.innerHTML = "";
  fullscreenLogo.setAttribute("aria-label", "");
});

const commonShaderSizing = {
  u_fit: ShaderFitOptions.cover,
  u_scale: 1,
  u_rotation: 0,
  u_originX: 0.5,
  u_originY: 0.5,
  u_offsetX: 0,
  u_offsetY: 0,
  u_worldWidth: 0,
  u_worldHeight: 0,
};

const shaderPresets = [
  {
    label: "Gem Smoke - Fire",
    perIcon: true,
    logoTexture: "logo",
    fragment: gemSmokeFragmentShader,
    speed: 0.36,
    uniforms: (palette, image) => ({
      ...commonShaderSizing,
      u_image: image,
      u_colorBack: shaderColor(palette.paper, 0),
      u_colors: shaderColors(["#270a05", "#c42a12", "#ff8f21", "#ffe66f"]),
      u_colorsCount: 4,
      u_innerDistortion: 0.66,
      u_outerDistortion: 0.28,
      u_outerGlow: 0.34,
      u_innerGlow: 0.86,
      u_colorInner: shaderColor("#fff2a8", 0.18),
      u_offset: 0.14,
      u_angle: 286,
      u_size: 0.66,
      u_shape: GemSmokeShapes.none,
      u_isImage: true,
    }),
    mipmaps: ["u_image"],
  },
  {
    label: "Gem Smoke - Infrared",
    perIcon: true,
    logoTexture: "logo",
    fragment: gemSmokeFragmentShader,
    speed: 0.3,
    uniforms: (palette, image) => ({
      ...commonShaderSizing,
      u_image: image,
      u_colorBack: shaderColor(palette.paper, 0),
      u_colors: shaderColors(["#050022", "#31007a", "#d01889", "#ff4020", "#ffd14f"]),
      u_colorsCount: 5,
      u_innerDistortion: 0.58,
      u_outerDistortion: 0.26,
      u_outerGlow: 0.32,
      u_innerGlow: 0.82,
      u_colorInner: shaderColor("#ff6a2a", 0.14),
      u_offset: 0.04,
      u_angle: 206,
      u_size: 0.62,
      u_shape: GemSmokeShapes.none,
      u_isImage: true,
    }),
    mipmaps: ["u_image"],
  },
  {
    label: "Liquid Metal - Noir",
    perIcon: true,
    logoTexture: "logo",
    fragment: liquidMetalFragmentShader,
    speed: 0.28,
    uniforms: (palette, image) => ({
      ...commonShaderSizing,
      u_image: image,
      u_colorBack: shaderColor(palette.paper, 0),
      u_colorTint: shaderColor(mixColors(palette.ink, "#050505", 0.44), 0.86),
      u_repetition: 3.4,
      u_shiftRed: 0.02,
      u_shiftBlue: -0.02,
      u_contour: 0.72,
      u_softness: 0.28,
      u_distortion: 0.34,
      u_angle: 72,
      u_shape: LiquidMetalShapes.none,
      u_isImage: true,
    }),
    mipmaps: ["u_image"],
  },
  {
    label: "Heatmap - Default",
    perIcon: true,
    logoTexture: "heatmap",
    fragment: heatmapFragmentShader,
    speed: 0.34,
    uniforms: (palette, image) => ({
      ...commonShaderSizing,
      u_image: image,
      u_colorBack: shaderColor(palette.paper, 0),
      u_colors: shaderColors([
        mixColors(palette.paper, "#2e5bff", 0.7),
        "#37d9ff",
        "#fff466",
        mixColors(palette.ink, "#ff3b20", 0.38),
      ]),
      u_colorsCount: 4,
      u_contour: 0.62,
      u_angle: 38,
      u_noise: 0.16,
      u_innerGlow: 0.68,
      u_outerGlow: 0.26,
    }),
    mipmaps: ["u_image"],
  },
  {
    label: "Halftone Dots - LED Screen",
    fragment: halftoneDotsFragmentShader,
    speed: 0,
    uniforms: (palette, image) => ({
      ...commonShaderSizing,
      u_image: image,
      u_colorBack: shaderColor(mixColors(palette.paper, "#050505", 0.18)),
      u_colorFront: shaderColor(palette.ink),
      u_originalColors: false,
      u_type: HalftoneDotsTypes.classic,
      u_inverted: false,
      u_grid: HalftoneDotsGrids.square,
      u_size: 0.14,
      u_radius: 0.72,
      u_contrast: 0.72,
      u_grainMixer: 0.04,
      u_grainOverlay: 0.02,
      u_grainSize: 0.22,
    }),
    mipmaps: ["u_image"],
  },
  {
    label: "Halftone CMYK",
    fragment: halftoneCmykFragmentShader,
    speed: 0,
    uniforms: (palette, image, noiseTexture) => ({
      ...commonShaderSizing,
      u_image: image,
      u_noiseTexture: noiseTexture,
      u_colorBack: shaderColor(palette.paper),
      u_colorC: shaderColor(mixColors(palette.paper, "#00b3ff", 0.78), 0.54),
      u_colorM: shaderColor(mixColors(palette.ink, "#fc4f9d", 0.42), 0.44),
      u_colorY: shaderColor(mixColors(palette.paper, "#ffd900", 0.72), 0.36),
      u_colorK: shaderColor(palette.ink, 0.74),
      u_size: 0.18,
      u_gridNoise: 0.22,
      u_type: HalftoneCmykTypes.ink,
      u_softness: 0.72,
      u_contrast: 1.1,
      u_floodC: 0.08,
      u_floodM: 0,
      u_floodY: 0.06,
      u_floodK: 0.02,
      u_gainC: 0.2,
      u_gainM: 0.05,
      u_gainY: 0.14,
      u_gainK: 0.18,
      u_grainMixer: 0.08,
      u_grainOverlay: 0.05,
      u_grainSize: 0.52,
    }),
    mipmaps: ["u_image"],
  },
  {
    label: "Halftone CMYK - Drops",
    fragment: halftoneCmykFragmentShader,
    speed: 0,
    uniforms: (palette, image, noiseTexture) => ({
      ...commonShaderSizing,
      u_image: image,
      u_noiseTexture: noiseTexture,
      u_colorBack: shaderColor(palette.paper),
      u_colorC: shaderColor(mixColors(palette.paper, "#00a9d6", 0.72), 0.5),
      u_colorM: shaderColor(mixColors(palette.ink, "#d84283", 0.38), 0.42),
      u_colorY: shaderColor(mixColors(palette.paper, "#ffd34f", 0.68), 0.4),
      u_colorK: shaderColor(palette.ink, 0.7),
      u_size: 0.24,
      u_gridNoise: 0.58,
      u_type: HalftoneCmykTypes.ink,
      u_softness: 0.88,
      u_contrast: 0.92,
      u_floodC: 0.12,
      u_floodM: 0.06,
      u_floodY: 0.12,
      u_floodK: 0.02,
      u_gainC: 0.26,
      u_gainM: 0.1,
      u_gainY: 0.22,
      u_gainK: 0.12,
      u_grainMixer: 0.28,
      u_grainOverlay: 0.08,
      u_grainSize: 0.66,
    }),
    mipmaps: ["u_image"],
  },
  {
    label: "Halftone CMYK - Vintage",
    fragment: halftoneCmykFragmentShader,
    speed: 0,
    uniforms: (palette, image, noiseTexture) => ({
      ...commonShaderSizing,
      u_image: image,
      u_noiseTexture: noiseTexture,
      u_colorBack: shaderColor(mixColors(palette.paper, "#ead2a2", 0.46)),
      u_colorC: shaderColor("#256b7f", 0.28),
      u_colorM: shaderColor("#9c3651", 0.26),
      u_colorY: shaderColor("#d8a43d", 0.34),
      u_colorK: shaderColor(mixColors(palette.ink, "#3a2418", 0.34), 0.76),
      u_size: 0.2,
      u_gridNoise: 0.3,
      u_type: HalftoneCmykTypes.sharp,
      u_softness: 0.62,
      u_contrast: 1.18,
      u_floodC: -0.04,
      u_floodM: 0.02,
      u_floodY: 0.1,
      u_floodK: 0.04,
      u_gainC: 0.02,
      u_gainM: 0.06,
      u_gainY: 0.18,
      u_gainK: 0.24,
      u_grainMixer: 0.22,
      u_grainOverlay: 0.16,
      u_grainSize: 0.88,
    }),
    mipmaps: ["u_image"],
  },
];

function shaderColor(color, alpha = 1) {
  const [r, g, b] = getShaderColorFromString(parseColor(color));
  return [r, g, b, alpha];
}

function shaderColors(colors) {
  return colors.map((color) => shaderColor(color));
}

function mixColors(a, b, amount = 0.5) {
  const left = hexToRgb(parseColor(a));
  const right = hexToRgb(parseColor(b));
  return rgbToHex(left.map((channel, index) => {
    return channel + (right[index] - channel) * amount;
  }));
}

function paletteTextureImage(palette) {
  const size = 720;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const image = new Image();
  const stops = palette.gradientStops ?? [palette.paper, palette.paper];

  canvas.width = size;
  canvas.height = size;

  const gradient = context.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, stops[0]);
  gradient.addColorStop(1, stops[1]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  context.fillStyle = alphaColor(palette.ink, 0.1);
  for (let i = -size; i < size * 1.8; i += 74) {
    context.save();
    context.translate(i, size * 0.5);
    context.rotate(-0.38);
    context.fillRect(0, -size, 28, size * 2.2);
    context.restore();
  }

  context.strokeStyle = alphaColor(palette.ink, 0.16);
  context.lineWidth = 2;
  for (let y = 42; y < size; y += 86) {
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(size * 0.28, y - 24, size * 0.65, y + 26, size, y - 8);
    context.stroke();
  }

  for (let i = 0; i < 420; i += 1) {
    const radius = Math.random() * 1.8 + 0.4;
    context.fillStyle = alphaColor(i % 3 === 0 ? palette.paper : palette.ink, 0.08);
    context.beginPath();
    context.arc(Math.random() * size, Math.random() * size, radius, 0, Math.PI * 2);
    context.fill();
  }

  return new Promise((resolve) => {
    image.onload = () => resolve(image);
    image.src = canvas.toDataURL("image/png");
  });
}

function loadedNoiseTexture() {
  const image = getShaderNoiseTexture();
  if (!image) return Promise.resolve(undefined);
  if (image.complete && image.naturalWidth > 0) return Promise.resolve(image);

  return new Promise((resolve) => {
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => resolve(undefined), { once: true });
  });
}

let maskFrame = null;
let perIconFrame = null;

function scheduleLogoShaderMask() {
  if (currentShaderIndex < 0 || !shaderLayer?.classList.contains("is-active")) return;
  window.cancelAnimationFrame(maskFrame);
  maskFrame = window.requestAnimationFrame(updateLogoShaderMask);
}

function updateLogoShaderMask() {
  if (currentShaderIndex < 0 || !shaderLayer?.classList.contains("is-active")) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const visibleLogos = [...grid.querySelectorAll(".logo-art svg")]
    .map((svg) => ({ svg, box: svg.getBoundingClientRect() }))
    .filter(({ box }) => {
      return box.width > 0
        && box.height > 0
        && box.right >= 0
        && box.bottom >= 0
        && box.left <= width
        && box.top <= height;
    });

  if (!visibleLogos.length) {
    shaderLayer.style.webkitMaskImage = "";
    shaderLayer.style.maskImage = "";
    return;
  }

  const logoMarkup = visibleLogos.map(({ svg, box }) => {
    const scaleX = box.width / 1200;
    const scaleY = box.height / 1200;
    return `<g transform="translate(${box.left.toFixed(2)} ${box.top.toFixed(2)}) scale(${scaleX.toFixed(5)} ${scaleY.toFixed(5)})">${svg.innerHTML}</g>`;
  }).join("");
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <style>
      .logo-mask :is(path, polygon, polyline, rect, circle, ellipse) { fill: white !important; stroke: white !important; }
      .logo-mask line { stroke: white !important; }
      .logo-mask .cls-5 { fill: black !important; stroke: black !important; opacity: 1 !important; }
    </style>
    <defs>
      <mask id="logo-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
        <rect width="${width}" height="${height}" fill="black"/>
        <g class="logo-mask">${logoMarkup}</g>
      </mask>
    </defs>
    <rect width="${width}" height="${height}" fill="white" mask="url(#logo-mask)"/>
  </svg>`;
  const maskUrl = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;
  shaderLayer.style.webkitMaskImage = maskUrl;
  shaderLayer.style.maskImage = maskUrl;
}

function schedulePerIconShaderSync() {
  window.cancelAnimationFrame(perIconFrame);
}

function logoMaskUrl(tile) {
  const svg = tile.querySelector(".logo-art svg");
  return logoMaskUrlFromSvg(svg);
}

function logoMaskUrlFromSvg(svg) {
  if (!svg) return "";

  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <style>
      .logo-mask :is(path, polygon, polyline, rect, circle, ellipse) { fill: white !important; stroke: white !important; }
      .logo-mask line { stroke: white !important; }
      .logo-mask .cls-5 { fill: black !important; stroke: black !important; opacity: 1 !important; }
    </style>
    <defs>
      <mask id="logo-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
        <rect width="1200" height="1200" fill="black"/>
        <g class="logo-mask">${svg.innerHTML}</g>
      </mask>
    </defs>
    <rect width="1200" height="1200" fill="white" mask="url(#logo-mask)"/>
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;
}

function logoSourceUrl(tile) {
  const svg = tile.querySelector(".logo-art svg");
  return logoSourceUrlFromSvg(svg);
}

function logoSourceUrlFromSvg(svg) {
  if (!svg) return "";

  const sourceSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <style>
      .logo-mask :is(path, polygon, polyline, rect, circle, ellipse) { fill: white !important; stroke: white !important; opacity: 1 !important; }
      .logo-mask line { stroke: white !important; opacity: 1 !important; }
      .logo-mask .cls-5 { fill: black !important; stroke: black !important; opacity: 1 !important; }
    </style>
    <defs>
      <mask id="logo-source-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
        <rect width="1200" height="1200" fill="black"/>
        <g class="logo-mask">${svg.innerHTML}</g>
      </mask>
    </defs>
    <rect width="1200" height="1200" fill="black" mask="url(#logo-source-mask)"/>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(sourceSvg)}`;
}

function escapeSvgText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeSvgAttribute(value) {
  return escapeSvgText(value).replaceAll('"', "&quot;");
}

function lockupGeometry() {
  const mark = fullscreenLogo.querySelector(".fullscreen-lockup-mark");
  const svg = mark?.querySelector("svg");
  const text = fullscreenLogo.querySelector(".fullscreen-lockup-text");
  if (!svg || !text) return null;

  const fullBox = fullscreenLogo.getBoundingClientRect();
  const markBox = mark.getBoundingClientRect();
  const textBox = text.getBoundingClientRect();
  const textStyle = getComputedStyle(text);
  if (!fullBox.width || !fullBox.height || !markBox.width || !markBox.height || !textBox.width || !textBox.height) {
    return null;
  }

  const viewBox = (svg.getAttribute("viewBox") ?? "0 0 1200 1200").split(/\s+/).map(Number);
  const [viewX = 0, viewY = 0, viewWidth = 1200, viewHeight = 1200] = viewBox;

  return {
    fullWidth: fullBox.width,
    fullHeight: fullBox.height,
    svg,
    viewX,
    viewY,
    viewWidth,
    viewHeight,
    markX: markBox.left - fullBox.left,
    markY: markBox.top - fullBox.top,
    markWidth: markBox.width,
    markHeight: markBox.height,
    textX: textBox.left - fullBox.left + textBox.width / 2,
    textY: textBox.top - fullBox.top + textBox.height / 2,
    fontFamily: textStyle.fontFamily,
    fontSize: parseFloat(textStyle.fontSize) || parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--lockup-font-size")) || 160,
  };
}

function lockupMaskSvg(front = "white", back = "black") {
  const geometry = lockupGeometry();
  if (!geometry) return "";

  const iconScaleX = geometry.markWidth / geometry.viewWidth;
  const iconScaleY = geometry.markHeight / geometry.viewHeight;
  const iconTransform = `translate(${geometry.markX.toFixed(2)} ${geometry.markY.toFixed(2)}) scale(${iconScaleX.toFixed(6)} ${iconScaleY.toFixed(6)}) translate(${-geometry.viewX.toFixed(2)} ${-geometry.viewY.toFixed(2)})`;
  const safeFontFamily = escapeSvgAttribute(geometry.fontFamily);
  const safeText = escapeSvgText(lockupText);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${geometry.fullWidth}" height="${geometry.fullHeight}" viewBox="0 0 ${geometry.fullWidth} ${geometry.fullHeight}">
    <style>
      .lockup-mask :is(path, polygon, polyline, rect, circle, ellipse) { fill: ${front} !important; stroke: ${front} !important; opacity: 1 !important; }
      .lockup-mask line { stroke: ${front} !important; opacity: 1 !important; }
      .lockup-mask .cls-5 { fill: ${back} !important; stroke: ${back} !important; opacity: 1 !important; }
    </style>
    <rect width="100%" height="100%" fill="${back}"/>
    <g class="lockup-mask" transform="${iconTransform}">${geometry.svg.innerHTML}</g>
    <text x="${geometry.textX.toFixed(2)}" y="${geometry.textY.toFixed(2)}" fill="${front}" font-family="${safeFontFamily}" font-size="${geometry.fontSize.toFixed(2)}" font-weight="700" text-anchor="middle" dominant-baseline="central">${safeText}</text>
  </svg>`;
}

function lockupMaskUrl() {
  const maskSvg = lockupMaskSvg();
  return maskSvg ? `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")` : "";
}

function lockupSourceUrl() {
  const sourceSvg = lockupMaskSvg("black", "transparent");
  return sourceSvg ? `data:image/svg+xml,${encodeURIComponent(sourceSvg)}` : "";
}

function imageFromBlob(blob) {
  const url = URL.createObjectURL(blob);
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.addEventListener("load", () => {
      URL.revokeObjectURL(url);
      resolve(image);
    }, { once: true });
    image.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load processed logo image"));
    }, { once: true });
    image.src = url;
  });
}

function canvasToImage(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create logo texture"));
        return;
      }
      imageFromBlob(blob).then(resolve, reject);
    }, "image/png");
  });
}

function imageFromDataUrl(dataUrl, errorMessage = "Failed to load image") {
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => reject(new Error(errorMessage)), { once: true });
    image.src = dataUrl;
  });
}

function sourceLogoImage(tile) {
  return sourceLogoImageFromSvg(tile.querySelector(".logo-art svg"));
}

function sourceLogoImageFromSvg(svg) {
  return imageFromDataUrl(logoSourceUrlFromSvg(svg), "Failed to load logo SVG texture");
}

function sourceLockupImage() {
  const url = lockupSourceUrl();
  if (!url) return Promise.resolve(null);
  return imageFromDataUrl(url, "Failed to load lockup SVG texture");
}

function boxBlur(values, width, height, radius, passes = 1) {
  let source = values;

  for (let pass = 0; pass < passes; pass += 1) {
    const integral = new Float32Array((width + 1) * (height + 1));
    const output = new Float32Array(width * height);

    for (let y = 1; y <= height; y += 1) {
      let rowSum = 0;
      for (let x = 1; x <= width; x += 1) {
        rowSum += source[(y - 1) * width + x - 1];
        integral[y * (width + 1) + x] = integral[(y - 1) * (width + 1) + x] + rowSum;
      }
    }

    for (let y = 0; y < height; y += 1) {
      const y1 = Math.max(0, y - radius);
      const y2 = Math.min(height - 1, y + radius);
      for (let x = 0; x < width; x += 1) {
        const x1 = Math.max(0, x - radius);
        const x2 = Math.min(width - 1, x + radius);
        const area = (x2 - x1 + 1) * (y2 - y1 + 1);
        const a = integral[y1 * (width + 1) + x1];
        const b = integral[y1 * (width + 1) + x2 + 1];
        const c = integral[(y2 + 1) * (width + 1) + x1];
        const d = integral[(y2 + 1) * (width + 1) + x2 + 1];
        output[y * width + x] = (d - b - c + a) / area;
      }
    }

    source = output;
  }

  return source;
}

async function lightweightTextureFromImage(image, type) {
  const size = 192;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Failed to create logo texture context");

  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(image, 0, 0, size, size);

  const sourcePixels = ctx.getImageData(0, 0, size, size);
  const alpha = new Float32Array(size * size);
  for (let i = 0; i < alpha.length; i += 1) {
    alpha[i] = sourcePixels.data[i * 4 + 3] / 255;
  }

  const texture = ctx.createImageData(size, size);
  const output = texture.data;

  if (type === "heatmap") {
    const inverse = new Float32Array(alpha.length);
    for (let i = 0; i < alpha.length; i += 1) {
      inverse[i] = 1 - alpha[i];
    }

    const contour = boxBlur(inverse, size, size, 2, 1);
    const outerBlur = boxBlur(inverse, size, size, 18, 2);
    const innerBlur = boxBlur(inverse, size, size, 6, 2);

    for (let i = 0; i < alpha.length; i += 1) {
      const px = i * 4;
      output[px] = contour[i] * 255;
      output[px + 1] = outerBlur[i] * 255;
      output[px + 2] = innerBlur[i] * 255;
      output[px + 3] = 255;
    }
  } else {
    const softMask = boxBlur(alpha, size, size, 10, 2);

    for (let i = 0; i < alpha.length; i += 1) {
      const px = i * 4;
      output[px] = (1 - softMask[i]) * 255;
      output[px + 1] = alpha[i] * 255;
      output[px + 2] = 255;
      output[px + 3] = 255;
    }
  }

  ctx.putImageData(texture, 0, 0);
  return canvasToImage(canvas);
}

async function lightweightLogoTexture(sourceElement, type) {
  const svg = sourceElement?.matches?.("svg") ? sourceElement : sourceElement?.querySelector?.("svg");
  const image = await sourceLogoImageFromSvg(svg);
  return lightweightTextureFromImage(image, type);
}

async function lightweightLockupTexture(type) {
  const image = await sourceLockupImage();
  if (!image) return null;
  return lightweightTextureFromImage(image, type);
}

async function processedLogoImage(tile, preset) {
  if (!preset.logoTexture) return null;

  const cacheKey = `${preset.logoTexture}:${tile.dataset.logoId}`;
  if (!perIconLogoImageCache.has(cacheKey)) {
    perIconLogoImageCache.set(cacheKey, lightweightLogoTexture(tile, preset.logoTexture));
  }

  return perIconLogoImageCache.get(cacheKey);
}

async function fullscreenShaderImage(preset) {
  const svg = fullscreenLogo.querySelector(".fullscreen-logo-art svg");
  if (!svg) return null;

  if (!preset.logoTexture) {
    return paletteTextureImage(currentPalette);
  }

  if (lockupMode) {
    return lightweightLockupTexture(preset.logoTexture);
  }

  const cacheKey = `${preset.logoTexture}:${currentLogoId}`;
  if (!perIconLogoImageCache.has(cacheKey)) {
    perIconLogoImageCache.set(cacheKey, lightweightLogoTexture(svg, preset.logoTexture));
  }

  return perIconLogoImageCache.get(cacheKey);
}

function disposeFullscreenShader() {
  shaderToken += 1;
  fullscreenShaderMount?.dispose();
  fullscreenShaderMount = null;
  fullscreenLogo.querySelector(".fullscreen-shader-layer")?.remove();
  fullscreenLogo.classList.remove("has-fullscreen-shader");
}

async function mountFullscreenShader() {
  fullscreenShaderMount?.dispose();
  fullscreenShaderMount = null;
  fullscreenLogo.querySelector(".fullscreen-shader-layer")?.remove();
  fullscreenLogo.classList.remove("has-fullscreen-shader");

  if (!dialog.open || currentShaderIndex < 0) return;

  const preset = shaderPresets[currentShaderIndex];
  const svg = fullscreenLogo.querySelector(".fullscreen-logo-art svg");
  if (!svg) return;

  const token = ++shaderToken;
  const [image, noiseTexture] = await Promise.all([
    fullscreenShaderImage(preset),
    loadedNoiseTexture(),
  ]);
  if (token !== shaderToken || !dialog.open || !image) return;

  const layer = document.createElement("div");
  layer.className = "fullscreen-shader-layer";
  const mask = lockupMode ? lockupMaskUrl() : logoMaskUrlFromSvg(svg);
  if (!mask) return;
  layer.style.webkitMaskImage = mask;
  layer.style.maskImage = mask;
  fullscreenLogo.append(layer);
  fullscreenLogo.classList.add("has-fullscreen-shader");

  try {
    fullscreenShaderMount = new ShaderMount(
      layer,
      preset.fragment,
      preset.uniforms(currentPalette, image, noiseTexture),
      { alpha: true, premultipliedAlpha: false },
      preset.speed,
      Math.random() * 12000,
      1,
      1600 * 1600,
      preset.mipmaps,
    );
  } catch (error) {
    layer.remove();
    fullscreenLogo.classList.remove("has-fullscreen-shader");
    console.error("Failed to mount fullscreen shader", error);
  }
}

function visibleTiles() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  return [...grid.querySelectorAll(".logo-tile")].filter((tile) => {
    const box = tile.getBoundingClientRect();
    return box.width > 0
      && box.height > 0
      && box.right >= 0
      && box.bottom >= 0
      && box.left <= viewportWidth
      && box.top <= viewportHeight;
  });
}

function disposePerIconShader(tile) {
  const entry = perIconShaderMounts.get(tile);
  perIconShaderPending.delete(tile);
  if (!entry) return;

  entry.mount.dispose();
  entry.layer.remove();
  tile.classList.remove("has-logo-shader");
  perIconShaderMounts.delete(tile);
}

function disposePerIconShaders() {
  perIconShaderPending.clear();
  [...perIconShaderMounts.keys()].forEach(disposePerIconShader);
}

async function mountTileShader(tile, preset, image, noiseTexture, token) {
  disposePerIconShader(tile);
  if (token !== shaderToken) return;
  perIconShaderPending.add(tile);

  const logoImage = await processedLogoImage(tile, preset);
  if (token !== shaderToken || !logoImage) {
    perIconShaderPending.delete(tile);
    return;
  }

  const layer = document.createElement("div");
  layer.className = "logo-shader-layer";
  const mask = logoMaskUrl(tile);
  layer.style.webkitMaskImage = mask;
  layer.style.maskImage = mask;
  tile.append(layer);
  tile.classList.add("has-logo-shader");

  try {
    const mount = new ShaderMount(
      layer,
      preset.fragment,
      preset.uniforms(currentPalette, logoImage, noiseTexture),
      { alpha: true, premultipliedAlpha: false },
      preset.speed,
      Math.random() * 12000,
      1,
      320 * 320 * 2,
      preset.mipmaps,
    );
    perIconShaderMounts.set(tile, { mount, layer });
  } catch (error) {
    layer.remove();
    tile.classList.remove("has-logo-shader");
    throw error;
  } finally {
    perIconShaderPending.delete(tile);
  }
}

function syncPerIconShaders(preset, image, noiseTexture, token) {
  if (token !== shaderToken) return;

  const liveTiles = new Set(visibleTiles());
  [...perIconShaderMounts.keys()].forEach((tile) => {
    if (!liveTiles.has(tile)) disposePerIconShader(tile);
  });
  const missingTiles = [...liveTiles].filter((tile) => {
    return !perIconShaderMounts.has(tile) && !perIconShaderPending.has(tile);
  });

  missingTiles.slice(0, 6).forEach((tile) => {
    if (!perIconShaderMounts.has(tile) && !perIconShaderPending.has(tile)) {
      mountTileShader(tile, preset, image, noiseTexture, token).catch((error) => {
        perIconShaderPending.delete(tile);
        console.error("Failed to mount logo shader", error);
      });
    }
  });

  if (missingTiles.length > 6 && token === shaderToken) {
    window.requestAnimationFrame(() => {
      syncPerIconShaders(preset, image, noiseTexture, token);
    });
  }
}

function clearShaderMounts() {
  shaderMount?.dispose();
  shaderMount = null;
  if (shaderLayer) {
    shaderLayer.innerHTML = "";
    shaderLayer.classList.remove("is-active");
  }
  disposePerIconShaders();
}

async function mountShader(index) {
  clearShaderMounts();

  currentShaderIndex = ((index % shaderPresets.length) + shaderPresets.length) % shaderPresets.length;

  if (dialog.open) {
    await mountFullscreenShader();
  } else {
    disposeFullscreenShader();
  }
}

function resetShaderView() {
  currentShaderIndex = -1;
  shaderToken += 1;
  clearShaderMounts();
  if (shaderLayer) {
    shaderLayer.style.webkitMaskImage = "";
    shaderLayer.style.maskImage = "";
  }
  disposeFullscreenShader();
}

function setShaderCycleIndex(index) {
  if (index < 0) {
    resetShaderView();
    return;
  }

  mountShader(index);
}

function cycleShader(direction) {
  const optionCount = shaderPresets.length + 1;
  const currentOption = currentShaderIndex + 1;
  const nextOption = ((currentOption + direction) % optionCount + optionCount) % optionCount;
  setShaderCycleIndex(nextOption - 1);
}

function refreshShaderPalette() {
  if (currentShaderIndex >= 0) {
    mountShader(currentShaderIndex);
  }
}

window.addEventListener("beforeunload", () => {
  shaderMount?.dispose();
  fullscreenShaderMount?.dispose();
  disposePerIconShaders();
});

window.addEventListener("scroll", scheduleLogoShaderMask, { passive: true });
window.addEventListener("resize", () => {
  updateGridColumns();
  scheduleLogoShaderMask();
  if (dialog.open && lockupMode) scheduleLockupLayout();
});
window.addEventListener("scroll", schedulePerIconShaderSync, { passive: true });
window.addEventListener("resize", schedulePerIconShaderSync);

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function hslToHex(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s);
  const light = clamp(l);
  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - chroma / 2;
  const [r, g, b] = hue < 60
    ? [chroma, x, 0]
    : hue < 120
      ? [x, chroma, 0]
      : hue < 180
        ? [0, chroma, x]
        : hue < 240
          ? [0, x, chroma]
          : hue < 300
            ? [x, 0, chroma]
            : [chroma, 0, x];

  return rgbToHex([r + m, g + m, b + m].map((channel) => Math.round(channel * 255)));
}

function rgbToHex(rgb) {
  return `#${rgb.map((channel) => Math.round(clamp(channel / 255) * 255).toString(16).padStart(2, "0")).join("")}`;
}

function parseColor(color) {
  if (Array.isArray(color)) {
    if (color.length === 3 && color.every((value) => value <= 1)) {
      return rgbToHex(color.map((channel) => channel * 255));
    }

    if (color.length === 3) {
      return hslToHex(color[0], color[1], color[2]);
    }
  }

  const text = String(color).trim();
  if (text.startsWith("#")) return text;

  const hsl = text.match(/hsl\(\s*([-.+\d]+)(?:,|\s)\s*([-.+\d]+)%?(?:,|\s)\s*([-.+\d]+)%?\s*\)/i);
  if (hsl) return hslToHex(Number(hsl[1]), Number(hsl[2]) / 100, Number(hsl[3]) / 100);

  return "#111111";
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
}

function luminance(hex) {
  return hexToRgb(hex)
    .map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrastRatio(a, b) {
  const light = Math.max(luminance(a), luminance(b));
  const dark = Math.min(luminance(a), luminance(b));
  return (light + 0.05) / (dark + 0.05);
}

function alphaColor(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const recentPaletteKeys = [];
const recentPaletteSignatures = [];
const recentPaletteLimit = 72;

function paletteKey(palette) {
  return `${palette.ink}/${palette.paper}`;
}

function hueFromHex(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  if (max === r) return (((g - b) / delta) % 6 + 6) % 6 * 60;
  if (max === g) return ((b - r) / delta + 2) * 60;
  return ((r - g) / delta + 4) * 60;
}

function paletteSignature(palette) {
  const inkHue = Math.round(hueFromHex(palette.ink) / 30);
  const paperHue = Math.round(hueFromHex(palette.paper) / 30);
  const inkLum = Math.round(luminance(palette.ink) * 5);
  const paperLum = Math.round(luminance(palette.paper) * 5);
  return `${inkHue}:${inkLum}/${paperHue}:${paperLum}`;
}

function rememberPalette(palette) {
  recentPaletteKeys.unshift(paletteKey(palette));
  recentPaletteSignatures.unshift(paletteSignature(palette));
  recentPaletteKeys.splice(recentPaletteLimit);
  recentPaletteSignatures.splice(recentPaletteLimit);
}

function contrastPairs(colors, source) {
  const minimumLogoContrast = 1.85;
  const comfortableLogoContrast = 2.45;
  const normalized = [...new Set(colors.map(parseColor))];
  const candidates = [];
  let fallback = { ink: "#111111", paper: "#ffffff", ratio: 0, source };

  for (const ink of normalized) {
    for (const paper of normalized) {
      if (ink === paper) continue;
      const ratio = contrastRatio(ink, paper);
      if (ratio > fallback.ratio) {
        fallback = { ink, paper, ratio, source };
      }

      if (ratio >= minimumLogoContrast) {
        candidates.push({
          ink,
          paper,
          ratio,
          source,
          score: (ratio >= comfortableLogoContrast ? 1 : 0.35) + Math.random() * 3,
        });
      }
    }
  }

  if (candidates.length) return candidates;

  const seed = normalized[0] ?? "#ffffff";
  const blackRatio = contrastRatio("#111111", seed);
  const whiteRatio = contrastRatio("#ffffff", seed);
  return [blackRatio >= whiteRatio
    ? { ink: "#111111", paper: seed, ratio: blackRatio }
    : { ink: "#ffffff", paper: seed, ratio: whiteRatio }]
    .map((pair) => ({ ...pair, source, score: 0 }));
}

const paletteSources = [
  ["FettePalette", fettePaletteColors],
  ["RampenSau", rampensauColors],
  ["Poline", polineColors],
  ["RYBitten", rybittenColors],
  ["WildCard", wildCardColors],
];

function fettePaletteColors() {
  const ramp = generateRandomColorRamp({ total: 8 });
  return ramp.all.map((color) => colorToCSS(color, "hsl"));
}

function rampensauColors() {
  return generateColorRamp({ total: 16 }).map((color) => hslToHex(color[0], color[1], color[2]));
}

function polineColors() {
  return new Poline({ numPoints: Math.random() > 0.5 ? 3 : 4 }).colorsCSS;
}

function rybittenColors() {
  const baseHue = Math.random();
  return Array.from({ length: 18 }, (_, index) => {
    const hue = (baseHue + index / 18 + Math.random() * 0.045) % 1;
    const saturation = 0.45 + Math.random() * 0.45;
    const lightness = 0.08 + Math.random() * 0.86;
    return rgbToHex(rybHsl2rgb([hue, saturation, lightness]).map((channel) => channel * 255));
  });
}

function wildCardColors() {
  const base = Math.random() * 360;
  return Array.from({ length: 18 }, (_, index) => {
    const hue = base + index * (90 + Math.random() * 70);
    const saturation = 0.28 + Math.random() * 0.72;
    const lightness = 0.08 + Math.random() * 0.84;
    return hslToHex(hue, saturation, lightness);
  });
}

const standardPalettePairs = [
  ["#111111", "#f7f3ea"],
  ["#f7f3ea", "#111111"],
  ["#10233f", "#f4ead2"],
  ["#f4ead2", "#10233f"],
  ["#12352f", "#f6f0df"],
  ["#f6f0df", "#12352f"],
  ["#5a1020", "#f6d7d9"],
  ["#f6d7d9", "#5a1020"],
  ["#1e3f8f", "#dce8ff"],
  ["#dce8ff", "#1e3f8f"],
  ["#3b2416", "#f2dec3"],
  ["#f2dec3", "#3b2416"],
  ["#263238", "#eceff1"],
  ["#eceff1", "#263238"],
  ["#4a341f", "#ffd166"],
  ["#ffd166", "#4a341f"],
  ["#004d40", "#b2dfdb"],
  ["#b2dfdb", "#004d40"],
  ["#2b2d42", "#edf2f4"],
  ["#edf2f4", "#2b2d42"],
  ["#681313", "#fff1c7"],
  ["#fff1c7", "#681313"],
  ["#243b2f", "#d9c6a3"],
  ["#d9c6a3", "#243b2f"],
];

function standardPalette() {
  const shuffled = [...standardPalettePairs].sort(() => Math.random() - 0.5);
  const pair = shuffled.find(([ink, paper]) => {
    const palette = { ink, paper };
    return !recentPaletteKeys.includes(paletteKey(palette))
      && !recentPaletteSignatures.includes(paletteSignature(palette));
  }) ?? randomFrom(standardPalettePairs);
  const palette = {
    ink: pair[0],
    paper: pair[1],
    ratio: contrastRatio(pair[0], pair[1]),
    source: "Standard",
  };
  rememberPalette(palette);
  return palette;
}

function gradientPairs(colors, source) {
  const minimumLogoContrast = 2.1;
  const normalized = [...new Set(colors.map(parseColor))];
  const candidates = [];

  for (const start of normalized) {
    for (const end of normalized) {
      if (start === end) continue;
      const gradientContrast = contrastRatio(start, end);
      if (gradientContrast < 1.15) continue;

      for (const ink of ["#111111", "#ffffff", ...normalized]) {
        if (ink === start || ink === end) continue;
        const ratioStart = contrastRatio(ink, start);
        const ratioEnd = contrastRatio(ink, end);
        const ratio = Math.min(ratioStart, ratioEnd);

        if (ratio >= minimumLogoContrast) {
          candidates.push({
            ink,
            paper: start,
            gradientStops: [start, end],
            ratio,
            source,
            score: ratio + gradientContrast * 0.75 + Math.random() * 2.5,
          });
        }
      }
    }
  }

  return candidates;
}

function standardGradientPalette() {
  const pair = randomFrom(standardPalettePairs);
  const [start, end] = Math.random() > 0.5 ? pair : [...pair].reverse();
  const blackRatio = Math.min(contrastRatio("#111111", start), contrastRatio("#111111", end));
  const whiteRatio = Math.min(contrastRatio("#ffffff", start), contrastRatio("#ffffff", end));
  const palette = {
    ink: blackRatio >= whiteRatio ? "#111111" : "#ffffff",
    paper: start,
    gradientStops: [start, end],
    ratio: Math.max(blackRatio, whiteRatio),
    source: "Standard Gradient",
  };
  rememberPalette(palette);
  return palette;
}

function weightedRandom(items) {
  const total = items.reduce((sum, item) => sum + item.score, 0);
  let cursor = Math.random() * total;
  for (const item of items) {
    cursor -= item.score;
    if (cursor <= 0) return item;
  }
  return items.at(-1);
}

function randomPalette() {
  if (gradientMode) return randomGradientPalette();

  if (Math.random() < 0.24) {
    return standardPalette();
  }

  const candidates = [];

  for (let attempt = 0; attempt < 28; attempt += 1) {
    const source = randomFrom(paletteSources);
    candidates.push(...contrastPairs(source[1](), source[0]));
  }

  const fresh = candidates.filter((candidate) => {
    return !recentPaletteKeys.includes(paletteKey(candidate))
      && !recentPaletteSignatures.includes(paletteSignature(candidate));
  });
  const pool = fresh.length >= 12
    ? fresh
    : candidates.filter((candidate) => !recentPaletteKeys.includes(paletteKey(candidate)));
  const palette = weightedRandom(pool.length ? pool : candidates);
  rememberPalette(palette);
  return palette;
}

function randomGradientPalette() {
  if (Math.random() < 0.22) return standardGradientPalette();

  const candidates = [];
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const source = randomFrom(paletteSources);
    candidates.push(...gradientPairs(source[1](), `${source[0]} Gradient`));
  }

  const fresh = candidates.filter((candidate) => {
    return !recentPaletteKeys.includes(paletteKey(candidate))
      && !recentPaletteSignatures.includes(paletteSignature(candidate));
  });
  const palette = weightedRandom(fresh.length ? fresh : candidates) ?? standardGradientPalette();
  rememberPalette(palette);
  return palette;
}

function applyPalette(palette) {
  currentPalette = palette;
  document.documentElement.style.setProperty("--logo-ink", palette.ink);
  document.documentElement.style.setProperty("--logo-bg", palette.paper);
  if (gradientMode && palette.gradientStops) {
    const angle = Math.round(Math.random() * 360);
    document.documentElement.style.setProperty(
      "--logo-bg-paint",
      `linear-gradient(${angle}deg, ${palette.gradientStops[0]}, ${palette.gradientStops[1]})`,
    );
  } else {
    document.documentElement.style.setProperty("--logo-bg-paint", palette.paper);
  }
  document.documentElement.style.setProperty("--editor-mark-color", alphaColor(palette.ink, 0.36));
  refreshShaderPalette();
}

function toggleDefaultPalette() {
  const isInverted = currentPalette.ink.toLowerCase() === invertedPalette.ink
    && currentPalette.paper.toLowerCase() === invertedPalette.paper;
  applyPalette(isInverted ? defaultPalette : invertedPalette);
}

function setGradientMode(enabled) {
  gradientMode = enabled;
  settingsGradientToggle.checked = gradientMode;
  applyPalette(gradientMode
    ? randomGradientPalette()
    : defaultPalette);
}

settingsButton.addEventListener("click", toggleSettingsPopover);

settingsGradientToggle.addEventListener("change", () => {
  setGradientMode(settingsGradientToggle.checked);
});

settingsFontButton.addEventListener("click", toggleFontPicker);

function setSelectedFont(font) {
  selectedFont = font;
  settingsFontButton.textContent = font;
  settingsFontOptionButtons.forEach((option) => {
    option.setAttribute("aria-selected", String(option.dataset.font === font));
  });

  if (dialog.open && lockupMode) {
    updateLockupLayout();
    scheduleLockupLayout();
  }
}

settingsFontOptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setSelectedFont(button.dataset.font);
    closeFontPicker();
  });
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  if (event.key === "Escape" && !settingsPopover.hidden) {
    event.preventDefault();
    closeSettingsPopover();
    return;
  }

  const isTyping = target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
  if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;

  if (event.code === "Space") {
    event.preventDefault();
    applyPalette(randomPalette());
  }

  if (event.code === "ArrowDown") {
    event.preventDefault();
    cycleShader(1);
  }

  if (event.code === "ArrowUp") {
    event.preventDefault();
    cycleShader(-1);
  }

  if (event.code === "Enter") {
    event.preventDefault();
    resetShaderView();
    gradientMode = false;
    settingsGradientToggle.checked = false;
    toggleDefaultPalette();
  }

  if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    randomizeLogoOrder();
  }

  if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    resizeActiveLogoView(0.1);
  }

  if (event.key === "-" || event.key === "_") {
    event.preventDefault();
    resizeActiveLogoView(-0.1);
  }
});
