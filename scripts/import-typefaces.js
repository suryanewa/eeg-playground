#!/usr/bin/env node
/**
 * Aggregates free/open-source typefaces from public registries into src/typefaces.js.
 * Sources: Fontsource, Bunny Fonts, Fontshare.
 */
const fs = require("fs");
const path = require("path");

const outPath = path.join(__dirname, "..", "src", "typefaces.js");

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "brandy-typeface-import" },
  });
  if (!response.ok) throw new Error(`${url} → ${response.status}`);
  return response.json();
}

function pickWeight(weights = []) {
  const preferred = [700, 800, 600, 500, 900, 400, 300];
  for (const weight of preferred) {
    if (weights.includes(weight)) return weight;
  }
  return weights[0] ?? 400;
}

function normalizeKey(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** Color / emoji fonts (COLR, CBDT, SVG color, etc.) — unsuitable for ink-filled specimens. */
function isColoredFont(entry) {
  const id = String(entry.id ?? "").toLowerCase();
  const family = String(entry.family ?? "").toLowerCase();
  const key = normalizeKey(`${id} ${family}`);
  // Name signals: Color, Emoji, Twemoji, OpenMoji, Nabla, Blobmoji, etc.
  if (/(?:^|[^a-z])(color|emoji|twemoji|openmoji|nabla|blobmoji|fluentemoji)(?:[^a-z]|$)/i.test(`${id} ${family}`)) {
    return true;
  }
  // Known COLR variants that omit "Color" in the family name
  if (key.includes("bungeespice") || key.includes("bungeetint")) return true;
  // Material Icons ligature/icon packs (incl. two-tone); not text typefaces
  if (key.includes("materialicons")) return true;
  return false;
}

/** Fonts whose letterforms are built from horizontal rules / underlines — read as UI artifacts. */
function isLinedFont(entry) {
  const id = String(entry.id ?? "").toLowerCase();
  const family = String(entry.family ?? "").toLowerCase();
  const key = normalizeKey(`${id} ${family}`);
  const blob = `${id} ${family}`;
  if (/(?:^|[^a-z])(underline|pinstripe|linefont|striper)(?:[^a-z]|$)/i.test(blob)) return true;
  if (/(?:^|[^a-z])(inline)(?:[^a-z]|$)/i.test(blob)) return true;
  if (/(?:^|[^a-z])(lines|hatch)(?:[^a-z]|$)/i.test(blob)) return true;
  // Engraved / scanline display faces that fill strokes with horizontal rules
  if (key.includes("agudisplay")) return true;
  return false;
}

function addFont(byKey, entry) {
  if (isColoredFont(entry)) return;
  if (isLinedFont(entry)) return;
  const key = normalizeKey(entry.family);
  if (!key || !entry.family) return;
  const existing = byKey.get(key);
  if (!existing) {
    byKey.set(key, entry);
    return;
  }
  // Prefer entries that can be loaded via a CSS CDN, then denser metadata.
  const rank = (item) => {
    if (item.loader === "google") return 3;
    if (item.loader === "bunny") return 2;
    if (item.loader === "fontshare") return 2;
    if (item.loader === "fontsource") return 1;
    return 0;
  };
  if (rank(entry) > rank(existing)) byKey.set(key, entry);
}

async function loadFontsource(byKey) {
  const fonts = await fetchJson("https://api.fontsource.org/v1/fonts");
  let added = 0;
  for (const font of fonts) {
    const subsets = font.subsets ?? [];
    const hasLatin = subsets.includes("latin") || font.defSubset === "latin";
    if (!hasLatin) continue;
    const weight = pickWeight(font.weights);
    const loader = font.type === "google" ? "google" : "fontsource";
    addFont(byKey, {
      id: font.id,
      family: font.family,
      weight,
      loader,
      subset: subsets.includes("latin") ? "latin" : font.defSubset,
    });
    added += 1;
  }
  return added;
}

async function loadBunny(byKey) {
  const fonts = await fetchJson("https://fonts.bunny.net/list");
  let added = 0;
  for (const [id, meta] of Object.entries(fonts)) {
    const variants = meta.variants ?? {};
    const hasLatin = Object.prototype.hasOwnProperty.call(variants, "latin") || meta.defSubset === "latin";
    if (!hasLatin) continue;
    const weight = pickWeight(meta.weights ?? []);
    addFont(byKey, {
      id,
      family: meta.familyName || id,
      weight,
      loader: "bunny",
      subset: "latin",
    });
    added += 1;
  }
  return added;
}

async function loadFontshare(byKey) {
  const payload = await fetchJson("https://api.fontshare.com/v2/fonts?limit=200");
  let added = 0;
  for (const font of payload.fonts ?? []) {
    const license = String(font.license_type ?? "").toLowerCase();
    // Fontshare mixes free and trial; keep clearly free/open licenses.
    const free = !license || /ofl|sil|apache|mit|cc0|free|open/.test(license);
    if (!free && license.includes("trial")) continue;

    const weights = (font.styles ?? [])
      .flatMap((style) => (style.weights ?? []).map((item) => Number(item.weight)))
      .filter(Boolean);
    const weight = pickWeight(weights.length ? weights : [400, 700]);
    addFont(byKey, {
      id: font.slug,
      family: font.name,
      weight,
      loader: "fontshare",
      subset: "latin",
    });
    added += 1;
  }
  return added;
}

async function main() {
  const byKey = new Map();
  const counts = {
    fontsource: await loadFontsource(byKey),
    bunny: await loadBunny(byKey),
    fontshare: await loadFontshare(byKey),
  };

  const typefaces = [...byKey.values()].sort((a, b) => a.family.localeCompare(b.family));
  const banner = `/* Auto-generated by scripts/import-typefaces.js — do not edit by hand.
 * Free/open-source typefaces from Fontsource, Bunny Fonts, and Fontshare.
 * Generated: ${new Date().toISOString()} · Families: ${typefaces.length}
 */
`;

  const body = `${banner}export const typefaces = ${JSON.stringify(typefaces)};\n`;
  fs.writeFileSync(outPath, body);
  console.log(`Wrote ${typefaces.length} typefaces → ${path.relative(process.cwd(), outPath)}`);
  console.log(counts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
