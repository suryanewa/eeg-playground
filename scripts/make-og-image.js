const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.join(__dirname, "..");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = ""] = arg.split("=");
  return [key, value];
}));

const BRAND_MARK_PATH = "M391.8,734c1.4,31.3-9.8,51.5-33.2,61-13.7,5.4-22.2,5-36.5,5H77.9c-14.3,0-22.8.4-36.5-5-23.5-9.4-34.7-29.6-33.2-61C-4.4,392.9-.9,346.7,8.2,305.9c13.1-58.5,35.4-73.8,44.3-80.2,24.9-17.9,53.7-19.7,68.3-45.1,7.6-13.3,7.9-27,7.1-36.3V8.3c0-4.6,4-8.3,8.9-8.3h126.4c4.9,0,8.9,3.7,8.9,8.3v136c-.8,9.3-.5,23.1,7.1,36.3,14.6,25.5,43.3,27.2,68.3,45.1,9,6.5,31.3,21.7,44.3,80.2,9.1,40.7,12.6,87,0,428.1Z";

const ink = args.get("--ink") || "#000000";
const paper = args.get("--paper") || "#ffffff";
const svgOutput = path.resolve(root, args.get("--svg") || "assets/og-image.svg");
const pngOutput = path.resolve(root, args.get("--output") || "assets/og-image.png");
const width = 1200;
const height = 630;
const iconScale = 0.13;
const iconWidth = Math.round(400 * iconScale);
const iconHeight = Math.round(800 * iconScale);
const fontSize = 96;
const gap = 20;
const textWidth = Math.round(fontSize * 3.15);
const lockupWidth = iconWidth + gap + textWidth;
const lockupLeft = (width - lockupWidth) / 2;
const iconLeft = Math.round(lockupLeft);
const textLeft = Math.round(iconLeft + iconWidth + gap);
const centerY = height / 2;
const iconTop = Math.round(centerY - iconHeight / 2);
const textTop = Math.round(centerY - fontSize * 0.38);

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${paper}"/>
  <g transform="translate(${iconLeft} ${iconTop}) scale(${iconScale})">
    <path fill="${ink}" fill-rule="evenodd" d="${BRAND_MARK_PATH}"/>
  </g>
  <text
    x="${textLeft}"
    y="${textTop + fontSize}"
    fill="${ink}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${fontSize}"
    font-weight="700"
    letter-spacing="-2.8"
  >Brandy</text>
</svg>
`;

const fontPath = [
  "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
  "/Library/Fonts/Arial Bold.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
].find((candidate) => fs.existsSync(candidate));
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "brandy-og-"));
const iconSvg = path.join(tempDir, "icon.svg");
const iconPng = path.join(tempDir, "icon.png");

fs.mkdirSync(path.dirname(svgOutput), { recursive: true });
fs.writeFileSync(svgOutput, svg);

fs.writeFileSync(iconSvg, `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800" viewBox="0 0 400 800">
  <path fill="${ink}" fill-rule="evenodd" d="${BRAND_MARK_PATH}"/>
</svg>`);

try {
  execFileSync("magick", [
    "-background",
    "none",
    iconSvg,
    "-resize",
    `${iconWidth}x${iconHeight}`,
    iconPng,
  ], { stdio: "inherit" });

  execFileSync("magick", [
    "-size",
    `${width}x${height}`,
    `canvas:${paper}`,
    iconPng,
    "-geometry",
    `+${iconLeft}+${iconTop}`,
    "-composite",
    ...(fontPath ? ["-font", fontPath] : []),
    "-fill",
    ink,
    "-pointsize",
    String(fontSize),
    "-kerning",
    "-3",
    "-annotate",
    `+${textLeft}+${textTop}`,
    "Brandy",
    pngOutput,
  ], { stdio: "inherit" });
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

console.log(`Wrote ${path.relative(root, svgOutput)}`);
console.log(`Wrote ${path.relative(root, pngOutput)}`);
