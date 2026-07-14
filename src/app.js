import { colorToCSS, generateRandomColorRamp } from "fettepalette";
import { generateColorRamp } from "rampensau";
import { Poline } from "poline";
import { rybHsl2rgb } from "rybitten";
import { createClient } from "@supabase/supabase-js";
import { coolshapePlaceholders } from "./coolshape-placeholders.js";
import { typefaces } from "./typefaces.js";
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
const favicon = document.querySelector("#favicon");
const logoSheet = document.querySelector(".logo-sheet");
const grid = document.querySelector("#logo-grid");
const uploadPanel = document.querySelector("#logo-upload");
const uploadEmpty = document.querySelector("#logo-upload-empty");
const typeUploadEmpty = document.querySelector("#type-upload-empty");
const uploadInput = document.querySelector("#logo-file-input");
const typeUploadInput = document.querySelector("#type-file-input");
const uploadButton = document.querySelector("#logo-file-button");
const typeUploadButton = document.querySelector("#type-file-button");
const placeholderButton = document.querySelector("#placeholder-button");
const typeExploreButton = document.querySelector("#type-explore-button");
const uploadAddButton = document.querySelector("#logo-add-button");
const uploadFeedback = document.querySelector("#upload-feedback");
const typeUploadFeedback = document.querySelector("#type-upload-feedback");
const dropOverlay = document.querySelector("#drop-overlay");
const dropOverlayTitle = document.querySelector("#drop-overlay-title");
const dropOverlayHint = document.querySelector("#drop-overlay-hint");
const shuffleButton = document.querySelector("#shuffle-button");
const infoButton = document.querySelector("#info-button");
const brandTabButtons = [...document.querySelectorAll(".brand-tab")];
const typeGrid = document.querySelector("#type-grid");
const colorGrid = document.querySelector("#color-grid");
const dialog = document.querySelector("#logo-dialog");
const infoDialog = document.querySelector("#info-dialog");
const fullscreenLogo = document.querySelector("#fullscreen-logo");
const closeButton = dialog.querySelector(".close-button");
const infoCloseButton = infoDialog.querySelector(".info-close-button");
const previousButton = dialog.querySelector(".nav-button--previous");
const nextButton = dialog.querySelector(".nav-button--next");
const defaultProjectId = "00000000-0000-4000-8000-000000000001";
const appConfig = window.EEG_SUPABASE_CONFIG ?? {};
const routePath = window.location.pathname.replace(/\/+$/, "") || "/";
const isAdminRoute = routePath === "/admin" || window.location.hash === "#admin";
const projectId = new URLSearchParams(window.location.search).get("project")
  || appConfig.projectId
  || defaultProjectId;
const supabaseUrl = String(appConfig.supabaseUrl || appConfig.url || "").trim();
const supabasePublishableKey = String(
  appConfig.supabasePublishableKey || appConfig.publishableKey || appConfig.anonKey || "",
).trim();
const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  })
  : null;
let session = null;
let currentProfile = null;
let canVote = false;
let clientVotes = new Map();
let adminVoteRows = [];
let statusElement = null;
let accessPanel = null;
let authForm = null;
let authMessage = null;
let clientBar = null;
let adminPanel = null;
let adminContent = null;
let exportCsvButton = null;
const uploadedLogos = new Map();
const reservedLogoIds = new Set();
let nextLogoNumber = 1;
let currentLogoId = "";
let activeFileReads = 0;
let dragDepth = 0;
let gridLogoScale = 1;
let fullscreenLogoScale = 1;
const defaultPalette = { ink: "#000000", paper: "#ffffff", ratio: 21, source: "Default" };
const invertedPalette = { ink: "#ffffff", paper: "#000000", ratio: 21, source: "Inverted" };
let currentPalette = defaultPalette;
let paletteBeforeColors = null;
let currentShaderIndex = -1;
let selectedFont = "Helvetica";
let activeBrandTab = "Colors";
let typeCatalogRevealed = false;
const uploadedTypefaces = [];
let activeFontReads = 0;
let lockupMode = false;
let shaderMount = null;
let fullscreenShaderMount = null;
const perIconShaderMounts = new Map();
const perIconLogoImageCache = new Map();
const perIconShaderPending = new Set();
const minLogoScale = 0.5;
const maxLogoScale = 1.5;
let shaderToken = 0;
const mobileDialogMedia = window.matchMedia("(max-width: 720px)");
let mobilePaletteTapCount = 0;
const mobileLogoSwipeDistance = 44;
const mobileLogoSwipeDrift = 70;
let mobileLogoSwipe = null;
let mobileGridLockupMode = false;
let suppressNextMobileLogoClick = false;
const lockupText = "EEG";
const lockupCanvas = document.createElement("canvas");
const colorCombinationCount = 720;
const colorRowGap = 72;
let colorCombinations = [];
const colorRowPool = new Map();
let colorGridWindow = { startIndex: -1, endIndex: -1, rowHeight: 0, rowStride: 0 };
let colorGridScrollRaf = 0;
let colorGridListenersBound = false;
const colorNameApi = "https://api.color.pizza/v1/";
const colorNameCache = new Map();
const colorNameInflight = new Map();
let colorDragSession = null;
const brandContentGap = 72;

function contentTopInset(tile, content) {
  if (!tile || !content) return 0;

  const tileRect = tile.getBoundingClientRect();
  const svg = content.matches?.("svg") ? content : content.querySelector?.("svg");

  if (svg instanceof SVGSVGElement) {
    try {
      const bbox = svg.getBBox();
      const ctm = svg.getScreenCTM();
      if (ctm && bbox.height > 0 && bbox.width > 0) {
        const point = svg.createSVGPoint();
        point.x = bbox.x;
        point.y = bbox.y;
        const screen = point.matrixTransform(ctm);
        return Math.max(0, screen.y - tileRect.top);
      }
    } catch {
      // Fall through to element bounds when the SVG is not rendered yet.
    }
  }

  return Math.max(0, content.getBoundingClientRect().top - tileRect.top);
}

function firstRowContentInset(container, tileSelector, contentSelector) {
  const tiles = [...container.querySelectorAll(tileSelector)];
  if (!tiles.length) return 0;

  const firstTop = tiles[0].getBoundingClientRect().top;
  const firstRow = tiles.filter((tile) => Math.abs(tile.getBoundingClientRect().top - firstTop) < 1);
  let minInset = Infinity;

  firstRow.forEach((tile) => {
    const content = tile.querySelector(contentSelector);
    const inset = contentTopInset(tile, content);
    if (inset < minInset) minInset = inset;
  });

  return Number.isFinite(minInset) ? minInset : 0;
}

function syncBrandGridOffset() {
  let inset = 0;

  if (activeBrandTab === "Logos" && !grid.hidden) {
    inset = firstRowContentInset(grid, ".logo-tile", ".logo-art svg, .logo-art");
  } else if (activeBrandTab === "Type" && !typeGrid.hidden) {
    inset = firstRowContentInset(typeGrid, ".type-tile", ".type-specimen");
  }

  const offset = Math.max(0, brandContentGap - inset);
  document.documentElement.style.setProperty("--brand-grid-offset", `${offset}px`);
}
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

function logoMarkup(id) {
  return uploadedLogos.get(logoId(id))?.markup ?? "";
}

function logoName(id) {
  return uploadedLogos.get(logoId(id))?.name ?? `Logo ${logoId(id)}`;
}

function logoFaviconHref(id) {
  const markup = logoMarkup(id);
  if (!markup) return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";

  const ink = parseColor(currentPalette.ink);
  const paper = parseColor(currentPalette.paper);
  const faviconScale = 2.4;
  const viewBox = markup.match(/\bviewBox="([^"]+)"/i)?.[1]
    ?.trim()
    .split(/\s+/)
    .map(Number);
  const [minX, minY, width, height] = viewBox?.length === 4 && viewBox.every(Number.isFinite)
    ? viewBox
    : [0, 0, 1200, 1200];
  const translateX = minX + (width * (1 - faviconScale)) / 2;
  const translateY = minY + (height * (1 - faviconScale)) / 2;
  const faviconTransform = `translate(${translateX} ${translateY}) scale(${faviconScale})`;
  const colorStyle = `
    <style>
      svg > path,
      svg > polygon,
      svg > polyline,
      svg > rect,
      svg > circle,
      svg > ellipse,
      svg > g path,
      svg > g polygon,
      svg > g polyline,
      svg > g rect,
      svg > g circle,
      svg > g ellipse {
        fill: ${ink} !important;
      }

      svg > line,
      svg > g line {
        stroke: ${ink} !important;
      }

      svg > g .cls-5 {
        fill: ${paper} !important;
      }
    </style>
  `;
  const faviconMarkup = markup
    .replace(/<svg\b([^>]*)>/, `<svg$1>${colorStyle}<g class="favicon-mark" transform="${faviconTransform}">`)
    .replace(/<\/svg>\s*$/, "</g></svg>");
  return `data:image/svg+xml,${encodeURIComponent(faviconMarkup)}`;
}

function updateFaviconForTopLogo() {
  const topLogoId = grid.querySelector(".logo-tile")?.dataset.logoId ?? "";
  favicon?.setAttribute("href", logoFaviconHref(topLogoId));
}

function isAdmin() {
  return currentProfile?.role === "admin";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createAccessUi() {
  accessPanel = document.createElement("section");
  accessPanel.className = "access-panel";
  accessPanel.hidden = true;
  accessPanel.innerHTML = `
    <div class="access-card">
      <form class="access-form" data-auth-form>
        <label>
          <span>Email</span>
          <input name="email" type="email" autocomplete="email" required />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" autocomplete="current-password" required />
        </label>
        <button type="submit">Log in</button>
      </form>
      <p class="access-message" data-auth-message role="status"></p>
    </div>
  `;

  clientBar = document.createElement("aside");
  clientBar.className = "client-status-region";
  clientBar.innerHTML = `
    <span data-client-status></span>
  `;

  adminPanel = document.createElement("section");
  adminPanel.className = "admin-panel";
  adminPanel.hidden = true;
  adminPanel.innerHTML = `
    <div class="admin-panel-header">
      <div>
        <p class="admin-kicker">Admin</p>
        <h2>Logo Rankings</h2>
      </div>
      <button class="admin-export" type="button">CSV</button>
    </div>
    <div class="admin-content"></div>
  `;

  document.body.prepend(accessPanel, clientBar, adminPanel);

  authForm = accessPanel.querySelector("[data-auth-form]");
  authMessage = accessPanel.querySelector("[data-auth-message]");
  statusElement = clientBar.querySelector("[data-client-status]");
  adminContent = adminPanel.querySelector(".admin-content");
  exportCsvButton = adminPanel.querySelector(".admin-export");

  authForm.addEventListener("submit", handleAuthSubmit);
  exportCsvButton.addEventListener("click", exportAdminCsv);
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
  if (activeBrandTab === "Type") requestAnimationFrame(() => updateTypeGridWindow(true));
  else requestAnimationFrame(syncBrandGridOffset);
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

const loadedTypefaceKeys = new Set();
const typeTilePool = new Map();
let typeGridWindow = {
  columns: 0,
  cellSize: 0,
  startIndex: -1,
  endIndex: -1,
};
let typeGridScrollRaf = 0;
let typeGridListenersBound = false;

function getTypefaces() {
  return uploadedTypefaces.length
    ? uploadedTypefaces.concat(typefaces)
    : typefaces;
}

function typefaceLoadKey(face) {
  return `${face.loader}:${face.id}:${face.weight}`;
}

function typefaceStylesheetUrl(face) {
  if (face.loader === "google") {
    const family = face.family.replace(/ /g, "+");
    return `https://fonts.googleapis.com/css2?family=${family}:wght@${face.weight}&display=swap`;
  }
  if (face.loader === "bunny") {
    return `https://fonts.bunny.net/css?family=${face.id}:${face.weight}`;
  }
  if (face.loader === "fontshare") {
    return `https://api.fontshare.com/v2/css?f[]=${encodeURIComponent(face.id)}@${face.weight}&display=swap`;
  }
  return "";
}

function ensureTypefaceLoaded(face) {
  const key = typefaceLoadKey(face);
  if (loadedTypefaceKeys.has(key)) {
    return document.fonts.load(`${face.weight} 48px "${face.family}"`).catch(() => undefined);
  }
  loadedTypefaceKeys.add(key);

  if (face.loader === "local") {
    return document.fonts.load(`${face.weight} 48px "${face.family}"`).catch(() => undefined);
  }

  if (face.loader === "fontsource") {
    const style = document.createElement("style");
    const url = `https://cdn.jsdelivr.net/fontsource/fonts/${face.id}@latest/${face.subset}-${face.weight}-normal.woff2`;
    style.textContent = `@font-face{font-family:"${face.family}";src:url("${url}") format("woff2");font-weight:${face.weight};font-style:normal;font-display:swap;}`;
    document.head.append(style);
    return document.fonts.load(`${face.weight} 48px "${face.family}"`).catch(() => undefined);
  }

  const href = typefaceStylesheetUrl(face);
  if (!href) return Promise.resolve();

  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    const finish = () => {
      document.fonts.load(`${face.weight} 48px "${face.family}"`).then(resolve, resolve);
    };
    link.addEventListener("load", finish);
    link.addEventListener("error", resolve);
    document.head.append(link);
  });
}

const typeInkCanvas = document.createElement("canvas");
const typeInkCtx = typeInkCanvas.getContext("2d");

function measureTypeInk(family, weight, fontSize, sample) {
  if (!typeInkCtx) return null;
  typeInkCtx.font = `${weight} ${fontSize}px "${family}", sans-serif`;
  const metrics = typeInkCtx.measureText(sample);
  const left = metrics.actualBoundingBoxLeft ?? 0;
  const right = metrics.actualBoundingBoxRight ?? metrics.width;
  const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.8;
  const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.2;
  const width = left + right;
  const height = ascent + descent;
  if (!(width > 0 && height > 0)) return null;
  // Ink bounds relative to a left-aligned baseline origin.
  return { left, right, ascent, descent, width, height };
}

function fitTypeTile(tile) {
  const face = tile.querySelector(".type-button");
  const specimen = tile.querySelector(".type-specimen");
  if (!face || !specimen) return;

  const outlineInset = 6;
  const styles = getComputedStyle(face);
  const padL = Number.parseFloat(styles.paddingLeft) || 0;
  const padR = Number.parseFloat(styles.paddingRight) || 0;
  const padT = Number.parseFloat(styles.paddingTop) || 0;
  const padB = Number.parseFloat(styles.paddingBottom) || 0;
  const availableWidth = Math.max(1, face.clientWidth - padL - padR);
  const availableHeight = Math.max(1, face.clientHeight - padT - padB);
  const family = specimen.dataset.fontFamily || "sans-serif";
  const weight = specimen.dataset.fontWeight || "400";
  const sample = specimen.textContent || lockupText;

  let fontSize = Math.min(availableHeight * 0.44, availableWidth * 0.4, 54);
  let ink = measureTypeInk(family, weight, fontSize, sample);

  if (ink) {
    const fit = Math.min(
      1,
      (availableWidth * 0.9) / ink.width,
      (availableHeight * 0.7) / ink.height,
    );
    if (fit < 1) fontSize *= fit;
  }

  specimen.style.fontSize = `${fontSize}px`;
  specimen.style.transform = "none";
  specimen.style.left = "0px";
  specimen.style.top = "0px";

  const range = document.createRange();
  range.selectNodeContents(specimen);
  const glyphRect = range.getBoundingClientRect();
  const faceRect = face.getBoundingClientRect();
  if (glyphRect.width > 0 && glyphRect.height > 0) {
    const inkCx = glyphRect.left + glyphRect.width / 2 - faceRect.left;
    const inkCy = glyphRect.top + glyphRect.height / 2 - faceRect.top;
    specimen.style.left = `${Math.round(face.clientWidth / 2 - inkCx)}px`;
    specimen.style.top = `${Math.round(face.clientHeight / 2 - inkCy)}px`;
  } else {
    specimen.style.left = "50%";
    specimen.style.top = "50%";
    specimen.style.transform = "translate(-50%, -50%)";
  }

  const tileRect = tile.getBoundingClientRect();
  const specimenRect = specimen.getBoundingClientRect();
  if (specimenRect.height > 0) {
    const gapTop = specimenRect.bottom - tileRect.top;
    const gapBottom = tileRect.height - outlineInset;
    tile.style.setProperty("--type-label-top", `${(gapTop + gapBottom) / 2}px`);
  }
}

function scheduleFitTypeTile(tile) {
  requestAnimationFrame(() => {
    fitTypeTile(tile);
    requestAnimationFrame(() => fitTypeTile(tile));
  });
}

function fitTypeSpecimens() {
  typeTilePool.forEach((tile) => fitTypeTile(tile));
  syncBrandGridOffset();
}

function typeGridColumns() {
  if (window.matchMedia("(max-width: 720px)").matches) return 2;
  return Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--grid-columns"),
    10,
  ) || gridColumnsForScale(gridLogoScale);
}

function measureTypeGridMetrics() {
  const faces = getTypefaces();
  const columns = Math.max(1, typeGridColumns());
  const width = typeGrid.clientWidth || logoSheet.clientWidth || window.innerWidth;
  const cellSize = width / columns;
  const rows = Math.ceil(faces.length / columns);
  return {
    columns,
    cellSize,
    rows,
    totalHeight: rows * cellSize,
  };
}

function positionTypeTile(tile, index, columns, cellSize) {
  tile.style.left = `${(index % columns) * cellSize}px`;
  tile.style.top = `${Math.floor(index / columns) * cellSize}px`;
  tile.style.width = `${cellSize}px`;
  tile.style.height = `${cellSize}px`;
}

function createTypeTile(face, index, columns, cellSize) {
  const tile = document.createElement("figure");
  const button = document.createElement("div");
  const specimen = document.createElement("span");

  tile.className = "type-tile";
  tile.dataset.fontName = face.family;
  tile.dataset.typeIndex = String(index);
  button.className = "type-button";
  specimen.className = "type-specimen";
  specimen.textContent = lockupText;
  specimen.dataset.fontFamily = face.family;
  specimen.dataset.fontWeight = String(face.weight);
  specimen.style.fontFamily = `"${face.family}", sans-serif`;
  specimen.style.fontWeight = String(face.weight);

  button.append(specimen);
  tile.append(button);
  positionTypeTile(tile, index, columns, cellSize);
  ensureTypefaceLoaded(face).then(() => scheduleFitTypeTile(tile));
  return tile;
}

function updateTypeGridWindow(force = false) {
  if (typeGrid.hidden || activeBrandTab !== "Type") return;

  const metrics = measureTypeGridMetrics();
  if (metrics.cellSize <= 0) return;

  typeGrid.style.height = `${metrics.totalHeight}px`;

  const rect = typeGrid.getBoundingClientRect();
  const buffer = metrics.cellSize * 3;
  const visibleTop = Math.max(0, -rect.top);
  const visibleBottom = visibleTop + window.innerHeight;
  const startRow = Math.max(0, Math.floor((visibleTop - buffer) / metrics.cellSize));
  const endRow = Math.min(
    metrics.rows - 1,
    Math.ceil((visibleBottom + buffer) / metrics.cellSize),
  );
  const faces = getTypefaces();
  const startIndex = startRow * metrics.columns;
  const endIndex = Math.min(faces.length, (endRow + 1) * metrics.columns);

  const sameWindow = !force
    && startIndex === typeGridWindow.startIndex
    && endIndex === typeGridWindow.endIndex
    && metrics.columns === typeGridWindow.columns
    && Math.abs(metrics.cellSize - typeGridWindow.cellSize) < 0.5;

  if (sameWindow) return;

  for (const [index, tile] of typeTilePool) {
    if (index < startIndex || index >= endIndex) {
      tile.remove();
      typeTilePool.delete(index);
    }
  }

  for (let index = startIndex; index < endIndex; index += 1) {
    const face = faces[index];
    if (!face) continue;

    let tile = typeTilePool.get(index);
    if (tile) {
      positionTypeTile(tile, index, metrics.columns, metrics.cellSize);
      continue;
    }

    tile = createTypeTile(face, index, metrics.columns, metrics.cellSize);
    typeTilePool.set(index, tile);
    typeGrid.append(tile);
  }

  typeGridWindow = {
    columns: metrics.columns,
    cellSize: metrics.cellSize,
    startIndex,
    endIndex,
  };

  requestAnimationFrame(fitTypeSpecimens);
}

function scheduleTypeGridWindow() {
  if (typeGridScrollRaf) return;
  typeGridScrollRaf = requestAnimationFrame(() => {
    typeGridScrollRaf = 0;
    updateTypeGridWindow();
  });
}

function bindTypeGridListeners() {
  if (typeGridListenersBound) return;
  typeGridListenersBound = true;
  window.addEventListener("scroll", scheduleTypeGridWindow, { passive: true });
}

function renderTypeGrid() {
  typeTilePool.clear();
  typeGrid.replaceChildren();
  typeGridWindow = { columns: 0, cellSize: 0, startIndex: -1, endIndex: -1 };
  bindTypeGridListeners();
  updateTypeGridWindow(true);
}

function buildColorCombinations() {
  const used = new Set();
  const combinations = [];

  for (let index = 0; index < colorCombinationCount; index += 1) {
    let combination = generateColorCombination();
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const key = combination.colors.join("/");
      if (!used.has(key)) {
        used.add(key);
        break;
      }
      combination = generateColorCombination();
    }
    combinations.push(combination);
  }

  return combinations;
}

function measureColorGridMetrics() {
  const width = colorGrid.clientWidth || logoSheet.clientWidth || window.innerWidth;
  const rowHeight = width / 4;
  const rowStride = rowHeight + colorRowGap;
  const totalHeight = colorCombinations.length > 0
    ? colorCombinations.length * rowHeight + Math.max(0, colorCombinations.length - 1) * colorRowGap
    : 0;
  return { width, rowHeight, rowStride, totalHeight };
}

function positionColorRow(row, index, rowHeight, rowStride) {
  row.style.top = `${index * rowStride}px`;
  row.style.height = `${rowHeight}px`;
}

function contrastLabelColor(background) {
  const hex = parseColor(background);
  return contrastRatio("#000000", hex) >= contrastRatio("#ffffff", hex) ? "#000000" : "#ffffff";
}

function formatHexColor(color) {
  return parseColor(color).toUpperCase();
}

function colorNameKey(color) {
  return parseColor(color).toLowerCase();
}

function applyColorNameToSwatch(swatch) {
  const key = swatch.dataset.colorHex;
  const title = swatch.querySelector(".color-swatch-title");
  if (!key || !title) return;
  const name = colorNameCache.get(key);
  if (name) title.textContent = name;
}

function updateSwatchesForColor(key) {
  const name = colorNameCache.get(key);
  if (!name) return;
  colorGrid.querySelectorAll(".color-swatch").forEach((swatch) => {
    if (swatch.dataset.colorHex === key) applyColorNameToSwatch(swatch);
  });
}

async function fetchColorNames(colors) {
  const keys = [...new Set(colors.map(colorNameKey))].filter((key) => !colorNameCache.has(key));
  if (!keys.length) return;

  for (let index = 0; index < keys.length; index += 100) {
    const chunk = keys.slice(index, index + 100);
    const batchKey = chunk.join(",");
    if (colorNameInflight.has(batchKey)) {
      await colorNameInflight.get(batchKey);
      continue;
    }

    const promise = (async () => {
      try {
        const values = chunk.map((key) => key.replace("#", "")).join(",");
        const response = await fetch(`${colorNameApi}?values=${encodeURIComponent(values)}`, {
          headers: {
            Accept: "application/json",
            "X-Referrer": "eeg-brand-playground",
          },
        });
        if (!response.ok) return;
        const data = await response.json();
        for (const entry of data.colors ?? []) {
          const key = colorNameKey(entry.requestedHex ?? entry.hex);
          if (entry.name) {
            colorNameCache.set(key, entry.name);
            updateSwatchesForColor(key);
          }
        }
      } finally {
        colorNameInflight.delete(batchKey);
      }
    })();

    colorNameInflight.set(batchKey, promise);
    await promise;
  }
}

function ensureColorNames(colors) {
  return fetchColorNames(colors).catch(() => undefined);
}

function prefetchVisibleColorNames(startIndex, endIndex) {
  const colors = [];
  for (let index = startIndex; index < endIndex; index += 1) {
    const combination = colorCombinations[index];
    if (combination) colors.push(...combination.colors);
  }
  ensureColorNames(colors);
}

function normalizeHexInput(value) {
  const text = String(value).trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(text)) {
    return `#${text.split("").map((char) => char + char).join("")}`.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(text)) {
    return `#${text}`.toLowerCase();
  }
  return null;
}

function rgbToHsv(rgb) {
  const channels = rgb.map((value) => value / 255);
  const max = Math.max(...channels);
  const min = Math.min(...channels);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === channels[0]) hue = ((channels[1] - channels[2]) / delta + (channels[1] < channels[2] ? 6 : 0)) / 6;
    else if (max === channels[1]) hue = ((channels[2] - channels[0]) / delta + 2) / 6;
    else hue = ((channels[0] - channels[1]) / delta + 4) / 6;
  }

  return {
    h: hue * 360,
    s: max === 0 ? 0 : delta / max,
    v: max,
  };
}

function hsvToHex(h, s, v) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s);
  const val = clamp(v);
  const chroma = val * sat;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = val - chroma;
  let rgb = [0, 0, 0];

  if (hue < 60) rgb = [chroma, x, 0];
  else if (hue < 120) rgb = [x, chroma, 0];
  else if (hue < 180) rgb = [0, chroma, x];
  else if (hue < 240) rgb = [0, x, chroma];
  else if (hue < 300) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];

  return rgbToHex(rgb.map((channel) => (channel + m) * 255));
}

function previewSwatchColor(swatch, color) {
  const normalized = parseColor(color);
  swatch.style.background = normalized;
  swatch.style.setProperty("--color-swatch-label", contrastLabelColor(normalized));
}

function updateSwatchDragPreview(session, color) {
  const normalized = parseColor(color);
  session.draftColor = normalized;
  session.hex.textContent = formatHexColor(normalized);
  previewSwatchColor(session.swatch, normalized);

  window.clearTimeout(session.nameTimer);
  session.nameTimer = window.setTimeout(() => {
    ensureColorNames([normalized]).then(() => {
      if (colorDragSession !== session) return;
      session.title.textContent = colorNameCache.get(colorNameKey(normalized)) ?? "";
    });
  }, 120);
}

function syncSwatchFromPointer(session, clientX, clientY) {
  const rect = session.swatch.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  session.s = clamp((clientX - rect.left) / rect.width);
  session.v = clamp(1 - (clientY - rect.top) / rect.height);
  updateSwatchDragPreview(session, hsvToHex(session.h, session.s, session.v));
}

function finishColorDrag(commit = true) {
  if (!colorDragSession) return;

  const session = colorDragSession;
  window.clearTimeout(session.nameTimer);
  document.removeEventListener("keydown", session.onKey, true);
  window.removeEventListener("scroll", session.onScroll, true);

  if (session.swatch.hasPointerCapture(session.pointerId)) {
    session.swatch.releasePointerCapture(session.pointerId);
  }

  if (commit) {
    applySwatchColor(session.swatch, session.row, session.swatchIndex, session.draftColor);
  } else {
    previewSwatchColor(session.swatch, session.originalColor);
    session.hex.textContent = formatHexColor(session.originalColor);
    applyColorNameToSwatch(session.swatch);
  }

  session.swatch.classList.remove("is-adjusting");
  colorDragSession = null;
}

function bindSwatchDragAdjust(swatch, row, swatchIndex) {
  swatch.style.touchAction = "none";

  swatch.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    if (event.target.closest(".color-swatch-hex")) return;
    if (colorDragSession) finishColorDrag(true);

    event.preventDefault();
    event.stopPropagation();
    setSwatchHexEditable(swatch.querySelector(".color-swatch-hex"), false);
    swatch.querySelector(".color-swatch-hex")?.blur();
    window.getSelection()?.removeAllRanges();

    const originalColor = swatch.dataset.colorHex;
    const { h, s, v } = rgbToHsv(hexToRgb(originalColor));
    const session = {
      swatch,
      row,
      swatchIndex,
      title: swatch.querySelector(".color-swatch-title"),
      hex: swatch.querySelector(".color-swatch-hex"),
      originalColor,
      draftColor: originalColor,
      h,
      s,
      v,
      pointerId: event.pointerId,
      nameTimer: 0,
      onKey(event) {
        if (event.key === "Escape") {
          event.preventDefault();
          finishColorDrag(false);
        }
      },
      onScroll() {
        finishColorDrag(true);
      },
    };

    swatch.classList.add("is-adjusting");
    swatch.setPointerCapture(event.pointerId);
    colorDragSession = session;
    syncSwatchFromPointer(session, event.clientX, event.clientY);

    document.addEventListener("keydown", session.onKey, true);
    window.addEventListener("scroll", session.onScroll, true);
  });

  swatch.addEventListener("pointermove", (event) => {
    if (colorDragSession?.swatch !== swatch || !swatch.hasPointerCapture(event.pointerId)) return;
    syncSwatchFromPointer(colorDragSession, event.clientX, event.clientY);
  });

  swatch.addEventListener("pointerup", (event) => {
    if (colorDragSession?.swatch !== swatch || !swatch.hasPointerCapture(event.pointerId)) return;
    finishColorDrag(true);
  });

  swatch.addEventListener("pointercancel", (event) => {
    if (colorDragSession?.swatch !== swatch || !swatch.hasPointerCapture(event.pointerId)) return;
    finishColorDrag(false);
  });
}

function applySwatchColor(swatch, row, swatchIndex, color) {
  const normalized = parseColor(color);
  const rowIndex = Number(row.dataset.colorIndex);
  const combination = colorCombinations[rowIndex];

  swatch.dataset.colorHex = colorNameKey(normalized);
  swatch.style.background = normalized;
  swatch.style.setProperty("--color-swatch-label", contrastLabelColor(normalized));

  const hex = swatch.querySelector(".color-swatch-hex");
  if (hex) hex.textContent = formatHexColor(normalized);

  if (combination?.colors?.[swatchIndex] !== undefined) {
    combination.colors[swatchIndex] = normalized;
    row.setAttribute(
      "aria-label",
      `${combination.source} combination ${combination.colors.join(", ")}`,
    );
  }

  const title = swatch.querySelector(".color-swatch-title");
  if (title) title.textContent = "";
  applyColorNameToSwatch(swatch);
  ensureColorNames([normalized]);
}

function setSwatchHexEditable(hex, editable) {
  if (!hex) return;
  hex.contentEditable = editable ? "true" : "false";
}

function bindSwatchHexEditor(hex, swatch, row, swatchIndex) {
  setSwatchHexEditable(hex, false);
  hex.spellcheck = false;
  hex.setAttribute("role", "textbox");
  hex.setAttribute("aria-label", "Edit hex color");

  hex.addEventListener("mousedown", (event) => {
    if (swatch.classList.contains("is-adjusting")) {
      event.preventDefault();
      return;
    }
    event.stopPropagation();
    setSwatchHexEditable(hex, true);
  });
  hex.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  hex.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      hex.blur();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      hex.textContent = formatHexColor(swatch.dataset.colorHex);
      hex.blur();
    }
  });
  hex.addEventListener("blur", () => {
    setSwatchHexEditable(hex, false);
    const current = swatch.dataset.colorHex;
    const next = normalizeHexInput(hex.textContent);
    if (next) {
      applySwatchColor(swatch, row, swatchIndex, next);
    } else {
      hex.textContent = formatHexColor(current);
    }
  });
  hex.addEventListener("focus", () => {
    if (hex.contentEditable !== "true") {
      hex.blur();
      return;
    }
    requestAnimationFrame(() => {
      const range = document.createRange();
      range.selectNodeContents(hex);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    });
  });
}

function createColorRow(combination, index, rowHeight, rowStride) {
  const row = document.createElement("div");
  row.className = "color-row";
  row.setAttribute("role", "button");
  row.tabIndex = 0;
  row.dataset.colorIndex = String(index);
  row.setAttribute(
    "aria-label",
    `${combination.source} combination ${combination.colors.join(", ")}`,
  );

  combination.colors.forEach((color, swatchIndex) => {
    const swatch = document.createElement("span");
    const label = document.createElement("span");
    const title = document.createElement("span");
    const hex = document.createElement("span");
    const normalized = parseColor(color);

    swatch.className = "color-swatch";
    swatch.dataset.colorHex = colorNameKey(normalized);
    swatch.style.background = normalized;
    swatch.style.setProperty("--color-swatch-label", contrastLabelColor(normalized));

    label.className = "color-swatch-label";
    title.className = "color-swatch-title";
    hex.className = "color-swatch-hex";
    hex.textContent = formatHexColor(normalized);

    label.append(title, hex);
    swatch.append(label);
    applyColorNameToSwatch(swatch);
    bindSwatchHexEditor(hex, swatch, row, swatchIndex);
    bindSwatchDragAdjust(swatch, row, swatchIndex);
    swatch.addEventListener("mouseenter", () => {
      ensureColorNames([swatch.dataset.colorHex]);
    });
    row.append(swatch);
  });

  row.addEventListener("click", () => {
    setStatus(`${combination.source} combination`);
  });
  row.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setStatus(`${combination.source} combination`);
    }
  });

  positionColorRow(row, index, rowHeight, rowStride);
  return row;
}

function updateColorGridWindow(force = false) {
  if (colorGrid.hidden || activeBrandTab !== "Colors") return;
  if (!colorCombinations.length) return;

  if (colorDragSession && !document.body.contains(colorDragSession.swatch)) {
    colorDragSession = null;
  }

  const metrics = measureColorGridMetrics();
  if (metrics.rowHeight <= 0) return;

  colorGrid.style.height = `${metrics.totalHeight}px`;

  const rect = colorGrid.getBoundingClientRect();
  const buffer = metrics.rowStride * 2;
  const visibleTop = Math.max(0, -rect.top);
  const visibleBottom = visibleTop + window.innerHeight;
  const startIndex = Math.max(0, Math.floor((visibleTop - buffer) / metrics.rowStride));
  const endIndex = Math.min(
    colorCombinations.length,
    Math.ceil((visibleBottom + buffer) / metrics.rowStride),
  );

  const sameWindow = !force
    && startIndex === colorGridWindow.startIndex
    && endIndex === colorGridWindow.endIndex
    && Math.abs(metrics.rowHeight - colorGridWindow.rowHeight) < 0.5;

  if (sameWindow) return;

  for (const [index, row] of colorRowPool) {
    if (index < startIndex || index >= endIndex) {
      row.remove();
      colorRowPool.delete(index);
    }
  }

  for (let index = startIndex; index < endIndex; index += 1) {
    const combination = colorCombinations[index];
    if (!combination) continue;

    let row = colorRowPool.get(index);
    if (row) {
      positionColorRow(row, index, metrics.rowHeight, metrics.rowStride);
      continue;
    }

    row = createColorRow(combination, index, metrics.rowHeight, metrics.rowStride);
    colorRowPool.set(index, row);
    colorGrid.append(row);
  }

  colorGridWindow = {
    startIndex,
    endIndex,
    rowHeight: metrics.rowHeight,
    rowStride: metrics.rowStride,
  };
  prefetchVisibleColorNames(startIndex, endIndex);
}

function scheduleColorGridWindow() {
  if (colorGridScrollRaf) return;
  colorGridScrollRaf = requestAnimationFrame(() => {
    colorGridScrollRaf = 0;
    updateColorGridWindow();
  });
}

function bindColorGridListeners() {
  if (colorGridListenersBound) return;
  colorGridListenersBound = true;
  window.addEventListener("scroll", scheduleColorGridWindow, { passive: true });
}

function renderColorGrid() {
  colorCombinations = buildColorCombinations();
  colorRowPool.clear();
  colorGrid.replaceChildren();
  colorGridWindow = { startIndex: -1, endIndex: -1, rowHeight: 0, rowStride: 0 };
  bindColorGridListeners();
  updateColorGridWindow(true);
}

function syncBrandTabView() {
  const showLogos = activeBrandTab === "Logos";
  const showType = activeBrandTab === "Type";
  const showColors = activeBrandTab === "Colors";
  const isEmpty = uploadPanel.dataset.empty === "true";
  const showTypeEmpty = showType && !typeCatalogRevealed;

  grid.hidden = !showLogos || isEmpty;
  typeGrid.hidden = !showType || showTypeEmpty;
  colorGrid.hidden = !showColors;
  uploadEmpty.hidden = !(showLogos && isEmpty);
  typeUploadEmpty.hidden = !showTypeEmpty;
  shuffleButton.hidden = showColors ? false : !(showLogos && !isEmpty);
  shuffleButton.disabled = showColors ? false : uploadedLogos.size < 2;
  shuffleButton.setAttribute(
    "aria-label",
    showColors ? "Shuffle color combinations" : "Shuffle logos",
  );
  uploadAddButton.hidden = !showLogos || isEmpty;

  if (showLogos && !isEmpty) {
    syncLogoGridPresentation();
  }

  if (showType && !showTypeEmpty) {
    bindTypeGridListeners();
    requestAnimationFrame(() => updateTypeGridWindow(true));
  }

  if (showColors) {
    bindColorGridListeners();
    if (!colorCombinations.length) renderColorGrid();
    else requestAnimationFrame(() => updateColorGridWindow(true));
  }

  requestAnimationFrame(syncBrandGridOffset);
}

function lockupMarkup(id) {
  return `<div class="fullscreen-lockup" aria-hidden="true">
    <span class="fullscreen-logo-art fullscreen-lockup-mark">${logoMarkup(id)}</span>
    <span class="fullscreen-lockup-text">${lockupText}</span>
  </div>`;
}

function gridLockupMarkup(id) {
  return `<span class="grid-lockup" aria-hidden="true">
    <span class="grid-lockup-mark">${logoMarkup(id)}</span>
    <span class="grid-lockup-text">${lockupText}</span>
  </span>`;
}

function renderGridLogoTile(tile) {
  const logo = tile.querySelector(".logo-art");
  if (!logo) return;

  const showLockup = mobileGridLockupMode && mobileDialogMedia.matches;
  logo.classList.toggle("is-grid-lockup", showLockup);
  logo.innerHTML = showLockup ? gridLockupMarkup(tile.dataset.logoId) : logoMarkup(tile.dataset.logoId);
}

function renderGridLogos() {
  grid.querySelectorAll(".logo-tile").forEach(renderGridLogoTile);
  if (mobileGridLockupMode) disposePerIconShaders();
  syncLogoGridPresentation();
}

function toggleMobileGridLockups() {
  mobileGridLockupMode = !mobileGridLockupMode;
  document.documentElement.style.setProperty("--lockup-font-family", selectedFontFamily());
  renderGridLogos();
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
  const name = logoName(currentLogoId);
  fullscreenLogo.setAttribute(
    "aria-label",
    lockupMode
      ? `${name} lockup with EEG text`
      : name,
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
  const normalizedId = logoId(id);
  if (!uploadedLogos.has(normalizedId)) return;
  currentLogoId = normalizedId;
  renderFullscreenLogo();
}

function showAdjacentLogo(offset) {
  const order = tileOrder();
  if (!order.length) return;
  const position = Math.max(0, order.indexOf(currentLogoId));
  const nextPosition = ((position + offset) % order.length + order.length) % order.length;
  showLogoById(order[nextPosition]);
}

function openLogoDialog(id) {
  if (!uploadedLogos.has(logoId(id))) return;
  document.activeElement?.blur?.();
  lockupMode = false;
  showLogoById(id);
  dialog.showModal();
  dialog.focus({ preventScroll: true });
  mountFullscreenShader();
}

function createLogoTile(id, name, position) {
  const tile = document.createElement("figure");
  const button = document.createElement("button");
  const logo = document.createElement("span");
  const voteControls = document.createElement("figcaption");
  const upButton = document.createElement("button");
  const downButton = document.createElement("button");

  tile.className = "logo-tile";
  tile.dataset.logoIndex = String(id);
  tile.dataset.logoId = logoId(id);
  tile.dataset.logoName = name;
  tile.dataset.sortIndex = String(position);
  tile.dataset.vote = "0";
  button.className = "logo-button";
  button.type = "button";
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `Preview ${name}`);
  logo.className = "logo-art";
  logo.setAttribute("aria-hidden", "true");
  logo.innerHTML = logoMarkup(id);
  voteControls.className = "vote-controls";
  upButton.className = "vote-button vote-button--up";
  upButton.type = "button";
  upButton.disabled = !canVote;
  upButton.dataset.voteValue = "1";
  upButton.setAttribute("aria-label", `Upvote ${name}`);
  downButton.className = "vote-button vote-button--down";
  downButton.type = "button";
  downButton.disabled = !canVote;
  downButton.dataset.voteValue = "-1";
  downButton.setAttribute("aria-label", `Downvote ${name}`);

  button.addEventListener("pointerdown", (event) => {
    if (!mobileDialogMedia.matches || !event.isPrimary) return;

    mobileLogoSwipe = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  });

  button.addEventListener("pointerup", (event) => {
    if (!mobileLogoSwipe || event.pointerId !== mobileLogoSwipe.pointerId) return;

    const deltaX = event.clientX - mobileLogoSwipe.startX;
    const deltaY = event.clientY - mobileLogoSwipe.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    mobileLogoSwipe = null;

    if (absX >= mobileLogoSwipeDistance && absY <= mobileLogoSwipeDrift && absX > absY) {
      suppressNextMobileLogoClick = true;
      event.preventDefault();
      toggleMobileGridLockups();
    }
  });

  button.addEventListener("pointercancel", (event) => {
    if (mobileLogoSwipe?.pointerId === event.pointerId) {
      mobileLogoSwipe = null;
    }
  });

  button.addEventListener("click", (event) => {
    if (suppressNextMobileLogoClick) {
      suppressNextMobileLogoClick = false;
      event.preventDefault();
      return;
    }

    if (event.shiftKey) {
      event.preventDefault();
      tile.classList.toggle("is-selected");
      button.setAttribute("aria-pressed", String(tile.classList.contains("is-selected")));
      setStatus(`${grid.querySelectorAll(".is-selected").length} selected`);
      return;
    }

    if (mobileDialogMedia.matches) {
      event.preventDefault();
      applyMobilePaletteTap();
      return;
    }

    openLogoDialog(id);
  });

  [upButton, downButton].forEach((voteButton) => {
    voteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setLogoVote(logoId(id), Number(voteButton.dataset.voteValue));
    });
  });

  button.append(logo);
  voteControls.append(upButton, downButton);
  tile.append(button);
  tile.append(voteControls);
  grid.append(tile);
  return tile;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keepLocalSvgUrl(value) {
  const normalized = String(value).trim().replace(/^['"]|['"]$/g, "");
  return normalized.startsWith("#") || /^data:image\/(?:png|jpe?g|gif|webp);/i.test(normalized);
}

function sanitizeCssUrls(value) {
  return String(value)
    .replace(/@import\s+(?:url\()?[^;]+;?/gi, "")
    .replace(/url\(([^)]+)\)/gi, (match, url) => (keepLocalSvgUrl(url) ? match : "none"));
}

function sanitizeSvgMarkup(source, id) {
  if (/<!DOCTYPE/i.test(source)) throw new Error("SVG doctypes are not supported");
  const documentNode = new DOMParser().parseFromString(source, "image/svg+xml");
  const svg = documentNode.documentElement;
  if (svg.localName !== "svg" || documentNode.querySelector("parsererror")) {
    throw new Error("Invalid SVG");
  }

  svg.querySelectorAll("script, foreignObject, iframe, object, embed, audio, video, animate, animateMotion, animateTransform, set, discard")
    .forEach((node) => node.remove());

  const elements = [svg, ...svg.querySelectorAll("*")];
  elements.forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      const attributeValue = attribute.value.trim();
      if (attributeName.startsWith("on")) {
        element.removeAttribute(attribute.name);
        return;
      }
      if ((attributeName === "href" || attributeName === "xlink:href") && !keepLocalSvgUrl(attributeValue)) {
        element.removeAttribute(attribute.name);
        return;
      }
      if (element.localName === "a" && (attributeName === "href" || attributeName === "xlink:href")) {
        element.removeAttribute(attribute.name);
        return;
      }
      if (attributeName === "style" || /url\(/i.test(attributeValue)) {
        element.setAttribute(attribute.name, sanitizeCssUrls(attribute.value));
      }
    });
  });
  svg.querySelectorAll("style").forEach((style) => {
    style.textContent = sanitizeCssUrls(style.textContent);
  });

  const idMap = new Map();
  svg.querySelectorAll("[id]").forEach((element) => {
    const oldId = element.id;
    const safeId = oldId.replace(/[^a-zA-Z0-9_-]/g, "-");
    const nextId = `uploaded-${id}-${safeId}`;
    idMap.set(oldId, nextId);
    element.id = nextId;
  });

  const replaceReferences = (value) => {
    let result = String(value);
    idMap.forEach((nextId, oldId) => {
      const escapedId = escapeRegExp(oldId);
      result = result
        .replace(new RegExp(`url\\(\\s*#${escapedId}\\s*\\)`, "g"), `url(#${nextId})`)
        .replace(new RegExp(`(^|[\\s"'(])#${escapedId}(?=$|[\\s"')])`, "g"), `$1#${nextId}`);
    });
    return result;
  };

  [svg, ...svg.querySelectorAll("*")].forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      element.setAttribute(attribute.name, replaceReferences(attribute.value));
    });
  });
  svg.querySelectorAll("style").forEach((style) => {
    style.textContent = replaceReferences(style.textContent);
  });

  if (!svg.hasAttribute("viewBox")) {
    const width = Number.parseFloat(svg.getAttribute("width"));
    const height = Number.parseFloat(svg.getAttribute("height"));
    if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
  }
  if (!svg.hasAttribute("preserveAspectRatio")) svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(svg);
}

function allocateLogoId(fileName) {
  const fileNumber = fileName.match(/(\d+)(?=\D*\.svg$)/i)?.[1];
  if (fileNumber) {
    const preferredId = logoId(Number(fileNumber));
    if (!uploadedLogos.has(preferredId) && !reservedLogoIds.has(preferredId)) {
      nextLogoNumber = Math.max(nextLogoNumber, Number(fileNumber) + 1);
      return preferredId;
    }
  }

  while (uploadedLogos.has(logoId(nextLogoNumber)) || reservedLogoIds.has(logoId(nextLogoNumber))) {
    nextLogoNumber += 1;
  }
  const id = logoId(nextLogoNumber);
  nextLogoNumber += 1;
  return id;
}

function updateUploadUi() {
  const count = uploadedLogos.size;
  const isEmpty = count === 0;
  uploadPanel.dataset.empty = String(isEmpty);
  document.body.classList.toggle("has-logos", !isEmpty);
  grid.setAttribute("aria-label", isEmpty ? "No logos loaded" : `${count} uploaded logos`);
  if (isEmpty && !activeFileReads) uploadFeedback.textContent = "";
}

async function addLogoFiles(fileList) {
  const files = [...fileList];
  if (!files.length) return;

  activeFileReads += 1;
  uploadPanel.setAttribute("aria-busy", "true");
  uploadFeedback.textContent = `Reading ${files.length} ${files.length === 1 ? "file" : "files"}…`;

  let added = 0;
  let rejected = 0;
  for (const file of files) {
    const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    if (!isSvg || file.size > 10 * 1024 * 1024) {
      rejected += 1;
      continue;
    }

    try {
      const id = allocateLogoId(file.name);
      reservedLogoIds.add(id);
      try {
        const markup = sanitizeSvgMarkup(await file.text(), id);
        uploadedLogos.set(id, { id, name: file.name, markup });
        createLogoTile(id, file.name, grid.children.length);
        if (!currentLogoId) currentLogoId = id;
        added += 1;
      } finally {
        reservedLogoIds.delete(id);
      }
    } catch {
      rejected += 1;
    }
  }

  activeFileReads -= 1;
  uploadPanel.removeAttribute("aria-busy");
  uploadInput.value = "";
  updateUploadUi();
  applyVoteState();
  syncBrandTabView();
  syncLogoGridPresentation();

  const addedMessage = added ? `${added} ${added === 1 ? "logo" : "logos"} added` : "Upload complete";
  uploadFeedback.textContent = rejected
    ? `${addedMessage}. ${rejected} ${rejected === 1 ? "file was" : "files were"} skipped.`
    : addedMessage;
  setStatus(uploadFeedback.textContent);
}

function populatePlaceholderLogos() {
  if (uploadedLogos.size || activeFileReads) return;

  coolshapePlaceholders.forEach(({ name, markup }) => {
    const id = allocateLogoId("coolshape.svg");
    uploadedLogos.set(id, { id, name, markup, isPlaceholder: true });
    createLogoTile(id, name, grid.children.length);
    if (!currentLogoId) currentLogoId = id;
  });

  updateUploadUi();
  applyVoteState();
  syncBrandTabView();
  syncLogoGridPresentation();
  uploadFeedback.textContent = `${coolshapePlaceholders.length} Coolshapes placeholders added`;
  setStatus(uploadFeedback.textContent);
}

function openFilePicker() {
  uploadInput.click();
}

function openTypeFilePicker() {
  typeUploadInput.click();
}

function fontExtension(fileName) {
  const match = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "";
}

function isFontFile(file) {
  const extension = fontExtension(file.name);
  if (["woff", "woff2", "ttf", "otf"].includes(extension)) return true;
  const type = String(file.type || "").toLowerCase();
  return type.includes("font") || type.includes("woff") || type.includes("ttf") || type.includes("otf");
}

function fontFamilyFromFileName(fileName) {
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  return base.replace(/\b\w/g, (char) => char.toUpperCase()) || "Custom Font";
}

function fontIdFromFamily(family) {
  return `local-${family.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "font"}`;
}

function parseFontWeight(value) {
  const numeric = Number.parseInt(String(value || ""), 10);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  const named = String(value || "").toLowerCase();
  if (named === "bold") return 700;
  if (named === "normal") return 400;
  return 400;
}

function revealTypeCatalog() {
  if (typeCatalogRevealed) return;
  typeCatalogRevealed = true;
  syncBrandTabView();
  setStatus("Exploring open-source typefaces");
}

function refreshTypeGrid() {
  typeTilePool.forEach((tile) => tile.remove());
  typeTilePool.clear();
  typeGrid.replaceChildren();
  typeGridWindow = { columns: 0, cellSize: 0, startIndex: -1, endIndex: -1 };
  updateTypeGridWindow(true);
}

async function addFontFiles(fileList) {
  const files = [...fileList];
  if (!files.length) return;

  activeFontReads += 1;
  uploadPanel.setAttribute("aria-busy", "true");
  typeUploadFeedback.textContent = `Reading ${files.length} ${files.length === 1 ? "file" : "files"}…`;

  let added = 0;
  let rejected = 0;
  for (const file of files) {
    if (!isFontFile(file) || file.size > 10 * 1024 * 1024) {
      rejected += 1;
      continue;
    }

    try {
      const family = fontFamilyFromFileName(file.name);
      const buffer = await file.arrayBuffer();
      const fontFace = new FontFace(family, buffer);
      await fontFace.load();
      document.fonts.add(fontFace);

      const weight = parseFontWeight(fontFace.weight);
      const id = fontIdFromFamily(family);
      uploadedTypefaces.unshift({
        id: `${id}-${uploadedTypefaces.length + 1}`,
        family,
        weight,
        loader: "local",
      });
      loadedTypefaceKeys.add(typefaceLoadKey(uploadedTypefaces[0]));
      added += 1;
    } catch {
      rejected += 1;
    }
  }

  activeFontReads -= 1;
  uploadPanel.removeAttribute("aria-busy");
  typeUploadInput.value = "";

  if (added) {
    typeCatalogRevealed = true;
    refreshTypeGrid();
    syncBrandTabView();
  }

  const addedMessage = added ? `${added} ${added === 1 ? "font" : "fonts"} added` : "Upload complete";
  const message = rejected
    ? `${addedMessage}. ${rejected} ${rejected === 1 ? "file was" : "files were"} skipped.`
    : addedMessage;
  typeUploadFeedback.textContent = message;
  setStatus(message);
}

function syncDropOverlayCopy() {
  if (activeBrandTab === "Type") {
    dropOverlayTitle.textContent = "Drop to add fonts";
    dropOverlayHint.textContent = "WOFF, WOFF2, TTF, or OTF";
    return;
  }

  dropOverlayTitle.textContent = "Drop to add logos";
  dropOverlayHint.textContent = "SVG files only";
}

function draggedFiles(event) {
  return [...(event.dataTransfer?.types ?? [])].includes("Files");
}

function hideDropOverlay() {
  dragDepth = 0;
  dropOverlay.hidden = true;
  document.body.classList.remove("is-dragging-files");
}

uploadButton.addEventListener("click", openFilePicker);
typeUploadButton.addEventListener("click", openTypeFilePicker);
placeholderButton.addEventListener("click", populatePlaceholderLogos);
typeExploreButton.addEventListener("click", revealTypeCatalog);
uploadAddButton.addEventListener("click", openFilePicker);
uploadInput.addEventListener("change", () => addLogoFiles(uploadInput.files));
typeUploadInput.addEventListener("change", () => addFontFiles(typeUploadInput.files));

function selectBrandTab(selectedButton, shouldFocus = false) {
  const nextTab = selectedButton.textContent.trim();
  const leavingColors = activeBrandTab === "Colors" && nextTab !== "Colors";
  const enteringColors = activeBrandTab !== "Colors" && nextTab === "Colors";

  if (leavingColors) restorePaletteBeforeColors();
  if (enteringColors) stashPaletteBeforeColors();

  brandTabButtons.forEach((button) => {
    const isSelected = button === selectedButton;
    button.setAttribute("aria-pressed", String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
  });
  activeBrandTab = nextTab;
  syncBrandTabView();
  if (shouldFocus) selectedButton.focus();
  setStatus(`${activeBrandTab} tab selected`);
}

brandTabButtons.forEach((button, index) => {
  button.addEventListener("click", () => selectBrandTab(button));
  button.addEventListener("keydown", (event) => {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % brandTabButtons.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + brandTabButtons.length) % brandTabButtons.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = brandTabButtons.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectBrandTab(brandTabButtons[nextIndex], true);
  });
});

document.documentElement.style.setProperty("--lockup-font-family", selectedFontFamily());

document.addEventListener("dragenter", (event) => {
  if (!draggedFiles(event)) return;
  event.preventDefault();
  dragDepth += 1;
  syncDropOverlayCopy();
  dropOverlay.hidden = false;
  document.body.classList.add("is-dragging-files");
});

document.addEventListener("dragover", (event) => {
  if (!draggedFiles(event)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

document.addEventListener("dragleave", (event) => {
  if (!draggedFiles(event)) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) hideDropOverlay();
});

document.addEventListener("drop", (event) => {
  if (!draggedFiles(event)) return;
  event.preventDefault();
  const files = event.dataTransfer.files;
  hideDropOverlay();
  if (activeBrandTab === "Type") {
    addFontFiles(files);
    return;
  }
  addLogoFiles(files);
});

window.addEventListener("dragend", hideDropOverlay);
updateUploadUi();
updateFaviconForTopLogo();

mobileDialogMedia.addEventListener("change", (event) => {
  if (!event.matches && mobileGridLockupMode) {
    mobileGridLockupMode = false;
  }
  renderGridLogos();
});

function tileOrder() {
  return [...grid.querySelectorAll(".logo-tile")].map((tile) => tile.dataset.logoId);
}

function setStatus(message = "") {
  if (statusElement) statusElement.textContent = message;
}

function syncAccessUi() {
  if (!accessPanel) return;

  const configured = Boolean(supabase);
  const signedIn = Boolean(session?.user);
  const locked = configured && !signedIn;
  document.body.classList.toggle("is-auth-locked", locked);
  logoSheet.setAttribute("aria-hidden", String(locked));

  accessPanel.hidden = configured && signedIn;
  adminPanel.hidden = !configured || !signedIn || !isAdminRoute;

  if (!configured) {
    accessPanel.hidden = true;
    statusElement.textContent = "Supabase config missing";
    return;
  }

  authForm.hidden = false;
}

function setVotingEnabled(enabled) {
  canVote = Boolean(enabled);
  grid.querySelectorAll(".vote-button").forEach((button) => {
    button.disabled = !canVote;
  });
}

function applyVoteState() {
  grid.querySelectorAll(".logo-tile").forEach((tile) => {
    const vote = clientVotes.get(tile.dataset.logoId) ?? 0;
    tile.dataset.vote = String(vote);
    tile.classList.toggle("has-upvote", vote === 1);
    tile.classList.toggle("has-downvote", vote === -1);
    tile.querySelector(".vote-button--up")?.setAttribute("aria-pressed", String(vote === 1));
    tile.querySelector(".vote-button--down")?.setAttribute("aria-pressed", String(vote === -1));
  });
}

function syncLogoGridPresentation() {
  updateFaviconForTopLogo();
  scheduleLogoShaderMask();
  schedulePerIconShaderSync();
  requestAnimationFrame(syncBrandGridOffset);
}

function moveLogoTile(id, direction) {
  const tile = [...grid.querySelectorAll(".logo-tile")].find((candidate) => candidate.dataset.logoId === id);
  if (!tile) return;

  if (direction > 0) {
    const previousTile = tile.previousElementSibling;
    if (previousTile) grid.insertBefore(tile, previousTile);
  } else if (direction < 0) {
    const nextTile = tile.nextElementSibling;
    if (nextTile) grid.insertBefore(nextTile, tile);
  }

  syncLogoGridPresentation();
}

function renderVotes() {
  applyVoteState();
  syncLogoGridPresentation();
  const upvotes = [...clientVotes.values()].filter((vote) => vote === 1).length;
  const downvotes = [...clientVotes.values()].filter((vote) => vote === -1).length;
  setStatus(`${upvotes} up / ${downvotes} down`);
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  if (!supabase) return;

  const formData = new FormData(authForm);
  authMessage.textContent = "Signing in...";
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });

  if (error) {
    authMessage.textContent = error.message;
  }
}

async function loadProfile() {
  if (!supabase || !session?.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error) {
    setStatus(error.message);
    return null;
  }

  return data;
}

async function loadMembership() {
  if (!supabase || !session?.user || isAdmin()) return Boolean(isAdmin());

  const { data, error } = await supabase
    .from("project_members")
    .select("project_id,user_id")
    .eq("project_id", projectId)
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    setStatus(error.message);
    return false;
  }

  return Boolean(data);
}

async function loadClientVotes() {
  if (!supabase || !session?.user) return;

  const { data, error } = await supabase
    .from("logo_votes")
    .select("logo_id,vote")
    .eq("project_id", projectId)
    .eq("user_id", session.user.id);

  if (error) {
    setStatus(error.message);
    return;
  }

  clientVotes = new Map((data ?? []).map((row) => [row.logo_id, row.vote]));
  renderVotes();
}

async function refreshClientState() {
  currentProfile = await loadProfile();
  syncAccessUi();

  const member = await loadMembership();
  setVotingEnabled(member);

  if (!member && !isAdmin()) {
    clientVotes = new Map();
    renderVotes();
    setStatus("Project access pending");
    return;
  }

  await loadClientVotes();
  if (isAdminRoute) await loadAdminResults();
}

async function setLogoVote(id, nextVote) {
  if (!supabase || !session?.user || !canVote) return;

  const nextValue = nextVote;

  setVotingEnabled(false);
  const { error } = await supabase
    .from("logo_votes")
    .upsert({
      project_id: projectId,
      user_id: session.user.id,
      logo_id: id,
      vote: nextValue,
    }, { onConflict: "project_id,user_id,logo_id" });

  if (error) {
    setStatus(error.message);
    setVotingEnabled(true);
    return;
  }

  clientVotes.set(id, nextValue);
  moveLogoTile(id, nextValue);
  renderVotes();
  setVotingEnabled(true);
  if (isAdminRoute && isAdmin()) await loadAdminResults();
}

function summarizeAdminVotes(rows) {
  const summaries = new Map(tileOrder().map((id) => [
    id,
    { logo_id: id, score: 0, upvotes: 0, downvotes: 0, clients: [] },
  ]));

  rows.forEach((row) => {
    const id = row.logo_id;
    const summary = summaries.get(id) ?? { logo_id: id, score: 0, upvotes: 0, downvotes: 0, clients: [] };
    summary.score += row.vote;
    if (row.vote === 1) summary.upvotes += 1;
    if (row.vote === -1) summary.downvotes += 1;
    summary.clients.push(`${row.email}: ${row.vote === 1 ? "up" : "down"}`);
    summaries.set(id, summary);
  });

  return [...summaries.values()].sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (right.upvotes !== left.upvotes) return right.upvotes - left.upvotes;
    return Number(left.logo_id) - Number(right.logo_id);
  });
}

function renderAdminResults() {
  if (!adminContent) return;

  if (!isAdmin()) {
    adminContent.innerHTML = `<p class="admin-empty">Admin access required.</p>`;
    return;
  }

  const summaries = summarizeAdminVotes(adminVoteRows);
  adminContent.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Logo</th>
          <th>Score</th>
          <th>Up</th>
          <th>Down</th>
          <th>Clients</th>
        </tr>
      </thead>
      <tbody>
        ${summaries.map((row) => `
          <tr>
            <td>${escapeHtml(row.logo_id)}</td>
            <td>${row.score}</td>
            <td>${row.upvotes}</td>
            <td>${row.downvotes}</td>
            <td>${escapeHtml(row.clients.join(", "))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

async function loadAdminResults() {
  if (!supabase || !isAdmin()) {
    renderAdminResults();
    return;
  }

  const { data, error } = await supabase
    .from("logo_votes")
    .select("logo_id,vote,user_id,updated_at,profiles(email)")
    .eq("project_id", projectId);

  if (error) {
    adminContent.innerHTML = `<p class="admin-empty">${escapeHtml(error.message)}</p>`;
    return;
  }

  adminVoteRows = (data ?? []).map((row) => ({
    ...row,
    email: row.profiles?.email ?? row.user_id,
  }));
  renderAdminResults();
}

function exportAdminCsv() {
  if (!adminVoteRows.length) return;

  const summaries = summarizeAdminVotes(adminVoteRows);
  const lines = [
    ["logo_id", "total_score", "upvotes", "downvotes", "client_votes"],
    ...summaries.map((row) => [
      row.logo_id,
      row.score,
      row.upvotes,
      row.downvotes,
      row.clients.join("; "),
    ]),
  ];
  const csv = lines
    .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "eeg-logo-rankings.csv";
  link.click();
  URL.revokeObjectURL(url);
}

async function initializeClientAccess() {
  createAccessUi();

  if (!supabase) {
    syncAccessUi();
    return;
  }

  const { data } = await supabase.auth.getSession();
  session = data.session;
  syncAccessUi();

  supabase.auth.onAuthStateChange((event, nextSession) => {
    const wasSignedOut = !session;
    session = nextSession;
    const shouldOpenInfo = event === "SIGNED_IN" && wasSignedOut && Boolean(session);
    currentProfile = null;
    clientVotes = new Map();
    setVotingEnabled(false);
    if (shouldOpenInfo) openInfoDialog();
    syncAccessUi();
    if (session) {
      refreshClientState();
    } else {
      renderVotes();
    }
  });

  if (session) await refreshClientState();
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

function randomizeLogoOrder() {
  if (activeBrandTab === "Colors") {
    renderColorGrid();
    setStatus("Randomized color combinations");
    return;
  }

  const tiles = [...grid.querySelectorAll(".logo-tile")];
  if (tiles.length < 2) return;

  for (let index = tiles.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [tiles[index], tiles[swapIndex]] = [tiles[swapIndex], tiles[index]];
  }

  tiles.forEach((tile) => grid.append(tile));
  updateFaviconForTopLogo();
  clearSelection();
  if (clientVotes.size) {
    renderVotes();
  } else {
    scheduleLogoShaderMask();
    schedulePerIconShaderSync();
  }
  setStatus("Randomized order");
}

shuffleButton.addEventListener("click", randomizeLogoOrder);

document.addEventListener("pointerdown", (event) => {
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

function openInfoDialog() {
  if (infoDialog.open) return;
  infoDialog.showModal();
  infoButton.setAttribute("aria-expanded", "true");
  infoCloseButton.focus({ preventScroll: true });
}

function closeInfoDialog() {
  infoDialog.close();
  infoButton.setAttribute("aria-expanded", "false");
  infoButton.focus({ preventScroll: true });
}

infoButton.addEventListener("click", openInfoDialog);
infoCloseButton.addEventListener("click", closeInfoDialog);

infoDialog.addEventListener("click", (event) => {
  if (event.target === infoDialog) closeInfoDialog();
});

infoDialog.addEventListener("close", () => {
  infoButton.setAttribute("aria-expanded", "false");
});

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

  canvas.width = size;
  canvas.height = size;

  context.fillStyle = palette.paper;
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

function svgViewBox(svg) {
  const values = (svg?.getAttribute("viewBox") ?? "")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (values.length === 4 && values.every(Number.isFinite) && values[2] > 0 && values[3] > 0) {
    return values;
  }
  return [0, 0, 1200, 1200];
}

function svgMarkupScaledTo(svg, width, height, x = 0, y = 0) {
  const [viewX, viewY, viewWidth, viewHeight] = svgViewBox(svg);
  const scaleX = width / viewWidth;
  const scaleY = height / viewHeight;
  return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scaleX.toFixed(6)} ${scaleY.toFixed(6)}) translate(${-viewX} ${-viewY})">${svg.innerHTML}</g>`;
}

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
    return svgMarkupScaledTo(svg, box.width, box.height, box.left, box.top);
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
  const normalizedMarkup = svgMarkupScaledTo(svg, 1200, 1200);

  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <style>
      .logo-mask :is(path, polygon, polyline, rect, circle, ellipse) { fill: white !important; stroke: white !important; }
      .logo-mask line { stroke: white !important; }
      .logo-mask .cls-5 { fill: black !important; stroke: black !important; opacity: 1 !important; }
    </style>
    <defs>
      <mask id="logo-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
        <rect width="1200" height="1200" fill="black"/>
        <g class="logo-mask">${normalizedMarkup}</g>
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
  const normalizedMarkup = svgMarkupScaledTo(svg, 1200, 1200);

  const sourceSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <style>
      .logo-mask :is(path, polygon, polyline, rect, circle, ellipse) { fill: white !important; stroke: white !important; opacity: 1 !important; }
      .logo-mask line { stroke: white !important; opacity: 1 !important; }
      .logo-mask .cls-5 { fill: black !important; stroke: black !important; opacity: 1 !important; }
    </style>
    <defs>
      <mask id="logo-source-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
        <rect width="1200" height="1200" fill="black"/>
        <g class="logo-mask">${normalizedMarkup}</g>
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

function lockupMaskSvg(front = "white", back = "transparent") {
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

async function lightweightTextureFromImage(image, type, { preserveAspect = false } = {}) {
  const baseSize = 192;
  const maxSize = 512;
  const aspect = image.naturalWidth > 0 && image.naturalHeight > 0
    ? image.naturalWidth / image.naturalHeight
    : 1;
  const width = preserveAspect
    ? Math.max(1, Math.round(aspect >= 1 ? maxSize : maxSize * aspect))
    : baseSize;
  const height = preserveAspect
    ? Math.max(1, Math.round(aspect >= 1 ? maxSize / aspect : maxSize))
    : baseSize;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Failed to create logo texture context");

  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const sourcePixels = ctx.getImageData(0, 0, width, height);
  const alpha = new Float32Array(width * height);
  for (let i = 0; i < alpha.length; i += 1) {
    alpha[i] = sourcePixels.data[i * 4 + 3] / 255;
  }

  const texture = ctx.createImageData(width, height);
  const output = texture.data;

  if (type === "heatmap") {
    const inverse = new Float32Array(alpha.length);
    for (let i = 0; i < alpha.length; i += 1) {
      inverse[i] = 1 - alpha[i];
    }

    const contour = boxBlur(inverse, width, height, 2, 1);
    const outerBlur = boxBlur(inverse, width, height, 18, 2);
    const innerBlur = boxBlur(inverse, width, height, 6, 2);

    for (let i = 0; i < alpha.length; i += 1) {
      const px = i * 4;
      output[px] = contour[i] * 255;
      output[px + 1] = outerBlur[i] * 255;
      output[px + 2] = innerBlur[i] * 255;
      output[px + 3] = 255;
    }
  } else {
    const softMask = boxBlur(alpha, width, height, 10, 2);

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
  return lightweightTextureFromImage(image, type, { preserveAspect: true });
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
  if (mobileGridLockupMode && mobileDialogMedia.matches) {
    disposePerIconShaders();
    return;
  }

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
  if (activeBrandTab === "Type") updateTypeGridWindow(true);
  else if (activeBrandTab === "Colors") updateColorGridWindow(true);
  else requestAnimationFrame(syncBrandGridOffset);
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

function sampleFourColors(colors) {
  const normalized = [...new Set(colors.map(parseColor))];
  if (!normalized.length) return ["#111111", "#555555", "#aaaaaa", "#ffffff"];

  const sorted = [...normalized].sort((a, b) => luminance(a) - luminance(b));
  if (sorted.length === 1) {
    return [
      sorted[0],
      mixColors(sorted[0], "#ffffff", 0.33),
      mixColors(sorted[0], "#ffffff", 0.66),
      "#ffffff",
    ];
  }

  if (sorted.length === 2) {
    return [
      sorted[0],
      mixColors(sorted[0], sorted[1], 0.33),
      mixColors(sorted[0], sorted[1], 0.67),
      sorted[1],
    ];
  }

  if (sorted.length === 3) {
    return [
      sorted[0],
      sorted[1],
      mixColors(sorted[1], sorted[2], 0.5),
      sorted[2],
    ];
  }

  return [0, 1, 2, 3].map((step) => {
    const index = Math.round((step / 3) * (sorted.length - 1));
    return sorted[index];
  });
}

function generateColorCombination() {
  if (Math.random() < 0.24) {
    const pair = randomFrom(standardPalettePairs);
    return {
      colors: [
        pair[0],
        mixColors(pair[0], pair[1], 0.33),
        mixColors(pair[0], pair[1], 0.67),
        pair[1],
      ],
      source: "Standard",
    };
  }

  const [name, generator] = randomFrom(paletteSources);
  return {
    colors: sampleFourColors(generator()),
    source: name,
  };
}

function paletteFromCombination(combination) {
  const candidates = contrastPairs(combination.colors, combination.source);
  const palette = weightedRandom(candidates) ?? {
    ink: combination.colors[0],
    paper: combination.colors[combination.colors.length - 1],
    ratio: contrastRatio(combination.colors[0], combination.colors[combination.colors.length - 1]),
    source: combination.source,
  };
  rememberPalette(palette);
  return {
    ink: palette.ink,
    paper: palette.paper,
    ratio: palette.ratio,
    source: palette.source,
  };
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

function applyPalette(palette) {
  currentPalette = palette;
  document.documentElement.style.setProperty("--logo-ink", palette.ink);
  document.documentElement.style.setProperty("--logo-bg", palette.paper);
  document.documentElement.style.setProperty("--logo-bg-paint", palette.paper);
  document.documentElement.style.setProperty("--editor-mark-color", alphaColor(palette.ink, 0.36));
  updateFaviconForTopLogo();
  refreshShaderPalette();
}

function isMonochromePalette(palette = currentPalette) {
  const ink = palette.ink.toLowerCase();
  const paper = palette.paper.toLowerCase();
  const defaultMatch = ink === defaultPalette.ink && paper === defaultPalette.paper;
  const invertedMatch = ink === invertedPalette.ink && paper === invertedPalette.paper;
  return defaultMatch || invertedMatch;
}

function ensureMonochromePalette() {
  if (isMonochromePalette()) return;
  applyPalette(defaultPalette);
}

function stashPaletteBeforeColors() {
  paletteBeforeColors = {
    ink: currentPalette.ink,
    paper: currentPalette.paper,
    ratio: currentPalette.ratio,
    source: currentPalette.source,
  };
  ensureMonochromePalette();
}

function restorePaletteBeforeColors() {
  if (!paletteBeforeColors) return;
  applyPalette(paletteBeforeColors);
  paletteBeforeColors = null;
}

function toggleDefaultPalette() {
  const isInverted = currentPalette.ink.toLowerCase() === invertedPalette.ink
    && currentPalette.paper.toLowerCase() === invertedPalette.paper;
  applyPalette(isInverted ? defaultPalette : invertedPalette);
}

function applyMobilePaletteTap() {
  mobilePaletteTapCount = (mobilePaletteTapCount + 1) % 5;

  if (mobilePaletteTapCount === 4 || mobilePaletteTapCount === 0) {
    applyPalette(mobilePaletteTapCount === 4 ? defaultPalette : invertedPalette);
    return;
  }

  applyPalette(randomPalette());
}

document.addEventListener("keydown", (event) => {
  const target = event.target;

  if (infoDialog.open) return;

  const isTyping = target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
  if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;

  if (event.key === "Tab") {
    if (dialog.open) return;
    event.preventDefault();
    const currentIndex = brandTabButtons.findIndex(
      (button) => button.textContent.trim() === activeBrandTab,
    );
    const fromIndex = currentIndex < 0 ? 0 : currentIndex;
    const nextIndex = event.shiftKey
      ? (fromIndex - 1 + brandTabButtons.length) % brandTabButtons.length
      : (fromIndex + 1) % brandTabButtons.length;
    selectBrandTab(brandTabButtons[nextIndex]);
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    if (target instanceof HTMLElement && target.classList.contains("brand-tab")) {
      target.blur();
    }
    if (activeBrandTab === "Colors") {
      toggleDefaultPalette();
    } else {
      applyPalette(randomPalette());
    }
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

syncBrandTabView();
initializeClientAccess();
