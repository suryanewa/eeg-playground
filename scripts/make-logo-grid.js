const fs = require("fs");
const path = require("path");

const input = process.argv[2];
const output =
  process.argv[3] ||
  path.join(path.dirname(input), `${path.basename(input, ".svg")} Grid.svg`);
const replaceLast = process.env.LOGO_GRID_REPLACE_LAST;
const exportDir = process.env.LOGO_GRID_EXPORT_DIR;

if (!input) {
  console.error("Usage: node scripts/make-logo-grid.js input.svg [output.svg]");
  process.exit(1);
}

const source = fs.readFileSync(input, "utf8");

const defs = source.match(/<defs[\s\S]*?<\/defs>/)?.[0] || "";
const layerOpen = source.match(/<g\b[^>]*\bid="Layer_1"[^>]*>/);
if (!layerOpen) {
  throw new Error("Could not find Layer_1 in the SVG.");
}

const layerStart = layerOpen.index + layerOpen[0].length;
let cursor = layerStart;
let depth = 1;
let layerEnd = -1;
const tagRe = /<\/?g\b[^>]*>|<[^>]+\/>|<[^>]+>/g;
tagRe.lastIndex = layerStart;

while (true) {
  const match = tagRe.exec(source);
  if (!match) break;
  const tag = match[0];
  if (tag.startsWith("</g")) {
    depth -= 1;
    if (depth === 0) {
      layerEnd = match.index;
      break;
    }
  } else if (tag.startsWith("<g") && !tag.endsWith("/>")) {
    depth += 1;
  }
  cursor = tagRe.lastIndex;
}

if (layerEnd < 0) {
  throw new Error("Could not find the end of Layer_1.");
}

const layerInner = source.slice(layerStart, layerEnd);

function svgInner(xml) {
  const open = xml.match(/<svg\b[^>]*>/);
  if (!open) throw new Error("Replacement file is not an SVG.");
  const start = open.index + open[0].length;
  const end = xml.lastIndexOf("</svg>");
  if (end < 0) throw new Error("Replacement SVG has no closing </svg>.");
  return xml.slice(start, end);
}

function directChildren(xml) {
  const children = [];
  const re = /<[^!?][^>]*>/g;
  let i = 0;

  while (i < xml.length) {
    const next = xml.slice(i).search(/<[^!?][^>]*>/);
    if (next < 0) break;
    const start = i + next;
    const open = xml.slice(start).match(/^<([a-zA-Z][\w:-]*)(?:\s[^>]*)?>/);
    if (!open) {
      i = start + 1;
      continue;
    }

    const tag = open[1];
    const openText = open[0];
    if (openText.startsWith("</")) {
      i = start + openText.length;
      continue;
    }
    if (openText.endsWith("/>")) {
      children.push(xml.slice(start, start + openText.length));
      i = start + openText.length;
      continue;
    }

    const nested = new RegExp(`<\\/?${tag}\\b[^>]*>|<${tag}\\b[^>]*\\/>`, "g");
    nested.lastIndex = start;
    let d = 0;
    let end = -1;
    while (true) {
      const m = nested.exec(xml);
      if (!m) break;
      const text = m[0];
      if (text.startsWith(`</${tag}`)) {
        d -= 1;
        if (d === 0) {
          end = nested.lastIndex;
          break;
        }
      } else if (!text.endsWith("/>")) {
        d += 1;
      }
    }
    if (end < 0) {
      throw new Error(`Could not close <${tag}> starting at ${start}.`);
    }
    children.push(xml.slice(start, end));
    i = end;
  }

  return children.filter((child) => {
    if (/^<line\b[^>]*class="cls-1"/.test(child)) return false;
    if (/^<path\b[^>]*class="cls-5"/.test(child)) return false;
    return true;
  });
}

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

function addBox(box, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  box.minX = Math.min(box.minX, x);
  box.minY = Math.min(box.minY, y);
  box.maxX = Math.max(box.maxX, x);
  box.maxY = Math.max(box.maxY, y);
}

function pathBox(d) {
  const box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/g) || [];
  let i = 0;
  let cmd = "";
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;

  const isCommand = (value) => /^[a-zA-Z]$/.test(value || "");
  const number = () => Number(tokens[i++]);

  while (i < tokens.length) {
    if (isCommand(tokens[i])) cmd = tokens[i++];
    if (!cmd) break;

    const relative = cmd === cmd.toLowerCase();
    const op = cmd.toUpperCase();

    if (op === "M") {
      while (i < tokens.length && !isCommand(tokens[i])) {
        let nx = number();
        let ny = number();
        if (relative) {
          nx += x;
          ny += y;
        }
        x = nx;
        y = ny;
        startX = x;
        startY = y;
        addBox(box, x, y);
        cmd = relative ? "l" : "L";
      }
    } else if (op === "L") {
      while (i < tokens.length && !isCommand(tokens[i])) {
        let nx = number();
        let ny = number();
        if (relative) {
          nx += x;
          ny += y;
        }
        x = nx;
        y = ny;
        addBox(box, x, y);
      }
    } else if (op === "H") {
      while (i < tokens.length && !isCommand(tokens[i])) {
        x = relative ? x + number() : number();
        addBox(box, x, y);
      }
    } else if (op === "V") {
      while (i < tokens.length && !isCommand(tokens[i])) {
        y = relative ? y + number() : number();
        addBox(box, x, y);
      }
    } else if (op === "C") {
      while (i < tokens.length && !isCommand(tokens[i])) {
        const coords = [number(), number(), number(), number(), number(), number()];
        for (let j = 0; j < coords.length; j += 2) {
          const px = relative ? x + coords[j] : coords[j];
          const py = relative ? y + coords[j + 1] : coords[j + 1];
          addBox(box, px, py);
        }
        x = relative ? x + coords[4] : coords[4];
        y = relative ? y + coords[5] : coords[5];
      }
    } else if (op === "S" || op === "Q") {
      const size = op === "S" ? 4 : 4;
      while (i < tokens.length && !isCommand(tokens[i])) {
        const coords = Array.from({ length: size }, number);
        for (let j = 0; j < coords.length; j += 2) {
          const px = relative ? x + coords[j] : coords[j];
          const py = relative ? y + coords[j + 1] : coords[j + 1];
          addBox(box, px, py);
        }
        x = relative ? x + coords[size - 2] : coords[size - 2];
        y = relative ? y + coords[size - 1] : coords[size - 1];
      }
    } else if (op === "T") {
      while (i < tokens.length && !isCommand(tokens[i])) {
        let nx = number();
        let ny = number();
        if (relative) {
          nx += x;
          ny += y;
        }
        x = nx;
        y = ny;
        addBox(box, x, y);
      }
    } else if (op === "Z") {
      x = startX;
      y = startY;
      addBox(box, x, y);
    } else {
      break;
    }
  }

  return box;
}

function merge(target, box) {
  if (!Number.isFinite(box.minX)) return;
  addBox(target, box.minX, box.minY);
  addBox(target, box.maxX, box.maxY);
}

function bbox(xml) {
  const box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (const m of xml.matchAll(/<(path|polygon|polyline|rect|line|circle|ellipse)\b[^>]*>/g)) {
    const tag = m[1];
    const a = attrs(m[0]);
    if (tag === "path" && a.d) {
      merge(box, pathBox(a.d));
    } else if ((tag === "polygon" || tag === "polyline") && a.points) {
      const nums = a.points.match(/[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/g)?.map(Number) || [];
      for (let i = 0; i + 1 < nums.length; i += 2) addBox(box, nums[i], nums[i + 1]);
    } else if (tag === "rect") {
      const x = Number(a.x || 0);
      const y = Number(a.y || 0);
      addBox(box, x, y);
      addBox(box, x + Number(a.width || 0), y + Number(a.height || 0));
    } else if (tag === "line") {
      addBox(box, Number(a.x1 || 0), Number(a.y1 || 0));
      addBox(box, Number(a.x2 || 0), Number(a.y2 || 0));
    } else if (tag === "circle") {
      const cx = Number(a.cx || 0);
      const cy = Number(a.cy || 0);
      const r = Number(a.r || 0);
      addBox(box, cx - r, cy - r);
      addBox(box, cx + r, cy + r);
    } else if (tag === "ellipse") {
      const cx = Number(a.cx || 0);
      const cy = Number(a.cy || 0);
      const rx = Number(a.rx || 0);
      const ry = Number(a.ry || 0);
      addBox(box, cx - rx, cy - ry);
      addBox(box, cx + rx, cy + ry);
    }
  }
  return box;
}

const logos = directChildren(layerInner)
  .map((xml, index) => ({ xml: xml.trim(), index, box: bbox(xml) }))
  .filter((logo) => Number.isFinite(logo.box.minX))
  .map((logo) => ({
    ...logo,
    width: logo.box.maxX - logo.box.minX,
    height: logo.box.maxY - logo.box.minY,
  }))
  .filter((logo) => {
    if (logo.width <= 0 || logo.height <= 0) return false;
    const longSide = Math.max(logo.width, logo.height);
    const shortSide = Math.min(logo.width, logo.height);
    return !(shortSide < 2 && longSide < 10);
  });

if (replaceLast) {
  const replacementXml = svgInner(fs.readFileSync(replaceLast, "utf8")).trim();
  const replacementBox = bbox(replacementXml);
  const replacement = {
    xml: replacementXml,
    index: logos.length - 1,
    box: replacementBox,
    width: replacementBox.maxX - replacementBox.minX,
    height: replacementBox.maxY - replacementBox.minY,
  };
  if (!Number.isFinite(replacementBox.minX) || replacement.width <= 0 || replacement.height <= 0) {
    throw new Error("Replacement SVG does not contain measurable artwork.");
  }
  logos[logos.length - 1] = replacement;
}

const columns = Number(process.env.LOGO_GRID_COLUMNS || 8);
const cell = Number(process.env.LOGO_GRID_CELL || 1200);
const padding = Number(process.env.LOGO_GRID_PADDING || 170);
const visualAreaSide = Number(process.env.LOGO_GRID_VISUAL_AREA_SIDE || 560);
const maxLogoSide = Number(process.env.LOGO_GRID_MAX_LOGO_SIDE || cell - padding * 2);
const rows = Math.ceil(logos.length / columns);
const width = columns * cell;
const height = rows * cell;

function logoScale(logo, size = cell) {
  const maxSideScale = Math.min(maxLogoSide / logo.width, maxLogoSide / logo.height);
  const areaScale = Math.sqrt((visualAreaSide * visualAreaSide) / (logo.width * logo.height));
  const cellScale = Math.min((size - padding * 2) / logo.width, (size - padding * 2) / logo.height);
  return Math.min(areaScale, maxSideScale, cellScale);
}

function centeredLogoMarkup(logo, size = cell) {
  const scale = logoScale(logo, size);
  const targetX = size / 2 - ((logo.box.minX + logo.box.maxX) / 2) * scale;
  const targetY = size / 2 - ((logo.box.minY + logo.box.maxY) / 2) * scale;
  return `<g transform="translate(${targetX.toFixed(3)} ${targetY.toFixed(3)}) scale(${scale.toFixed(6)})">\n    ${logo.xml}\n  </g>`;
}

if (exportDir) {
  fs.rmSync(exportDir, { recursive: true, force: true });
  fs.mkdirSync(exportDir, { recursive: true });
  logos.forEach((logo, index) => {
    const fileName = `logo-${String(index + 1).padStart(3, "0")}.svg`;
    const standalone = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${cell} ${cell}" width="${cell}" height="${cell}">\n  ${defs}\n  ${centeredLogoMarkup(logo)}\n</svg>\n`;
    fs.writeFileSync(path.join(exportDir, fileName), standalone);
  });
  fs.writeFileSync(
    path.join(exportDir, "manifest.json"),
    `${JSON.stringify(
      logos.map((_, index) => `logo-${String(index + 1).padStart(3, "0")}.svg`),
      null,
      2,
    )}\n`,
  );
}

const placed = logos
  .map((logo, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const scale = logoScale(logo);
    const targetX = col * cell + cell / 2 - ((logo.box.minX + logo.box.maxX) / 2) * scale;
    const targetY = row * cell + cell / 2 - ((logo.box.minY + logo.box.maxY) / 2) * scale;
    return `  <g transform="translate(${targetX.toFixed(3)} ${targetY.toFixed(3)}) scale(${scale.toFixed(6)})">\n    ${logo.xml}\n  </g>`;
  })
  .join("\n");

const grid = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n  <rect width="100%" height="100%" fill="#fff"/>\n  ${defs}\n${placed}\n</svg>\n`;

fs.writeFileSync(output, grid);
console.log(`Wrote ${logos.length} logos to ${output}`);
