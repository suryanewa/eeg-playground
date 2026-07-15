import { colorToCSS, generateRandomColorRamp } from "fettepalette";
import { generateColorRamp } from "rampensau";
import { Poline } from "poline";
import { rybHsl2rgb } from "rybitten";
import { createClient } from "@supabase/supabase-js";
import { coolshapePlaceholders } from "./coolshape-placeholders.js";
import { typefaces } from "./typefaces.js";
import { buildDesignMd, designMdFilename } from "./design-md.js";
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
const lockupUploadEmpty = document.querySelector("#lockup-upload-empty");
const uploadInput = document.querySelector("#logo-file-input");
const typeUploadInput = document.querySelector("#type-file-input");
const placeholderButton = document.querySelector("#placeholder-button");
const typeExploreButton = document.querySelector("#type-explore-button");
const lockupTryButton = document.querySelector("#lockup-try-button");
const uploadFeedback = document.querySelector("#upload-feedback");
const typeUploadFeedback = document.querySelector("#type-upload-feedback");
const dropOverlay = document.querySelector("#drop-overlay");
const dropOverlayTitle = document.querySelector("#drop-overlay-title");
const dropOverlayHint = document.querySelector("#drop-overlay-hint");
const brandTabButtons = [...document.querySelectorAll(".brand-tab")];

function brandTabName(button) {
  return button.dataset.brandTab ?? button.textContent.trim();
}

function isBrandTabDisabled(button) {
  return button.classList.contains("brand-tab--soon");
}

function nextEnabledBrandTabIndex(fromIndex, step) {
  const count = brandTabButtons.length;
  for (let i = 1; i <= count; i += 1) {
    const index = (fromIndex + step * i + count) % count;
    if (!isBrandTabDisabled(brandTabButtons[index])) return index;
  }
  return fromIndex;
}

function firstEnabledBrandTabIndex() {
  return brandTabButtons.findIndex((button) => !isBrandTabDisabled(button));
}

function lastEnabledBrandTabIndex() {
  for (let i = brandTabButtons.length - 1; i >= 0; i -= 1) {
    if (!isBrandTabDisabled(brandTabButtons[i])) return i;
  }
  return 0;
}
const typeGrid = document.querySelector("#type-grid");
const colorGrid = document.querySelector("#color-grid");
const lockupGrid = document.querySelector("#lockup-grid");
const gridFilters = document.querySelector("#grid-filters");
const gridActions = document.querySelector("#grid-actions");
const lockedImportInput = document.querySelector("#locked-import-input");
let pendingImportTab = null;
const dialog = document.querySelector("#logo-dialog");
const fullscreenLogo = document.querySelector("#fullscreen-logo");
const closeButton = dialog.querySelector(".close-button");
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
let bwModeActive = false;
let preBwPalette = null;
let currentShaderIndex = -1;
let selectedFont = "Helvetica";
let activeBrandTab = "Colors";
let typeCatalogRevealed = false;
let lockupCatalogRevealed = false;
let logoPlaceholdersChosen = false;
let typeCatalogChosen = false;
let lockupCatalogChosen = false;

const SESSION_PREFIX = "brandy:";
const SESSION_KEYS = {
  activeTab: `${SESSION_PREFIX}active-tab`,
  typeCatalog: `${SESSION_PREFIX}type-catalog`,
  lockupCatalog: `${SESSION_PREFIX}lockup-catalog`,
  logoPlaceholders: `${SESSION_PREFIX}logo-placeholders`,
  reloadPending: `${SESSION_PREFIX}reload-pending`,
};
const BRAND_TABS = new Set(["Colors", "Logos", "Type", "Lockups"]);

function saveSessionState() {
  try {
    sessionStorage.setItem(SESSION_KEYS.activeTab, activeBrandTab);
    sessionStorage.setItem(SESSION_KEYS.typeCatalog, String(typeCatalogChosen));
    sessionStorage.setItem(SESSION_KEYS.lockupCatalog, String(lockupCatalogChosen));
    sessionStorage.setItem(SESSION_KEYS.logoPlaceholders, String(logoPlaceholdersChosen));
  } catch {
    // sessionStorage may be unavailable in restricted contexts
  }
}

function clearSessionState() {
  try {
    for (const key of Object.values(SESSION_KEYS)) {
      sessionStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

function isHardRefresh(nav) {
  if (!nav || nav.type !== "reload") return false;
  if (nav.deliveryType === "cache") return false;
  return nav.transferSize > 0;
}

function shouldRestoreSessionState() {
  const [nav] = performance.getEntriesByType("navigation");
  const reloadPending = sessionStorage.getItem(SESSION_KEYS.reloadPending) === "1";
  sessionStorage.removeItem(SESSION_KEYS.reloadPending);

  if (!nav || nav.type !== "reload" || !reloadPending || isHardRefresh(nav)) {
    return false;
  }
  return true;
}

function readSessionState() {
  const tab = sessionStorage.getItem(SESSION_KEYS.activeTab);
  return {
    activeBrandTab: BRAND_TABS.has(tab) ? tab : "Colors",
    typeCatalogChosen: sessionStorage.getItem(SESSION_KEYS.typeCatalog) === "true",
    lockupCatalogChosen: sessionStorage.getItem(SESSION_KEYS.lockupCatalog) === "true",
    logoPlaceholdersChosen: sessionStorage.getItem(SESSION_KEYS.logoPlaceholders) === "true",
  };
}

function applyRestoredBrandTab(tabName) {
  const button = brandTabButtons.find((entry) => brandTabName(entry) === tabName);
  if (!button || isBrandTabDisabled(button)) return;

  brandTabButtons.forEach((btn) => {
    const isSelected = btn === button;
    btn.setAttribute("aria-pressed", String(isSelected));
    if (!isBrandTabDisabled(btn)) btn.tabIndex = isSelected ? 0 : -1;
  });
  activeBrandTab = tabName;
}

function restoreSessionState() {
  if (!shouldRestoreSessionState()) {
    clearSessionState();
    return;
  }

  const saved = readSessionState();
  if (saved.typeCatalogChosen) {
    typeCatalogChosen = true;
    typeCatalogRevealed = true;
  }
  if (saved.lockupCatalogChosen) {
    lockupCatalogChosen = true;
    lockupCatalogRevealed = true;
  }
  if (saved.logoPlaceholdersChosen) {
    logoPlaceholdersChosen = true;
    populatePlaceholderLogos();
  }
  applyRestoredBrandTab(saved.activeBrandTab);
}
let typeDisplayOrder = null;
const uploadedTypefaces = [];
let activeFontReads = 0;
let lockupMode = false;
let previewMode = "logo";
let currentTypeIndex = -1;
let currentLockupIndex = -1;
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
const colorSwatchGap = 24;
const gridLockControlSize = 30;
let colorCombinations = [];
const colorRowPool = new Map();
let colorGridWindow = { startIndex: -1, endIndex: -1, rowHeight: 0, rowStride: 0 };
let colorGridScrollRaf = 0;
let colorGridListenersBound = false;
const colorNameApi = "https://api.color.pizza/v1/";
const colorNameCache = new Map();
const colorNameInflight = new Map();
let colorDragSession = null;
const lockupCombinationCount = 720;
let lockupCombinations = [];
const lockupTilePool = new Map();
let lockupGridWindow = { columns: 0, cellSize: 0, startIndex: -1, endIndex: -1 };
let lockupGridScrollRaf = 0;
let lockupGridListenersBound = false;

// Colors pins are per-swatch: Map<rowIndex, Map<swatchIndex, colorHex>>
const pinnedGridSlots = {
  Colors: new Map(),
  Logos: new Map(),
  Type: new Map(),
  Lockups: new Map(),
};

const TYPEFACE_REGISTRY_ORDER = ["google", "fontshare", "fontsource", "bunny", "local"];
const TYPEFACE_REGISTRY_LABELS = {
  google: "Google",
  fontshare: "Fontshare",
  fontsource: "Fontsource",
  bunny: "Bunny",
  local: "Local",
};

const EDITOR_PICK_TYPEFACE_IDS = new Set([
  // Geometric / modern sans
  "bricolage-grotesque",
  "space-grotesk",
  "syne",
  // Humanist / editorial sans
  "instrument-sans",
  "schibsted-grotesk",
  // Display / condensed sans
  "clash-display",
  "bebas-neue",
  "oswald",
  "unbounded",
  // Editorial & classic serif
  "fraunces",
  "newsreader",
  "libre-baskerville",
  "instrument-serif",
  // Display serif
  "gloock",
  "playfair-display",
  // Slab
  "montagu-slab",
  "rokkitt",
  // Mono
  "jetbrains-mono",
  "space-mono",
]);

const gridFilterState = {
  Colors: "all",
  Logos: "all",
  Type: "all",
  Lockups: "all",
};

function gridFilterForTab(tab) {
  return gridFilterState[tab] ?? "all";
}

function isEditorPickTypeface(face) {
  return EDITOR_PICK_TYPEFACE_IDS.has(face.id);
}

function getTypefaceRegistries() {
  const loaders = new Set(typefaces.map((face) => face.loader));
  return TYPEFACE_REGISTRY_ORDER.filter((loader) => loaders.has(loader));
}

function initTypeRegistryFilters() {
  const panel = gridFilters?.querySelector('.grid-filter-panel[data-grid-filter-tab="Type"]');
  if (!panel || panel.dataset.registryFiltersBuilt === "true") return;

  for (const loader of getTypefaceRegistries()) {
    const button = document.createElement("button");
    button.className = "grid-filter grid-filter--registry";
    button.type = "button";
    button.dataset.filter = loader;
    button.setAttribute("aria-pressed", "false");
    button.textContent = TYPEFACE_REGISTRY_LABELS[loader] ?? loader;
    panel.appendChild(button);
  }

  panel.dataset.registryFiltersBuilt = "true";
}

function getColorGeneratorTitles() {
  return ["Standard", ...paletteSources.map(([name]) => name)];
}

function initColorGeneratorFilters() {
  const panel = gridFilters?.querySelector('.grid-filter-panel[data-grid-filter-tab="Colors"]');
  if (!panel || panel.dataset.generatorFiltersBuilt === "true") return;

  for (const title of getColorGeneratorTitles()) {
    const button = document.createElement("button");
    button.className = "grid-filter grid-filter--generator";
    button.type = "button";
    button.dataset.filter = title;
    button.setAttribute("aria-pressed", "false");
    button.textContent = title;
    panel.appendChild(button);
  }

  panel.dataset.generatorFiltersBuilt = "true";
}

function pinnedLogoIds() {
  return new Set(orderedPinnedValues(pinnedGridSlots.Logos));
}

function isLogoPinned(logoId) {
  return pinnedLogoIds().has(logoId);
}

function pinnedTypefaceKeys() {
  return new Set(orderedPinnedValues(pinnedGridSlots.Type).map((key) => JSON.stringify(key)));
}

function isTypefacePinned(face) {
  return pinnedTypefaceKeys().has(JSON.stringify(typefaceLoadKey(face)));
}

function isLockupCombinationPinned(index, combination) {
  if (pinnedGridSlots.Lockups.has(index)) return true;
  const combo = { logoId: combination.logoId, typeIndex: combination.typeIndex };
  return orderedPinnedValues(pinnedGridSlots.Lockups)
    .some((entry) => pinValuesEqual(entry, combo));
}

function getColorRowSourceIndices() {
  const all = colorCombinations.map((_, index) => index);
  const filter = gridFilterForTab("Colors");
  if (filter === "locked") {
    return all.filter((index) => isColorRowPinned(index));
  }
  if (filter !== "all") {
    return all.filter((index) => colorCombinations[index]?.source === filter);
  }
  return all;
}

function getTypeGridSourceIndices() {
  const faces = getTypefacesForGrid();
  const all = faces.map((_, index) => index);
  const filter = gridFilterForTab("Type");
  if (filter === "locked") {
    return all.filter((index) => isTypefacePinned(faces[index]));
  }
  if (filter === "editors-picks") {
    return all.filter((index) => isEditorPickTypeface(faces[index]));
  }
  if (filter !== "all") {
    return all.filter((index) => faces[index].loader === filter);
  }
  return all;
}

function getLockupSourceIndices() {
  const all = lockupCombinations.map((_, index) => index);
  if (gridFilterForTab("Lockups") !== "locked") return all;
  return all.filter((index) => isLockupCombinationPinned(index, lockupCombinations[index]));
}

function activeBrandGridElement() {
  if (activeBrandTab === "Colors") return colorGrid;
  if (activeBrandTab === "Logos") return grid;
  if (activeBrandTab === "Type") return typeGrid;
  if (activeBrandTab === "Lockups") return lockupGrid;
  return null;
}

function gridFiltersHaveGutter() {
  const sheetRect = logoSheet.getBoundingClientRect();
  return (window.innerWidth - sheetRect.width) / 2 >= 72;
}

function syncGridFilterUi() {
  if (!gridFilters) return;

  const activeGrid = activeBrandGridElement();
  const show = BRAND_TABS.has(activeBrandTab)
    && activeGrid
    && !activeGrid.hidden
    && gridFiltersHaveGutter();

  gridFilters.hidden = !show;
  gridFilters.querySelectorAll(".grid-filter-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.gridFilterTab === activeBrandTab);
  });
  gridFilters.querySelectorAll(".grid-filter").forEach((button) => {
    const tab = button.closest(".grid-filter-panel")?.dataset.gridFilterTab;
    if (!tab) return;
    button.setAttribute("aria-pressed", String(gridFilterForTab(tab) === button.dataset.filter));
  });
}

function syncGridFiltersPosition() {
  if (!gridFilters || gridFilters.hidden) return;

  const activeGrid = activeBrandGridElement();
  if (!activeGrid || activeGrid.hidden) return;

  const sheetRect = logoSheet.getBoundingClientRect();
  const gridRect = activeGrid.getBoundingClientRect();
  const gutterCenterX = gridRect.left / 2;

  const brandTabs = uploadPanel.querySelector(".brand-tabs");
  const contentTop = (brandTabs?.getBoundingClientRect().bottom ?? uploadPanel.getBoundingClientRect().bottom)
    + brandContentGap;
  const centerY = contentTop + Math.max(0, window.innerHeight - contentTop) / 2;

  gridFilters.style.left = `${gutterCenterX - sheetRect.left}px`;
  gridFilters.style.top = `${centerY - sheetRect.top}px`;
}

function isBwInverted() {
  const ink = currentPalette.ink.toLowerCase();
  const paper = currentPalette.paper.toLowerCase();
  return ink === invertedPalette.ink.toLowerCase() && paper === invertedPalette.paper.toLowerCase();
}

function syncBwButtons() {
  if (!gridActions) return;

  const inverted = bwModeActive && isBwInverted();
  gridActions.querySelectorAll('[data-action="toggle-bw"]').forEach((button) => {
    button.setAttribute("aria-pressed", String(bwModeActive));
    button.classList.toggle("is-active", bwModeActive);
    button.classList.toggle("is-inverted", inverted);
  });
}

function syncGridActionsUi() {
  if (!gridActions) return;

  const activeGrid = activeBrandGridElement();
  const show = BRAND_TABS.has(activeBrandTab)
    && activeGrid
    && !activeGrid.hidden
    && gridFiltersHaveGutter();

  gridActions.hidden = !show;
  gridActions.querySelectorAll(".grid-action-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tab === activeBrandTab);
  });
  syncBwButtons();
}

function syncGridActionsPosition() {
  if (!gridActions || gridActions.hidden) return;

  const activeGrid = activeBrandGridElement();
  if (!activeGrid || activeGrid.hidden) return;

  const sheetRect = logoSheet.getBoundingClientRect();
  const gridRect = activeGrid.getBoundingClientRect();
  const gutterCenterX = (window.innerWidth + gridRect.right) / 2;

  const brandTabs = uploadPanel.querySelector(".brand-tabs");
  const contentTop = (brandTabs?.getBoundingClientRect().bottom ?? uploadPanel.getBoundingClientRect().bottom)
    + brandContentGap;
  const centerY = contentTop + Math.max(0, window.innerHeight - contentTop) / 2;

  gridActions.style.left = `${gutterCenterX - sheetRect.left}px`;
  gridActions.style.top = `${centerY - sheetRect.top}px`;
}

function downloadDataFile(filename, data, mimeType = "application/json") {
  const url = URL.createObjectURL(new Blob([data], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadJsonFile(filename, payload) {
  downloadDataFile(filename, JSON.stringify(payload, null, 2));
}

function downloadTextFile(filename, text, mimeType = "text/markdown") {
  downloadDataFile(filename, text, mimeType);
}

function lockedColorExportRows() {
  if (!pinnedGridSlots.Colors.size) return [];

  return [...pinnedGridSlots.Colors.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([slot, locks]) => {
      if (!locks?.size) return null;
      const combination = colorCombinations[slot];
      const colors = combination?.colors?.length === 4
        ? combination.colors.map((color) => parseColor(color))
        : [0, 1, 2, 3].map((index) => parseColor(locks.get(index) ?? "#888888"));
      return {
        slot,
        source: combination?.source ?? "Pinned",
        colors,
        swatches: colorSwatchesFromLocks(locks),
      };
    })
    .filter(Boolean);
}

function lockedLogoExportRows() {
  return orderedPinnedValues(pinnedGridSlots.Logos).map((id) => {
    const logo = uploadedLogos.get(id);
    if (!logo?.markup) return null;
    return { id: logo.id, name: logo.name, markup: logo.markup };
  }).filter(Boolean);
}

function lockedTypefaceExportRows() {
  const faces = getTypefaces();
  return orderedPinnedValues(pinnedGridSlots.Type).map((key) => {
    const face = faces.find((entry) => typefaceLoadKey(entry) === key);
    return typefaceExportRecord(face);
  }).filter(Boolean);
}

function lockedLockupExportRows() {
  const faces = getTypefaces();
  return orderedPinnedValues(pinnedGridSlots.Lockups).map((combination) => {
    const face = faces[combination.typeIndex];
    const uploaded = uploadedLogos.get(combination.logoId);
    const logo = uploaded
      ? { id: uploaded.id, name: uploaded.name, markup: uploaded.markup }
      : {
        id: combination.logoId,
        name: logoName(combination.logoId),
        markup: logoMarkup(combination.logoId),
      };
    return {
      logoId: combination.logoId,
      typeIndex: combination.typeIndex,
      typeface: typefaceExportRecord(face),
      logo: logo.markup ? logo : null,
    };
  });
}

function designMdColorNames(hexes) {
  const names = {};
  for (const hex of hexes) {
    const key = colorNameKey(hex);
    const name = colorNameCache.get(key);
    if (name) names[key] = name;
  }
  return names;
}

function collectDesignMdContext() {
  const colors = lockedColorExportRows();
  const logos = lockedLogoExportRows().map(({ id, name }) => ({ id, name }));
  const typefacesLocked = lockedTypefaceExportRows();
  const lockups = lockedLockupExportRows().map((entry) => ({
    logoId: entry.logoId,
    logo: entry.logo ? { id: entry.logo.id, name: entry.logo.name } : null,
    typeface: entry.typeface,
  }));

  const hexes = [
    currentPalette.ink,
    currentPalette.paper,
    ...colors.flatMap((row) => row.colors ?? []),
  ];

  return {
    name: "Brandy",
    description: "Design tokens generated from locked Brandy brand selections.",
    palette: {
      ink: parseColor(currentPalette.ink),
      paper: parseColor(currentPalette.paper),
      source: currentPalette.source,
    },
    colors,
    logos,
    typefaces: typefacesLocked,
    lockups,
    colorNames: designMdColorNames(hexes),
  };
}

function downloadDesignMdCompanion() {
  const markdown = buildDesignMd(collectDesignMdContext());
  // Slight delay helps browsers that coalesce same-tick multi-downloads.
  window.setTimeout(() => {
    downloadTextFile(designMdFilename("Brandy"), markdown, "text/markdown;charset=utf-8");
  }, 120);
}

function clearLockedForTab(tab) {
  const pinnedMap = pinnedGridSlots[tab];
  if (!pinnedMap?.size) {
    setStatus("No locked items");
    return;
  }

  pinnedMap.clear();
  if (tab === "Colors") {
    renderColorGrid();
  } else if (tab === "Logos") {
    applyLogosPinnedOrder();
  } else if (tab === "Type") {
    applyTypePinnedOrder();
  } else if (tab === "Lockups") {
    renderLockupGrid();
  }
  setStatus("Cleared locked items");
}

const LOCKED_EXPORT_VERSION = 1;
const LOCKED_EXPORT_TABS = new Set(["Colors", "Logos", "Type", "Lockups"]);

function lockedExportPayload(tab, locked) {
  return { version: LOCKED_EXPORT_VERSION, tab, locked };
}

function nothingLockedToExport() {
  setStatus("Nothing locked to export");
}

function typefaceExportRecord(face) {
  if (!face) return null;
  return {
    id: face.id,
    family: face.family,
    weight: face.weight,
    loader: face.loader,
  };
}

function findTypefaceIndexByRecord(record) {
  if (!record || typeof record !== "object") return -1;
  const faces = getTypefaces();
  const weight = Number(record.weight);
  return faces.findIndex((face) => (
    face.id === record.id
    && face.loader === record.loader
    && Number(face.weight) === weight
  ));
}

function colorSwatchesFromLocks(locks) {
  const swatches = {};
  for (const [swatchIndex, hex] of locks.entries()) {
    swatches[String(swatchIndex)] = parseColor(hex);
  }
  return swatches;
}

function locksFromColorSwatches(swatches, colors = []) {
  const locks = new Map();
  if (swatches && typeof swatches === "object" && !Array.isArray(swatches)) {
    for (const [key, hex] of Object.entries(swatches)) {
      const swatchIndex = Number(key);
      if (!Number.isInteger(swatchIndex) || swatchIndex < 0 || swatchIndex > 3) continue;
      locks.set(swatchIndex, parseColor(hex));
    }
  }
  if (!locks.size && Array.isArray(colors) && colors.length === 4) {
    colors.forEach((color, swatchIndex) => {
      locks.set(swatchIndex, parseColor(color));
    });
  }
  return locks;
}

function exportLogos() {
  const locked = lockedLogoExportRows();
  if (!locked.length) {
    nothingLockedToExport();
    return;
  }

  downloadJsonFile("brandy-logos-locked.json", lockedExportPayload("Logos", locked));
  downloadDesignMdCompanion();
  setStatus(`Exported ${locked.length} locked ${locked.length === 1 ? "logo" : "logos"}`);
}

function exportTypefaces() {
  const locked = lockedTypefaceExportRows();
  if (!locked.length) {
    nothingLockedToExport();
    return;
  }

  downloadJsonFile("brandy-type-locked.json", lockedExportPayload("Type", locked));
  downloadDesignMdCompanion();
  setStatus(`Exported ${locked.length} locked ${locked.length === 1 ? "typeface" : "typefaces"}`);
}

function exportColors() {
  const locked = lockedColorExportRows();
  if (!locked.length) {
    nothingLockedToExport();
    return;
  }

  downloadJsonFile("brandy-colors-locked.json", lockedExportPayload("Colors", locked));
  downloadDesignMdCompanion();
  setStatus(`Exported ${locked.length} locked color ${locked.length === 1 ? "row" : "rows"}`);
}

function exportLockups() {
  const locked = lockedLockupExportRows();
  if (!locked.length) {
    nothingLockedToExport();
    return;
  }

  downloadJsonFile("brandy-lockups-locked.json", lockedExportPayload("Lockups", locked));
  downloadDesignMdCompanion();
  setStatus(`Exported ${locked.length} locked ${locked.length === 1 ? "lockup" : "lockups"}`);
}

async function readLockedExportFile(file, expectedTab) {
  const text = await file.text();
  const payload = JSON.parse(text);
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid export file");
  }

  if (payload.tab != null && payload.tab !== expectedTab) {
    throw new Error(`Expected ${expectedTab} export`);
  }

  const locked = Array.isArray(payload.locked)
    ? payload.locked
    : Array.isArray(payload.logos)
      ? payload.logos
      : Array.isArray(payload.typefaces)
        ? payload.typefaces
        : Array.isArray(payload.combinations)
          ? payload.combinations
          : null;

  if (!Array.isArray(locked) || !locked.length) {
    throw new Error("No locked items in file");
  }

  return { ...payload, tab: expectedTab, locked };
}

function ensureLogoFromExport(logo) {
  if (!logo?.markup) return null;

  const placeholderIndex = lockupPlaceholderIndex(logo.id);
  if (placeholderIndex >= 0) {
    revealLockupCatalog();
    return logo.id;
  }

  if (logo.id && uploadedLogos.has(logo.id)) {
    return logo.id;
  }

  let id = typeof logo.id === "string" && logo.id && !uploadedLogos.has(logo.id)
    ? logo.id
    : allocateLogoId(logo.name || "imported.svg");

  if (/^\d+$/.test(String(id))) {
    id = logoId(id);
    if (uploadedLogos.has(id)) {
      id = allocateLogoId(logo.name || "imported.svg");
    } else {
      nextLogoNumber = Math.max(nextLogoNumber, Number(id) + 1);
    }
  }

  const markup = sanitizeSvgMarkup(logo.markup, id);
  uploadedLogos.set(id, { id, name: logo.name || id, markup });
  const exists = [...grid.querySelectorAll(".logo-tile")].some((tile) => tile.dataset.logoId === id);
  if (!exists) {
    createLogoTile(id, logo.name || id, grid.children.length);
  }
  return id;
}

function ensureTypefaceFromExport(record) {
  if (!record || typeof record !== "object") return -1;

  let index = findTypefaceIndexByRecord(record);
  if (index >= 0) return index;

  if (record.loader === "local") {
    // Custom uploads need the font file already loaded; metadata alone cannot recreate them.
    return -1;
  }

  revealTypeCatalog();
  return findTypefaceIndexByRecord(record);
}

async function importColorsFromFile(file) {
  const payload = await readLockedExportFile(file, "Colors");
  ensureColorCombinations();

  const imported = payload.locked.map((entry) => {
    const colors = Array.isArray(entry?.colors)
      ? entry.colors
      : Array.isArray(entry)
        ? entry
        : null;
    if (!Array.isArray(colors) || colors.length !== 4) {
      throw new Error("Each locked color row must include 4 colors");
    }
    const normalized = colors.map((color) => parseColor(color));
    const locks = locksFromColorSwatches(entry?.swatches, normalized);
    if (!locks.size) {
      throw new Error("Each locked color row must include swatch locks");
    }
    return {
      colors: normalized,
      source: typeof entry?.source === "string" ? entry.source : "Pinned",
      locks,
    };
  });

  const nextCombinations = colorCombinations.slice();
  while (nextCombinations.length < colorCombinationCount) {
    nextCombinations.push(generateColorCombination());
  }

  pinnedGridSlots.Colors.clear();
  imported.forEach((entry, index) => {
    nextCombinations[index] = { colors: entry.colors, source: entry.source };
    pinnedGridSlots.Colors.set(index, entry.locks);
  });

  colorCombinations = nextCombinations.slice(0, colorCombinationCount);
  colorRowPool.clear();
  colorGrid.replaceChildren();
  colorGridWindow = { startIndex: -1, endIndex: -1, rowHeight: 0, rowStride: 0 };
  applyColorsPinnedOrder();
  if (!colorRowPool.size) {
    updateColorGridWindow(true);
  }
  setStatus(`Imported ${imported.length} locked color ${imported.length === 1 ? "row" : "rows"}`);
}

async function importLogosFromFile(file) {
  const payload = await readLockedExportFile(file, "Logos");
  const restoredIds = [];

  for (const entry of payload.locked) {
    if (!entry?.markup) {
      throw new Error("Each locked logo must include SVG markup");
    }
    const id = ensureLogoFromExport(entry);
    if (id) restoredIds.push(id);
  }

  if (!restoredIds.length) {
    throw new Error("No logos restored");
  }

  resetPinnedMap(pinnedGridSlots.Logos, restoredIds);
  updateUploadUi();
  syncBrandTabView();
  applyLogosPinnedOrder();
  syncLogoGridPresentation();
  setStatus(`Imported ${restoredIds.length} locked ${restoredIds.length === 1 ? "logo" : "logos"}`);
}

async function importTypefacesFromFile(file) {
  const payload = await readLockedExportFile(file, "Type");
  const needsCatalog = payload.locked.some((entry) => entry?.loader && entry.loader !== "local");
  if (needsCatalog) revealTypeCatalog();

  const keys = [];
  for (const entry of payload.locked) {
    const index = ensureTypefaceFromExport(entry);
    if (index < 0) continue;
    const face = getTypefaces()[index];
    if (face) keys.push(typefaceLoadKey(face));
  }

  if (!keys.length) {
    throw new Error("No typefaces restored");
  }

  resetPinnedMap(pinnedGridSlots.Type, keys);
  resetTypeDisplayOrder();
  applyTypePinnedOrder();
  syncBrandTabView();
  setStatus(`Imported ${keys.length} locked ${keys.length === 1 ? "typeface" : "typefaces"}`);
}

async function importLockupsFromFile(file) {
  const payload = await readLockedExportFile(file, "Lockups");
  const combinations = [];

  for (const entry of payload.locked) {
    if (!entry || typeof entry !== "object") {
      throw new Error("Invalid lockup entry");
    }

    let nextLogoId = typeof entry.logoId === "string" ? entry.logoId : null;
    if (entry.logo?.markup) {
      nextLogoId = ensureLogoFromExport({ ...entry.logo, id: entry.logo.id || nextLogoId }) || nextLogoId;
    } else if (lockupPlaceholderIndex(nextLogoId) >= 0) {
      revealLockupCatalog();
    }

    if (!nextLogoId) {
      throw new Error("Each lockup must include a logoId");
    }

    let typeIndex = Number.isFinite(entry.typeIndex) ? entry.typeIndex : -1;
    if (entry.typeface) {
      const resolved = ensureTypefaceFromExport(entry.typeface);
      if (resolved >= 0) typeIndex = resolved;
    }
    if (!Number.isFinite(typeIndex) || typeIndex < 0) {
      throw new Error("Each lockup must include a resolvable typeface");
    }

    combinations.push({ logoId: nextLogoId, typeIndex });
  }

  if (!combinations.length) {
    throw new Error("No lockups restored");
  }

  if (!typeCatalogRevealed && uploadedTypefaces.length === 0) {
    revealTypeCatalog();
  }

  const nextCombinations = Array.from({ length: lockupCombinationCount }, (_, index) => {
    const source = combinations[index % combinations.length];
    return { logoId: source.logoId, typeIndex: source.typeIndex };
  });
  combinations.forEach((combination, index) => {
    nextCombinations[index] = { ...combination };
  });
  lockupCombinations = nextCombinations;
  resetPinnedMap(pinnedGridSlots.Lockups, combinations);
  updateUploadUi();
  syncBrandTabView();
  applyLockupsPinnedOrder();
  setStatus(`Imported ${combinations.length} locked ${combinations.length === 1 ? "lockup" : "lockups"}`);
}

async function importLockedForTab(tab, file) {
  if (tab === "Colors") await importColorsFromFile(file);
  else if (tab === "Logos") await importLogosFromFile(file);
  else if (tab === "Type") await importTypefacesFromFile(file);
  else if (tab === "Lockups") await importLockupsFromFile(file);
}

function importForTab(tab) {
  if (!LOCKED_EXPORT_TABS.has(tab)) return;
  pendingImportTab = tab;
  lockedImportInput?.click();
}

function exportForTab(tab) {
  if (tab === "Logos") exportLogos();
  else if (tab === "Type") exportTypefaces();
  else if (tab === "Colors") exportColors();
  else if (tab === "Lockups") exportLockups();
}

function handleGridAction(tab, action) {
  if (action === "clear-locked") {
    clearLockedForTab(tab);
    return;
  }
  if (action === "toggle-bw") {
    toggleDefaultPalette();
    return;
  }
  if (action === "import") {
    importForTab(tab);
    return;
  }
  if (action === "export") {
    exportForTab(tab);
  }
}

function applyLogoGridFilter() {
  const filter = gridFilterForTab("Logos");
  const pinnedIds = pinnedLogoIds();
  grid.querySelectorAll(".logo-tile").forEach((tile) => {
    tile.hidden = filter === "locked" && !pinnedIds.has(tile.dataset.logoId);
  });
}

function resetFilteredGridWindow(tab) {
  if (tab === "Colors") {
    colorRowPool.clear();
    colorGrid.replaceChildren();
    colorGridWindow = { startIndex: -1, endIndex: -1, rowHeight: 0, rowStride: 0 };
    updateColorGridWindow(true);
    return;
  }

  if (tab === "Type") {
    typeTilePool.clear();
    typeGrid.replaceChildren();
    typeGridWindow = { columns: 0, cellSize: 0, startIndex: -1, endIndex: -1 };
    updateTypeGridWindow(true);
    return;
  }

  if (tab === "Lockups") {
    lockupTilePool.clear();
    lockupGrid.replaceChildren();
    lockupGridWindow = { columns: 0, cellSize: 0, startIndex: -1, endIndex: -1 };
    updateLockupGridWindow(true);
    return;
  }

  if (tab === "Logos") {
    applyLogoGridFilter();
  }
}

function setGridFilter(tab, filter) {
  if (gridFilterForTab(tab) === filter) return;
  gridFilterState[tab] = filter;
  syncGridFilterUi();
  resetFilteredGridWindow(tab);
  requestAnimationFrame(syncGridFiltersPosition);
  requestAnimationFrame(syncGridActionsPosition);
  requestAnimationFrame(validateKeyboardGridSelection);
}

function maybeRefreshGridFilter(tab) {
  if (gridFilterForTab(tab) === "locked") {
    resetFilteredGridWindow(tab);
  }
}

function gridLockIconMarkup(locked) {
  const body = `<path d="M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z"/>`;
  const shackle = locked
    ? `<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M8 11V8a4 4 0 0 1 8 0v3"/>`
    : `<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M8 11V8a4 4 0 1 1 8 0"/>`;
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${shackle}${body}</svg>`;
}

function syncGridLockControl(container, tab, slotIndex) {
  const button = container.querySelector(".grid-lock-control");
  if (!button) return;
  const locked = tab === "Logos"
    ? isLogoPinned(container.dataset.logoId)
    : pinnedGridSlots[tab].has(slotIndex);
  container.classList.toggle("is-grid-locked", locked);
  button.classList.toggle("is-locked", locked);
  button.setAttribute("aria-pressed", String(locked));
  button.setAttribute("aria-label", locked ? "Unlock position" : "Lock in place");
  button.innerHTML = gridLockIconMarkup(locked);
  if (tab === "Type" || tab === "Lockups") {
    positionGridLockControl(container);
  }
}

function gridItemInkTop(tile) {
  const tileRect = tile.getBoundingClientRect();
  const specimen = tile.querySelector(".type-specimen");
  if (specimen) {
    const range = document.createRange();
    range.selectNodeContents(specimen);
    const rect = range.getBoundingClientRect();
    if (rect.height > 0) return rect.top - tileRect.top;
  }

  const mark = tile.querySelector(".lockup-mark");
  const text = tile.querySelector(".lockup-text");
  if (mark || text) {
    let top = Infinity;
    for (const element of [mark, text]) {
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      if (rect.height > 0) top = Math.min(top, rect.top - tileRect.top);
    }
    if (Number.isFinite(top)) return top;
  }

  return null;
}

function positionGridLockControl(tile) {
  const lock = tile.querySelector(".grid-lock-control");
  if (!lock) return;

  const tileRect = tile.getBoundingClientRect();
  if (tileRect.height <= 0) return;

  const inkTop = gridItemInkTop(tile);
  if (inkTop == null) return;

  const outlineTop = 12;
  const midY = (outlineTop + inkTop) / 2;
  lock.style.top = `${Math.round(midY)}px`;
}

function colorSwatchInkTop(swatch) {
  const label = swatch.querySelector(".color-swatch-label");
  const title = swatch.querySelector(".color-swatch-title");
  const hex = swatch.querySelector(".color-swatch-hex");
  if (!label || !title) return null;

  const wasHidden = getComputedStyle(label).display === "none";
  if (wasHidden) swatch.classList.add("is-measuring-label");

  const swatchRect = swatch.getBoundingClientRect();
  const titleRect = title.getBoundingClientRect();
  let top = titleRect.height > 0 ? titleRect.top - swatchRect.top : null;
  if (top == null && hex) {
    const hexRect = hex.getBoundingClientRect();
    if (hexRect.height > 0) top = hexRect.top - swatchRect.top;
  }

  if (wasHidden) swatch.classList.remove("is-measuring-label");

  return top;
}

function getColorSwatchLockControl(swatch) {
  const locks = swatch.querySelectorAll(".grid-lock-control");
  for (let index = 1; index < locks.length; index += 1) {
    locks[index].remove();
  }
  return locks[0] ?? null;
}

function positionColorSwatchLockControl(swatch) {
  const lock = getColorSwatchLockControl(swatch);
  if (!lock) return;

  const swatchRect = swatch.getBoundingClientRect();
  if (swatchRect.height <= 0) {
    swatch.classList.remove("is-lock-positioned");
    return;
  }

  const inkTop = colorSwatchInkTop(swatch);
  if (inkTop == null) {
    swatch.classList.remove("is-lock-positioned");
    return;
  }

  lock.style.top = `${Math.round(inkTop / 2)}px`;
  swatch.classList.add("is-lock-positioned");
}

function positionColorRowLockControls(row) {
  row.querySelectorAll(".color-swatch").forEach((swatch) => {
    positionColorSwatchLockControl(swatch);
  });
}

function scheduleColorRowLockReposition(sourceIndices) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      for (const index of sourceIndices) {
        const row = colorRowPool.get(index);
        if (row) positionColorRowLockControls(row);
      }
    });
  });
}

function isColorSwatchLocked(rowIndex, swatchIndex) {
  return pinnedGridSlots.Colors.get(rowIndex)?.has(swatchIndex) ?? false;
}

function isColorRowFullyLocked(rowIndex) {
  const locks = pinnedGridSlots.Colors.get(rowIndex);
  if (!locks || locks.size < 4) return false;
  return [0, 1, 2, 3].every((swatchIndex) => locks.has(swatchIndex));
}

function isColorRowPinned(rowIndex) {
  const locks = pinnedGridSlots.Colors.get(rowIndex);
  return locks != null && locks.size > 0;
}

/** Unique locked swatch hexes across all color rows (Colors pin map values). */
function getLockedColorHexes() {
  const colors = [];
  const seen = new Set();
  for (const locks of pinnedGridSlots.Colors.values()) {
    for (const hex of locks.values()) {
      const normalized = parseColor(hex);
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      colors.push(normalized);
    }
  }
  return colors;
}

/**
 * Unique hexes from color rows matching the active Colors filter.
 * Locked uses pinned swatches; generator filters use row colors where source matches.
 */
function getActiveColorPool() {
  ensureColorCombinations();
  const filter = gridFilterForTab("Colors");

  if (filter === "all") {
    return { filter: "all", colors: null, combinations: colorCombinations };
  }

  if (filter === "locked") {
    return { filter, colors: getLockedColorHexes(), combinations: null };
  }

  const colors = [];
  const seen = new Set();
  const combinations = [];
  for (const index of getColorRowSourceIndices()) {
    const combination = colorCombinations[index];
    if (!combination?.colors?.length) continue;
    combinations.push(combination);
    for (const hex of combination.colors) {
      const normalized = parseColor(hex);
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      colors.push(normalized);
    }
  }
  return { filter, colors, combinations };
}

/** Catalog typeface indices available to Lockups, constrained by the Type filter. */
function getActiveTypefaceIndices() {
  const faces = getTypefaces();
  const all = faces.map((_, index) => index);
  if (!all.length) return [];

  const filter = gridFilterForTab("Type");
  if (filter === "all") return all;
  if (filter === "locked") {
    return all.filter((index) => isTypefacePinned(faces[index]));
  }
  if (filter === "editors-picks") {
    return all.filter((index) => isEditorPickTypeface(faces[index]));
  }
  return all.filter((index) => faces[index].loader === filter);
}

/** Logo ids available to Lockups, constrained by the Logos filter. */
function getActiveLogoIds() {
  let logos;
  if (uploadedLogos.size) {
    logos = getLogoIds();
  } else if (lockupCatalogRevealed) {
    logos = coolshapePlaceholders.map((_, index) => `lockup-ph:${index}`);
  } else {
    return [];
  }

  if (gridFilterForTab("Logos") === "locked") {
    const logoSet = new Set(logos);
    return orderedPinnedValues(pinnedGridSlots.Logos).filter((id) => logoSet.has(id));
  }

  return logos;
}

function emptyColorsFilterStatus(continuation) {
  const filter = gridFilterForTab("Colors");
  if (filter === "all") return null;
  const label = filter === "locked" ? "locked colors" : `${filter} colors`;
  return continuation ? `No ${label} — ${continuation}` : `No ${label}`;
}

function getColorRowLockControl(row) {
  return row.querySelector(":scope > .grid-lock-control");
}

function syncColorSwatchLockControl(swatch, rowIndex, swatchIndex) {
  const button = getColorSwatchLockControl(swatch);
  if (!button) return;
  const locked = isColorSwatchLocked(rowIndex, swatchIndex);
  swatch.classList.toggle("is-grid-locked", locked);
  button.classList.toggle("is-locked", locked);
  button.setAttribute("aria-pressed", String(locked));
  button.setAttribute("aria-label", locked ? "Unlock color" : "Lock color in place");
  button.innerHTML = gridLockIconMarkup(locked);
  positionColorSwatchLockControl(swatch);
}

function syncColorRowLockControl(row, rowIndex) {
  const button = getColorRowLockControl(row);
  if (!button) return;
  const locked = isColorRowFullyLocked(rowIndex);
  row.classList.toggle("is-grid-locked", locked);
  button.classList.toggle("is-locked", locked);
  button.setAttribute("aria-pressed", String(locked));
  button.setAttribute("aria-label", locked ? "Unlock row" : "Lock row in place");
  button.innerHTML = gridLockIconMarkup(locked);
}

function syncColorRowLockControls(row, slotIndex) {
  row.querySelectorAll(".color-swatch").forEach((swatch, swatchIndex) => {
    syncColorSwatchLockControl(swatch, slotIndex, swatchIndex);
  });
  syncColorRowLockControl(row, slotIndex);
}

function attachColorRowLockControl(row) {
  const existing = getColorRowLockControl(row);
  if (existing) {
    syncColorRowLockControl(row, Number(row.dataset.colorIndex));
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "grid-lock-control";
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const rowIndex = Number(row.dataset.colorIndex);
    const combination = colorCombinations[rowIndex];
    if (!combination?.colors?.length) return;

    if (isColorRowFullyLocked(rowIndex)) {
      pinnedGridSlots.Colors.delete(rowIndex);
      setStatus("Unlocked");
    } else {
      const nextLocks = pinnedGridSlots.Colors.get(rowIndex) ?? new Map();
      combination.colors.forEach((color, swatchIndex) => {
        nextLocks.set(swatchIndex, parseColor(color));
      });
      pinnedGridSlots.Colors.set(rowIndex, nextLocks);
      setStatus("Locked in place");
    }

    applyColorsPinnedOrder();
    button.blur();
  });

  row.prepend(button);
  syncColorRowLockControl(row, Number(row.dataset.colorIndex));
}

function attachColorSwatchLockControl(swatch, row, swatchIndex) {
  const existing = getColorSwatchLockControl(swatch);
  if (existing) {
    syncColorSwatchLockControl(swatch, Number(row.dataset.colorIndex), swatchIndex);
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "grid-lock-control";
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const rowIndex = Number(row.dataset.colorIndex);
    const rowLocks = pinnedGridSlots.Colors.get(rowIndex);

    if (rowLocks?.has(swatchIndex)) {
      rowLocks.delete(swatchIndex);
      if (rowLocks.size === 0) pinnedGridSlots.Colors.delete(rowIndex);
      setStatus("Unlocked");
    } else {
      const combination = colorCombinations[rowIndex];
      const color = combination?.colors?.[swatchIndex];
      if (color == null) return;
      const nextLocks = rowLocks ?? new Map();
      nextLocks.set(swatchIndex, parseColor(color));
      pinnedGridSlots.Colors.set(rowIndex, nextLocks);
      setStatus("Locked in place");
    }

    applyColorsPinnedOrder();
    button.blur();
  });

  swatch.append(button);
  syncColorSwatchLockControl(swatch, Number(row.dataset.colorIndex), swatchIndex);
}

function attachGridLockControl(container, tab, getSlotIndex, getPinValue) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "grid-lock-control";
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const map = pinnedGridSlots[tab];
    const value = getPinValue();
    if (value == null) return;
    const ordered = orderedPinnedValues(map);
    const existing = pinValueIndex(value, ordered);
    if (existing >= 0) {
      resetPinnedMap(
        map,
        ordered.filter((entry) => !pinValuesEqual(entry, value)),
      );
      setStatus("Unlocked");
    } else {
      resetPinnedMap(map, [...ordered, clonePinValue(value)]);
      setStatus("Locked in place");
    }
    applyGridPinnedOrder(tab);
    button.blur();
  });

  container.append(button);
  syncGridLockControl(container, tab, getSlotIndex());
}

function syncLogoTileLockControls() {
  [...grid.querySelectorAll(".logo-tile")].forEach((tile, slotIndex) => {
    syncGridLockControl(tile, "Logos", slotIndex);
  });
}

function shuffleArray(values) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values;
}

function permuteIdsWithPinnedSlots(slotCount, pinnedMap, allIds) {
  const result = new Array(slotCount);
  const used = new Set();

  for (const [slot, id] of pinnedMap) {
    if (slot >= 0 && slot < slotCount && allIds.includes(id)) {
      result[slot] = id;
      used.add(id);
    }
  }

  const remaining = shuffleArray(allIds.filter((id) => !used.has(id)));
  let next = 0;
  for (let slot = 0; slot < slotCount; slot += 1) {
    if (result[slot]) continue;
    result[slot] = remaining[next];
    next += 1;
  }
  return result;
}

function orderedPinnedValues(pinnedMap) {
  return [...pinnedMap.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([, value]) => value);
}

function pinValuesEqual(left, right) {
  if (left === right) return true;
  if (left && right && typeof left === "object" && typeof right === "object") {
    return JSON.stringify(left) === JSON.stringify(right);
  }
  return false;
}

function clonePinValue(value) {
  return value && typeof value === "object" ? structuredClone(value) : value;
}

function resetPinnedMap(pinnedMap, orderedValues) {
  pinnedMap.clear();
  orderedValues.forEach((value, index) => {
    pinnedMap.set(index, clonePinValue(value));
  });
}

function pinValueIndex(value, orderedValues) {
  return orderedValues.findIndex((entry) => pinValuesEqual(entry, value));
}

function reorderItemsPinnedFirst(items, getPinValue, pinnedMap) {
  const pinnedOrdered = orderedPinnedValues(pinnedMap);
  const pinnedItems = pinnedOrdered
    .map((pinValue) => items.find((item) => pinValuesEqual(getPinValue(item), pinValue)))
    .filter(Boolean);
  const unpinnedItems = items.filter((item) => pinValueIndex(getPinValue(item), pinnedOrdered) < 0);
  return pinnedItems.concat(unpinnedItems);
}

function applyLogosPinnedOrder() {
  const tiles = [...grid.querySelectorAll(".logo-tile")];
  if (!tiles.length) return;

  reorderItemsPinnedFirst(
    tiles,
    (tile) => tile.dataset.logoId,
    pinnedGridSlots.Logos,
  ).forEach((tile) => {
    grid.append(tile);
  });

  syncLogoTileLockControls();
  updateFaviconForTopLogo();
  scheduleLogoShaderMask();
  schedulePerIconShaderSync();
  applyLogoGridFilter();
  maybeRefreshGridFilter("Logos");
}

function applyTypePinnedOrder() {
  const faces = getTypefaces();
  if (!faces.length) return;

  const currentOrder = typeDisplayOrder?.length === faces.length
    ? typeDisplayOrder
    : faces.map((_, index) => index);
  const items = currentOrder.map((catalogIndex) => ({
    catalogIndex,
    key: typefaceLoadKey(faces[catalogIndex]),
  }));

  typeDisplayOrder = reorderItemsPinnedFirst(
    items,
    (item) => item.key,
    pinnedGridSlots.Type,
  ).map((item) => item.catalogIndex);

  refreshTypeGrid();
  maybeRefreshGridFilter("Type");
}

function applyColorsPinnedOrder() {
  if (!colorCombinations.length) return;

  const lockedRows = [];
  const unlockedRows = [];

  for (let index = 0; index < colorCombinations.length; index += 1) {
    if (isColorRowPinned(index)) {
      lockedRows.push(index);
    } else {
      unlockedRows.push(index);
    }
  }

  const newOrder = lockedRows.concat(unlockedRows);
  const unchanged = newOrder.every((oldIndex, newIndex) => oldIndex === newIndex);
  if (unchanged) {
    for (const [index, row] of colorRowPool) {
      syncColorRowLockControls(row, index);
    }
    return;
  }

  const nextCombinations = newOrder.map((oldIndex) => colorCombinations[oldIndex]);

  const oldToNew = new Map();
  newOrder.forEach((oldIndex, newIndex) => {
    oldToNew.set(oldIndex, newIndex);
  });

  const nextLocks = new Map();
  for (const [oldIndex, locks] of pinnedGridSlots.Colors) {
    const newIndex = oldToNew.get(oldIndex);
    if (newIndex != null) {
      nextLocks.set(newIndex, locks);
    }
  }

  colorCombinations = nextCombinations;
  pinnedGridSlots.Colors.clear();
  for (const [newIndex, locks] of nextLocks) {
    pinnedGridSlots.Colors.set(newIndex, locks);
  }

  colorRowPool.clear();
  colorGrid.replaceChildren();
  colorGridWindow = { startIndex: -1, endIndex: -1, rowHeight: 0, rowStride: 0 };
  updateColorGridWindow(true);
  maybeRefreshGridFilter("Colors");
}

function applyLockupsPinnedOrder() {
  if (!lockupCombinations.length) return;

  lockupCombinations = reorderItemsPinnedFirst(
    lockupCombinations,
    (combination) => ({ logoId: combination.logoId, typeIndex: combination.typeIndex }),
    pinnedGridSlots.Lockups,
  );
  lockupTilePool.clear();
  lockupGrid.replaceChildren();
  lockupGridWindow = { columns: 0, cellSize: 0, startIndex: -1, endIndex: -1 };
  updateLockupGridWindow(true);
  maybeRefreshGridFilter("Lockups");
}

function applyGridPinnedOrder(tab) {
  if (tab === "Logos") applyLogosPinnedOrder();
  else if (tab === "Type") applyTypePinnedOrder();
  else if (tab === "Colors") applyColorsPinnedOrder();
  else if (tab === "Lockups") applyLockupsPinnedOrder();
}

function logoTileSlotIndex(tile) {
  return [...grid.querySelectorAll(".logo-tile")].indexOf(tile);
}
const brandContentGap = 72;

function syncBrandGridOffset() {
  document.documentElement.style.setProperty("--brand-grid-offset", `${brandContentGap}px`);
  syncGridFilterUi();
  syncGridFiltersPosition();
  syncGridActionsUi();
  syncGridActionsPosition();
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

function lockupPlaceholderIndex(id) {
  const match = String(id).match(/^lockup-ph:(\d+)$/);
  return match ? Number(match[1]) : -1;
}

function logoMarkup(id) {
  const placeholderIndex = lockupPlaceholderIndex(id);
  if (placeholderIndex >= 0) {
    return coolshapePlaceholders[placeholderIndex]?.markup ?? "";
  }
  return uploadedLogos.get(logoId(id))?.markup ?? "";
}

function logoName(id) {
  const placeholderIndex = lockupPlaceholderIndex(id);
  if (placeholderIndex >= 0) {
    return coolshapePlaceholders[placeholderIndex]?.name ?? `Placeholder ${placeholderIndex + 1}`;
  }
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
  return window.matchMedia("(max-width: 720px)").matches ? 2 : 4;
}

function updateGridColumns() {
  document.documentElement.style.setProperty("--grid-columns", String(gridBaseColumns()));
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
  else if (activeBrandTab === "Lockups") requestAnimationFrame(() => updateLockupGridWindow(true));
  else requestAnimationFrame(syncBrandGridOffset);
}

function setFullscreenLogoScale(nextScale) {
  fullscreenLogoScale = clampLogoScale(nextScale);
  document.documentElement.style.setProperty("--fullscreen-logo-scale", String(fullscreenLogoScale));
  if (!dialog.open) return;
  if (previewMode === "type") {
    scheduleFullscreenTypeLayout();
  } else if (isFullscreenLockup()) {
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

function getTypefacesForGrid() {
  const faces = getTypefaces();
  if (!typeDisplayOrder || typeDisplayOrder.length !== faces.length) {
    return faces;
  }
  return typeDisplayOrder.map((index) => faces[index]).filter(Boolean);
}

function resetTypeDisplayOrder() {
  typeDisplayOrder = null;
}

function shuffleTypeDisplayOrder() {
  const faces = getTypefaces();
  const order = new Array(faces.length);
  const used = new Set();

  for (const [slot, key] of pinnedGridSlots.Type) {
    const catalogIndex = faces.findIndex((face) => typefaceLoadKey(face) === key);
    if (catalogIndex >= 0 && slot < faces.length) {
      order[slot] = catalogIndex;
      used.add(catalogIndex);
    }
  }

  const available = shuffleArray(faces.map((_, index) => index).filter((index) => !used.has(index)));
  let next = 0;
  for (let slot = 0; slot < faces.length; slot += 1) {
    if (order[slot] !== undefined) continue;
    order[slot] = available[next];
    next += 1;
  }

  typeDisplayOrder = order;
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

  fontSize = Math.max(1, Math.round(fontSize));
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

  positionGridLockControl(tile);
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
  return lockupGridColumns();
}

function lockupGridColumns() {
  if (window.matchMedia("(max-width: 720px)").matches) return 2;
  return 4;
}

function measureTypeGridMetrics() {
  const indices = getTypeGridSourceIndices();
  const columns = Math.max(1, typeGridColumns());
  const width = typeGrid.clientWidth || logoSheet.clientWidth || window.innerWidth;
  const cellSize = width / columns;
  const rows = Math.ceil(indices.length / columns);
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

  button.addEventListener("click", () => {
    if (mobileDialogMedia.matches) return;
    openTypeDialog(index);
  });

  button.append(specimen);
  tile.append(button);
  attachGridLockControl(
    tile,
    "Type",
    () => Number(tile.dataset.typeIndex),
    () => typefaceLoadKey(getTypefacesForGrid()[Number(tile.dataset.typeIndex)]),
  );
  positionTypeTile(tile, index, columns, cellSize);
  ensureTypefaceLoaded(face).then(() => scheduleFitTypeTile(tile));
  return tile;
}

function updateTypeGridWindow(force = false) {
  if (typeGrid.hidden || activeBrandTab !== "Type") return;

  const indices = getTypeGridSourceIndices();
  if (!indices.length) {
    typeGrid.style.height = "0px";
    for (const [index, tile] of typeTilePool) {
      tile.remove();
      typeTilePool.delete(index);
    }
    return;
  }

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
  const faces = getTypefacesForGrid();
  const startIndex = startRow * metrics.columns;
  const endIndex = Math.min(indices.length, (endRow + 1) * metrics.columns);

  const sameWindow = !force
    && startIndex === typeGridWindow.startIndex
    && endIndex === typeGridWindow.endIndex
    && metrics.columns === typeGridWindow.columns
    && Math.abs(metrics.cellSize - typeGridWindow.cellSize) < 0.5;

  if (sameWindow) return;

  const visibleSourceIndices = new Set(indices.slice(startIndex, endIndex));

  for (const [index, tile] of typeTilePool) {
    if (!visibleSourceIndices.has(index)) {
      tile.remove();
      typeTilePool.delete(index);
    }
  }

  for (let displayIndex = startIndex; displayIndex < endIndex; displayIndex += 1) {
    const sourceIndex = indices[displayIndex];
    const face = faces[sourceIndex];
    if (!face) continue;

    let tile = typeTilePool.get(sourceIndex);
    if (tile) {
      positionTypeTile(tile, displayIndex, metrics.columns, metrics.cellSize);
      syncGridLockControl(tile, "Type", sourceIndex);
      continue;
    }

    tile = createTypeTile(face, sourceIndex, metrics.columns, metrics.cellSize);
    typeTilePool.set(sourceIndex, tile);
    typeGrid.append(tile);
    positionTypeTile(tile, displayIndex, metrics.columns, metrics.cellSize);
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
  const combinations = new Array(colorCombinationCount);
  const previous = colorCombinations;

  for (let index = 0; index < colorCombinationCount; index += 1) {
    const locks = pinnedGridSlots.Colors.get(index);
    if (!locks?.size) continue;
    if (index < 0 || index >= colorCombinationCount) continue;

    const combination = generateColorCombinationWithLocks(locks, previous[index]);
    combinations[index] = combination;
    used.add(combination.colors.join("/"));
  }

  for (let index = 0; index < colorCombinationCount; index += 1) {
    if (combinations[index]) continue;

    let combination = generateColorCombination();
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const key = combination.colors.join("/");
      if (!used.has(key)) {
        used.add(key);
        break;
      }
      combination = generateColorCombination();
    }
    combinations[index] = combination;
  }

  return combinations;
}

function measureColorGridMetrics() {
  const indices = getColorRowSourceIndices();
  const gridWidth = colorGrid.clientWidth || logoSheet.clientWidth || window.innerWidth;
  const width = gridWidth - colorSwatchGap - gridLockControlSize;
  const rowHeight = (width - colorSwatchGap * 3) / 4;
  const rowStride = rowHeight + colorSwatchGap;
  const totalHeight = indices.length > 0
    ? indices.length * rowHeight + Math.max(0, indices.length - 1) * colorSwatchGap
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
    if (swatch.dataset.colorHex === key) {
      applyColorNameToSwatch(swatch);
      positionColorSwatchLockControl(swatch);
    }
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

function prefetchVisibleColorNames(sourceIndices) {
  const colors = [];
  for (const index of sourceIndices) {
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
    if (event.target.closest(".grid-lock-control")) return;
    if (colorDragSession) finishColorDrag(colorDragSession.hasDragged);

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
      startX: event.clientX,
      startY: event.clientY,
      hasDragged: false,
      nameTimer: 0,
      onKey(event) {
        if (event.key === "Escape") {
          event.preventDefault();
          finishColorDrag(false);
        }
      },
      onScroll() {
        finishColorDrag(session.hasDragged);
      },
    };

    swatch.setPointerCapture(event.pointerId);
    colorDragSession = session;

    document.addEventListener("keydown", session.onKey, true);
    window.addEventListener("scroll", session.onScroll, true);
  });

  swatch.addEventListener("pointermove", (event) => {
    if (colorDragSession?.swatch !== swatch || !swatch.hasPointerCapture(event.pointerId)) return;
    const session = colorDragSession;
    if (!session.hasDragged) {
      const dx = event.clientX - session.startX;
      const dy = event.clientY - session.startY;
      if (Math.hypot(dx, dy) < 4) return;
      session.hasDragged = true;
      session.swatch.classList.add("is-adjusting");
    }
    syncSwatchFromPointer(session, event.clientX, event.clientY);
  });

  swatch.addEventListener("pointerup", (event) => {
    if (colorDragSession?.swatch !== swatch || !swatch.hasPointerCapture(event.pointerId)) return;
    finishColorDrag(colorDragSession.hasDragged);
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
    const rowLocks = pinnedGridSlots.Colors.get(rowIndex);
    if (rowLocks?.has(swatchIndex)) {
      rowLocks.set(swatchIndex, normalized);
    }
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

  attachColorRowLockControl(row);

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
    attachColorSwatchLockControl(swatch, row, swatchIndex);
    swatch.addEventListener("mouseenter", () => {
      ensureColorNames([swatch.dataset.colorHex]);
      positionColorSwatchLockControl(swatch);
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

  syncColorRowLockControls(row, index);

  positionColorRow(row, index, rowHeight, rowStride);
  return row;
}

function updateColorGridWindow(force = false) {
  if (colorGrid.hidden || activeBrandTab !== "Colors") return;
  if (!colorCombinations.length) return;

  if (colorDragSession && !document.body.contains(colorDragSession.swatch)) {
    colorDragSession = null;
  }

  const indices = getColorRowSourceIndices();
  if (!indices.length) {
    colorGrid.style.height = "0px";
    for (const [index, row] of colorRowPool) {
      row.remove();
      colorRowPool.delete(index);
    }
    return;
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
    indices.length,
    Math.ceil((visibleBottom + buffer) / metrics.rowStride),
  );

  const sameWindow = !force
    && startIndex === colorGridWindow.startIndex
    && endIndex === colorGridWindow.endIndex
    && Math.abs(metrics.rowHeight - colorGridWindow.rowHeight) < 0.5;

  if (sameWindow) return;

  const visibleSourceIndices = new Set(indices.slice(startIndex, endIndex));

  for (const [index, row] of colorRowPool) {
    if (!visibleSourceIndices.has(index)) {
      row.remove();
      colorRowPool.delete(index);
    }
  }

  for (let displayIndex = startIndex; displayIndex < endIndex; displayIndex += 1) {
    const sourceIndex = indices[displayIndex];
    const combination = colorCombinations[sourceIndex];
    if (!combination) continue;

    let row = colorRowPool.get(sourceIndex);
    if (row) {
      positionColorRow(row, displayIndex, metrics.rowHeight, metrics.rowStride);
      syncColorRowLockControls(row, sourceIndex);
      positionColorRowLockControls(row);
      continue;
    }

    row = createColorRow(combination, sourceIndex, metrics.rowHeight, metrics.rowStride);
    colorRowPool.set(sourceIndex, row);
    colorGrid.append(row);
    positionColorRow(row, displayIndex, metrics.rowHeight, metrics.rowStride);
    positionColorRowLockControls(row);
  }

  colorGridWindow = {
    startIndex,
    endIndex,
    rowHeight: metrics.rowHeight,
    rowStride: metrics.rowStride,
  };
  prefetchVisibleColorNames(indices.slice(startIndex, endIndex));
  const visibleSources = indices.slice(startIndex, endIndex);
  scheduleColorRowLockReposition(visibleSources);
  document.fonts?.ready?.then(() => {
    if (activeBrandTab !== "Colors" || colorGrid.hidden) return;
    scheduleColorRowLockReposition(visibleSources);
  });
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
  colorGrid.style.setProperty("--color-swatch-gap", `${colorSwatchGap}px`);
  colorCombinations = buildColorCombinations();
  colorRowPool.clear();
  colorGrid.replaceChildren();
  colorGridWindow = { startIndex: -1, endIndex: -1, rowHeight: 0, rowStride: 0 };
  bindColorGridListeners();
  updateColorGridWindow(true);
}

function getLogoIds() {
  return [...uploadedLogos.keys()];
}

function getLockupLogoIds() {
  const active = getActiveLogoIds();
  // Active Logos filter with an empty pool falls back to the full set.
  if (active.length) return active;
  if (uploadedLogos.size) return getLogoIds();
  if (lockupCatalogRevealed) {
    return coolshapePlaceholders.map((_, index) => `lockup-ph:${index}`);
  }
  return [];
}

function getLockupTypeIndices() {
  const active = getActiveTypefaceIndices();
  if (active.length) return active;
  // Active Type filter with an empty pool falls back to the full catalog.
  const faces = getTypefaces();
  return faces.map((_, index) => index);
}

function lockupsReady() {
  if (lockupCatalogRevealed) return true;
  return uploadedLogos.size > 0 && (uploadedTypefaces.length > 0 || typeCatalogRevealed);
}

function buildLockupCombinations() {
  const logos = getLockupLogoIds();
  const typeIndices = getLockupTypeIndices();
  if (!logos.length || !typeIndices.length) return [];

  const combinations = new Array(lockupCombinationCount);

  for (const [slot, combination] of pinnedGridSlots.Lockups) {
    if (slot >= 0 && slot < lockupCombinationCount) {
      combinations[slot] = { ...combination };
    }
  }

  for (let index = 0; index < lockupCombinationCount; index += 1) {
    if (combinations[index]) continue;
    combinations[index] = {
      logoId: logos[Math.floor(Math.random() * logos.length)],
      typeIndex: typeIndices[Math.floor(Math.random() * typeIndices.length)],
    };
  }
  return combinations;
}

function measureLockupGridMetrics() {
  const indices = getLockupSourceIndices();
  const columns = Math.max(1, lockupGridColumns());
  const width = lockupGrid.clientWidth || logoSheet.clientWidth || window.innerWidth;
  const cellSize = width / columns;
  const rows = Math.ceil(indices.length / columns);
  return {
    columns,
    cellSize,
    rows,
    totalHeight: rows * cellSize,
  };
}

function positionLockupTile(tile, index, columns, cellSize) {
  tile.style.left = `${(index % columns) * cellSize}px`;
  tile.style.top = `${Math.floor(index / columns) * cellSize}px`;
  tile.style.width = `${cellSize}px`;
  tile.style.height = `${cellSize}px`;
}

function lockupLabel(combination) {
  const face = getTypefaces()[combination.typeIndex];
  return `${logoName(combination.logoId)} lockup with ${face?.family ?? "type"}`;
}

function scheduleFitLockupTile(tile) {
  const index = Number(tile.dataset.lockupIndex);
  const combination = lockupCombinations[index];
  const face = combination ? getTypefaces()[combination.typeIndex] : null;

  const fit = () => {
    requestAnimationFrame(() => {
      fitLockupTile(tile);
      requestAnimationFrame(() => fitLockupTile(tile));
    });
  };

  if (face) {
    ensureTypefaceLoaded(face).then(fit);
  } else {
    fit();
  }
}

function fitLockupTiles() {
  lockupTilePool.forEach((tile) => fitLockupTile(tile));
  syncBrandGridOffset();
}

function createLockupTile(combination, index, columns, cellSize) {
  const tile = document.createElement("figure");
  const button = document.createElement("div");
  const content = document.createElement("div");
  const mark = document.createElement("span");
  const text = document.createElement("span");
  const face = getTypefaces()[combination.typeIndex];

  tile.className = "lockup-tile";
  tile.dataset.lockupIndex = String(index);
  tile.setAttribute("aria-label", lockupLabel(combination));

  button.className = "lockup-button";
  content.className = "lockup-content";
  mark.className = "lockup-mark";
  mark.innerHTML = logoMarkup(combination.logoId);
  text.className = "lockup-text";
  text.textContent = lockupText;

  if (face) {
    text.style.fontFamily = `"${face.family}", sans-serif`;
    text.style.fontWeight = String(face.weight);
  }

  content.append(mark, text);
  button.append(content);
  tile.append(button);
  tile.addEventListener("click", () => {
    if (mobileDialogMedia.matches) return;
    openLockupDialog(index);
  });

  attachGridLockControl(
    tile,
    "Lockups",
    () => Number(tile.dataset.lockupIndex),
    () => {
      const combo = lockupCombinations[Number(tile.dataset.lockupIndex)];
      return combo ? { logoId: combo.logoId, typeIndex: combo.typeIndex } : null;
    },
  );

  positionLockupTile(tile, index, columns, cellSize);
  scheduleFitLockupTile(tile);
  return tile;
}

function updateLockupGridWindow(force = false) {
  if (lockupGrid.hidden || activeBrandTab !== "Lockups") return;
  if (!lockupCombinations.length) return;

  const indices = getLockupSourceIndices();
  if (!indices.length) {
    lockupGrid.style.height = "0px";
    for (const [index, tile] of lockupTilePool) {
      tile.remove();
      lockupTilePool.delete(index);
    }
    return;
  }

  const metrics = measureLockupGridMetrics();
  if (metrics.cellSize <= 0) return;

  lockupGrid.style.height = `${metrics.totalHeight}px`;

  const rect = lockupGrid.getBoundingClientRect();
  const buffer = metrics.cellSize * 3;
  const visibleTop = Math.max(0, -rect.top);
  const visibleBottom = visibleTop + window.innerHeight;
  const startRow = Math.max(0, Math.floor((visibleTop - buffer) / metrics.cellSize));
  const endRow = Math.min(
    metrics.rows - 1,
    Math.ceil((visibleBottom + buffer) / metrics.cellSize),
  );
  const startIndex = startRow * metrics.columns;
  const endIndex = Math.min(
    indices.length,
    (endRow + 1) * metrics.columns,
  );

  const sameWindow = !force
    && startIndex === lockupGridWindow.startIndex
    && endIndex === lockupGridWindow.endIndex
    && metrics.columns === lockupGridWindow.columns
    && Math.abs(metrics.cellSize - lockupGridWindow.cellSize) < 0.5;

  if (sameWindow) return;

  const visibleSourceIndices = new Set(indices.slice(startIndex, endIndex));

  for (const [index, tile] of lockupTilePool) {
    if (!visibleSourceIndices.has(index)) {
      tile.remove();
      lockupTilePool.delete(index);
    }
  }

  for (let displayIndex = startIndex; displayIndex < endIndex; displayIndex += 1) {
    const sourceIndex = indices[displayIndex];
    const combination = lockupCombinations[sourceIndex];
    if (!combination) continue;

    let tile = lockupTilePool.get(sourceIndex);
    if (tile) {
      positionLockupTile(tile, displayIndex, metrics.columns, metrics.cellSize);
      syncGridLockControl(tile, "Lockups", sourceIndex);
      continue;
    }

    tile = createLockupTile(combination, sourceIndex, metrics.columns, metrics.cellSize);
    lockupTilePool.set(sourceIndex, tile);
    lockupGrid.append(tile);
    positionLockupTile(tile, displayIndex, metrics.columns, metrics.cellSize);
  }

  lockupGridWindow = {
    columns: metrics.columns,
    cellSize: metrics.cellSize,
    startIndex,
    endIndex,
  };

  requestAnimationFrame(fitLockupTiles);
}

function scheduleLockupGridWindow() {
  if (lockupGridScrollRaf) return;
  lockupGridScrollRaf = requestAnimationFrame(() => {
    lockupGridScrollRaf = 0;
    updateLockupGridWindow();
  });
}

function bindLockupGridListeners() {
  if (lockupGridListenersBound) return;
  lockupGridListenersBound = true;
  window.addEventListener("scroll", scheduleLockupGridWindow, { passive: true });
}

function renderLockupGrid() {
  lockupCombinations = buildLockupCombinations();
  lockupTilePool.clear();
  lockupGrid.replaceChildren();
  lockupGridWindow = { columns: 0, cellSize: 0, startIndex: -1, endIndex: -1 };
  bindLockupGridListeners();
  updateLockupGridWindow(true);
}

function syncBrandTabView() {
  const showLogos = activeBrandTab === "Logos";
  const showType = activeBrandTab === "Type";
  const showColors = activeBrandTab === "Colors";
  const showLockups = activeBrandTab === "Lockups";
  const isEmpty = uploadPanel.dataset.empty === "true";
  const showTypeEmpty = showType && !typeCatalogRevealed;
  const showLockupEmpty = showLockups && !lockupsReady();
  grid.hidden = !showLogos || isEmpty;
  typeGrid.hidden = !showType || showTypeEmpty;
  colorGrid.hidden = !showColors;
  lockupGrid.hidden = !showLockups || showLockupEmpty;
  uploadEmpty.hidden = !(showLogos && isEmpty);
  typeUploadEmpty.hidden = !showTypeEmpty;
  lockupUploadEmpty.hidden = !showLockupEmpty;

  if (showLogos && !isEmpty) {
    syncLogoGridPresentation();
  }

  if (showType && !showTypeEmpty) {
    bindTypeGridListeners();
    requestAnimationFrame(() => updateTypeGridWindow(true));
  }

  if (showColors) {
    colorGrid.style.setProperty("--color-swatch-gap", `${colorSwatchGap}px`);
    bindColorGridListeners();
    if (!colorCombinations.length) renderColorGrid();
    else requestAnimationFrame(() => updateColorGridWindow(true));
  }

  if (showLockups && lockupsReady()) {
    bindLockupGridListeners();
    if (!lockupCombinations.length) renderLockupGrid();
    else requestAnimationFrame(() => updateLockupGridWindow(true));
  } else if (showLockups) {
    lockupCombinations = [];
    lockupTilePool.clear();
    lockupGrid.replaceChildren();
    lockupGridWindow = { columns: 0, cellSize: 0, startIndex: -1, endIndex: -1 };
  }

  requestAnimationFrame(syncBrandGridOffset);
  requestAnimationFrame(updateUploadBorders);
  syncGridFilterUi();
  syncGridActionsUi();
  requestAnimationFrame(syncGridFiltersPosition);
  requestAnimationFrame(syncGridActionsPosition);
  requestAnimationFrame(validateKeyboardGridSelection);
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

function isFullscreenLockup() {
  return lockupMode || previewMode === "lockup";
}

function resetPreviewState() {
  previewMode = "logo";
  currentTypeIndex = -1;
  currentLockupIndex = -1;
  lockupMode = false;
}

function lockupLayoutTypeface() {
  if (previewMode === "lockup") {
    const combination = lockupCombinations[currentLockupIndex];
    const face = combination ? getTypefaces()[combination.typeIndex] : null;
    if (face) {
      return {
        family: `"${face.family}", sans-serif`,
        weight: String(face.weight),
      };
    }
  }

  return {
    family: selectedFontFamily(),
    weight: "700",
  };
}

function fullscreenTypeMarkup(face) {
  return `<span class="fullscreen-type-specimen" data-font-family="${face.family}" data-font-weight="${face.weight}" style="font-family:&quot;${face.family}&quot;,sans-serif;font-weight:${face.weight}">${lockupText}</span>`;
}

function lockupCombinationMarkup(combination) {
  const face = getTypefaces()[combination.typeIndex];
  const fontFamily = face ? `"${face.family}", sans-serif` : selectedFontFamily();
  const fontWeight = face ? String(face.weight) : "700";
  return `<div class="fullscreen-lockup" aria-hidden="true">
    <span class="fullscreen-logo-art fullscreen-lockup-mark">${logoMarkup(combination.logoId)}</span>
    <span class="fullscreen-lockup-text" style="font-family:${fontFamily};font-weight:${fontWeight}">${lockupText}</span>
  </div>`;
}

function fullscreenPreviewMarkup() {
  if (previewMode === "type") {
    const face = getTypefacesForGrid()[currentTypeIndex];
    return face ? fullscreenTypeMarkup(face) : "";
  }

  if (previewMode === "lockup") {
    const combination = lockupCombinations[currentLockupIndex];
    return combination ? lockupCombinationMarkup(combination) : "";
  }

  return lockupMode
    ? lockupMarkup(currentLogoId)
    : `<span class="fullscreen-logo-art" aria-hidden="true">${logoMarkup(currentLogoId)}</span>`;
}

function fullscreenPreviewLabel() {
  if (previewMode === "type") {
    const face = getTypefacesForGrid()[currentTypeIndex];
    return face?.family ?? "Type specimen";
  }

  if (previewMode === "lockup") {
    const combination = lockupCombinations[currentLockupIndex];
    return combination ? lockupLabel(combination) : "Lockup preview";
  }

  const name = logoName(currentLogoId);
  return lockupMode ? `${name} lockup with EEG text` : name;
}

function fullscreenDialogLabel() {
  if (previewMode === "type") return "Selected typeface preview";
  if (previewMode === "lockup") return "Selected lockup preview";
  return "Selected logo preview";
}

function fitFullscreenType() {
  const specimen = fullscreenLogo.querySelector(".fullscreen-type-specimen");
  if (!specimen || !dialog.open || previewMode !== "type") return;

  const box = fullscreenLogo.getBoundingClientRect();
  if (!box.width || !box.height) return;

  const family = specimen.dataset.fontFamily || "sans-serif";
  const weight = specimen.dataset.fontWeight || "400";
  const sample = specimen.textContent || lockupText;
  let fontSize = Math.min(box.height * 0.5, box.width * 0.35, 220);
  let ink = measureTypeInk(family, weight, fontSize, sample);

  if (ink) {
    const fit = Math.min(
      1,
      (box.width * 0.85) / ink.width,
      (box.height * 0.72) / ink.height,
    );
    if (fit < 1) fontSize *= fit;
  }

  specimen.style.fontSize = `${Math.max(1, Math.round(fontSize))}px`;
}

function scheduleFullscreenTypeLayout() {
  window.requestAnimationFrame(() => {
    fitFullscreenType();
    document.fonts?.ready?.then(() => fitFullscreenType());
  });
}

function measureLockupText(fontSize, fontFamily, fontWeight = 700) {
  const context = lockupCanvas.getContext("2d");
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const metrics = context.measureText(lockupText);
  const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  return {
    width: metrics.width,
    height: height || fontSize * 0.72,
  };
}

function cropLockupSvg(svg) {
  if (!(svg instanceof SVGSVGElement)) return 1;

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

function fitLockupTile(tile) {
  const button = tile.querySelector(".lockup-button");
  const content = tile.querySelector(".lockup-content");
  const mark = tile.querySelector(".lockup-mark");
  const text = tile.querySelector(".lockup-text");
  const svg = mark?.querySelector("svg");
  if (!button || !content || !mark || !text || !svg) return;

  const markAspect = cropLockupSvg(svg);
  const styles = getComputedStyle(button);
  const padL = Number.parseFloat(styles.paddingLeft) || 0;
  const padR = Number.parseFloat(styles.paddingRight) || 0;
  const padT = Number.parseFloat(styles.paddingTop) || 0;
  const padB = Number.parseFloat(styles.paddingBottom) || 0;
  const maxWidth = Math.max(1, button.clientWidth - padL - padR) * 0.92;
  const maxHeight = Math.max(1, button.clientHeight - padT - padB) * 0.88;

  const textStyle = getComputedStyle(text);
  const fontFamily = textStyle.fontFamily;
  const fontWeight = textStyle.fontWeight || "700";
  let fontSize = Math.min(maxHeight * 0.72, maxWidth * 0.22);

  for (let pass = 0; pass < 5; pass += 1) {
    const textMetrics = measureLockupText(fontSize, fontFamily, fontWeight);
    const markHeight = fontSize * 1.02;
    const markWidth = markHeight * markAspect;
    const gap = Math.min(84, Math.max(22, fontSize * 0.27));
    const totalWidth = markWidth + gap + textMetrics.width;
    const totalHeight = Math.max(markHeight, textMetrics.height);
    const scale = Math.min(1, maxWidth / totalWidth, maxHeight / totalHeight);

    fontSize *= scale;
  }

  const roundedFontSize = Math.max(1, Math.round(fontSize));
  const roundedMarkHeight = Math.round(roundedFontSize * 1.02);
  const roundedMarkWidth = Math.round(roundedMarkHeight * markAspect);
  const gapPx = Math.round(Math.min(84, Math.max(22, roundedFontSize * 0.27)));

  text.style.fontSize = `${roundedFontSize}px`;
  mark.style.width = `${roundedMarkWidth}px`;
  mark.style.height = `${roundedMarkHeight}px`;
  content.style.gap = `${gapPx}px`;

  const lockupTile = tile.classList.contains("lockup-tile")
    ? tile
    : tile.closest(".lockup-tile");
  if (lockupTile) positionGridLockControl(lockupTile);
}

function cropLockupSvgToArtwork() {
  const svg = fullscreenLogo.querySelector(".fullscreen-lockup-mark svg");
  return cropLockupSvg(svg);
}

function updateLockupLayout() {
  if (!dialog.open || !isFullscreenLockup()) return;

  const markAspect = cropLockupSvgToArtwork();

  const box = fullscreenLogo.getBoundingClientRect();
  if (!box.width || !box.height) return;

  const { family: fontFamily, weight: fontWeight } = lockupLayoutTypeface();
  const maxWidth = box.width * 0.9;
  const maxHeight = box.height * 0.62;
  let fontSize = Math.min(maxHeight, maxWidth * 0.28);

  for (let pass = 0; pass < 5; pass += 1) {
    const textMetrics = measureLockupText(fontSize, fontFamily, fontWeight);
    const markHeight = fontSize * 1.02;
    const markWidth = markHeight * markAspect;
    const gap = Math.min(84, Math.max(22, fontSize * 0.27));
    const totalWidth = markWidth + gap + textMetrics.width;
    const totalHeight = Math.max(markHeight, fontSize);
    const scale = Math.min(1, maxWidth / totalWidth, maxHeight / totalHeight);

    fontSize *= scale;
  }

  const textMetrics = measureLockupText(fontSize, fontFamily, fontWeight);
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
    if (dialog.open && isFullscreenLockup() && currentShaderIndex >= 0) mountFullscreenShader();
    document.fonts?.ready?.then(() => {
      updateLockupLayout();
      if (dialog.open && isFullscreenLockup() && currentShaderIndex >= 0) mountFullscreenShader();
    });
  });
}

function renderFullscreenPreview() {
  fullscreenLogo.classList.toggle("is-lockup", isFullscreenLockup());
  fullscreenLogo.classList.toggle("is-type", previewMode === "type");
  fullscreenLogo.innerHTML = fullscreenPreviewMarkup();
  fullscreenLogo.setAttribute("aria-label", fullscreenPreviewLabel());
  dialog.setAttribute("aria-label", fullscreenDialogLabel());

  if (previewMode === "type") {
    disposeFullscreenShader();
    scheduleFullscreenTypeLayout();
    return;
  }

  if (isFullscreenLockup()) {
    disposeFullscreenShader();
    updateLockupLayout();
    scheduleLockupLayout();
    if (currentShaderIndex >= 0) mountFullscreenShader();
  } else if (dialog.open) {
    mountFullscreenShader();
  }
}

function setLockupMode(enabled) {
  if (previewMode !== "logo") return;
  lockupMode = enabled;
  if (dialog.open) renderFullscreenPreview();
}

function toggleLockupMode() {
  setLockupMode(!lockupMode);
}

function showLogoById(id) {
  const normalizedId = logoId(id);
  if (!uploadedLogos.has(normalizedId)) return;
  currentLogoId = normalizedId;
  renderFullscreenPreview();
}

function showTypeByIndex(index) {
  const faces = getTypefacesForGrid();
  if (!faces[index]) return;
  currentTypeIndex = index;
  const face = faces[index];
  ensureTypefaceLoaded(face).then(() => {
    if (dialog.open && previewMode === "type" && currentTypeIndex === index) {
      renderFullscreenPreview();
    }
  });
  renderFullscreenPreview();
}

function showLockupByIndex(index) {
  const combination = lockupCombinations[index];
  if (!combination) return;
  currentLockupIndex = index;
  const face = getTypefaces()[combination.typeIndex];
  const finish = () => {
    if (dialog.open && previewMode === "lockup" && currentLockupIndex === index) {
      renderFullscreenPreview();
    }
  };
  if (face) {
    ensureTypefaceLoaded(face).then(finish);
  } else {
    finish();
  }
  renderFullscreenPreview();
}

function showAdjacentPreview(offset) {
  if (previewMode === "type") {
    const order = getTypeGridSourceIndices();
    if (!order.length) return;
    const position = Math.max(0, order.indexOf(currentTypeIndex));
    const nextPosition = ((position + offset) % order.length + order.length) % order.length;
    showTypeByIndex(order[nextPosition]);
    return;
  }

  if (previewMode === "lockup") {
    const order = getLockupSourceIndices();
    if (!order.length) return;
    const position = Math.max(0, order.indexOf(currentLockupIndex));
    const nextPosition = ((position + offset) % order.length + order.length) % order.length;
    showLockupByIndex(order[nextPosition]);
    return;
  }

  showAdjacentLogo(offset);
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
  previewMode = "logo";
  lockupMode = false;
  currentTypeIndex = -1;
  currentLockupIndex = -1;
  showLogoById(id);
  dialog.showModal();
  dialog.focus({ preventScroll: true });
  mountFullscreenShader();
}

function openTypeDialog(index) {
  const faces = getTypefacesForGrid();
  if (!faces[index]) return;
  document.activeElement?.blur?.();
  previewMode = "type";
  lockupMode = false;
  currentLockupIndex = -1;
  showTypeByIndex(index);
  dialog.showModal();
  dialog.focus({ preventScroll: true });
}

function openLockupDialog(index) {
  if (!lockupCombinations[index]) return;
  document.activeElement?.blur?.();
  previewMode = "lockup";
  lockupMode = false;
  currentTypeIndex = -1;
  showLockupByIndex(index);
  dialog.showModal();
  dialog.focus({ preventScroll: true });
}

function createLogoTile(id, name, position) {
  const tile = document.createElement("figure");
  const button = document.createElement("button");
  const logo = document.createElement("span");

  tile.className = "logo-tile";
  tile.dataset.logoIndex = String(id);
  tile.dataset.logoId = logoId(id);
  tile.dataset.logoName = name;
  tile.dataset.sortIndex = String(position);
  button.className = "logo-button";
  button.type = "button";
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `Preview ${name}`);
  logo.className = "logo-art";
  logo.setAttribute("aria-hidden", "true");
  logo.innerHTML = logoMarkup(id);

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

  button.append(logo);
  tile.append(button);
  attachGridLockControl(
    tile,
    "Logos",
    () => logoTileSlotIndex(tile),
    () => tile.dataset.logoId,
  );
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

  logoPlaceholdersChosen = true;
  updateUploadUi();
  syncBrandTabView();
  syncLogoGridPresentation();
  uploadFeedback.textContent = `${coolshapePlaceholders.length} Coolshapes placeholders added`;
  setStatus(uploadFeedback.textContent);
  saveSessionState();
}

function openFilePicker() {
  uploadInput.click();
}

function openTypeFilePicker() {
  typeUploadInput.click();
}

function openLockupFilePicker() {
  if (uploadedLogos.size === 0) {
    openFilePicker();
    return;
  }
  openTypeFilePicker();
}

function bindUploadEmptyPanel(panel, openPicker) {
  panel.addEventListener("click", (event) => {
    if (event.target.closest(".placeholder-link, .brand-tab-link")) return;
    openPicker();
  });
  panel.addEventListener("keydown", (event) => {
    if (event.target !== panel) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openPicker();
  });
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

function revealLockupCatalog() {
  if (lockupCatalogRevealed) return;
  lockupCatalogRevealed = true;
  lockupCatalogChosen = true;
  syncBrandTabView();
  setStatus("Exploring sample lockups");
  saveSessionState();
}

function revealTypeCatalog() {
  if (typeCatalogRevealed) return;
  typeCatalogRevealed = true;
  typeCatalogChosen = true;
  syncBrandTabView();
  setStatus("Exploring open-source typefaces");
  saveSessionState();
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
    resetTypeDisplayOrder();
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

  if (activeBrandTab === "Lockups" && !lockupsReady()) {
    dropOverlayTitle.textContent = "Drop to add logos or fonts";
    dropOverlayHint.textContent = "SVG, WOFF, WOFF2, TTF, or OTF";
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

placeholderButton.addEventListener("click", populatePlaceholderLogos);
typeExploreButton.addEventListener("click", revealTypeCatalog);
lockupTryButton.addEventListener("click", revealLockupCatalog);
bindUploadEmptyPanel(uploadEmpty, openFilePicker);
bindUploadEmptyPanel(typeUploadEmpty, openTypeFilePicker);
bindUploadEmptyPanel(lockupUploadEmpty, openLockupFilePicker);
bindBrandTabLinks(lockupUploadEmpty);
uploadInput.addEventListener("change", () => addLogoFiles(uploadInput.files));
typeUploadInput.addEventListener("change", () => addFontFiles(typeUploadInput.files));

function selectBrandTabByName(tabName) {
  const button = brandTabButtons.find((entry) => brandTabName(entry) === tabName);
  if (button) selectBrandTab(button);
}

function bindBrandTabLinks(container) {
  container.querySelectorAll("[data-brand-tab]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      selectBrandTabByName(link.dataset.brandTab);
    });
  });
}

let keyboardGridSelection = null;

function isActiveBrandGridVisible() {
  if (activeBrandTab === "Logos") return !grid.hidden;
  if (activeBrandTab === "Type") return !typeGrid.hidden;
  if (activeBrandTab === "Colors") return !colorGrid.hidden && colorCombinations.length > 0;
  if (activeBrandTab === "Lockups") return !lockupGrid.hidden && lockupCombinations.length > 0;
  return false;
}

function canUseGridKeyboardNav(event) {
  if (dialog.open) return false;
  if (!BRAND_TABS.has(activeBrandTab)) return false;
  if (!isActiveBrandGridVisible()) return false;
  if (colorDragSession) return false;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return false;
  if (target.isContentEditable || target.closest('[contenteditable="true"]')) return false;
  if (target.closest(".brand-tab")) return false;
  if (target.closest(".grid-filter")) return false;
  if (target.closest(".grid-action")) return false;
  if (target.closest(".access-panel")) return false;
  if (accessPanel && !accessPanel.hidden) return false;

  return true;
}

function getVisibleLogoTiles() {
  return [...grid.querySelectorAll(".logo-tile")].filter((tile) => !tile.hidden);
}

function getKeyboardGridNavMetrics(tab = activeBrandTab) {
  if (tab === "Colors") {
    const rowCount = getColorRowSourceIndices().length;
    return { columns: 4, count: rowCount * 4 };
  }

  if (tab === "Logos") {
    const tiles = getVisibleLogoTiles();
    return { columns: gridBaseColumns(), count: tiles.length };
  }

  if (tab === "Type") {
    const indices = getTypeGridSourceIndices();
    return { columns: Math.max(1, typeGridColumns()), count: indices.length };
  }

  if (tab === "Lockups") {
    const indices = getLockupSourceIndices();
    return { columns: Math.max(1, lockupGridColumns()), count: indices.length };
  }

  return { columns: 1, count: 0 };
}

function keyboardSelectionToFlatIndex(selection) {
  if (!selection) return -1;

  if (selection.tab === "Colors") {
    const indices = getColorRowSourceIndices();
    const displayRow = indices.indexOf(selection.rowSourceIndex);
    if (displayRow < 0) return -1;
    return displayRow * 4 + selection.swatchIndex;
  }

  if (selection.tab === "Logos") {
    const tiles = getVisibleLogoTiles();
    return tiles.findIndex((tile) => tile.dataset.logoId === selection.logoId);
  }

  if (selection.tab === "Type") {
    return getTypeGridSourceIndices().indexOf(selection.typeIndex);
  }

  if (selection.tab === "Lockups") {
    return getLockupSourceIndices().indexOf(selection.lockupIndex);
  }

  return -1;
}

function flatIndexToKeyboardSelection(tab, flatIndex) {
  if (flatIndex < 0) return null;

  if (tab === "Colors") {
    const indices = getColorRowSourceIndices();
    const displayRow = Math.floor(flatIndex / 4);
    const swatchIndex = flatIndex % 4;
    const rowSourceIndex = indices[displayRow];
    if (rowSourceIndex == null || swatchIndex > 3) return null;
    return { tab, rowSourceIndex, swatchIndex };
  }

  if (tab === "Logos") {
    const tile = getVisibleLogoTiles()[flatIndex];
    if (!tile) return null;
    return { tab, logoId: tile.dataset.logoId };
  }

  if (tab === "Type") {
    const typeIndex = getTypeGridSourceIndices()[flatIndex];
    if (typeIndex == null) return null;
    return { tab, typeIndex };
  }

  if (tab === "Lockups") {
    const lockupIndex = getLockupSourceIndices()[flatIndex];
    if (lockupIndex == null) return null;
    return { tab, lockupIndex };
  }

  return null;
}

function navigateGridFlatIndex(current, columns, count, key) {
  if (count <= 0) return -1;
  if (current < 0) {
    return key === "ArrowLeft" || key === "ArrowUp" ? count - 1 : 0;
  }

  const row = Math.floor(current / columns);
  const col = current % columns;
  const rowCount = Math.ceil(count / columns);
  let nextRow = row;
  let nextCol = col;

  if (key === "ArrowLeft") {
    if (col > 0) nextCol = col - 1;
    else {
      nextRow = row > 0 ? row - 1 : rowCount - 1;
      nextCol = columns - 1;
    }
  } else if (key === "ArrowRight") {
    if (col < columns - 1 && current + 1 < count) nextCol = col + 1;
    else {
      nextRow = row < rowCount - 1 ? row + 1 : 0;
      nextCol = 0;
    }
  } else if (key === "ArrowUp") {
    nextRow = row > 0 ? row - 1 : rowCount - 1;
  } else if (key === "ArrowDown") {
    nextRow = row < rowCount - 1 ? row + 1 : 0;
  }

  let next = nextRow * columns + nextCol;
  if (next >= count) {
    if (key === "ArrowUp" || key === "ArrowDown") {
      next = Math.min((rowCount - 1) * columns + nextCol, count - 1);
    } else {
      next = count - 1;
    }
  }
  return next;
}

function getKeyboardSelectionElement() {
  if (!keyboardGridSelection) return null;

  const { tab } = keyboardGridSelection;
  if (tab === "Colors") {
    const { rowSourceIndex, swatchIndex } = keyboardGridSelection;
    const row = colorRowPool.get(rowSourceIndex);
    return row?.querySelectorAll(".color-swatch")[swatchIndex] ?? null;
  }

  if (tab === "Logos") {
    const tile = grid.querySelector(`.logo-tile[data-logo-id="${keyboardGridSelection.logoId}"]`);
    return tile?.hidden ? null : tile;
  }

  if (tab === "Type") {
    return typeTilePool.get(keyboardGridSelection.typeIndex) ?? null;
  }

  if (tab === "Lockups") {
    return lockupTilePool.get(keyboardGridSelection.lockupIndex) ?? null;
  }

  return null;
}

function clearKeyboardGridSelection() {
  document.querySelectorAll(".is-keyboard-selected").forEach((element) => {
    element.classList.remove("is-keyboard-selected");
  });
  keyboardGridSelection = null;
}

function syncKeyboardGridSelection() {
  document.querySelectorAll(".is-keyboard-selected").forEach((element) => {
    element.classList.remove("is-keyboard-selected");
  });

  if (!keyboardGridSelection || keyboardGridSelection.tab !== activeBrandTab) return;

  const element = getKeyboardSelectionElement();
  if (!element) {
    keyboardGridSelection = null;
    return;
  }

  element.classList.add("is-keyboard-selected");

  if (element.classList.contains("color-swatch")) {
    ensureColorNames([element.dataset.colorHex]);
    positionColorSwatchLockControl(element);
    return;
  }

  if (
    element.classList.contains("logo-tile")
    || element.classList.contains("type-tile")
    || element.classList.contains("lockup-tile")
  ) {
    positionGridLockControl(element);
  }
}

function scrollVirtualGridToOffset(gridElement, offsetTop, callback) {
  const gridTop = gridElement.getBoundingClientRect().top + window.scrollY;
  const target = gridTop + offsetTop - window.innerHeight * 0.35;
  window.scrollTo({ top: Math.max(0, target) });
  requestAnimationFrame(() => {
    callback();
    const element = getKeyboardSelectionElement();
    element?.scrollIntoView({ block: "nearest", inline: "nearest" });
    syncKeyboardGridSelection();
  });
}

function scrollKeyboardSelectionIntoView() {
  if (!keyboardGridSelection) return;

  const { tab } = keyboardGridSelection;

  if (tab === "Colors") {
    const indices = getColorRowSourceIndices();
    const displayRow = indices.indexOf(keyboardGridSelection.rowSourceIndex);
    if (displayRow < 0) return;
    const metrics = measureColorGridMetrics();
    scrollVirtualGridToOffset(colorGrid, displayRow * metrics.rowStride, () => {
      updateColorGridWindow(true);
    });
    return;
  }

  if (tab === "Type") {
    const indices = getTypeGridSourceIndices();
    const displayIndex = indices.indexOf(keyboardGridSelection.typeIndex);
    if (displayIndex < 0) return;
    const metrics = measureTypeGridMetrics();
    const top = Math.floor(displayIndex / metrics.columns) * metrics.cellSize;
    scrollVirtualGridToOffset(typeGrid, top, () => {
      updateTypeGridWindow(true);
    });
    return;
  }

  if (tab === "Lockups") {
    const indices = getLockupSourceIndices();
    const displayIndex = indices.indexOf(keyboardGridSelection.lockupIndex);
    if (displayIndex < 0) return;
    const metrics = measureLockupGridMetrics();
    const top = Math.floor(displayIndex / metrics.columns) * metrics.cellSize;
    scrollVirtualGridToOffset(lockupGrid, top, () => {
      updateLockupGridWindow(true);
    });
    return;
  }

  if (tab === "Logos") {
    getKeyboardSelectionElement()?.scrollIntoView({ block: "nearest", inline: "nearest" });
    syncKeyboardGridSelection();
  }
}

function navigateKeyboardGrid(key) {
  const tab = activeBrandTab;
  const { columns, count } = getKeyboardGridNavMetrics(tab);
  if (count <= 0) return;

  const currentFlat = keyboardGridSelection?.tab === tab
    ? keyboardSelectionToFlatIndex(keyboardGridSelection)
    : -1;
  const nextFlat = navigateGridFlatIndex(currentFlat, columns, count, key);
  keyboardGridSelection = flatIndexToKeyboardSelection(tab, nextFlat);
  scrollKeyboardSelectionIntoView();
  syncKeyboardGridSelection();
}

function lockKeyboardGridSelection() {
  const element = getKeyboardSelectionElement();
  const lockButton = element?.querySelector(".grid-lock-control");
  lockButton?.click();
}

function validateKeyboardGridSelection() {
  if (!keyboardGridSelection) return;
  if (keyboardGridSelection.tab !== activeBrandTab) {
    clearKeyboardGridSelection();
    return;
  }
  if (keyboardSelectionToFlatIndex(keyboardGridSelection) < 0) {
    clearKeyboardGridSelection();
    return;
  }
  syncKeyboardGridSelection();
}

function selectBrandTab(selectedButton, shouldFocus = false) {
  if (isBrandTabDisabled(selectedButton)) return;

  const nextTab = brandTabName(selectedButton);
  if (nextTab !== activeBrandTab) clearKeyboardGridSelection();

  brandTabButtons.forEach((button) => {
    const isSelected = button === selectedButton;
    button.setAttribute("aria-pressed", String(isSelected));
    if (!isBrandTabDisabled(button)) button.tabIndex = isSelected ? 0 : -1;
  });
  activeBrandTab = nextTab;
  syncBrandTabView();
  if (shouldFocus) selectedButton.focus();
  setStatus(`${activeBrandTab} tab selected`);
  saveSessionState();
}

brandTabButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (isBrandTabDisabled(button)) return;
    selectBrandTab(button);
  });
  button.addEventListener("keydown", (event) => {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = nextEnabledBrandTabIndex(index, 1);
    } else if (event.key === "ArrowLeft") {
      nextIndex = nextEnabledBrandTabIndex(index, -1);
    } else if (event.key === "Home") {
      nextIndex = firstEnabledBrandTabIndex();
    } else if (event.key === "End") {
      nextIndex = lastEnabledBrandTabIndex();
    } else {
      return;
    }

    event.preventDefault();
    selectBrandTab(brandTabButtons[nextIndex], true);
  });
});

gridFilters?.addEventListener("click", (event) => {
  const button = event.target.closest(".grid-filter");
  if (!button || !gridFilters.contains(button)) return;
  const tab = button.closest(".grid-filter-panel")?.dataset.gridFilterTab;
  const filter = button.dataset.filter;
  if (!tab || !filter) return;
  setGridFilter(tab, filter);
});

gridActions?.querySelectorAll(".grid-action").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.closest(".grid-action-panel")?.dataset.tab;
    const action = button.dataset.action;
    if (!tab || !action) return;
    handleGridAction(tab, action);
    button.blur();
  });
});

lockedImportInput?.addEventListener("change", async () => {
  const file = lockedImportInput.files?.[0];
  const tab = pendingImportTab;
  pendingImportTab = null;
  lockedImportInput.value = "";
  if (!file || !tab) return;
  try {
    await importLockedForTab(tab, file);
  } catch {
    setStatus(`Could not import ${tab.toLowerCase()}`);
  }
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
  if (activeBrandTab === "Lockups" && !lockupsReady()) {
    const logoFiles = [...files].filter((file) => {
      return file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    });
    const fontFiles = [...files].filter((file) => isFontFile(file));
    if (logoFiles.length) addLogoFiles(logoFiles);
    if (fontFiles.length) addFontFiles(fontFiles);
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

function syncLogoGridPresentation() {
  updateFaviconForTopLogo();
  scheduleLogoShaderMask();
  schedulePerIconShaderSync();
  applyLogoGridFilter();
  requestAnimationFrame(syncBrandGridOffset);
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

async function refreshClientState() {
  currentProfile = await loadProfile();
  syncAccessUi();

  const member = await loadMembership();

  if (!member && !isAdmin()) {
    setStatus("Project access pending");
    return;
  }

  if (isAdminRoute) await loadAdminResults();
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
    session = nextSession;
    currentProfile = null;
    syncAccessUi();
    if (session) {
      refreshClientState();
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

function ensureColorCombinations() {
  if (!colorCombinations.length) {
    colorCombinations = buildColorCombinations();
  }
}

/**
 * Space palette pool: constrained by the Colors tab filter.
 * - all: any color combination
 * - locked: pinned swatch hexes only
 * - generator (Poline/Standard/…): colors from rows matching that source
 * @returns {boolean} whether a new palette was applied
 */
function randomizePaletteFromCombinations() {
  if (bwModeActive) return false;

  const pool = getActiveColorPool();

  if (pool.filter === "locked") {
    if (!pool.colors.length) return false;
    applyPalette(paletteFromCombination({ colors: pool.colors, source: "Locked" }));
    return true;
  }

  if (pool.filter !== "all") {
    // Prefer a random filtered combination so contrast pairs stay coherent;
    // fall back to the collected hex pool if combinations are missing.
    if (pool.combinations?.length) {
      const combination = pool.combinations[Math.floor(Math.random() * pool.combinations.length)];
      applyPalette(paletteFromCombination(combination));
      return true;
    }
    if (!pool.colors?.length) return false;
    applyPalette(paletteFromCombination({ colors: pool.colors, source: pool.filter }));
    return true;
  }

  if (!pool.combinations?.length) return false;
  const combination = pool.combinations[Math.floor(Math.random() * pool.combinations.length)];
  applyPalette(paletteFromCombination(combination));
  return true;
}

/** Prefer a different pool entry than `current` when the pool has more than one item. */
function pickRandomDifferent(pool, current) {
  if (!pool.length) return undefined;
  if (pool.length === 1) return pool[0];
  const others = pool.filter((item) => item !== current);
  return randomFrom(others.length ? others : pool);
}

/** Lockup indices for dialog Space: Lockups filter, plus Logos/Type source constraints. */
function getDialogLockupPool() {
  const logoSet = new Set(getLockupLogoIds());
  const typeSet = new Set(getLockupTypeIndices());
  return getLockupSourceIndices().filter((index) => {
    const combination = lockupCombinations[index];
    if (!combination) return false;
    return logoSet.has(combination.logoId) && typeSet.has(combination.typeIndex);
  });
}

/**
 * Space while expanded preview is open: randomize the shown item (filter-constrained)
 * and the palette (same as grid Space; skipped in B&W).
 */
function randomizeDialogPreview() {
  if (!dialog.open) return;

  const paletteOk = randomizePaletteFromCombinations();
  let itemOk = false;

  if (previewMode === "type") {
    const pool = getTypeGridSourceIndices();
    const next = pickRandomDifferent(pool, currentTypeIndex);
    if (next !== undefined) {
      showTypeByIndex(next);
      itemOk = true;
    }
    if (itemOk && paletteOk) {
      setStatus("Randomized typeface and palette");
    } else if (itemOk) {
      setStatus(emptyColorsFilterStatus("randomized typeface") ?? "Randomized typeface");
    } else {
      setStatus(paletteOk
        ? "Randomized palette"
        : (emptyColorsFilterStatus() ?? "Nothing to randomize"));
    }
    return;
  }

  if (previewMode === "lockup") {
    const pool = getDialogLockupPool();
    const next = pickRandomDifferent(pool, currentLockupIndex);
    if (next !== undefined) {
      showLockupByIndex(next);
      itemOk = true;
    }
    if (itemOk && paletteOk) {
      setStatus("Randomized lockup and palette");
    } else if (itemOk) {
      setStatus(emptyColorsFilterStatus("randomized lockup") ?? "Randomized lockup");
    } else {
      setStatus(paletteOk
        ? "Randomized palette"
        : (emptyColorsFilterStatus() ?? "Nothing to randomize"));
    }
    return;
  }

  // Logo preview (including lockup-mode logo presentation)
  const pool = getVisibleLogoTiles().map((tile) => tile.dataset.logoId);
  const next = pickRandomDifferent(pool, currentLogoId);
  if (next !== undefined) {
    showLogoById(next);
    itemOk = true;
  }
  if (itemOk && paletteOk) {
    setStatus("Randomized logo and palette");
  } else if (itemOk) {
    setStatus(emptyColorsFilterStatus("randomized logo") ?? "Randomized logo");
  } else {
    setStatus(paletteOk
      ? "Randomized palette"
      : (emptyColorsFilterStatus() ?? "Nothing to randomize"));
  }
}

function randomizeActiveTab() {
  if (activeBrandTab === "Colors") {
    renderColorGrid();
    const paletteOk = randomizePaletteFromCombinations();
    if (paletteOk) {
      setStatus("Randomized color combinations and palette");
    } else {
      setStatus(emptyColorsFilterStatus("randomized color combinations")
        ?? "Randomized color combinations");
    }
    return;
  }

  if (activeBrandTab === "Lockups") {
    if (!lockupsReady()) return;
    const paletteOk = randomizePaletteFromCombinations();
    renderLockupGrid();
    if (paletteOk) {
      setStatus("Randomized lockup combinations and palette");
    } else {
      setStatus(emptyColorsFilterStatus("randomized lockups")
        ?? "Randomized lockup combinations");
    }
    return;
  }

  if (activeBrandTab === "Type") {
    if (!typeCatalogRevealed) revealTypeCatalog();
    const paletteOk = randomizePaletteFromCombinations();
    shuffleTypeDisplayOrder();
    refreshTypeGrid();
    if (paletteOk) {
      setStatus("Randomized typefaces and palette");
    } else {
      setStatus(emptyColorsFilterStatus("randomized typefaces")
        ?? "Randomized typefaces");
    }
    return;
  }

  if (activeBrandTab !== "Logos") return;

  const tiles = [...grid.querySelectorAll(".logo-tile")];
  if (tiles.length < 2) {
    const paletteOk = randomizePaletteFromCombinations();
    updateFaviconForTopLogo();
    syncLogoGridPresentation();
    setStatus(paletteOk
      ? "Randomized palette"
      : (emptyColorsFilterStatus() ?? "Nothing to randomize"));
    return;
  }

  const paletteOk = randomizePaletteFromCombinations();
  const nextIds = permuteIdsWithPinnedSlots(tiles.length, pinnedGridSlots.Logos, getLogoIds());
  const tileById = new Map(tiles.map((tile) => [tile.dataset.logoId, tile]));
  nextIds.forEach((id) => {
    const tile = tileById.get(id);
    if (tile) grid.append(tile);
  });

  syncLogoTileLockControls();
  updateFaviconForTopLogo();
  clearSelection();
  syncLogoGridPresentation();
  if (paletteOk) {
    setStatus("Randomized logos and palette");
  } else {
    setStatus(emptyColorsFilterStatus("randomized logos") ?? "Randomized logos");
  }
}

function randomizeLogoOrder() {
  randomizeActiveTab();
}

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
  resetPreviewState();
  fullscreenLogo.classList.remove("is-lockup", "is-type");
  fullscreenLogo.innerHTML = "";
  fullscreenLogo.setAttribute("aria-label", "");
  dialog.setAttribute("aria-label", "Selected logo preview");
}

closeButton.addEventListener("click", closeDialog);

[closeButton, previousButton, nextButton].forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
  });
});

previousButton.addEventListener("click", () => {
  showAdjacentPreview(-1);
  dialog.focus({ preventScroll: true });
});

nextButton.addEventListener("click", () => {
  showAdjacentPreview(1);
  dialog.focus({ preventScroll: true });
});

dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showAdjacentPreview(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showAdjacentPreview(1);
  }
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

dialog.addEventListener("cancel", () => {
  disposeFullscreenShader();
  resetPreviewState();
  fullscreenLogo.classList.remove("is-lockup", "is-type");
  fullscreenLogo.innerHTML = "";
  fullscreenLogo.setAttribute("aria-label", "");
  dialog.setAttribute("aria-label", "Selected logo preview");
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

  if (isFullscreenLockup()) {
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

  if (!dialog.open || currentShaderIndex < 0 || previewMode === "type") return;

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
  const mask = isFullscreenLockup() ? lockupMaskUrl() : logoMaskUrlFromSvg(svg);
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
  saveSessionState();
  try {
    sessionStorage.setItem(SESSION_KEYS.reloadPending, "1");
  } catch {
    // ignore
  }
});

window.addEventListener("pagehide", (event) => {
  if (event.persisted) return;
  saveSessionState();
  try {
    sessionStorage.setItem(SESSION_KEYS.reloadPending, "1");
  } catch {
    // ignore
  }
});

window.addEventListener("scroll", scheduleLogoShaderMask, { passive: true });
window.addEventListener("resize", () => {
  updateGridColumns();
  scheduleLogoShaderMask();
  if (dialog.open && isFullscreenLockup()) scheduleLockupLayout();
  if (dialog.open && previewMode === "type") scheduleFullscreenTypeLayout();
  if (activeBrandTab === "Type") updateTypeGridWindow(true);
  else if (activeBrandTab === "Colors") updateColorGridWindow(true);
  else if (activeBrandTab === "Lockups") updateLockupGridWindow(true);
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

function colorCloseness(a, b) {
  const left = hexToRgb(parseColor(a));
  const right = hexToRgb(parseColor(b));
  const dr = left[0] - right[0];
  const dg = left[1] - right[1];
  const db = left[2] - right[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function colorsTooClose(a, b, threshold = 28) {
  return colorCloseness(a, b) < threshold;
}

function scoreLockedCombination(colors, lockedByIndex) {
  let score = 0;
  const lums = colors.map((color) => luminance(color));
  score += (Math.max(...lums) - Math.min(...lums)) * 14;

  for (let index = 0; index < colors.length - 1; index += 1) {
    score += Math.min(contrastRatio(colors[index], colors[index + 1]), 7);
  }

  for (let i = 0; i < colors.length; i += 1) {
    for (let j = i + 1; j < colors.length; j += 1) {
      if (parseColor(colors[i]) === parseColor(colors[j])) score -= 20;
      else if (colorsTooClose(colors[i], colors[j], 22)) score -= 8;
    }
  }

  for (const [lockedIndex, lockedColor] of lockedByIndex) {
    for (let index = 0; index < colors.length; index += 1) {
      if (index === lockedIndex) continue;
      const ratio = contrastRatio(lockedColor, colors[index]);
      if (ratio >= 2.45) score += 1.6;
      else if (ratio >= 1.85) score += 0.7;
    }
  }

  return score;
}

function expandLockedColorCandidates(seeds, unlockedCount, existing = []) {
  const candidates = [...existing];
  const locked = seeds.map(parseColor);

  const pushUnique = (color) => {
    const normalized = parseColor(color);
    if (candidates.some((entry) => colorsTooClose(entry, normalized, 22))) return false;
    if (locked.some((entry) => colorsTooClose(normalized, entry, 24))) return false;
    candidates.push(normalized);
    return true;
  };

  for (const seed of locked) {
    const hue = hueFromHex(seed);
    for (let step = 0; step < 8; step += 1) {
      pushUnique(hslToHex(
        (hue + step * (35 + Math.random() * 55) + Math.random() * 20) % 360,
        0.22 + Math.random() * 0.7,
        0.08 + Math.random() * 0.84,
      ));
    }
    pushUnique(mixColors(seed, "#ffffff", 0.2 + Math.random() * 0.65));
    pushUnique(mixColors(seed, "#111111", 0.2 + Math.random() * 0.55));
    pushUnique(mixColors(seed, "#000000", 0.35 + Math.random() * 0.4));
  }

  if (locked.length >= 2) {
    pushUnique(mixColors(locked[0], locked[1], 0.2 + Math.random() * 0.6));
    pushUnique(mixColors(locked[0], locked[1], 0.35 + Math.random() * 0.3));
  }

  while (candidates.length < unlockedCount + 4) {
    const seed = locked[Math.floor(Math.random() * locked.length)] ?? "#888888";
    const hue = (hueFromHex(seed) + Math.random() * 360) % 360;
    if (!pushUnique(hslToHex(hue, 0.2 + Math.random() * 0.75, 0.1 + Math.random() * 0.8))) {
      pushUnique(mixColors(seed, Math.random() < 0.5 ? "#ffffff" : "#000000", 0.25 + Math.random() * 0.55));
    }
    if (candidates.length > unlockedCount + 12) break;
  }

  return candidates;
}

function fillUnlockedColorSlots(lockedByIndex, pool) {
  const colors = new Array(4).fill(null);
  const used = [];

  for (const [index, color] of lockedByIndex) {
    const normalized = parseColor(color);
    colors[index] = normalized;
    used.push(normalized);
  }

  const unlocked = [0, 1, 2, 3].filter((index) => colors[index] == null);
  let candidates = [...new Set(pool.map(parseColor))]
    .filter((color) => !used.some((locked) => colorsTooClose(color, locked, 24)));

  if (candidates.length < unlocked.length + 3) {
    candidates = expandLockedColorCandidates(used, unlocked.length, candidates);
  }

  const available = shuffleArray([...candidates]);
  for (const slot of unlocked) {
    if (!available.length) {
      const seed = used[0] ?? "#888888";
      const fallback = mixColors(seed, slot < 2 ? "#000000" : "#ffffff", 0.25 + Math.random() * 0.55);
      colors[slot] = parseColor(fallback);
      used.push(colors[slot]);
      continue;
    }

    const targetLum = (slot + Math.random() * 0.35) / 3.35;
    const ranked = available
      .map((color, index) => ({
        index,
        color,
        distance: Math.abs(luminance(color) - targetLum) + Math.random() * 0.22,
      }))
      .sort((left, right) => left.distance - right.distance);

    const pickFrom = Math.min(3, ranked.length);
    const chosen = ranked[Math.floor(Math.random() * pickFrom)];
    available.splice(chosen.index, 1);
    colors[slot] = chosen.color;
    used.push(chosen.color);
  }

  return colors;
}

function poolAroundLockedColors(lockedColors) {
  const seeds = lockedColors.map(parseColor);
  const pool = [...seeds];

  for (const seed of seeds) {
    const hue = hueFromHex(seed);
    for (let step = 0; step < 6; step += 1) {
      const nextHue = (hue + step * (50 + Math.random() * 40)) % 360;
      const saturation = 0.28 + Math.random() * 0.62;
      const lightness = 0.1 + Math.random() * 0.8;
      pool.push(hslToHex(nextHue, saturation, lightness));
    }
    pool.push(
      mixColors(seed, "#ffffff", 0.25),
      mixColors(seed, "#ffffff", 0.55),
      mixColors(seed, "#ffffff", 0.8),
      mixColors(seed, "#111111", 0.35),
      mixColors(seed, "#000000", 0.55),
    );
  }

  if (seeds.length >= 2) {
    pool.push(
      mixColors(seeds[0], seeds[1], 0.25),
      mixColors(seeds[0], seeds[1], 0.5),
      mixColors(seeds[0], seeds[1], 0.75),
    );
  }

  const [name, generator] = randomFrom(paletteSources);
  pool.push(...generator());
  return { pool, source: name };
}

function unlockedColorsChanged(nextColors, previousColors, lockedByIndex) {
  if (!previousColors?.length) return true;
  for (let index = 0; index < nextColors.length; index += 1) {
    if (lockedByIndex.has(index)) continue;
    if (parseColor(nextColors[index]) !== parseColor(previousColors[index])) return true;
  }
  return false;
}

function generateColorCombinationWithLocks(lockedByIndex, previous = null) {
  const locks = new Map(
    [...lockedByIndex.entries()].map(([index, color]) => [Number(index), parseColor(color)]),
  );

  if (locks.size >= 4) {
    const colors = [0, 1, 2, 3].map(
      (index) => locks.get(index) ?? previous?.colors?.[index] ?? "#888888",
    );
    return {
      colors,
      source: previous?.source ?? "Pinned",
    };
  }

  if (locks.size === 0) return generateColorCombination();

  let best = null;
  let bestScore = -Infinity;
  const lockedColors = [...locks.values()];
  const previousColors = previous?.colors ?? null;

  for (let attempt = 0; attempt < 56; attempt += 1) {
    let pool;
    let source;

    if (Math.random() < 0.62) {
      ({ pool, source } = poolAroundLockedColors(lockedColors));
    } else {
      const combo = generateColorCombination();
      pool = [...combo.colors, ...expandLockedColorCandidates(lockedColors, 4 - locks.size)];
      source = combo.source;
    }

    const colors = fillUnlockedColorSlots(locks, pool);
    let score = scoreLockedCombination(colors, locks) + Math.random() * 2.8;

    if (previousColors && !unlockedColorsChanged(colors, previousColors, locks)) {
      score -= 18;
    } else if (previousColors) {
      for (let index = 0; index < colors.length; index += 1) {
        if (locks.has(index)) continue;
        if (colorsTooClose(colors[index], previousColors[index], 28)) score -= 3.5;
        else score += 0.8;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = { colors, source };
    }
  }

  if (best && previousColors && !unlockedColorsChanged(best.colors, previousColors, locks)) {
    for (let retry = 0; retry < 16; retry += 1) {
      const { pool, source } = poolAroundLockedColors(lockedColors);
      const colors = fillUnlockedColorSlots(locks, pool);
      if (unlockedColorsChanged(colors, previousColors, locks)) {
        return { colors, source };
      }
    }
  }

  return best ?? {
    colors: fillUnlockedColorSlots(locks, generateColorCombination().colors),
    source: previous?.source ?? "Matched",
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
  if (!isMonochromePalette(palette)) {
    bwModeActive = false;
    preBwPalette = null;
  }
  syncBwButtons();
}

function isMonochromePalette(palette = currentPalette) {
  const ink = palette.ink.toLowerCase();
  const paper = palette.paper.toLowerCase();
  const defaultMatch = ink === defaultPalette.ink && paper === defaultPalette.paper;
  const invertedMatch = ink === invertedPalette.ink && paper === invertedPalette.paper;
  return defaultMatch || invertedMatch;
}

function toggleDefaultPalette() {
  if (!bwModeActive) {
    preBwPalette = { ...currentPalette };
    bwModeActive = true;
    applyPalette(invertedPalette);
    return;
  }

  if (isBwInverted()) {
    applyPalette(defaultPalette);
    return;
  }

  const restore = preBwPalette ?? defaultPalette;
  preBwPalette = null;
  bwModeActive = false;
  applyPalette(restore);
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

  const isTyping = target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
  if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;

  if (event.key === "Tab") {
    if (dialog.open) return;
    event.preventDefault();
    const currentIndex = brandTabButtons.findIndex(
      (button) => brandTabName(button) === activeBrandTab,
    );
    const fromIndex = currentIndex < 0 ? firstEnabledBrandTabIndex() : currentIndex;
    const nextIndex = event.shiftKey
      ? nextEnabledBrandTabIndex(fromIndex, -1)
      : nextEnabledBrandTabIndex(fromIndex, 1);
    selectBrandTab(brandTabButtons[nextIndex]);
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    if (dialog.open) {
      randomizeDialogPreview();
      return;
    }
    if (target instanceof HTMLElement && target.classList.contains("brand-tab")) {
      target.blur();
    }
    randomizeActiveTab();
    return;
  }

  if (canUseGridKeyboardNav(event)) {
    if (event.key === "Escape") {
      if (keyboardGridSelection) {
        event.preventDefault();
        clearKeyboardGridSelection();
        return;
      }
    }

    if (event.key === "Enter") {
      if (keyboardGridSelection?.tab === activeBrandTab) {
        event.preventDefault();
        lockKeyboardGridSelection();
        return;
      }
    }

    if (
      event.key === "ArrowUp"
      || event.key === "ArrowDown"
      || event.key === "ArrowLeft"
      || event.key === "ArrowRight"
    ) {
      event.preventDefault();
      navigateKeyboardGrid(event.key);
      return;
    }
  }

  if (event.code === "ArrowDown") {
    event.preventDefault();
    cycleShader(1);
    return;
  }

  if (event.code === "ArrowUp") {
    event.preventDefault();
    cycleShader(-1);
    return;
  }

  if (event.key.toLowerCase() === "b") {
    event.preventDefault();
    toggleDefaultPalette();
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

function updateUploadBorders() {
  const rects = document.querySelectorAll(".upload-border rect");
  rects.forEach((rect) => {
    const svg = rect.ownerSVGElement;
    if (!svg) return;
    const parent = svg.parentElement;
    if (!parent || parent.offsetWidth === 0) return;

    const width = parent.offsetWidth;
    const height = parent.offsetHeight;
    const perimeter = 2 * (width + height);

    const nominalPeriod = 20;
    const n = Math.round(perimeter / nominalPeriod);
    const actualPeriod = perimeter / n;

    const dash = actualPeriod * 0.4;
    const gap = actualPeriod * 0.6;

    rect.setAttribute("stroke-dasharray", `${dash.toFixed(2)} ${gap.toFixed(2)}`);
    rect.style.setProperty("--dash-period", `${actualPeriod.toFixed(2)}px`);
  });
}

window.addEventListener("resize", updateUploadBorders);
window.addEventListener("resize", syncGridFiltersPosition);
window.addEventListener("resize", syncGridActionsPosition);
window.addEventListener("scroll", syncGridFiltersPosition, { passive: true });
window.addEventListener("scroll", syncGridActionsPosition, { passive: true });

// Must run after paletteSources is initialized (used by color generator filters).
initTypeRegistryFilters();
initColorGeneratorFilters();

restoreSessionState();
syncBrandTabView();
initializeClientAccess();
