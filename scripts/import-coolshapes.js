const fs = require("fs");
const path = require("path");

const sourceRoot = process.argv[2];
const outputPath = process.argv[3];

if (!sourceRoot || !outputPath) {
  console.error("Usage: node scripts/import-coolshapes.js <coolshapes src/shapes> <output.js>");
  process.exit(1);
}

const categories = [
  ["stars", "Star"],
  ["triangles", "Triangle"],
  ["moons", "Moon"],
  ["polygons", "Polygon"],
  ["flowers", "Flower"],
  ["rectangles", "Rectangle"],
  ["ellipses", "Ellipse"],
  ["wheels", "Wheel"],
  ["miscs", "Misc"],
  ["numbers", "Number"],
];
const artboardSize = 1200;
const sourceSize = 200;
const artworkSize = 720;
const artworkOffset = (artboardSize - artworkSize) / 2;
const artworkScale = artworkSize / sourceSize;

function shapeNumber(fileName) {
  return Number(fileName.match(/_(\d+)\.tsx$/)?.[1] ?? 0);
}

function maskMarkup(source, filePath) {
  const mask = source.match(/<mask\b[^>]*>([\s\S]*?)<\/mask>/)?.[1];
  if (!mask) throw new Error(`No mask found in ${filePath}`);

  return mask
    .replace(/\s+clipPath=\{`[^`]*`\}/g, "")
    .replace(/fillRule=/g, "fill-rule=")
    .replace(/clipRule=/g, "clip-rule=")
    .replace(/fill="#fff"/gi, 'fill="currentColor"')
    .replace(/>\s+</g, "><")
    .trim();
}

const shapes = [];
categories.forEach(([directoryName, categoryName]) => {
  const directory = path.join(sourceRoot, directoryName);
  const files = fs.readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".tsx"))
    .sort((left, right) => shapeNumber(left) - shapeNumber(right));

  files.forEach((fileName) => {
    const filePath = path.join(directory, fileName);
    const source = fs.readFileSync(filePath, "utf8");
    const index = shapeNumber(fileName);
    const geometry = maskMarkup(source, filePath);
    shapes.push({
      name: `Coolshape ${categoryName} ${index}`,
      markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${artboardSize} ${artboardSize}" preserveAspectRatio="xMidYMid meet"><g transform="translate(${artworkOffset} ${artworkOffset}) scale(${artworkScale})">${geometry}</g></svg>`,
    });
  });
});

if (shapes.length !== 115) {
  throw new Error(`Expected 115 Coolshapes, found ${shapes.length}`);
}

const header = `// Generated from realvjy/coolshapes-react (MIT License).\n`
  + `// Source: https://github.com/realvjy/coolshapes-react\n`;
fs.writeFileSync(outputPath, `${header}export const coolshapePlaceholders = ${JSON.stringify(shapes, null, 2)};\n`);
console.log(`Imported ${shapes.length} Coolshapes into ${outputPath}`);
