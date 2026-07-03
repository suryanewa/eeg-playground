const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.join(__dirname, "..");
const logoDir = path.join(root, "assets", "logos");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = ""] = arg.split("=");
  return [key, value];
}));
const seed = Number(args.get("--seed") || 20260706);
const pngOutput = path.resolve(root, args.get("--output") || "assets/og-image.png");
const width = 1200;
const height = 630;
const logoSize = 104;

function mulberry32(seed) {
  return () => {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function runMagick(args) {
  execFileSync("magick", args, { stdio: "inherit" });
}

function placeLogo(canvas, logo, placement, output) {
  const size = Math.round(placement.size);
  const rotatedSize = Math.ceil(size * 1.45);
  const x = Math.min(width - rotatedSize, Math.max(0, Math.round(placement.x - rotatedSize / 2)));
  const y = Math.min(height - rotatedSize, Math.max(0, Math.round(placement.y - rotatedSize / 2)));

  runMagick([
    canvas,
    "(",
    logo,
    "-resize",
    `${size}x${size}`,
    "-background",
    "none",
    "-gravity",
    "center",
    "-extent",
    `${rotatedSize}x${rotatedSize}`,
    "-rotate",
    placement.rotation.toFixed(2),
    ")",
    "-gravity",
    "northwest",
    "-geometry",
    `+${x}+${y}`,
    "-compose",
    "over",
    "-composite",
    output,
  ]);
}

const random = mulberry32(seed);
const logos = fs.readdirSync(logoDir)
  .filter((fileName) => /^logo-\d+\.svg$/.test(fileName))
  .sort();
const chosenLogos = shuffle(logos, random).slice(0, 48);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eeg-og-"));

try {
  const rasterLogos = new Map(chosenLogos.map((fileName) => {
    const input = path.join(logoDir, fileName);
    const output = path.join(tempDir, `${path.basename(fileName, ".svg")}.png`);
    runMagick([
      input,
      "-background",
      "none",
      "-trim",
      "+repage",
      "-resize",
      "640x640",
      "-gravity",
      "center",
      "-extent",
      "640x640",
      output,
    ]);
    return [fileName, output];
  }));

  let canvas = path.join(tempDir, "canvas-000.png");
  runMagick(["-size", `${width}x${height}`, "canvas:white", canvas]);

  const placements = [];
  const columns = 7;
  const rows = 4;
  const cellWidth = width / columns;
  const cellHeight = height / rows;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      placements.push({
        logo: chosenLogos[placements.length % chosenLogos.length],
        size: logoSize,
        x: column * cellWidth + cellWidth / 2,
        y: row * cellHeight + cellHeight / 2,
        rotation: 0,
      });
    }
  }

  placements.forEach((placement, index) => {
    const nextCanvas = index === placements.length - 1
      ? pngOutput
      : path.join(tempDir, `canvas-${String(index + 1).padStart(3, "0")}.png`);
    placeLogo(canvas, rasterLogos.get(placement.logo), placement, nextCanvas);
    canvas = nextCanvas;
  });

  console.log(`Wrote ${path.relative(root, pngOutput)}`);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}
