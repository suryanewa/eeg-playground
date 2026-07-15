/**
 * Builds a DESIGN.md document from Brandy locked selections.
 * Follows https://github.com/google-labs-code/design.md (version alpha).
 */

const SEMANTIC_COLOR_ROLES = ["primary", "secondary", "tertiary", "neutral"];
const TYPE_ROLES = [
  { key: "headline-lg", fontSize: "32px", lineHeight: 1.15, letterSpacing: "-0.02em" },
  { key: "body-md", fontSize: "16px", lineHeight: 1.6 },
  { key: "label-md", fontSize: "14px", lineHeight: 1.3, letterSpacing: "0.02em" },
  { key: "headline-md", fontSize: "24px", lineHeight: 1.2, letterSpacing: "-0.01em" },
  { key: "body-sm", fontSize: "14px", lineHeight: 1.5 },
  { key: "label-sm", fontSize: "12px", lineHeight: 1.2, letterSpacing: "0.04em" },
];

function yamlScalar(value) {
  if (value == null) return '""';
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";

  const text = String(value);
  if (text === "") return '""';

  const needsQuotes = (
    text.startsWith("#")
    || text.includes(":")
    || text.includes("#")
    || text.includes("{")
    || text.includes("}")
    || text.includes("[")
    || text.includes("]")
    || text.includes(",")
    || text.includes("&")
    || text.includes("*")
    || text.includes("!")
    || text.includes("|")
    || text.includes(">")
    || text.includes("'")
    || text.includes('"')
    || text.includes("\n")
    || text.includes("\r")
    || /^\s|\s$/.test(text)
    || /^(true|false|null|yes|no|on|off)$/i.test(text)
    || /^[-+]?(\d+(\.\d+)?|\.\d+)$/.test(text)
  );

  if (!needsQuotes) return text;
  return `"${text.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function yamlBlock(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  const lines = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value == null) continue;

    if (typeof value === "object" && !Array.isArray(value)) {
      lines.push(`${pad}${key}:`);
      lines.push(yamlBlock(value, indent + 1));
      continue;
    }

    lines.push(`${pad}${key}: ${yamlScalar(value)}`);
  }

  return lines.join("\n");
}

function normalizeHex(color) {
  if (color == null) return null;
  const text = String(color).trim();
  if (!text) return null;
  return text.startsWith("#") ? text.toUpperCase() : `#${text}`.toUpperCase();
}

function colorLabel(hex, colorNames = {}) {
  const key = normalizeHex(hex)?.toLowerCase();
  const name = key ? colorNames[key] : null;
  const display = normalizeHex(hex) ?? String(hex);
  return name ? `${name} (${display})` : display;
}

function slugToken(value, fallback = "token") {
  const slug = String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function collectPaletteColors(lockedColors = []) {
  const tokens = {};
  const proseRows = [];

  lockedColors.forEach((row, rowIndex) => {
    const colors = Array.isArray(row.colors)
      ? row.colors.map(normalizeHex).filter(Boolean)
      : [];
    if (!colors.length && row.swatches && typeof row.swatches === "object") {
      for (const index of [0, 1, 2, 3]) {
        const hex = normalizeHex(row.swatches[String(index)]);
        if (hex) colors[index] = hex;
      }
    }

    const usable = colors.filter(Boolean);
    if (!usable.length) return;

    proseRows.push({
      source: row.source ?? "Locked",
      colors: usable,
    });

    usable.forEach((hex, swatchIndex) => {
      if (rowIndex === 0 && swatchIndex < SEMANTIC_COLOR_ROLES.length) {
        const role = SEMANTIC_COLOR_ROLES[swatchIndex];
        if (!tokens[role]) tokens[role] = hex;
        return;
      }

      const key = `palette-${rowIndex + 1}-${swatchIndex + 1}`;
      tokens[key] = hex;
    });
  });

  return { tokens, proseRows };
}

function collectTypography(lockedTypefaces = []) {
  const tokens = {};
  const proseFaces = [];

  lockedTypefaces.forEach((face, index) => {
    if (!face?.family) return;
    const role = TYPE_ROLES[index] ?? {
      key: `type-${index + 1}`,
      fontSize: "16px",
      lineHeight: 1.4,
    };
    const weight = Number(face.weight);
    tokens[role.key] = {
      fontFamily: face.family,
      fontSize: role.fontSize,
      fontWeight: Number.isFinite(weight) ? weight : 400,
      lineHeight: role.lineHeight,
      ...(role.letterSpacing ? { letterSpacing: role.letterSpacing } : {}),
    };
    proseFaces.push({
      role: role.key,
      family: face.family,
      weight: Number.isFinite(weight) ? weight : 400,
      loader: face.loader,
    });
  });

  // One locked face still needs body coverage for agents.
  if (proseFaces.length === 1 && !tokens["body-md"]) {
    const face = proseFaces[0];
    tokens["body-md"] = {
      fontFamily: face.family,
      fontSize: "16px",
      fontWeight: Math.min(face.weight, 500),
      lineHeight: 1.6,
    };
  }

  return { tokens, proseFaces };
}

function buildOverview({ logos, typefaces, lockups, proseRows, palette }) {
  const parts = [
    "Visual identity selections exported from Brandy (locked palette, type, marks, and lockups).",
  ];

  if (palette?.ink || palette?.paper) {
    parts.push(
      `Current UI ink/paper context: ink ${normalizeHex(palette.ink) ?? palette.ink}`
      + `, paper ${normalizeHex(palette.paper) ?? palette.paper}`
      + (palette.source ? ` (${palette.source})` : "")
      + ".",
    );
  }

  if (proseRows.length) {
    parts.push(
      `Locked color ${proseRows.length === 1 ? "row" : "rows"}: ${proseRows.length}.`,
    );
  }

  if (typefaces.length) {
    const names = typefaces.map((face) => face.family).filter(Boolean);
    parts.push(`Locked typefaces: ${names.join(", ")}.`);
  }

  if (logos.length) {
    const names = logos.map((logo) => logo.name || logo.id).filter(Boolean);
    parts.push(
      `Locked logos/marks: ${names.join(", ")}. Full SVG markup ships in the companion Brandy JSON export.`,
    );
  }

  if (lockups.length) {
    const summaries = lockups.map((entry) => {
      const mark = entry.logo?.name || entry.logoId || "mark";
      const face = entry.typeface?.family || "typeface";
      return `${mark} + ${face}`;
    });
    parts.push(`Locked lockups: ${summaries.join("; ")}.`);
  }

  return parts.join("\n\n");
}

function buildColorsSection({ tokens, proseRows, palette, colorNames }) {
  const lines = [
    "Palette values come from Brandy locked swatches, plus the active ink/paper UI context.",
  ];

  if (palette?.ink) {
    lines.push(
      `- **Ink (${normalizeHex(palette.ink)}):** Primary drawing/text color for marks and UI chrome.`,
    );
  }
  if (palette?.paper) {
    lines.push(
      `- **Paper (${normalizeHex(palette.paper)}):** Page/background surface behind marks and type.`,
    );
  }

  proseRows.forEach((row, index) => {
    const swatches = row.colors
      .map((hex, swatchIndex) => {
        const role = index === 0 && swatchIndex < SEMANTIC_COLOR_ROLES.length
          ? SEMANTIC_COLOR_ROLES[swatchIndex]
          : `palette-${index + 1}-${swatchIndex + 1}`;
        return `**${role}** ${colorLabel(hex, colorNames)}`;
      })
      .join(", ");
    lines.push(`- **Row ${index + 1}** (${row.source}): ${swatches}.`);
  });

  const extras = Object.entries(tokens).filter(([key]) => (
    !SEMANTIC_COLOR_ROLES.includes(key)
    && key !== "ink"
    && key !== "paper"
    && key !== "surface"
    && key !== "on-surface"
    && key !== "background"
    && key !== "on-background"
  ));
  if (extras.length && !proseRows.length) {
    for (const [key, hex] of extras) {
      lines.push(`- **${key}:** ${colorLabel(hex, colorNames)}.`);
    }
  }

  return lines.join("\n");
}

function buildTypographySection(proseFaces) {
  if (!proseFaces.length) return "";

  const lines = [
    "Type roles are mapped from Brandy locked typefaces. Sizes are suggested defaults for agent use; family and weight are authoritative.",
  ];

  for (const face of proseFaces) {
    const source = face.loader ? ` via ${face.loader}` : "";
    lines.push(
      `- **${face.role}:** ${face.family} (${face.weight})${source}.`,
    );
  }

  return lines.join("\n");
}

function buildComponentsSection({ logos, lockups }) {
  const lines = [];

  if (logos.length) {
    lines.push("### Logos");
    lines.push(
      "Locked marks selected in Brandy. Prefer these assets for brand presence; SVG source lives in the companion JSON export.",
    );
    for (const logo of logos) {
      const label = logo.name || logo.id || "Logo";
      lines.push(`- **${label}**${logo.id ? ` (\`${logo.id}\`)` : ""}`);
    }
  }

  if (lockups.length) {
    if (lines.length) lines.push("");
    lines.push("### Lockups");
    lines.push(
      "Approved logo + typeface pairings. Keep mark and wordmark relationships consistent with these combinations.",
    );
    lockups.forEach((entry, index) => {
      const mark = entry.logo?.name || entry.logoId || "mark";
      const face = entry.typeface?.family
        ? `${entry.typeface.family}${entry.typeface.weight != null ? ` ${entry.typeface.weight}` : ""}`
        : "typeface";
      lines.push(`- **Lockup ${index + 1}:** ${mark} with ${face}.`);
    });
  }

  return lines.join("\n");
}

/**
 * @param {object} context
 * @param {string} [context.name]
 * @param {string} [context.description]
 * @param {{ ink?: string, paper?: string, source?: string }} [context.palette]
 * @param {Array<{ slot?: number, source?: string, colors?: string[], swatches?: Record<string, string> }>} [context.colors]
 * @param {Array<{ id?: string, name?: string }>} [context.logos]
 * @param {Array<{ id?: string, family?: string, weight?: number, loader?: string }>} [context.typefaces]
 * @param {Array<{ logoId?: string, logo?: { id?: string, name?: string }, typeface?: { family?: string, weight?: number } }>} [context.lockups]
 * @param {Record<string, string>} [context.colorNames]
 */
export function buildDesignMd(context = {}) {
  const palette = context.palette ?? {};
  const logos = Array.isArray(context.logos) ? context.logos : [];
  const typefaces = Array.isArray(context.typefaces) ? context.typefaces : [];
  const lockups = Array.isArray(context.lockups) ? context.lockups : [];
  const colorNames = context.colorNames ?? {};

  const { tokens: colorTokensFromLocks, proseRows } = collectPaletteColors(context.colors);
  const { tokens: typographyTokens, proseFaces } = collectTypography(typefaces);

  const colors = { ...colorTokensFromLocks };
  const ink = normalizeHex(palette.ink);
  const paper = normalizeHex(palette.paper);
  if (ink) {
    colors.ink = ink;
    if (!colors["on-surface"]) colors["on-surface"] = ink;
    if (!colors["on-background"]) colors["on-background"] = ink;
  }
  if (paper) {
    colors.paper = paper;
    if (!colors.surface) colors.surface = paper;
    if (!colors.background) colors.background = paper;
    if (!colors.neutral) colors.neutral = paper;
  }

  // Prefer a primary when only ink/paper exist so agents have a lead color.
  if (!colors.primary && ink) colors.primary = ink;

  const frontMatter = {
    version: "alpha",
    name: context.name || "Brandy",
    description: context.description
      || "Design tokens generated from locked Brandy brand selections.",
  };

  if (Object.keys(colors).length) frontMatter.colors = colors;
  if (Object.keys(typographyTokens).length) frontMatter.typography = typographyTokens;

  if (colors.primary && (colors.paper || colors.surface || ink)) {
    frontMatter.components = {
      "button-primary": {
        backgroundColor: "{colors.primary}",
        textColor: paper && colors.primary !== paper
          ? "{colors.paper}"
          : ink
            ? "{colors.ink}"
            : "{colors.on-surface}",
      },
    };
  }

  const sections = [];
  sections.push("## Overview");
  sections.push(buildOverview({
    logos,
    typefaces: proseFaces,
    lockups,
    proseRows,
    palette,
  }));

  if (Object.keys(colors).length) {
    sections.push("## Colors");
    sections.push(buildColorsSection({
      tokens: colors,
      proseRows,
      palette,
      colorNames,
    }));
  }

  if (proseFaces.length) {
    sections.push("## Typography");
    sections.push(buildTypographySection(proseFaces));
  }

  const componentsBody = buildComponentsSection({ logos, lockups });
  if (componentsBody || frontMatter.components) {
    sections.push("## Components");
    sections.push(
      componentsBody
      || "Primary actions use the locked primary color against the paper surface.",
    );
  }

  return `---\n${yamlBlock(frontMatter)}\n---\n\n${sections.join("\n\n")}\n`;
}

export function designMdFilename(name = "Brandy") {
  const slug = slugToken(name, "brandy");
  return slug === "brandy" ? "DESIGN.md" : `${slug}-DESIGN.md`;
}
