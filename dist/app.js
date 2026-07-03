(() => {
  // node_modules/fettepalette/dist/index.mjs
  var easingFunctions = {
    linear: (x) => x,
    easeInSine: (x, accentuation = 0) => 1 - Math.cos(x * Math.PI / 2 + accentuation * Math.PI / 2),
    easeOutSine: (x, accentuation = 0) => Math.sin(x * Math.PI / 2 + accentuation * Math.PI / 2),
    easeInOutSine: (x, accentuation = 0) => -(Math.cos(Math.PI * (x + accentuation) / (1 + 2 * accentuation)) - 1) / 2,
    easeInQuad: (x, accentuation = 0) => x * x + accentuation * x * (1 - x),
    easeOutQuad: (x, accentuation = 0) => 1 - (1 - x) * (1 - x) - accentuation * x * (1 - x),
    easeInOutQuad: (x, accentuation = 0) => x < 0.5 ? 2 * x * x + accentuation * x * (1 - 2 * x) : 1 - Math.pow(-2 * x + 2, 2) / 2 - accentuation * (2 * x - 1) * (1 - Math.pow(-2 * x + 2, 2) / 2),
    easeInCubic: (x, accentuation = 0) => x * x * x + accentuation * x * x * (1 - x),
    easeOutCubic: (x, accentuation = 0) => 1 - Math.pow(1 - x, 3) - accentuation * Math.pow(1 - x, 2) * (1 - x),
    easeInOutCubic: (x, accentuation = 0) => x < 0.5 ? 4 * x * x * x + accentuation * x * x * (1 - 2 * x) : 1 - Math.pow(-2 * x + 2, 3) / 2 - accentuation * Math.pow(-2 * x + 2, 2) * (2 * x - 1) / 2,
    easeInQuart: (x, accentuation = 0) => x * x * x * x + accentuation * x * x * x * (1 - x),
    easeOutQuart: (x, accentuation = 0) => 1 - Math.pow(1 - x, 4) - accentuation * Math.pow(1 - x, 3) * (1 - x),
    easeInOutQuart: (x, accentuation = 0) => x < 0.5 ? 8 * x * x * x * x + accentuation * x * x * x * (1 - 2 * x) : 1 - Math.pow(-2 * x + 2, 4) / 2 - accentuation * Math.pow(-2 * x + 2, 3) * (2 * x - 1) / 2,
    easeInQuint: (x, accentuation = 0) => x * x * x * x * x + accentuation * x * x * x * x * (1 - x),
    easeOutQuint: (x, accentuation = 0) => 1 - Math.pow(1 - x, 5) - accentuation * Math.pow(1 - x, 4) * (1 - x),
    easeInOutQuint: (x, accentuation = 0) => x < 0.5 ? 16 * x * x * x * x * x + accentuation * x * x * x * x * (1 - 2 * x) : 1 - Math.pow(-2 * x + 2, 5) / 2 - accentuation * Math.pow(-2 * x + 2, 4) * (2 * x - 1) / 2,
    easeInExpo: (x, accentuation = 0) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)) + accentuation * Math.pow(2, 10 * (x - 1)),
    easeOutExpo: (x, accentuation = 0) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)) - accentuation * (1 - Math.pow(2, -10 * x)),
    easeInOutExpo: (x, accentuation = 0) => {
      if (x === 0) {
        return 0;
      }
      if (x === 1) {
        return 1;
      }
      if (x < 0.5) {
        return Math.pow(2, 20 * x - 10) / 2 + accentuation * Math.pow(2, 20 * x - 10) / 2;
      }
      return (2 - Math.pow(2, -20 * x + 10)) / 2 - accentuation * (2 - Math.pow(2, -20 * x + 10)) / 2;
    },
    easeInCirc: (x, accentuation = 0) => 1 - Math.sqrt(1 - Math.pow(x, 2)) + accentuation * Math.sqrt(1 - Math.pow(x, 2)),
    easeOutCirc: (x, accentuation = 0) => Math.sqrt(1 - Math.pow(x - 1, 2)) - accentuation * Math.sqrt(1 - Math.pow(x - 1, 2)),
    easeInOutCirc: (x, accentuation = 0) => {
      if (x < 0.5) {
        return (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 + accentuation * (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2;
      }
      return (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2 - accentuation * (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    },
    random: () => Math.random()
  };
  var easingFunctionsKeys = Object.keys(easingFunctions);
  var hsv2hsl = (h2, s2, v, l2 = v - v * s2 / 2, m3 = Math.min(l2, 1 - l2)) => [h2, m3 ? (v - l2) / m3 : 0, l2];
  var hsv2hsx = (h2, s2, v, mode) => mode === "hsl" ? hsv2hsl(h2, s2, v) : [h2, s2, v];
  var pointOnCurve = (curveMethod, i2, total, curveAccent, min = [0, 0], max = [1, 1]) => {
    const limit = Math.PI / 2;
    const slice = limit / total;
    const percentile = i2 / total;
    let x = 0, y2 = 0;
    if (curveMethod === "lam\xE9") {
      const t2 = percentile * limit;
      const exp = 2 / (2 + 20 * curveAccent);
      const cosT = Math.cos(t2);
      const sinT = Math.sin(t2);
      x = Math.sign(cosT) * Math.abs(cosT) ** exp;
      y2 = Math.sign(sinT) * Math.abs(sinT) ** exp;
    } else if (curveMethod === "arc") {
      y2 = Math.cos(-Math.PI / 2 + i2 * slice + curveAccent);
      x = Math.sin(Math.PI / 2 + i2 * slice - curveAccent);
    } else if (curveMethod === "pow") {
      x = Math.pow(1 - percentile, 1 - curveAccent);
      y2 = Math.pow(percentile, 1 - curveAccent);
    } else if (curveMethod === "powY") {
      x = Math.pow(1 - percentile, curveAccent);
      y2 = Math.pow(percentile, 1 - curveAccent);
    } else if (curveMethod === "powX") {
      x = Math.pow(percentile, curveAccent);
      y2 = Math.pow(percentile, 1 - curveAccent);
    } else if (typeof curveMethod === "function") {
      const modifiedPositions = curveMethod(percentile, curveAccent);
      x = modifiedPositions[0];
      y2 = modifiedPositions[1];
    } else if (easingFunctionsKeys.includes(curveMethod)) {
      x = percentile;
      y2 = 1 - easingFunctions[curveMethod](percentile, curveAccent * -1) || 0;
    } else {
      throw new Error(`pointOnCurve() curveAccent parameter is expected to be "lam\xE9" | "arc" | "pow" | "powY" | "powX" or a function but \`${curveMethod}\` given.`);
    }
    x = min[0] + Math.min(Math.max(x, 0), 1) * (max[0] - min[0]);
    y2 = min[1] + Math.min(Math.max(y2, 0), 1) * (max[1] - min[1]);
    return [x, y2];
  };
  function generateRandomColorRamp({
    total = 3,
    centerHue = 0,
    hueCycle = 0.3,
    offsetTint = 0.1,
    offsetShade = 0.1,
    curveAccent = 0,
    tintShadeHueShift = 0.1,
    curveMethod = "arc",
    offsetCurveModTint = 0.03,
    offsetCurveModShade = 0.03,
    minSaturationLight = [0, 0],
    maxSaturationLight = [1, 1],
    colorModel = "hsl"
  } = {}) {
    const baseColors = [];
    const lightColors = [];
    const darkColors = [];
    for (let i2 = 1; i2 < total + 1; i2++) {
      const [x, y2] = pointOnCurve(curveMethod, i2, total + 1, curveAccent, minSaturationLight, maxSaturationLight);
      const h2 = (360 + (-180 * hueCycle + (centerHue + i2 * (360 / (total + 1)) * hueCycle))) % 360;
      const hsl = hsv2hsx(h2, x, y2, colorModel);
      baseColors.push(hsl);
      const [xl, yl] = pointOnCurve(curveMethod, i2, total + 1, curveAccent + offsetCurveModTint, minSaturationLight, maxSaturationLight);
      const hslLight = hsv2hsx(h2, xl, yl, colorModel);
      lightColors.push([
        (h2 + 360 * tintShadeHueShift) % 360,
        hslLight[1] - offsetTint,
        hslLight[2] + offsetTint
      ]);
      const [xd, yd] = pointOnCurve(curveMethod, i2, total + 1, curveAccent - offsetCurveModShade, minSaturationLight, maxSaturationLight);
      const hslDark = hsv2hsx(h2, xd, yd, colorModel);
      darkColors.push([
        (360 + (h2 - 360 * tintShadeHueShift)) % 360,
        hslDark[1] - offsetShade,
        hslDark[2] - offsetShade
      ]);
    }
    return {
      light: lightColors,
      dark: darkColors,
      base: baseColors,
      all: [...lightColors, ...baseColors, ...darkColors]
    };
  }
  var colorModsCSS = {
    oklch: (color) => [color[2], color[1] * 0.4, color[0]],
    lch: (color) => [color[2] * 100, color[1] * 150, color[0]],
    hsl: (color) => [color[0], color[1] * 100 + "%", color[2] * 100 + "%"]
  };
  var colorToCSS = (color, mode = "oklch") => `${mode}(${colorModsCSS[mode](color).join(" ")})`;
  var generateRandomColorRampParams = {
    curveMethod: {
      default: "lam\xE9",
      props: {
        options: ["lam\xE9", "arc", "pow", "powY", "powX", ...easingFunctionsKeys]
      }
    },
    curveAccent: {
      default: 0,
      props: { min: -0.095, max: 1, step: 1e-3 }
    },
    total: {
      default: 9,
      props: { min: 3, max: 35, step: 1 }
    },
    centerHue: {
      default: 0,
      props: { min: 0, max: 360, step: 0.1 }
    },
    hueCycle: {
      default: 0.3,
      props: { min: -1.25, max: 1.5, step: 1e-3 }
    },
    offsetTint: {
      default: 0.01,
      props: { min: 0, max: 0.4, step: 1e-3 }
    },
    offsetShade: {
      default: 0.01,
      props: { min: 0, max: 0.4, step: 1e-3 }
    },
    tintShadeHueShift: {
      default: 0.01,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    offsetCurveModTint: {
      default: 0.03,
      props: { min: 0, max: 0.4, step: 1e-4 }
    },
    offsetCurveModShade: {
      default: 0.03,
      props: { min: 0, max: 0.4, step: 1e-4 }
    },
    minSaturation: {
      default: 0,
      props: { min: -0.25, max: 1, step: 1e-3 }
    },
    minLight: {
      default: 0,
      props: { min: -0.25, max: 1, step: 1e-3 }
    },
    maxSaturation: {
      default: 1,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    maxLight: {
      default: 1,
      props: { min: 0, max: 1, step: 1e-3 }
    }
  };

  // node_modules/rampensau/dist/index.mjs
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var utils_exports = {};
  __export(utils_exports, {
    lerp: () => lerp,
    makeCurveEasings: () => makeCurveEasings,
    pointOnCurve: () => pointOnCurve2,
    scaleSpreadArray: () => scaleSpreadArray,
    shuffleArray: () => shuffleArray
  });
  function shuffleArray(array, rndFn = Math.random) {
    const copy = [...array];
    let currentIndex = copy.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(rndFn() * currentIndex);
      currentIndex--;
      [copy[currentIndex], copy[randomIndex]] = [
        copy[randomIndex],
        copy[currentIndex]
      ];
    }
    return copy;
  }
  var lerp = (amt, from, to) => from + amt * (to - from);
  var scaleSpreadArray = (valuesToFill, targetSize, padding = 0, fillFunction = lerp) => {
    if (!valuesToFill || valuesToFill.length < 2) {
      throw new Error("valuesToFill array must have at least two values.");
    }
    if (targetSize < 1 && padding > 0) {
      throw new Error("Target size must be at least 1");
    }
    if (targetSize < valuesToFill.length && padding === 0) {
      throw new Error(
        "Target size must be greater than or equal to the valuesToFill array length."
      );
    }
    const result = new Array(targetSize);
    if (padding <= 0) {
      const len = valuesToFill.length;
      const lastIdx = len - 1;
      const totalAdded = targetSize - len;
      const baseAdds = Math.floor(totalAdded / lastIdx);
      const remainder = totalAdded % lastIdx;
      let currentResultIdx = 0;
      for (let i2 = 0; i2 < lastIdx; i2++) {
        const startVal = valuesToFill[i2];
        const endVal = valuesToFill[i2 + 1];
        const segmentLen = 1 + baseAdds + (i2 < remainder ? 1 : 0);
        for (let j = 0; j < segmentLen; j++) {
          const t2 = j / segmentLen;
          result[currentResultIdx++] = fillFunction(t2, startVal, endVal);
        }
      }
      result[currentResultIdx] = valuesToFill[lastIdx];
      return result;
    }
    const domainStart = padding;
    const domainEnd = 1 - padding;
    const lenMinus1 = valuesToFill.length - 1;
    const normalizedPositions = new Float64Array(valuesToFill.length);
    for (let i2 = 0; i2 < valuesToFill.length; i2++) {
      normalizedPositions[i2] = i2 / lenMinus1;
    }
    let segmentIndex = 0;
    for (let i2 = 0; i2 < targetSize; i2++) {
      const t2 = targetSize === 1 ? 0.5 : i2 / (targetSize - 1);
      const adjustedT = domainStart + t2 * (domainEnd - domainStart);
      while (segmentIndex < lenMinus1 && adjustedT > normalizedPositions[segmentIndex + 1]) {
        segmentIndex++;
      }
      const segmentStart = normalizedPositions[segmentIndex];
      const segmentEnd = normalizedPositions[segmentIndex + 1];
      let segmentT = 0;
      if (segmentEnd > segmentStart) {
        segmentT = (adjustedT - segmentStart) / (segmentEnd - segmentStart);
      }
      const fromValue = valuesToFill[segmentIndex];
      const toValue = valuesToFill[segmentIndex + 1];
      result[i2] = fillFunction(segmentT, fromValue, toValue);
    }
    return result;
  };
  var pointOnCurve2 = (curveMethod, curveAccent) => {
    return (t2) => {
      const limit = Math.PI / 2;
      const slice = limit;
      const percentile = t2;
      let x = 0, y2 = 0;
      if (curveMethod === "lam\xE9") {
        const t22 = percentile * limit;
        const exp = 2 / (2 + 20 * curveAccent);
        const cosT = Math.cos(t22);
        const sinT = Math.sin(t22);
        x = Math.sign(cosT) * Math.abs(cosT) ** exp;
        y2 = Math.sign(sinT) * Math.abs(sinT) ** exp;
      } else if (curveMethod === "arc") {
        y2 = Math.cos(-Math.PI / 2 + t2 * slice + curveAccent);
        x = Math.sin(Math.PI / 2 + t2 * slice - curveAccent);
      } else if (curveMethod === "pow") {
        x = Math.pow(1 - percentile, 1 - curveAccent);
        y2 = Math.pow(percentile, 1 - curveAccent);
      } else if (curveMethod === "powY") {
        x = Math.pow(1 - percentile, curveAccent);
        y2 = Math.pow(percentile, 1 - curveAccent);
      } else if (curveMethod === "powX") {
        x = Math.pow(percentile, curveAccent);
        y2 = Math.pow(percentile, 1 - curveAccent);
      } else if (typeof curveMethod === "function") {
        const [xFunc, yFunc] = curveMethod(t2, curveAccent);
        x = xFunc;
        y2 = yFunc;
      } else {
        throw new Error(
          `pointOnCurve() curveMethod parameter is expected to be "lam\xE9" | "arc" | "pow" | "powY" | "powX" or a function but \`${curveMethod}\` given.`
        );
      }
      return { x, y: y2 };
    };
  };
  var makeCurveEasings = (curveMethod, curveAccent) => {
    const point = pointOnCurve2(curveMethod, curveAccent);
    return {
      sEasing: (t2) => point(t2).x,
      lEasing: (t2) => point(t2).y
    };
  };
  var colorUtils_exports = {};
  __export(colorUtils_exports, {
    colorHarmonies: () => colorHarmonies,
    colorToCSS: () => colorToCSS2,
    harveyHue: () => harveyHue,
    hsv2hsl: () => hsv2hsl2,
    normalizeHue: () => normalizeHue,
    uniqueRandomHues: () => uniqueRandomHues
  });
  function normalizeHue(h2) {
    return (h2 % 360 + 360) % 360;
  }
  function harveyHue(h2) {
    h2 = normalizeHue(h2) / 360;
    if (h2 === 0) return h2;
    h2 = 1 + h2 % 1;
    const seg = 1 / 6;
    const a2 = h2 % seg / seg * Math.PI / 2;
    const [b2, c2] = [seg * Math.cos(a2), seg * Math.sin(a2)];
    const i2 = Math.floor(h2 * 6);
    const cases = [c2, 1 / 3 - b2, 1 / 3 + c2, 2 / 3 - b2, 2 / 3 + c2, 1 - b2];
    return cases[i2 % 6] * 360;
  }
  var colorHarmonies = {
    complementary: (h2) => [normalizeHue(h2), normalizeHue(h2 + 180)],
    splitComplementary: (h2) => [
      normalizeHue(h2),
      normalizeHue(h2 + 150),
      normalizeHue(h2 - 150)
    ],
    triadic: (h2) => [
      normalizeHue(h2),
      normalizeHue(h2 + 120),
      normalizeHue(h2 + 240)
    ],
    tetradic: (h2) => [
      normalizeHue(h2),
      normalizeHue(h2 + 90),
      normalizeHue(h2 + 180),
      normalizeHue(h2 + 270)
    ],
    pentadic: (h2) => [
      normalizeHue(h2),
      normalizeHue(h2 + 72),
      normalizeHue(h2 + 144),
      normalizeHue(h2 + 216),
      normalizeHue(h2 + 288)
    ],
    hexadic: (h2) => [
      normalizeHue(h2),
      normalizeHue(h2 + 60),
      normalizeHue(h2 + 120),
      normalizeHue(h2 + 180),
      normalizeHue(h2 + 240),
      normalizeHue(h2 + 300)
    ],
    monochromatic: (h2) => [normalizeHue(h2), normalizeHue(h2)],
    // min 2 for RampenSau
    doubleComplementary: (h2) => [
      normalizeHue(h2),
      normalizeHue(h2 + 180),
      normalizeHue(h2 + 30),
      normalizeHue(h2 + 210)
    ],
    compound: (h2) => [
      normalizeHue(h2),
      normalizeHue(h2 + 180),
      normalizeHue(h2 + 60),
      normalizeHue(h2 + 240)
    ],
    analogous: (h2) => [
      normalizeHue(h2),
      normalizeHue(h2 + 30),
      normalizeHue(h2 + 60),
      normalizeHue(h2 + 90),
      normalizeHue(h2 + 120),
      normalizeHue(h2 + 150)
    ]
  };
  function uniqueRandomHues({
    startHue,
    total = 9,
    minHueDiffAngle = 60,
    rndFn = Math.random
  } = {}) {
    minHueDiffAngle = Math.min(minHueDiffAngle, 360 / total);
    const baseHue = startHue != null ? startHue : rndFn() * 360;
    const huesToPickFrom = Array.from(
      {
        length: Math.round(360 / minHueDiffAngle)
      },
      (_2, i2) => (baseHue + i2 * minHueDiffAngle) % 360
    );
    let randomizedHues = shuffleArray(huesToPickFrom, rndFn);
    if (randomizedHues.length > total) {
      randomizedHues = randomizedHues.slice(0, total);
    }
    return randomizedHues;
  }
  var hsv2hsl2 = ([h2, s2, v]) => {
    const l2 = v - v * s2 / 2;
    const m3 = Math.min(l2, 1 - l2);
    const s_hsl = m3 === 0 ? 0 : (v - l2) / m3;
    return [h2, s_hsl, l2];
  };
  var colorModsCSS2 = {
    oklch: (color) => [
      color[2] * 100 + "%",
      color[1] * 100 + "%",
      color[0]
    ],
    lch: (color) => [
      color[2] * 100 + "%",
      color[1] * 100 + "%",
      color[0]
    ],
    hsl: (color) => [
      color[0],
      color[1] * 100 + "%",
      color[2] * 100 + "%"
    ],
    hsv: (color) => {
      const [h2, s2, l2] = hsv2hsl2(color);
      return [h2, s2 * 100 + "%", l2 * 100 + "%"];
    }
  };
  var colorToCSS2 = (color, mode = "oklch") => {
    const cssMode = mode === "hsv" ? "hsl" : mode;
    return `${cssMode}(${colorModsCSS2[mode](color).join(" ")})`;
  };
  function generateColorRamp({
    total = 9,
    hStart = Math.random() * 360,
    hStartCenter = 0.5,
    hEasing = (x) => x,
    hCycles = 1,
    sRange = [0.4, 0.35],
    sEasing = (x) => Math.pow(x, 2),
    lRange = [Math.random() * 0.1, 0.9],
    lEasing = (x) => Math.pow(x, 1.5),
    transformFn = ([h2, s2, l2]) => [h2, s2, l2],
    hueList
  } = {}) {
    const lDiff = lRange[1] - lRange[0];
    const sDiff = sRange[1] - sRange[0];
    const length = hueList && hueList.length > 0 ? hueList.length : total;
    return Array.from({ length }, (_2, i2) => {
      const relI = length > 1 ? i2 / (length - 1) : 0;
      const fraction = 1 / length;
      const hue = hueList ? hueList[i2] : normalizeHue(
        hStart + // Add the starting hue
        (1 - hEasing(relI, fraction) - hStartCenter) * (360 * hCycles)
        // Calculate the hue based on the easing function
      );
      const saturation = sRange[0] + sDiff * sEasing(relI, fraction);
      const lightness = lRange[0] + lDiff * lEasing(relI, fraction);
      return transformFn([hue, saturation, lightness], i2);
    });
  }
  var generateColorRampParams = {
    total: {
      default: 5,
      props: { min: 4, max: 50, step: 1 }
    },
    hStart: {
      default: 0,
      props: { min: 0, max: 360, step: 0.1 }
    },
    hCycles: {
      default: 1,
      props: { min: -2, max: 2, step: 1e-3 }
    },
    hStartCenter: {
      default: 0.5,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    minLight: {
      default: Math.random() * 0.2,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    maxLight: {
      default: 0.89 + Math.random() * 0.11,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    minSaturation: {
      default: Math.random() < 0.5 ? 0.4 : 0.8 + Math.random() * 0.2,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    maxSaturation: {
      default: Math.random() < 0.5 ? 0.35 : 0.9 + Math.random() * 0.1,
      props: { min: 0, max: 1, step: 1e-3 }
    },
    curveMethod: {
      default: "lam\xE9",
      props: { options: ["lam\xE9", "arc", "pow", "powY", "powX"] }
    },
    curveAccent: {
      default: 0.5,
      props: { min: 0, max: 5, step: 0.01 }
    }
  };

  // node_modules/poline/dist/index.mjs
  var pointToHSL = (xyz, invertedLightness) => {
    const [x, y2, z] = xyz;
    const cx = 0.5;
    const cy = 0.5;
    const radians = Math.atan2(y2 - cy, x - cx);
    let deg = radians * (180 / Math.PI);
    deg = (360 + deg) % 360;
    const s2 = z;
    const dist = Math.sqrt(Math.pow(y2 - cy, 2) + Math.pow(x - cx, 2));
    const l2 = dist / cx;
    return [deg, s2, invertedLightness ? 1 - l2 : l2];
  };
  var hslToPoint = (hsl, invertedLightness) => {
    const [h2, s2, l2] = hsl;
    const cx = 0.5;
    const cy = 0.5;
    const radians = h2 / (180 / Math.PI);
    const dist = (invertedLightness ? 1 - l2 : l2) * cx;
    const x = cx + dist * Math.cos(radians);
    const y2 = cy + dist * Math.sin(radians);
    const z = s2;
    return [x, y2, z];
  };
  var randomHSLPair = (startHue = Math.random() * 360, saturations = [Math.random(), Math.random()], lightnesses = [0.75 + Math.random() * 0.2, 0.3 + Math.random() * 0.2]) => [
    [startHue, saturations[0], lightnesses[0]],
    [(startHue + 60 + Math.random() * 180) % 360, saturations[1], lightnesses[1]]
  ];
  var clampToCircle = (x, y2) => {
    const cx = 0.5;
    const cy = 0.5;
    const dx = x - cx;
    const dy = y2 - cy;
    const dist = Math.hypot(dx, dy);
    if (dist <= 0.5) {
      return [x, y2];
    }
    return [cx + dx / dist * 0.5, cy + dy / dist * 0.5];
  };
  var vectorOnLine = (t2, p1, p22, invert = false, fx = (t22, invert2) => invert2 ? 1 - t22 : t22, fy = (t22, invert2) => invert2 ? 1 - t22 : t22, fz = (t22, invert2) => invert2 ? 1 - t22 : t22) => {
    const tModifiedX = fx(t2, invert);
    const tModifiedY = fy(t2, invert);
    const tModifiedZ = fz(t2, invert);
    const x = (1 - tModifiedX) * p1[0] + tModifiedX * p22[0];
    const y2 = (1 - tModifiedY) * p1[1] + tModifiedY * p22[1];
    const z = (1 - tModifiedZ) * p1[2] + tModifiedZ * p22[2];
    return [x, y2, z];
  };
  var vectorsOnLine = (p1, p22, numPoints = 4, invert = false, fx = (t2, invert2) => invert2 ? 1 - t2 : t2, fy = (t2, invert2) => invert2 ? 1 - t2 : t2, fz = (t2, invert2) => invert2 ? 1 - t2 : t2) => {
    const points = [];
    for (let i2 = 0; i2 < numPoints; i2++) {
      const [x, y2, z] = vectorOnLine(
        i2 / (numPoints - 1),
        p1,
        p22,
        invert,
        fx,
        fy,
        fz
      );
      points.push([x, y2, z]);
    }
    return points;
  };
  var sinusoidalPosition = (t2, reverse = false) => {
    if (reverse) {
      return 1 - Math.sin((1 - t2) * Math.PI / 2);
    }
    return Math.sin(t2 * Math.PI / 2);
  };
  var distance = (p1, p22, hueMode = false) => {
    const a1 = p1[0];
    const a2 = p22[0];
    let diffA = 0;
    if (hueMode && a1 !== null && a2 !== null) {
      diffA = Math.min(Math.abs(a1 - a2), 360 - Math.abs(a1 - a2));
      diffA = diffA / 360;
    } else {
      diffA = a1 === null || a2 === null ? 0 : a1 - a2;
    }
    const a3 = diffA;
    const b2 = p1[1] === null || p22[1] === null ? 0 : p22[1] - p1[1];
    const c2 = p1[2] === null || p22[2] === null ? 0 : p22[2] - p1[2];
    return Math.sqrt(a3 * a3 + b2 * b2 + c2 * c2);
  };
  var ColorPoint = class {
    constructor({
      xyz,
      color,
      invertedLightness = false
    } = {}) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.color = [0, 0, 0];
      this._invertedLightness = false;
      this._invertedLightness = invertedLightness;
      this.positionOrColor({ xyz, color, invertedLightness });
    }
    positionOrColor({
      xyz,
      color,
      invertedLightness = false
    }) {
      this._invertedLightness = invertedLightness;
      if (xyz && color || !xyz && !color) {
        throw new Error("Point must be initialized with either x,y,z or hsl");
      } else if (xyz) {
        this.x = xyz[0];
        this.y = xyz[1];
        this.z = xyz[2];
        this.color = pointToHSL([this.x, this.y, this.z], invertedLightness);
      } else if (color) {
        this.color = color;
        [this.x, this.y, this.z] = hslToPoint(color, invertedLightness);
      }
    }
    set position([x, y2, z]) {
      this.x = x;
      this.y = y2;
      this.z = z;
      this.color = pointToHSL(
        [this.x, this.y, this.z],
        this._invertedLightness
      );
    }
    get position() {
      return [this.x, this.y, this.z];
    }
    set hsl([h2, s2, l2]) {
      this.color = [h2, s2, l2];
      [this.x, this.y, this.z] = hslToPoint(
        this.color,
        this._invertedLightness
      );
    }
    get hsl() {
      return this.color;
    }
    get hslCSS() {
      const [h2, s2, l2] = this.color;
      return `hsl(${h2.toFixed(2)}, ${(s2 * 100).toFixed(2)}%, ${(l2 * 100).toFixed(
        2
      )}%)`;
    }
    /** Approximate OKLCH CSS string (linearly rescaled from HSL, not a true colorimetric conversion) */
    get oklchCSS() {
      const [h2, s2, l2] = this.color;
      return `oklch(${(l2 * 100).toFixed(2)}% ${(s2 * 0.4).toFixed(3)} ${h2.toFixed(
        2
      )})`;
    }
    /** Approximate LCH CSS string (linearly rescaled from HSL, not a true colorimetric conversion) */
    get lchCSS() {
      const [h2, s2, l2] = this.color;
      return `lch(${(l2 * 100).toFixed(2)}% ${(s2 * 150).toFixed(2)} ${h2.toFixed(
        2
      )})`;
    }
    set invertedLightness(val) {
      this._invertedLightness = val;
      this.color = pointToHSL(
        [this.x, this.y, this.z],
        this._invertedLightness
      );
    }
    get invertedLightness() {
      return this._invertedLightness;
    }
    shiftHue(angle) {
      this.color[0] = (360 + (this.color[0] + angle)) % 360;
      [this.x, this.y, this.z] = hslToPoint(
        this.color,
        this._invertedLightness
      );
    }
  };
  var Poline = class {
    constructor({
      anchorColors = randomHSLPair(),
      numPoints = 4,
      positionFunction = sinusoidalPosition,
      positionFunctionX,
      positionFunctionY,
      positionFunctionZ,
      closedLoop,
      invertedLightness,
      clampToCircle: clampToCircle2
    } = {}) {
      this._positionFunctionX = sinusoidalPosition;
      this._positionFunctionY = sinusoidalPosition;
      this._positionFunctionZ = sinusoidalPosition;
      this.connectLastAndFirstAnchor = false;
      this._invertedLightness = false;
      this._clampToCircle = false;
      if (!anchorColors || anchorColors.length < 2) {
        throw new Error("Must have at least two anchor colors");
      }
      this._anchorPoints = anchorColors.map(
        (point) => new ColorPoint({ color: point, invertedLightness })
      );
      this._numPoints = numPoints + 2;
      this._positionFunctionX = positionFunctionX || positionFunction || sinusoidalPosition;
      this._positionFunctionY = positionFunctionY || positionFunction || sinusoidalPosition;
      this._positionFunctionZ = positionFunctionZ || positionFunction || sinusoidalPosition;
      this.connectLastAndFirstAnchor = closedLoop || false;
      this._invertedLightness = invertedLightness || false;
      this._clampToCircle = clampToCircle2 || false;
      this.updateAnchorPairs();
    }
    get numPoints() {
      return this._numPoints - 2;
    }
    set numPoints(numPoints) {
      if (numPoints < 1) {
        throw new Error("Must have at least one point");
      }
      this._numPoints = numPoints + 2;
      this.updateAnchorPairs();
    }
    set positionFunction(positionFunction) {
      if (Array.isArray(positionFunction)) {
        if (positionFunction.length !== 3) {
          throw new Error("Position function array must have 3 elements");
        }
        if (typeof positionFunction[0] !== "function" || typeof positionFunction[1] !== "function" || typeof positionFunction[2] !== "function") {
          throw new Error("Position function array must have 3 functions");
        }
        this._positionFunctionX = positionFunction[0];
        this._positionFunctionY = positionFunction[1];
        this._positionFunctionZ = positionFunction[2];
      } else {
        this._positionFunctionX = positionFunction;
        this._positionFunctionY = positionFunction;
        this._positionFunctionZ = positionFunction;
      }
      this.updateAnchorPairs();
    }
    get positionFunction() {
      if (this._positionFunctionX === this._positionFunctionY && this._positionFunctionX === this._positionFunctionZ) {
        return this._positionFunctionX;
      }
      return [
        this._positionFunctionX,
        this._positionFunctionY,
        this._positionFunctionZ
      ];
    }
    set positionFunctionX(positionFunctionX) {
      this._positionFunctionX = positionFunctionX;
      this.updateAnchorPairs();
    }
    get positionFunctionX() {
      return this._positionFunctionX;
    }
    set positionFunctionY(positionFunctionY) {
      this._positionFunctionY = positionFunctionY;
      this.updateAnchorPairs();
    }
    get positionFunctionY() {
      return this._positionFunctionY;
    }
    set positionFunctionZ(positionFunctionZ) {
      this._positionFunctionZ = positionFunctionZ;
      this.updateAnchorPairs();
    }
    get positionFunctionZ() {
      return this._positionFunctionZ;
    }
    get clampToCircle() {
      return this._clampToCircle;
    }
    set clampToCircle(clamp3) {
      this._clampToCircle = clamp3;
    }
    get anchorPoints() {
      return this._anchorPoints;
    }
    set anchorPoints(anchorPoints) {
      this._anchorPoints = anchorPoints;
      this.updateAnchorPairs();
    }
    updateAnchorPairs() {
      this._anchorPairs = [];
      const anchorPointsLength = this.connectLastAndFirstAnchor ? this.anchorPoints.length : this.anchorPoints.length - 1;
      for (let i2 = 0; i2 < anchorPointsLength; i2++) {
        const pair = [
          this.anchorPoints[i2],
          this.anchorPoints[(i2 + 1) % this.anchorPoints.length]
        ];
        this._anchorPairs.push(pair);
      }
      this.points = this._anchorPairs.map((pair, i2) => {
        const p1position = pair[0] ? pair[0].position : [0, 0, 0];
        const p2position = pair[1] ? pair[1].position : [0, 0, 0];
        const shouldInvertEase = this.shouldInvertEaseForSegment(i2);
        return vectorsOnLine(
          p1position,
          p2position,
          this._numPoints,
          shouldInvertEase,
          this.positionFunctionX,
          this.positionFunctionY,
          this.positionFunctionZ
        ).map(
          (p3) => new ColorPoint({ xyz: p3, invertedLightness: this._invertedLightness })
        );
      });
    }
    addAnchorPoint({
      xyz,
      color,
      insertAtIndex,
      clamp: clamp3
    }) {
      let finalXyz = xyz;
      const shouldClamp = clamp3 ?? this._clampToCircle;
      if (shouldClamp && xyz) {
        const [x, y2, z] = xyz;
        const [cx, cy] = clampToCircle(x, y2);
        finalXyz = [cx, cy, z];
      }
      const newAnchor = new ColorPoint({
        xyz: finalXyz,
        color,
        invertedLightness: this._invertedLightness
      });
      if (insertAtIndex !== void 0) {
        this.anchorPoints.splice(insertAtIndex, 0, newAnchor);
      } else {
        this.anchorPoints.push(newAnchor);
      }
      this.updateAnchorPairs();
      return newAnchor;
    }
    removeAnchorPoint({
      point,
      index
    }) {
      if (!point && index === void 0) {
        throw new Error("Must provide a point or index");
      }
      if (this.anchorPoints.length < 3) {
        throw new Error("Must have at least two anchor points");
      }
      const apid = index !== void 0 ? index : this.anchorPoints.indexOf(point);
      if (apid >= 0 && apid < this.anchorPoints.length) {
        this.anchorPoints.splice(apid, 1);
        this.updateAnchorPairs();
      } else {
        throw new Error("Point not found");
      }
    }
    updateAnchorPoint({
      point,
      pointIndex,
      xyz,
      color,
      clamp: clamp3
    }) {
      if (pointIndex !== void 0) {
        point = this.anchorPoints[pointIndex];
      }
      if (!point) {
        throw new Error("Must provide a point or pointIndex");
      }
      if (!xyz && !color) {
        throw new Error("Must provide a new xyz position or color");
      }
      if (xyz) {
        const shouldClamp = clamp3 ?? this._clampToCircle;
        if (shouldClamp) {
          const [x, y2, z] = xyz;
          const [cx, cy] = clampToCircle(x, y2);
          point.position = [cx, cy, z];
        } else {
          point.position = xyz;
        }
      }
      if (color)
        point.hsl = color;
      this.updateAnchorPairs();
      return point;
    }
    getClosestAnchorPoint({
      xyz,
      hsl,
      maxDistance = 1
    }) {
      if (!xyz && !hsl) {
        throw new Error("Must provide a xyz or hsl");
      }
      let distances;
      if (xyz) {
        distances = this.anchorPoints.map(
          (anchor) => distance(anchor.position, xyz)
        );
      } else if (hsl) {
        distances = this.anchorPoints.map(
          (anchor) => distance(anchor.hsl, hsl, true)
        );
      }
      const minDistance = Math.min(...distances);
      if (minDistance > maxDistance) {
        return null;
      }
      const closestAnchorIndex = distances.indexOf(minDistance);
      return this.anchorPoints[closestAnchorIndex] || null;
    }
    set closedLoop(newStatus) {
      this.connectLastAndFirstAnchor = newStatus;
      this.updateAnchorPairs();
    }
    get closedLoop() {
      return this.connectLastAndFirstAnchor;
    }
    set invertedLightness(newStatus) {
      this._invertedLightness = newStatus;
      this.anchorPoints.forEach((p3) => p3.invertedLightness = newStatus);
      this.updateAnchorPairs();
    }
    get invertedLightness() {
      return this._invertedLightness;
    }
    /**
     * Returns a flattened array of all points across all segments,
     * removing duplicated anchor points at segment boundaries.
     *
     * Since anchor points exist at both the end of one segment and
     * the beginning of the next, this method keeps only one instance of each.
     * The filter logic keeps the first point (index 0) and then filters out
     * points whose indices are multiples of the segment size (_numPoints),
     * which are the anchor points at the start of each segment (except the first).
     *
     * This approach ensures we get all unique points in the correct order
     * while avoiding duplicated anchor points.
     *
     * @returns {ColorPoint[]} A flat array of unique ColorPoint instances
     */
    get flattenedPoints() {
      return this.points.flat().filter((p3, i2) => i2 != 0 ? i2 % this._numPoints : true);
    }
    get colors() {
      const colors = this.flattenedPoints.map((p3) => p3.color);
      if (this.connectLastAndFirstAnchor && this._anchorPoints.length !== 2) {
        colors.pop();
      }
      return colors;
    }
    cssColors(mode = "hsl") {
      const methods = {
        hsl: (p3) => p3.hslCSS,
        oklch: (p3) => p3.oklchCSS,
        lch: (p3) => p3.lchCSS
      };
      const cssColors = this.flattenedPoints.map(methods[mode]);
      if (this.connectLastAndFirstAnchor) {
        cssColors.pop();
      }
      return cssColors;
    }
    get colorsCSS() {
      return this.cssColors("hsl");
    }
    get colorsCSSlch() {
      return this.cssColors("lch");
    }
    get colorsCSSoklch() {
      return this.cssColors("oklch");
    }
    shiftHue(hShift = 20) {
      this.anchorPoints.forEach((p3) => p3.shiftHue(hShift));
      this.updateAnchorPairs();
    }
    /**
     * Returns a color at a specific position along the entire color line (0-1)
     * Treats all segments as one continuous path, respecting easing functions
     * @param t Position along the line (0-1), where 0 is start and 1 is end
     * @returns ColorPoint at the specified position
     * @example
     * getColorAt(0) // Returns color at the very beginning
     * getColorAt(0.5) // Returns color at the middle of the entire journey
     * getColorAt(1) // Returns color at the very end
     */
    getColorAt(t2) {
      if (t2 < 0 || t2 > 1) {
        throw new Error("Position must be between 0 and 1");
      }
      if (this.anchorPoints.length === 0) {
        throw new Error("No anchor points available");
      }
      const totalSegments = this.connectLastAndFirstAnchor ? this.anchorPoints.length : this.anchorPoints.length - 1;
      const effectiveSegments = this.connectLastAndFirstAnchor && this.anchorPoints.length === 2 ? 2 : totalSegments;
      const segmentPosition = t2 * effectiveSegments;
      const segmentIndex = Math.floor(segmentPosition);
      const localT = segmentPosition - segmentIndex;
      const actualSegmentIndex = segmentIndex >= effectiveSegments ? effectiveSegments - 1 : segmentIndex;
      const actualLocalT = segmentIndex >= effectiveSegments ? 1 : localT;
      const pair = this._anchorPairs[actualSegmentIndex];
      if (!pair || pair.length < 2 || !pair[0] || !pair[1]) {
        return new ColorPoint({
          color: this.anchorPoints[0]?.color || [0, 0, 0],
          invertedLightness: this._invertedLightness
        });
      }
      const p1position = pair[0].position;
      const p2position = pair[1].position;
      const shouldInvertEase = this.shouldInvertEaseForSegment(actualSegmentIndex);
      const xyz = vectorOnLine(
        actualLocalT,
        p1position,
        p2position,
        shouldInvertEase,
        this._positionFunctionX,
        this._positionFunctionY,
        this._positionFunctionZ
      );
      return new ColorPoint({
        xyz,
        invertedLightness: this._invertedLightness
      });
    }
    /**
     * Determines whether easing should be inverted for a given segment
     * @param segmentIndex The index of the segment
     * @returns Whether easing should be inverted
     */
    shouldInvertEaseForSegment(segmentIndex) {
      return !!(segmentIndex % 2 || this.connectLastAndFirstAnchor && this.anchorPoints.length === 2 && segmentIndex === 0);
    }
  };
  var { p5 } = globalThis;
  if (p5 && p5.VERSION && p5.VERSION.startsWith("1.")) {
    console.info("p5 < 1.x detected, adding poline to p5 prototype");
    const poline = new Poline();
    p5.prototype.poline = poline;
    const polineColors2 = () => poline.colors.map(
      (c2) => `hsl(${Math.round(c2[0])},${c2[1] * 100}%,${c2[2] * 100}%)`
    );
    p5.prototype.registerMethod("polineColors", polineColors2);
    globalThis.poline = poline;
    globalThis.polineColors = polineColors2;
  }

  // node_modules/rybitten/dist/cubes.mjs
  var r = [
    // white
    [0.9921568627450981, 0.9647058823529412, 0.9294117647058824],
    // red
    [0.8901960784313725, 0.1411764705882353, 0.12941176470588237],
    // yellow
    [0.9529411764705882, 0.9019607843137255, 0],
    // orange
    [0.9411764705882353, 0.5568627450980392, 0.10980392156862745],
    // blue
    [0.08627450980392157, 0.6, 0.8549019607843137],
    // pink / but often violet in old color wheels
    [0.47058823529411764, 0.13333333333333333, 0.6666666666666666],
    // green
    [0, 0.5568627450980392, 0.3568627450980392],
    // black
    [0.11372549019607843, 0.10980392156862745, 0.10980392156862745]
  ];
  var t = [
    [253 / 255, 246 / 255, 237 / 255],
    [247 / 255, 45 / 255, 41 / 255],
    [253 / 255, 203 / 255, 0 / 255],
    [250 / 255, 102 / 255, 13 / 255],
    [17 / 255, 97 / 255, 170 / 255],
    [101 / 255, 57 / 255, 138 / 255],
    [70 / 255, 139 / 255, 73 / 255],
    [29 / 255, 28 / 255, 28 / 255]
  ];
  var a = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0.5, 0],
    [0.163, 0.373, 0.6],
    [0.5, 0, 0.5],
    [0, 0.66, 0.2],
    [0.2, 0.094, 0]
  ];
  var o = [
    [245 / 255, 238 / 255, 226 / 255],
    [170 / 255, 14 / 255, 1 / 255],
    [224 / 255, 178 / 255, 0 / 255],
    [217 / 255, 104 / 255, 5 / 255],
    [18 / 255, 107 / 255, 145 / 255],
    [103 / 255, 15 / 255, 128 / 255],
    [88 / 255, 133 / 255, 30 / 255],
    [44 / 255, 37 / 255, 30 / 255]
  ];
  var n = [
    [254 / 255, 250 / 255, 226 / 255],
    [237 / 255, 55 / 255, 58 / 255],
    [255 / 255, 233 / 255, 111 / 255],
    [250 / 255, 102 / 255, 13 / 255],
    [33 / 255, 112 / 255, 163 / 255],
    [238 / 255, 131 / 255, 154 / 255],
    [59 / 255, 155 / 255, 83 / 255],
    [24 / 255, 10 / 255, 1 / 255]
  ];
  var c = [
    [255 / 255, 255 / 255, 255 / 255],
    [218 / 255, 105 / 255, 104 / 255],
    [255 / 255, 244 / 255, 122 / 255],
    [232 / 255, 154 / 255, 113 / 255],
    [73 / 255, 138 / 255, 186 / 255],
    [97 / 255, 96 / 255, 178 / 255],
    [144 / 255, 191 / 255, 140 / 255],
    [8 / 255, 8 / 255, 8 / 255]
  ];
  var s = [
    [240 / 255, 234 / 255, 214 / 255],
    [204 / 255, 50 / 255, 53 / 255],
    [253 / 255, 222 / 255, 20 / 255],
    [230 / 255, 152 / 255, 92 / 255],
    [1 / 255, 88 / 255, 140 / 255],
    [107 / 255, 51 / 255, 111 / 255],
    [51 / 255, 138 / 255, 92 / 255],
    [55 / 255, 39 / 255, 23 / 255]
  ];
  var l = [
    [249 / 255, 232 / 255, 209 / 255],
    [216 / 255, 43 / 255, 59 / 255],
    [231 / 255, 175 / 255, 2 / 255],
    [224 / 255, 89 / 255, 31 / 255],
    [92 / 255, 123 / 255, 145 / 255],
    [77 / 255, 58 / 255, 78 / 255],
    [107 / 255, 129 / 255, 53 / 255],
    [14 / 255, 8 / 255, 7 / 255]
  ];
  var u = [
    // white
    [241 / 255, 236 / 255, 213 / 255],
    // red
    [235 / 255, 66 / 255, 35 / 255],
    // yellow
    [253 / 255, 236 / 255, 1 / 255],
    // orange
    [254 / 255, 130 / 255, 39 / 255],
    // blue
    [3 / 255, 7 / 255, 171 / 255],
    // pink / but often violet in old color wheels
    [74 / 255, 50 / 255, 86 / 255],
    // green
    [55 / 255, 131 / 255, 74 / 255],
    // black
    [2 / 255, 1 / 255, 0 / 255]
  ];
  var i = [
    [238 / 255, 232 / 255, 206 / 255],
    [222 / 255, 62 / 255, 29 / 255],
    [247 / 255, 225 / 255, 7 / 255],
    [254 / 255, 130 / 255, 39 / 255],
    [4 / 255, 6 / 255, 139 / 255],
    [74 / 255, 50 / 255, 86 / 255],
    [56 / 255, 131 / 255, 75 / 255],
    [2 / 255, 1 / 255, 0 / 255]
  ];
  var h = [
    [239 / 255, 235 / 255, 225 / 255],
    [182 / 255, 53 / 255, 55 / 255],
    [253 / 255, 203 / 255, 0 / 255],
    [222 / 255, 69 / 255, 20 / 255],
    [95 / 255, 157 / 255, 191 / 255],
    [83 / 255, 70 / 255, 98 / 255],
    [58 / 255, 90 / 255, 66 / 255],
    [8 / 255, 9 / 255, 13 / 255]
  ];
  var p = [
    [228 / 255, 218 / 255, 197 / 255],
    [181 / 255, 65 / 255, 60 / 255],
    [229 / 255, 193 / 255, 81 / 255],
    [220 / 255, 137 / 255, 61 / 255],
    [59 / 255, 143 / 255, 171 / 255],
    [121 / 255, 97 / 255, 134 / 255],
    [13 / 255, 170 / 255, 114 / 255],
    [46 / 255, 44 / 255, 38 / 255]
  ];
  var _ = [
    [206 / 255, 205 / 255, 209 / 255],
    [181 / 255, 38 / 255, 54 / 255],
    [221 / 255, 187 / 255, 23 / 255],
    [208 / 255, 120 / 255, 37 / 255],
    [10 / 255, 71 / 255, 129 / 255],
    [101 / 255, 36 / 255, 66 / 255],
    [75 / 255, 129 / 255, 131 / 255],
    [26 / 255, 30 / 255, 47 / 255]
  ];
  var b = [
    [237 / 255, 213 / 255, 177 / 255],
    [167 / 255, 33 / 255, 28 / 255],
    [245 / 255, 181 / 255, 18 / 255],
    [204 / 255, 93 / 255, 46 / 255],
    [71 / 255, 122 / 255, 141 / 255],
    [99 / 255, 79 / 255, 93 / 255],
    [109 / 255, 143 / 255, 118 / 255],
    [44 / 255, 44 / 255, 37 / 255]
  ];
  var y = [
    [240 / 255, 236 / 255, 235 / 255],
    [247 / 255, 65 / 255, 51 / 255],
    [243 / 255, 187 / 255, 6 / 255],
    [251 / 255, 130 / 255, 2 / 255],
    [37 / 255, 71 / 255, 169 / 255],
    [176 / 255, 121 / 255, 177 / 255],
    [2 / 255, 117 / 255, 111 / 255],
    [41 / 255, 42 / 255, 45 / 255]
  ];
  var R = [
    [231 / 255, 235 / 255, 237 / 255],
    [229 / 255, 30 / 255, 38 / 255],
    [255 / 255, 198 / 255, 12 / 255],
    [245 / 255, 119 / 255, 34 / 255],
    [17 / 255, 97 / 255, 170 / 255],
    [139 / 255, 47 / 255, 146 / 255],
    [1 / 255, 167 / 255, 98 / 255],
    [0 / 255, 0 / 255, 1 / 255]
  ];
  var f = [
    [236 / 255, 237 / 255, 241 / 255],
    [200 / 255, 75 / 255, 49 / 255],
    [235 / 255, 207 / 255, 13 / 255],
    [228 / 255, 168 / 255, 21 / 255],
    [39 / 255, 108 / 255, 176 / 255],
    [188 / 255, 57 / 255, 104 / 255],
    [122 / 255, 176 / 255, 62 / 255],
    [4 / 255, 4 / 255, 4 / 255]
  ];
  var C = [
    [241 / 255, 236 / 255, 230 / 255],
    [185 / 255, 34 / 255, 17 / 255],
    [231 / 255, 200 / 255, 52 / 255],
    [232 / 255, 90 / 255, 26 / 255],
    [26 / 255, 70 / 255, 79 / 255],
    [82 / 255, 15 / 255, 47 / 255],
    [67 / 255, 111 / 255, 33 / 255],
    [29 / 255, 28 / 255, 28 / 255]
  ];
  var g = [
    [215 / 255, 208 / 255, 180 / 255],
    [202 / 255, 0 / 255, 17 / 255],
    [220 / 255, 170 / 255, 0 / 255],
    [229 / 255, 76 / 255, 32 / 255],
    [0 / 255, 126 / 255, 157 / 255],
    [137 / 255, 37 / 255, 79 / 255],
    [0 / 255, 110 / 255, 60 / 255],
    [31 / 255, 27 / 255, 28 / 255]
  ];
  var B = [
    [236 / 255, 231 / 255, 213 / 255],
    [188 / 255, 32 / 255, 43 / 255],
    [233 / 255, 201 / 255, 0 / 255],
    [197 / 255, 72 / 255, 30 / 255],
    [50 / 255, 42 / 255, 115 / 255],
    [116 / 255, 48 / 255, 101 / 255],
    [69 / 255, 118 / 255, 61 / 255],
    [56 / 255, 44 / 255, 42 / 255]
  ];
  var m = [
    [209 / 255, 194 / 255, 173 / 255],
    [159 / 255, 36 / 255, 31 / 255],
    [231 / 255, 191 / 255, 6 / 255],
    [231 / 255, 155 / 255, 7 / 255],
    [75 / 255, 90 / 255, 200 / 255],
    [121 / 255, 100 / 255, 188 / 255],
    [115 / 255, 179 / 255, 63 / 255],
    [52 / 255, 49 / 255, 40 / 255]
  ];
  var T = [
    [250 / 255, 248 / 255, 244 / 255],
    [255 / 255, 41 / 255, 37 / 255],
    [251 / 255, 223 / 255, 47 / 255],
    [253 / 255, 151 / 255, 35 / 255],
    [31 / 255, 106 / 255, 184 / 255],
    [159 / 255, 68 / 255, 150 / 255],
    [80 / 255, 180 / 255, 122 / 255],
    [36 / 255, 38 / 255, 39 / 255]
  ];
  var Y = [
    [233 / 255, 199 / 255, 173 / 255],
    [214 / 255, 76 / 255, 127 / 255],
    [238 / 255, 204 / 255, 124 / 255],
    [230 / 255, 174 / 255, 115 / 255],
    [86 / 255, 141 / 255, 146 / 255],
    [118 / 255, 83 / 255, 97 / 255],
    [196 / 255, 192 / 255, 118 / 255],
    [60 / 255, 52 / 255, 40 / 255]
  ];
  var A = [
    [255 / 255, 244 / 255, 216 / 255],
    [248 / 255, 80 / 255, 46 / 255],
    [255 / 255, 213 / 255, 44 / 255],
    [254 / 255, 129 / 255, 5 / 255],
    [0 / 255, 124 / 255, 197 / 255],
    [132 / 255, 77 / 255, 139 / 255],
    [120 / 255, 160 / 255, 66 / 255],
    [2 / 255, 4 / 255, 6 / 255]
  ];
  var E = [
    [254 / 255, 249 / 255, 246 / 255],
    [248 / 255, 20 / 255, 35 / 255],
    [237 / 255, 199 / 255, 8 / 255],
    [254 / 255, 128 / 255, 11 / 255],
    [48 / 255, 140 / 255, 206 / 255],
    [182 / 255, 40 / 255, 94 / 255],
    [135 / 255, 187 / 255, 26 / 255],
    [29 / 255, 27 / 255, 28 / 255]
  ];
  var S = [
    [226 / 255, 216 / 255, 205 / 255],
    [224 / 255, 43 / 255, 39 / 255],
    [251 / 255, 204 / 255, 38 / 255],
    [255 / 255, 138 / 255, 4 / 255],
    [82 / 255, 103 / 255, 202 / 255],
    [199 / 255, 112 / 255, 253 / 255],
    [104 / 255, 182 / 255, 90 / 255],
    [22 / 255, 19 / 255, 11 / 255]
  ];
  var H = [
    [221 / 255, 219 / 255, 211 / 255],
    [196 / 255, 82 / 255, 69 / 255],
    [196 / 255, 167 / 255, 80 / 255],
    [200 / 255, 123 / 255, 70 / 255],
    [74 / 255, 104 / 255, 167 / 255],
    [94 / 255, 89 / 255, 161 / 255],
    [86 / 255, 139 / 255, 70 / 255],
    [38 / 255, 38 / 255, 38 / 255]
  ];
  var M = [
    [237 / 255, 235 / 255, 236 / 255],
    [242 / 255, 146 / 255, 109 / 255],
    [245 / 255, 234 / 255, 143 / 255],
    [247 / 255, 194 / 255, 115 / 255],
    [89 / 255, 118 / 255, 212 / 255],
    [237 / 255, 191 / 255, 243 / 255],
    [153 / 255, 201 / 255, 113 / 255],
    [50 / 255, 63 / 255, 66 / 255]
  ];
  var d = [
    [255 / 255, 251 / 255, 230 / 255],
    [238 / 255, 86 / 255, 46 / 255],
    [249 / 255, 213 / 255, 50 / 255],
    [252 / 255, 132 / 255, 4 / 255],
    [43 / 255, 103 / 255, 175 / 255],
    [246 / 255, 137 / 255, 163 / 255],
    [171 / 255, 205 / 255, 94 / 255],
    [5 / 255, 5 / 255, 5 / 255]
  ];
  var L = [
    [246 / 255, 248 / 255, 244 / 255],
    [248 / 255, 20 / 255, 40 / 255],
    [255 / 255, 198 / 255, 8 / 255],
    [248 / 255, 140 / 255, 18 / 255],
    [8 / 255, 41 / 255, 148 / 255],
    [152 / 255, 56 / 255, 142 / 255],
    [8 / 255, 156 / 255, 49 / 255],
    [12 / 255, 17 / 255, 15 / 255]
  ];
  var N = [
    [238 / 255, 221 / 255, 177 / 255],
    [211 / 255, 24 / 255, 34 / 255],
    [248 / 255, 211 / 255, 36 / 255],
    [242 / 255, 116 / 255, 30 / 255],
    [51 / 255, 114 / 255, 143 / 255],
    [104 / 255, 73 / 255, 78 / 255],
    [90 / 255, 127 / 255, 42 / 255],
    [13 / 255, 17 / 255, 19 / 255]
  ];
  var I = [
    [0.9765, 0.9647, 0.9255],
    [0.9765, 0.4392, 0.4431],
    [0.949, 0.9059, 0.4157],
    [0.9373, 0.5961, 0.498],
    [0.4431, 0.7098, 0.8],
    [0.9098, 0.7961, 0.8],
    [0.6275, 0.851, 0.4863],
    [0.0863, 0.0745, 0.051]
  ];
  var P = [
    [221 / 255, 215 / 255, 183 / 255],
    [142 / 255, 42 / 255, 37 / 255],
    [217 / 255, 194 / 255, 18 / 255],
    [192 / 255, 114 / 255, 50 / 255],
    [67 / 255, 80 / 255, 119 / 255],
    [83 / 255, 51 / 255, 88 / 255],
    [99 / 255, 130 / 255, 47 / 255],
    [21 / 255, 19 / 255, 13 / 255]
  ];
  var k = [
    [251 / 255, 227 / 255, 172 / 255],
    [227 / 255, 16 / 255, 7 / 255],
    [255 / 255, 216 / 255, 0 / 255],
    [251 / 255, 166 / 255, 9 / 255],
    [3 / 255, 61 / 255, 120 / 255],
    [139 / 255, 35 / 255, 67 / 255],
    [115 / 255, 131 / 255, 18 / 255],
    [24 / 255, 13 / 255, 14 / 255]
  ];
  var e = /* @__PURE__ */ new Map();
  e.set("itten", {
    title: "Chromatic Circle",
    author: "Johannes Itten",
    year: 1961,
    reference: "farbkreis_extended.png",
    cube: r
  });
  e.set("itten-normalized", {
    title: "Chromatic Circle (Paper-white)",
    author: "Johannes Itten",
    year: 1961,
    reference: "Johannes-Itten-The-chromatic-circle-some-exercises-on-the-contrast-of-pure-colors.webp",
    cube: t
  });
  e.set("itten-neutral", {
    title: "Nathan Gossett & Baoquan Chen",
    author: "Johannes Itten",
    year: 1961,
    reference: "itten-ryb.pdf",
    cube: a
  });
  e.set("bezold", {
    title: "Farbentafel",
    author: "Wilhelm von Bezold",
    year: 1874,
    reference: "Bezold_Farbentafel_1874.jpg",
    cube: o
  });
  e.set("boutet", {
    title: "Twelve-color color circles ",
    author: "Claude Boutet",
    year: 1708,
    reference: "Boutet_1708_color_circles.jpg",
    cube: n
  });
  e.set("hett", {
    title: "RGV Color Wheel",
    author: "J. A. H. Hett",
    year: 1908,
    reference: "RGV_color_wheel_1908.png",
    cube: c
  });
  e.set("schiffermueller", {
    title: "Versuch eines Farbensystems",
    author: "Ignaz Schifferm\xFCller",
    year: 1772,
    reference: "020_schiffermueller1.jpg",
    cube: s
  });
  e.set("harris", {
    title: "The Natural System of Colours",
    author: "Moses Harris",
    year: 1766,
    reference: "Moses_Harris_The_Natural_System_of_Colours.jpg",
    cube: l
  });
  e.set("harrisc82", {
    title: "The Natural System of Colours",
    author: "Moses Harris / C82",
    year: 1766,
    reference: "harrisc82.png",
    cube: u
  });
  e.set("harrisc82alt", {
    title: "The Natural System of Colours",
    author: "Moses Harris / C82",
    year: 1766,
    reference: "harrisc82alt.png",
    cube: i
  });
  e.set("goethe", {
    title: "Farbenkreis",
    author: "Johann Wolfgang von Goethe",
    year: 1809,
    reference: "Goethe_Farbenkreis_zur_Symbolisierung_des_menschlichen_Geistes-_und_Seelenlebens_1809.jpg",
    cube: h
  });
  e.set("munsell", {
    title: "Munsell Color System",
    author: "Albert Henry Munsell",
    year: 1905,
    reference: "munsell-atlas-11.jpg",
    cube: p
  });
  e.set("munsell-alt", {
    title: "A Grammar of Color",
    author: "Cleland, T. M. & Albert Henry Munsell",
    year: 1921,
    reference: "munsell-alt.jpg",
    cube: _
  });
  e.set("hayter", {
    title: "New Practical Treatise on the Three Primitive Colours",
    author: "Charles Hayter",
    year: 1826,
    reference: "Color_diagram_Charles_Hayter.jpg",
    cube: b
  });
  e.set("bormann", {
    title: "Gouache tint study for Josef Alber's Preliminary Course",
    author: "Heinrich-Siegfried Bormann",
    year: 1931,
    reference: "bormann.png",
    cube: y
  });
  e.set("albers", {
    title: "Interaction of Color",
    author: "Josef Albers",
    year: 1942,
    reference: "albers-color-harmony.jpg",
    cube: R
  });
  e.set("lohse", {
    title: "Kunsthalle Bern Poster",
    author: "Richard Paul Lohse",
    year: 1970,
    reference: "lohse.png",
    cube: f
  });
  e.set("church", {
    title: "An Elementary Manual for Students",
    author: "A.H. Church",
    year: 1887,
    reference: "church.png",
    cube: P
  });
  e.set("chevreul", {
    title: "Cercle chromatique",
    author: "Michel Eug\xE8ne Chevreul",
    year: 1839,
    reference: "Cercle_chromatique_Chevreul_2.jpg",
    cube: C
  });
  e.set("runge", {
    title: "Farbenkugel",
    author: "Philipp Otto Runge",
    year: 1810,
    reference: "farbenkugel.png",
    cube: N
  });
  e.set("trilobe-synoptique", {
    title: "Trilobe Synoptique",
    author: "Charles Lacouture",
    year: 1890,
    reference: "Charles Lacouture, Trilobe Synoptique.jpeg",
    cube: k
  });
  e.set("maycock", {
    title: "Scale of Normal Colors and their Hues",
    author: "Mark M. Maycock",
    year: 1895,
    reference: "maycock.png",
    cube: m
  });
  e.set("colorprinter", {
    title: "The Color Printer",
    author: "John Earhart",
    year: 1892,
    reference: "colorprinter.png",
    cube: T
  });
  e.set("japschool", {
    title: "Japanese Textbook",
    author: "Japanese School",
    year: 1930,
    reference: "japschool.png",
    cube: g
  });
  e.set("kindergarten1890", {
    title: "Kindergarten Workbook",
    author: "Milton Bradley",
    year: 1890,
    reference: "kindergarten1890.jpg",
    cube: B
  });
  e.set("marvel-news", {
    title: "64 Color Chart on Newsprint",
    author: "Marvel Comics",
    year: 1982,
    reference: "marvel-news.png",
    cube: Y
  });
  e.set("arquitetura-decoracao", {
    title: "Sugest\xF5es. Arquitetura Decora\xE7\xE3o",
    author: "Unknown \u2013 Sao Paulo",
    year: 1956,
    reference: "arquitetura-decoracao.png",
    cube: I
  });
  e.set("apple90s", {
    title: "Macintosh Reference Manual",
    author: "Apple",
    year: 1990,
    reference: "apple90s.png",
    cube: A
  });
  e.set("apple80s", {
    title: "HyperCard User Manual",
    author: "Apple",
    year: 1989,
    reference: "apple80s.png",
    cube: E
  });
  e.set("clayton", {
    title: "Intrinsic Value Plate",
    author: "Greg Clayton",
    year: 2017,
    reference: "A260P03_IntrinsicValue1.gif",
    cube: L
  });
  e.set("pixelart", {
    title: "Pixel Art",
    author: "Tofu",
    year: 2024,
    reference: "pixelart.png",
    cube: S
  });
  e.set("ippsketch", {
    title: "Imposter Syndrome",
    author: "Ippsketch",
    year: 2021,
    reference: "ippsketch.png",
    cube: H
  });
  e.set("ryan", {
    title: "Compositions Palette",
    author: "Ryan",
    year: 2024,
    reference: "ryan.png",
    cube: M
  });
  e.set("ten", {
    title: "Ten",
    author: "Roni Kaufman",
    year: 2022,
    reference: "ten.png",
    cube: d
  });
  e.set("cmy", {
    title: "CMY Subtractive Primaries",
    author: "Jacob Christoph Le Blon",
    year: 1725,
    reference: "",
    cube: [
      [1, 1, 1],
      // white   (no ink)
      [0, 1, 1],
      // cyan    (C primary)
      [1, 1, 0],
      // yellow  (Y primary)
      [0, 1, 0],
      // green   (C+Y)
      [1, 0, 1],
      // magenta (M primary)
      [0, 0, 1],
      // blue    (C+M)
      [1, 0, 0],
      // red     (M+Y)
      [0, 0, 0]
      // black   (all ink)
    ]
  });
  e.set("rgb", {
    title: "Inverted RGB",
    author: "James Clerk Maxwell",
    year: 1860,
    reference: "rgb-cube.png",
    cube: [
      [1, 1, 1],
      [1, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
      [0, 0, 0]
    ]
  });

  // node_modules/rybitten/dist/rybitten.mjs
  var m2 = (n2) => n2 * n2 * (3 - 2 * n2);
  var f2 = (n2, r2, a2) => n2 + a2 * (r2 - n2);
  var e2 = (n2, r2, a2, o2, t2, s2) => f2(f2(n2, r2, t2), f2(a2, o2, t2), s2);
  var p2 = (n2, r2, a2, o2, t2, s2, l2, T2, i2, k2, h2) => f2(
    e2(n2, r2, a2, o2, i2, k2),
    e2(t2, s2, l2, T2, i2, k2),
    h2
  );
  function w(n2, { cube: r2 = r, easingFn: a2 = m2 } = {}) {
    const o2 = a2(n2[0]), t2 = a2(n2[1]), s2 = a2(n2[2]);
    return [
      p2(
        r2[0][0],
        r2[1][0],
        r2[2][0],
        r2[3][0],
        r2[4][0],
        r2[5][0],
        r2[6][0],
        r2[7][0],
        o2,
        t2,
        s2
      ),
      p2(
        r2[0][1],
        r2[1][1],
        r2[2][1],
        r2[3][1],
        r2[4][1],
        r2[5][1],
        r2[6][1],
        r2[7][1],
        o2,
        t2,
        s2
      ),
      p2(
        r2[0][2],
        r2[1][2],
        r2[2][2],
        r2[3][2],
        r2[4][2],
        r2[5][2],
        r2[6][2],
        r2[7][2],
        o2,
        t2,
        s2
      )
    ];
  }
  function M2(n2) {
    return (n2 % 360 + 360) % 360;
  }
  function R2(n2) {
    let [r2] = n2;
    const [, a2, o2] = n2;
    r2 = M2(r2 || 0);
    const t2 = o2 + a2 * (o2 < 0.5 ? o2 : 1 - o2), s2 = t2 - (t2 - o2) * 2 * Math.abs(r2 / 60 % 2 - 1);
    let l2;
    switch (Math.floor(r2 / 60)) {
      case 0:
        l2 = [t2, s2, 2 * o2 - t2];
        break;
      case 1:
        l2 = [s2, t2, 2 * o2 - t2];
        break;
      case 2:
        l2 = [2 * o2 - t2, t2, s2];
        break;
      case 3:
        l2 = [2 * o2 - t2, s2, t2];
        break;
      case 4:
        l2 = [s2, 2 * o2 - t2, t2];
        break;
      case 5:
        l2 = [t2, 2 * o2 - t2, s2];
        break;
      default:
        l2 = [2 * o2 - t2, 2 * o2 - t2, 2 * o2 - t2];
    }
    return l2;
  }
  function A2(n2, {
    cube: r2 = r,
    easingFn: a2 = m2,
    invertLightness: o2 = true
  } = {}) {
    const t2 = o2 ? 1 - n2[2] : n2[2], s2 = R2([n2[0], n2[1], t2]);
    return w(s2, { cube: r2, easingFn: a2 });
  }

  // node_modules/tslib/tslib.es6.mjs
  function __rest(s2, e3) {
    var t2 = {};
    for (var p3 in s2) if (Object.prototype.hasOwnProperty.call(s2, p3) && e3.indexOf(p3) < 0)
      t2[p3] = s2[p3];
    if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i2 = 0, p3 = Object.getOwnPropertySymbols(s2); i2 < p3.length; i2++) {
        if (e3.indexOf(p3[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p3[i2]))
          t2[p3[i2]] = s2[p3[i2]];
      }
    return t2;
  }
  function __awaiter(thisArg, _arguments, P2, generator) {
    function adopt(value) {
      return value instanceof P2 ? value : new P2(function(resolve) {
        resolve(value);
      });
    }
    return new (P2 || (P2 = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e3) {
          reject(e3);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e3) {
          reject(e3);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  // node_modules/@supabase/functions-js/dist/module/helper.js
  var resolveFetch = (customFetch) => {
    if (customFetch) {
      return (...args) => customFetch(...args);
    }
    return (...args) => fetch(...args);
  };

  // node_modules/@supabase/functions-js/dist/module/types.js
  var FunctionsError = class extends Error {
    constructor(message, name = "FunctionsError", context) {
      super(message);
      this.name = name;
      this.context = context;
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        context: this.context
      };
    }
  };
  var FunctionsFetchError = class extends FunctionsError {
    constructor(context) {
      super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
    }
  };
  var FunctionsRelayError = class extends FunctionsError {
    constructor(context) {
      super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
    }
  };
  var FunctionsHttpError = class extends FunctionsError {
    constructor(context) {
      super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
    }
  };
  var FunctionRegion;
  (function(FunctionRegion2) {
    FunctionRegion2["Any"] = "any";
    FunctionRegion2["ApNortheast1"] = "ap-northeast-1";
    FunctionRegion2["ApNortheast2"] = "ap-northeast-2";
    FunctionRegion2["ApSouth1"] = "ap-south-1";
    FunctionRegion2["ApSoutheast1"] = "ap-southeast-1";
    FunctionRegion2["ApSoutheast2"] = "ap-southeast-2";
    FunctionRegion2["CaCentral1"] = "ca-central-1";
    FunctionRegion2["EuCentral1"] = "eu-central-1";
    FunctionRegion2["EuWest1"] = "eu-west-1";
    FunctionRegion2["EuWest2"] = "eu-west-2";
    FunctionRegion2["EuWest3"] = "eu-west-3";
    FunctionRegion2["SaEast1"] = "sa-east-1";
    FunctionRegion2["UsEast1"] = "us-east-1";
    FunctionRegion2["UsWest1"] = "us-west-1";
    FunctionRegion2["UsWest2"] = "us-west-2";
  })(FunctionRegion || (FunctionRegion = {}));

  // node_modules/@supabase/functions-js/dist/module/FunctionsClient.js
  var FunctionsClient = class {
    /**
     * Creates a new Functions client bound to an Edge Functions URL.
     *
     * @example Using supabase-js (recommended)
     * ```ts
     * import { createClient } from '@supabase/supabase-js'
     *
     * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
     * const { data, error } = await supabase.functions.invoke('hello-world')
     * ```
     *
     * @category Edge Functions
     *
     * @example Standalone import for bundle-sensitive environments
     * ```ts
     * import { FunctionsClient, FunctionRegion } from '@supabase/functions-js'
     *
     * const functions = new FunctionsClient('https://xyzcompany.supabase.co/functions/v1', {
     *   headers: { apikey: 'your-publishable-key' },
     *   region: FunctionRegion.UsEast1,
     * })
     * ```
     */
    constructor(url, { headers = {}, customFetch, region = FunctionRegion.Any } = {}) {
      this.url = url;
      this.headers = headers;
      this.region = region;
      this.fetch = resolveFetch(customFetch);
    }
    /**
     * Updates the authorization header
     * @param token - the new jwt token sent in the authorisation header
     *
     * @category Edge Functions
     *
     * @example Setting the authorization header
     * ```ts
     * functions.setAuth(session.access_token)
     * ```
     */
    setAuth(token) {
      this.headers.Authorization = `Bearer ${token}`;
    }
    /**
     * Invokes a function
     * @param functionName - The name of the Function to invoke.
     * @param options - Options for invoking the Function.
     * @example
     * ```ts
     * const { data, error } = await functions.invoke('hello-world', {
     *   body: { name: 'Ada' },
     * })
     * ```
     *
     * @category Edge Functions
     *
     * @remarks
     * - Requires an Authorization header.
     * - Invoke params generally match the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) spec.
     * - When you pass in a body to your function, we automatically attach the Content-Type header for `Blob`, `ArrayBuffer`, `File`, `FormData` and `String`. If it doesn't match any of these types we assume the payload is `json`, serialize it and attach the `Content-Type` header as `application/json`. You can override this behavior by passing in a `Content-Type` header of your own.
     * - Responses are automatically parsed as `json`, `blob` and `form-data` depending on the `Content-Type` header sent by your function. Responses are parsed as `text` by default.
     *
     * @example Basic invocation
     * ```js
     * const { data, error } = await supabase.functions.invoke('hello', {
     *   body: { foo: 'bar' }
     * })
     * ```
     *
     * @exampleDescription Error handling
     * A `FunctionsHttpError` error is returned if your function throws an error, `FunctionsRelayError` if the Supabase Relay has an error processing your function and `FunctionsFetchError` if there is a network error in calling your function. Log the full error object so fields like `name`, `context`, and any structured body aren't hidden.
     *
     * @example Error handling
     * ```js
     * import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";
     *
     * const { data, error } = await supabase.functions.invoke('hello', {
     *   headers: {
     *     "my-custom-header": 'my-custom-header-value'
     *   },
     *   body: { foo: 'bar' }
     * })
     *
     * if (error instanceof FunctionsHttpError) {
     *   const errorMessage = await error.context.json()
     *   console.error('Function returned an error', errorMessage)
     * } else if (error instanceof FunctionsRelayError) {
     *   console.error('Relay error:', error)
     * } else if (error instanceof FunctionsFetchError) {
     *   console.error('Fetch error:', error)
     * }
     * ```
     *
     * @exampleDescription Passing custom headers
     * You can pass custom headers to your function. Note: supabase-js automatically passes the `Authorization` header with the signed in user's JWT.
     *
     * @example Passing custom headers
     * ```js
     * const { data, error } = await supabase.functions.invoke('hello', {
     *   headers: {
     *     "my-custom-header": 'my-custom-header-value'
     *   },
     *   body: { foo: 'bar' }
     * })
     * ```
     *
     * @exampleDescription Calling with DELETE HTTP verb
     * You can also set the HTTP verb to `DELETE` when calling your Edge Function.
     *
     * @example Calling with DELETE HTTP verb
     * ```js
     * const { data, error } = await supabase.functions.invoke('hello', {
     *   headers: {
     *     "my-custom-header": 'my-custom-header-value'
     *   },
     *   body: { foo: 'bar' },
     *   method: 'DELETE'
     * })
     * ```
     *
     * @exampleDescription Invoking a Function in the UsEast1 region
     * Here are the available regions:
     * - `FunctionRegion.Any`
     * - `FunctionRegion.ApNortheast1`
     * - `FunctionRegion.ApNortheast2`
     * - `FunctionRegion.ApSouth1`
     * - `FunctionRegion.ApSoutheast1`
     * - `FunctionRegion.ApSoutheast2`
     * - `FunctionRegion.CaCentral1`
     * - `FunctionRegion.EuCentral1`
     * - `FunctionRegion.EuWest1`
     * - `FunctionRegion.EuWest2`
     * - `FunctionRegion.EuWest3`
     * - `FunctionRegion.SaEast1`
     * - `FunctionRegion.UsEast1`
     * - `FunctionRegion.UsWest1`
     * - `FunctionRegion.UsWest2`
     *
     * @example Invoking a Function in the UsEast1 region
     * ```js
     * import { createClient, FunctionRegion } from '@supabase/supabase-js'
     *
     * const { data, error } = await supabase.functions.invoke('hello', {
     *   body: { foo: 'bar' },
     *   region: FunctionRegion.UsEast1
     * })
     * ```
     *
     * @exampleDescription Calling with GET HTTP verb
     * You can also set the HTTP verb to `GET` when calling your Edge Function.
     *
     * @example Calling with GET HTTP verb
     * ```js
     * const { data, error } = await supabase.functions.invoke('hello', {
     *   headers: {
     *     "my-custom-header": 'my-custom-header-value'
     *   },
     *   method: 'GET'
     * })
     * ```
     *
     * @example Standalone client invoke
     * ```ts
     * const { data, error } = await functions.invoke('hello-world', {
     *   body: { name: 'Ada' },
     * })
     * ```
     */
    invoke(functionName_1) {
      return __awaiter(this, arguments, void 0, function* (functionName, options = {}) {
        var _a;
        let timeoutId;
        let timeoutController;
        try {
          const { headers, method, body: functionArgs, signal, timeout } = options;
          let _headers = {};
          let { region } = options;
          if (!region) {
            region = this.region;
          }
          const url = new URL(`${this.url}/${functionName}`);
          if (region && region !== "any") {
            _headers["x-region"] = region;
            url.searchParams.set("forceFunctionRegion", region);
          }
          let body;
          const hasContentTypeHeader = !!headers && Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
          if (functionArgs && !hasContentTypeHeader) {
            if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
              _headers["Content-Type"] = "application/octet-stream";
              body = functionArgs;
            } else if (typeof functionArgs === "string") {
              _headers["Content-Type"] = "text/plain";
              body = functionArgs;
            } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
              body = functionArgs;
            } else {
              _headers["Content-Type"] = "application/json";
              body = JSON.stringify(functionArgs);
            }
          } else {
            if (functionArgs && typeof functionArgs !== "string" && !(typeof Blob !== "undefined" && functionArgs instanceof Blob) && !(functionArgs instanceof ArrayBuffer) && !(typeof FormData !== "undefined" && functionArgs instanceof FormData)) {
              body = JSON.stringify(functionArgs);
            } else {
              body = functionArgs;
            }
          }
          let effectiveSignal = signal;
          if (timeout) {
            timeoutController = new AbortController();
            timeoutId = setTimeout(() => timeoutController.abort(), timeout);
            if (signal) {
              effectiveSignal = timeoutController.signal;
              signal.addEventListener("abort", () => timeoutController.abort());
            } else {
              effectiveSignal = timeoutController.signal;
            }
          }
          const response = yield this.fetch(url.toString(), {
            method: method || "POST",
            // headers priority is (high to low):
            // 1. invoke-level headers
            // 2. client-level headers
            // 3. default Content-Type header
            headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
            body,
            signal: effectiveSignal
          }).catch((fetchError) => {
            throw new FunctionsFetchError(fetchError);
          });
          const isRelayError = response.headers.get("x-relay-error");
          if (isRelayError && isRelayError === "true") {
            throw new FunctionsRelayError(response);
          }
          if (!response.ok) {
            throw new FunctionsHttpError(response);
          }
          let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim();
          let data;
          if (responseType === "application/json") {
            data = yield response.json();
          } else if (responseType === "application/octet-stream" || responseType === "application/pdf") {
            data = yield response.blob();
          } else if (responseType === "text/event-stream") {
            data = response;
          } else if (responseType === "multipart/form-data") {
            data = yield response.formData();
          } else {
            data = yield response.text();
          }
          return { data, error: null, response };
        } catch (error) {
          return {
            data: null,
            error,
            response: error instanceof FunctionsHttpError || error instanceof FunctionsRelayError ? error.context : void 0
          };
        } finally {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
      });
    }
  };

  // node_modules/@supabase/postgrest-js/dist/index.mjs
  var DEFAULT_MAX_RETRIES = 3;
  var getRetryDelay = (attemptIndex) => Math.min(1e3 * 2 ** attemptIndex, 3e4);
  var RETRYABLE_STATUS_CODES = [520, 503];
  var RETRYABLE_METHODS = [
    "GET",
    "HEAD",
    "OPTIONS"
  ];
  var PostgrestError = class extends Error {
    /**
    * @example
    * ```ts
    * import PostgrestError from '@supabase/postgrest-js'
    *
    * throw new PostgrestError({
    *   message: 'Row level security prevented the request',
    *   details: 'RLS denied the insert',
    *   hint: 'Check your policies',
    *   code: 'PGRST301',
    * })
    * ```
    */
    constructor(context) {
      super(context.message);
      this.name = "PostgrestError";
      this.details = context.details;
      this.hint = context.hint;
      this.code = context.code;
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        details: this.details,
        hint: this.hint,
        code: this.code
      };
    }
  };
  function sleep(ms, signal) {
    return new Promise((resolve) => {
      if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
        resolve();
        return;
      }
      const id = setTimeout(() => {
        signal === null || signal === void 0 || signal.removeEventListener("abort", onAbort);
        resolve();
      }, ms);
      function onAbort() {
        clearTimeout(id);
        resolve();
      }
      signal === null || signal === void 0 || signal.addEventListener("abort", onAbort);
    });
  }
  function shouldRetry(method, status, attemptCount, retryEnabled) {
    if (!retryEnabled || attemptCount >= DEFAULT_MAX_RETRIES) return false;
    if (!RETRYABLE_METHODS.includes(method)) return false;
    if (!RETRYABLE_STATUS_CODES.includes(status)) return false;
    return true;
  }
  var PostgrestBuilder = class {
    /**
    * Creates a builder configured for a specific PostgREST request.
    *
    * @example Using supabase-js (recommended)
    * ```ts
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
    * const { data, error } = await supabase.from('users').select('*')
    * ```
    *
    * @category Database
    *
    * @example Standalone import for bundle-sensitive environments
    * ```ts
    * import { PostgrestQueryBuilder } from '@supabase/postgrest-js'
    *
    * const builder = new PostgrestQueryBuilder(
    *   new URL('https://xyzcompany.supabase.co/rest/v1/users'),
    *   { headers: new Headers({ apikey: 'your-publishable-key' }) }
    * )
    * ```
    */
    constructor(builder) {
      var _builder$shouldThrowO, _builder$isMaybeSingl, _builder$shouldStripN, _builder$urlLengthLim, _builder$retry;
      this.shouldThrowOnError = false;
      this.retryEnabled = true;
      this.method = builder.method;
      this.url = builder.url;
      this.headers = new Headers(builder.headers);
      this.schema = builder.schema;
      this.body = builder.body;
      this.shouldThrowOnError = (_builder$shouldThrowO = builder.shouldThrowOnError) !== null && _builder$shouldThrowO !== void 0 ? _builder$shouldThrowO : false;
      this.signal = builder.signal;
      this.isMaybeSingle = (_builder$isMaybeSingl = builder.isMaybeSingle) !== null && _builder$isMaybeSingl !== void 0 ? _builder$isMaybeSingl : false;
      this.shouldStripNulls = (_builder$shouldStripN = builder.shouldStripNulls) !== null && _builder$shouldStripN !== void 0 ? _builder$shouldStripN : false;
      this.urlLengthLimit = (_builder$urlLengthLim = builder.urlLengthLimit) !== null && _builder$urlLengthLim !== void 0 ? _builder$urlLengthLim : 8e3;
      this.retryEnabled = (_builder$retry = builder.retry) !== null && _builder$retry !== void 0 ? _builder$retry : true;
      if (builder.fetch) this.fetch = builder.fetch;
      else this.fetch = fetch;
    }
    /**
    * If there's an error with the query, throwOnError will reject the promise by
    * throwing the error instead of returning it as part of a successful response.
    *
    * {@link https://github.com/supabase/supabase-js/issues/92}
    *
    * @category Database
    * @subcategory Using modifiers
    */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /**
    * Strip null values from the response data. Properties with `null` values
    * will be omitted from the returned JSON objects.
    *
    * Requires PostgREST 11.2.0+.
    *
    * {@link https://docs.postgrest.org/en/stable/references/api/resource_representation.html#stripped-nulls}
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select()
    *   .stripNulls()
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text, bio text);
    *
    * insert into
    *   characters (id, name, bio)
    * values
    *   (1, 'Luke', null),
    *   (2, 'Leia', 'Princess of Alderaan');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "Luke"
    *     },
    *     {
    *       "id": 2,
    *       "name": "Leia",
    *       "bio": "Princess of Alderaan"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    stripNulls() {
      if (this.headers.get("Accept") === "text/csv") throw new Error("stripNulls() cannot be used with csv()");
      this.shouldStripNulls = true;
      return this;
    }
    /**
    * Set an HTTP header on this single PostgREST request, overriding any header
    * with the same name set on the client.
    *
    * This is an advanced escape hatch for one-off needs (passing a custom
    * `Authorization` for a single query, attaching a tracing header, etc.).
    * Most callers do not need it: configure client-wide headers via the
    * `headers` option when constructing the client, and authentication via
    * Supabase Auth.
    *
    * @param name - HTTP header name
    * @param value - HTTP header value
    *
    * @category Database
    * @subcategory Using modifiers
    */
    setHeader(name, value) {
      this.headers = new Headers(this.headers);
      this.headers.set(name, value);
      return this;
    }
    /**
    * @category Database
    * @subcategory Using modifiers
    *
    * Configure retry behavior for this request.
    *
    * By default, retries are enabled for idempotent requests (GET, HEAD, OPTIONS)
    * that fail with network errors or specific HTTP status codes (503, 520).
    * Retries use exponential backoff (1s, 2s, 4s) with a maximum of 3 attempts.
    *
    * @param enabled - Whether to enable retries for this request
    *
    * @example
    * ```ts
    * // Disable retries for a specific query
    * const { data, error } = await supabase
    *   .from('users')
    *   .select()
    *   .retry(false)
    * ```
    */
    retry(enabled) {
      this.retryEnabled = enabled;
      return this;
    }
    then(onfulfilled, onrejected) {
      var _this = this;
      if (this.schema === void 0) {
      } else if (["GET", "HEAD"].includes(this.method)) this.headers.set("Accept-Profile", this.schema);
      else this.headers.set("Content-Profile", this.schema);
      if (this.method !== "GET" && this.method !== "HEAD") this.headers.set("Content-Type", "application/json");
      if (this.shouldStripNulls) {
        const currentAccept = this.headers.get("Accept");
        if (currentAccept === "application/vnd.pgrst.object+json") this.headers.set("Accept", "application/vnd.pgrst.object+json;nulls=stripped");
        else if (!currentAccept || currentAccept === "application/json") this.headers.set("Accept", "application/vnd.pgrst.array+json;nulls=stripped");
      }
      const _fetch = this.fetch;
      const executeWithRetry = async () => {
        let attemptCount = 0;
        while (true) {
          const headers = {};
          _this.headers.forEach((value, key) => {
            headers[key] = value;
          });
          if (attemptCount > 0) headers["X-Retry-Count"] = String(attemptCount);
          let res$1;
          try {
            res$1 = await _fetch(_this.url.toString(), {
              method: _this.method,
              headers,
              body: JSON.stringify(_this.body, (_2, value) => typeof value === "bigint" ? value.toString() : value),
              signal: _this.signal
            });
          } catch (fetchError) {
            if ((fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) === "AbortError" || (fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) === "ABORT_ERR") throw fetchError;
            if (!RETRYABLE_METHODS.includes(_this.method)) throw fetchError;
            if (_this.retryEnabled && attemptCount < DEFAULT_MAX_RETRIES) {
              const delay = getRetryDelay(attemptCount);
              attemptCount++;
              await sleep(delay, _this.signal);
              continue;
            }
            throw fetchError;
          }
          if (shouldRetry(_this.method, res$1.status, attemptCount, _this.retryEnabled)) {
            var _res$headers$get, _res$headers;
            const retryAfterHeader = (_res$headers$get = (_res$headers = res$1.headers) === null || _res$headers === void 0 ? void 0 : _res$headers.get("Retry-After")) !== null && _res$headers$get !== void 0 ? _res$headers$get : null;
            const delay = retryAfterHeader !== null ? Math.max(0, parseInt(retryAfterHeader, 10) || 0) * 1e3 : getRetryDelay(attemptCount);
            await res$1.text();
            attemptCount++;
            await sleep(delay, _this.signal);
            continue;
          }
          return await _this.processResponse(res$1);
        }
      };
      let res = executeWithRetry();
      if (!this.shouldThrowOnError) res = res.catch((fetchError) => {
        var _fetchError$name2;
        let errorDetails = "";
        let hint = "";
        let code = "";
        const cause = fetchError === null || fetchError === void 0 ? void 0 : fetchError.cause;
        if (cause) {
          var _cause$message, _cause$code, _fetchError$name, _cause$name;
          const causeMessage = (_cause$message = cause === null || cause === void 0 ? void 0 : cause.message) !== null && _cause$message !== void 0 ? _cause$message : "";
          const causeCode = (_cause$code = cause === null || cause === void 0 ? void 0 : cause.code) !== null && _cause$code !== void 0 ? _cause$code : "";
          errorDetails = `${(_fetchError$name = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _fetchError$name !== void 0 ? _fetchError$name : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`;
          errorDetails += `

Caused by: ${(_cause$name = cause === null || cause === void 0 ? void 0 : cause.name) !== null && _cause$name !== void 0 ? _cause$name : "Error"}: ${causeMessage}`;
          if (causeCode) errorDetails += ` (${causeCode})`;
          if (cause === null || cause === void 0 ? void 0 : cause.stack) errorDetails += `
${cause.stack}`;
        } else {
          var _fetchError$stack;
          errorDetails = (_fetchError$stack = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _fetchError$stack !== void 0 ? _fetchError$stack : "";
        }
        const urlLength = this.url.toString().length;
        if ((fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) === "AbortError" || (fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) === "ABORT_ERR") {
          code = "";
          hint = "Request was aborted (timeout or manual cancellation)";
          if (urlLength > this.urlLengthLimit) hint += `. Note: Your request URL is ${urlLength} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`;
        } else if ((cause === null || cause === void 0 ? void 0 : cause.name) === "HeadersOverflowError" || (cause === null || cause === void 0 ? void 0 : cause.code) === "UND_ERR_HEADERS_OVERFLOW") {
          code = "";
          hint = "HTTP headers exceeded server limits (typically 16KB)";
          if (urlLength > this.urlLengthLimit) hint += `. Your request URL is ${urlLength} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`;
        }
        return {
          success: false,
          error: {
            message: `${(_fetchError$name2 = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _fetchError$name2 !== void 0 ? _fetchError$name2 : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
            details: errorDetails,
            hint,
            code
          },
          data: null,
          count: null,
          status: 0,
          statusText: ""
        };
      });
      return res.then(onfulfilled, onrejected);
    }
    /**
    * Process a fetch response and return the standardized postgrest response.
    */
    async processResponse(res) {
      var _this2 = this;
      let error = null;
      let data = null;
      let count = null;
      let status = res.status;
      let statusText = res.statusText;
      if (res.ok) {
        var _this$headers$get2, _res$headers$get2;
        if (_this2.method !== "HEAD") {
          var _this$headers$get;
          const body = await res.text();
          if (body === "") {
          } else if (_this2.headers.get("Accept") === "text/csv") data = body;
          else if (_this2.headers.get("Accept") && ((_this$headers$get = _this2.headers.get("Accept")) === null || _this$headers$get === void 0 ? void 0 : _this$headers$get.includes("application/vnd.pgrst.plan+text"))) data = body;
          else try {
            data = JSON.parse(body);
          } catch (_unused) {
            error = { message: body };
            data = null;
            if (_this2.shouldThrowOnError) throw new PostgrestError({
              message: body,
              details: "",
              hint: "",
              code: ""
            });
          }
        }
        const countHeader = (_this$headers$get2 = _this2.headers.get("Prefer")) === null || _this$headers$get2 === void 0 ? void 0 : _this$headers$get2.match(/count=(exact|planned|estimated)/);
        const contentRange = (_res$headers$get2 = res.headers.get("content-range")) === null || _res$headers$get2 === void 0 ? void 0 : _res$headers$get2.split("/");
        if (countHeader && contentRange && contentRange.length > 1) count = parseInt(contentRange[1]);
        if (_this2.isMaybeSingle && Array.isArray(data)) if (data.length > 1) {
          error = {
            code: "PGRST116",
            details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
            hint: null,
            message: "JSON object requested, multiple (or no) rows returned"
          };
          data = null;
          count = null;
          status = 406;
          statusText = "Not Acceptable";
        } else if (data.length === 1) data = data[0];
        else data = null;
      } else {
        const body = await res.text();
        try {
          error = JSON.parse(body);
          if (Array.isArray(error) && res.status === 404) {
            data = [];
            error = null;
            status = 200;
            statusText = "OK";
          }
        } catch (_unused2) {
          if (res.status === 404 && body === "") {
            status = 204;
            statusText = "No Content";
          } else error = { message: body };
        }
        if (error && _this2.shouldThrowOnError) throw new PostgrestError(error);
      }
      return {
        success: error === null,
        error,
        data,
        count,
        status,
        statusText
      };
    }
    /**
    * Override the type of the returned `data`.
    *
    * @typeParam NewResult - The new result type to override with
    * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
    *
    * @category Database
    * @subcategory Using modifiers
    */
    returns() {
      return this;
    }
    /**
    * Override the type of the returned `data` field in the response.
    *
    * @typeParam NewResult - The new type to cast the response data to
    * @typeParam Options - Optional type configuration (defaults to { merge: true })
    * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
    * @example
    * ```typescript
    * // Merge with existing types (default behavior)
    * const query = supabase
    *   .from('users')
    *   .select()
    *   .overrideTypes<{ custom_field: string }>()
    *
    * // Replace existing types completely
    * const replaceQuery = supabase
    *   .from('users')
    *   .select()
    *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
    * ```
    * @returns A PostgrestBuilder instance with the new type
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @example Complete Override type of successful response
    * ```ts
    * const { data } = await supabase
    *   .from('countries')
    *   .select()
    *   .overrideTypes<Array<MyType>, { merge: false }>()
    * ```
    *
    * @exampleResponse Complete Override type of successful response
    * ```ts
    * let x: typeof data // MyType[]
    * ```
    *
    * @example Complete Override type of object response
    * ```ts
    * const { data } = await supabase
    *   .from('countries')
    *   .select()
    *   .maybeSingle()
    *   .overrideTypes<MyType, { merge: false }>()
    * ```
    *
    * @exampleResponse Complete Override type of object response
    * ```ts
    * let x: typeof data // MyType | null
    * ```
    *
    * @example Partial Override type of successful response
    * ```ts
    * const { data } = await supabase
    *   .from('countries')
    *   .select()
    *   .overrideTypes<Array<{ status: "A" | "B" }>>()
    * ```
    *
    * @exampleResponse Partial Override type of successful response
    * ```ts
    * let x: typeof data // Array<CountryRowProperties & { status: "A" | "B" }>
    * ```
    *
    * @example Partial Override type of object response
    * ```ts
    * const { data } = await supabase
    *   .from('countries')
    *   .select()
    *   .maybeSingle()
    *   .overrideTypes<{ status: "A" | "B" }>()
    * ```
    *
    * @exampleResponse Partial Override type of object response
    * ```ts
    * let x: typeof data // CountryRowProperties & { status: "A" | "B" } | null
    * ```
    *
    * @example Merge vs replace existing types
    * ```typescript
    * // Merge with existing types (default behavior)
    * const query = supabase
    *   .from('users')
    *   .select()
    *   .overrideTypes<{ custom_field: string }>()
    *
    * // Replace existing types completely
    * const replaceQuery = supabase
    *   .from('users')
    *   .select()
    *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
    * ```
    */
    overrideTypes() {
      return this;
    }
  };
  var PostgrestTransformBuilder = class extends PostgrestBuilder {
    throwOnError() {
      return super.throwOnError();
    }
    /**
    * Perform a SELECT on the query result.
    *
    * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
    * return modified rows. By calling this method, modified rows are returned in
    * `data`.
    *
    * @param columns - The columns to retrieve, separated by commas
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @example With `upsert()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .upsert({ id: 1, name: 'Han Solo' })
    *   .select()
    * ```
    *
    * @exampleSql With `upsert()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Han');
    * ```
    *
    * @exampleResponse With `upsert()`
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "Han Solo"
    *     }
    *   ],
    *   "status": 201,
    *   "statusText": "Created"
    * }
    * ```
    */
    select(columns) {
      let quoted = false;
      const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c2) => {
        if (/\s/.test(c2) && !quoted) return "";
        if (c2 === '"') quoted = !quoted;
        return c2;
      }).join("");
      this.url.searchParams.set("select", cleanedColumns);
      this.headers.append("Prefer", "return=representation");
      return this;
    }
    /**
    * Order the query result by `column`.
    *
    * You can call this method multiple times to order by multiple columns.
    *
    * You can order referenced tables, but it only affects the ordering of the
    * parent table if you use `!inner` in the query.
    *
    * @param column - The column to order by
    * @param options - Named parameters
    * @param options.ascending - If `true`, the result will be in ascending order
    * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
    * `null`s appear last.
    * @param options.referencedTable - Set this to order a referenced table by
    * its columns
    * @param options.foreignTable - Deprecated, use `options.referencedTable`
    * instead
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select('id, name')
    *   .order('id', { ascending: false })
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 3,
    *       "name": "Han"
    *     },
    *     {
    *       "id": 2,
    *       "name": "Leia"
    *     },
    *     {
    *       "id": 1,
    *       "name": "Luke"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription On a referenced table
    * Ordering with `referencedTable` doesn't affect the ordering of the
    * parent table.
    *
    * @example On a referenced table
    * ```ts
    *   const { data, error } = await supabase
    *     .from('orchestral_sections')
    *     .select(`
    *       name,
    *       instruments (
    *         name
    *       )
    *     `)
    *     .order('name', { referencedTable: 'instruments', ascending: false })
    *
    * ```
    *
    * @exampleSql On a referenced table
    * ```sql
    * create table
    *   orchestral_sections (id int8 primary key, name text);
    * create table
    *   instruments (
    *     id int8 primary key,
    *     section_id int8 not null references orchestral_sections,
    *     name text
    *   );
    *
    * insert into
    *   orchestral_sections (id, name)
    * values
    *   (1, 'strings'),
    *   (2, 'woodwinds');
    * insert into
    *   instruments (id, section_id, name)
    * values
    *   (1, 1, 'harp'),
    *   (2, 1, 'violin');
    * ```
    *
    * @exampleResponse On a referenced table
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "strings",
    *       "instruments": [
    *         {
    *           "name": "violin"
    *         },
    *         {
    *           "name": "harp"
    *         }
    *       ]
    *     },
    *     {
    *       "name": "woodwinds",
    *       "instruments": []
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Order parent table by a referenced table
    * Ordering with `referenced_table(col)` affects the ordering of the
    * parent table.
    *
    * @example Order parent table by a referenced table
    * ```ts
    *   const { data, error } = await supabase
    *     .from('instruments')
    *     .select(`
    *       name,
    *       section:orchestral_sections (
    *         name
    *       )
    *     `)
    *     .order('section(name)', { ascending: true })
    *
    * ```
    *
    * @exampleSql Order parent table by a referenced table
    * ```sql
    * create table
    *   orchestral_sections (id int8 primary key, name text);
    * create table
    *   instruments (
    *     id int8 primary key,
    *     section_id int8 not null references orchestral_sections,
    *     name text
    *   );
    *
    * insert into
    *   orchestral_sections (id, name)
    * values
    *   (1, 'strings'),
    *   (2, 'woodwinds');
    * insert into
    *   instruments (id, section_id, name)
    * values
    *   (1, 2, 'flute'),
    *   (2, 1, 'violin');
    * ```
    *
    * @exampleResponse Order parent table by a referenced table
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "violin",
    *       "orchestral_sections": {"name": "strings"}
    *     },
    *     {
    *       "name": "flute",
    *       "orchestral_sections": {"name": "woodwinds"}
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
      const key = referencedTable ? `${referencedTable}.order` : "order";
      const existingOrder = this.url.searchParams.get(key);
      this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
      return this;
    }
    /**
    * Limit the query result by `rows`.
    *
    * @param rows - The maximum number of rows to return
    * @param options - Named parameters
    * @param options.referencedTable - Set this to limit rows of referenced
    * tables instead of the parent table
    * @param options.foreignTable - Deprecated, use `options.referencedTable`
    * instead
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select('name')
    *   .limit(1)
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "Luke"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @example On a referenced table
    * ```ts
    * const { data, error } = await supabase
    *   .from('orchestral_sections')
    *   .select(`
    *     name,
    *     instruments (
    *       name
    *     )
    *   `)
    *   .limit(1, { referencedTable: 'instruments' })
    * ```
    *
    * @exampleSql On a referenced table
    * ```sql
    * create table
    *   orchestral_sections (id int8 primary key, name text);
    * create table
    *   instruments (
    *     id int8 primary key,
    *     section_id int8 not null references orchestral_sections,
    *     name text
    *   );
    *
    * insert into
    *   orchestral_sections (id, name)
    * values
    *   (1, 'strings');
    * insert into
    *   instruments (id, section_id, name)
    * values
    *   (1, 1, 'harp'),
    *   (2, 1, 'violin');
    * ```
    *
    * @exampleResponse On a referenced table
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "strings",
    *       "instruments": [
    *         {
    *           "name": "violin"
    *         }
    *       ]
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    limit(rows, { foreignTable, referencedTable = foreignTable } = {}) {
      const key = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
      this.url.searchParams.set(key, `${rows}`);
      return this;
    }
    /**
    * Limit the query result by starting at an offset `from` and ending at the offset `to`.
    * Only records within this range are returned.
    * This respects the query order and if there is no order clause the range could behave unexpectedly.
    * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
    * and fourth rows of the query.
    *
    * @param from - The starting index from which to limit the result
    * @param to - The last index to which to limit the result
    * @param options - Named parameters
    * @param options.referencedTable - Set this to limit rows of referenced
    * tables instead of the parent table
    * @param options.foreignTable - Deprecated, use `options.referencedTable`
    * instead
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select('name')
    *   .range(0, 1)
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "Luke"
    *     },
    *     {
    *       "name": "Leia"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
      const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
      const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
      this.url.searchParams.set(keyOffset, `${from}`);
      this.url.searchParams.set(keyLimit, `${to - from + 1}`);
      return this;
    }
    /**
    * Set the AbortSignal for the fetch request.
    *
    * @param signal - The AbortSignal to use for the fetch request
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @remarks
    * You can use this to set a timeout for the request.
    *
    * @exampleDescription Aborting requests in-flight
    * You can use an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to abort requests.
    * Note that `status` and `statusText` don't mean anything for aborted requests as the request wasn't fulfilled.
    *
    * @example Aborting requests in-flight
    * ```ts
    * const ac = new AbortController()
    *
    * const { data, error } = await supabase
    *   .from('very_big_table')
    *   .select()
    *   .abortSignal(ac.signal)
    *
    * // Abort the request after 100 ms
    * setTimeout(() => ac.abort(), 100)
    * ```
    *
    * @exampleResponse Aborting requests in-flight
    * ```json
    *   {
    *     "error": {
    *       "message": "AbortError: The user aborted a request.",
    *       "details": "",
    *       "hint": "The request was aborted locally via the provided AbortSignal.",
    *       "code": ""
    *     },
    *     "status": 0,
    *     "statusText": ""
    *   }
    *
    * ```
    *
    * @example Set a timeout
    * ```ts
    * const { data, error } = await supabase
    *   .from('very_big_table')
    *   .select()
    *   .abortSignal(AbortSignal.timeout(1000 /* ms *\/))
    * ```
    *
    * @exampleResponse Set a timeout
    * ```json
    *   {
    *     "error": {
    *       "message": "FetchError: The user aborted a request.",
    *       "details": "",
    *       "hint": "",
    *       "code": ""
    *     },
    *     "status": 400,
    *     "statusText": "Bad Request"
    *   }
    *
    * ```
    */
    abortSignal(signal) {
      this.signal = signal;
      return this;
    }
    /**
    * Return `data` as a single object instead of an array of objects.
    *
    * Query result must be one row (e.g. using `.limit(1)`), otherwise this
    * returns an error.
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select('name')
    *   .limit(1)
    *   .single()
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "data": {
    *     "name": "Luke"
    *   },
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    single() {
      this.headers.set("Accept", "application/vnd.pgrst.object+json");
      return this;
    }
    /**
    * Return `data` as a single object instead of an array of objects.
    *
    * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
    * this returns an error.
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select()
    *   .eq('name', 'Katniss')
    *   .maybeSingle()
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    maybeSingle() {
      this.isMaybeSingle = true;
      return this;
    }
    /**
    * Return `data` as a string in CSV format.
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @exampleDescription Return data as CSV
    * By default, the data is returned in JSON format, but can also be returned as Comma Separated Values.
    *
    * @example Return data as CSV
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select()
    *   .csv()
    * ```
    *
    * @exampleSql Return data as CSV
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse Return data as CSV
    * ```json
    * {
    *   "data": "id,name\n1,Luke\n2,Leia\n3,Han",
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    csv() {
      this.headers.set("Accept", "text/csv");
      return this;
    }
    /**
    * Return `data` as an object in [GeoJSON](https://geojson.org) format.
    *
    * @category Database
    * @subcategory Using modifiers
    */
    geojson() {
      this.headers.set("Accept", "application/geo+json");
      return this;
    }
    /**
    * Return `data` as the EXPLAIN plan for the query.
    *
    * You need to enable the
    * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
    * setting before using this method.
    *
    * @param options - Named parameters
    *
    * @param options.analyze - If `true`, the query will be executed and the
    * actual run time will be returned
    *
    * @param options.verbose - If `true`, the query identifier will be returned
    * and `data` will include the output columns of the query
    *
    * @param options.settings - If `true`, include information on configuration
    * parameters that affect query planning
    *
    * @param options.buffers - If `true`, include information on buffer usage
    *
    * @param options.wal - If `true`, include information on WAL record generation
    *
    * @param options.format - The format of the output, can be `"text"` (default)
    * or `"json"`
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @exampleDescription Get the execution plan
    * By default, the data is returned in TEXT format, but can also be returned as JSON by using the `format` parameter.
    *
    * @example Get the execution plan
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select()
    *   .explain()
    * ```
    *
    * @exampleSql Get the execution plan
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse Get the execution plan
    * ```js
    * Aggregate  (cost=33.34..33.36 rows=1 width=112)
    *   ->  Limit  (cost=0.00..18.33 rows=1000 width=40)
    *         ->  Seq Scan on characters  (cost=0.00..22.00 rows=1200 width=40)
    * ```
    *
    * @exampleDescription Get the execution plan with analyze and verbose
    * By default, the data is returned in TEXT format, but can also be returned as JSON by using the `format` parameter.
    *
    * @example Get the execution plan with analyze and verbose
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select()
    *   .explain({analyze:true,verbose:true})
    * ```
    *
    * @exampleSql Get the execution plan with analyze and verbose
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse Get the execution plan with analyze and verbose
    * ```js
    * Aggregate  (cost=33.34..33.36 rows=1 width=112) (actual time=0.041..0.041 rows=1 loops=1)
    *   Output: NULL::bigint, count(ROW(characters.id, characters.name)), COALESCE(json_agg(ROW(characters.id, characters.name)), '[]'::json), NULLIF(current_setting('response.headers'::text, true), ''::text), NULLIF(current_setting('response.status'::text, true), ''::text)
    *   ->  Limit  (cost=0.00..18.33 rows=1000 width=40) (actual time=0.005..0.006 rows=3 loops=1)
    *         Output: characters.id, characters.name
    *         ->  Seq Scan on public.characters  (cost=0.00..22.00 rows=1200 width=40) (actual time=0.004..0.005 rows=3 loops=1)
    *               Output: characters.id, characters.name
    * Query Identifier: -4730654291623321173
    * Planning Time: 0.407 ms
    * Execution Time: 0.119 ms
    * ```
    */
    explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
      var _this$headers$get;
      const options = [
        analyze ? "analyze" : null,
        verbose ? "verbose" : null,
        settings ? "settings" : null,
        buffers ? "buffers" : null,
        wal ? "wal" : null
      ].filter(Boolean).join("|");
      const forMediatype = (_this$headers$get = this.headers.get("Accept")) !== null && _this$headers$get !== void 0 ? _this$headers$get : "application/json";
      this.headers.set("Accept", `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`);
      if (format === "json") return this;
      else return this;
    }
    /**
    * Dry-run this request: execute the query but discard the changes.
    *
    * Server-side, PostgREST runs the query inside a transaction and rolls it back
    * instead of committing. The response still contains the data that *would* have
    * been returned — `RETURNING` clauses execute and RLS, triggers, and constraints
    * are all evaluated — but no row is actually inserted, updated, or deleted.
    *
    * This affects only the single request it is chained to. The JS caller has no
    * handle on the transaction: supabase-js does not group multiple queries into
    * one transaction. For multi-statement transactional logic, use a database
    * function (`supabase.rpc(...)`).
    *
    * Sets the `Prefer: tx=rollback` header. See PostgREST's docs on transaction
    * preferences for the underlying mechanism.
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @example Validate an insert without persisting
    * ```ts
    * const { data, error } = await supabase
    *   .from('countries')
    *   .insert({ name: 'France' })
    *   .select()
    *   .rollback()
    * // `data` shows what would have been inserted; nothing is saved.
    * ```
    */
    rollback() {
      this.headers.append("Prefer", "tx=rollback");
      return this;
    }
    /**
    * Override the type of the returned `data`.
    *
    * @typeParam NewResult - The new result type to override with
    * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
    *
    * @category Database
    * @subcategory Using modifiers
    *
    * @remarks
    * - Deprecated: use overrideTypes method instead
    *
    * @example Override type of successful response
    * ```ts
    * const { data } = await supabase
    *   .from('countries')
    *   .select()
    *   .returns<Array<MyType>>()
    * ```
    *
    * @exampleResponse Override type of successful response
    * ```js
    * let x: typeof data // MyType[]
    * ```
    *
    * @example Override type of object response
    * ```ts
    * const { data } = await supabase
    *   .from('countries')
    *   .select()
    *   .maybeSingle()
    *   .returns<MyType>()
    * ```
    *
    * @exampleResponse Override type of object response
    * ```js
    * let x: typeof data // MyType | null
    * ```
    */
    returns() {
      return this;
    }
    /**
    * Set the maximum number of rows that can be affected by the query.
    * Only available in PostgREST v13+ and only works with PATCH and DELETE methods.
    *
    * @param rows - The maximum number of rows that can be affected
    *
    * @category Database
    * @subcategory Using modifiers
    */
    maxAffected(rows) {
      this.headers.append("Prefer", "handling=strict");
      this.headers.append("Prefer", `max-affected=${rows}`);
      return this;
    }
  };
  var PostgrestReservedCharsRegexp = /* @__PURE__ */ new RegExp("[,()]");
  var PostgrestFilterBuilder = class extends PostgrestTransformBuilder {
    throwOnError() {
      return super.throwOnError();
    }
    /**
    * Match only rows where `column` is equal to `value`.
    *
    * To check if the value of `column` is NULL, you should use `.is()` instead.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    *
    * @category Database
    * @subcategory Using filters
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select()
    *   .eq('name', 'Leia')
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 2,
    *       "name": "Leia"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    eq(column, value) {
      this.url.searchParams.append(column, `eq.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` is not equal to `value`.
    *
    * This filter does not include rows where `column` is `NULL`. To match null
    * values, use `.is(column, null)` instead.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    *
    * @category Database
    * @subcategory Using filters
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select()
    *   .neq('name', 'Leia')
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "Luke"
    *     },
    *     {
    *       "id": 3,
    *       "name": "Han"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    neq(column, value) {
      this.url.searchParams.append(column, `neq.${value}`);
      return this;
    }
    gt(column, value) {
      this.url.searchParams.append(column, `gt.${value}`);
      return this;
    }
    gte(column, value) {
      this.url.searchParams.append(column, `gte.${value}`);
      return this;
    }
    lt(column, value) {
      this.url.searchParams.append(column, `lt.${value}`);
      return this;
    }
    lte(column, value) {
      this.url.searchParams.append(column, `lte.${value}`);
      return this;
    }
    like(column, pattern) {
      this.url.searchParams.append(column, `like.${pattern}`);
      return this;
    }
    likeAllOf(column, patterns) {
      this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
      return this;
    }
    likeAnyOf(column, patterns) {
      this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
      return this;
    }
    ilike(column, pattern) {
      this.url.searchParams.append(column, `ilike.${pattern}`);
      return this;
    }
    ilikeAllOf(column, patterns) {
      this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
      return this;
    }
    ilikeAnyOf(column, patterns) {
      this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
      return this;
    }
    regexMatch(column, pattern) {
      this.url.searchParams.append(column, `match.${pattern}`);
      return this;
    }
    regexIMatch(column, pattern) {
      this.url.searchParams.append(column, `imatch.${pattern}`);
      return this;
    }
    is(column, value) {
      this.url.searchParams.append(column, `is.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` IS DISTINCT FROM `value`.
    *
    * Unlike `.neq()`, this treats `NULL` as a comparable value. Two `NULL` values
    * are considered equal (not distinct), and comparing `NULL` with any non-NULL
    * value returns true (distinct).
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
    isDistinct(column, value) {
      this.url.searchParams.append(column, `isdistinct.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` is included in the `values` array.
    *
    * @param column - The column to filter on
    * @param values - The values array to filter with
    *
    * @category Database
    * @subcategory Using filters
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select()
    *   .in('name', ['Leia', 'Han'])
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 2,
    *       "name": "Leia"
    *     },
    *     {
    *       "id": 3,
    *       "name": "Han"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    in(column, values) {
      const cleanedValues = Array.from(new Set(values)).map((s2) => {
        if (typeof s2 === "string" && PostgrestReservedCharsRegexp.test(s2)) return `"${s2}"`;
        else return `${s2}`;
      }).join(",");
      this.url.searchParams.append(column, `in.(${cleanedValues})`);
      return this;
    }
    /**
    * Match only rows where `column` is NOT included in the `values` array.
    *
    * @param column - The column to filter on
    * @param values - The values array to filter with
    */
    notIn(column, values) {
      const cleanedValues = Array.from(new Set(values)).map((s2) => {
        if (typeof s2 === "string" && PostgrestReservedCharsRegexp.test(s2)) return `"${s2}"`;
        else return `${s2}`;
      }).join(",");
      this.url.searchParams.append(column, `not.in.(${cleanedValues})`);
      return this;
    }
    contains(column, value) {
      if (typeof value === "string") this.url.searchParams.append(column, `cs.${value}`);
      else if (Array.isArray(value)) this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
      else this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
      return this;
    }
    containedBy(column, value) {
      if (typeof value === "string") this.url.searchParams.append(column, `cd.${value}`);
      else if (Array.isArray(value)) this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
      else this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
      return this;
    }
    rangeGt(column, range) {
      this.url.searchParams.append(column, `sr.${range}`);
      return this;
    }
    rangeGte(column, range) {
      this.url.searchParams.append(column, `nxl.${range}`);
      return this;
    }
    rangeLt(column, range) {
      this.url.searchParams.append(column, `sl.${range}`);
      return this;
    }
    rangeLte(column, range) {
      this.url.searchParams.append(column, `nxr.${range}`);
      return this;
    }
    rangeAdjacent(column, range) {
      this.url.searchParams.append(column, `adj.${range}`);
      return this;
    }
    overlaps(column, value) {
      if (typeof value === "string") this.url.searchParams.append(column, `ov.${value}`);
      else this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
      return this;
    }
    textSearch(column, query, { config, type } = {}) {
      let typePart = "";
      if (type === "plain") typePart = "pl";
      else if (type === "phrase") typePart = "ph";
      else if (type === "websearch") typePart = "w";
      const configPart = config === void 0 ? "" : `(${config})`;
      this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
      return this;
    }
    match(query) {
      Object.entries(query).filter(([_2, value]) => value !== void 0).forEach(([column, value]) => {
        this.url.searchParams.append(column, `eq.${value}`);
      });
      return this;
    }
    /**
    * Match only rows which doesn't satisfy the filter.
    *
    * Unlike most filters, `opearator` and `value` are used as-is and need to
    * follow [PostgREST
    * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
    * to make sure they are properly sanitized.
    *
    * @param column - The column to filter on
    * @param operator - The operator to be negated to filter with, following
    * PostgREST syntax
    * @param value - The value to filter with, following PostgREST syntax
    *
    * @category Database
    * @subcategory Using filters
    *
    * @remarks
    * not() expects you to use the raw PostgREST syntax for the filter values.
    *
    * ```ts
    * .not('id', 'in', '(5,6,7)')  // Use `()` for `in` filter
    * .not('arraycol', 'cs', '{"a","b"}')  // Use `cs` for `contains()`, `{}` for array values
    * ```
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('countries')
    *   .select()
    *   .not('name', 'is', null)
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   countries (id int8 primary key, name text);
    *
    * insert into
    *   countries (id, name)
    * values
    *   (1, 'null'),
    *   (2, null);
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    *   {
    *     "data": [
    *       {
    *         "id": 1,
    *         "name": "null"
    *       }
    *     ],
    *     "status": 200,
    *     "statusText": "OK"
    *   }
    *
    * ```
    */
    not(column, operator, value) {
      this.url.searchParams.append(column, `not.${operator}.${value}`);
      return this;
    }
    /**
    * Match only rows which satisfy at least one of the filters.
    *
    * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
    * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
    * to make sure it's properly sanitized.
    *
    * It's currently not possible to do an `.or()` filter across multiple tables.
    *
    * @param filters - The filters to use, following PostgREST syntax
    * @param options - Named parameters
    * @param options.referencedTable - Set this to filter on referenced tables
    * instead of the parent table
    * @param options.foreignTable - Deprecated, use `referencedTable` instead
    *
    * @category Database
    * @subcategory Using filters
    *
    * @remarks
    * or() expects you to use the raw PostgREST syntax for the filter names and values.
    *
    * ```ts
    * .or('id.in.(5,6,7), arraycol.cs.{"a","b"}')  // Use `()` for `in` filter, `{}` for array values and `cs` for `contains()`.
    * .or('id.in.(5,6,7), arraycol.cd.{"a","b"}')  // Use `cd` for `containedBy()`
    * ```
    *
    * @example With `select()`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select('name')
    *   .or('id.eq.2,name.eq.Han')
    * ```
    *
    * @exampleSql With `select()`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse With `select()`
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "Leia"
    *     },
    *     {
    *       "name": "Han"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @example Use `or` with `and`
    * ```ts
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select('name')
    *   .or('id.gt.3,and(id.eq.1,name.eq.Luke)')
    * ```
    *
    * @exampleSql Use `or` with `and`
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse Use `or` with `and`
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "Luke"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @example Use `or` on referenced tables
    * ```ts
    * const { data, error } = await supabase
    *   .from('orchestral_sections')
    *   .select(`
    *     name,
    *     instruments!inner (
    *       name
    *     )
    *   `)
    *   .or('section_id.eq.1,name.eq.guzheng', { referencedTable: 'instruments' })
    * ```
    *
    * @exampleSql Use `or` on referenced tables
    * ```sql
    * create table
    *   orchestral_sections (id int8 primary key, name text);
    * create table
    *   instruments (
    *     id int8 primary key,
    *     section_id int8 not null references orchestral_sections,
    *     name text
    *   );
    *
    * insert into
    *   orchestral_sections (id, name)
    * values
    *   (1, 'strings'),
    *   (2, 'woodwinds');
    * insert into
    *   instruments (id, section_id, name)
    * values
    *   (1, 2, 'flute'),
    *   (2, 1, 'violin');
    * ```
    *
    * @exampleResponse Use `or` on referenced tables
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "strings",
    *       "instruments": [
    *         {
    *           "name": "violin"
    *         }
    *       ]
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
      const key = referencedTable ? `${referencedTable}.or` : "or";
      this.url.searchParams.append(key, `(${filters})`);
      return this;
    }
    filter(column, operator, value) {
      this.url.searchParams.append(column, `${operator}.${value}`);
      return this;
    }
  };
  var PostgrestQueryBuilder = class {
    /**
    * Creates a query builder scoped to a Postgres table or view.
    *
    * @category Database
    *
    * @param url - The URL for the query
    * @param options - Named parameters
    * @param options.headers - Custom headers
    * @param options.schema - Postgres schema to use
    * @param options.fetch - Custom fetch implementation
    * @param options.urlLengthLimit - Maximum URL length before warning
    * @param options.retry - Enable automatic retries for transient errors (default: true)
    *
    * @example Using supabase-js (recommended)
    * ```ts
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
    * const { data, error } = await supabase.from('users').select('*')
    * ```
    *
    * @example Standalone import for bundle-sensitive environments
    * ```ts
    * import { PostgrestQueryBuilder } from '@supabase/postgrest-js'
    *
    * const query = new PostgrestQueryBuilder(
    *   new URL('https://xyzcompany.supabase.co/rest/v1/users'),
    *   { headers: { apikey: 'your-publishable-key' }, retry: true }
    * )
    * ```
    */
    constructor(url, { headers = {}, schema, fetch: fetch$1, urlLengthLimit = 8e3, retry }) {
      this.url = url;
      this.headers = new Headers(headers);
      this.schema = schema;
      this.fetch = fetch$1;
      this.urlLengthLimit = urlLengthLimit;
      this.retry = retry;
    }
    /**
    * Clone URL and headers to prevent shared state between operations.
    */
    cloneRequestState() {
      return {
        url: new URL(this.url.toString()),
        headers: new Headers(this.headers)
      };
    }
    /**
    * Perform a SELECT query on the table or view.
    *
    * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
    *
    * @param options - Named parameters
    *
    * @param options.head - When set to `true`, `data` will not be returned.
    * Useful if you only need the count.
    *
    * @param options.count - Count algorithm to use to count rows in the table or view.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @remarks
    * When using `count` with `.range()` or `.limit()`, the returned `count` is the total number of rows
    * that match your filters, not the number of rows in the current page. Use this to build pagination UI.
    
    * - By default, Supabase projects return a maximum of 1,000 rows. This setting can be changed in your project's [API settings](/dashboard/project/_/settings/api). It's recommended that you keep it low to limit the payload size of accidental or malicious requests. You can use `range()` queries to paginate through your data.
    * - `select()` can be combined with [Filters](/docs/reference/javascript/using-filters)
    * - `select()` can be combined with [Modifiers](/docs/reference/javascript/using-modifiers)
    * - `apikey` is a reserved keyword if you're using the [Supabase Platform](/docs/guides/platform) and [should be avoided as a column name](https://github.com/supabase/supabase/issues/5465). *
    * @category Database
    *
    * @example Getting your data
    * ```js
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select()
    * ```
    *
    * @exampleSql Getting your data
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Harry'),
    *   (2, 'Frodo'),
    *   (3, 'Katniss');
    * ```
    *
    * @exampleResponse Getting your data
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "Harry"
    *     },
    *     {
    *       "id": 2,
    *       "name": "Frodo"
    *     },
    *     {
    *       "id": 3,
    *       "name": "Katniss"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Handling errors
    * The most useful field on a Postgres error is usually `hint` — when the database knows the fix, it puts the literal SQL there. For example, a permission-denied error (`code: '42501'`) arrives with a `hint` like `"Grant the required privileges to the current role with: GRANT SELECT ON public.characters TO anon;"`. Log the full `error` object so the hint isn't hidden behind `error.message`.
    *
    * @example Handling errors
    * ```js
    * const { data, error } = await supabase.from('characters').select()
    * if (error) {
    *   // Logs the full error: message, code, details, and hint.
    *   console.error(error)
    *   return
    * }
    * ```
    *
    * @exampleResponse Handling errors
    * ```json
    * {
    *   "error": {
    *     "code": "42501",
    *     "details": null,
    *     "hint": "Grant the required privileges to the current role with: GRANT SELECT ON public.characters TO anon;",
    *     "message": "permission denied for table characters"
    *   },
    *   "status": 401,
    *   "statusText": "Unauthorized"
    * }
    * ```
    *
    * @example Selecting specific columns
    * ```js
    * const { data, error } = await supabase
    *   .from('characters')
    *   .select('name')
    * ```
    *
    * @exampleSql Selecting specific columns
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Frodo'),
    *   (2, 'Harry'),
    *   (3, 'Katniss');
    * ```
    *
    * @exampleResponse Selecting specific columns
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "Frodo"
    *     },
    *     {
    *       "name": "Harry"
    *     },
    *     {
    *       "name": "Katniss"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Query referenced tables
    * If your database has foreign key relationships, you can query related tables too.
    *
    * @example Query referenced tables
    * ```js
    * const { data, error } = await supabase
    *   .from('orchestral_sections')
    *   .select(`
    *     name,
    *     instruments (
    *       name
    *     )
    *   `)
    * ```
    *
    * @exampleSql Query referenced tables
    * ```sql
    * create table
    *   orchestral_sections (id int8 primary key, name text);
    * create table
    *   instruments (
    *     id int8 primary key,
    *     section_id int8 not null references orchestral_sections,
    *     name text
    *   );
    *
    * insert into
    *   orchestral_sections (id, name)
    * values
    *   (1, 'strings'),
    *   (2, 'woodwinds');
    * insert into
    *   instruments (id, section_id, name)
    * values
    *   (1, 2, 'flute'),
    *   (2, 1, 'violin');
    * ```
    *
    * @exampleResponse Query referenced tables
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "strings",
    *       "instruments": [
    *         {
    *           "name": "violin"
    *         }
    *       ]
    *     },
    *     {
    *       "name": "woodwinds",
    *       "instruments": [
    *         {
    *           "name": "flute"
    *         }
    *       ]
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Query referenced tables with spaces in their names
    * If your table name contains spaces, you must use double quotes in the `select` statement to reference the table.
    *
    * @example Query referenced tables with spaces in their names
    * ```js
    * const { data, error } = await supabase
    *   .from('orchestral sections')
    *   .select(`
    *     name,
    *     "musical instruments" (
    *       name
    *     )
    *   `)
    * ```
    *
    * @exampleSql Query referenced tables with spaces in their names
    * ```sql
    * create table
    *   "orchestral sections" (id int8 primary key, name text);
    * create table
    *   "musical instruments" (
    *     id int8 primary key,
    *     section_id int8 not null references "orchestral sections",
    *     name text
    *   );
    *
    * insert into
    *   "orchestral sections" (id, name)
    * values
    *   (1, 'strings'),
    *   (2, 'woodwinds');
    * insert into
    *   "musical instruments" (id, section_id, name)
    * values
    *   (1, 2, 'flute'),
    *   (2, 1, 'violin');
    * ```
    *
    * @exampleResponse Query referenced tables with spaces in their names
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "strings",
    *       "musical instruments": [
    *         {
    *           "name": "violin"
    *         }
    *       ]
    *     },
    *     {
    *       "name": "woodwinds",
    *       "musical instruments": [
    *         {
    *           "name": "flute"
    *         }
    *       ]
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Query referenced tables through a join table
    * If you're in a situation where your tables are **NOT** directly
    * related, but instead are joined by a _join table_, you can still use
    * the `select()` method to query the related data. The join table needs
    * to have the foreign keys as part of its composite primary key.
    *
    * @example Query referenced tables through a join table
    * ```ts
    * const { data, error } = await supabase
    *   .from('users')
    *   .select(`
    *     name,
    *     teams (
    *       name
    *     )
    *   `)
    *   
    * ```
    *
    * @exampleSql Query referenced tables through a join table
    * ```sql
    * create table
    *   users (
    *     id int8 primary key,
    *     name text
    *   );
    * create table
    *   teams (
    *     id int8 primary key,
    *     name text
    *   );
    * -- join table
    * create table
    *   users_teams (
    *     user_id int8 not null references users,
    *     team_id int8 not null references teams,
    *     -- both foreign keys must be part of a composite primary key
    *     primary key (user_id, team_id)
    *   );
    *
    * insert into
    *   users (id, name)
    * values
    *   (1, 'Kiran'),
    *   (2, 'Evan');
    * insert into
    *   teams (id, name)
    * values
    *   (1, 'Green'),
    *   (2, 'Blue');
    * insert into
    *   users_teams (user_id, team_id)
    * values
    *   (1, 1),
    *   (1, 2),
    *   (2, 2);
    * ```
    *
    * @exampleResponse Query referenced tables through a join table
    * ```json
    *   {
    *     "data": [
    *       {
    *         "name": "Kiran",
    *         "teams": [
    *           {
    *             "name": "Green"
    *           },
    *           {
    *             "name": "Blue"
    *           }
    *         ]
    *       },
    *       {
    *         "name": "Evan",
    *         "teams": [
    *           {
    *             "name": "Blue"
    *           }
    *         ]
    *       }
    *     ],
    *     "status": 200,
    *     "statusText": "OK"
    *   }
    *   
    * ```
    *
    * @exampleDescription Query the same referenced table multiple times
    * If you need to query the same referenced table twice, use the name of the
    * joined column to identify which join to use. You can also give each
    * column an alias.
    *
    * @example Query the same referenced table multiple times
    * ```ts
    * const { data, error } = await supabase
    *   .from('messages')
    *   .select(`
    *     content,
    *     from:sender_id(name),
    *     to:receiver_id(name)
    *   `)
    *
    * // To infer types, use the name of the table (in this case `users`) and
    * // the name of the foreign key constraint.
    * const { data, error } = await supabase
    *   .from('messages')
    *   .select(`
    *     content,
    *     from:users!messages_sender_id_fkey(name),
    *     to:users!messages_receiver_id_fkey(name)
    *   `)
    * ```
    *
    * @exampleSql Query the same referenced table multiple times
    * ```sql
    *  create table
    *  users (id int8 primary key, name text);
    *
    *  create table
    *    messages (
    *      sender_id int8 not null references users,
    *      receiver_id int8 not null references users,
    *      content text
    *    );
    *
    *  insert into
    *    users (id, name)
    *  values
    *    (1, 'Kiran'),
    *    (2, 'Evan');
    *
    *  insert into
    *    messages (sender_id, receiver_id, content)
    *  values
    *    (1, 2, '👋');
    *  ```
    * ```
    *
    * @exampleResponse Query the same referenced table multiple times
    * ```json
    * {
    *   "data": [
    *     {
    *       "content": "👋",
    *       "from": {
    *         "name": "Kiran"
    *       },
    *       "to": {
    *         "name": "Evan"
    *       }
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Query nested foreign tables through a join table
    * You can use the result of a joined table to gather data in
    * another foreign table. With multiple references to the same foreign
    * table you must specify the column on which to conduct the join.
    *
    * @example Query nested foreign tables through a join table
    * ```ts
    *   const { data, error } = await supabase
    *     .from('games')
    *     .select(`
    *       game_id:id,
    *       away_team:teams!games_away_team_fkey (
    *         users (
    *           id,
    *           name
    *         )
    *       )
    *     `)
    *   
    * ```
    *
    * @exampleSql Query nested foreign tables through a join table
    * ```sql
    * ```sql
    * create table
    *   users (
    *     id int8 primary key,
    *     name text
    *   );
    * create table
    *   teams (
    *     id int8 primary key,
    *     name text
    *   );
    * -- join table
    * create table
    *   users_teams (
    *     user_id int8 not null references users,
    *     team_id int8 not null references teams,
    *
    *     primary key (user_id, team_id)
    *   );
    * create table
    *   games (
    *     id int8 primary key,
    *     home_team int8 not null references teams,
    *     away_team int8 not null references teams,
    *     name text
    *   );
    *
    * insert into users (id, name)
    * values
    *   (1, 'Kiran'),
    *   (2, 'Evan');
    * insert into
    *   teams (id, name)
    * values
    *   (1, 'Green'),
    *   (2, 'Blue');
    * insert into
    *   users_teams (user_id, team_id)
    * values
    *   (1, 1),
    *   (1, 2),
    *   (2, 2);
    * insert into
    *   games (id, home_team, away_team, name)
    * values
    *   (1, 1, 2, 'Green vs Blue'),
    *   (2, 2, 1, 'Blue vs Green');
    * ```
    *
    * @exampleResponse Query nested foreign tables through a join table
    * ```json
    *   {
    *     "data": [
    *       {
    *         "game_id": 1,
    *         "away_team": {
    *           "users": [
    *             {
    *               "id": 1,
    *               "name": "Kiran"
    *             },
    *             {
    *               "id": 2,
    *               "name": "Evan"
    *             }
    *           ]
    *         }
    *       },
    *       {
    *         "game_id": 2,
    *         "away_team": {
    *           "users": [
    *             {
    *               "id": 1,
    *               "name": "Kiran"
    *             }
    *           ]
    *         }
    *       }
    *     ],
    *     "status": 200,
    *     "statusText": "OK"
    *   }
    *   
    * ```
    *
    * @exampleDescription Filtering through referenced tables
    * If the filter on a referenced table's column is not satisfied, the referenced
    * table returns `[]` or `null` but the parent table is not filtered out.
    * If you want to filter out the parent table rows, use the `!inner` hint
    *
    * @example Filtering through referenced tables
    * ```ts
    * const { data, error } = await supabase
    *   .from('instruments')
    *   .select('name, orchestral_sections(*)')
    *   .eq('orchestral_sections.name', 'percussion')
    * ```
    *
    * @exampleSql Filtering through referenced tables
    * ```sql
    * create table
    *   orchestral_sections (id int8 primary key, name text);
    * create table
    *   instruments (
    *     id int8 primary key,
    *     section_id int8 not null references orchestral_sections,
    *     name text
    *   );
    *
    * insert into
    *   orchestral_sections (id, name)
    * values
    *   (1, 'strings'),
    *   (2, 'woodwinds');
    * insert into
    *   instruments (id, section_id, name)
    * values
    *   (1, 2, 'flute'),
    *   (2, 1, 'violin');
    * ```
    *
    * @exampleResponse Filtering through referenced tables
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "flute",
    *       "orchestral_sections": null
    *     },
    *     {
    *       "name": "violin",
    *       "orchestral_sections": null
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Querying referenced table with count
    * You can get the number of rows in a related table by using the
    * **count** property.
    *
    * @example Querying referenced table with count
    * ```ts
    * const { data, error } = await supabase
    *   .from('orchestral_sections')
    *   .select(`*, instruments(count)`)
    * ```
    *
    * @exampleSql Querying referenced table with count
    * ```sql
    * create table orchestral_sections (
    *   "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
    *   "name" text
    * );
    *
    * create table characters (
    *   "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
    *   "name" text,
    *   "section_id" "uuid" references public.orchestral_sections on delete cascade
    * );
    *
    * with section as (
    *   insert into orchestral_sections (name)
    *   values ('strings') returning id
    * )
    * insert into instruments (name, section_id) values
    * ('violin', (select id from section)),
    * ('viola', (select id from section)),
    * ('cello', (select id from section)),
    * ('double bass', (select id from section));
    * ```
    *
    * @exampleResponse Querying referenced table with count
    * ```json
    * [
    *   {
    *     "id": "693694e7-d993-4360-a6d7-6294e325d9b6",
    *     "name": "strings",
    *     "instruments": [
    *       {
    *         "count": 4
    *       }
    *     ]
    *   }
    * ]
    * ```
    *
    * @exampleDescription Querying with count option
    * You can get the number of rows by using the
    * [count](/docs/reference/javascript/select#parameters) option.
    *
    * @example Querying with count option
    * ```ts
    * const { count, error } = await supabase
    *   .from('characters')
    *   .select('*', { count: 'exact', head: true })
    * ```
    *
    * @exampleSql Querying with count option
    * ```sql
    * create table
    *   characters (id int8 primary key, name text);
    *
    * insert into
    *   characters (id, name)
    * values
    *   (1, 'Luke'),
    *   (2, 'Leia'),
    *   (3, 'Han');
    * ```
    *
    * @exampleResponse Querying with count option
    * ```json
    * {
    *   "count": 3,
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Querying JSON data
    * You can select and filter data inside of
    * [JSON](/docs/guides/database/json) columns. Postgres offers some
    * [operators](/docs/guides/database/json#query-the-jsonb-data) for
    * querying JSON data.
    *
    * @example Querying JSON data
    * ```ts
    * const { data, error } = await supabase
    *   .from('users')
    *   .select(`
    *     id, name,
    *     address->city
    *   `)
    * ```
    *
    * @exampleSql Querying JSON data
    * ```sql
    * create table
    *   users (
    *     id int8 primary key,
    *     name text,
    *     address jsonb
    *   );
    *
    * insert into
    *   users (id, name, address)
    * values
    *   (1, 'Frodo', '{"city":"Hobbiton"}');
    * ```
    *
    * @exampleResponse Querying JSON data
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "Frodo",
    *       "city": "Hobbiton"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Querying referenced table with inner join
    * If you don't want to return the referenced table contents, you can leave the parenthesis empty.
    * Like `.select('name, orchestral_sections!inner()')`.
    *
    * @example Querying referenced table with inner join
    * ```ts
    * const { data, error } = await supabase
    *   .from('instruments')
    *   .select('name, orchestral_sections!inner(name)')
    *   .eq('orchestral_sections.name', 'woodwinds')
    *   .limit(1)
    * ```
    *
    * @exampleSql Querying referenced table with inner join
    * ```sql
    * create table orchestral_sections (
    *   "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
    *   "name" text
    * );
    *
    * create table instruments (
    *   "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
    *   "name" text,
    *   "section_id" "uuid" references public.orchestral_sections on delete cascade
    * );
    *
    * with section as (
    *   insert into orchestral_sections (name)
    *   values ('woodwinds') returning id
    * )
    * insert into instruments (name, section_id) values
    * ('flute', (select id from section)),
    * ('clarinet', (select id from section)),
    * ('bassoon', (select id from section)),
    * ('piccolo', (select id from section));
    * ```
    *
    * @exampleResponse Querying referenced table with inner join
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "flute",
    *       "orchestral_sections": {"name": "woodwinds"}
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Switching schemas per query
    * In addition to setting the schema during initialization, you can also switch schemas on a per-query basis.
    * Make sure you've set up your [database privileges and API settings](/docs/guides/api/using-custom-schemas).
    *
    * @example Switching schemas per query
    * ```ts
    * const { data, error } = await supabase
    *   .schema('myschema')
    *   .from('mytable')
    *   .select()
    * ```
    *
    * @exampleSql Switching schemas per query
    * ```sql
    * create schema myschema;
    *
    * create table myschema.mytable (
    *   id uuid primary key default gen_random_uuid(),
    *   data text
    * );
    *
    * insert into myschema.mytable (data) values ('mydata');
    * ```
    *
    * @exampleResponse Switching schemas per query
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": "4162e008-27b0-4c0f-82dc-ccaeee9a624d",
    *       "data": "mydata"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    select(columns, options) {
      const { head: head2 = false, count } = options !== null && options !== void 0 ? options : {};
      const method = head2 ? "HEAD" : "GET";
      let quoted = false;
      const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c2) => {
        if (/\s/.test(c2) && !quoted) return "";
        if (c2 === '"') quoted = !quoted;
        return c2;
      }).join("");
      const { url, headers } = this.cloneRequestState();
      url.searchParams.set("select", cleanedColumns);
      if (count) headers.append("Prefer", `count=${count}`);
      return new PostgrestFilterBuilder({
        method,
        url,
        headers,
        schema: this.schema,
        fetch: this.fetch,
        urlLengthLimit: this.urlLengthLimit,
        retry: this.retry
      });
    }
    /**
    * Perform an INSERT into the table or view.
    *
    * By default, inserted rows are not returned. To return it, chain the call
    * with `.select()`.
    *
    * @param values - The values to insert. Pass an object to insert a single row
    * or an array to insert multiple rows.
    *
    * @param options - Named parameters
    *
    * @param options.count - Count algorithm to use to count inserted rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @param options.defaultToNull - Make missing fields default to `null`.
    * Otherwise, use the default value for the column. Only applies for bulk
    * inserts.
    *
    * @category Database
    *
    * @example Create a record
    * ```ts
    * const { error } = await supabase
    *   .from('countries')
    *   .insert({ id: 1, name: 'Mordor' })
    * ```
    *
    * @exampleSql Create a record
    * ```sql
    * create table
    *   countries (id int8 primary key, name text);
    * ```
    *
    * @exampleResponse Create a record
    * ```json
    * {
    *   "status": 201,
    *   "statusText": "Created"
    * }
    * ```
    *
    * @exampleDescription Handling errors
    * `error.hint` from Postgres often contains the actionable fix (e.g. `"Grant the required privileges to the current role with: GRANT INSERT ON public.countries TO anon;"` for a `42501` permission-denied error). Log the full `error` object so it isn't hidden behind `error.message`.
    *
    * @example Handling errors
    * ```js
    * const { error } = await supabase.from('countries').insert({ id: 1, name: 'Mordor' })
    * if (error) console.error(error)
    * ```
    *
    * @example Create a record and return it
    * ```ts
    * const { data, error } = await supabase
    *   .from('countries')
    *   .insert({ id: 1, name: 'Mordor' })
    *   .select()
    * ```
    *
    * @exampleSql Create a record and return it
    * ```sql
    * create table
    *   countries (id int8 primary key, name text);
    * ```
    *
    * @exampleResponse Create a record and return it
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "Mordor"
    *     }
    *   ],
    *   "status": 201,
    *   "statusText": "Created"
    * }
    * ```
    *
    * @exampleDescription Bulk create
    * A bulk create operation is handled in a single transaction.
    * If any of the inserts fail, none of the rows are inserted.
    *
    * @example Bulk create
    * ```ts
    * const { error } = await supabase
    *   .from('countries')
    *   .insert([
    *     { id: 1, name: 'Mordor' },
    *     { id: 1, name: 'The Shire' },
    *   ])
    * ```
    *
    * @exampleSql Bulk create
    * ```sql
    * create table
    *   countries (id int8 primary key, name text);
    * ```
    *
    * @exampleResponse Bulk create
    * ```json
    * {
    *   "error": {
    *     "code": "23505",
    *     "details": "Key (id)=(1) already exists.",
    *     "hint": null,
    *     "message": "duplicate key value violates unique constraint \"countries_pkey\""
    *   },
    *   "status": 409,
    *   "statusText": "Conflict"
    * }
    * ```
    */
    insert(values, { count, defaultToNull = true } = {}) {
      var _this$fetch;
      const method = "POST";
      const { url, headers } = this.cloneRequestState();
      if (count) headers.append("Prefer", `count=${count}`);
      if (!defaultToNull) headers.append("Prefer", `missing=default`);
      if (Array.isArray(values)) {
        const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
        if (columns.length > 0) {
          const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
          url.searchParams.set("columns", uniqueColumns.join(","));
        }
      }
      return new PostgrestFilterBuilder({
        method,
        url,
        headers,
        schema: this.schema,
        body: values,
        fetch: (_this$fetch = this.fetch) !== null && _this$fetch !== void 0 ? _this$fetch : fetch,
        urlLengthLimit: this.urlLengthLimit,
        retry: this.retry
      });
    }
    /**
    * Perform an UPSERT on the table or view. Depending on the column(s) passed
    * to `onConflict`, `.upsert()` allows you to perform the equivalent of
    * `.insert()` if a row with the corresponding `onConflict` columns doesn't
    * exist, or if it does exist, perform an alternative action depending on
    * `ignoreDuplicates`.
    *
    * By default, upserted rows are not returned. To return it, chain the call
    * with `.select()`.
    *
    * @param values - The values to upsert with. Pass an object to upsert a
    * single row or an array to upsert multiple rows.
    *
    * @param options - Named parameters
    *
    * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
    * duplicate rows are determined. Two rows are duplicates if all the
    * `onConflict` columns are equal.
    *
    * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
    * `false`, duplicate rows are merged with existing rows.
    *
    * @param options.count - Count algorithm to use to count upserted rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @param options.defaultToNull - Make missing fields default to `null`.
    * Otherwise, use the default value for the column. This only applies when
    * inserting new rows, not when merging with existing rows under
    * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
    *
    * @example Upsert a single row using a unique key
    * ```ts
    * // Upserting a single row, overwriting based on the 'username' unique column
    * const { data, error } = await supabase
    *   .from('users')
    *   .upsert({ username: 'supabot' }, { onConflict: 'username' })
    *
    * // Example response:
    * // {
    * //   data: [
    * //     { id: 4, message: 'bar', username: 'supabot' }
    * //   ],
    * //   error: null
    * // }
    * ```
    *
    * @example Upsert with conflict resolution and exact row counting
    * ```ts
    * // Upserting and returning exact count
    * const { data, error, count } = await supabase
    *   .from('users')
    *   .upsert(
    *     {
    *       id: 3,
    *       message: 'foo',
    *       username: 'supabot'
    *     },
    *     {
    *       onConflict: 'username',
    *       count: 'exact'
    *     }
    *   )
    *
    * // Example response:
    * // {
    * //   data: [
    * //     {
    * //       id: 42,
    * //       handle: "saoirse",
    * //       display_name: "Saoirse"
    * //     }
    * //   ],
    * //   count: 1,
    * //   error: null
    * // }
    * ```
    *
    * @category Database
    *
    * @remarks
    * - Primary keys must be included in `values` to use upsert.
    *
    * @example Upsert your data
    * ```ts
    * const { data, error } = await supabase
    *   .from('instruments')
    *   .upsert({ id: 1, name: 'piano' })
    *   .select()
    * ```
    *
    * @exampleSql Upsert your data
    * ```sql
    * create table
    *   instruments (id int8 primary key, name text);
    *
    * insert into
    *   instruments (id, name)
    * values
    *   (1, 'harpsichord');
    * ```
    *
    * @exampleResponse Upsert your data
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "piano"
    *     }
    *   ],
    *   "status": 201,
    *   "statusText": "Created"
    * }
    * ```
    *
    * @exampleDescription Handling errors
    * `error.hint` from Postgres often contains the actionable fix (e.g. `"Grant the required privileges to the current role with: GRANT INSERT, UPDATE ON public.instruments TO anon;"` for a `42501` permission-denied error). Log the full `error` object so it isn't hidden behind `error.message`.
    *
    * @example Handling errors
    * ```js
    * const { data, error } = await supabase.from('instruments').upsert({ id: 1, name: 'piano' }).select()
    * if (error) console.error(error)
    * ```
    *
    * @example Bulk Upsert your data
    * ```ts
    * const { data, error } = await supabase
    *   .from('instruments')
    *   .upsert([
    *     { id: 1, name: 'piano' },
    *     { id: 2, name: 'harp' },
    *   ])
    *   .select()
    * ```
    *
    * @exampleSql Bulk Upsert your data
    * ```sql
    * create table
    *   instruments (id int8 primary key, name text);
    *
    * insert into
    *   instruments (id, name)
    * values
    *   (1, 'harpsichord');
    * ```
    *
    * @exampleResponse Bulk Upsert your data
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "piano"
    *     },
    *     {
    *       "id": 2,
    *       "name": "harp"
    *     }
    *   ],
    *   "status": 201,
    *   "statusText": "Created"
    * }
    * ```
    *
    * @exampleDescription Upserting into tables with constraints
    * In the following query, `upsert()` implicitly uses the `id`
    * (primary key) column to determine conflicts. If there is no existing
    * row with the same `id`, `upsert()` inserts a new row, which
    * will fail in this case as there is already a row with `handle` `"saoirse"`.
    * Using the `onConflict` option, you can instruct `upsert()` to use
    * another column with a unique constraint to determine conflicts.
    *
    * @example Upserting into tables with constraints
    * ```ts
    * const { data, error } = await supabase
    *   .from('users')
    *   .upsert({ id: 42, handle: 'saoirse', display_name: 'Saoirse' })
    *   .select()
    * ```
    *
    * @exampleSql Upserting into tables with constraints
    * ```sql
    * create table
    *   users (
    *     id int8 generated by default as identity primary key,
    *     handle text not null unique,
    *     display_name text
    *   );
    *
    * insert into
    *   users (id, handle, display_name)
    * values
    *   (1, 'saoirse', null);
    * ```
    *
    * @exampleResponse Upserting into tables with constraints
    * ```json
    * {
    *   "error": {
    *     "code": "23505",
    *     "details": "Key (handle)=(saoirse) already exists.",
    *     "hint": null,
    *     "message": "duplicate key value violates unique constraint \"users_handle_key\""
    *   },
    *   "status": 409,
    *   "statusText": "Conflict"
    * }
    * ```
    */
    upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
      var _this$fetch2;
      const method = "POST";
      const { url, headers } = this.cloneRequestState();
      headers.append("Prefer", `resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`);
      if (onConflict !== void 0) url.searchParams.set("on_conflict", onConflict);
      if (count) headers.append("Prefer", `count=${count}`);
      if (!defaultToNull) headers.append("Prefer", "missing=default");
      if (Array.isArray(values)) {
        const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
        if (columns.length > 0) {
          const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
          url.searchParams.set("columns", uniqueColumns.join(","));
        }
      }
      return new PostgrestFilterBuilder({
        method,
        url,
        headers,
        schema: this.schema,
        body: values,
        fetch: (_this$fetch2 = this.fetch) !== null && _this$fetch2 !== void 0 ? _this$fetch2 : fetch,
        urlLengthLimit: this.urlLengthLimit,
        retry: this.retry
      });
    }
    /**
    * Perform an UPDATE on the table or view.
    *
    * By default, updated rows are not returned. To return it, chain the call
    * with `.select()` after filters.
    *
    * @param values - The values to update with
    *
    * @param options - Named parameters
    *
    * @param options.count - Count algorithm to use to count updated rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @category Database
    *
    * @remarks
    * - `update()` should always be combined with [Filters](/docs/reference/javascript/using-filters) to target the item(s) you wish to update.
    *
    * @example Updating your data
    * ```ts
    * const { error } = await supabase
    *   .from('instruments')
    *   .update({ name: 'piano' })
    *   .eq('id', 1)
    * ```
    *
    * @exampleSql Updating your data
    * ```sql
    * create table
    *   instruments (id int8 primary key, name text);
    *
    * insert into
    *   instruments (id, name)
    * values
    *   (1, 'harpsichord');
    * ```
    *
    * @exampleResponse Updating your data
    * ```json
    * {
    *   "status": 204,
    *   "statusText": "No Content"
    * }
    * ```
    *
    * @exampleDescription Handling errors
    * `error.hint` from Postgres often contains the actionable fix (e.g. `"Grant the required privileges to the current role with: GRANT UPDATE ON public.instruments TO anon;"` for a `42501` permission-denied error). Log the full `error` object so it isn't hidden behind `error.message`.
    *
    * @example Handling errors
    * ```js
    * const { error } = await supabase.from('instruments').update({ name: 'piano' }).eq('id', 1)
    * if (error) console.error(error)
    * ```
    *
    * @example Update a record and return it
    * ```ts
    * const { data, error } = await supabase
    *   .from('instruments')
    *   .update({ name: 'piano' })
    *   .eq('id', 1)
    *   .select()
    * ```
    *
    * @exampleSql Update a record and return it
    * ```sql
    * create table
    *   instruments (id int8 primary key, name text);
    *
    * insert into
    *   instruments (id, name)
    * values
    *   (1, 'harpsichord');
    * ```
    *
    * @exampleResponse Update a record and return it
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "piano"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Updating JSON data
    * Postgres offers some
    * [operators](/docs/guides/database/json#query-the-jsonb-data) for
    * working with JSON data. Currently, it is only possible to update the entire JSON document.
    *
    * @example Updating JSON data
    * ```ts
    * const { data, error } = await supabase
    *   .from('users')
    *   .update({
    *     address: {
    *       street: 'Melrose Place',
    *       postcode: 90210
    *     }
    *   })
    *   .eq('address->postcode', 90210)
    *   .select()
    * ```
    *
    * @exampleSql Updating JSON data
    * ```sql
    * create table
    *   users (
    *     id int8 primary key,
    *     name text,
    *     address jsonb
    *   );
    *
    * insert into
    *   users (id, name, address)
    * values
    *   (1, 'Michael', '{ "postcode": 90210 }');
    * ```
    *
    * @exampleResponse Updating JSON data
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "Michael",
    *       "address": {
    *         "street": "Melrose Place",
    *         "postcode": 90210
    *       }
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    update(values, { count } = {}) {
      var _this$fetch3;
      const method = "PATCH";
      const { url, headers } = this.cloneRequestState();
      if (count) headers.append("Prefer", `count=${count}`);
      return new PostgrestFilterBuilder({
        method,
        url,
        headers,
        schema: this.schema,
        body: values,
        fetch: (_this$fetch3 = this.fetch) !== null && _this$fetch3 !== void 0 ? _this$fetch3 : fetch,
        urlLengthLimit: this.urlLengthLimit,
        retry: this.retry
      });
    }
    /**
    * Perform a DELETE on the table or view.
    *
    * By default, deleted rows are not returned. To return it, chain the call
    * with `.select()` after filters.
    *
    * @param options - Named parameters
    *
    * @param options.count - Count algorithm to use to count deleted rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @category Database
    *
    * @remarks
    * - `delete()` should always be combined with [filters](/docs/reference/javascript/using-filters) to target the item(s) you wish to delete.
    * - If you use `delete()` with filters and you have
    *   [RLS](/docs/learn/auth-deep-dive/auth-row-level-security) enabled, only
    *   rows visible through `SELECT` policies are deleted. Note that by default
    *   no rows are visible, so you need at least one `SELECT`/`ALL` policy that
    *   makes the rows visible.
    * - When using `delete().in()`, specify an array of values to target multiple rows with a single query. This is particularly useful for batch deleting entries that share common criteria, such as deleting users by their IDs. Ensure that the array you provide accurately represents all records you intend to delete to avoid unintended data removal.
    *
    * @example Delete a single record
    * ```ts
    * const response = await supabase
    *   .from('countries')
    *   .delete()
    *   .eq('id', 1)
    * ```
    *
    * @exampleSql Delete a single record
    * ```sql
    * create table
    *   countries (id int8 primary key, name text);
    *
    * insert into
    *   countries (id, name)
    * values
    *   (1, 'Mordor');
    * ```
    *
    * @exampleResponse Delete a single record
    * ```json
    * {
    *   "status": 204,
    *   "statusText": "No Content"
    * }
    * ```
    *
    * @exampleDescription Handling errors
    * `error.hint` from Postgres often contains the actionable fix (e.g. `"Grant the required privileges to the current role with: GRANT DELETE ON public.countries TO anon;"` for a `42501` permission-denied error). Log the full `error` object so it isn't hidden behind `error.message`.
    *
    * @example Handling errors
    * ```js
    * const { error } = await supabase.from('countries').delete().eq('id', 1)
    * if (error) console.error(error)
    * ```
    *
    * @example Delete a record and return it
    * ```ts
    * const { data, error } = await supabase
    *   .from('countries')
    *   .delete()
    *   .eq('id', 1)
    *   .select()
    * ```
    *
    * @exampleSql Delete a record and return it
    * ```sql
    * create table
    *   countries (id int8 primary key, name text);
    *
    * insert into
    *   countries (id, name)
    * values
    *   (1, 'Mordor');
    * ```
    *
    * @exampleResponse Delete a record and return it
    * ```json
    * {
    *   "data": [
    *     {
    *       "id": 1,
    *       "name": "Mordor"
    *     }
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @example Delete multiple records
    * ```ts
    * const response = await supabase
    *   .from('countries')
    *   .delete()
    *   .in('id', [1, 2, 3])
    * ```
    *
    * @exampleSql Delete multiple records
    * ```sql
    * create table
    *   countries (id int8 primary key, name text);
    *
    * insert into
    *   countries (id, name)
    * values
    *   (1, 'Rohan'), (2, 'The Shire'), (3, 'Mordor');
    * ```
    *
    * @exampleResponse Delete multiple records
    * ```json
    * {
    *   "status": 204,
    *   "statusText": "No Content"
    * }
    * ```
    */
    delete({ count } = {}) {
      var _this$fetch4;
      const method = "DELETE";
      const { url, headers } = this.cloneRequestState();
      if (count) headers.append("Prefer", `count=${count}`);
      return new PostgrestFilterBuilder({
        method,
        url,
        headers,
        schema: this.schema,
        fetch: (_this$fetch4 = this.fetch) !== null && _this$fetch4 !== void 0 ? _this$fetch4 : fetch,
        urlLengthLimit: this.urlLengthLimit,
        retry: this.retry
      });
    }
  };
  function _typeof(o2) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
      return typeof o$1;
    } : function(o$1) {
      return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
    }, _typeof(o2);
  }
  function toPrimitive(t2, r2) {
    if ("object" != _typeof(t2) || !t2) return t2;
    var e3 = t2[Symbol.toPrimitive];
    if (void 0 !== e3) {
      var i2 = e3.call(t2, r2 || "default");
      if ("object" != _typeof(i2)) return i2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function toPropertyKey(t2) {
    var i2 = toPrimitive(t2, "string");
    return "symbol" == _typeof(i2) ? i2 : i2 + "";
  }
  function _defineProperty(e3, r2, t2) {
    return (r2 = toPropertyKey(r2)) in e3 ? Object.defineProperty(e3, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e3[r2] = t2, e3;
  }
  function ownKeys(e3, r2) {
    var t2 = Object.keys(e3);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e3);
      r2 && (o2 = o2.filter(function(r$1) {
        return Object.getOwnPropertyDescriptor(e3, r$1).enumerable;
      })), t2.push.apply(t2, o2);
    }
    return t2;
  }
  function _objectSpread2(e3) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys(Object(t2), true).forEach(function(r$1) {
        _defineProperty(e3, r$1, t2[r$1]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r$1) {
        Object.defineProperty(e3, r$1, Object.getOwnPropertyDescriptor(t2, r$1));
      });
    }
    return e3;
  }
  var PostgrestClient = class PostgrestClient2 {
    /**
    * Creates a PostgREST client.
    *
    * @param url - URL of the PostgREST endpoint
    * @param options - Named parameters
    * @param options.headers - Custom headers
    * @param options.schema - Postgres schema to switch to
    * @param options.fetch - Custom fetch
    * @param options.timeout - Optional timeout in milliseconds for all requests. When set, requests will automatically abort after this duration to prevent indefinite hangs.
    * @param options.urlLengthLimit - Maximum URL length in characters before warnings/errors are triggered. Defaults to 8000.
    * @param options.retry - Enable or disable automatic retries for transient errors.
    *   When enabled, idempotent requests (GET, HEAD, OPTIONS) that fail with network
    *   errors or HTTP 503/520 responses will be automatically retried up to 3 times
    *   with exponential backoff (1s, 2s, 4s). Defaults to `true`.
    * @example Using supabase-js (recommended)
    * ```ts
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
    * const { data, error } = await supabase.from('profiles').select('*')
    * ```
    *
    * @category Database
    *
    * @remarks
    * - A `timeout` option (in milliseconds) can be set to automatically abort requests that take too long.
    * - A `urlLengthLimit` option (default: 8000) can be set to control when URL length warnings are included in error messages for aborted requests.
    *
    * @example Standalone import for bundle-sensitive environments
    * ```ts
    * import { PostgrestClient } from '@supabase/postgrest-js'
    *
    * const postgrest = new PostgrestClient('https://xyzcompany.supabase.co/rest/v1', {
    *   headers: { apikey: 'your-publishable-key' },
    *   schema: 'public',
    *   timeout: 30000, // 30 second timeout
    * })
    * ```
    */
    constructor(url, { headers = {}, schema, fetch: fetch$1, timeout, urlLengthLimit = 8e3, retry } = {}) {
      this.url = url;
      this.headers = new Headers(headers);
      this.schemaName = schema;
      this.urlLengthLimit = urlLengthLimit;
      const originalFetch = fetch$1 !== null && fetch$1 !== void 0 ? fetch$1 : globalThis.fetch;
      if (timeout !== void 0 && timeout > 0) this.fetch = (input, init) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const existingSignal = init === null || init === void 0 ? void 0 : init.signal;
        if (existingSignal) {
          if (existingSignal.aborted) {
            clearTimeout(timeoutId);
            return originalFetch(input, init);
          }
          const abortHandler = () => {
            clearTimeout(timeoutId);
            controller.abort();
          };
          existingSignal.addEventListener("abort", abortHandler, { once: true });
          return originalFetch(input, _objectSpread2(_objectSpread2({}, init), {}, { signal: controller.signal })).finally(() => {
            clearTimeout(timeoutId);
            existingSignal.removeEventListener("abort", abortHandler);
          });
        }
        return originalFetch(input, _objectSpread2(_objectSpread2({}, init), {}, { signal: controller.signal })).finally(() => clearTimeout(timeoutId));
      };
      else this.fetch = originalFetch;
      this.retry = retry;
    }
    from(relation) {
      if (!relation || typeof relation !== "string" || relation.trim() === "") throw new Error("Invalid relation name: relation must be a non-empty string.");
      return new PostgrestQueryBuilder(new URL(`${this.url}/${relation}`), {
        headers: new Headers(this.headers),
        schema: this.schemaName,
        fetch: this.fetch,
        urlLengthLimit: this.urlLengthLimit,
        retry: this.retry
      });
    }
    /**
    * Select a schema to query or perform an function (rpc) call.
    *
    * The schema needs to be on the list of exposed schemas inside Supabase.
    *
    * @param schema - The schema to query
    *
    * @category Database
    */
    schema(schema) {
      return new PostgrestClient2(this.url, {
        headers: this.headers,
        schema,
        fetch: this.fetch,
        urlLengthLimit: this.urlLengthLimit,
        retry: this.retry
      });
    }
    /**
    * Perform a function call.
    *
    * @param fn - The function name to call
    * @param args - The arguments to pass to the function call
    * @param options - Named parameters
    * @param options.head - When set to `true`, `data` will not be returned.
    * Useful if you only need the count.
    * @param options.get - When set to `true`, the function will be called with
    * read-only access mode.
    * @param options.count - Count algorithm to use to count rows returned by the
    * function. Only applicable for [set-returning
    * functions](https://www.postgresql.org/docs/current/functions-srf.html).
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @example
    * ```ts
    * // For cross-schema functions where type inference fails, use overrideTypes:
    * const { data } = await supabase
    *   .schema('schema_b')
    *   .rpc('function_a', {})
    *   .overrideTypes<{ id: string; user_id: string }[]>()
    * ```
    *
    * @category Database
    *
    * @example Call a Postgres function without arguments
    * ```ts
    * const { data, error } = await supabase.rpc('hello_world')
    * ```
    *
    * @exampleSql Call a Postgres function without arguments
    * ```sql
    * create function hello_world() returns text as $$
    *   select 'Hello world';
    * $$ language sql;
    * ```
    *
    * @exampleResponse Call a Postgres function without arguments
    * ```json
    * {
    *   "data": "Hello world",
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @example Call a Postgres function with arguments
    * ```ts
    * const { data, error } = await supabase.rpc('echo', { say: '👋' })
    * ```
    *
    * @exampleSql Call a Postgres function with arguments
    * ```sql
    * create function echo(say text) returns text as $$
    *   select say;
    * $$ language sql;
    * ```
    *
    * @exampleResponse Call a Postgres function with arguments
    * ```json
    *   {
    *     "data": "👋",
    *     "status": 200,
    *     "statusText": "OK"
    *   }
    *
    * ```
    *
    * @exampleDescription Bulk processing
    * You can process large payloads by passing in an array as an argument.
    *
    * @example Bulk processing
    * ```ts
    * const { data, error } = await supabase.rpc('add_one_each', { arr: [1, 2, 3] })
    * ```
    *
    * @exampleSql Bulk processing
    * ```sql
    * create function add_one_each(arr int[]) returns int[] as $$
    *   select array_agg(n + 1) from unnest(arr) as n;
    * $$ language sql;
    * ```
    *
    * @exampleResponse Bulk processing
    * ```json
    * {
    *   "data": [
    *     2,
    *     3,
    *     4
    *   ],
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @exampleDescription Call a Postgres function with filters
    * Postgres functions that return tables can also be combined with [Filters](/docs/reference/javascript/using-filters) and [Modifiers](/docs/reference/javascript/using-modifiers).
    *
    * @example Call a Postgres function with filters
    * ```ts
    * const { data, error } = await supabase
    *   .rpc('list_stored_countries')
    *   .eq('id', 1)
    *   .single()
    * ```
    *
    * @exampleSql Call a Postgres function with filters
    * ```sql
    * create table
    *   countries (id int8 primary key, name text);
    *
    * insert into
    *   countries (id, name)
    * values
    *   (1, 'Rohan'),
    *   (2, 'The Shire');
    *
    * create function list_stored_countries() returns setof countries as $$
    *   select * from countries;
    * $$ language sql;
    * ```
    *
    * @exampleResponse Call a Postgres function with filters
    * ```json
    * {
    *   "data": {
    *     "id": 1,
    *     "name": "Rohan"
    *   },
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    *
    * @example Call a read-only Postgres function
    * ```ts
    * const { data, error } = await supabase.rpc('hello_world', undefined, { get: true })
    * ```
    *
    * @exampleSql Call a read-only Postgres function
    * ```sql
    * create function hello_world() returns text as $$
    *   select 'Hello world';
    * $$ language sql;
    * ```
    *
    * @exampleResponse Call a read-only Postgres function
    * ```json
    * {
    *   "data": "Hello world",
    *   "status": 200,
    *   "statusText": "OK"
    * }
    * ```
    */
    rpc(fn, args = {}, { head: head2 = false, get: get2 = false, count } = {}) {
      var _this$fetch;
      let method;
      const url = new URL(`${this.url}/rpc/${fn}`);
      let body;
      const _isObject = (v) => v !== null && typeof v === "object" && (!Array.isArray(v) || v.some(_isObject));
      const _hasObjectArg = head2 && Object.values(args).some(_isObject);
      if (_hasObjectArg) {
        method = "POST";
        body = args;
      } else if (head2 || get2) {
        method = head2 ? "HEAD" : "GET";
        Object.entries(args).filter(([_2, value]) => value !== void 0).map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(",")}}` : `${value}`]).forEach(([name, value]) => {
          url.searchParams.append(name, value);
        });
      } else {
        method = "POST";
        body = args;
      }
      const headers = new Headers(this.headers);
      if (_hasObjectArg) headers.set("Prefer", count ? `count=${count},return=minimal` : "return=minimal");
      else if (count) headers.set("Prefer", `count=${count}`);
      return new PostgrestFilterBuilder({
        method,
        url,
        headers,
        schema: this.schemaName,
        body,
        fetch: (_this$fetch = this.fetch) !== null && _this$fetch !== void 0 ? _this$fetch : fetch,
        urlLengthLimit: this.urlLengthLimit,
        retry: this.retry
      });
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
  var WebSocketFactory = class {
    /**
     * Static-only utility – prevent instantiation.
     */
    constructor() {
    }
    static detectEnvironment() {
      var _a;
      if (typeof WebSocket !== "undefined") {
        return { type: "native", wsConstructor: WebSocket };
      }
      const gt = globalThis;
      if (typeof globalThis !== "undefined" && typeof gt.WebSocket !== "undefined") {
        return { type: "native", wsConstructor: gt.WebSocket };
      }
      const gl = typeof global !== "undefined" ? global : void 0;
      if (gl && typeof gl.WebSocket !== "undefined") {
        return { type: "native", wsConstructor: gl.WebSocket };
      }
      if (typeof globalThis !== "undefined" && typeof gt.WebSocketPair !== "undefined" && typeof globalThis.WebSocket === "undefined") {
        return {
          type: "cloudflare",
          error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
          workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."
        };
      }
      if (typeof globalThis !== "undefined" && gt.EdgeRuntime || typeof navigator !== "undefined" && ((_a = navigator.userAgent) === null || _a === void 0 ? void 0 : _a.includes("Vercel-Edge"))) {
        return {
          type: "unsupported",
          error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
          workaround: "Use serverless functions or a different deployment target for WebSocket functionality."
        };
      }
      const _process = globalThis["process"];
      if (_process) {
        const processVersions = _process["versions"];
        if (processVersions && processVersions["node"]) {
          return {
            type: "unsupported",
            error: "Node.js detected but native WebSocket not found.",
            workaround: "Ensure you are running Node.js 22+ or provide a WebSocket implementation via the transport option."
          };
        }
      }
      return {
        type: "unsupported",
        error: "Unknown JavaScript runtime without WebSocket support.",
        workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."
      };
    }
    /**
     * Returns the best available WebSocket constructor for the current runtime.
     *
     * @category Realtime
     *
     * @example Example with error handling
     * ```ts
     * try {
     *   const WS = WebSocketFactory.getWebSocketConstructor()
     *   const socket = new WS('wss://example.com/socket')
     * } catch (error) {
     *   console.error('WebSocket not available in this environment.', error)
     * }
     * ```
     */
    static getWebSocketConstructor() {
      const env = this.detectEnvironment();
      if (env.wsConstructor) {
        return env.wsConstructor;
      }
      let errorMessage = env.error || "WebSocket not supported in this environment.";
      if (env.workaround) {
        errorMessage += `

Suggested solution: ${env.workaround}`;
      }
      throw new Error(errorMessage);
    }
    /**
     * Detects whether the runtime can establish WebSocket connections.
     *
     * @category Realtime
     *
     * @example Example in a Node.js script
     * ```ts
     * if (!WebSocketFactory.isWebSocketSupported()) {
     *   console.error('WebSockets are required for this script.')
     *   process.exitCode = 1
     * }
     * ```
     */
    static isWebSocketSupported() {
      try {
        const env = this.detectEnvironment();
        return env.type === "native";
      } catch (_a) {
        return false;
      }
    }
  };
  var websocket_factory_default = WebSocketFactory;

  // node_modules/@supabase/realtime-js/dist/module/lib/version.js
  var version = "2.110.0";

  // node_modules/@supabase/realtime-js/dist/module/lib/constants.js
  var DEFAULT_VERSION = `realtime-js/${version}`;
  var VSN_1_0_0 = "1.0.0";
  var VSN_2_0_0 = "2.0.0";
  var DEFAULT_VSN = VSN_2_0_0;
  var DEFAULT_TIMEOUT = 1e4;
  var MAX_PUSH_BUFFER_SIZE = 100;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave",
    access_token: "access_token"
  };
  var CONNECTION_STATE = {
    connecting: "connecting",
    open: "open",
    closing: "closing",
    closed: "closed"
  };

  // node_modules/@supabase/realtime-js/dist/module/lib/serializer.js
  var Serializer = class {
    constructor(allowedMetadataKeys) {
      this.HEADER_LENGTH = 1;
      this.USER_BROADCAST_PUSH_META_LENGTH = 6;
      this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 };
      this.BINARY_ENCODING = 0;
      this.JSON_ENCODING = 1;
      this.BROADCAST_EVENT = "broadcast";
      this.allowedMetadataKeys = [];
      this.allowedMetadataKeys = allowedMetadataKeys !== null && allowedMetadataKeys !== void 0 ? allowedMetadataKeys : [];
    }
    encode(msg, callback) {
      if (msg.event === this.BROADCAST_EVENT && !(msg.payload instanceof ArrayBuffer) && typeof msg.payload.event === "string") {
        return callback(this._binaryEncodeUserBroadcastPush(msg));
      }
      let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
      return callback(JSON.stringify(payload));
    }
    _binaryEncodeUserBroadcastPush(message) {
      var _a;
      if (this._isArrayBuffer((_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload)) {
        return this._encodeBinaryUserBroadcastPush(message);
      } else {
        return this._encodeJsonUserBroadcastPush(message);
      }
    }
    _encodeBinaryUserBroadcastPush(message) {
      var _a, _b;
      const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : new ArrayBuffer(0);
      return this._encodeUserBroadcastPush(message, this.BINARY_ENCODING, userPayload);
    }
    _encodeJsonUserBroadcastPush(message) {
      var _a, _b;
      const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : {};
      const encoder = new TextEncoder();
      const encodedUserPayload = encoder.encode(JSON.stringify(userPayload)).buffer;
      return this._encodeUserBroadcastPush(message, this.JSON_ENCODING, encodedUserPayload);
    }
    _encodeUserBroadcastPush(message, encodingType, encodedPayload) {
      var _a, _b;
      const topic = message.topic;
      const ref = (_a = message.ref) !== null && _a !== void 0 ? _a : "";
      const joinRef = (_b = message.join_ref) !== null && _b !== void 0 ? _b : "";
      const userEvent = message.payload.event;
      const rest = this.allowedMetadataKeys ? this._pick(message.payload, this.allowedMetadataKeys) : {};
      const metadata = Object.keys(rest).length === 0 ? "" : JSON.stringify(rest);
      if (joinRef.length > 255) {
        throw new Error(`joinRef length ${joinRef.length} exceeds maximum of 255`);
      }
      if (ref.length > 255) {
        throw new Error(`ref length ${ref.length} exceeds maximum of 255`);
      }
      if (topic.length > 255) {
        throw new Error(`topic length ${topic.length} exceeds maximum of 255`);
      }
      if (userEvent.length > 255) {
        throw new Error(`userEvent length ${userEvent.length} exceeds maximum of 255`);
      }
      if (metadata.length > 255) {
        throw new Error(`metadata length ${metadata.length} exceeds maximum of 255`);
      }
      const metaLength = this.USER_BROADCAST_PUSH_META_LENGTH + joinRef.length + ref.length + topic.length + userEvent.length + metadata.length;
      const header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.userBroadcastPush);
      view.setUint8(offset++, joinRef.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, userEvent.length);
      view.setUint8(offset++, metadata.length);
      view.setUint8(offset++, encodingType);
      Array.from(joinRef, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(userEvent, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(metadata, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + encodedPayload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(encodedPayload), header.byteLength);
      return combined.buffer;
    }
    decode(rawPayload, callback) {
      if (this._isArrayBuffer(rawPayload)) {
        let result = this._binaryDecode(rawPayload);
        return callback(result);
      }
      if (typeof rawPayload === "string") {
        const jsonPayload = JSON.parse(rawPayload);
        const [join_ref, ref, topic, event, payload] = jsonPayload;
        return callback({ join_ref, ref, topic, event, payload });
      }
      return callback({});
    }
    _binaryDecode(buffer) {
      const view = new DataView(buffer);
      const kind = view.getUint8(0);
      const decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.userBroadcast:
          return this._decodeUserBroadcast(buffer, view, decoder);
      }
    }
    _decodeUserBroadcast(buffer, view, decoder) {
      const topicSize = view.getUint8(1);
      const userEventSize = view.getUint8(2);
      const metadataSize = view.getUint8(3);
      const payloadEncoding = view.getUint8(4);
      let offset = this.HEADER_LENGTH + 4;
      const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      const userEvent = decoder.decode(buffer.slice(offset, offset + userEventSize));
      offset = offset + userEventSize;
      const metadata = decoder.decode(buffer.slice(offset, offset + metadataSize));
      offset = offset + metadataSize;
      const payload = buffer.slice(offset, buffer.byteLength);
      const parsedPayload = payloadEncoding === this.JSON_ENCODING ? JSON.parse(decoder.decode(payload)) : payload;
      const data = {
        type: this.BROADCAST_EVENT,
        event: userEvent,
        payload: parsedPayload
      };
      if (metadataSize > 0) {
        data["meta"] = JSON.parse(metadata);
      }
      return { join_ref: null, ref: null, topic, event: this.BROADCAST_EVENT, payload: data };
    }
    _isArrayBuffer(buffer) {
      var _a;
      return buffer instanceof ArrayBuffer || ((_a = buffer === null || buffer === void 0 ? void 0 : buffer.constructor) === null || _a === void 0 ? void 0 : _a.name) === "ArrayBuffer";
    }
    _pick(obj, keys) {
      if (!obj || typeof obj !== "object") {
        return {};
      }
      return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/lib/transformers.js
  var PostgresTypes;
  (function(PostgresTypes2) {
    PostgresTypes2["abstime"] = "abstime";
    PostgresTypes2["bool"] = "bool";
    PostgresTypes2["date"] = "date";
    PostgresTypes2["daterange"] = "daterange";
    PostgresTypes2["float4"] = "float4";
    PostgresTypes2["float8"] = "float8";
    PostgresTypes2["int2"] = "int2";
    PostgresTypes2["int4"] = "int4";
    PostgresTypes2["int4range"] = "int4range";
    PostgresTypes2["int8"] = "int8";
    PostgresTypes2["int8range"] = "int8range";
    PostgresTypes2["json"] = "json";
    PostgresTypes2["jsonb"] = "jsonb";
    PostgresTypes2["money"] = "money";
    PostgresTypes2["numeric"] = "numeric";
    PostgresTypes2["oid"] = "oid";
    PostgresTypes2["reltime"] = "reltime";
    PostgresTypes2["text"] = "text";
    PostgresTypes2["time"] = "time";
    PostgresTypes2["timestamp"] = "timestamp";
    PostgresTypes2["timestamptz"] = "timestamptz";
    PostgresTypes2["timetz"] = "timetz";
    PostgresTypes2["tsrange"] = "tsrange";
    PostgresTypes2["tstzrange"] = "tstzrange";
  })(PostgresTypes || (PostgresTypes = {}));
  var convertChangeData = (columns, record, options = {}) => {
    var _a;
    const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
    if (!record) {
      return {};
    }
    return Object.keys(record).reduce((acc, rec_key) => {
      acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
      return acc;
    }, {});
  };
  var convertColumn = (columnName, columns, record, skipTypes) => {
    const column = columns.find((x) => x.name === columnName);
    const colType = column === null || column === void 0 ? void 0 : column.type;
    const value = record[columnName];
    if (colType && !skipTypes.includes(colType)) {
      return convertCell(colType, value);
    }
    return noop(value);
  };
  var convertCell = (type, value) => {
    if (type.charAt(0) === "_") {
      const dataType = type.slice(1, type.length);
      return toArray(value, dataType);
    }
    switch (type) {
      case PostgresTypes.bool:
        return toBoolean(value);
      case PostgresTypes.float4:
      case PostgresTypes.float8:
      case PostgresTypes.int2:
      case PostgresTypes.int4:
      case PostgresTypes.int8:
      case PostgresTypes.numeric:
      case PostgresTypes.oid:
        return toNumber(value);
      case PostgresTypes.json:
      case PostgresTypes.jsonb:
        return toJson(value);
      case PostgresTypes.timestamp:
        return toTimestampString(value);
      // Format to be consistent with PostgREST
      case PostgresTypes.abstime:
      // To allow users to cast it based on Timezone
      case PostgresTypes.date:
      // To allow users to cast it based on Timezone
      case PostgresTypes.daterange:
      case PostgresTypes.int4range:
      case PostgresTypes.int8range:
      case PostgresTypes.money:
      case PostgresTypes.reltime:
      // To allow users to cast it based on Timezone
      case PostgresTypes.text:
      case PostgresTypes.time:
      // To allow users to cast it based on Timezone
      case PostgresTypes.timestamptz:
      // To allow users to cast it based on Timezone
      case PostgresTypes.timetz:
      // To allow users to cast it based on Timezone
      case PostgresTypes.tsrange:
      case PostgresTypes.tstzrange:
        return noop(value);
      default:
        return noop(value);
    }
  };
  var noop = (value) => {
    return value;
  };
  var toBoolean = (value) => {
    switch (value) {
      case "t":
        return true;
      case "f":
        return false;
      default:
        return value;
    }
  };
  var toNumber = (value) => {
    if (typeof value === "string") {
      const parsedValue = parseFloat(value);
      if (!Number.isNaN(parsedValue)) {
        return parsedValue;
      }
    }
    return value;
  };
  var toJson = (value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch (_a) {
        return value;
      }
    }
    return value;
  };
  var toArray = (value, type) => {
    if (typeof value !== "string") {
      return value;
    }
    const lastIdx = value.length - 1;
    const closeBrace = value[lastIdx];
    const openBrace = value[0];
    if (openBrace === "{" && closeBrace === "}") {
      let arr;
      const valTrim = value.slice(1, lastIdx);
      try {
        arr = JSON.parse("[" + valTrim + "]");
      } catch (_2) {
        arr = valTrim ? valTrim.split(",") : [];
      }
      return arr.map((val) => convertCell(type, val));
    }
    return value;
  };
  var toTimestampString = (value) => {
    if (typeof value === "string") {
      return value.replace(" ", "T");
    }
    return value;
  };
  var httpEndpointURL = (socketUrl) => {
    const wsUrl = new URL(socketUrl);
    wsUrl.protocol = wsUrl.protocol.replace(/^ws/i, "http");
    wsUrl.pathname = wsUrl.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, "");
    if (wsUrl.pathname === "" || wsUrl.pathname === "/") {
      wsUrl.pathname = "/api/broadcast";
    } else {
      wsUrl.pathname = wsUrl.pathname + "/api/broadcast";
    }
    return wsUrl.href;
  };

  // node_modules/@supabase/phoenix/priv/static/phoenix.mjs
  var closure = (value) => {
    if (typeof value === "function") {
      return (
        /** @type {() => T} */
        value
      );
    } else {
      let closure2 = function() {
        return value;
      };
      return closure2;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global2 = globalSelf || phxWindow || globalThis;
  var DEFAULT_VSN2 = "2.0.0";
  var DEFAULT_TIMEOUT2 = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var SOCKET_STATES = (
    /** @type {const} */
    { connecting: 0, open: 1, closing: 2, closed: 3 }
  );
  var CHANNEL_STATES2 = (
    /** @type {const} */
    {
      closed: "closed",
      errored: "errored",
      joined: "joined",
      joining: "joining",
      leaving: "leaving"
    }
  );
  var CHANNEL_EVENTS2 = (
    /** @type {const} */
    {
      close: "phx_close",
      error: "phx_error",
      join: "phx_join",
      reply: "phx_reply",
      leave: "phx_leave"
    }
  );
  var TRANSPORTS = (
    /** @type {const} */
    {
      longpoll: "longpoll",
      websocket: "websocket"
    }
  );
  var XHR_STATES = (
    /** @type {const} */
    {
      complete: 4
    }
  );
  var AUTH_TOKEN_PREFIX = "base64url.bearer.phx.";
  var Push = class {
    /**
     * Initializes the Push
     * @param {Channel} channel - The Channel
     * @param {ChannelEvent} event - The event, for example `"phx_join"`
     * @param {() => Record<string, unknown>} payload - The payload, for example `{user_id: 123}`
     * @param {number} timeout - The push timeout in milliseconds
     */
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
      this.ref = void 0;
    }
    /**
     *
     * @param {number} timeout
     */
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    /**
     *
     */
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    /**
     *
     * @param {string} status
     * @param {(response: any) => void} callback
     */
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    destroy() {
      this.cancelRefEvent();
      this.cancelTimeout();
    }
    /**
     * @private
     */
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h2) => h2.status === status).forEach((h2) => h2.callback(response));
    }
    /**
     * @private
     */
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    /**
     * @private
     */
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    /**
    * @param {() => void} callback
    * @param {(tries: number) => number} timerCalc
    */
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = void 0;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    /**
     * @param {string} topic
     * @param {Params | (() => Params)} params
     * @param {Socket} socket
     */
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES2.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS2.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(
        this.socket.onOpen(() => {
          this.rejoinTimer.reset();
          if (this.isErrored()) {
            this.rejoin();
          }
        })
      );
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES2.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", (reason) => {
        this.state = CHANNEL_STATES2.errored;
        if (this.socket.hasLogger()) this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger()) this.socket.log("channel", `close ${this.topic}`);
        this.state = CHANNEL_STATES2.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger()) this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES2.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger()) this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS2.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES2.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS2.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    /**
     * Join the channel
     * @param {number} timeout
     * @returns {Push}
     */
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    /**
     * Teardown the channel.
     *
     * Destroys and stops related timers.
     */
    teardown() {
      this.pushBuffer.forEach((push) => push.destroy());
      this.pushBuffer = [];
      this.rejoinTimer.reset();
      this.joinPush.destroy();
      this.state = CHANNEL_STATES2.closed;
      this.bindings = [];
    }
    /**
     * Hook into channel close
     * @param {ChannelBindingCallback} callback
     */
    onClose(callback) {
      this.on(CHANNEL_EVENTS2.close, callback);
    }
    /**
     * Hook into channel errors
     * @param {ChannelOnErrorCallback} callback
     * @return {number}
     */
    onError(callback) {
      return this.on(CHANNEL_EVENTS2.error, (reason) => callback(reason));
    }
    /**
     * Subscribes on channel events
     *
     * Subscription returns a ref counter, which can be used later to
     * unsubscribe the exact event listener
     *
     * @example
     * const ref1 = channel.on("event", do_stuff)
     * const ref2 = channel.on("event", do_other_stuff)
     * channel.off("event", ref1)
     * // Since unsubscription, do_stuff won't fire,
     * // while do_other_stuff will keep firing on the "event"
     *
     * @param {string} event
     * @param {ChannelBindingCallback} callback
     * @returns {number} ref
     */
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    /**
     * Unsubscribes off of channel events
     *
     * Use the ref returned from a channel.on() to unsubscribe one
     * handler, or pass nothing for the ref to unsubscribe all
     * handlers for the given event.
     *
     * @example
     * // Unsubscribe the do_stuff handler
     * const ref1 = channel.on("event", do_stuff)
     * channel.off("event", ref1)
     *
     * // Unsubscribe all handlers from event
     * channel.off("event")
     *
     * @param {string} event
     * @param {number} [ref]
     */
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    /**
     * @private
     */
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    /**
     * Sends a message `event` to phoenix with the payload `payload`.
     * Phoenix receives this in the `handle_in(event, payload, socket)`
     * function. if phoenix replies or it times out (default 10000ms),
     * then optionally the reply can be received.
     *
     * @example
     * channel.push("event")
     *   .receive("ok", payload => console.log("phoenix replied:", payload))
     *   .receive("error", err => console.log("phoenix errored", err))
     *   .receive("timeout", () => console.log("timed out pushing"))
     * @param {string} event
     * @param {Object} payload
     * @param {number} [timeout]
     * @returns {Push}
     */
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    /** Leaves the channel
     *
     * Unsubscribes from server events, and
     * instructs channel to terminate on server
     *
     * Triggers onClose() hooks
     *
     * To receive leave acknowledgements, use the `receive`
     * hook to bind to the server ack, ie:
     *
     * @example
     * channel.leave().receive("ok", () => alert("left!") )
     *
     * @param {number} timeout
     * @returns {Push}
     */
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES2.leaving;
      let onClose = () => {
        if (this.socket.hasLogger()) this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS2.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS2.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling
     * before dispatching to the channel callbacks.
     *
     * Must return the payload, modified or unmodified
     * @type{ChannelOnMessage}
     */
    onMessage(_event, payload, _ref) {
      return payload;
    }
    /**
     * Overridable filter hook
     *
     * If this function returns `true`, `binding`'s callback will be called.
     *
     * @type{ChannelFilterBindings}
     */
    filterBindings(_binding, _payload, _ref) {
      return true;
    }
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger()) this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    joinRef() {
      return this.joinPush.ref;
    }
    /**
     * @private
     */
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES2.joining;
      this.joinPush.resend(timeout);
    }
    /**
     * @param {string} event
     * @param {unknown} [payload]
     * @param {?string} [ref]
     * @param {?string} [joinRef]
     */
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event && this.filterBindings(bind, payload, ref));
      for (let i2 = 0; i2 < eventBindings.length; i2++) {
        let bind = eventBindings[i2];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    /**
    * @param {string} ref
    */
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    isClosed() {
      return this.state === CHANNEL_STATES2.closed;
    }
    isErrored() {
      return this.state === CHANNEL_STATES2.errored;
    }
    isJoined() {
      return this.state === CHANNEL_STATES2.joined;
    }
    isJoining() {
      return this.state === CHANNEL_STATES2.joining;
    }
    isLeaving() {
      return this.state === CHANNEL_STATES2.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, headers, body, timeout, ontimeout, callback) {
      if (global2.XDomainRequest) {
        let req = new global2.XDomainRequest();
        return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else if (global2.XMLHttpRequest) {
        let req = new global2.XMLHttpRequest();
        return this.xhrRequest(req, method, endPoint, headers, body, timeout, ontimeout, callback);
      } else if (global2.fetch && global2.AbortController) {
        return this.fetchRequest(method, endPoint, headers, body, timeout, ontimeout, callback);
      } else {
        throw new Error("No suitable XMLHttpRequest implementation found");
      }
    }
    static fetchRequest(method, endPoint, headers, body, timeout, ontimeout, callback) {
      let options = {
        method,
        headers,
        body
      };
      let controller = null;
      if (timeout) {
        controller = new AbortController();
        const _timeoutId = setTimeout(() => controller.abort(), timeout);
        options.signal = controller.signal;
      }
      global2.fetch(endPoint, options).then((response) => response.text()).then((data) => this.parseJSON(data)).then((data) => callback && callback(data)).catch((err) => {
        if (err.name === "AbortError" && ontimeout) {
          ontimeout();
        } else {
          callback && callback(null);
        }
      });
      return controller;
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
      return req;
    }
    static xhrRequest(req, method, endPoint, headers, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      for (let [key, value] of Object.entries(headers)) {
        req.setRequestHeader(key, value);
      }
      req.onerror = () => callback && callback(null);
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
      return req;
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var arrayBufferToBase64 = (buffer) => {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i2 = 0; i2 < len; i2++) {
      binary += String.fromCharCode(bytes[i2]);
    }
    return btoa(binary);
  };
  var LongPoll = class {
    constructor(endPoint, protocols) {
      if (protocols && protocols.length === 2 && protocols[1].startsWith(AUTH_TOKEN_PREFIX)) {
        this.authToken = atob(protocols[1].slice(AUTH_TOKEN_PREFIX.length));
      }
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.reqs = /* @__PURE__ */ new Set();
      this.awaitingBatchAck = false;
      this.currentBatch = null;
      this.currentBatchTimer = null;
      this.batchBuffer = [];
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      setTimeout(() => this.poll(), 0);
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    isActive() {
      return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
    }
    poll() {
      const headers = { "Accept": "application/json" };
      if (this.authToken) {
        headers["X-Phoenix-AuthToken"] = this.authToken;
      }
      this.ajax("GET", headers, null, () => this.ontimeout(), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          if (status === 410 && this.token !== null) {
            this.onerror(410);
            this.closeAndRetry(3410, "session_gone", false);
            return;
          }
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => this.onmessage({ data: msg }), 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    // we collect all pushes within the current event loop by
    // setTimeout 0, which optimizes back-to-back procedural
    // pushes against an empty buffer
    send(body) {
      if (typeof body !== "string") {
        body = arrayBufferToBase64(body);
      }
      if (this.currentBatch) {
        this.currentBatch.push(body);
      } else if (this.awaitingBatchAck) {
        this.batchBuffer.push(body);
      } else {
        this.currentBatch = [body];
        this.currentBatchTimer = setTimeout(() => {
          this.batchSend(this.currentBatch);
          this.currentBatch = null;
        }, 0);
      }
    }
    batchSend(messages) {
      this.awaitingBatchAck = true;
      this.ajax("POST", { "Content-Type": "application/x-ndjson" }, messages.join("\n"), () => this.onerror("timeout"), (resp) => {
        this.awaitingBatchAck = false;
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        } else if (this.batchBuffer.length > 0) {
          this.batchSend(this.batchBuffer);
          this.batchBuffer = [];
        }
      });
    }
    close(code, reason, wasClean) {
      for (let req of this.reqs) {
        req.abort();
      }
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      this.batchBuffer = [];
      clearTimeout(this.currentBatchTimer);
      this.currentBatchTimer = null;
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
    ajax(method, headers, body, onCallerTimeout, callback) {
      let req;
      let ontimeout = () => {
        this.reqs.delete(req);
        onCallerTimeout();
      };
      req = Ajax.request(method, this.endpointURL(), headers, body, this.timeout, ontimeout, (resp) => {
        this.reqs.delete(req);
        if (this.isActive()) {
          callback(resp);
        }
      });
      this.reqs.add(req);
    }
  };
  var Presence = class _Presence {
    /**
     * Initializes the Presence
     * @param {Channel} channel - The Channel
     * @param {PresenceOptions} [opts] - The options, for example `{events: {state: "state", diff: "diff"}}`
     */
    constructor(channel, opts = {}) {
      let events = opts.events || /** @type {PresenceEvents} */
      { state: "presence_state", diff: "presence_diff" };
      this.state = {};
      this.pendingDiffs = [];
      this.channel = channel;
      this.joinRef = null;
      this.caller = {
        onJoin: function() {
        },
        onLeave: function() {
        },
        onSync: function() {
        }
      };
      this.channel.on(events.state, (newState) => {
        let { onJoin, onLeave, onSync } = this.caller;
        this.joinRef = this.channel.joinRef();
        this.state = _Presence.syncState(this.state, newState, onJoin, onLeave);
        this.pendingDiffs.forEach((diff) => {
          this.state = _Presence.syncDiff(this.state, diff, onJoin, onLeave);
        });
        this.pendingDiffs = [];
        onSync();
      });
      this.channel.on(events.diff, (diff) => {
        let { onJoin, onLeave, onSync } = this.caller;
        if (this.inPendingSyncState()) {
          this.pendingDiffs.push(diff);
        } else {
          this.state = _Presence.syncDiff(this.state, diff, onJoin, onLeave);
          onSync();
        }
      });
    }
    /**
     * @param {PresenceOnJoin} callback
     */
    onJoin(callback) {
      this.caller.onJoin = callback;
    }
    /**
     * @param {PresenceOnLeave} callback
     */
    onLeave(callback) {
      this.caller.onLeave = callback;
    }
    /**
     * @param {PresenceOnSync} callback
     */
    onSync(callback) {
      this.caller.onSync = callback;
    }
    /**
     * Returns the array of presences, with selected metadata.
     *
     * @template [T=PresenceState]
     * @param {((key: string, obj: PresenceState) => T)} [by]
     *
     * @returns {T[]}
     */
    list(by) {
      return _Presence.list(this.state, by);
    }
    inPendingSyncState() {
      return !this.joinRef || this.joinRef !== this.channel.joinRef();
    }
    // lower-level public static API
    /**
     * Used to sync the list of presences on the server
     * with the client's state. An optional `onJoin` and `onLeave` callback can
     * be provided to react to changes in the client's local presences across
     * disconnects and reconnects with the server.
     *
     * @param {Record<string, PresenceState>} currentState
     * @param {Record<string, PresenceState>} newState
     * @param {PresenceOnJoin} onJoin
     * @param {PresenceOnLeave} onLeave
     *
     * @returns {Record<string, PresenceState>}
     */
    static syncState(currentState, newState, onJoin, onLeave) {
      let state = this.clone(currentState);
      let joins = {};
      let leaves = {};
      this.map(state, (key, presence) => {
        if (!newState[key]) {
          leaves[key] = presence;
        }
      });
      this.map(newState, (key, newPresence) => {
        let currentPresence = state[key];
        if (currentPresence) {
          let newRefs = newPresence.metas.map((m3) => m3.phx_ref);
          let curRefs = currentPresence.metas.map((m3) => m3.phx_ref);
          let joinedMetas = newPresence.metas.filter((m3) => curRefs.indexOf(m3.phx_ref) < 0);
          let leftMetas = currentPresence.metas.filter((m3) => newRefs.indexOf(m3.phx_ref) < 0);
          if (joinedMetas.length > 0) {
            joins[key] = newPresence;
            joins[key].metas = joinedMetas;
          }
          if (leftMetas.length > 0) {
            leaves[key] = this.clone(currentPresence);
            leaves[key].metas = leftMetas;
          }
        } else {
          joins[key] = newPresence;
        }
      });
      return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
    }
    /**
     *
     * Used to sync a diff of presence join and leave
     * events from the server, as they happen. Like `syncState`, `syncDiff`
     * accepts optional `onJoin` and `onLeave` callbacks to react to a user
     * joining or leaving from a device.
     *
     * @param {Record<string, PresenceState>} state
     * @param {PresenceDiff} diff
     * @param {PresenceOnJoin} onJoin
     * @param {PresenceOnLeave} onLeave
     *
     * @returns {Record<string, PresenceState>}
     */
    static syncDiff(state, diff, onJoin, onLeave) {
      let { joins, leaves } = this.clone(diff);
      if (!onJoin) {
        onJoin = function() {
        };
      }
      if (!onLeave) {
        onLeave = function() {
        };
      }
      this.map(joins, (key, newPresence) => {
        let currentPresence = state[key];
        state[key] = this.clone(newPresence);
        if (currentPresence) {
          let joinedRefs = state[key].metas.map((m3) => m3.phx_ref);
          let curMetas = currentPresence.metas.filter((m3) => joinedRefs.indexOf(m3.phx_ref) < 0);
          state[key].metas.unshift(...curMetas);
        }
        onJoin(key, currentPresence, newPresence);
      });
      this.map(leaves, (key, leftPresence) => {
        let currentPresence = state[key];
        if (!currentPresence) {
          return;
        }
        let refsToRemove = leftPresence.metas.map((m3) => m3.phx_ref);
        currentPresence.metas = currentPresence.metas.filter((p3) => {
          return refsToRemove.indexOf(p3.phx_ref) < 0;
        });
        onLeave(key, currentPresence, leftPresence);
        if (currentPresence.metas.length === 0) {
          delete state[key];
        }
      });
      return state;
    }
    /**
     * Returns the array of presences, with selected metadata.
     *
     * @template [T=PresenceState]
     * @param {Record<string, PresenceState>} presences
     * @param {((key: string, obj: PresenceState) => T)} [chooser]
     *
     * @returns {T[]}
     */
    static list(presences, chooser) {
      if (!chooser) {
        chooser = function(key, pres) {
          return pres;
        };
      }
      return this.map(presences, (key, presence) => {
        return chooser(key, presence);
      });
    }
    // private
    /**
    * @template T
    * @param {Record<string, PresenceState>} obj
    * @param {(key: string, obj: PresenceState) => T} func
    */
    static map(obj, func) {
      return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
    }
    /**
    * @template T
    * @param {T} obj
    * @returns {T}
    */
    static clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    /**
    * @template T
    * @param {Message<Record<string, any>>} msg
    * @param {(msg: ArrayBuffer | string) => T} callback
    * @returns {T}
    */
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    /**
    * @template T
    * @param {ArrayBuffer | string} rawPayload
    * @param {(msg: Message<unknown>) => T} callback
    * @returns {T}
    */
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    /** @private */
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    /**
    * @private
    */
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    /** @private */
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    /** @private */
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS2.reply, payload };
    },
    /** @private */
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    /** Initializes the Socket *
     *
     * For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
     *
     * @constructor
     * @param {string} endPoint - The string WebSocket endpoint, ie, `"ws://example.com/socket"`,
     *                                               `"wss://example.com"`
     *                                               `"/socket"` (inherited host & protocol)
     * @param {SocketOptions} [opts] - Optional configuration
     */
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.fallbackRef = null;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT2;
      this.transport = opts.transport || global2.WebSocket || LongPoll;
      this.conn = void 0;
      this.primaryPassedHealthCheck = false;
      this.longPollFallbackMs = opts.longPollFallbackMs;
      this.fallbackTimer = null;
      let envSessionStorage = null;
      try {
        envSessionStorage = global2 && global2.sessionStorage;
      } catch {
      }
      this.sessionStore = opts.sessionStorage || envSessionStorage;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = true;
      this.disconnecting = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      this.pageHidden = false;
      this.encode = void 0;
      this.decode = void 0;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
        phxWindow.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            this.pageHidden = true;
          } else {
            this.pageHidden = false;
            if (!this.isConnected() && !this.closeWasClean) {
              this.teardown(() => this.connect());
            }
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.autoSendHeartbeat = opts.autoSendHeartbeat ?? true;
      this.heartbeatCallback = opts.heartbeatCallback ?? (() => {
      });
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      if (!this.logger && opts.debug) {
        this.logger = (kind, msg, data) => {
          console.log(`${kind}: ${msg}`, data);
        };
      }
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN2;
      this.heartbeatTimeoutTimer = null;
      this.heartbeatTimer = null;
      this.heartbeatSentAt = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        if (this.pageHidden) {
          this.log("Not reconnecting as page is hidden!");
          this.teardown();
          return;
        }
        this.teardown(async () => {
          if (opts.beforeReconnect) await opts.beforeReconnect();
          this.connect();
        });
      }, this.reconnectAfterMs);
      this.authToken = opts.authToken;
    }
    /**
     * Returns the LongPoll transport reference
     */
    getLongPollTransport() {
      return LongPoll;
    }
    /**
     * Disconnects and replaces the active transport
     *
     * @param {SocketTransport} newTransport - The new transport class to instantiate
     *
     */
    replaceTransport(newTransport) {
      this.connectClock++;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      if (this.conn) {
        this.conn.close();
        this.conn = null;
      }
      this.transport = newTransport;
    }
    /**
     * Returns the socket protocol
     *
     * @returns {"wss" | "ws"}
     */
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    /**
     * The fully qualified socket url
     *
     * @returns {string}
     */
    endPointURL() {
      let uri = Ajax.appendParams(
        Ajax.appendParams(this.endPoint, this.params()),
        { vsn: this.vsn }
      );
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    /**
     * Disconnects the socket
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes for valid status codes.
     *
     * @param {() => void} [callback] - Optional callback which is called after socket is disconnected.
     * @param {number} [code] - A status code for disconnection (Optional).
     * @param {string} [reason] - A textual description of the reason to disconnect. (Optional)
     */
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.disconnecting = true;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      this.teardown(() => {
        this.disconnecting = false;
        callback && callback();
      }, code, reason);
    }
    /**
     * @param {Params} [params] - [DEPRECATED] The params to send when connecting, for example `{user_id: userToken}`
     *
     * Passing params to connect is deprecated; pass them in the Socket constructor instead:
     * `new Socket("/socket", {params: {user_id: userToken}})`.
     */
    connect(params) {
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn && !this.disconnecting) {
        return;
      }
      if (this.longPollFallbackMs && this.transport !== LongPoll) {
        this.connectWithFallback(LongPoll, this.longPollFallbackMs);
      } else {
        this.transportConnect();
      }
    }
    /**
     * Logs the message. Override `this.logger` for specialized logging. noops by default
     * @param {string} kind
     * @param {string} msg
     * @param {Object} data
     */
    log(kind, msg, data) {
      this.logger && this.logger(kind, msg, data);
    }
    /**
     * Returns true if a logger has been set on this socket.
     */
    hasLogger() {
      return this.logger !== null;
    }
    /**
     * Registers callbacks for connection open events
     *
     * @example socket.onOpen(function(){ console.info("the socket was opened") })
     *
     * @param {SocketOnOpen} callback
     */
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection close events
     * @param {SocketOnClose} callback
     * @returns {string}
     */
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection error events
     *
     * @example socket.onError(function(error){ alert("An error occurred") })
     *
     * @param {SocketOnError} callback
     * @returns {string}
     */
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection message events
     * @param {SocketOnMessage} callback
     * @returns {string}
     */
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    /**
     * Sets a callback that receives lifecycle events for internal heartbeat messages.
     * Useful for instrumenting connection health (e.g. sent/ok/timeout/disconnected).
     * @param {HeartbeatCallback} callback
     */
    onHeartbeat(callback) {
      this.heartbeatCallback = callback;
    }
    /**
     * Pings the server and invokes the callback with the RTT in milliseconds
     * @param {(timeDelta: number) => void} callback
     *
     * Returns true if the ping was pushed or false if unable to be pushed.
     */
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    /**
     * @private
     *
     * @param {Function}
     */
    transportName(transport) {
      switch (transport) {
        case LongPoll:
          return "LongPoll";
        default:
          return transport.name;
      }
    }
    /**
     * @private
     */
    transportConnect() {
      this.connectClock++;
      this.closeWasClean = false;
      let protocols = void 0;
      if (this.authToken) {
        protocols = ["phoenix", `${AUTH_TOKEN_PREFIX}${btoa(this.authToken).replace(/=/g, "")}`];
      }
      this.conn = new this.transport(this.endPointURL(), protocols);
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    getSession(key) {
      return this.sessionStore && this.sessionStore.getItem(key);
    }
    storeSession(key, val) {
      this.sessionStore && this.sessionStore.setItem(key, val);
    }
    connectWithFallback(fallbackTransport, fallbackThreshold = 2500) {
      clearTimeout(this.fallbackTimer);
      let established = false;
      let primaryTransport = true;
      let openRef, errorRef;
      let fallbackTransportName = this.transportName(fallbackTransport);
      let fallback = (reason) => {
        this.log("transport", `falling back to ${fallbackTransportName}...`, reason);
        this.off([openRef, errorRef]);
        primaryTransport = false;
        this.replaceTransport(fallbackTransport);
        this.transportConnect();
      };
      if (this.getSession(`phx:fallback:${fallbackTransportName}`)) {
        return fallback("memorized");
      }
      this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
      errorRef = this.onError((reason) => {
        this.log("transport", "error", reason);
        if (primaryTransport && !established) {
          clearTimeout(this.fallbackTimer);
          fallback(reason);
        }
      });
      if (this.fallbackRef) {
        this.off([this.fallbackRef]);
      }
      this.fallbackRef = this.onOpen(() => {
        established = true;
        if (!primaryTransport) {
          let fallbackTransportName2 = this.transportName(fallbackTransport);
          if (!this.primaryPassedHealthCheck) {
            this.storeSession(`phx:fallback:${fallbackTransportName2}`, "true");
          }
          return this.log("transport", `established ${fallbackTransportName2} fallback`);
        }
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
        this.ping((rtt) => {
          this.log("transport", "connected to primary after", rtt);
          this.primaryPassedHealthCheck = true;
          clearTimeout(this.fallbackTimer);
        });
      });
      this.transportConnect();
    }
    clearHeartbeats() {
      clearTimeout(this.heartbeatTimer);
      clearTimeout(this.heartbeatTimeoutTimer);
    }
    onConnOpen() {
      if (this.hasLogger()) this.log("transport", `connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.disconnecting = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      if (this.autoSendHeartbeat) {
        this.resetHeartbeat();
      }
      this.triggerStateCallbacks("open");
    }
    /**
     * @private
     */
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        this.heartbeatSentAt = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        try {
          this.heartbeatCallback("timeout");
        } catch (e3) {
          this.log("error", "error in heartbeat callback", e3);
        }
        this.triggerChanError(new Error("heartbeat timeout"));
        this.closeWasClean = false;
        this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      this.clearHeartbeats();
      this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      const connToClose = this.conn;
      this.waitForBufferDone(connToClose, () => {
        if (code) {
          connToClose.close(code, reason || "");
        } else {
          connToClose.close();
        }
        this.waitForSocketClosed(connToClose, () => {
          if (this.conn === connToClose) {
            this.conn.onopen = function() {
            };
            this.conn.onerror = function() {
            };
            this.conn.onmessage = function() {
            };
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(conn, callback, tries = 1) {
      if (tries === 5 || !conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(conn, callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(conn, callback, tries = 1) {
      if (tries === 5 || conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(conn, callback, tries + 1);
      }, 150 * tries);
    }
    /**
    * @param {CloseEvent} event
    */
    onConnClose(event) {
      if (this.conn) this.conn.onclose = () => {
      };
      if (this.hasLogger()) this.log("transport", "close", event);
      this.triggerChanError(event);
      this.clearHeartbeats();
      if (!this.closeWasClean) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.triggerStateCallbacks("close", event);
    }
    /**
     * @private
     * @param {Event} error
     */
    onConnError(error) {
      if (this.hasLogger()) this.log("transport", "error", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.triggerStateCallbacks("error", error, transportBefore, establishedBefore);
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError(error);
      }
    }
    /**
     * @private
     * @param {unknown} [reason] underlying close/error event forwarded to channel error listeners
     */
    triggerChanError(reason) {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS2.error, reason);
        }
      });
    }
    /**
     * @returns {string}
     */
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    /**
     * @returns {boolean}
     */
    isConnected() {
      return this.connectionState() === "open";
    }
    /**
     *
     * @param {Channel} channel
     */
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c2) => c2 !== channel);
    }
    /**
     * Removes `onOpen`, `onClose`, `onError,` and `onMessage` registrations.
     *
     * @param {string[]} refs - list of refs returned by calls to
     *                 `onOpen`, `onClose`, `onError,` and `onMessage`
     */
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    /**
     * Initiates a new channel for the given topic
     *
     * @param {string} topic
     * @param {Params | (() => Params)} [chanParams]- Parameters for the channel
     * @returns {Channel}
     */
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    /**
     * @param {Message<Record<string, any>>} data
     */
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    /**
     * Return the next message ref, accounting for overflows
     * @returns {string}
     */
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (!this.isConnected()) {
        try {
          this.heartbeatCallback("disconnected");
        } catch (e3) {
          this.log("error", "error in heartbeat callback", e3);
        }
        return;
      }
      if (this.pendingHeartbeatRef) {
        this.heartbeatTimeout();
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.heartbeatSentAt = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      try {
        this.heartbeatCallback("sent");
      } catch (e3) {
        this.log("error", "error in heartbeat callback", e3);
      }
      this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    /**
    * @param {MessageEvent<any>} rawMessage
    */
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          const latency = this.heartbeatSentAt ? Date.now() - this.heartbeatSentAt : void 0;
          this.clearHeartbeats();
          try {
            this.heartbeatCallback(payload.status === "ok" ? "ok" : "error", latency);
          } catch (e3) {
            this.log("error", "error in heartbeat callback", e3);
          }
          this.pendingHeartbeatRef = null;
          this.heartbeatSentAt = null;
          if (this.autoSendHeartbeat) {
            this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
          }
        }
        if (this.hasLogger()) this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`.trim(), payload);
        for (let i2 = 0; i2 < this.channels.length; i2++) {
          const channel = this.channels[i2];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        this.triggerStateCallbacks("message", msg);
      });
    }
    /**
     * @private
     * @template {keyof SocketStateChangeCallbacks} K
     * @param {K} event
     * @param {...Parameters<SocketStateChangeCallbacks[K][number][1]>} args
     * @returns {void}
     */
    triggerStateCallbacks(event, ...args) {
      try {
        this.stateChangeCallbacks[event].forEach(([_2, callback]) => {
          try {
            callback(...args);
          } catch (e3) {
            this.log("error", `error in ${event} callback`, e3);
          }
        });
      } catch (e3) {
        this.log("error", `error triggering ${event} callbacks`, e3);
      }
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c2) => c2.topic === topic && (c2.isJoined() || c2.isJoining()));
      if (dupChannel) {
        if (this.hasLogger()) this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/phoenix/presenceAdapter.js
  var PresenceAdapter = class _PresenceAdapter {
    constructor(channel, opts) {
      const phoenixOptions = phoenixPresenceOptions(opts);
      this.presence = new Presence(channel.getChannel(), phoenixOptions);
      this.presence.onJoin((key, currentPresence, newPresence) => {
        const onJoinPayload = _PresenceAdapter.onJoinPayload(key, currentPresence, newPresence);
        channel.getChannel().trigger("presence", onJoinPayload);
      });
      this.presence.onLeave((key, currentPresence, leftPresence) => {
        const onLeavePayload = _PresenceAdapter.onLeavePayload(key, currentPresence, leftPresence);
        channel.getChannel().trigger("presence", onLeavePayload);
      });
      this.presence.onSync(() => {
        channel.getChannel().trigger("presence", { event: "sync" });
      });
    }
    get state() {
      return _PresenceAdapter.transformState(this.presence.state);
    }
    /**
     * @private
     * Remove 'metas' key
     * Change 'phx_ref' to 'presence_ref'
     * Remove 'phx_ref' and 'phx_ref_prev'
     *
     * @example Transform state
     * // returns {
     *  abc123: [
     *    { presence_ref: '2', user_id: 1 },
     *    { presence_ref: '3', user_id: 2 }
     *  ]
     * }
     * RealtimePresence.transformState({
     *  abc123: {
     *    metas: [
     *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
     *      { phx_ref: '3', user_id: 2 }
     *    ]
     *  }
     * })
     *
     */
    static transformState(state) {
      state = cloneState(state);
      return Object.getOwnPropertyNames(state).reduce((newState, key) => {
        const presences = state[key];
        newState[key] = transformState(presences);
        return newState;
      }, {});
    }
    static onJoinPayload(key, currentPresence, newPresence) {
      const currentPresences = parseCurrentPresences(currentPresence);
      const newPresences = transformState(newPresence);
      return {
        event: "join",
        key,
        currentPresences,
        newPresences
      };
    }
    static onLeavePayload(key, currentPresence, leftPresence) {
      const currentPresences = parseCurrentPresences(currentPresence);
      const leftPresences = transformState(leftPresence);
      return {
        event: "leave",
        key,
        currentPresences,
        leftPresences
      };
    }
  };
  function transformState(presences) {
    return presences.metas.map((presence) => {
      presence["presence_ref"] = presence["phx_ref"];
      delete presence["phx_ref"];
      delete presence["phx_ref_prev"];
      return presence;
    });
  }
  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }
  function phoenixPresenceOptions(opts) {
    return (opts === null || opts === void 0 ? void 0 : opts.events) && { events: opts.events };
  }
  function parseCurrentPresences(currentPresences) {
    return (currentPresences === null || currentPresences === void 0 ? void 0 : currentPresences.metas) ? transformState(currentPresences) : [];
  }

  // node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js
  var REALTIME_PRESENCE_LISTEN_EVENTS;
  (function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
    REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
    REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
    REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
  })(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
  var RealtimePresence = class {
    get state() {
      return this.presenceAdapter.state;
    }
    /**
     * Creates a Presence helper that keeps the local presence state in sync with the server.
     *
     * @param channel - The realtime channel to bind to.
     * @param opts - Optional custom event names, e.g. `{ events: { state: 'state', diff: 'diff' } }`.
     *
     * @category Realtime
     *
     * @example Example for a presence channel
     * ```ts
     * const presence = new RealtimePresence(channel)
     *
     * channel.on('presence', ({ event, key }) => {
     *   console.log(`Presence ${event} on ${key}`)
     * })
     * ```
     */
    constructor(channel, opts) {
      this.channel = channel;
      this.presenceAdapter = new PresenceAdapter(this.channel.channelAdapter, opts);
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/lib/normalizeChannelError.js
  function normalizeChannelError(reason) {
    if (reason instanceof Error) {
      return reason;
    }
    if (typeof reason === "string") {
      return new Error(reason);
    }
    if (reason && typeof reason === "object") {
      const obj = reason;
      if (typeof obj.code === "number") {
        const detail = typeof obj.reason === "string" && obj.reason ? ` (${obj.reason})` : "";
        return new Error(`socket closed: ${obj.code}${detail}`, { cause: reason });
      }
      return new Error("channel error: transport failure", { cause: reason });
    }
    return new Error("channel error: connection lost");
  }

  // node_modules/@supabase/realtime-js/dist/module/phoenix/channelAdapter.js
  var ChannelAdapter = class {
    constructor(socket, topic, params) {
      const phoenixParams = phoenixChannelParams(params);
      this.channel = socket.getSocket().channel(topic, phoenixParams);
      this.socket = socket;
    }
    get state() {
      return this.channel.state;
    }
    set state(state) {
      this.channel.state = state;
    }
    get joinedOnce() {
      return this.channel.joinedOnce;
    }
    get joinPush() {
      return this.channel.joinPush;
    }
    get rejoinTimer() {
      return this.channel.rejoinTimer;
    }
    on(event, callback) {
      return this.channel.on(event, callback);
    }
    off(event, refNumber) {
      this.channel.off(event, refNumber);
    }
    subscribe(timeout) {
      return this.channel.join(timeout);
    }
    unsubscribe(timeout) {
      return this.channel.leave(timeout);
    }
    teardown() {
      this.channel.teardown();
    }
    onClose(callback) {
      this.channel.onClose(callback);
    }
    onError(callback) {
      return this.channel.onError(callback);
    }
    push(event, payload, timeout) {
      let push;
      try {
        push = this.channel.push(event, payload, timeout);
      } catch (error) {
        throw new Error(`tried to push '${event}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`);
      }
      if (this.channel.pushBuffer.length > MAX_PUSH_BUFFER_SIZE) {
        const removedPush = this.channel.pushBuffer.shift();
        removedPush.cancelTimeout();
        this.socket.log("channel", `discarded push due to buffer overflow: ${removedPush.event}`, removedPush.payload());
      }
      return push;
    }
    updateJoinPayload(payload) {
      const oldPayload = this.channel.joinPush.payload();
      this.channel.joinPush.payload = () => Object.assign(Object.assign({}, oldPayload), payload);
    }
    canPush() {
      return this.socket.isConnected() && this.state === CHANNEL_STATES.joined;
    }
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
    updateFilterBindings(filterBindings) {
      this.channel.filterBindings = filterBindings;
    }
    updatePayloadTransform(callback) {
      this.channel.onMessage = callback;
    }
    /**
     * @internal
     */
    getChannel() {
      return this.channel;
    }
  };
  function phoenixChannelParams(options) {
    return {
      config: Object.assign({
        broadcast: { ack: false, self: false },
        presence: { key: "", enabled: false },
        private: false
      }, options.config)
    };
  }

  // node_modules/@supabase/realtime-js/dist/module/RealtimePostgresFilterBuilder.js
  var PostgrestReservedCharsRegexp2 = /[,()"\\]/;
  var needsQuoting = (value) => PostgrestReservedCharsRegexp2.test(value) || value !== value.trim();
  var quote = (value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  var serializeScalar = (value) => {
    const serialized = value === null ? "null" : String(value);
    return needsQuoting(serialized) ? quote(serialized) : serialized;
  };
  var serializeIsValue = (value) => value === null ? "null" : String(value);
  var serialize = (operator, value) => {
    if (operator === "in") {
      const values = Array.isArray(value) ? value : [value];
      if (values.length === 0) {
        throw new Error("Realtime `in` filter requires at least one value.");
      }
      const items = Array.from(new Set(values)).map((v) => serializeScalar(v)).join(",");
      return `in.(${items})`;
    }
    if (operator === "is") {
      return `is.${serializeIsValue(value)}`;
    }
    return `${operator}.${serializeScalar(value)}`;
  };
  var RealtimePostgresFilterBuilder = class {
    constructor() {
      this.filters = [];
    }
    add(column, operator, value, negate = false) {
      const prefix = negate ? "not." : "";
      this.filters.push(`${column}=${prefix}${serialize(operator, value)}`);
      return this;
    }
    /** Match rows where `column` equals `value` (`column=eq.value`). */
    eq(column, value) {
      return this.add(column, "eq", value);
    }
    /** Match rows where `column` does not equal `value` (`column=neq.value`). */
    neq(column, value) {
      return this.add(column, "neq", value);
    }
    /** Match rows where `column` is greater than `value` (`column=gt.value`). */
    gt(column, value) {
      return this.add(column, "gt", value);
    }
    /** Match rows where `column` is greater than or equal to `value` (`column=gte.value`). */
    gte(column, value) {
      return this.add(column, "gte", value);
    }
    /** Match rows where `column` is less than `value` (`column=lt.value`). */
    lt(column, value) {
      return this.add(column, "lt", value);
    }
    /** Match rows where `column` is less than or equal to `value` (`column=lte.value`). */
    lte(column, value) {
      return this.add(column, "lte", value);
    }
    /**
     * Match rows where `column` is one of `values` (`column=in.(a,b,c)`).
     * Requires at least one value; duplicates are removed. An element containing a
     * reserved character is double-quoted (`in.("a,b",c)`), so commas inside an
     * element are preserved. `null` is intentionally not accepted (`IN (null)`
     * never matches in SQL) — use `is`/`not('col','is',null)` for null checks.
     */
    in(column, values) {
      return this.add(column, "in", values);
    }
    /** Match rows where `column` matches the case-sensitive `pattern` (`column=like.pattern`). */
    like(column, pattern) {
      return this.add(column, "like", pattern);
    }
    /** Match rows where `column` matches the case-insensitive `pattern` (`column=ilike.pattern`). */
    ilike(column, pattern) {
      return this.add(column, "ilike", pattern);
    }
    /** Match rows where `column` matches the POSIX regex `pattern` (`column=match.pattern`). */
    match(column, pattern) {
      return this.add(column, "match", pattern);
    }
    /** Match rows where `column` matches the case-insensitive POSIX regex `pattern` (`column=imatch.pattern`). */
    imatch(column, pattern) {
      return this.add(column, "imatch", pattern);
    }
    /**
     * Match rows where `column` `IS` the given value (`column=is.null`).
     * Accepts `null`, a boolean, or the keywords `'null' | 'true' | 'false' | 'unknown'`.
     */
    is(column, value) {
      return this.add(column, "is", value);
    }
    /** Match rows where `column` is distinct from `value` (`column=isdistinct.value`). NULL-safe inequality. */
    isDistinct(column, value) {
      return this.add(column, "isdistinct", value);
    }
    not(column, operator, value) {
      return this.add(column, operator, value, true);
    }
    /**
     * Serialize all conditions into the comma-separated (AND) filter string.
     *
     * Conditions are joined by commas, which the server applies as `AND`. A scalar
     * value (or single `in` element) that contains a reserved character — `,`,
     * `(`, `)`, `"`, `\` — or surrounding whitespace is double-quoted and escaped
     * the way PostgREST does, so commas inside a value are preserved rather than
     * read as a condition boundary.
     */
    build() {
      return this.filters.join(",");
    }
    /** Alias for {@link build}; lets the builder be used wherever a string is expected. */
    toString() {
      return this.build();
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js
  var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
  (function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
  })(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
  var REALTIME_LISTEN_TYPES;
  (function(REALTIME_LISTEN_TYPES2) {
    REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
    REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
    REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
    REALTIME_LISTEN_TYPES2["SYSTEM"] = "system";
  })(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
  var REALTIME_SUBSCRIBE_STATES;
  (function(REALTIME_SUBSCRIBE_STATES2) {
    REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
    REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
    REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
    REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
  })(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
  var RealtimeChannel = class _RealtimeChannel {
    get state() {
      return this.channelAdapter.state;
    }
    set state(state) {
      this.channelAdapter.state = state;
    }
    get joinedOnce() {
      return this.channelAdapter.joinedOnce;
    }
    get timeout() {
      return this.socket.timeout;
    }
    get joinPush() {
      return this.channelAdapter.joinPush;
    }
    get rejoinTimer() {
      return this.channelAdapter.rejoinTimer;
    }
    /**
     * Creates a channel that can broadcast messages, sync presence, and listen to Postgres changes.
     *
     * The topic determines which realtime stream you are subscribing to. Config options let you
     * enable acknowledgement for broadcasts, presence tracking, or private channels.
     *
     * @category Realtime
     *
     * @example Using supabase-js (recommended)
     * ```ts
     * import { createClient } from '@supabase/supabase-js'
     *
     * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
     * const channel = supabase.channel('room1')
     * channel
     *   .on('broadcast', { event: 'cursor-pos' }, (payload) => console.log(payload))
     *   .subscribe()
     * ```
     *
     * @example Standalone import for bundle-sensitive environments
     * ```ts
     * import RealtimeClient from '@supabase/realtime-js'
     *
     * const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
     *   params: { apikey: 'your-publishable-key' },
     * })
     * const channel = new RealtimeChannel('realtime:public:messages', { config: {} }, client)
     * ```
     */
    constructor(topic, params = { config: {} }, socket) {
      var _a, _b;
      this.topic = topic;
      this.params = params;
      this.socket = socket;
      this.bindings = {};
      this.subTopic = topic.replace(/^realtime:/i, "");
      this.params.config = Object.assign({
        broadcast: { ack: false, self: false },
        presence: { key: "", enabled: false },
        private: false
      }, params.config);
      this.channelAdapter = new ChannelAdapter(this.socket.socketAdapter, topic, this.params);
      this.presence = new RealtimePresence(this);
      this._onClose(() => {
        this.socket._remove(this);
      });
      this._updateFilterTransform();
      this.broadcastEndpointURL = httpEndpointURL(this.socket.socketAdapter.endPointURL());
      this.private = this.params.config.private || false;
      if (!this.private && ((_b = (_a = this.params.config) === null || _a === void 0 ? void 0 : _a.broadcast) === null || _b === void 0 ? void 0 : _b.replay)) {
        throw new Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`);
      }
    }
    /**
     * Subscribe registers your client with the server.
     *
     * The optional `callback` receives a `status` and, on failure, an `err` argument.
     * Log the full `err` so its `cause`, `name`, and any structured fields aren't hidden
     * behind `err.message`.
     *
     * @category Realtime
     *
     * @example Handling errors
     * ```js
     * supabase.channel('room1').subscribe((status, err) => {
     *   if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
     *     // Log the full error: its `cause` often holds the underlying reason.
     *     console.error(status, err)
     *   }
     * })
     * ```
     */
    subscribe(callback, timeout = this.timeout) {
      var _a, _b, _c;
      if (!this.socket.isConnected()) {
        this.socket.connect();
      }
      if (this.channelAdapter.isClosed()) {
        const { config: { broadcast, presence, private: isPrivate } } = this.params;
        const postgres_changes = (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r2) => r2.filter)) !== null && _b !== void 0 ? _b : [];
        const presence_enabled = !!this.bindings[REALTIME_LISTEN_TYPES.PRESENCE] && this.bindings[REALTIME_LISTEN_TYPES.PRESENCE].length > 0 || ((_c = this.params.config.presence) === null || _c === void 0 ? void 0 : _c.enabled) === true;
        const accessTokenPayload = {};
        const config = {
          broadcast,
          presence: Object.assign(Object.assign({}, presence), { enabled: presence_enabled }),
          postgres_changes,
          private: isPrivate
        };
        if (this.socket.accessTokenValue) {
          accessTokenPayload.access_token = this.socket.accessTokenValue;
        }
        this._onError((reason) => {
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, normalizeChannelError(reason));
        });
        this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
        this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
        this._updateFilterMessage();
        this.channelAdapter.subscribe(timeout).receive("ok", async ({ postgres_changes: postgres_changes2 }) => {
          if (!this.socket._isManualToken()) {
            this.socket.setAuth();
          }
          if (postgres_changes2 === void 0) {
            callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
            return;
          }
          this._updatePostgresBindings(postgres_changes2, callback);
        }).receive("error", (error) => {
          this.state = CHANNEL_STATES.errored;
          const message = Object.values(error).join(", ") || "error";
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(message, { cause: error }));
        }).receive("timeout", () => {
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
        });
      }
      return this;
    }
    _updatePostgresBindings(postgres_changes, callback) {
      var _a;
      const clientPostgresBindings = this.bindings.postgres_changes;
      const bindingsLen = (_a = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a !== void 0 ? _a : 0;
      const newPostgresBindings = [];
      for (let i2 = 0; i2 < bindingsLen; i2++) {
        const clientPostgresBinding = clientPostgresBindings[i2];
        const { filter: { event, schema, table, filter } } = clientPostgresBinding;
        const serverPostgresFilter = postgres_changes && postgres_changes[i2];
        if (serverPostgresFilter && serverPostgresFilter.event === event && _RealtimeChannel.isFilterValueEqual(serverPostgresFilter.schema, schema) && _RealtimeChannel.isFilterValueEqual(serverPostgresFilter.table, table) && _RealtimeChannel.isFilterValueEqual(serverPostgresFilter.filter, filter)) {
          newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
        } else {
          this.unsubscribe();
          this.state = CHANNEL_STATES.errored;
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error("mismatch between server and client bindings for postgres changes"));
          return;
        }
      }
      this.bindings.postgres_changes = newPostgresBindings;
      if (this.state != CHANNEL_STATES.errored && callback) {
        callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
      }
    }
    /**
     * Returns the current presence state for this channel.
     *
     * The shape is a map keyed by presence key (for example a user id) where each entry contains the
     * tracked metadata for that user.
     *
     * @category Realtime
     */
    presenceState() {
      return this.presence.state;
    }
    /**
     * Sends the supplied payload to the presence tracker so other subscribers can see that this
     * client is online. Use `untrack` to stop broadcasting presence for the same key.
     *
     * @category Realtime
     */
    async track(payload, opts = {}) {
      return await this.send({
        type: "presence",
        event: "track",
        payload
      }, opts.timeout || this.timeout);
    }
    /**
     * Removes the current presence state for this client.
     *
     * @category Realtime
     */
    async untrack(opts = {}) {
      return await this.send({
        type: "presence",
        event: "untrack"
      }, opts);
    }
    /**
     * Listen to realtime events on this channel.
     * @category Realtime
     *
     * @remarks
     * - By default, Broadcast and Presence are enabled for all projects.
     * - By default, listening to database changes is disabled for new projects due to database performance and security concerns. You can turn it on by managing Realtime's [replication](/docs/guides/api#realtime-api-overview).
     * - You can receive the "previous" data for updates and deletes by setting the table's `REPLICA IDENTITY` to `FULL` (e.g., `ALTER TABLE your_table REPLICA IDENTITY FULL;`).
     * - Row level security is not applied to delete statements. When RLS is enabled and replica identity is set to full, only the primary key is sent to clients.
     *
     * @example Listen to broadcast messages
     * ```js
     * const channel = supabase.channel("room1")
     *
     * channel.on("broadcast", { event: "cursor-pos" }, (payload) => {
     *   console.log("Cursor position received!", payload);
     * }).subscribe((status) => {
     *   if (status === "SUBSCRIBED") {
     *     channel.send({
     *       type: "broadcast",
     *       event: "cursor-pos",
     *       payload: { x: Math.random(), y: Math.random() },
     *     });
     *   }
     * });
     * ```
     *
     * @example Listen to presence sync
     * ```js
     * const channel = supabase.channel('room1')
     * channel
     *   .on('presence', { event: 'sync' }, () => {
     *     console.log('Synced presence state: ', channel.presenceState())
     *   })
     *   .subscribe(async (status) => {
     *     if (status === 'SUBSCRIBED') {
     *       await channel.track({ online_at: new Date().toISOString() })
     *     }
     *   })
     * ```
     *
     * @example Listen to presence join
     * ```js
     * const channel = supabase.channel('room1')
     * channel
     *   .on('presence', { event: 'join' }, ({ newPresences }) => {
     *     console.log('Newly joined presences: ', newPresences)
     *   })
     *   .subscribe(async (status) => {
     *     if (status === 'SUBSCRIBED') {
     *       await channel.track({ online_at: new Date().toISOString() })
     *     }
     *   })
     * ```
     *
     * @example Listen to presence leave
     * ```js
     * const channel = supabase.channel('room1')
     * channel
     *   .on('presence', { event: 'leave' }, ({ leftPresences }) => {
     *     console.log('Newly left presences: ', leftPresences)
     *   })
     *   .subscribe(async (status) => {
     *     if (status === 'SUBSCRIBED') {
     *       await channel.track({ online_at: new Date().toISOString() })
     *       await channel.untrack()
     *     }
     *   })
     * ```
     *
     * @example Listen to all database changes
     * ```js
     * supabase
     *   .channel('room1')
     *   .on('postgres_changes', { event: '*', schema: '*' }, payload => {
     *     console.log('Change received!', payload)
     *   })
     *   .subscribe()
     * ```
     *
     * @example Listen to a specific table
     * ```js
     * supabase
     *   .channel('room1')
     *   .on('postgres_changes', { event: '*', schema: 'public', table: 'countries' }, payload => {
     *     console.log('Change received!', payload)
     *   })
     *   .subscribe()
     * ```
     *
     * @example Listen to inserts
     * ```js
     * supabase
     *   .channel('room1')
     *   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, payload => {
     *     console.log('Change received!', payload)
     *   })
     *   .subscribe()
     * ```
     *
     * @exampleDescription Listen to updates
     * By default, Supabase will send only the updated record. If you want to receive the previous values as well you can
     * enable full replication for the table you are listening to:
     *
     * ```sql
     * alter table "your_table" replica identity full;
     * ```
     *
     * @example Listen to updates
     * ```js
     * supabase
     *   .channel('room1')
     *   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries' }, payload => {
     *     console.log('Change received!', payload)
     *   })
     *   .subscribe()
     * ```
     *
     * @exampleDescription Listen to deletes
     * By default, Supabase does not send deleted records. If you want to receive the deleted record you can
     * enable full replication for the table you are listening to:
     *
     * ```sql
     * alter table "your_table" replica identity full;
     * ```
     *
     * @example Listen to deletes
     * ```js
     * supabase
     *   .channel('room1')
     *   .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, payload => {
     *     console.log('Change received!', payload)
     *   })
     *   .subscribe()
     * ```
     *
     * @exampleDescription Listen to multiple events
     * You can chain listeners if you want to listen to multiple events for each table.
     *
     * @example Listen to multiple events
     * ```js
     * supabase
     *   .channel('room1')
     *   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, handleRecordInserted)
     *   .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, handleRecordDeleted)
     *   .subscribe()
     * ```
     *
     * @exampleDescription Listen to row level changes
     * You can listen to individual rows using the format `{table}:{col}=eq.{val}` - where `{col}` is the column name, and `{val}` is the value which you want to match.
     *
     * @example Listen to row level changes
     * ```js
     * supabase
     *   .channel('room1')
     *   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries', filter: 'id=eq.200' }, handleRecordUpdated)
     *   .subscribe()
     * ```
     */
    on(type, filter, callback) {
      const stateCheck = this.channelAdapter.isJoined() || this.channelAdapter.isJoining();
      const typeCheck = type === REALTIME_LISTEN_TYPES.PRESENCE || type === REALTIME_LISTEN_TYPES.POSTGRES_CHANGES;
      if (stateCheck && typeCheck) {
        this.socket.log("channel", `cannot add \`${type}\` callbacks for ${this.topic} after \`subscribe()\`.`);
        throw new Error(`cannot add \`${type}\` callbacks for ${this.topic} after \`subscribe()\`.`);
      }
      return this._on(type, filter, callback);
    }
    /**
     * Sends a broadcast message explicitly via REST API.
     *
     * This method always uses the REST API endpoint regardless of WebSocket connection state.
     * Useful when you want to guarantee REST delivery or when gradually migrating from implicit REST fallback.
     *
     * Payloads that are `ArrayBuffer` or `ArrayBufferView` (e.g. `Uint8Array`) are sent as
     * `application/octet-stream`; all other payloads are JSON-encoded.
     *
     * @param event The name of the broadcast event
     * @param payload Payload to be sent (required)
     * @param opts Options including timeout
     * @returns Promise resolving to object with success status, and error details if failed
     *
     * @category Realtime
     */
    async httpSend(event, payload, opts = {}) {
      var _a;
      if (payload === void 0 || payload === null) {
        return Promise.reject(new Error("Payload is required for httpSend()"));
      }
      const isBinary = payload instanceof ArrayBuffer || ArrayBuffer.isView(payload);
      const headers = {
        apikey: this.socket.apiKey ? this.socket.apiKey : "",
        "Content-Type": isBinary ? "application/octet-stream" : "application/json"
      };
      if (this.socket.accessTokenValue) {
        headers["Authorization"] = `Bearer ${this.socket.accessTokenValue}`;
      }
      const url = new URL(this.broadcastEndpointURL);
      url.pathname += `/${encodeURIComponent(this.subTopic)}/events/${encodeURIComponent(event)}`;
      if (this.private) {
        url.searchParams.set("private", "true");
      }
      const options = {
        method: "POST",
        headers,
        body: isBinary ? payload : JSON.stringify(payload)
      };
      const response = await this._fetchWithTimeout(url.toString(), options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
      if (response.status === 202) {
        return { success: true };
      }
      if (response.status === 404) {
        return Promise.reject(new Error("httpSend() requires Realtime server v2.97.0 or newer; the endpoint returned 404. Update your Supabase CLI to a recent version, or upgrade the Realtime server in your self-hosted setup. See https://github.com/supabase/supabase-js/blob/master/packages/core/realtime-js/migrations/httpsend-server-version.md"));
      }
      let errorMessage = response.statusText;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.error || errorBody.message || errorMessage;
      } catch (_b) {
      }
      return Promise.reject(new Error(errorMessage));
    }
    /**
     * Sends a message into the channel.
     *
     * @param args Arguments to send to channel
     * @param args.type The type of event to send
     * @param args.event The name of the event being sent
     * @param args.payload Payload to be sent
     * @param opts Options to be used during the send process
     *
     * @category Realtime
     *
     * @remarks
     * - When using REST you don't need to subscribe to the channel
     * - REST calls are only available from 2.37.0 onwards
     * - If you create a channel only to send a REST broadcast, remove it from
     *   the client when the send completes
     *
     * @example Send a message via websocket
     * ```js
     * const channel = supabase.channel('room1')
     *
     * channel.subscribe((status) => {
     *   if (status === 'SUBSCRIBED') {
     *     channel.send({
     *       type: 'broadcast',
     *       event: 'cursor-pos',
     *       payload: { x: Math.random(), y: Math.random() },
     *     })
     *   }
     * })
     * ```
     *
     * @exampleResponse Send a message via websocket
     * ```js
     * ok | timed out | error
     * ```
     *
     * @example Send a message via REST
     * ```js
     * const channel = supabase.channel('room1')
     *
     * try {
     *   await channel.httpSend('cursor-pos', { x: Math.random(), y: Math.random() })
     * } finally {
     *   await supabase.removeChannel(channel)
     * }
     * ```
     */
    async send(args, opts = {}) {
      var _a, _b;
      if (!this.channelAdapter.canPush() && args.type === "broadcast") {
        console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
        const { event, payload: endpoint_payload } = args;
        const headers = {
          apikey: this.socket.apiKey ? this.socket.apiKey : "",
          "Content-Type": "application/json"
        };
        if (this.socket.accessTokenValue) {
          headers["Authorization"] = `Bearer ${this.socket.accessTokenValue}`;
        }
        const options = {
          method: "POST",
          headers,
          body: JSON.stringify({
            messages: [
              {
                topic: this.subTopic,
                event,
                payload: endpoint_payload,
                private: this.private
              }
            ]
          })
        };
        try {
          const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
          await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
          return response.ok ? "ok" : "error";
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return "timed out";
          } else {
            return "error";
          }
        }
      } else {
        return new Promise((resolve) => {
          var _a2, _b2, _c;
          const push = this.channelAdapter.push(args.type, args, opts.timeout || this.timeout);
          if (args.type === "broadcast" && !((_c = (_b2 = (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
            resolve("ok");
          }
          push.receive("ok", () => resolve("ok"));
          push.receive("error", () => resolve("error"));
          push.receive("timeout", () => resolve("timed out"));
        });
      }
    }
    /**
     * Updates the payload that will be sent the next time the channel joins (reconnects).
     * Useful for rotating access tokens or updating config without re-creating the channel.
     *
     * @category Realtime
     */
    updateJoinPayload(payload) {
      this.channelAdapter.updateJoinPayload(payload);
    }
    /**
     * Leaves the channel.
     *
     * Unsubscribes from server events, and instructs channel to terminate on server.
     * Triggers onClose() hooks.
     *
     * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
     * channel.unsubscribe().receive("ok", () => alert("left!") )
     *
     * @category Realtime
     */
    async unsubscribe(timeout = this.timeout) {
      return new Promise((resolve) => {
        this.channelAdapter.unsubscribe(timeout).receive("ok", () => resolve("ok")).receive("timeout", () => resolve("timed out")).receive("error", () => resolve("error"));
      });
    }
    /**
     * Destroys and stops related timers.
     *
     * @category Realtime
     */
    teardown() {
      this.channelAdapter.teardown();
    }
    /** @internal */
    async _fetchWithTimeout(url, options, timeout) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
      clearTimeout(id);
      return response;
    }
    /** @internal */
    _on(type, filter, callback) {
      const typeLower = type.toLocaleLowerCase();
      const filterValue = filter === null || filter === void 0 ? void 0 : filter.filter;
      if (filterValue instanceof RealtimePostgresFilterBuilder || typeof filterValue === "object" && filterValue !== null && typeof filterValue.build === "function") {
        filter = Object.assign(Object.assign({}, filter), { filter: filterValue.build() });
      }
      const ref = this.channelAdapter.on(type, callback);
      const binding = {
        type: typeLower,
        filter,
        callback,
        ref
      };
      if (this.bindings[typeLower]) {
        this.bindings[typeLower].push(binding);
      } else {
        this.bindings[typeLower] = [binding];
      }
      this._updateFilterMessage();
      return this;
    }
    /**
     * Registers a callback that will be executed when the channel closes.
     *
     * @internal
     */
    _onClose(callback) {
      this.channelAdapter.onClose(callback);
    }
    /**
     * Registers a callback that will be executed when the channel encounteres an error.
     *
     * @internal
     */
    _onError(callback) {
      this.channelAdapter.onError(callback);
    }
    /** @internal */
    _updateFilterMessage() {
      this.channelAdapter.updateFilterBindings((binding, payload, ref) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const typeLower = binding.event.toLocaleLowerCase();
        if (this._notThisChannelEvent(typeLower, ref)) {
          return false;
        }
        const bind = (_a = this.bindings[typeLower]) === null || _a === void 0 ? void 0 : _a.find((bind2) => bind2.ref === binding.ref);
        if (!bind) {
          return true;
        }
        if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
          if ("id" in bind) {
            const bindId = bind.id;
            const bindEvent = (_b = bind.filter) === null || _b === void 0 ? void 0 : _b.event;
            return bindId && ((_c = payload.ids) === null || _c === void 0 ? void 0 : _c.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_d = payload.data) === null || _d === void 0 ? void 0 : _d.type.toLocaleLowerCase()));
          } else {
            const bindEvent = (_f = (_e = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _e === void 0 ? void 0 : _e.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase();
            return bindEvent === "*" || bindEvent === ((_g = payload === null || payload === void 0 ? void 0 : payload.event) === null || _g === void 0 ? void 0 : _g.toLocaleLowerCase());
          }
        } else {
          return bind.type.toLocaleLowerCase() === typeLower;
        }
      });
    }
    /** @internal */
    _notThisChannelEvent(event, ref) {
      const { close, error, leave, join } = CHANNEL_EVENTS;
      const events = [close, error, leave, join];
      return ref && events.includes(event) && ref !== this.joinPush.ref;
    }
    /** @internal */
    _updateFilterTransform() {
      this.channelAdapter.updatePayloadTransform((event, payload, ref) => {
        if (typeof payload === "object" && "ids" in payload) {
          const postgresChanges = payload.data;
          const { schema, table, commit_timestamp, type, errors } = postgresChanges;
          const enrichedPayload = {
            schema,
            table,
            commit_timestamp,
            eventType: type,
            new: {},
            old: {},
            errors
          };
          return Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
        }
        return payload;
      });
    }
    copyBindings(other) {
      if (this.joinedOnce) {
        throw new Error("cannot copy bindings into joined channel");
      }
      for (const kind in other.bindings) {
        for (const binding of other.bindings[kind]) {
          this._on(binding.type, binding.filter, binding.callback);
        }
      }
    }
    /**
     * Compares two optional filter values for equality.
     * Treats undefined, null, and empty string as equivalent empty values.
     * @internal
     */
    static isFilterValueEqual(serverValue, clientValue) {
      const normalizedServer = serverValue !== null && serverValue !== void 0 ? serverValue : void 0;
      const normalizedClient = clientValue !== null && clientValue !== void 0 ? clientValue : void 0;
      return normalizedServer === normalizedClient;
    }
    /** @internal */
    _getPayloadRecords(payload) {
      const records = {
        new: {},
        old: {}
      };
      if (payload.type === "INSERT" || payload.type === "UPDATE") {
        records.new = convertChangeData(payload.columns, payload.record);
      }
      if (payload.type === "UPDATE" || payload.type === "DELETE") {
        records.old = convertChangeData(payload.columns, payload.old_record);
      }
      return records;
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/phoenix/socketAdapter.js
  var SocketAdapter = class {
    constructor(endPoint, options) {
      this.socket = new Socket(endPoint, options);
    }
    get timeout() {
      return this.socket.timeout;
    }
    get endPoint() {
      return this.socket.endPoint;
    }
    get transport() {
      return this.socket.transport;
    }
    get heartbeatIntervalMs() {
      return this.socket.heartbeatIntervalMs;
    }
    get heartbeatCallback() {
      return this.socket.heartbeatCallback;
    }
    set heartbeatCallback(callback) {
      this.socket.heartbeatCallback = callback;
    }
    get heartbeatTimer() {
      return this.socket.heartbeatTimer;
    }
    get pendingHeartbeatRef() {
      return this.socket.pendingHeartbeatRef;
    }
    get reconnectTimer() {
      return this.socket.reconnectTimer;
    }
    get vsn() {
      return this.socket.vsn;
    }
    get encode() {
      return this.socket.encode;
    }
    get decode() {
      return this.socket.decode;
    }
    get reconnectAfterMs() {
      return this.socket.reconnectAfterMs;
    }
    get sendBuffer() {
      return this.socket.sendBuffer;
    }
    get stateChangeCallbacks() {
      return this.socket.stateChangeCallbacks;
    }
    connect() {
      this.socket.connect();
    }
    disconnect(callback, code, reason, timeout = 1e4) {
      return new Promise((resolve) => {
        setTimeout(() => resolve("timeout"), timeout);
        this.socket.disconnect(() => {
          callback();
          resolve("ok");
        }, code, reason);
      });
    }
    push(data) {
      this.socket.push(data);
    }
    log(kind, msg, data) {
      this.socket.log(kind, msg, data);
    }
    makeRef() {
      return this.socket.makeRef();
    }
    onOpen(callback) {
      this.socket.onOpen(callback);
    }
    onClose(callback) {
      this.socket.onClose(callback);
    }
    onError(callback) {
      this.socket.onError(callback);
    }
    onMessage(callback) {
      this.socket.onMessage(callback);
    }
    isConnected() {
      return this.socket.isConnected();
    }
    isConnecting() {
      return this.socket.connectionState() == CONNECTION_STATE.connecting;
    }
    isDisconnecting() {
      return this.socket.connectionState() == CONNECTION_STATE.closing;
    }
    connectionState() {
      return this.socket.connectionState();
    }
    endPointURL() {
      return this.socket.endPointURL();
    }
    sendHeartbeat() {
      this.socket.sendHeartbeat();
    }
    /**
     * @internal
     */
    getSocket() {
      return this.socket;
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js
  var CONNECTION_TIMEOUTS = {
    HEARTBEAT_INTERVAL: 25e3,
    RECONNECT_DELAY: 10,
    HEARTBEAT_TIMEOUT_FALLBACK: 100
  };
  var RECONNECT_INTERVALS = [1e3, 2e3, 5e3, 1e4];
  var DEFAULT_RECONNECT_FALLBACK = 1e4;
  function createMemorySessionStorage() {
    const store = /* @__PURE__ */ new Map();
    return {
      get length() {
        return store.size;
      },
      clear() {
        store.clear();
      },
      getItem(key) {
        return store.has(key) ? store.get(key) : null;
      },
      key(index) {
        var _a;
        return (_a = Array.from(store.keys())[index]) !== null && _a !== void 0 ? _a : null;
      },
      removeItem(key) {
        store.delete(key);
      },
      setItem(key, value) {
        store.set(key, String(value));
      }
    };
  }
  function resolveSessionStorage() {
    try {
      if (typeof globalThis !== "undefined" && globalThis.sessionStorage) {
        return globalThis.sessionStorage;
      }
    } catch (_a) {
    }
    return createMemorySessionStorage();
  }
  var WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
  var RealtimeClient = class {
    get endPoint() {
      return this.socketAdapter.endPoint;
    }
    get timeout() {
      return this.socketAdapter.timeout;
    }
    get transport() {
      return this.socketAdapter.transport;
    }
    get heartbeatCallback() {
      return this.socketAdapter.heartbeatCallback;
    }
    get heartbeatIntervalMs() {
      return this.socketAdapter.heartbeatIntervalMs;
    }
    get heartbeatTimer() {
      if (this.worker) {
        return this._workerHeartbeatTimer;
      }
      return this.socketAdapter.heartbeatTimer;
    }
    get pendingHeartbeatRef() {
      if (this.worker) {
        return this._pendingWorkerHeartbeatRef;
      }
      return this.socketAdapter.pendingHeartbeatRef;
    }
    get reconnectTimer() {
      return this.socketAdapter.reconnectTimer;
    }
    get vsn() {
      return this.socketAdapter.vsn;
    }
    get encode() {
      return this.socketAdapter.encode;
    }
    get decode() {
      return this.socketAdapter.decode;
    }
    get reconnectAfterMs() {
      return this.socketAdapter.reconnectAfterMs;
    }
    get sendBuffer() {
      return this.socketAdapter.sendBuffer;
    }
    get stateChangeCallbacks() {
      return this.socketAdapter.stateChangeCallbacks;
    }
    /**
     * Initializes the Socket.
     *
     * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
     * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
     * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
     * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
     * @param options.params The optional params to pass when connecting.
     * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
     * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
     * @param options.heartbeatCallback The optional function to handle heartbeat status and latency.
     * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
     * @param options.logLevel Sets the log level for Realtime
     * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
     * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
     * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
     * @param options.worker Use Web Worker to set a side flow. Defaults to false.
     * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
     * @param options.vsn The protocol version to use when connecting. Supported versions are "1.0.0" and "2.0.0". Defaults to "2.0.0".
     *
     * @category Realtime
     *
     * @example Using supabase-js (recommended)
     * ```ts
     * import { createClient } from '@supabase/supabase-js'
     *
     * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
     * const channel = supabase.channel('room1')
     * channel
     *   .on('broadcast', { event: 'cursor-pos' }, (payload) => console.log(payload))
     *   .subscribe()
     * ```
     *
     * @example Standalone import for bundle-sensitive environments
     * ```ts
     * import RealtimeClient from '@supabase/realtime-js'
     *
     * const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
     *   params: { apikey: 'your-publishable-key' },
     * })
     * client.connect()
     * ```
     */
    constructor(endPoint, options) {
      var _a;
      this.channels = new Array();
      this.accessTokenValue = null;
      this.accessToken = null;
      this.apiKey = null;
      this.httpEndpoint = "";
      this.headers = {};
      this.params = {};
      this.ref = 0;
      this.serializer = new Serializer();
      this._manuallySetToken = false;
      this._authPromise = null;
      this._workerHeartbeatTimer = void 0;
      this._pendingWorkerHeartbeatRef = null;
      this._pendingDisconnectTimer = null;
      this._disconnectOnEmptyChannelsAfterMs = 0;
      this._resolveFetch = (customFetch) => {
        if (customFetch) {
          return (...args) => customFetch(...args);
        }
        return (...args) => fetch(...args);
      };
      if (!((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey)) {
        throw new Error("API key is required to connect to Realtime");
      }
      this.apiKey = options.params.apikey;
      const socketAdapterOptions = this._initializeOptions(options);
      this.socketAdapter = new SocketAdapter(endPoint, socketAdapterOptions);
      this.httpEndpoint = httpEndpointURL(endPoint);
      this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
    }
    /**
     * Connects the socket, unless already connected.
     *
     * @category Realtime
     */
    connect() {
      if (this.isConnecting() || this.isDisconnecting() || this.isConnected()) {
        return;
      }
      if (this.accessToken && !this._authPromise) {
        this._setAuthSafely("connect");
      }
      this._setupConnectionHandlers();
      try {
        this.socketAdapter.connect();
      } catch (error) {
        const errorMessage = error.message;
        throw new Error(`WebSocket not available: ${errorMessage}`);
      }
      this._handleNodeJsRaceCondition();
    }
    /**
     * Returns the URL of the websocket.
     * @returns string The URL of the websocket.
     *
     * @category Realtime
     */
    endpointURL() {
      return this.socketAdapter.endPointURL();
    }
    /**
     * Disconnects the socket.
     *
     * @param code A numeric status code to send on disconnect.
     * @param reason A custom reason for the disconnect.
     *
     * @category Realtime
     */
    async disconnect(code, reason) {
      this._cancelPendingDisconnect();
      if (this.isDisconnecting()) {
        return "ok";
      }
      return await this.socketAdapter.disconnect(() => {
        clearInterval(this._workerHeartbeatTimer);
        this._terminateWorker();
      }, code, reason);
    }
    /**
     * Returns all created channels
     *
     * @category Realtime
     */
    getChannels() {
      return this.channels;
    }
    /**
     * Unsubscribes, removes and tears down a single channel
     * @param channel A RealtimeChannel instance
     *
     * @category Realtime
     */
    async removeChannel(channel) {
      const status = await channel.unsubscribe();
      if (status === "ok") {
        channel.teardown();
      }
      return status;
    }
    /**
     * Unsubscribes, removes and tears down all channels
     *
     * @category Realtime
     */
    async removeAllChannels() {
      const promises = this.channels.map(async (channel) => {
        const result2 = await channel.unsubscribe();
        channel.teardown();
        return result2;
      });
      const result = await Promise.all(promises);
      await this.disconnect();
      return result;
    }
    /**
     * Logs the message.
     *
     * For customized logging, `this.logger` can be overridden in Client constructor.
     *
     * @category Realtime
     */
    log(kind, msg, data) {
      this.socketAdapter.log(kind, msg, data);
    }
    /**
     * Returns the current state of the socket.
     *
     * @category Realtime
     */
    connectionState() {
      return this.socketAdapter.connectionState() || CONNECTION_STATE.closed;
    }
    /**
     * Returns `true` is the connection is open.
     *
     * @category Realtime
     */
    isConnected() {
      return this.socketAdapter.isConnected();
    }
    /**
     * Returns `true` if the connection is currently connecting.
     *
     * @category Realtime
     */
    isConnecting() {
      return this.socketAdapter.isConnecting();
    }
    /**
     * Returns `true` if the connection is currently disconnecting.
     *
     * @category Realtime
     */
    isDisconnecting() {
      return this.socketAdapter.isDisconnecting();
    }
    /**
     * Creates (or reuses) a {@link RealtimeChannel} for the provided topic.
     *
     * Topics are automatically prefixed with `realtime:` to match the Realtime service.
     * If a channel with the same topic already exists it will be returned instead of creating
     * a duplicate connection.
     *
     * @category Realtime
     */
    channel(topic, params = { config: {} }) {
      const realtimeTopic = `realtime:${topic}`;
      const exists = this.getChannels().find((c2) => c2.topic === realtimeTopic);
      if (!exists) {
        const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
        this._cancelPendingDisconnect();
        this.channels.push(chan);
        return chan;
      } else {
        return exists;
      }
    }
    /**
     * Push out a message if the socket is connected.
     *
     * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
     *
     * @category Realtime
     */
    push(data) {
      this.socketAdapter.push(data);
    }
    /**
     * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
     *
     * If param is null it will use the `accessToken` callback function or the token set on the client.
     *
     * On callback used, it will set the value of the token internal to the client.
     *
     * When a token is explicitly provided, it will be preserved across channel operations
     * (including removeChannel and resubscribe). The `accessToken` callback will not be
     * invoked until `setAuth()` is called without arguments.
     *
     * @param token A JWT string to override the token set on the client.
     *
     * @example Setting the authorization header
     * // Use a manual token (preserved across resubscribes, ignores accessToken callback)
     * client.realtime.setAuth('my-custom-jwt')
     *
     * // Switch back to using the accessToken callback
     * client.realtime.setAuth()
     *
     * @category Realtime
     */
    async setAuth(token = null) {
      this._authPromise = this._performAuth(token);
      try {
        await this._authPromise;
      } finally {
        this._authPromise = null;
      }
    }
    /**
     * Returns true if the current access token was explicitly set via setAuth(token),
     * false if it was obtained via the accessToken callback.
     * @internal
     */
    _isManualToken() {
      return this._manuallySetToken;
    }
    /**
     * Sends a heartbeat message if the socket is connected.
     *
     * @category Realtime
     */
    async sendHeartbeat() {
      this.socketAdapter.sendHeartbeat();
    }
    /**
     * Sets a callback that receives lifecycle events for internal heartbeat messages.
     * Useful for instrumenting connection health (e.g. sent/ok/timeout/disconnected).
     *
     * @category Realtime
     */
    onHeartbeat(callback) {
      this.socketAdapter.heartbeatCallback = this._wrapHeartbeatCallback(callback);
    }
    /**
     * Return the next message ref, accounting for overflows
     *
     * @internal
     */
    _makeRef() {
      return this.socketAdapter.makeRef();
    }
    /**
     * Removes a channel from RealtimeClient
     *
     * @param channel An open subscription.
     *
     * @internal
     */
    _remove(channel) {
      this.channels = this.channels.filter((c2) => c2.topic !== channel.topic);
      if (this.channels.length === 0) {
        this.log("transport", "no channels remaining, scheduling disconnect");
        this._schedulePendingDisconnect();
      }
    }
    /** @internal */
    _schedulePendingDisconnect() {
      this._cancelPendingDisconnect();
      if (this._disconnectOnEmptyChannelsAfterMs === 0) {
        this.log("transport", "disconnecting immediately - no channels");
        this.disconnect();
        return;
      }
      this._pendingDisconnectTimer = setTimeout(() => {
        this._pendingDisconnectTimer = null;
        if (this.channels.length === 0) {
          this.log("transport", "deferred disconnect fired - no channels, disconnecting");
          this.disconnect();
        }
      }, this._disconnectOnEmptyChannelsAfterMs);
      this.log("transport", `deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`);
    }
    /** @internal */
    _cancelPendingDisconnect() {
      if (this._pendingDisconnectTimer !== null) {
        this.log("transport", "pending disconnect cancelled - channel activity detected");
        clearTimeout(this._pendingDisconnectTimer);
        this._pendingDisconnectTimer = null;
      }
    }
    /**
     * Perform the actual auth operation
     * @internal
     */
    async _performAuth(token = null) {
      let tokenToSend;
      let isManualToken = false;
      if (token) {
        tokenToSend = token;
        isManualToken = true;
      } else if (this.accessToken) {
        try {
          tokenToSend = await this.accessToken();
        } catch (e3) {
          this.log("error", "Error fetching access token from callback", e3);
          tokenToSend = this.accessTokenValue;
        }
      } else {
        tokenToSend = this.accessTokenValue;
      }
      if (isManualToken) {
        this._manuallySetToken = true;
      } else if (this.accessToken) {
        this._manuallySetToken = false;
      }
      if (this.accessTokenValue != tokenToSend) {
        this.accessTokenValue = tokenToSend;
        this.channels.forEach((channel) => {
          const payload = {
            access_token: tokenToSend,
            version: DEFAULT_VERSION
          };
          tokenToSend && channel.updateJoinPayload(payload);
          if (channel.joinedOnce && channel.channelAdapter.isJoined()) {
            channel.channelAdapter.push(CHANNEL_EVENTS.access_token, {
              access_token: tokenToSend
            });
          }
        });
      }
    }
    /**
     * Wait for any in-flight auth operations to complete
     * @internal
     */
    async _waitForAuthIfNeeded() {
      if (this._authPromise) {
        await this._authPromise;
      }
    }
    /**
     * Safely call setAuth with standardized error handling
     * @internal
     */
    _setAuthSafely(context = "general") {
      if (!this._isManualToken()) {
        this.setAuth().catch((e3) => {
          this.log("error", `Error setting auth in ${context}`, e3);
        });
      }
    }
    /** @internal */
    _setupConnectionHandlers() {
      this.socketAdapter.onOpen(() => {
        const authPromise = this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve());
        authPromise.catch((e3) => {
          this.log("error", "error waiting for auth on connect", e3);
        });
        if (this.worker && !this.workerRef) {
          this._startWorkerHeartbeat();
        }
      });
      this.socketAdapter.onClose(() => {
        if (this.worker && this.workerRef) {
          this._terminateWorker();
        }
      });
      this.socketAdapter.onMessage((message) => {
        if (message.ref && message.ref === this._pendingWorkerHeartbeatRef) {
          this._pendingWorkerHeartbeatRef = null;
        }
      });
    }
    /** @internal */
    _handleNodeJsRaceCondition() {
      if (this.socketAdapter.isConnected()) {
        this.socketAdapter.getSocket().onConnOpen();
      }
    }
    /** @internal */
    _wrapHeartbeatCallback(heartbeatCallback) {
      return (status, latency) => {
        if (status == "sent")
          this._setAuthSafely();
        if (heartbeatCallback)
          heartbeatCallback(status, latency);
      };
    }
    /** @internal */
    _startWorkerHeartbeat() {
      if (this.workerUrl) {
        this.log("worker", `starting worker for from ${this.workerUrl}`);
      } else {
        this.log("worker", `starting default worker`);
      }
      const objectUrl = this._workerObjectUrl(this.workerUrl);
      this.workerRef = new Worker(objectUrl);
      this.workerRef.onerror = (error) => {
        this.log("worker", "worker error", error.message);
        this._terminateWorker();
        this.disconnect();
      };
      this.workerRef.onmessage = (event) => {
        if (event.data.event === "keepAlive") {
          this.sendHeartbeat();
        }
      };
      this.workerRef.postMessage({
        event: "start",
        interval: this.heartbeatIntervalMs
      });
    }
    /**
     * Terminate the Web Worker and clear the reference
     * @internal
     */
    _terminateWorker() {
      if (this.workerRef) {
        this.log("worker", "terminating worker");
        this.workerRef.terminate();
        this.workerRef = void 0;
      }
    }
    /** @internal */
    _workerObjectUrl(url) {
      let result_url;
      if (url) {
        result_url = url;
      } else {
        const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
        result_url = URL.createObjectURL(blob);
      }
      return result_url;
    }
    /**
     * Initialize socket options with defaults
     * @internal
     */
    _initializeOptions(options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
      this.worker = (_a = options === null || options === void 0 ? void 0 : options.worker) !== null && _a !== void 0 ? _a : false;
      this.accessToken = (_b = options === null || options === void 0 ? void 0 : options.accessToken) !== null && _b !== void 0 ? _b : null;
      const result = {};
      result.timeout = (_c = options === null || options === void 0 ? void 0 : options.timeout) !== null && _c !== void 0 ? _c : DEFAULT_TIMEOUT;
      result.heartbeatIntervalMs = (_d = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _d !== void 0 ? _d : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
      this._disconnectOnEmptyChannelsAfterMs = (_e = options === null || options === void 0 ? void 0 : options.disconnectOnEmptyChannelsAfterMs) !== null && _e !== void 0 ? _e : 2 * ((_f = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _f !== void 0 ? _f : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL);
      result.transport = (_g = options === null || options === void 0 ? void 0 : options.transport) !== null && _g !== void 0 ? _g : websocket_factory_default.getWebSocketConstructor();
      result.params = options === null || options === void 0 ? void 0 : options.params;
      result.logger = options === null || options === void 0 ? void 0 : options.logger;
      result.heartbeatCallback = this._wrapHeartbeatCallback(options === null || options === void 0 ? void 0 : options.heartbeatCallback);
      result.sessionStorage = (_h = options === null || options === void 0 ? void 0 : options.sessionStorage) !== null && _h !== void 0 ? _h : resolveSessionStorage();
      result.reconnectAfterMs = (_j = options === null || options === void 0 ? void 0 : options.reconnectAfterMs) !== null && _j !== void 0 ? _j : ((tries) => {
        return RECONNECT_INTERVALS[tries - 1] || DEFAULT_RECONNECT_FALLBACK;
      });
      let defaultEncode;
      let defaultDecode;
      const vsn = (_k = options === null || options === void 0 ? void 0 : options.vsn) !== null && _k !== void 0 ? _k : DEFAULT_VSN;
      switch (vsn) {
        case VSN_1_0_0:
          defaultEncode = (payload, callback) => {
            return callback(JSON.stringify(payload));
          };
          defaultDecode = (payload, callback) => {
            return callback(JSON.parse(payload));
          };
          break;
        case VSN_2_0_0:
          defaultEncode = this.serializer.encode.bind(this.serializer);
          defaultDecode = this.serializer.decode.bind(this.serializer);
          break;
        default:
          throw new Error(`Unsupported serializer version: ${result.vsn}`);
      }
      result.vsn = vsn;
      result.encode = (_l = options === null || options === void 0 ? void 0 : options.encode) !== null && _l !== void 0 ? _l : defaultEncode;
      result.decode = (_m = options === null || options === void 0 ? void 0 : options.decode) !== null && _m !== void 0 ? _m : defaultDecode;
      result.beforeReconnect = this._reconnectAuth.bind(this);
      if ((options === null || options === void 0 ? void 0 : options.logLevel) || (options === null || options === void 0 ? void 0 : options.log_level)) {
        this.logLevel = options.logLevel || options.log_level;
        result.params = Object.assign(Object.assign({}, result.params), { log_level: this.logLevel });
      }
      if (this.worker) {
        if (typeof window !== "undefined" && !window.Worker) {
          throw new Error("Web Worker is not supported");
        }
        this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
        result.autoSendHeartbeat = !this.worker;
      }
      return result;
    }
    /** @internal */
    async _reconnectAuth() {
      await this._waitForAuthIfNeeded();
      if (!this.isConnected()) {
        this.connect();
      }
    }
  };

  // node_modules/iceberg-js/dist/index.mjs
  var IcebergError = class extends Error {
    constructor(message, opts) {
      super(message);
      this.name = "IcebergError";
      this.status = opts.status;
      this.icebergType = opts.icebergType;
      this.icebergCode = opts.icebergCode;
      this.details = opts.details;
      this.isCommitStateUnknown = opts.icebergType === "CommitStateUnknownException" || [500, 502, 504].includes(opts.status) && opts.icebergType?.includes("CommitState") === true;
    }
    /**
     * Returns true if the error is a 404 Not Found error.
     */
    isNotFound() {
      return this.status === 404;
    }
    /**
     * Returns true if the error is a 409 Conflict error.
     */
    isConflict() {
      return this.status === 409;
    }
    /**
     * Returns true if the error is a 419 Authentication Timeout error.
     */
    isAuthenticationTimeout() {
      return this.status === 419;
    }
  };
  function buildUrl(baseUrl, path, query) {
    const url = new URL(path, baseUrl);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== void 0) {
          url.searchParams.set(key, value);
        }
      }
    }
    return url.toString();
  }
  async function buildAuthHeaders(auth) {
    if (!auth || auth.type === "none") {
      return {};
    }
    if (auth.type === "bearer") {
      return { Authorization: `Bearer ${auth.token}` };
    }
    if (auth.type === "header") {
      return { [auth.name]: auth.value };
    }
    if (auth.type === "custom") {
      return await auth.getHeaders();
    }
    return {};
  }
  function createFetchClient(options) {
    const fetchFn = options.fetchImpl ?? globalThis.fetch;
    return {
      async request({
        method,
        path,
        query,
        body,
        headers
      }) {
        const url = buildUrl(options.baseUrl, path, query);
        const authHeaders = await buildAuthHeaders(options.auth);
        const res = await fetchFn(url, {
          method,
          headers: {
            ...body ? { "Content-Type": "application/json" } : {},
            ...authHeaders,
            ...headers
          },
          body: body ? JSON.stringify(body) : void 0
        });
        const text = await res.text();
        const isJson = (res.headers.get("content-type") || "").includes("application/json");
        const data = isJson && text ? JSON.parse(text) : text;
        if (!res.ok) {
          const errBody = isJson ? data : void 0;
          const errorDetail = errBody?.error;
          throw new IcebergError(
            errorDetail?.message ?? `Request failed with status ${res.status}`,
            {
              status: res.status,
              icebergType: errorDetail?.type,
              icebergCode: errorDetail?.code,
              details: errBody
            }
          );
        }
        return { status: res.status, headers: res.headers, data };
      }
    };
  }
  function namespaceToPath(namespace) {
    return namespace.join("");
  }
  var NamespaceOperations = class {
    constructor(client, prefix = "") {
      this.client = client;
      this.prefix = prefix;
    }
    async listNamespaces(parent) {
      const query = parent ? { parent: namespaceToPath(parent.namespace) } : void 0;
      const response = await this.client.request({
        method: "GET",
        path: `${this.prefix}/namespaces`,
        query
      });
      return response.data.namespaces.map((ns) => ({ namespace: ns }));
    }
    async createNamespace(id, metadata) {
      const request = {
        namespace: id.namespace,
        properties: metadata?.properties
      };
      const response = await this.client.request({
        method: "POST",
        path: `${this.prefix}/namespaces`,
        body: request
      });
      return response.data;
    }
    async dropNamespace(id) {
      await this.client.request({
        method: "DELETE",
        path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
      });
    }
    async loadNamespaceMetadata(id) {
      const response = await this.client.request({
        method: "GET",
        path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
      });
      return {
        properties: response.data.properties
      };
    }
    async namespaceExists(id) {
      try {
        await this.client.request({
          method: "HEAD",
          path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
        });
        return true;
      } catch (error) {
        if (error instanceof IcebergError && error.status === 404) {
          return false;
        }
        throw error;
      }
    }
    async createNamespaceIfNotExists(id, metadata) {
      try {
        return await this.createNamespace(id, metadata);
      } catch (error) {
        if (error instanceof IcebergError && error.status === 409) {
          return;
        }
        throw error;
      }
    }
  };
  function namespaceToPath2(namespace) {
    return namespace.join("");
  }
  var TableOperations = class {
    constructor(client, prefix = "", accessDelegation) {
      this.client = client;
      this.prefix = prefix;
      this.accessDelegation = accessDelegation;
    }
    async listTables(namespace) {
      const response = await this.client.request({
        method: "GET",
        path: `${this.prefix}/namespaces/${namespaceToPath2(namespace.namespace)}/tables`
      });
      return response.data.identifiers;
    }
    async createTable(namespace, request) {
      const headers = {};
      if (this.accessDelegation) {
        headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
      }
      const response = await this.client.request({
        method: "POST",
        path: `${this.prefix}/namespaces/${namespaceToPath2(namespace.namespace)}/tables`,
        body: request,
        headers
      });
      return response.data.metadata;
    }
    async updateTable(id, request) {
      const response = await this.client.request({
        method: "POST",
        path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
        body: request
      });
      return {
        "metadata-location": response.data["metadata-location"],
        metadata: response.data.metadata
      };
    }
    async dropTable(id, options) {
      await this.client.request({
        method: "DELETE",
        path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
        query: { purgeRequested: String(options?.purge ?? false) }
      });
    }
    async loadTable(id) {
      const headers = {};
      if (this.accessDelegation) {
        headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
      }
      const response = await this.client.request({
        method: "GET",
        path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
        headers
      });
      return response.data.metadata;
    }
    async tableExists(id) {
      const headers = {};
      if (this.accessDelegation) {
        headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
      }
      try {
        await this.client.request({
          method: "HEAD",
          path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
          headers
        });
        return true;
      } catch (error) {
        if (error instanceof IcebergError && error.status === 404) {
          return false;
        }
        throw error;
      }
    }
    async createTableIfNotExists(namespace, request) {
      try {
        return await this.createTable(namespace, request);
      } catch (error) {
        if (error instanceof IcebergError && error.status === 409) {
          return await this.loadTable({ namespace: namespace.namespace, name: request.name });
        }
        throw error;
      }
    }
  };
  var IcebergRestCatalog = class {
    /**
     * Creates a new Iceberg REST Catalog client.
     *
     * @param options - Configuration options for the catalog client
     */
    constructor(options) {
      let prefix = "v1";
      if (options.catalogName) {
        prefix += `/${options.catalogName}`;
      }
      const baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl : `${options.baseUrl}/`;
      this.client = createFetchClient({
        baseUrl,
        auth: options.auth,
        fetchImpl: options.fetch
      });
      this.accessDelegation = options.accessDelegation?.join(",");
      this.namespaceOps = new NamespaceOperations(this.client, prefix);
      this.tableOps = new TableOperations(this.client, prefix, this.accessDelegation);
    }
    /**
     * Lists all namespaces in the catalog.
     *
     * @param parent - Optional parent namespace to list children under
     * @returns Array of namespace identifiers
     *
     * @example
     * ```typescript
     * // List all top-level namespaces
     * const namespaces = await catalog.listNamespaces();
     *
     * // List namespaces under a parent
     * const children = await catalog.listNamespaces({ namespace: ['analytics'] });
     * ```
     */
    async listNamespaces(parent) {
      return this.namespaceOps.listNamespaces(parent);
    }
    /**
     * Creates a new namespace in the catalog.
     *
     * @param id - Namespace identifier to create
     * @param metadata - Optional metadata properties for the namespace
     * @returns Response containing the created namespace and its properties
     *
     * @example
     * ```typescript
     * const response = await catalog.createNamespace(
     *   { namespace: ['analytics'] },
     *   { properties: { owner: 'data-team' } }
     * );
     * console.log(response.namespace); // ['analytics']
     * console.log(response.properties); // { owner: 'data-team', ... }
     * ```
     */
    async createNamespace(id, metadata) {
      return this.namespaceOps.createNamespace(id, metadata);
    }
    /**
     * Drops a namespace from the catalog.
     *
     * The namespace must be empty (contain no tables) before it can be dropped.
     *
     * @param id - Namespace identifier to drop
     *
     * @example
     * ```typescript
     * await catalog.dropNamespace({ namespace: ['analytics'] });
     * ```
     */
    async dropNamespace(id) {
      await this.namespaceOps.dropNamespace(id);
    }
    /**
     * Loads metadata for a namespace.
     *
     * @param id - Namespace identifier to load
     * @returns Namespace metadata including properties
     *
     * @example
     * ```typescript
     * const metadata = await catalog.loadNamespaceMetadata({ namespace: ['analytics'] });
     * console.log(metadata.properties);
     * ```
     */
    async loadNamespaceMetadata(id) {
      return this.namespaceOps.loadNamespaceMetadata(id);
    }
    /**
     * Lists all tables in a namespace.
     *
     * @param namespace - Namespace identifier to list tables from
     * @returns Array of table identifiers
     *
     * @example
     * ```typescript
     * const tables = await catalog.listTables({ namespace: ['analytics'] });
     * console.log(tables); // [{ namespace: ['analytics'], name: 'events' }, ...]
     * ```
     */
    async listTables(namespace) {
      return this.tableOps.listTables(namespace);
    }
    /**
     * Creates a new table in the catalog.
     *
     * @param namespace - Namespace to create the table in
     * @param request - Table creation request including name, schema, partition spec, etc.
     * @returns Table metadata for the created table
     *
     * @example
     * ```typescript
     * const metadata = await catalog.createTable(
     *   { namespace: ['analytics'] },
     *   {
     *     name: 'events',
     *     schema: {
     *       type: 'struct',
     *       fields: [
     *         { id: 1, name: 'id', type: 'long', required: true },
     *         { id: 2, name: 'timestamp', type: 'timestamp', required: true }
     *       ],
     *       'schema-id': 0
     *     },
     *     'partition-spec': {
     *       'spec-id': 0,
     *       fields: [
     *         { source_id: 2, field_id: 1000, name: 'ts_day', transform: 'day' }
     *       ]
     *     }
     *   }
     * );
     * ```
     */
    async createTable(namespace, request) {
      return this.tableOps.createTable(namespace, request);
    }
    /**
     * Updates an existing table's metadata.
     *
     * Can update the schema, partition spec, or properties of a table.
     *
     * @param id - Table identifier to update
     * @param request - Update request with fields to modify
     * @returns Response containing the metadata location and updated table metadata
     *
     * @example
     * ```typescript
     * const response = await catalog.updateTable(
     *   { namespace: ['analytics'], name: 'events' },
     *   {
     *     properties: { 'read.split.target-size': '134217728' }
     *   }
     * );
     * console.log(response['metadata-location']); // s3://...
     * console.log(response.metadata); // TableMetadata object
     * ```
     */
    async updateTable(id, request) {
      return this.tableOps.updateTable(id, request);
    }
    /**
     * Drops a table from the catalog.
     *
     * @param id - Table identifier to drop
     *
     * @example
     * ```typescript
     * await catalog.dropTable({ namespace: ['analytics'], name: 'events' });
     * ```
     */
    async dropTable(id, options) {
      await this.tableOps.dropTable(id, options);
    }
    /**
     * Loads metadata for a table.
     *
     * @param id - Table identifier to load
     * @returns Table metadata including schema, partition spec, location, etc.
     *
     * @example
     * ```typescript
     * const metadata = await catalog.loadTable({ namespace: ['analytics'], name: 'events' });
     * console.log(metadata.schema);
     * console.log(metadata.location);
     * ```
     */
    async loadTable(id) {
      return this.tableOps.loadTable(id);
    }
    /**
     * Checks if a namespace exists in the catalog.
     *
     * @param id - Namespace identifier to check
     * @returns True if the namespace exists, false otherwise
     *
     * @example
     * ```typescript
     * const exists = await catalog.namespaceExists({ namespace: ['analytics'] });
     * console.log(exists); // true or false
     * ```
     */
    async namespaceExists(id) {
      return this.namespaceOps.namespaceExists(id);
    }
    /**
     * Checks if a table exists in the catalog.
     *
     * @param id - Table identifier to check
     * @returns True if the table exists, false otherwise
     *
     * @example
     * ```typescript
     * const exists = await catalog.tableExists({ namespace: ['analytics'], name: 'events' });
     * console.log(exists); // true or false
     * ```
     */
    async tableExists(id) {
      return this.tableOps.tableExists(id);
    }
    /**
     * Creates a namespace if it does not exist.
     *
     * If the namespace already exists, returns void. If created, returns the response.
     *
     * @param id - Namespace identifier to create
     * @param metadata - Optional metadata properties for the namespace
     * @returns Response containing the created namespace and its properties, or void if it already exists
     *
     * @example
     * ```typescript
     * const response = await catalog.createNamespaceIfNotExists(
     *   { namespace: ['analytics'] },
     *   { properties: { owner: 'data-team' } }
     * );
     * if (response) {
     *   console.log('Created:', response.namespace);
     * } else {
     *   console.log('Already exists');
     * }
     * ```
     */
    async createNamespaceIfNotExists(id, metadata) {
      return this.namespaceOps.createNamespaceIfNotExists(id, metadata);
    }
    /**
     * Creates a table if it does not exist.
     *
     * If the table already exists, returns its metadata instead.
     *
     * @param namespace - Namespace to create the table in
     * @param request - Table creation request including name, schema, partition spec, etc.
     * @returns Table metadata for the created or existing table
     *
     * @example
     * ```typescript
     * const metadata = await catalog.createTableIfNotExists(
     *   { namespace: ['analytics'] },
     *   {
     *     name: 'events',
     *     schema: {
     *       type: 'struct',
     *       fields: [
     *         { id: 1, name: 'id', type: 'long', required: true },
     *         { id: 2, name: 'timestamp', type: 'timestamp', required: true }
     *       ],
     *       'schema-id': 0
     *     }
     *   }
     * );
     * ```
     */
    async createTableIfNotExists(namespace, request) {
      return this.tableOps.createTableIfNotExists(namespace, request);
    }
  };

  // node_modules/@supabase/storage-js/dist/index.mjs
  function _typeof2(o2) {
    "@babel/helpers - typeof";
    return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
      return typeof o$1;
    } : function(o$1) {
      return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
    }, _typeof2(o2);
  }
  function toPrimitive2(t2, r2) {
    if ("object" != _typeof2(t2) || !t2) return t2;
    var e3 = t2[Symbol.toPrimitive];
    if (void 0 !== e3) {
      var i2 = e3.call(t2, r2 || "default");
      if ("object" != _typeof2(i2)) return i2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function toPropertyKey2(t2) {
    var i2 = toPrimitive2(t2, "string");
    return "symbol" == _typeof2(i2) ? i2 : i2 + "";
  }
  function _defineProperty2(e3, r2, t2) {
    return (r2 = toPropertyKey2(r2)) in e3 ? Object.defineProperty(e3, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e3[r2] = t2, e3;
  }
  function ownKeys2(e3, r2) {
    var t2 = Object.keys(e3);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e3);
      r2 && (o2 = o2.filter(function(r$1) {
        return Object.getOwnPropertyDescriptor(e3, r$1).enumerable;
      })), t2.push.apply(t2, o2);
    }
    return t2;
  }
  function _objectSpread22(e3) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys2(Object(t2), true).forEach(function(r$1) {
        _defineProperty2(e3, r$1, t2[r$1]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(t2)) : ownKeys2(Object(t2)).forEach(function(r$1) {
        Object.defineProperty(e3, r$1, Object.getOwnPropertyDescriptor(t2, r$1));
      });
    }
    return e3;
  }
  var StorageError = class extends Error {
    constructor(message, namespace = "storage", status, statusCode) {
      super(message);
      this.__isStorageError = true;
      this.namespace = namespace;
      this.name = namespace === "vectors" ? "StorageVectorsError" : "StorageError";
      this.status = status;
      this.statusCode = statusCode;
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        statusCode: this.statusCode
      };
    }
  };
  function isStorageError(error) {
    return typeof error === "object" && error !== null && "__isStorageError" in error;
  }
  var StorageApiError = class extends StorageError {
    constructor(message, status, statusCode, namespace = "storage") {
      super(message, namespace, status, statusCode);
      this.name = namespace === "vectors" ? "StorageVectorsApiError" : "StorageApiError";
      this.status = status;
      this.statusCode = statusCode;
    }
    toJSON() {
      return _objectSpread22({}, super.toJSON());
    }
  };
  var StorageUnknownError = class extends StorageError {
    constructor(message, originalError, namespace = "storage") {
      super(message, namespace);
      this.name = namespace === "vectors" ? "StorageVectorsUnknownError" : "StorageUnknownError";
      this.originalError = originalError;
    }
  };
  function setHeader(headers, name, value) {
    const result = _objectSpread22({}, headers);
    const nameLower = name.toLowerCase();
    for (const key of Object.keys(result)) if (key.toLowerCase() === nameLower) delete result[key];
    result[nameLower] = value;
    return result;
  }
  function normalizeHeaders(headers) {
    const result = {};
    for (const [key, value] of Object.entries(headers)) result[key.toLowerCase()] = value;
    return result;
  }
  var resolveFetch2 = (customFetch) => {
    if (customFetch) return (...args) => customFetch(...args);
    return (...args) => fetch(...args);
  };
  var isPlainObject = (value) => {
    if (typeof value !== "object" || value === null) return false;
    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
  };
  var recursiveToCamel = (item) => {
    if (Array.isArray(item)) return item.map((el) => recursiveToCamel(el));
    else if (typeof item === "function" || item !== Object(item)) return item;
    const result = {};
    Object.entries(item).forEach(([key, value]) => {
      const newKey = key.replace(/([-_][a-z])/gi, (c2) => c2.toUpperCase().replace(/[-_]/g, ""));
      result[newKey] = recursiveToCamel(value);
    });
    return result;
  };
  var isValidBucketName = (bucketName) => {
    if (!bucketName || typeof bucketName !== "string") return false;
    if (bucketName.length === 0 || bucketName.length > 100) return false;
    if (bucketName.trim() !== bucketName) return false;
    if (bucketName.includes("/") || bucketName.includes("\\")) return false;
    return /^[\w!.\*'() &$@=;:+,?-]+$/.test(bucketName);
  };
  var _getErrorMessage = (err) => {
    if (typeof err === "object" && err !== null) {
      const e3 = err;
      if (typeof e3.msg === "string") return e3.msg;
      if (typeof e3.message === "string") return e3.message;
      if (typeof e3.error_description === "string") return e3.error_description;
      if (typeof e3.error === "string") return e3.error;
      if (typeof e3.error === "object" && e3.error !== null) {
        const nested = e3.error;
        if (typeof nested.message === "string") return nested.message;
      }
    }
    return JSON.stringify(err);
  };
  var handleError = async (error, reject, options, namespace) => {
    if (error !== null && typeof error === "object" && "json" in error && typeof error.json === "function") {
      const responseError = error;
      let status = parseInt(String(responseError.status), 10);
      if (!Number.isFinite(status)) status = 500;
      responseError.json().then((err) => {
        const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || (err === null || err === void 0 ? void 0 : err.code) || status + "";
        reject(new StorageApiError(_getErrorMessage(err), status, statusCode, namespace));
      }).catch(() => {
        const statusCode = status + "";
        reject(new StorageApiError(responseError.statusText || `HTTP ${status} error`, status, statusCode, namespace));
      });
    } else reject(new StorageUnknownError(_getErrorMessage(error), error, namespace));
  };
  var _getRequestParams = (method, options, parameters, body) => {
    const params = {
      method,
      headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
    };
    if (method === "GET" || method === "HEAD" || !body) return _objectSpread22(_objectSpread22({}, params), parameters);
    if (isPlainObject(body)) {
      var _contentType;
      const headers = (options === null || options === void 0 ? void 0 : options.headers) || {};
      let contentType;
      for (const [key, value] of Object.entries(headers)) if (key.toLowerCase() === "content-type") contentType = value;
      params.headers = setHeader(headers, "Content-Type", (_contentType = contentType) !== null && _contentType !== void 0 ? _contentType : "application/json");
      params.body = JSON.stringify(body);
    } else params.body = body;
    if (options === null || options === void 0 ? void 0 : options.duplex) params.duplex = options.duplex;
    return _objectSpread22(_objectSpread22({}, params), parameters);
  };
  async function _handleRequest(fetcher, method, url, options, parameters, body, namespace) {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, parameters, body)).then((result) => {
        if (!result.ok) throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson) return result;
        if (namespace === "vectors") {
          const contentType = result.headers.get("content-type");
          if (result.headers.get("content-length") === "0" || result.status === 204) return {};
          if (!contentType || !contentType.includes("application/json")) return {};
        }
        return result.json();
      }).then((data) => resolve(data)).catch((error) => handleError(error, reject, options, namespace));
    });
  }
  function createFetchApi(namespace = "storage") {
    return {
      get: async (fetcher, url, options, parameters) => {
        return _handleRequest(fetcher, "GET", url, options, parameters, void 0, namespace);
      },
      post: async (fetcher, url, body, options, parameters) => {
        return _handleRequest(fetcher, "POST", url, options, parameters, body, namespace);
      },
      put: async (fetcher, url, body, options, parameters) => {
        return _handleRequest(fetcher, "PUT", url, options, parameters, body, namespace);
      },
      head: async (fetcher, url, options, parameters) => {
        return _handleRequest(fetcher, "HEAD", url, _objectSpread22(_objectSpread22({}, options), {}, { noResolveJson: true }), parameters, void 0, namespace);
      },
      remove: async (fetcher, url, body, options, parameters) => {
        return _handleRequest(fetcher, "DELETE", url, options, parameters, body, namespace);
      }
    };
  }
  var defaultApi = createFetchApi("storage");
  var { get, post, put, head, remove } = defaultApi;
  var vectorsApi = createFetchApi("vectors");
  var BaseApiClient = class {
    /**
    * Creates a new BaseApiClient instance
    * @param url - Base URL for API requests
    * @param headers - Default headers for API requests
    * @param fetch - Optional custom fetch implementation
    * @param namespace - Error namespace ('storage' or 'vectors')
    */
    constructor(url, headers = {}, fetch$1, namespace = "storage") {
      this.shouldThrowOnError = false;
      this.url = url;
      this.headers = normalizeHeaders(headers);
      this.fetch = resolveFetch2(fetch$1);
      this.namespace = namespace;
    }
    /**
    * Enable throwing errors instead of returning them.
    * When enabled, errors are thrown instead of returned in { data, error } format.
    *
    * @returns this - For method chaining
    */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /**
    * Set an HTTP header for the request.
    * Creates a shallow copy of headers to avoid mutating shared state.
    *
    * @param name - Header name
    * @param value - Header value
    * @returns this - For method chaining
    */
    setHeader(name, value) {
      this.headers = setHeader(this.headers, name, value);
      return this;
    }
    /**
    * Handles API operation with standardized error handling
    * Eliminates repetitive try-catch blocks across all API methods
    *
    * This wrapper:
    * 1. Executes the operation
    * 2. Returns { data, error: null } on success
    * 3. Returns { data: null, error } on failure (if shouldThrowOnError is false)
    * 4. Throws error on failure (if shouldThrowOnError is true)
    *
    * @typeParam T - The expected data type from the operation
    * @param operation - Async function that performs the API call
    * @returns Promise with { data, error } tuple
    *
    * @example Handling an operation
    * ```typescript
    * async listBuckets() {
    *   return this.handleOperation(async () => {
    *     return await get(this.fetch, `${this.url}/bucket`, {
    *       headers: this.headers,
    *     })
    *   })
    * }
    * ```
    */
    async handleOperation(operation) {
      var _this = this;
      try {
        return {
          data: await operation(),
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
  };
  var _Symbol$toStringTag$1;
  _Symbol$toStringTag$1 = Symbol.toStringTag;
  var StreamDownloadBuilder = class {
    constructor(downloadFn, shouldThrowOnError) {
      this.downloadFn = downloadFn;
      this.shouldThrowOnError = shouldThrowOnError;
      this[_Symbol$toStringTag$1] = "StreamDownloadBuilder";
      this.promise = null;
    }
    then(onfulfilled, onrejected) {
      return this.getPromise().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
      return this.getPromise().catch(onrejected);
    }
    finally(onfinally) {
      return this.getPromise().finally(onfinally);
    }
    getPromise() {
      if (!this.promise) this.promise = this.execute();
      return this.promise;
    }
    async execute() {
      var _this = this;
      try {
        return {
          data: (await _this.downloadFn()).body,
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
  };
  var _Symbol$toStringTag;
  _Symbol$toStringTag = Symbol.toStringTag;
  var BlobDownloadBuilder = class {
    constructor(downloadFn, shouldThrowOnError) {
      this.downloadFn = downloadFn;
      this.shouldThrowOnError = shouldThrowOnError;
      this[_Symbol$toStringTag] = "BlobDownloadBuilder";
      this.promise = null;
    }
    asStream() {
      return new StreamDownloadBuilder(this.downloadFn, this.shouldThrowOnError);
    }
    then(onfulfilled, onrejected) {
      return this.getPromise().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
      return this.getPromise().catch(onrejected);
    }
    finally(onfinally) {
      return this.getPromise().finally(onfinally);
    }
    getPromise() {
      if (!this.promise) this.promise = this.execute();
      return this.promise;
    }
    async execute() {
      var _this = this;
      try {
        return {
          data: await (await _this.downloadFn()).blob(),
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
  };
  var DEFAULT_SEARCH_OPTIONS = {
    limit: 100,
    offset: 0,
    sortBy: {
      column: "name",
      order: "asc"
    }
  };
  var DEFAULT_FILE_OPTIONS = {
    cacheControl: "3600",
    contentType: "text/plain;charset=UTF-8",
    upsert: false
  };
  var StorageFileApi = class extends BaseApiClient {
    constructor(url, headers = {}, bucketId, fetch$1) {
      super(url, headers, fetch$1, "storage");
      this.bucketId = bucketId;
    }
    /**
    * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
    *
    * @param method HTTP method.
    * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
    * @param fileBody The body of the file to be stored in the bucket.
    */
    async uploadOrUpdate(method, path, fileBody, fileOptions) {
      var _this = this;
      return _this.handleOperation(async () => {
        let body;
        const options = _objectSpread22(_objectSpread22({}, DEFAULT_FILE_OPTIONS), fileOptions);
        let headers = _objectSpread22(_objectSpread22({}, _this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
        const metadata = options.metadata;
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          if (metadata) body.append("metadata", _this.encodeMetadata(metadata));
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          if (!body.has("cacheControl")) body.append("cacheControl", options.cacheControl);
          if (metadata && !body.has("metadata")) body.append("metadata", _this.encodeMetadata(metadata));
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
          if (metadata) headers["x-metadata"] = _this.toBase64(_this.encodeMetadata(metadata));
          if ((typeof ReadableStream !== "undefined" && body instanceof ReadableStream || body && typeof body === "object" && "pipe" in body && typeof body.pipe === "function") && !options.duplex) options.duplex = "half";
        }
        if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) for (const [key, value] of Object.entries(fileOptions.headers)) headers = setHeader(headers, key, value);
        const cleanPath = _this._removeEmptyFolders(path);
        const _path = _this._getFinalPath(cleanPath);
        const data = await (method == "PUT" ? put : post)(_this.fetch, `${_this.url}/object/${_path}`, body, _objectSpread22({ headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}));
        return {
          path: cleanPath,
          id: data.Id,
          fullPath: data.Key
        };
      });
    }
    /**
    * Uploads a file to an existing bucket.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
    * @param fileBody The body of the file to be stored in the bucket.
    * @param fileOptions Optional file upload options including cacheControl, contentType, upsert, and metadata.
    * @returns Promise with response containing file path, id, and fullPath or error
    *
    * @example Upload file
    * ```js
    * const avatarFile = event.target.files[0]
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .upload('public/avatar1.png', avatarFile, {
    *     cacheControl: '3600',
    *     upsert: false
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "path": "public/avatar1.png",
    *     "fullPath": "avatars/public/avatar1.png"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @example Upload file using `ArrayBuffer` from base64 file data
    * ```js
    * import { decode } from 'base64-arraybuffer'
    *
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .upload('public/avatar1.png', decode('base64FileData'), {
    *     contentType: 'image/png'
    *   })
    * ```
    *
    * @example Handling errors
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .upload('public/avatar1.png', avatarFile)
    *
    * if (error) {
    *   // Log the full error so fields like `statusCode` and `error` (the
    *   // Storage error name, e.g. "Duplicate") aren't hidden behind `error.message`.
    *   console.error(error)
    *   return
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: only `insert` when you are uploading new files and `select`, `insert` and `update` when you are upserting files
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    * - For React Native, using either `Blob`, `File` or `FormData` does not work as intended. Upload file using `ArrayBuffer` from base64 file data instead, see example below.
    */
    async upload(path, fileBody, fileOptions) {
      return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
    }
    /**
    * Upload a file with a token generated from `createSignedUploadUrl`.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
    * @param token The token generated from `createSignedUploadUrl`
    * @param fileBody The body of the file to be stored in the bucket.
    * @param fileOptions HTTP headers (cacheControl, contentType, etc.).
    * **Note:** The `upsert` option has no effect here. To enable upsert behavior,
    * pass `{ upsert: true }` when calling `createSignedUploadUrl()` instead.
    * @returns Promise with response containing file path and fullPath or error
    *
    * @example Upload to a signed URL
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .uploadToSignedUrl('folder/cat.jpg', 'token-from-createSignedUploadUrl', file)
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "path": "folder/cat.jpg",
    *     "fullPath": "avatars/folder/cat.jpg"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: none
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async uploadToSignedUrl(path, token, fileBody, fileOptions) {
      var _this3 = this;
      const cleanPath = _this3._removeEmptyFolders(path);
      const _path = _this3._getFinalPath(cleanPath);
      const url = new URL(_this3.url + `/object/upload/sign/${_path}`);
      url.searchParams.set("token", token);
      return _this3.handleOperation(async () => {
        let body;
        const options = _objectSpread22(_objectSpread22({}, DEFAULT_FILE_OPTIONS), fileOptions);
        let headers = _objectSpread22(_objectSpread22({}, _this3.headers), { "x-upsert": String(options.upsert) });
        const metadata = options.metadata;
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          if (metadata) body.append("metadata", _this3.encodeMetadata(metadata));
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          if (!body.has("cacheControl")) body.append("cacheControl", options.cacheControl);
          if (metadata && !body.has("metadata")) body.append("metadata", _this3.encodeMetadata(metadata));
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
          if (metadata) headers["x-metadata"] = _this3.toBase64(_this3.encodeMetadata(metadata));
          if ((typeof ReadableStream !== "undefined" && body instanceof ReadableStream || body && typeof body === "object" && "pipe" in body && typeof body.pipe === "function") && !options.duplex) options.duplex = "half";
        }
        if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) for (const [key, value] of Object.entries(fileOptions.headers)) headers = setHeader(headers, key, value);
        return {
          path: cleanPath,
          fullPath: (await put(_this3.fetch, url.toString(), body, _objectSpread22({ headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}))).Key
        };
      });
    }
    /**
    * Creates a signed upload URL.
    * Signed upload URLs can be used to upload files to the bucket without further authentication.
    * They are valid for 2 hours.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The file path, including the current file name. For example `folder/image.png`.
    * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
    * @returns Promise with response containing signed upload URL, token, and path or error
    *
    * @example Create Signed Upload URL
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUploadUrl('folder/cat.jpg')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "signedUrl": "https://example.supabase.co/storage/v1/object/upload/sign/avatars/folder/cat.jpg?token=<TOKEN>",
    *     "path": "folder/cat.jpg",
    *     "token": "<TOKEN>"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: `insert`
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async createSignedUploadUrl(path, options) {
      var _this4 = this;
      return _this4.handleOperation(async () => {
        let _path = _this4._getFinalPath(path);
        const headers = _objectSpread22({}, _this4.headers);
        if (options === null || options === void 0 ? void 0 : options.upsert) headers["x-upsert"] = "true";
        const data = await post(_this4.fetch, `${_this4.url}/object/upload/sign/${_path}`, {}, { headers });
        const url = new URL(_this4.url + data.url);
        const token = url.searchParams.get("token");
        if (!token) throw new StorageError("No token returned by API");
        return {
          signedUrl: url.toString(),
          path,
          token
        };
      });
    }
    /**
    * Replaces an existing file at the specified path with a new one.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
    * @param fileBody The body of the file to be stored in the bucket.
    * @param fileOptions Optional file upload options including cacheControl, contentType, and metadata.
    * **Note:** The `upsert` option has no effect here. `update()` always replaces the
    * file at the given path, so the `x-upsert` header is not sent. To control upsert
    * behavior, use `upload()` instead.
    * @returns Promise with response containing file path, id, and fullPath or error
    *
    * @example Update file
    * ```js
    * const avatarFile = event.target.files[0]
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .update('public/avatar1.png', avatarFile, {
    *     cacheControl: '3600'
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "path": "public/avatar1.png",
    *     "fullPath": "avatars/public/avatar1.png"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @example Update file using `ArrayBuffer` from base64 file data
    * ```js
    * import {decode} from 'base64-arraybuffer'
    *
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .update('public/avatar1.png', decode('base64FileData'), {
    *     contentType: 'image/png'
    *   })
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: `update` and `select`
    * - `update()` always replaces the file at the given path regardless of the `upsert` option.
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    * - For React Native, using either `Blob`, `File` or `FormData` does not work as intended. Update file using `ArrayBuffer` from base64 file data instead, see example below.
    */
    async update(path, fileBody, fileOptions) {
      return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
    }
    /**
    * Moves an existing file to a new path in the same bucket.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
    * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
    * @param options The destination options.
    * @returns Promise with response containing success message or error
    *
    * @example Move file
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .move('public/avatar1.png', 'private/avatar2.png')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully moved"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: `update` and `select`
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async move(fromPath, toPath, options) {
      var _this6 = this;
      return _this6.handleOperation(async () => {
        return await post(_this6.fetch, `${_this6.url}/object/move`, {
          bucketId: _this6.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath,
          destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
        }, { headers: _this6.headers });
      });
    }
    /**
    * Copies an existing file to a new path in the same bucket.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
    * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
    * @param options The destination options.
    * @returns Promise with response containing copied file path or error
    *
    * @example Copy file
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .copy('public/avatar1.png', 'private/avatar2.png')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "path": "avatars/private/avatar2.png"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: `insert` and `select`
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async copy(fromPath, toPath, options) {
      var _this7 = this;
      return _this7.handleOperation(async () => {
        return { path: (await post(_this7.fetch, `${_this7.url}/object/copy`, {
          bucketId: _this7.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath,
          destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
        }, { headers: _this7.headers })).Key };
      });
    }
    /**
    * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The file path, including the current file name. For example `folder/image.png`.
    * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
    * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
    * @param options.transform Transform the asset before serving it to the client.
    * @param options.cacheNonce Append a cache nonce parameter to the URL to invalidate the cache.
    * @returns Promise with response containing signed URL or error
    *
    * @example Create Signed URL
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUrl('folder/avatar1.png', 60)
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar1.png?token=<TOKEN>"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @example Create a signed URL for an asset with transformations
    * ```js
    * const { data } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUrl('folder/avatar1.png', 60, {
    *     transform: {
    *       width: 100,
    *       height: 100,
    *     }
    *   })
    * ```
    *
    * @example Create a signed URL which triggers the download of the asset
    * ```js
    * const { data } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUrl('folder/avatar1.png', 60, {
    *     download: true,
    *   })
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: `select`
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async createSignedUrl(path, expiresIn, options) {
      var _this8 = this;
      return _this8.handleOperation(async () => {
        let _path = _this8._getFinalPath(path);
        const hasTransform = typeof (options === null || options === void 0 ? void 0 : options.transform) === "object" && options.transform !== null && Object.keys(options.transform).length > 0;
        let data = await post(_this8.fetch, `${_this8.url}/object/sign/${_path}`, _objectSpread22({ expiresIn }, hasTransform ? { transform: options.transform } : {}), { headers: _this8.headers });
        const query = new URLSearchParams();
        if (options === null || options === void 0 ? void 0 : options.download) query.set("download", options.download === true ? "" : options.download);
        if ((options === null || options === void 0 ? void 0 : options.cacheNonce) != null) query.set("cacheNonce", String(options.cacheNonce));
        const queryString = query.toString();
        return { signedUrl: encodeURI(`${_this8.url}${data.signedURL}${queryString ? `&${queryString}` : ""}`) };
      });
    }
    /**
    * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
    * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
    * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
    * @param options.cacheNonce Append a cache nonce parameter to the URL to invalidate the cache.
    * @returns Promise with response containing array of objects with signedUrl, path, and error or error
    *
    * @example Create Signed URLs
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUrls(['folder/avatar1.png', 'folder/avatar2.png'], 60)
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": [
    *     {
    *       "error": null,
    *       "path": "folder/avatar1.png",
    *       "signedURL": "/object/sign/avatars/folder/avatar1.png?token=<TOKEN>",
    *       "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar1.png?token=<TOKEN>"
    *     },
    *     {
    *       "error": null,
    *       "path": "folder/avatar2.png",
    *       "signedURL": "/object/sign/avatars/folder/avatar2.png?token=<TOKEN>",
    *       "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar2.png?token=<TOKEN>"
    *     }
    *   ],
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: `select`
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async createSignedUrls(paths, expiresIn, options) {
      var _this9 = this;
      return _this9.handleOperation(async () => {
        const data = await post(_this9.fetch, `${_this9.url}/object/sign/${_this9.bucketId}`, {
          expiresIn,
          paths
        }, { headers: _this9.headers });
        const query = new URLSearchParams();
        if (options === null || options === void 0 ? void 0 : options.download) query.set("download", options.download === true ? "" : options.download);
        if ((options === null || options === void 0 ? void 0 : options.cacheNonce) != null) query.set("cacheNonce", String(options.cacheNonce));
        const queryString = query.toString();
        return data.map((datum) => _objectSpread22(_objectSpread22({}, datum), {}, { signedUrl: datum.signedURL ? encodeURI(`${_this9.url}${datum.signedURL}${queryString ? `&${queryString}` : ""}`) : null }));
      });
    }
    /**
    * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
    * @param options.transform Transform the asset before serving it to the client.
    * @param options.cacheNonce Append a cache nonce parameter to the URL to invalidate the cache.
    * @param parameters Additional fetch parameters like signal for cancellation. Supports standard fetch options including cache control.
    * @returns BlobDownloadBuilder instance for downloading the file
    *
    * @example Download file
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .download('folder/avatar1.png')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": <BLOB>,
    *   "error": null
    * }
    * ```
    *
    * @example Download file with transformations
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .download('folder/avatar1.png', {
    *     transform: {
    *       width: 100,
    *       height: 100,
    *       quality: 80
    *     }
    *   })
    * ```
    *
    * @example Download with cache control (useful in Edge Functions)
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .download('folder/avatar1.png', {}, { cache: 'no-store' })
    * ```
    *
    * @example Download with abort signal
    * ```js
    * const controller = new AbortController()
    * setTimeout(() => controller.abort(), 5000)
    *
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .download('folder/avatar1.png', {}, { signal: controller.signal })
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: `select`
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    download(path, options, parameters) {
      const renderPath = typeof (options === null || options === void 0 ? void 0 : options.transform) === "object" && options.transform !== null && Object.keys(options.transform).length > 0 ? "render/image/authenticated" : "object";
      const query = new URLSearchParams();
      if (options === null || options === void 0 ? void 0 : options.transform) this.applyTransformOptsToQuery(query, options.transform);
      if ((options === null || options === void 0 ? void 0 : options.cacheNonce) != null) query.set("cacheNonce", String(options.cacheNonce));
      const queryString = query.toString();
      const _path = this._getFinalPath(path);
      const downloadFn = () => get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString ? `?${queryString}` : ""}`, {
        headers: this.headers,
        noResolveJson: true
      }, parameters);
      return new BlobDownloadBuilder(downloadFn, this.shouldThrowOnError);
    }
    /**
    * Retrieves the details of an existing file.
    *
    * Returns detailed file metadata including size, content type, and timestamps.
    * Note: The API returns `last_modified` field, not `updated_at`.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The file path, including the file name. For example `folder/image.png`.
    * @returns Promise with response containing file metadata or error
    *
    * @example Get file info
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .info('folder/avatar1.png')
    *
    * if (data) {
    *   console.log('Last modified:', data.lastModified)
    *   console.log('Size:', data.size)
    * }
    * ```
    */
    async info(path) {
      var _this10 = this;
      const _path = _this10._getFinalPath(path);
      return _this10.handleOperation(async () => {
        return recursiveToCamel(await get(_this10.fetch, `${_this10.url}/object/info/${_path}`, { headers: _this10.headers }));
      });
    }
    /**
    * Checks the existence of a file.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The file path, including the file name. For example `folder/image.png`.
    * @returns Promise with response containing boolean indicating file existence or error
    *
    * @example Check file existence
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .exists('folder/avatar1.png')
    * ```
    */
    async exists(path) {
      var _this11 = this;
      const _path = _this11._getFinalPath(path);
      try {
        await head(_this11.fetch, `${_this11.url}/object/${_path}`, { headers: _this11.headers });
        return {
          data: true,
          error: null
        };
      } catch (error) {
        if (_this11.shouldThrowOnError) throw error;
        if (isStorageError(error)) {
          var _error$originalError;
          const status = error instanceof StorageApiError ? error.status : error instanceof StorageUnknownError ? (_error$originalError = error.originalError) === null || _error$originalError === void 0 ? void 0 : _error$originalError.status : void 0;
          if (status !== void 0 && [400, 404].includes(status)) return {
            data: false,
            error
          };
        }
        throw error;
      }
    }
    /**
    * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
    * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
    * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
    * @param options.transform Transform the asset before serving it to the client.
    * @param options.cacheNonce Append a cache nonce parameter to the URL to invalidate the cache.
    * @returns Object with public URL
    *
    * @example Returns the URL for an asset in a public bucket
    * ```js
    * const { data } = supabase
    *   .storage
    *   .from('public-bucket')
    *   .getPublicUrl('folder/avatar1.png')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "publicUrl": "https://example.supabase.co/storage/v1/object/public/public-bucket/folder/avatar1.png"
    *   }
    * }
    * ```
    *
    * @example Returns the URL for an asset in a public bucket with transformations
    * ```js
    * const { data } = supabase
    *   .storage
    *   .from('public-bucket')
    *   .getPublicUrl('folder/avatar1.png', {
    *     transform: {
    *       width: 100,
    *       height: 100,
    *     }
    *   })
    * ```
    *
    * @example Returns the URL which triggers the download of an asset in a public bucket
    * ```js
    * const { data } = supabase
    *   .storage
    *   .from('public-bucket')
    *   .getPublicUrl('folder/avatar1.png', {
    *     download: true,
    *   })
    * ```
    *
    * @remarks
    * - The bucket needs to be set to public, either via [updateBucket()](/docs/reference/javascript/storage-updatebucket) or by going to Storage on [supabase.com/dashboard](https://supabase.com/dashboard), clicking the overflow menu on a bucket and choosing "Make public"
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: none
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    getPublicUrl(path, options) {
      const _path = this._getFinalPath(path);
      const query = new URLSearchParams();
      if (options === null || options === void 0 ? void 0 : options.download) query.set("download", options.download === true ? "" : options.download);
      if (options === null || options === void 0 ? void 0 : options.transform) this.applyTransformOptsToQuery(query, options.transform);
      if ((options === null || options === void 0 ? void 0 : options.cacheNonce) != null) query.set("cacheNonce", String(options.cacheNonce));
      const queryString = query.toString();
      const renderPath = typeof (options === null || options === void 0 ? void 0 : options.transform) === "object" && options.transform !== null && Object.keys(options.transform).length > 0 ? "render/image" : "object";
      return { data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}`) + (queryString ? `?${queryString}` : "") } };
    }
    /**
    * Deletes files within the same bucket
    *
    * Returns an array of FileObject entries for the deleted files. Note that deprecated
    * fields like `bucket_id` may or may not be present in the response - do not rely on them.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
    * @returns Promise with response containing array of deleted file objects or error
    *
    * @example Delete file
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .remove(['folder/avatar1.png'])
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": [],
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: `delete` and `select`
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async remove(paths) {
      var _this12 = this;
      return _this12.handleOperation(async () => {
        return await remove(_this12.fetch, `${_this12.url}/object/${_this12.bucketId}`, { prefixes: paths }, { headers: _this12.headers });
      });
    }
    /**
    * Purges the CDN cache for a single object in this bucket.
    *
    * Maps to `DELETE /cdn/{bucket}/{path}` on the Storage API. The server
    * issues a CDN invalidation for the object and returns `{ message: 'success' }`.
    *
    * **Requires the `service_role` key.** The underlying endpoint enforces
    * `service_role` JWT — calls made with the anon key or a user JWT will be
    * rejected by the server.
    *
    * **Hosted CDN feature.** On self-hosted Supabase, the Storage service must
    * have `CDN_PURGE_ENDPOINT_URL` configured and the `purgeCache` tenant
    * feature enabled, otherwise the server returns an error.
    *
    * Operates on a single object path. There is no wildcard or recursion: pass
    * the exact path of the object you want invalidated.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The path (relative to the bucket) of the object to purge, e.g. `folder/avatar.png`.
    * @param options Optional purge cache options.
    * @param options.transformations If true, purges only transformations (resized/formatted variants), leaving the original cached file intact.
    * @param parameters Optional fetch parameters such as an `AbortController` signal.
    * @returns Promise with `{ data: { message }, error: null }` on success or `{ data: null, error }` on failure.
    *
    * @example Purge a single cached object
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .purgeCache('folder/avatar1.png')
    * ```
    *
    * @example Purge only transformations for a single object
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .purgeCache('folder/avatar1.png', { transformations: true })
    * ```
    */
    async purgeCache(path, options, parameters) {
      var _this13 = this;
      return _this13.handleOperation(async () => {
        const _path = _this13._getFinalPath(path);
        const query = new URLSearchParams();
        if (options === null || options === void 0 ? void 0 : options.transformations) query.set("transformations", "true");
        const queryString = query.toString();
        return await remove(_this13.fetch, `${_this13.url}/cdn/${_path}${queryString ? `?${queryString}` : ""}`, {}, { headers: _this13.headers }, parameters);
      });
    }
    /**
    * Get file metadata
    * @param id the file id to retrieve metadata
    */
    /**
    * Update file metadata
    * @param id the file id to update metadata
    * @param meta the new file metadata
    */
    /**
    * Lists all the files and folders within a path of the bucket.
    *
    * **Important:** For folder entries, fields like `id`, `updated_at`, `created_at`,
    * `last_accessed_at`, and `metadata` will be `null`. Only files have these fields populated.
    * Additionally, deprecated fields like `bucket_id`, `owner`, and `buckets` are NOT returned
    * by this method.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param path The folder path.
    * @param options Search options including limit (defaults to 100), offset, sortBy, and search
    * @param parameters Optional fetch parameters including signal for cancellation
    * @returns Promise with response containing array of files/folders or error
    *
    * @example List files in a bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .list('folder', {
    *     limit: 100,
    *     offset: 0,
    *     sortBy: { column: 'name', order: 'asc' },
    *   })
    *
    * // Handle files vs folders
    * data?.forEach(item => {
    *   if (item.id !== null) {
    *     // It's a file
    *     console.log('File:', item.name, 'Size:', item.metadata?.size)
    *   } else {
    *     // It's a folder
    *     console.log('Folder:', item.name)
    *   }
    * })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "avatar1.png",
    *       "id": "e668cf7f-821b-4a2f-9dce-7dfa5dd1cfd2",
    *       "updated_at": "2024-05-22T23:06:05.580Z",
    *       "created_at": "2024-05-22T23:04:34.443Z",
    *       "last_accessed_at": "2024-05-22T23:04:34.443Z",
    *       "metadata": {
    *         "eTag": "\"c5e8c553235d9af30ef4f6e280790b92\"",
    *         "size": 32175,
    *         "mimetype": "image/png",
    *         "cacheControl": "max-age=3600",
    *         "lastModified": "2024-05-22T23:06:05.574Z",
    *         "contentLength": 32175,
    *         "httpStatusCode": 200
    *       }
    *     }
    *   ],
    *   "error": null
    * }
    * ```
    *
    * @example Search files in a bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .list('folder', {
    *     limit: 100,
    *     offset: 0,
    *     sortBy: { column: 'name', order: 'asc' },
    *     search: 'jon'
    *   })
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: none
    *   - `objects` table permissions: `select`
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async list(path, options, parameters) {
      var _this14 = this;
      return _this14.handleOperation(async () => {
        const sortBy = (options === null || options === void 0 ? void 0 : options.sortBy) ? _objectSpread22(_objectSpread22({}, DEFAULT_SEARCH_OPTIONS.sortBy), options.sortBy) : DEFAULT_SEARCH_OPTIONS.sortBy;
        const body = _objectSpread22(_objectSpread22(_objectSpread22({}, DEFAULT_SEARCH_OPTIONS), options), {}, {
          sortBy,
          prefix: path || ""
        });
        return await post(_this14.fetch, `${_this14.url}/object/list/${_this14.bucketId}`, body, { headers: _this14.headers }, parameters);
      });
    }
    /**
    * Lists all the files and folders within a bucket using the V2 API with pagination support.
    *
    * **Important:** Folder entries in the `folders` array only contain `name` and optionally `key` —
    * they have no `id`, timestamps, or `metadata` fields. Full file metadata is only available
    * on entries in the `objects` array.
    *
    * @experimental this method signature might change in the future
    *
    * @category Storage
    * @subcategory File Buckets
    * @param options Search options including prefix, cursor for pagination, limit, with_delimiter
    * @param parameters Optional fetch parameters including signal for cancellation
    * @returns Promise with response containing folders/objects arrays with pagination info or error
    *
    * @example List files with pagination
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .listV2({
    *     prefix: 'folder/',
    *     limit: 100,
    *   })
    *
    * // Handle pagination
    * if (data?.hasNext) {
    *   const nextPage = await supabase
    *     .storage
    *     .from('avatars')
    *     .listV2({
    *       prefix: 'folder/',
    *       cursor: data.nextCursor,
    *     })
    * }
    *
    * // Handle files vs folders
    * data?.objects.forEach(file => {
    *   if (file.id !== null) {
    *     console.log('File:', file.name, 'Size:', file.metadata?.size)
    *   }
    * })
    * data?.folders.forEach(folder => {
    *   console.log('Folder:', folder.name)
    * })
    * ```
    */
    async listV2(options, parameters) {
      var _this15 = this;
      return _this15.handleOperation(async () => {
        const body = _objectSpread22({}, options);
        return await post(_this15.fetch, `${_this15.url}/object/list-v2/${_this15.bucketId}`, body, { headers: _this15.headers }, parameters);
      });
    }
    encodeMetadata(metadata) {
      return JSON.stringify(metadata);
    }
    toBase64(data) {
      if (typeof Buffer !== "undefined") return Buffer.from(data).toString("base64");
      return btoa(data);
    }
    _getFinalPath(path) {
      return `${this.bucketId}/${path.replace(/^\/+/, "")}`;
    }
    _removeEmptyFolders(path) {
      return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
    }
    /** Modifies the `query`, appending values the from `transform` */
    applyTransformOptsToQuery(query, transform) {
      if (transform.width) query.set("width", transform.width.toString());
      if (transform.height) query.set("height", transform.height.toString());
      if (transform.resize) query.set("resize", transform.resize);
      if (transform.format) query.set("format", transform.format);
      if (transform.quality) query.set("quality", transform.quality.toString());
      return query;
    }
  };
  var version2 = "2.110.0";
  var DEFAULT_HEADERS = { "X-Client-Info": `storage-js/${version2}` };
  var StorageBucketApi = class extends BaseApiClient {
    constructor(url, headers = {}, fetch$1, opts) {
      const baseUrl = new URL(url);
      if (opts === null || opts === void 0 ? void 0 : opts.useNewHostname) {
        if (/supabase\.(co|in|red)$/.test(baseUrl.hostname) && !baseUrl.hostname.includes("storage.supabase.")) baseUrl.hostname = baseUrl.hostname.replace("supabase.", "storage.supabase.");
      }
      const finalUrl = baseUrl.href.replace(/\/$/, "");
      const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), headers);
      super(finalUrl, finalHeaders, fetch$1, "storage");
    }
    /**
    * Retrieves the details of all Storage buckets within an existing project.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param options Query parameters for listing buckets
    * @param options.limit Maximum number of buckets to return
    * @param options.offset Number of buckets to skip
    * @param options.sortColumn Column to sort by ('id', 'name', 'created_at', 'updated_at')
    * @param options.sortOrder Sort order ('asc' or 'desc')
    * @param options.search Search term to filter bucket names
    * @returns Promise with response containing array of buckets or error
    *
    * @example List buckets
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .listBuckets()
    * ```
    *
    * @example List buckets with options
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .listBuckets({
    *     limit: 10,
    *     offset: 0,
    *     sortColumn: 'created_at',
    *     sortOrder: 'desc',
    *     search: 'prod'
    *   })
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: `select`
    *   - `objects` table permissions: none
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async listBuckets(options) {
      var _this = this;
      return _this.handleOperation(async () => {
        const queryString = _this.listBucketOptionsToQueryString(options);
        return await get(_this.fetch, `${_this.url}/bucket${queryString}`, { headers: _this.headers });
      });
    }
    /**
    * Retrieves the details of an existing Storage bucket.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param id The unique identifier of the bucket you would like to retrieve.
    * @returns Promise with response containing bucket details or error
    *
    * @example Get bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .getBucket('avatars')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "id": "avatars",
    *     "name": "avatars",
    *     "owner": "",
    *     "public": false,
    *     "file_size_limit": 1024,
    *     "allowed_mime_types": [
    *       "image/png"
    *     ],
    *     "created_at": "2024-05-22T22:26:05.100Z",
    *     "updated_at": "2024-05-22T22:26:05.100Z"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: `select`
    *   - `objects` table permissions: none
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async getBucket(id) {
      var _this2 = this;
      return _this2.handleOperation(async () => {
        return await get(_this2.fetch, `${_this2.url}/bucket/${id}`, { headers: _this2.headers });
      });
    }
    /**
    * Creates a new Storage bucket
    *
    * @category Storage
    * @subcategory File Buckets
    * @param id A unique identifier for the bucket you are creating.
    * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
    * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
    * The global file size limit takes precedence over this value.
    * The default value is null, which doesn't set a per bucket file size limit.
    * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
    * The default value is null, which allows files with all mime types to be uploaded.
    * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
    * @param options.type (private-beta) specifies the bucket type. see `BucketType` for more details.
    *   - default bucket type is `STANDARD`
    * @returns Promise with response containing newly created bucket name or error
    *
    * @example Create bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .createBucket('avatars', {
    *     public: false,
    *     allowedMimeTypes: ['image/png'],
    *     fileSizeLimit: 1024
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "name": "avatars"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: `insert`
    *   - `objects` table permissions: none
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async createBucket(id, options = { public: false }) {
      var _this3 = this;
      return _this3.handleOperation(async () => {
        return await post(_this3.fetch, `${_this3.url}/bucket`, {
          id,
          name: id,
          type: options.type,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: _this3.headers });
      });
    }
    /**
    * Updates a Storage bucket
    *
    * @category Storage
    * @subcategory File Buckets
    * @param id A unique identifier for the bucket you are updating.
    * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
    * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
    * The global file size limit takes precedence over this value.
    * The default value is null, which doesn't set a per bucket file size limit.
    * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
    * The default value is null, which allows files with all mime types to be uploaded.
    * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
    * @returns Promise with response containing success message or error
    *
    * @example Update bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .updateBucket('avatars', {
    *     public: false,
    *     allowedMimeTypes: ['image/png'],
    *     fileSizeLimit: 1024
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully updated"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: `select` and `update`
    *   - `objects` table permissions: none
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async updateBucket(id, options) {
      var _this4 = this;
      return _this4.handleOperation(async () => {
        return await put(_this4.fetch, `${_this4.url}/bucket/${id}`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: _this4.headers });
      });
    }
    /**
    * Removes all objects inside a single bucket.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param id The unique identifier of the bucket you would like to empty.
    * @returns Promise with success message or error
    *
    * @example Empty bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .emptyBucket('avatars')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully emptied"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: `select`
    *   - `objects` table permissions: `select` and `delete`
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async emptyBucket(id) {
      var _this5 = this;
      return _this5.handleOperation(async () => {
        return await post(_this5.fetch, `${_this5.url}/bucket/${id}/empty`, {}, { headers: _this5.headers });
      });
    }
    /**
    * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
    * You must first `empty()` the bucket.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param id The unique identifier of the bucket you would like to delete.
    * @returns Promise with success message or error
    *
    * @example Delete bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .deleteBucket('avatars')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully deleted"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - RLS policy permissions required:
    *   - `buckets` table permissions: `select` and `delete`
    *   - `objects` table permissions: none
    * - Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
    */
    async deleteBucket(id) {
      var _this6 = this;
      return _this6.handleOperation(async () => {
        return await remove(_this6.fetch, `${_this6.url}/bucket/${id}`, {}, { headers: _this6.headers });
      });
    }
    /**
    * Purges the CDN cache for an entire bucket.
    *
    * Maps to `DELETE /cdn/{bucket}` on the Storage API. The server
    * issues a CDN invalidation for the bucket and returns `{ message: 'success' }`.
    *
    * **Requires the `service_role` key.** The underlying endpoint enforces
    * `service_role` JWT — calls made with the anon key or a user JWT will be
    * rejected by the server.
    *
    * **Hosted CDN feature.** On self-hosted Supabase, the Storage service must
    * have `CDN_PURGE_ENDPOINT_URL` configured and the `purgeCache` tenant
    * feature enabled, otherwise the server returns an error.
    *
    * @category Storage
    * @subcategory File Buckets
    * @param id The unique identifier of the bucket you would like to purge from cache.
    * @param options Optional purge cache options.
    * @param options.transformations If true, purges only transformations (resized/formatted variants), leaving original cached files intact.
    * @param parameters Optional fetch parameters such as an `AbortController` signal.
    * @returns Promise with `{ data: { message }, error: null }` on success or `{ data: null, error }` on failure.
    *
    * @example Purge cache for an entire bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .purgeBucketCache('avatars')
    * ```
    *
    * @example Purge only transformations for an entire bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .purgeBucketCache('avatars', { transformations: true })
    * ```
    */
    async purgeBucketCache(id, options, parameters) {
      var _this7 = this;
      return _this7.handleOperation(async () => {
        const query = new URLSearchParams();
        if (options === null || options === void 0 ? void 0 : options.transformations) query.set("transformations", "true");
        const queryString = query.toString();
        return await remove(_this7.fetch, `${_this7.url}/cdn/${id}${queryString ? `?${queryString}` : ""}`, {}, { headers: _this7.headers }, parameters);
      });
    }
    listBucketOptionsToQueryString(options) {
      const params = {};
      if (options) {
        if ("limit" in options) params.limit = String(options.limit);
        if ("offset" in options) params.offset = String(options.offset);
        if (options.search) params.search = options.search;
        if (options.sortColumn) params.sortColumn = options.sortColumn;
        if (options.sortOrder) params.sortOrder = options.sortOrder;
      }
      return Object.keys(params).length > 0 ? "?" + new URLSearchParams(params).toString() : "";
    }
  };
  var StorageAnalyticsClient = class extends BaseApiClient {
    /**
    * @alpha
    *
    * Creates a new StorageAnalyticsClient instance
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Analytics Buckets
    * @param url - The base URL for the storage API
    * @param headers - HTTP headers to include in requests
    * @param fetch - Optional custom fetch implementation
    *
    * @example Using supabase-js (recommended)
    * ```typescript
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
    * const { data, error } = await supabase.storage.analytics.listBuckets()
    * ```
    *
    * @example Standalone import for bundle-sensitive environments
    * ```typescript
    * import { StorageAnalyticsClient } from '@supabase/storage-js'
    *
    * const client = new StorageAnalyticsClient(url, headers)
    * ```
    */
    constructor(url, headers = {}, fetch$1) {
      const finalUrl = url.replace(/\/$/, "");
      const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), headers);
      super(finalUrl, finalHeaders, fetch$1, "storage");
    }
    /**
    * @alpha
    *
    * Creates a new analytics bucket using Iceberg tables
    * Analytics buckets are optimized for analytical queries and data processing
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Analytics Buckets
    * @param name A unique name for the bucket you are creating
    * @returns Promise with response containing newly created analytics bucket or error
    *
    * @example Create analytics bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .analytics
    *   .createBucket('analytics-data')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "name": "analytics-data",
    *     "type": "ANALYTICS",
    *     "format": "iceberg",
    *     "created_at": "2024-05-22T22:26:05.100Z",
    *     "updated_at": "2024-05-22T22:26:05.100Z"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - Creates a new analytics bucket using Iceberg tables
    * - Analytics buckets are optimized for analytical queries and data processing
    */
    async createBucket(name) {
      var _this = this;
      return _this.handleOperation(async () => {
        return await post(_this.fetch, `${_this.url}/bucket`, { name }, { headers: _this.headers });
      });
    }
    /**
    * @alpha
    *
    * Retrieves the details of all Analytics Storage buckets within an existing project
    * Only returns buckets of type 'ANALYTICS'
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Analytics Buckets
    * @param options Query parameters for listing buckets
    * @param options.limit Maximum number of buckets to return
    * @param options.offset Number of buckets to skip
    * @param options.sortColumn Column to sort by ('name', 'created_at', 'updated_at')
    * @param options.sortOrder Sort order ('asc' or 'desc')
    * @param options.search Search term to filter bucket names
    * @returns Promise with response containing array of analytics buckets or error
    *
    * @example List analytics buckets
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .analytics
    *   .listBuckets({
    *     limit: 10,
    *     offset: 0,
    *     sortColumn: 'created_at',
    *     sortOrder: 'desc'
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "analytics-data",
    *       "type": "ANALYTICS",
    *       "format": "iceberg",
    *       "created_at": "2024-05-22T22:26:05.100Z",
    *       "updated_at": "2024-05-22T22:26:05.100Z"
    *     }
    *   ],
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - Retrieves the details of all Analytics Storage buckets within an existing project
    * - Only returns buckets of type 'ANALYTICS'
    */
    async listBuckets(options) {
      var _this2 = this;
      return _this2.handleOperation(async () => {
        const queryParams = new URLSearchParams();
        if ((options === null || options === void 0 ? void 0 : options.limit) !== void 0) queryParams.set("limit", options.limit.toString());
        if ((options === null || options === void 0 ? void 0 : options.offset) !== void 0) queryParams.set("offset", options.offset.toString());
        if (options === null || options === void 0 ? void 0 : options.sortColumn) queryParams.set("sortColumn", options.sortColumn);
        if (options === null || options === void 0 ? void 0 : options.sortOrder) queryParams.set("sortOrder", options.sortOrder);
        if (options === null || options === void 0 ? void 0 : options.search) queryParams.set("search", options.search);
        const queryString = queryParams.toString();
        const url = queryString ? `${_this2.url}/bucket?${queryString}` : `${_this2.url}/bucket`;
        return await get(_this2.fetch, url, { headers: _this2.headers });
      });
    }
    /**
    * @alpha
    *
    * Deletes an existing analytics bucket
    * A bucket can't be deleted with existing objects inside it
    * You must first empty the bucket before deletion
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Analytics Buckets
    * @param bucketName The unique identifier of the bucket you would like to delete
    * @returns Promise with response containing success message or error
    *
    * @example Delete analytics bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .analytics
    *   .deleteBucket('analytics-data')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully deleted"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @remarks
    * - Deletes an analytics bucket
    */
    async deleteBucket(bucketName) {
      var _this3 = this;
      return _this3.handleOperation(async () => {
        return await remove(_this3.fetch, `${_this3.url}/bucket/${bucketName}`, {}, { headers: _this3.headers });
      });
    }
    /**
    * @alpha
    *
    * Get an Iceberg REST Catalog client configured for a specific analytics bucket
    * Use this to perform advanced table and namespace operations within the bucket
    * The returned client provides full access to the Apache Iceberg REST Catalog API
    * with the Supabase `{ data, error }` pattern for consistent error handling on all operations.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Analytics Buckets
    * @param bucketName - The name of the analytics bucket (warehouse) to connect to
    * @returns The wrapped Iceberg catalog client
    * @throws {StorageError} If the bucket name is invalid
    *
    * @example Get catalog and create table
    * ```js
    * // First, create an analytics bucket
    * const { data: bucket, error: bucketError } = await supabase
    *   .storage
    *   .analytics
    *   .createBucket('analytics-data')
    *
    * // Get the Iceberg catalog for that bucket
    * const catalog = supabase.storage.analytics.from('analytics-data')
    *
    * // Create a namespace
    * const { error: nsError } = await catalog.createNamespace({ namespace: ['default'] })
    *
    * // Create a table with schema
    * const { data: tableMetadata, error: tableError } = await catalog.createTable(
    *   { namespace: ['default'] },
    *   {
    *     name: 'events',
    *     schema: {
    *       type: 'struct',
    *       fields: [
    *         { id: 1, name: 'id', type: 'long', required: true },
    *         { id: 2, name: 'timestamp', type: 'timestamp', required: true },
    *         { id: 3, name: 'user_id', type: 'string', required: false }
    *       ],
    *       'schema-id': 0,
    *       'identifier-field-ids': [1]
    *     },
    *     'partition-spec': {
    *       'spec-id': 0,
    *       fields: []
    *     },
    *     'write-order': {
    *       'order-id': 0,
    *       fields: []
    *     },
    *     properties: {
    *       'write.format.default': 'parquet'
    *     }
    *   }
    * )
    * ```
    *
    * @example List tables in namespace
    * ```js
    * const catalog = supabase.storage.analytics.from('analytics-data')
    *
    * // List all tables in the default namespace
    * const { data: tables, error: listError } = await catalog.listTables({ namespace: ['default'] })
    * if (listError) {
    *   if (listError.isNotFound()) {
    *     console.log('Namespace not found')
    *   }
    *   return
    * }
    * console.log(tables) // [{ namespace: ['default'], name: 'events' }]
    * ```
    *
    * @example Working with namespaces
    * ```js
    * const catalog = supabase.storage.analytics.from('analytics-data')
    *
    * // List all namespaces
    * const { data: namespaces } = await catalog.listNamespaces()
    *
    * // Create namespace with properties
    * await catalog.createNamespace(
    *   { namespace: ['production'] },
    *   { properties: { owner: 'data-team', env: 'prod' } }
    * )
    * ```
    *
    * @example Cleanup operations
    * ```js
    * const catalog = supabase.storage.analytics.from('analytics-data')
    *
    * // Drop table with purge option (removes all data)
    * const { error: dropError } = await catalog.dropTable(
    *   { namespace: ['default'], name: 'events' },
    *   { purge: true }
    * )
    *
    * if (dropError?.isNotFound()) {
    *   console.log('Table does not exist')
    * }
    *
    * // Drop namespace (must be empty)
    * await catalog.dropNamespace({ namespace: ['default'] })
    * ```
    *
    * @remarks
    * This method provides a bridge between Supabase's bucket management and the standard
    * Apache Iceberg REST Catalog API. The bucket name maps to the Iceberg warehouse parameter.
    * All authentication and configuration is handled automatically using your Supabase credentials.
    *
    * **Error Handling**: Invalid bucket names throw immediately. All catalog
    * operations return `{ data, error }` where errors are `IcebergError` instances from iceberg-js.
    * Use helper methods like `error.isNotFound()` or check `error.status` for specific error handling.
    * Use `.throwOnError()` on the analytics client if you prefer exceptions for catalog operations.
    *
    * **Cleanup Operations**: When using `dropTable`, the `purge: true` option permanently
    * deletes all table data. Without it, the table is marked as deleted but data remains.
    *
    * **Library Dependency**: The returned catalog wraps `IcebergRestCatalog` from iceberg-js.
    * For complete API documentation and advanced usage, refer to the
    * [iceberg-js documentation](https://supabase.github.io/iceberg-js/).
    */
    from(bucketName) {
      var _this4 = this;
      if (!isValidBucketName(bucketName)) throw new StorageError("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");
      const catalog = new IcebergRestCatalog({
        baseUrl: this.url,
        catalogName: bucketName,
        auth: {
          type: "custom",
          getHeaders: async () => _this4.headers
        },
        fetch: this.fetch
      });
      const shouldThrowOnError = this.shouldThrowOnError;
      return new Proxy(catalog, { get(target, prop) {
        const value = target[prop];
        if (typeof value !== "function") return value;
        return async (...args) => {
          try {
            return {
              data: await value.apply(target, args),
              error: null
            };
          } catch (error) {
            if (shouldThrowOnError) throw error;
            return {
              data: null,
              error
            };
          }
        };
      } });
    }
  };
  var VectorIndexApi = class extends BaseApiClient {
    /** Creates a new VectorIndexApi instance */
    constructor(url, headers = {}, fetch$1) {
      const finalUrl = url.replace(/\/$/, "");
      const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), {}, { "Content-Type": "application/json" }, headers);
      super(finalUrl, finalHeaders, fetch$1, "vectors");
    }
    /** Creates a new vector index within a bucket */
    async createIndex(options) {
      var _this = this;
      return _this.handleOperation(async () => {
        return await vectorsApi.post(_this.fetch, `${_this.url}/CreateIndex`, options, { headers: _this.headers }) || {};
      });
    }
    /** Retrieves metadata for a specific vector index */
    async getIndex(vectorBucketName, indexName) {
      var _this2 = this;
      return _this2.handleOperation(async () => {
        return await vectorsApi.post(_this2.fetch, `${_this2.url}/GetIndex`, {
          vectorBucketName,
          indexName
        }, { headers: _this2.headers });
      });
    }
    /** Lists vector indexes within a bucket with optional filtering and pagination */
    async listIndexes(options) {
      var _this3 = this;
      return _this3.handleOperation(async () => {
        return await vectorsApi.post(_this3.fetch, `${_this3.url}/ListIndexes`, options, { headers: _this3.headers });
      });
    }
    /** Deletes a vector index and all its data */
    async deleteIndex(vectorBucketName, indexName) {
      var _this4 = this;
      return _this4.handleOperation(async () => {
        return await vectorsApi.post(_this4.fetch, `${_this4.url}/DeleteIndex`, {
          vectorBucketName,
          indexName
        }, { headers: _this4.headers }) || {};
      });
    }
  };
  var VectorDataApi = class extends BaseApiClient {
    /** Creates a new VectorDataApi instance */
    constructor(url, headers = {}, fetch$1) {
      const finalUrl = url.replace(/\/$/, "");
      const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), {}, { "Content-Type": "application/json" }, headers);
      super(finalUrl, finalHeaders, fetch$1, "vectors");
    }
    /** Inserts or updates vectors in batch (1-500 per request) */
    async putVectors(options) {
      var _this = this;
      if (options.vectors.length < 1 || options.vectors.length > 500) throw new Error("Vector batch size must be between 1 and 500 items");
      return _this.handleOperation(async () => {
        return await vectorsApi.post(_this.fetch, `${_this.url}/PutVectors`, options, { headers: _this.headers }) || {};
      });
    }
    /** Retrieves vectors by their keys in batch */
    async getVectors(options) {
      var _this2 = this;
      return _this2.handleOperation(async () => {
        return await vectorsApi.post(_this2.fetch, `${_this2.url}/GetVectors`, options, { headers: _this2.headers });
      });
    }
    /** Lists vectors in an index with pagination */
    async listVectors(options) {
      var _this3 = this;
      if (options.segmentCount !== void 0) {
        if (options.segmentCount < 1 || options.segmentCount > 16) throw new Error("segmentCount must be between 1 and 16");
        if (options.segmentIndex !== void 0) {
          if (options.segmentIndex < 0 || options.segmentIndex >= options.segmentCount) throw new Error(`segmentIndex must be between 0 and ${options.segmentCount - 1}`);
        }
      }
      return _this3.handleOperation(async () => {
        return await vectorsApi.post(_this3.fetch, `${_this3.url}/ListVectors`, options, { headers: _this3.headers });
      });
    }
    /** Queries for similar vectors using approximate nearest neighbor search */
    async queryVectors(options) {
      var _this4 = this;
      return _this4.handleOperation(async () => {
        return await vectorsApi.post(_this4.fetch, `${_this4.url}/QueryVectors`, options, { headers: _this4.headers });
      });
    }
    /** Deletes vectors by their keys in batch (1-500 per request) */
    async deleteVectors(options) {
      var _this5 = this;
      if (options.keys.length < 1 || options.keys.length > 500) throw new Error("Keys batch size must be between 1 and 500 items");
      return _this5.handleOperation(async () => {
        return await vectorsApi.post(_this5.fetch, `${_this5.url}/DeleteVectors`, options, { headers: _this5.headers }) || {};
      });
    }
  };
  var VectorBucketApi = class extends BaseApiClient {
    /** Creates a new VectorBucketApi instance */
    constructor(url, headers = {}, fetch$1) {
      const finalUrl = url.replace(/\/$/, "");
      const finalHeaders = _objectSpread22(_objectSpread22({}, DEFAULT_HEADERS), {}, { "Content-Type": "application/json" }, headers);
      super(finalUrl, finalHeaders, fetch$1, "vectors");
    }
    /** Creates a new vector bucket */
    async createBucket(vectorBucketName) {
      var _this = this;
      return _this.handleOperation(async () => {
        return await vectorsApi.post(_this.fetch, `${_this.url}/CreateVectorBucket`, { vectorBucketName }, { headers: _this.headers }) || {};
      });
    }
    /** Retrieves metadata for a specific vector bucket */
    async getBucket(vectorBucketName) {
      var _this2 = this;
      return _this2.handleOperation(async () => {
        return await vectorsApi.post(_this2.fetch, `${_this2.url}/GetVectorBucket`, { vectorBucketName }, { headers: _this2.headers });
      });
    }
    /** Lists vector buckets with optional filtering and pagination */
    async listBuckets(options = {}) {
      var _this3 = this;
      return _this3.handleOperation(async () => {
        return await vectorsApi.post(_this3.fetch, `${_this3.url}/ListVectorBuckets`, options, { headers: _this3.headers });
      });
    }
    /** Deletes a vector bucket (must be empty first) */
    async deleteBucket(vectorBucketName) {
      var _this4 = this;
      return _this4.handleOperation(async () => {
        return await vectorsApi.post(_this4.fetch, `${_this4.url}/DeleteVectorBucket`, { vectorBucketName }, { headers: _this4.headers }) || {};
      });
    }
  };
  var StorageVectorsClient = class extends VectorBucketApi {
    /**
    * @alpha
    *
    * Creates a StorageVectorsClient that can manage buckets, indexes, and vectors.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param url - Base URL of the Storage Vectors REST API.
    * @param options.headers - Optional headers (for example `Authorization`) applied to every request.
    * @param options.fetch - Optional custom `fetch` implementation for non-browser runtimes.
    *
    * @example Using supabase-js (recommended)
    * ```typescript
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * ```
    *
    * @example Standalone import for bundle-sensitive environments
    * ```typescript
    * import { StorageVectorsClient } from '@supabase/storage-js'
    *
    * const client = new StorageVectorsClient(url, options)
    * ```
    */
    constructor(url, options = {}) {
      super(url, options.headers || {}, options.fetch);
    }
    /**
    *
    * @alpha
    *
    * Access operations for a specific vector bucket
    * Returns a scoped client for index and vector operations within the bucket
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param vectorBucketName - Name of the vector bucket
    * @returns Bucket-scoped client with index and vector operations
    *
    * @example Accessing a vector bucket
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * ```
    */
    from(vectorBucketName) {
      return new VectorBucketScope(this.url, this.headers, vectorBucketName, this.fetch);
    }
    /**
    *
    * @alpha
    *
    * Creates a new vector bucket
    * Vector buckets are containers for vector indexes and their data
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param vectorBucketName - Unique name for the vector bucket
    * @returns Promise with empty response on success or error
    *
    * @example Creating a vector bucket
    * ```typescript
    * const { data, error } = await supabase
    *   .storage
    *   .vectors
    *   .createBucket('embeddings-prod')
    * ```
    */
    async createBucket(vectorBucketName) {
      var _superprop_getCreateBucket = () => super.createBucket, _this = this;
      return _superprop_getCreateBucket().call(_this, vectorBucketName);
    }
    /**
    *
    * @alpha
    *
    * Retrieves metadata for a specific vector bucket
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param vectorBucketName - Name of the vector bucket
    * @returns Promise with bucket metadata or error
    *
    * @example Get bucket metadata
    * ```typescript
    * const { data, error } = await supabase
    *   .storage
    *   .vectors
    *   .getBucket('embeddings-prod')
    *
    * console.log('Bucket created:', data?.vectorBucket.creationTime)
    * ```
    */
    async getBucket(vectorBucketName) {
      var _superprop_getGetBucket = () => super.getBucket, _this2 = this;
      return _superprop_getGetBucket().call(_this2, vectorBucketName);
    }
    /**
    *
    * @alpha
    *
    * Lists all vector buckets with optional filtering and pagination
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param options - Optional filters (prefix, maxResults, nextToken)
    * @returns Promise with list of buckets or error
    *
    * @example List vector buckets
    * ```typescript
    * const { data, error } = await supabase
    *   .storage
    *   .vectors
    *   .listBuckets({ prefix: 'embeddings-' })
    *
    * data?.vectorBuckets.forEach(bucket => {
    *   console.log(bucket.vectorBucketName)
    * })
    * ```
    */
    async listBuckets(options = {}) {
      var _superprop_getListBuckets = () => super.listBuckets, _this3 = this;
      return _superprop_getListBuckets().call(_this3, options);
    }
    /**
    *
    * @alpha
    *
    * Deletes a vector bucket (bucket must be empty)
    * All indexes must be deleted before deleting the bucket
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param vectorBucketName - Name of the vector bucket to delete
    * @returns Promise with empty response on success or error
    *
    * @example Delete a vector bucket
    * ```typescript
    * const { data, error } = await supabase
    *   .storage
    *   .vectors
    *   .deleteBucket('embeddings-old')
    * ```
    */
    async deleteBucket(vectorBucketName) {
      var _superprop_getDeleteBucket = () => super.deleteBucket, _this4 = this;
      return _superprop_getDeleteBucket().call(_this4, vectorBucketName);
    }
  };
  var VectorBucketScope = class extends VectorIndexApi {
    /**
    * @alpha
    *
    * Creates a helper that automatically scopes all index operations to the provided bucket.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @example Creating a vector bucket scope
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * ```
    */
    constructor(url, headers, vectorBucketName, fetch$1) {
      super(url, headers, fetch$1);
      this.vectorBucketName = vectorBucketName;
    }
    /**
    *
    * @alpha
    *
    * Creates a new vector index in this bucket
    * Convenience method that automatically includes the bucket name
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param options - Index configuration (vectorBucketName is automatically set)
    * @returns Promise with empty response on success or error
    *
    * @example Creating a vector index
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * await bucket.createIndex({
    *   indexName: 'documents-openai',
    *   dataType: 'float32',
    *   dimension: 1536,
    *   distanceMetric: 'cosine',
    *   metadataConfiguration: {
    *     nonFilterableMetadataKeys: ['raw_text']
    *   }
    * })
    * ```
    */
    async createIndex(options) {
      var _superprop_getCreateIndex = () => super.createIndex, _this5 = this;
      return _superprop_getCreateIndex().call(_this5, _objectSpread22(_objectSpread22({}, options), {}, { vectorBucketName: _this5.vectorBucketName }));
    }
    /**
    *
    * @alpha
    *
    * Lists indexes in this bucket
    * Convenience method that automatically includes the bucket name
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param options - Listing options (vectorBucketName is automatically set)
    * @returns Promise with response containing indexes array and pagination token or error
    *
    * @example List indexes
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * const { data } = await bucket.listIndexes({ prefix: 'documents-' })
    * ```
    */
    async listIndexes(options = {}) {
      var _superprop_getListIndexes = () => super.listIndexes, _this6 = this;
      return _superprop_getListIndexes().call(_this6, _objectSpread22(_objectSpread22({}, options), {}, { vectorBucketName: _this6.vectorBucketName }));
    }
    /**
    *
    * @alpha
    *
    * Retrieves metadata for a specific index in this bucket
    * Convenience method that automatically includes the bucket name
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param indexName - Name of the index to retrieve
    * @returns Promise with index metadata or error
    *
    * @example Get index metadata
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * const { data } = await bucket.getIndex('documents-openai')
    * console.log('Dimension:', data?.index.dimension)
    * ```
    */
    async getIndex(indexName) {
      var _superprop_getGetIndex = () => super.getIndex, _this7 = this;
      return _superprop_getGetIndex().call(_this7, _this7.vectorBucketName, indexName);
    }
    /**
    *
    * @alpha
    *
    * Deletes an index from this bucket
    * Convenience method that automatically includes the bucket name
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param indexName - Name of the index to delete
    * @returns Promise with empty response on success or error
    *
    * @example Delete an index
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * await bucket.deleteIndex('old-index')
    * ```
    */
    async deleteIndex(indexName) {
      var _superprop_getDeleteIndex = () => super.deleteIndex, _this8 = this;
      return _superprop_getDeleteIndex().call(_this8, _this8.vectorBucketName, indexName);
    }
    /**
    *
    * @alpha
    *
    * Access operations for a specific index within this bucket
    * Returns a scoped client for vector data operations
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param indexName - Name of the index
    * @returns Index-scoped client with vector data operations
    *
    * @example Accessing an index
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    *
    * // Insert vectors
    * await index.putVectors({
    *   vectors: [
    *     { key: 'doc-1', data: { float32: [...] }, metadata: { title: 'Intro' } }
    *   ]
    * })
    *
    * // Query similar vectors
    * const { data } = await index.queryVectors({
    *   queryVector: { float32: [...] },
    *   topK: 5
    * })
    * ```
    */
    index(indexName) {
      return new VectorIndexScope(this.url, this.headers, this.vectorBucketName, indexName, this.fetch);
    }
  };
  var VectorIndexScope = class extends VectorDataApi {
    /**
    *
    * @alpha
    *
    * Creates a helper that automatically scopes all vector operations to the provided bucket/index names.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @example Creating a vector index scope
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * ```
    */
    constructor(url, headers, vectorBucketName, indexName, fetch$1) {
      super(url, headers, fetch$1);
      this.vectorBucketName = vectorBucketName;
      this.indexName = indexName;
    }
    /**
    *
    * @alpha
    *
    * Inserts or updates vectors in this index
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param options - Vector insertion options (bucket and index names automatically set)
    * @returns Promise with empty response on success or error
    *
    * @example Insert vectors into an index
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * await index.putVectors({
    *   vectors: [
    *     {
    *       key: 'doc-1',
    *       data: { float32: [0.1, 0.2, ...] },
    *       metadata: { title: 'Introduction', page: 1 }
    *     }
    *   ]
    * })
    * ```
    */
    async putVectors(options) {
      var _superprop_getPutVectors = () => super.putVectors, _this9 = this;
      return _superprop_getPutVectors().call(_this9, _objectSpread22(_objectSpread22({}, options), {}, {
        vectorBucketName: _this9.vectorBucketName,
        indexName: _this9.indexName
      }));
    }
    /**
    *
    * @alpha
    *
    * Retrieves vectors by keys from this index
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param options - Vector retrieval options (bucket and index names automatically set)
    * @returns Promise with response containing vectors array or error
    *
    * @example Get vectors by keys
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * const { data } = await index.getVectors({
    *   keys: ['doc-1', 'doc-2'],
    *   returnMetadata: true
    * })
    * ```
    */
    async getVectors(options) {
      var _superprop_getGetVectors = () => super.getVectors, _this10 = this;
      return _superprop_getGetVectors().call(_this10, _objectSpread22(_objectSpread22({}, options), {}, {
        vectorBucketName: _this10.vectorBucketName,
        indexName: _this10.indexName
      }));
    }
    /**
    *
    * @alpha
    *
    * Lists vectors in this index with pagination
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param options - Listing options (bucket and index names automatically set)
    * @returns Promise with response containing vectors array and pagination token or error
    *
    * @example List vectors with pagination
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * const { data } = await index.listVectors({
    *   maxResults: 500,
    *   returnMetadata: true
    * })
    * ```
    */
    async listVectors(options = {}) {
      var _superprop_getListVectors = () => super.listVectors, _this11 = this;
      return _superprop_getListVectors().call(_this11, _objectSpread22(_objectSpread22({}, options), {}, {
        vectorBucketName: _this11.vectorBucketName,
        indexName: _this11.indexName
      }));
    }
    /**
    *
    * @alpha
    *
    * Queries for similar vectors in this index
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param options - Query options (bucket and index names automatically set)
    * @returns Promise with response containing matches array of similar vectors ordered by distance or error
    *
    * @example Query similar vectors
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * const { data } = await index.queryVectors({
    *   queryVector: { float32: [0.1, 0.2, ...] },
    *   topK: 5,
    *   filter: { category: 'technical' },
    *   returnDistance: true,
    *   returnMetadata: true
    * })
    * ```
    */
    async queryVectors(options) {
      var _superprop_getQueryVectors = () => super.queryVectors, _this12 = this;
      return _superprop_getQueryVectors().call(_this12, _objectSpread22(_objectSpread22({}, options), {}, {
        vectorBucketName: _this12.vectorBucketName,
        indexName: _this12.indexName
      }));
    }
    /**
    *
    * @alpha
    *
    * Deletes vectors by keys from this index
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    * @param options - Deletion options (bucket and index names automatically set)
    * @returns Promise with empty response on success or error
    *
    * @example Delete vectors by keys
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * await index.deleteVectors({
    *   keys: ['doc-1', 'doc-2', 'doc-3']
    * })
    * ```
    */
    async deleteVectors(options) {
      var _superprop_getDeleteVectors = () => super.deleteVectors, _this13 = this;
      return _superprop_getDeleteVectors().call(_this13, _objectSpread22(_objectSpread22({}, options), {}, {
        vectorBucketName: _this13.vectorBucketName,
        indexName: _this13.indexName
      }));
    }
  };
  var StorageClient = class extends StorageBucketApi {
    /**
    * Creates a client for Storage buckets, files, analytics, and vectors.
    *
    * @category Storage
    * @subcategory File Buckets
    *
    * @example Using supabase-js (recommended)
    * ```ts
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
    * const avatars = supabase.storage.from('avatars')
    * ```
    *
    * @example Standalone import for bundle-sensitive environments
    * ```ts
    * import { StorageClient } from '@supabase/storage-js'
    *
    * const storage = new StorageClient('https://xyzcompany.supabase.co/storage/v1', {
    *   apikey: 'your-publishable-key',
    * })
    * const avatars = storage.from('avatars')
    * ```
    */
    constructor(url, headers = {}, fetch$1, opts) {
      super(url, headers, fetch$1, opts);
    }
    /**
    * Perform file operation in a bucket.
    *
    * @category Storage
    * @subcategory File Buckets
    *
    * @param id The bucket id to operate on.
    *
    * @example Accessing a bucket
    * ```typescript
    * const avatars = supabase.storage.from('avatars')
    * ```
    */
    from(id) {
      return new StorageFileApi(this.url, this.headers, id, this.fetch);
    }
    /**
    *
    * @alpha
    *
    * Access vector storage operations.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Vector Buckets
    *
    * @returns A StorageVectorsClient instance configured with the current storage settings.
    */
    get vectors() {
      return new StorageVectorsClient(this.url + "/vector", {
        headers: this.headers,
        fetch: this.fetch
      });
    }
    /**
    *
    * @alpha
    *
    * Access analytics storage operations using Iceberg tables.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Storage
    * @subcategory Analytics Buckets
    *
    * @returns A StorageAnalyticsClient instance configured with the current storage settings.
    */
    get analytics() {
      return new StorageAnalyticsClient(this.url + "/iceberg", this.headers, this.fetch);
    }
  };

  // node_modules/@supabase/auth-js/dist/module/lib/version.js
  var version3 = "2.110.0";

  // node_modules/@supabase/auth-js/dist/module/lib/constants.js
  var AUTO_REFRESH_TICK_DURATION_MS = 30 * 1e3;
  var AUTO_REFRESH_TICK_THRESHOLD = 3;
  var EXPIRY_MARGIN_MS = AUTO_REFRESH_TICK_THRESHOLD * AUTO_REFRESH_TICK_DURATION_MS;
  var REFRESH_FAILURE_COOLDOWN_MS = 2 * AUTO_REFRESH_TICK_DURATION_MS;
  var GOTRUE_URL = "http://localhost:9999";
  var STORAGE_KEY = "supabase.auth.token";
  var DEFAULT_HEADERS2 = { "X-Client-Info": `gotrue-js/${version3}` };
  var API_VERSION_HEADER_NAME = "X-Supabase-Api-Version";
  var API_VERSIONS = {
    "2024-01-01": {
      timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
      name: "2024-01-01"
    }
  };
  var BASE64URL_REGEX = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
  var JWKS_TTL = 10 * 60 * 1e3;

  // node_modules/@supabase/auth-js/dist/module/lib/errors.js
  var AuthError = class extends Error {
    constructor(message, status, code) {
      super(message);
      this.__isAuthError = true;
      this.name = "AuthError";
      this.status = status;
      this.code = code;
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        code: this.code
      };
    }
  };
  function isAuthError(error) {
    return typeof error === "object" && error !== null && "__isAuthError" in error;
  }
  var AuthApiError = class extends AuthError {
    constructor(message, status, code) {
      super(message, status, code);
      this.name = "AuthApiError";
      this.status = status;
      this.code = code;
    }
  };
  function isAuthApiError(error) {
    return isAuthError(error) && error.name === "AuthApiError";
  }
  var AuthUnknownError = class extends AuthError {
    constructor(message, originalError) {
      super(message);
      this.name = "AuthUnknownError";
      this.originalError = originalError;
    }
  };
  var CustomAuthError = class extends AuthError {
    constructor(message, name, status, code) {
      super(message, status, code);
      this.name = name;
      this.status = status;
    }
  };
  var AuthSessionMissingError = class extends CustomAuthError {
    constructor() {
      super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
    }
  };
  function isAuthSessionMissingError(error) {
    return isAuthError(error) && error.name === "AuthSessionMissingError";
  }
  var AuthInvalidTokenResponseError = class extends CustomAuthError {
    constructor() {
      super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
    }
  };
  var AuthInvalidCredentialsError = class extends CustomAuthError {
    constructor(message) {
      super(message, "AuthInvalidCredentialsError", 400, void 0);
    }
  };
  var AuthImplicitGrantRedirectError = class extends CustomAuthError {
    constructor(message, details = null) {
      super(message, "AuthImplicitGrantRedirectError", 500, void 0);
      this.details = null;
      this.details = details;
    }
    toJSON() {
      return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
    }
  };
  function isAuthImplicitGrantRedirectError(error) {
    return isAuthError(error) && error.name === "AuthImplicitGrantRedirectError";
  }
  var AuthPKCEGrantCodeExchangeError = class extends CustomAuthError {
    constructor(message, details = null) {
      super(message, "AuthPKCEGrantCodeExchangeError", 500, void 0);
      this.details = null;
      this.details = details;
    }
    toJSON() {
      return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
    }
  };
  var AuthPKCECodeVerifierMissingError = class extends CustomAuthError {
    constructor() {
      super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.", "AuthPKCECodeVerifierMissingError", 400, "pkce_code_verifier_not_found");
    }
  };
  var AuthRetryableFetchError = class extends CustomAuthError {
    constructor(message, status) {
      super(message, "AuthRetryableFetchError", status, void 0);
    }
  };
  function isAuthRetryableFetchError(error) {
    return isAuthError(error) && error.name === "AuthRetryableFetchError";
  }
  var AuthRefreshDiscardedError = class extends CustomAuthError {
    constructor(message = "Refresh result discarded: session state changed mid-flight (e.g., concurrent signOut)") {
      super(message, "AuthRefreshDiscardedError", 409, void 0);
    }
  };
  function isAuthRefreshDiscardedError(error) {
    return isAuthError(error) && error.name === "AuthRefreshDiscardedError";
  }
  var AuthWeakPasswordError = class extends CustomAuthError {
    constructor(message, status, reasons) {
      super(message, "AuthWeakPasswordError", status, "weak_password");
      this.reasons = reasons;
    }
    toJSON() {
      return Object.assign(Object.assign({}, super.toJSON()), { reasons: this.reasons });
    }
  };
  var AuthInvalidJwtError = class extends CustomAuthError {
    constructor(message) {
      super(message, "AuthInvalidJwtError", 400, "invalid_jwt");
    }
  };

  // node_modules/@supabase/auth-js/dist/module/lib/base64url.js
  var TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
  var IGNORE_BASE64URL = " 	\n\r=".split("");
  var FROM_BASE64URL = (() => {
    const charMap = new Array(128);
    for (let i2 = 0; i2 < charMap.length; i2 += 1) {
      charMap[i2] = -1;
    }
    for (let i2 = 0; i2 < IGNORE_BASE64URL.length; i2 += 1) {
      charMap[IGNORE_BASE64URL[i2].charCodeAt(0)] = -2;
    }
    for (let i2 = 0; i2 < TO_BASE64URL.length; i2 += 1) {
      charMap[TO_BASE64URL[i2].charCodeAt(0)] = i2;
    }
    return charMap;
  })();
  function byteToBase64URL(byte, state, emit) {
    if (byte !== null) {
      state.queue = state.queue << 8 | byte;
      state.queuedBits += 8;
      while (state.queuedBits >= 6) {
        const pos = state.queue >> state.queuedBits - 6 & 63;
        emit(TO_BASE64URL[pos]);
        state.queuedBits -= 6;
      }
    } else if (state.queuedBits > 0) {
      state.queue = state.queue << 6 - state.queuedBits;
      state.queuedBits = 6;
      while (state.queuedBits >= 6) {
        const pos = state.queue >> state.queuedBits - 6 & 63;
        emit(TO_BASE64URL[pos]);
        state.queuedBits -= 6;
      }
    }
  }
  function byteFromBase64URL(charCode, state, emit) {
    const bits = FROM_BASE64URL[charCode];
    if (bits > -1) {
      state.queue = state.queue << 6 | bits;
      state.queuedBits += 6;
      while (state.queuedBits >= 8) {
        emit(state.queue >> state.queuedBits - 8 & 255);
        state.queuedBits -= 8;
      }
    } else if (bits === -2) {
      return;
    } else {
      throw new Error(`Invalid Base64-URL character "${String.fromCharCode(charCode)}"`);
    }
  }
  function stringFromBase64URL(str) {
    const conv = [];
    const utf8Emit = (codepoint) => {
      conv.push(String.fromCodePoint(codepoint));
    };
    const utf8State = {
      utf8seq: 0,
      codepoint: 0
    };
    const b64State = { queue: 0, queuedBits: 0 };
    const byteEmit = (byte) => {
      stringFromUTF8(byte, utf8State, utf8Emit);
    };
    for (let i2 = 0; i2 < str.length; i2 += 1) {
      byteFromBase64URL(str.charCodeAt(i2), b64State, byteEmit);
    }
    return conv.join("");
  }
  function codepointToUTF8(codepoint, emit) {
    if (codepoint <= 127) {
      emit(codepoint);
      return;
    } else if (codepoint <= 2047) {
      emit(192 | codepoint >> 6);
      emit(128 | codepoint & 63);
      return;
    } else if (codepoint <= 65535) {
      emit(224 | codepoint >> 12);
      emit(128 | codepoint >> 6 & 63);
      emit(128 | codepoint & 63);
      return;
    } else if (codepoint <= 1114111) {
      emit(240 | codepoint >> 18);
      emit(128 | codepoint >> 12 & 63);
      emit(128 | codepoint >> 6 & 63);
      emit(128 | codepoint & 63);
      return;
    }
    throw new Error(`Unrecognized Unicode codepoint: ${codepoint.toString(16)}`);
  }
  function stringToUTF8(str, emit) {
    for (let i2 = 0; i2 < str.length; i2 += 1) {
      let codepoint = str.charCodeAt(i2);
      if (codepoint > 55295 && codepoint <= 56319) {
        const highSurrogate = (codepoint - 55296) * 1024 & 65535;
        const lowSurrogate = str.charCodeAt(i2 + 1) - 56320 & 65535;
        codepoint = (lowSurrogate | highSurrogate) + 65536;
        i2 += 1;
      }
      codepointToUTF8(codepoint, emit);
    }
  }
  function stringFromUTF8(byte, state, emit) {
    if (state.utf8seq === 0) {
      if (byte <= 127) {
        emit(byte);
        return;
      }
      for (let leadingBit = 1; leadingBit < 6; leadingBit += 1) {
        if ((byte >> 7 - leadingBit & 1) === 0) {
          state.utf8seq = leadingBit;
          break;
        }
      }
      if (state.utf8seq === 2) {
        state.codepoint = byte & 31;
      } else if (state.utf8seq === 3) {
        state.codepoint = byte & 15;
      } else if (state.utf8seq === 4) {
        state.codepoint = byte & 7;
      } else {
        throw new Error("Invalid UTF-8 sequence");
      }
      state.utf8seq -= 1;
    } else if (state.utf8seq > 0) {
      if (byte <= 127) {
        throw new Error("Invalid UTF-8 sequence");
      }
      state.codepoint = state.codepoint << 6 | byte & 63;
      state.utf8seq -= 1;
      if (state.utf8seq === 0) {
        emit(state.codepoint);
      }
    }
  }
  function base64UrlToUint8Array(str) {
    const result = [];
    const state = { queue: 0, queuedBits: 0 };
    const onByte = (byte) => {
      result.push(byte);
    };
    for (let i2 = 0; i2 < str.length; i2 += 1) {
      byteFromBase64URL(str.charCodeAt(i2), state, onByte);
    }
    return new Uint8Array(result);
  }
  function stringToUint8Array(str) {
    const result = [];
    stringToUTF8(str, (byte) => result.push(byte));
    return new Uint8Array(result);
  }
  function bytesToBase64URL(bytes) {
    const result = [];
    const state = { queue: 0, queuedBits: 0 };
    const onChar = (char) => {
      result.push(char);
    };
    bytes.forEach((byte) => byteToBase64URL(byte, state, onChar));
    byteToBase64URL(null, state, onChar);
    return result.join("");
  }

  // node_modules/@supabase/auth-js/dist/module/lib/helpers.js
  function expiresAt(expiresIn) {
    const timeNow = Math.round(Date.now() / 1e3);
    return timeNow + expiresIn;
  }
  function generateCallbackId() {
    return /* @__PURE__ */ Symbol("auth-callback");
  }
  var isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
  var localStorageWriteTests = {
    tested: false,
    writable: false
  };
  var supportsLocalStorage = () => {
    if (!isBrowser()) {
      return false;
    }
    try {
      if (typeof globalThis.localStorage !== "object") {
        return false;
      }
    } catch (e3) {
      return false;
    }
    if (localStorageWriteTests.tested) {
      return localStorageWriteTests.writable;
    }
    const randomKey = `lswt-${Math.random()}${Math.random()}`;
    try {
      globalThis.localStorage.setItem(randomKey, randomKey);
      globalThis.localStorage.removeItem(randomKey);
      localStorageWriteTests.tested = true;
      localStorageWriteTests.writable = true;
    } catch (e3) {
      localStorageWriteTests.tested = true;
      localStorageWriteTests.writable = false;
    }
    return localStorageWriteTests.writable;
  };
  function parseParametersFromURL(href) {
    const result = {};
    const url = new URL(href);
    if (url.hash && url.hash[0] === "#") {
      try {
        const hashSearchParams = new URLSearchParams(url.hash.substring(1));
        hashSearchParams.forEach((value, key) => {
          result[key] = value;
        });
      } catch (_e) {
      }
    }
    url.searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  var resolveFetch3 = (customFetch) => {
    if (customFetch) {
      return (...args) => customFetch(...args);
    }
    return (...args) => fetch(...args);
  };
  var looksLikeFetchResponse = (maybeResponse) => {
    return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
  };
  var setItemAsync = async (storage, key, data) => {
    await storage.setItem(key, JSON.stringify(data));
  };
  var getItemAsync = async (storage, key) => {
    const value = await storage.getItem(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (_a) {
      return null;
    }
  };
  var removeItemAsync = async (storage, key) => {
    await storage.removeItem(key);
  };
  var Deferred = class _Deferred {
    constructor() {
      ;
      this.promise = new _Deferred.promiseConstructor((res, rej) => {
        ;
        this.resolve = res;
        this.reject = rej;
      });
    }
  };
  Deferred.promiseConstructor = Promise;
  function decodeJWT(token) {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new AuthInvalidJwtError("Invalid JWT structure");
    }
    for (let i2 = 0; i2 < parts.length; i2++) {
      if (!BASE64URL_REGEX.test(parts[i2])) {
        throw new AuthInvalidJwtError("JWT not in base64url format");
      }
    }
    const data = {
      // using base64url lib
      header: JSON.parse(stringFromBase64URL(parts[0])),
      payload: JSON.parse(stringFromBase64URL(parts[1])),
      signature: base64UrlToUint8Array(parts[2]),
      raw: {
        header: parts[0],
        payload: parts[1]
      }
    };
    return data;
  }
  async function sleep2(time) {
    return await new Promise((accept) => {
      setTimeout(() => accept(null), time);
    });
  }
  function retryable(fn, isRetryable) {
    const promise = new Promise((accept, reject) => {
      ;
      (async () => {
        for (let attempt = 0; attempt < Infinity; attempt++) {
          try {
            const result = await fn(attempt);
            if (!isRetryable(attempt, null, result)) {
              accept(result);
              return;
            }
          } catch (e3) {
            if (!isRetryable(attempt, e3)) {
              reject(e3);
              return;
            }
          }
        }
      })();
    });
    return promise;
  }
  function dec2hex(dec) {
    return ("0" + dec.toString(16)).substr(-2);
  }
  function generatePKCEVerifier() {
    const verifierLength = 56;
    const array = new Uint32Array(verifierLength);
    if (typeof crypto === "undefined") {
      const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
      const charSetLen = charSet.length;
      let verifier = "";
      for (let i2 = 0; i2 < verifierLength; i2++) {
        verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
      }
      return verifier;
    }
    crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join("");
  }
  async function sha256(randomString) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(randomString);
    const hash = await crypto.subtle.digest("SHA-256", encodedData);
    const bytes = new Uint8Array(hash);
    return Array.from(bytes).map((c2) => String.fromCharCode(c2)).join("");
  }
  async function generatePKCEChallenge(verifier) {
    const hasCryptoSupport = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined";
    if (!hasCryptoSupport) {
      console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
      return verifier;
    }
    const hashed = await sha256(verifier);
    return btoa(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false) {
    const codeVerifier = generatePKCEVerifier();
    let storedCodeVerifier = codeVerifier;
    if (isPasswordRecovery) {
      storedCodeVerifier += "/recovery";
    }
    await setItemAsync(storage, `${storageKey}-code-verifier`, storedCodeVerifier);
    const codeChallenge = await generatePKCEChallenge(codeVerifier);
    const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
    return [codeChallenge, codeChallengeMethod];
  }
  var API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
  function parseResponseAPIVersion(response) {
    const apiVersion = response.headers.get(API_VERSION_HEADER_NAME);
    if (!apiVersion) {
      return null;
    }
    if (!apiVersion.match(API_VERSION_REGEX)) {
      return null;
    }
    try {
      const date = /* @__PURE__ */ new Date(`${apiVersion}T00:00:00.0Z`);
      return date;
    } catch (_e) {
      return null;
    }
  }
  function validateExp(exp) {
    if (!exp) {
      throw new Error("Missing exp claim");
    }
    const timeNow = Math.floor(Date.now() / 1e3);
    if (exp <= timeNow) {
      throw new Error("JWT has expired");
    }
  }
  function getAlgorithm(alg) {
    switch (alg) {
      case "RS256":
        return {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        };
      case "ES256":
        return {
          name: "ECDSA",
          namedCurve: "P-256",
          hash: { name: "SHA-256" }
        };
      default:
        throw new Error("Invalid alg claim");
    }
  }
  var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  function validateUUID(str) {
    if (!UUID_REGEX.test(str)) {
      throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not");
    }
  }
  function assertPasskeyExperimentalEnabled(experimental) {
    if (!experimental.passkey) {
      throw new Error("@supabase/auth-js: the passkey API is experimental and disabled by default. Enable it by passing `auth: { experimental: { passkey: true } }` to createClient (or to the GoTrueClient constructor).");
    }
  }
  function userNotAvailableProxy() {
    const proxyTarget = {};
    return new Proxy(proxyTarget, {
      get: (target, prop) => {
        if (prop === "__isUserNotAvailableProxy") {
          return true;
        }
        if (typeof prop === "symbol") {
          const sProp = prop.toString();
          if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)") {
            return void 0;
          }
        }
        throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${prop}" property of the session object is not supported. Please use getUser() instead.`);
      },
      set: (_target, prop) => {
        throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
      },
      deleteProperty: (_target, prop) => {
        throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
      }
    });
  }
  function insecureUserWarningProxy(user, suppressWarningRef) {
    return new Proxy(user, {
      get: (target, prop, receiver) => {
        if (prop === "__isInsecureUserWarningProxy") {
          return true;
        }
        if (typeof prop === "symbol") {
          const sProp = prop.toString();
          if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)" || sProp === "Symbol(nodejs.util.inspect.custom)") {
            return Reflect.get(target, prop, receiver);
          }
        }
        if (!suppressWarningRef.value && typeof prop === "string") {
          console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.");
          suppressWarningRef.value = true;
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // node_modules/@supabase/auth-js/dist/module/lib/fetch.js
  var _getErrorMessage2 = (err) => {
    if (typeof err === "object" && err !== null) {
      const e3 = err;
      if (typeof e3.msg === "string")
        return e3.msg;
      if (typeof e3.message === "string")
        return e3.message;
      if (typeof e3.error_description === "string")
        return e3.error_description;
      if (typeof e3.error === "string")
        return e3.error;
    }
    return JSON.stringify(err);
  };
  var NETWORK_ERROR_CODES = [
    500,
    501,
    502,
    503,
    504,
    520,
    521,
    522,
    523,
    524,
    525,
    526,
    527,
    528,
    529,
    530
  ];
  async function handleError2(error) {
    var _a;
    if (!looksLikeFetchResponse(error)) {
      throw new AuthRetryableFetchError(_getErrorMessage2(error), 0);
    }
    if (NETWORK_ERROR_CODES.includes(error.status)) {
      throw new AuthRetryableFetchError(_getErrorMessage2(error), error.status);
    }
    let data;
    try {
      data = await error.json();
    } catch (e3) {
      throw new AuthUnknownError(_getErrorMessage2(e3), e3);
    }
    let errorCode = void 0;
    const responseAPIVersion = parseResponseAPIVersion(error);
    if (responseAPIVersion && responseAPIVersion.getTime() >= API_VERSIONS["2024-01-01"].timestamp && typeof data === "object" && data && typeof data.code === "string") {
      errorCode = data.code;
    } else if (typeof data === "object" && data && typeof data.error_code === "string") {
      errorCode = data.error_code;
    }
    if (!errorCode) {
      if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a2, i2) => a2 && typeof i2 === "string", true)) {
        throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, data.weak_password.reasons);
      }
    } else if (errorCode === "weak_password") {
      throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
    } else if (errorCode === "session_not_found") {
      throw new AuthSessionMissingError();
    }
    throw new AuthApiError(_getErrorMessage2(data), error.status || 500, errorCode);
  }
  var _getRequestParams2 = (method, options, parameters, body) => {
    const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
    if (method === "GET") {
      return params;
    }
    params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
    params.body = JSON.stringify(body);
    return Object.assign(Object.assign({}, params), parameters);
  };
  async function _request(fetcher, method, url, options) {
    var _a;
    const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
    if (!headers[API_VERSION_HEADER_NAME]) {
      headers[API_VERSION_HEADER_NAME] = API_VERSIONS["2024-01-01"].name;
    }
    if (options === null || options === void 0 ? void 0 : options.jwt) {
      headers["Authorization"] = `Bearer ${options.jwt}`;
    }
    const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      qs["redirect_to"] = options.redirectTo;
    }
    const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
    const data = await _handleRequest2(fetcher, method, url + queryString, {
      headers,
      noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
    }, {}, options === null || options === void 0 ? void 0 : options.body);
    return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
  }
  async function _handleRequest2(fetcher, method, url, options, parameters, body) {
    const requestParams = _getRequestParams2(method, options, parameters, body);
    let result;
    try {
      result = await fetcher(url, Object.assign({}, requestParams));
    } catch (e3) {
      console.error(e3);
      throw new AuthRetryableFetchError(_getErrorMessage2(e3), 0);
    }
    if (!result.ok) {
      await handleError2(result);
    }
    if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
      return result;
    }
    try {
      return await result.json();
    } catch (e3) {
      await handleError2(e3);
    }
  }
  function _sessionResponse(data) {
    var _a;
    let session2 = null;
    if (hasSession(data)) {
      session2 = Object.assign({}, data);
      if (!data.expires_at) {
        session2.expires_at = expiresAt(data.expires_in);
      }
    }
    const user = (_a = data.user) !== null && _a !== void 0 ? _a : typeof (data === null || data === void 0 ? void 0 : data.id) === "string" ? data : null;
    return { data: { session: session2, user }, error: null };
  }
  function _sessionResponsePassword(data) {
    const response = _sessionResponse(data);
    if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a2, i2) => a2 && typeof i2 === "string", true)) {
      response.data.weak_password = data.weak_password;
    }
    return response;
  }
  function _userResponse(data) {
    var _a;
    const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
    return { data: { user }, error: null };
  }
  function _ssoResponse(data) {
    return { data, error: null };
  }
  function _generateLinkResponse(data) {
    const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
    const properties = {
      action_link,
      email_otp,
      hashed_token,
      redirect_to,
      verification_type
    };
    const user = Object.assign({}, rest);
    return {
      data: {
        properties,
        user
      },
      error: null
    };
  }
  function _noResolveJsonResponse(data) {
    return data;
  }
  function hasSession(data) {
    return !!data.access_token && !!data.refresh_token && !!data.expires_in;
  }

  // node_modules/@supabase/auth-js/dist/module/lib/types.js
  var SIGN_OUT_SCOPES = ["global", "local", "others"];

  // node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js
  var GoTrueAdminApi = class {
    /**
     * Creates an admin API client that can be used to manage users and OAuth clients.
     *
     * @example Using supabase-js (recommended)
     * ```ts
     * import { createClient } from '@supabase/supabase-js'
     *
     * const supabase = createClient('https://xyzcompany.supabase.co', 'your-secret-key')
     * const { data, error } = await supabase.auth.admin.listUsers()
     * ```
     *
     * @example Standalone import for bundle-sensitive environments
     * ```ts
     * import { GoTrueAdminApi } from '@supabase/auth-js'
     *
     * const admin = new GoTrueAdminApi({
     *   url: 'https://xyzcompany.supabase.co/auth/v1',
     *   headers: { Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}` },
     * })
     * ```
     */
    constructor({ url = "", headers = {}, fetch: fetch2, experimental }) {
      this.url = url;
      this.headers = headers;
      this.fetch = resolveFetch3(fetch2);
      this.experimental = experimental !== null && experimental !== void 0 ? experimental : {};
      this.mfa = {
        listFactors: this._listFactors.bind(this),
        deleteFactor: this._deleteFactor.bind(this)
      };
      this.oauth = {
        listClients: this._listOAuthClients.bind(this),
        createClient: this._createOAuthClient.bind(this),
        getClient: this._getOAuthClient.bind(this),
        updateClient: this._updateOAuthClient.bind(this),
        deleteClient: this._deleteOAuthClient.bind(this),
        regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this)
      };
      this.customProviders = {
        listProviders: this._listCustomProviders.bind(this),
        createProvider: this._createCustomProvider.bind(this),
        getProvider: this._getCustomProvider.bind(this),
        updateProvider: this._updateCustomProvider.bind(this),
        deleteProvider: this._deleteCustomProvider.bind(this)
      };
      this.passkey = {
        listPasskeys: this._adminListPasskeys.bind(this),
        deletePasskey: this._adminDeletePasskey.bind(this)
      };
    }
    /**
     * Removes a logged-in session.
     * @param jwt A valid, logged-in JWT.
     * @param scope The logout sope.
     *
     * @category Auth
     * @subcategory Auth Admin
     */
    async signOut(jwt, scope = SIGN_OUT_SCOPES[0]) {
      if (SIGN_OUT_SCOPES.indexOf(scope) < 0) {
        throw new Error(`@supabase/auth-js: Parameter scope must be one of ${SIGN_OUT_SCOPES.join(", ")}`);
      }
      try {
        await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
          headers: this.headers,
          jwt,
          noResolveJson: true
        });
        return { data: null, error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Sends an invite link to an email address.
     * @param email The email address of the user.
     * @param options Additional options to be included when inviting.
     *
     * @category Auth
     * @subcategory Auth Admin
     *
     * @remarks
     * - Sends an invite link to the user's email address.
     * - The `inviteUserByEmail()` method is typically used by administrators to invite users to join the application.
     * - Note that PKCE is not supported when using `inviteUserByEmail`. This is because the browser initiating the invite is often different from the browser accepting the invite which makes it difficult to provide the security guarantees required of the PKCE flow.
     *
     * @example Invite a user
     * ```js
     * const { data, error } = await supabase.auth.admin.inviteUserByEmail('email@example.com')
     * ```
     *
     * @exampleResponse Invite a user
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "example@email.com",
     *       "invited_at": "2024-01-01T00:00:00Z",
     *       "phone": "",
     *       "confirmation_sent_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {},
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *       "is_anonymous": false
     *     }
     *   },
     *   "error": null
     * }
     * ```
     */
    async inviteUserByEmail(email, options = {}) {
      try {
        return await _request(this.fetch, "POST", `${this.url}/invite`, {
          body: { email, data: options.data },
          headers: this.headers,
          redirectTo: options.redirectTo,
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    /**
     * Generates email links and OTPs to be sent via a custom email provider.
     * @param email The user's email.
     * @param options.password User password. For signup only.
     * @param options.data Optional user metadata. For signup only.
     * @param options.redirectTo The redirect url which should be appended to the generated link
     *
     * @category Auth
     * @subcategory Auth Admin
     *
     * @remarks
     * - The following types can be passed into `generateLink()`: `signup`, `magiclink`, `invite`, `recovery`, `email_change_current`, `email_change_new`, `phone_change`.
     * - `generateLink()` only generates the email link for `email_change_email` if the **Secure email change** is enabled in your project's [email auth provider settings](/dashboard/project/_/auth/providers).
     * - `generateLink()` handles the creation of the user for `signup`, `invite` and `magiclink`.
     *
     * @example Generate a signup link
     * ```js
     * const { data, error } = await supabase.auth.admin.generateLink({
     *   type: 'signup',
     *   email: 'email@example.com',
     *   password: 'secret'
     * })
     * ```
     *
     * @exampleResponse Generate a signup link
     * ```json
     * {
     *   "data": {
     *     "properties": {
     *       "action_link": "<LINK_TO_SEND_TO_USER>",
     *       "email_otp": "999999",
     *       "hashed_token": "<HASHED_TOKEN",
     *       "redirect_to": "<REDIRECT_URL>",
     *       "verification_type": "signup"
     *     },
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "email@example.com",
     *       "phone": "",
     *       "confirmation_sent_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {},
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "email@example.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "email@example.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *       "is_anonymous": false
     *     }
     *   },
     *   "error": null
     * }
     * ```
     *
     * @example Generate an invite link
     * ```js
     * const { data, error } = await supabase.auth.admin.generateLink({
     *   type: 'invite',
     *   email: 'email@example.com'
     * })
     * ```
     *
     * @example Generate a magic link
     * ```js
     * const { data, error } = await supabase.auth.admin.generateLink({
     *   type: 'magiclink',
     *   email: 'email@example.com'
     * })
     * ```
     *
     * @example Generate a recovery link
     * ```js
     * const { data, error } = await supabase.auth.admin.generateLink({
     *   type: 'recovery',
     *   email: 'email@example.com'
     * })
     * ```
     *
     * @example Generate links to change current email address
     * ```js
     * // generate an email change link to be sent to the current email address
     * const { data, error } = await supabase.auth.admin.generateLink({
     *   type: 'email_change_current',
     *   email: 'current.email@example.com',
     *   newEmail: 'new.email@example.com'
     * })
     *
     * // generate an email change link to be sent to the new email address
     * const { data, error } = await supabase.auth.admin.generateLink({
     *   type: 'email_change_new',
     *   email: 'current.email@example.com',
     *   newEmail: 'new.email@example.com'
     * })
     * ```
     */
    async generateLink(params) {
      try {
        const { options } = params, rest = __rest(params, ["options"]);
        const body = Object.assign(Object.assign({}, rest), options);
        if ("newEmail" in rest) {
          body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
          delete body["newEmail"];
        }
        return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
          body,
          headers: this.headers,
          xform: _generateLinkResponse,
          redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
        });
      } catch (error) {
        if (isAuthError(error)) {
          return {
            data: {
              properties: null,
              user: null
            },
            error
          };
        }
        throw error;
      }
    }
    // User Admin API
    /**
     * Creates a new user.
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     *
     * @category Auth
     * @subcategory Auth Admin
     *
     * @remarks
     * - To confirm the user's email address or phone number, set `email_confirm` or `phone_confirm` to true. Both arguments default to false.
     * - `createUser()` will not send a confirmation email to the user. You can use [`inviteUserByEmail()`](/docs/reference/javascript/auth-admin-inviteuserbyemail) if you want to send them an email invite instead.
     * - If you are sure that the created user's email or phone number is legitimate and verified, you can set the `email_confirm` or `phone_confirm` param to `true`.
     *
     * @example With custom user metadata
     * ```js
     * const { data, error } = await supabase.auth.admin.createUser({
     *   email: 'user@email.com',
     *   password: 'password',
     *   user_metadata: { name: 'Yoda' }
     * })
     * ```
     *
     * @exampleResponse With custom user metadata
     * ```json
     * {
     *   data: {
     *     user: {
     *       id: '1',
     *       aud: 'authenticated',
     *       role: 'authenticated',
     *       email: 'example@email.com',
     *       email_confirmed_at: '2024-01-01T00:00:00Z',
     *       phone: '',
     *       confirmation_sent_at: '2024-01-01T00:00:00Z',
     *       confirmed_at: '2024-01-01T00:00:00Z',
     *       last_sign_in_at: '2024-01-01T00:00:00Z',
     *       app_metadata: {},
     *       user_metadata: {},
     *       identities: [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "1",
     *           "user_id": "1",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": true,
     *             "phone_verified": false,
     *             "sub": "1"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "email@example.com"
     *         },
     *       ],
     *       created_at: '2024-01-01T00:00:00Z',
     *       updated_at: '2024-01-01T00:00:00Z',
     *       is_anonymous: false,
     *     }
     *   }
     *   error: null
     * }
     * ```
     *
     * @example Auto-confirm the user's email
     * ```js
     * const { data, error } = await supabase.auth.admin.createUser({
     *   email: 'user@email.com',
     *   email_confirm: true
     * })
     * ```
     *
     * @example Auto-confirm the user's phone number
     * ```js
     * const { data, error } = await supabase.auth.admin.createUser({
     *   phone: '1234567890',
     *   phone_confirm: true
     * })
     * ```
     */
    async createUser(attributes) {
      try {
        return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
          body: attributes,
          headers: this.headers,
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    /**
     * Get a list of users.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
     *
     * @category Auth
     * @subcategory Auth Admin
     *
     * @remarks
     * - Defaults to return 50 users per page.
     *
     * @example Get a page of users
     * ```js
     * const { data: { users }, error } = await supabase.auth.admin.listUsers()
     * ```
     *
     * @example Paginated list of users
     * ```js
     * const { data: { users }, error } = await supabase.auth.admin.listUsers({
     *   page: 1,
     *   perPage: 1000
     * })
     * ```
     */
    async listUsers(params) {
      var _a, _b, _c, _d, _e, _f, _g;
      try {
        const pagination = { nextPage: null, lastPage: 0, total: 0 };
        const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
          headers: this.headers,
          noResolveJson: true,
          query: {
            page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
            per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
          },
          xform: _noResolveJsonResponse
        });
        if (response.error)
          throw response.error;
        const users = await response.json();
        const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
        const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
        if (links.length > 0) {
          links.forEach((link) => {
            const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
            const rel = JSON.parse(link.split(";")[1].split("=")[1]);
            pagination[`${rel}Page`] = page;
          });
          pagination.total = parseInt(total);
        }
        return { data: Object.assign(Object.assign({}, users), pagination), error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { users: [] }, error };
        }
        throw error;
      }
    }
    /**
     * Get user by id.
     *
     * @param uid The user's unique identifier
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     *
     * @category Auth
     * @subcategory Auth Admin
     *
     * @remarks
     * - Fetches the user object from the database based on the user's id.
     * - The `getUserById()` method requires the user's id which maps to the `auth.users.id` column.
     *
     * @example Fetch the user object using the access_token jwt
     * ```js
     * const { data, error } = await supabase.auth.admin.getUserById(1)
     * ```
     *
     * @exampleResponse Fetch the user object using the access_token jwt
     * ```json
     * {
     *   data: {
     *     user: {
     *       id: '1',
     *       aud: 'authenticated',
     *       role: 'authenticated',
     *       email: 'example@email.com',
     *       email_confirmed_at: '2024-01-01T00:00:00Z',
     *       phone: '',
     *       confirmation_sent_at: '2024-01-01T00:00:00Z',
     *       confirmed_at: '2024-01-01T00:00:00Z',
     *       last_sign_in_at: '2024-01-01T00:00:00Z',
     *       app_metadata: {},
     *       user_metadata: {},
     *       identities: [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "1",
     *           "user_id": "1",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": true,
     *             "phone_verified": false,
     *             "sub": "1"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "email@example.com"
     *         },
     *       ],
     *       created_at: '2024-01-01T00:00:00Z',
     *       updated_at: '2024-01-01T00:00:00Z',
     *       is_anonymous: false,
     *     }
     *   }
     *   error: null
     * }
     * ```
     */
    async getUserById(uid) {
      validateUUID(uid);
      try {
        return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
          headers: this.headers,
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    /**
     * Updates the user data. Changes are applied directly without confirmation flows.
     *
     * @param uid The user's unique identifier
     * @param attributes The data you want to update.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     *
     * @remarks
     * **Important:** This is a server-side operation and does **not** trigger client-side
     * `onAuthStateChange` listeners. The admin API has no connection to client state.
     *
     * To sync changes to the client after calling this method:
     * 1. On the client, call `supabase.auth.refreshSession()` to fetch the updated user data
     * 2. This will trigger the `TOKEN_REFRESHED` event and notify all listeners
     *
     * @example
     * ```typescript
     * // Server-side (Edge Function)
     * const { data, error } = await supabase.auth.admin.updateUserById(
     *   userId,
     *   { user_metadata: { preferences: { theme: 'dark' } } }
     * )
     *
     * // Client-side (to sync the changes)
     * const { data, error } = await supabase.auth.refreshSession()
     * // onAuthStateChange listeners will now be notified with updated user
     * ```
     *
     * @see {@link GoTrueClient.refreshSession} for syncing admin changes to the client
     * @see {@link GoTrueClient.updateUser} for client-side user updates (triggers listeners automatically)
     *
     * @category Auth
     * @subcategory Auth Admin
     *
     * @example Updates a user's email
     * ```js
     * const { data: user, error } = await supabase.auth.admin.updateUserById(
     *   '11111111-1111-1111-1111-111111111111',
     *   { email: 'new@email.com' }
     * )
     * ```
     *
     * @exampleResponse Updates a user's email
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "new@email.com",
     *       "email_confirmed_at": "2024-01-01T00:00:00Z",
     *       "phone": "",
     *       "confirmed_at": "2024-01-01T00:00:00Z",
     *       "recovery_sent_at": "2024-01-01T00:00:00Z",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {
     *         "email": "example@email.com",
     *         "email_verified": false,
     *         "phone_verified": false,
     *         "sub": "11111111-1111-1111-1111-111111111111"
     *       },
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *       "is_anonymous": false
     *     }
     *   },
     *   "error": null
     * }
     * ```
     *
     * @example Updates a user's password
     * ```js
     * const { data: user, error } = await supabase.auth.admin.updateUserById(
     *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
     *   { password: 'new_password' }
     * )
     * ```
     *
     * @example Updates a user's metadata
     * ```js
     * const { data: user, error } = await supabase.auth.admin.updateUserById(
     *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
     *   { user_metadata: { hello: 'world' } }
     * )
     * ```
     *
     * @example Updates a user's app_metadata
     * ```js
     * const { data: user, error } = await supabase.auth.admin.updateUserById(
     *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
     *   { app_metadata: { plan: 'trial' } }
     * )
     * ```
     *
     * @example Confirms a user's email address
     * ```js
     * const { data: user, error } = await supabase.auth.admin.updateUserById(
     *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
     *   { email_confirm: true }
     * )
     * ```
     *
     * @example Confirms a user's phone number
     * ```js
     * const { data: user, error } = await supabase.auth.admin.updateUserById(
     *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
     *   { phone_confirm: true }
     * )
     * ```
     *
     * @example Ban a user for 100 years
     * ```js
     * const { data: user, error } = await supabase.auth.admin.updateUserById(
     *   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
     *   { ban_duration: '876000h' }
     * )
     * ```
     */
    async updateUserById(uid, attributes) {
      validateUUID(uid);
      try {
        return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
          body: attributes,
          headers: this.headers,
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    /**
     * Delete a user. Requires a `service_role` key.
     *
     * @param id The user id you want to remove.
     * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
     * Defaults to false for backward compatibility.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     *
     * @category Auth
     * @subcategory Auth Admin
     *
     * @remarks
     * - The `deleteUser()` method requires the user's ID, which maps to the `auth.users.id` column.
     *
     * @example Removes a user
     * ```js
     * const { data, error } = await supabase.auth.admin.deleteUser(
     *   '715ed5db-f090-4b8c-a067-640ecee36aa0'
     * )
     * ```
     *
     * @exampleResponse Removes a user
     * ```json
     * {
     *   "data": {
     *     "user": {}
     *   },
     *   "error": null
     * }
     * ```
     */
    async deleteUser(id, shouldSoftDelete = false) {
      validateUUID(id);
      try {
        return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
          headers: this.headers,
          body: {
            should_soft_delete: shouldSoftDelete
          },
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    async _listFactors(params) {
      validateUUID(params.userId);
      try {
        const { data, error } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
          headers: this.headers,
          xform: (factors) => {
            return { data: { factors }, error: null };
          }
        });
        return { data, error };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    async _deleteFactor(params) {
      validateUUID(params.userId);
      validateUUID(params.id);
      try {
        const data = await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
          headers: this.headers
        });
        return { data, error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Lists all OAuth clients with optional pagination.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _listOAuthClients(params) {
      var _a, _b, _c, _d, _e, _f, _g;
      try {
        const pagination = { nextPage: null, lastPage: 0, total: 0 };
        const response = await _request(this.fetch, "GET", `${this.url}/admin/oauth/clients`, {
          headers: this.headers,
          noResolveJson: true,
          query: {
            page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
            per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
          },
          xform: _noResolveJsonResponse
        });
        if (response.error)
          throw response.error;
        const clients = await response.json();
        const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
        const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
        if (links.length > 0) {
          links.forEach((link) => {
            const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
            const rel = JSON.parse(link.split(";")[1].split("=")[1]);
            pagination[`${rel}Page`] = page;
          });
          pagination.total = parseInt(total);
        }
        return { data: Object.assign(Object.assign({}, clients), pagination), error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { clients: [] }, error };
        }
        throw error;
      }
    }
    /**
     * Creates a new OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _createOAuthClient(params) {
      try {
        return await _request(this.fetch, "POST", `${this.url}/admin/oauth/clients`, {
          body: params,
          headers: this.headers,
          xform: (client) => {
            return { data: client, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Gets details of a specific OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _getOAuthClient(clientId) {
      try {
        return await _request(this.fetch, "GET", `${this.url}/admin/oauth/clients/${clientId}`, {
          headers: this.headers,
          xform: (client) => {
            return { data: client, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Updates an existing OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _updateOAuthClient(clientId, params) {
      try {
        return await _request(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${clientId}`, {
          body: params,
          headers: this.headers,
          xform: (client) => {
            return { data: client, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Deletes an OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _deleteOAuthClient(clientId) {
      try {
        await _request(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${clientId}`, {
          headers: this.headers,
          noResolveJson: true
        });
        return { data: null, error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Regenerates the secret for an OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _regenerateOAuthClientSecret(clientId) {
      try {
        return await _request(this.fetch, "POST", `${this.url}/admin/oauth/clients/${clientId}/regenerate_secret`, {
          headers: this.headers,
          xform: (client) => {
            return { data: client, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Lists all custom providers with optional type filter.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _listCustomProviders(params) {
      try {
        const query = {};
        if (params === null || params === void 0 ? void 0 : params.type) {
          query.type = params.type;
        }
        return await _request(this.fetch, "GET", `${this.url}/admin/custom-providers`, {
          headers: this.headers,
          query,
          xform: (data) => {
            var _a;
            return { data: { providers: (_a = data === null || data === void 0 ? void 0 : data.providers) !== null && _a !== void 0 ? _a : [] }, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { providers: [] }, error };
        }
        throw error;
      }
    }
    /**
     * Creates a new custom OIDC/OAuth provider.
     *
     * For OIDC providers, the server fetches and validates the OpenID Connect discovery document
     * from the issuer's well-known endpoint (or the provided `discovery_url`) at creation time.
     * This may return a validation error (`error_code: "validation_failed"`) if the discovery
     * document is unreachable, not valid JSON, missing required fields, or if the issuer
     * in the document does not match the expected issuer.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _createCustomProvider(params) {
      try {
        return await _request(this.fetch, "POST", `${this.url}/admin/custom-providers`, {
          body: params,
          headers: this.headers,
          xform: (provider) => {
            return { data: provider, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Gets details of a specific custom provider by identifier.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _getCustomProvider(identifier) {
      try {
        return await _request(this.fetch, "GET", `${this.url}/admin/custom-providers/${identifier}`, {
          headers: this.headers,
          xform: (provider) => {
            return { data: provider, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Updates an existing custom provider.
     *
     * When `issuer` or `discovery_url` is changed on an OIDC provider, the server re-fetches and
     * validates the discovery document before persisting. This may return a validation error
     * (`error_code: "validation_failed"`) if the discovery document is unreachable, invalid, or
     * the issuer does not match.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _updateCustomProvider(identifier, params) {
      try {
        return await _request(this.fetch, "PUT", `${this.url}/admin/custom-providers/${identifier}`, {
          body: params,
          headers: this.headers,
          xform: (provider) => {
            return { data: provider, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Deletes a custom provider.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _deleteCustomProvider(identifier) {
      try {
        await _request(this.fetch, "DELETE", `${this.url}/admin/custom-providers/${identifier}`, {
          headers: this.headers,
          noResolveJson: true
        });
        return { data: null, error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Lists all passkeys for a user.
     *
     * This function should only be called on a server. Never expose your secret key in the browser.
     *
     * Requires `auth.experimental.passkey: true`.
     */
    async _adminListPasskeys(params) {
      assertPasskeyExperimentalEnabled(this.experimental);
      validateUUID(params.userId);
      try {
        return await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/passkeys`, { headers: this.headers, xform: (data) => ({ data, error: null }) });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Deletes a user's passkey.
     *
     * This function should only be called on a server. Never expose your secret key in the browser.
     *
     * Requires `auth.experimental.passkey: true`.
     */
    async _adminDeletePasskey(params) {
      assertPasskeyExperimentalEnabled(this.experimental);
      validateUUID(params.userId);
      validateUUID(params.passkeyId);
      try {
        await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/passkeys/${params.passkeyId}`, { headers: this.headers, noResolveJson: true });
        return { data: null, error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
  };

  // node_modules/@supabase/auth-js/dist/module/lib/local-storage.js
  function memoryLocalStorageAdapter(store = {}) {
    return {
      getItem: (key) => {
        return store[key] || null;
      },
      setItem: (key, value) => {
        store[key] = value;
      },
      removeItem: (key) => {
        delete store[key];
      }
    };
  }

  // node_modules/@supabase/auth-js/dist/module/lib/locks.js
  var internals = {
    /**
     * @experimental
     */
    debug: !!(globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
  };
  var LockAcquireTimeoutError = class extends Error {
    constructor(message) {
      super(message);
      this.isAcquireTimeout = true;
    }
  };

  // node_modules/@supabase/auth-js/dist/module/lib/polyfills.js
  function polyfillGlobalThis() {
    if (typeof globalThis === "object")
      return;
    try {
      Object.defineProperty(Object.prototype, "__magic__", {
        get: function() {
          return this;
        },
        configurable: true
      });
      __magic__.globalThis = __magic__;
      delete Object.prototype.__magic__;
    } catch (e3) {
      if (typeof self !== "undefined") {
        self.globalThis = self;
      }
    }
  }

  // node_modules/@supabase/auth-js/dist/module/lib/web3/ethereum.js
  function getAddress(address) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error(`@supabase/auth-js: Address "${address}" is invalid.`);
    }
    return address.toLowerCase();
  }
  function fromHex(hex) {
    return parseInt(hex, 16);
  }
  function toHex(value) {
    const bytes = new TextEncoder().encode(value);
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return "0x" + hex;
  }
  function createSiweMessage(parameters) {
    var _a;
    const { chainId, domain, expirationTime, issuedAt = /* @__PURE__ */ new Date(), nonce, notBefore, requestId, resources, scheme, uri, version: version5 } = parameters;
    {
      if (!Number.isInteger(chainId))
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${chainId}`);
      if (!domain)
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);
      if (nonce && nonce.length < 8)
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${nonce}`);
      if (!uri)
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);
      if (version5 !== "1")
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${version5}`);
      if ((_a = parameters.statement) === null || _a === void 0 ? void 0 : _a.includes("\n"))
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${parameters.statement}`);
    }
    const address = getAddress(parameters.address);
    const origin = scheme ? `${scheme}://${domain}` : domain;
    const statement = parameters.statement ? `${parameters.statement}
` : "";
    const prefix = `${origin} wants you to sign in with your Ethereum account:
${address}

${statement}`;
    let suffix = `URI: ${uri}
Version: ${version5}
Chain ID: ${chainId}${nonce ? `
Nonce: ${nonce}` : ""}
Issued At: ${issuedAt.toISOString()}`;
    if (expirationTime)
      suffix += `
Expiration Time: ${expirationTime.toISOString()}`;
    if (notBefore)
      suffix += `
Not Before: ${notBefore.toISOString()}`;
    if (requestId)
      suffix += `
Request ID: ${requestId}`;
    if (resources) {
      let content = "\nResources:";
      for (const resource of resources) {
        if (!resource || typeof resource !== "string")
          throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${resource}`);
        content += `
- ${resource}`;
      }
      suffix += content;
    }
    return `${prefix}
${suffix}`;
  }

  // node_modules/@supabase/auth-js/dist/module/lib/webauthn.errors.js
  var WebAuthnError = class extends Error {
    constructor({ message, code, cause, name }) {
      var _a;
      super(message, { cause });
      this.__isWebAuthnError = true;
      this.name = (_a = name !== null && name !== void 0 ? name : cause instanceof Error ? cause.name : void 0) !== null && _a !== void 0 ? _a : "Unknown Error";
      this.code = code;
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        code: this.code
      };
    }
  };
  var WebAuthnUnknownError = class extends WebAuthnError {
    constructor(message, originalError) {
      super({
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: originalError,
        message
      });
      this.name = "WebAuthnUnknownError";
      this.originalError = originalError;
    }
  };
  function identifyRegistrationError({ error, options }) {
    var _a, _b, _c;
    const { publicKey } = options;
    if (!publicKey) {
      throw Error("options was missing required publicKey property");
    }
    if (error.name === "AbortError") {
      if (options.signal instanceof AbortSignal) {
        return new WebAuthnError({
          message: "Registration ceremony was sent an abort signal",
          code: "ERROR_CEREMONY_ABORTED",
          cause: error
        });
      }
    } else if (error.name === "ConstraintError") {
      if (((_a = publicKey.authenticatorSelection) === null || _a === void 0 ? void 0 : _a.requireResidentKey) === true) {
        return new WebAuthnError({
          message: "Discoverable credentials were required but no available authenticator supported it",
          code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
          cause: error
        });
      } else if (
        // @ts-ignore: `mediation` doesn't yet exist on CredentialCreationOptions but it's possible as of Sept 2024
        options.mediation === "conditional" && ((_b = publicKey.authenticatorSelection) === null || _b === void 0 ? void 0 : _b.userVerification) === "required"
      ) {
        return new WebAuthnError({
          message: "User verification was required during automatic registration but it could not be performed",
          code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",
          cause: error
        });
      } else if (((_c = publicKey.authenticatorSelection) === null || _c === void 0 ? void 0 : _c.userVerification) === "required") {
        return new WebAuthnError({
          message: "User verification was required but no available authenticator supported it",
          code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
          cause: error
        });
      }
    } else if (error.name === "InvalidStateError") {
      return new WebAuthnError({
        message: "The authenticator was previously registered",
        code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
        cause: error
      });
    } else if (error.name === "NotAllowedError") {
      return new WebAuthnError({
        message: error.message,
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: error
      });
    } else if (error.name === "NotSupportedError") {
      const validPubKeyCredParams = publicKey.pubKeyCredParams.filter((param) => param.type === "public-key");
      if (validPubKeyCredParams.length === 0) {
        return new WebAuthnError({
          message: 'No entry in pubKeyCredParams was of type "public-key"',
          code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
          cause: error
        });
      }
      return new WebAuthnError({
        message: "No available authenticator supported any of the specified pubKeyCredParams algorithms",
        code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
        cause: error
      });
    } else if (error.name === "SecurityError") {
      const effectiveDomain = window.location.hostname;
      if (!isValidDomain(effectiveDomain)) {
        return new WebAuthnError({
          message: `${window.location.hostname} is an invalid domain`,
          code: "ERROR_INVALID_DOMAIN",
          cause: error
        });
      } else if (publicKey.rp.id !== effectiveDomain) {
        return new WebAuthnError({
          message: `The RP ID "${publicKey.rp.id}" is invalid for this domain`,
          code: "ERROR_INVALID_RP_ID",
          cause: error
        });
      }
    } else if (error.name === "TypeError") {
      if (publicKey.user.id.byteLength < 1 || publicKey.user.id.byteLength > 64) {
        return new WebAuthnError({
          message: "User ID was not between 1 and 64 characters",
          code: "ERROR_INVALID_USER_ID_LENGTH",
          cause: error
        });
      }
    } else if (error.name === "UnknownError") {
      return new WebAuthnError({
        message: "The authenticator was unable to process the specified options, or could not create a new credential",
        code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
        cause: error
      });
    }
    return new WebAuthnError({
      message: "a Non-Webauthn related error has occurred",
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: error
    });
  }
  function identifyAuthenticationError({ error, options }) {
    const { publicKey } = options;
    if (!publicKey) {
      throw Error("options was missing required publicKey property");
    }
    if (error.name === "AbortError") {
      if (options.signal instanceof AbortSignal) {
        return new WebAuthnError({
          message: "Authentication ceremony was sent an abort signal",
          code: "ERROR_CEREMONY_ABORTED",
          cause: error
        });
      }
    } else if (error.name === "NotAllowedError") {
      return new WebAuthnError({
        message: error.message,
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: error
      });
    } else if (error.name === "SecurityError") {
      const effectiveDomain = window.location.hostname;
      if (!isValidDomain(effectiveDomain)) {
        return new WebAuthnError({
          message: `${window.location.hostname} is an invalid domain`,
          code: "ERROR_INVALID_DOMAIN",
          cause: error
        });
      } else if (publicKey.rpId !== effectiveDomain) {
        return new WebAuthnError({
          message: `The RP ID "${publicKey.rpId}" is invalid for this domain`,
          code: "ERROR_INVALID_RP_ID",
          cause: error
        });
      }
    } else if (error.name === "UnknownError") {
      return new WebAuthnError({
        message: "The authenticator was unable to process the specified options, or could not create a new assertion signature",
        code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
        cause: error
      });
    }
    return new WebAuthnError({
      message: "a Non-Webauthn related error has occurred",
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: error
    });
  }

  // node_modules/@supabase/auth-js/dist/module/lib/webauthn.js
  var WebAuthnAbortService = class {
    /**
     * Create an abort signal for a new WebAuthn operation.
     * Automatically cancels any existing operation.
     *
     * @returns {AbortSignal} Signal to pass to navigator.credentials.create() or .get()
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal MDN - AbortSignal}
     */
    createNewAbortSignal() {
      if (this.controller) {
        const abortError = new Error("Cancelling existing WebAuthn API call for new one");
        abortError.name = "AbortError";
        this.controller.abort(abortError);
      }
      const newController = new AbortController();
      this.controller = newController;
      return newController.signal;
    }
    /**
     * Manually cancel the current WebAuthn operation.
     * Useful for cleaning up when user cancels or navigates away.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort MDN - AbortController.abort}
     */
    cancelCeremony() {
      if (this.controller) {
        const abortError = new Error("Manually cancelling existing WebAuthn API call");
        abortError.name = "AbortError";
        this.controller.abort(abortError);
        this.controller = void 0;
      }
    }
  };
  var webAuthnAbortService = new WebAuthnAbortService();
  function deserializeCredentialCreationOptions(options) {
    if (!options) {
      throw new Error("Credential creation options are required");
    }
    if (typeof PublicKeyCredential !== "undefined" && "parseCreationOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseCreationOptionsFromJSON === "function") {
      return PublicKeyCredential.parseCreationOptionsFromJSON(
        /** we assert the options here as typescript still doesn't know about future webauthn types */
        options
      );
    }
    const { challenge: challengeStr, user: userOpts, excludeCredentials } = options, restOptions = __rest(
      options,
      ["challenge", "user", "excludeCredentials"]
    );
    const challenge = base64UrlToUint8Array(challengeStr).buffer;
    const user = Object.assign(Object.assign({}, userOpts), { id: base64UrlToUint8Array(userOpts.id).buffer });
    const result = Object.assign(Object.assign({}, restOptions), {
      challenge,
      user
    });
    if (excludeCredentials && excludeCredentials.length > 0) {
      result.excludeCredentials = new Array(excludeCredentials.length);
      for (let i2 = 0; i2 < excludeCredentials.length; i2++) {
        const cred = excludeCredentials[i2];
        result.excludeCredentials[i2] = Object.assign(Object.assign({}, cred), {
          id: base64UrlToUint8Array(cred.id).buffer,
          type: cred.type || "public-key",
          // Cast transports to handle future transport types like "cable"
          transports: cred.transports
        });
      }
    }
    return result;
  }
  function deserializeCredentialRequestOptions(options) {
    if (!options) {
      throw new Error("Credential request options are required");
    }
    if (typeof PublicKeyCredential !== "undefined" && "parseRequestOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseRequestOptionsFromJSON === "function") {
      return PublicKeyCredential.parseRequestOptionsFromJSON(options);
    }
    const { challenge: challengeStr, allowCredentials } = options, restOptions = __rest(
      options,
      ["challenge", "allowCredentials"]
    );
    const challenge = base64UrlToUint8Array(challengeStr).buffer;
    const result = Object.assign(Object.assign({}, restOptions), { challenge });
    if (allowCredentials && allowCredentials.length > 0) {
      result.allowCredentials = new Array(allowCredentials.length);
      for (let i2 = 0; i2 < allowCredentials.length; i2++) {
        const cred = allowCredentials[i2];
        result.allowCredentials[i2] = Object.assign(Object.assign({}, cred), {
          id: base64UrlToUint8Array(cred.id).buffer,
          type: cred.type || "public-key",
          // Cast transports to handle future transport types like "cable"
          transports: cred.transports
        });
      }
    }
    return result;
  }
  function serializeCredentialCreationResponse(credential) {
    var _a;
    if ("toJSON" in credential && typeof credential.toJSON === "function") {
      return credential.toJSON();
    }
    const credentialWithAttachment = credential;
    return {
      id: credential.id,
      rawId: credential.id,
      response: {
        attestationObject: bytesToBase64URL(new Uint8Array(credential.response.attestationObject)),
        clientDataJSON: bytesToBase64URL(new Uint8Array(credential.response.clientDataJSON))
      },
      type: "public-key",
      clientExtensionResults: credential.getClientExtensionResults(),
      // Convert null to undefined and cast to AuthenticatorAttachment type
      authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
    };
  }
  function serializeCredentialRequestResponse(credential) {
    var _a;
    if ("toJSON" in credential && typeof credential.toJSON === "function") {
      return credential.toJSON();
    }
    const credentialWithAttachment = credential;
    const clientExtensionResults = credential.getClientExtensionResults();
    const assertionResponse = credential.response;
    return {
      id: credential.id,
      rawId: credential.id,
      // W3C spec expects rawId to match id for JSON format
      response: {
        authenticatorData: bytesToBase64URL(new Uint8Array(assertionResponse.authenticatorData)),
        clientDataJSON: bytesToBase64URL(new Uint8Array(assertionResponse.clientDataJSON)),
        signature: bytesToBase64URL(new Uint8Array(assertionResponse.signature)),
        userHandle: assertionResponse.userHandle ? bytesToBase64URL(new Uint8Array(assertionResponse.userHandle)) : void 0
      },
      type: "public-key",
      clientExtensionResults,
      // Convert null to undefined and cast to AuthenticatorAttachment type
      authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
    };
  }
  function isValidDomain(hostname) {
    return (
      // Consider localhost valid as well since it's okay wrt Secure Contexts
      hostname === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(hostname)
    );
  }
  function browserSupportsWebAuthn() {
    var _a, _b;
    return !!(isBrowser() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && typeof ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _a === void 0 ? void 0 : _a.create) === "function" && typeof ((_b = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _b === void 0 ? void 0 : _b.get) === "function");
  }
  async function createCredential(options) {
    try {
      const response = await navigator.credentials.create(
        /** we assert the type here until typescript types are updated */
        options
      );
      if (!response) {
        return {
          data: null,
          error: new WebAuthnUnknownError("Empty credential response", response)
        };
      }
      if (!(response instanceof PublicKeyCredential)) {
        return {
          data: null,
          error: new WebAuthnUnknownError("Browser returned unexpected credential type", response)
        };
      }
      return { data: response, error: null };
    } catch (err) {
      return {
        data: null,
        error: identifyRegistrationError({
          error: err,
          options
        })
      };
    }
  }
  async function getCredential(options) {
    try {
      const response = await navigator.credentials.get(
        /** we assert the type here until typescript types are updated */
        options
      );
      if (!response) {
        return {
          data: null,
          error: new WebAuthnUnknownError("Empty credential response", response)
        };
      }
      if (!(response instanceof PublicKeyCredential)) {
        return {
          data: null,
          error: new WebAuthnUnknownError("Browser returned unexpected credential type", response)
        };
      }
      return { data: response, error: null };
    } catch (err) {
      return {
        data: null,
        error: identifyAuthenticationError({
          error: err,
          options
        })
      };
    }
  }
  var DEFAULT_CREATION_OPTIONS = {
    hints: ["security-key"],
    authenticatorSelection: {
      authenticatorAttachment: "cross-platform",
      requireResidentKey: false,
      /** set to preferred because older yubikeys don't have PIN/Biometric */
      userVerification: "preferred",
      residentKey: "discouraged"
    },
    attestation: "direct"
  };
  var DEFAULT_REQUEST_OPTIONS = {
    /** set to preferred because older yubikeys don't have PIN/Biometric */
    userVerification: "preferred",
    hints: ["security-key"],
    attestation: "direct"
  };
  function deepMerge(...sources) {
    const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    const isArrayBufferLike = (val) => val instanceof ArrayBuffer || ArrayBuffer.isView(val);
    const result = {};
    for (const source of sources) {
      if (!source)
        continue;
      for (const key in source) {
        const value = source[key];
        if (value === void 0)
          continue;
        if (Array.isArray(value)) {
          result[key] = value;
        } else if (isArrayBufferLike(value)) {
          result[key] = value;
        } else if (isObject(value)) {
          const existing = result[key];
          if (isObject(existing)) {
            result[key] = deepMerge(existing, value);
          } else {
            result[key] = deepMerge(value);
          }
        } else {
          result[key] = value;
        }
      }
    }
    return result;
  }
  function mergeCredentialCreationOptions(baseOptions, overrides) {
    return deepMerge(DEFAULT_CREATION_OPTIONS, baseOptions, overrides || {});
  }
  function mergeCredentialRequestOptions(baseOptions, overrides) {
    return deepMerge(DEFAULT_REQUEST_OPTIONS, baseOptions, overrides || {});
  }
  var WebAuthnApi = class {
    constructor(client) {
      this.client = client;
      this.enroll = this._enroll.bind(this);
      this.challenge = this._challenge.bind(this);
      this.verify = this._verify.bind(this);
      this.authenticate = this._authenticate.bind(this);
      this.register = this._register.bind(this);
    }
    /**
     * Enroll a new WebAuthn factor.
     * Creates an unverified WebAuthn factor that must be verified with a credential.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {Omit<MFAEnrollWebauthnParams, 'factorType'>} params - Enrollment parameters (friendlyName required)
     * @returns {Promise<AuthMFAEnrollWebauthnResponse>} Enrolled factor details or error
     * @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registering a New Credential}
     */
    async _enroll(params) {
      return this.client.mfa.enroll(Object.assign(Object.assign({}, params), { factorType: "webauthn" }));
    }
    /**
     * Challenge for WebAuthn credential creation or authentication.
     * Combines server challenge with browser credential operations.
     * Handles both registration (create) and authentication (request) flows.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {MFAChallengeWebauthnParams & { friendlyName?: string; signal?: AbortSignal }} params - Challenge parameters including factorId
     * @param {Object} overrides - Allows you to override the parameters passed to navigator.credentials
     * @param {PublicKeyCredentialCreationOptionsFuture} overrides.create - Override options for credential creation
     * @param {PublicKeyCredentialRequestOptionsFuture} overrides.request - Override options for credential request
     * @returns {Promise<RequestResult>} Challenge response with credential or error
     * @see {@link https://w3c.github.io/webauthn/#sctn-credential-creation W3C WebAuthn Spec - Credential Creation}
     * @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying Assertion}
     */
    async _challenge({ factorId, webauthn, friendlyName, signal }, overrides) {
      var _a;
      try {
        const { data: challengeResponse, error: challengeError } = await this.client.mfa.challenge({
          factorId,
          webauthn
        });
        if (!challengeResponse) {
          return { data: null, error: challengeError };
        }
        const abortSignal = signal !== null && signal !== void 0 ? signal : webAuthnAbortService.createNewAbortSignal();
        if (challengeResponse.webauthn.type === "create") {
          const { user } = challengeResponse.webauthn.credential_options.publicKey;
          if (!user.name) {
            const nameToUse = friendlyName;
            if (!nameToUse) {
              const currentUser = await this.client.getUser();
              const userData = currentUser.data.user;
              const fallbackName = ((_a = userData === null || userData === void 0 ? void 0 : userData.user_metadata) === null || _a === void 0 ? void 0 : _a.name) || (userData === null || userData === void 0 ? void 0 : userData.email) || (userData === null || userData === void 0 ? void 0 : userData.id) || "User";
              user.name = `${user.id}:${fallbackName}`;
            } else {
              user.name = `${user.id}:${nameToUse}`;
            }
          }
          if (!user.displayName) {
            user.displayName = user.name;
          }
        }
        switch (challengeResponse.webauthn.type) {
          case "create": {
            const options = mergeCredentialCreationOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.create);
            const { data, error } = await createCredential({
              publicKey: options,
              signal: abortSignal
            });
            if (data) {
              return {
                data: {
                  factorId,
                  challengeId: challengeResponse.id,
                  webauthn: {
                    type: challengeResponse.webauthn.type,
                    credential_response: data
                  }
                },
                error: null
              };
            }
            return { data: null, error };
          }
          case "request": {
            const options = mergeCredentialRequestOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.request);
            const { data, error } = await getCredential(Object.assign(Object.assign({}, challengeResponse.webauthn.credential_options), { publicKey: options, signal: abortSignal }));
            if (data) {
              return {
                data: {
                  factorId,
                  challengeId: challengeResponse.id,
                  webauthn: {
                    type: challengeResponse.webauthn.type,
                    credential_response: data
                  }
                },
                error: null
              };
            }
            return { data: null, error };
          }
        }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        return {
          data: null,
          error: new AuthUnknownError("Unexpected error in challenge", error)
        };
      }
    }
    /**
     * Verify a WebAuthn credential with the server.
     * Completes the WebAuthn ceremony by sending the credential to the server for verification.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {Object} params - Verification parameters
     * @param {string} params.challengeId - ID of the challenge being verified
     * @param {string} params.factorId - ID of the WebAuthn factor
     * @param {MFAVerifyWebauthnParams<T>['webauthn']} params.webauthn - WebAuthn credential response
     * @returns {Promise<AuthMFAVerifyResponse>} Verification result with session or error
     * @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying an Authentication Assertion}
     * */
    async _verify({ challengeId, factorId, webauthn }) {
      return this.client.mfa.verify({
        factorId,
        challengeId,
        webauthn
      });
    }
    /**
     * Complete WebAuthn authentication flow.
     * Performs challenge and verification in a single operation for existing credentials.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {Object} params - Authentication parameters
     * @param {string} params.factorId - ID of the WebAuthn factor to authenticate with
     * @param {Object} params.webauthn - WebAuthn configuration
     * @param {string} params.webauthn.rpId - Relying Party ID (defaults to current hostname)
     * @param {string[]} params.webauthn.rpOrigins - Allowed origins (defaults to current origin)
     * @param {AbortSignal} params.webauthn.signal - Optional abort signal
     * @param {PublicKeyCredentialRequestOptionsFuture} overrides - Override options for navigator.credentials.get
     * @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Authentication result
     * @see {@link https://w3c.github.io/webauthn/#sctn-authentication W3C WebAuthn Spec - Authentication Ceremony}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions MDN - PublicKeyCredentialRequestOptions}
     */
    async _authenticate({ factorId, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
      if (!rpId) {
        return {
          data: null,
          error: new AuthError("rpId is required for WebAuthn authentication")
        };
      }
      try {
        if (!browserSupportsWebAuthn()) {
          return {
            data: null,
            error: new AuthUnknownError("Browser does not support WebAuthn", null)
          };
        }
        const { data: challengeResponse, error: challengeError } = await this.challenge({
          factorId,
          webauthn: { rpId, rpOrigins },
          signal
        }, { request: overrides });
        if (!challengeResponse) {
          return { data: null, error: challengeError };
        }
        const { webauthn } = challengeResponse;
        return this._verify({
          factorId,
          challengeId: challengeResponse.challengeId,
          webauthn: {
            type: webauthn.type,
            rpId,
            rpOrigins,
            credential_response: webauthn.credential_response
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        return {
          data: null,
          error: new AuthUnknownError("Unexpected error in authenticate", error)
        };
      }
    }
    /**
     * Complete WebAuthn registration flow.
     * Performs enrollment, challenge, and verification in a single operation for new credentials.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {Object} params - Registration parameters
     * @param {string} params.friendlyName - User-friendly name for the credential
     * @param {string} params.rpId - Relying Party ID (defaults to current hostname)
     * @param {string[]} params.rpOrigins - Allowed origins (defaults to current origin)
     * @param {AbortSignal} params.signal - Optional abort signal
     * @param {PublicKeyCredentialCreationOptionsFuture} overrides - Override options for navigator.credentials.create
     * @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Registration result
     * @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registration Ceremony}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions MDN - PublicKeyCredentialCreationOptions}
     */
    async _register({ friendlyName, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
      if (!rpId) {
        return {
          data: null,
          error: new AuthError("rpId is required for WebAuthn registration")
        };
      }
      try {
        if (!browserSupportsWebAuthn()) {
          return {
            data: null,
            error: new AuthUnknownError("Browser does not support WebAuthn", null)
          };
        }
        const { data: factor, error: enrollError } = await this._enroll({
          friendlyName
        });
        if (!factor) {
          await this.client.mfa.listFactors().then((factors) => {
            var _a;
            return (_a = factors.data) === null || _a === void 0 ? void 0 : _a.all.find((v) => v.factor_type === "webauthn" && v.friendly_name === friendlyName && v.status !== "unverified");
          }).then((factor2) => factor2 ? this.client.mfa.unenroll({ factorId: factor2 === null || factor2 === void 0 ? void 0 : factor2.id }) : void 0);
          return { data: null, error: enrollError };
        }
        const { data: challengeResponse, error: challengeError } = await this._challenge({
          factorId: factor.id,
          friendlyName: factor.friendly_name,
          webauthn: { rpId, rpOrigins },
          signal
        }, {
          create: overrides
        });
        if (!challengeResponse) {
          return { data: null, error: challengeError };
        }
        return this._verify({
          factorId: factor.id,
          challengeId: challengeResponse.challengeId,
          webauthn: {
            rpId,
            rpOrigins,
            type: challengeResponse.webauthn.type,
            credential_response: challengeResponse.webauthn.credential_response
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        return {
          data: null,
          error: new AuthUnknownError("Unexpected error in register", error)
        };
      }
    }
  };

  // node_modules/@supabase/auth-js/dist/module/GoTrueClient.js
  polyfillGlobalThis();
  var DEFAULT_OPTIONS = {
    url: GOTRUE_URL,
    storageKey: STORAGE_KEY,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    headers: DEFAULT_HEADERS2,
    flowType: "implicit",
    debug: false,
    hasCustomAuthorizationHeader: false,
    throwOnError: false,
    lockAcquireTimeout: 5e3,
    // 5 seconds. Only used when a custom `lock` is supplied. TODO(v3): remove.
    skipAutoInitialize: false,
    experimental: {}
  };
  var GLOBAL_JWKS = {};
  var GoTrueClient = class _GoTrueClient {
    /**
     * The JWKS used for verifying asymmetric JWTs
     */
    get jwks() {
      var _a, _b;
      return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.jwks) !== null && _b !== void 0 ? _b : { keys: [] };
    }
    set jwks(value) {
      GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { jwks: value });
    }
    get jwks_cached_at() {
      var _a, _b;
      return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.cachedAt) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER;
    }
    set jwks_cached_at(value) {
      GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { cachedAt: value });
    }
    /**
     * Create a new client for use in the browser.
     *
     * @example Using supabase-js (recommended)
     * ```ts
     * import { createClient } from '@supabase/supabase-js'
     *
     * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
     * const { data, error } = await supabase.auth.getUser()
     * ```
     *
     * @example Standalone import for bundle-sensitive environments
     * ```ts
     * import { GoTrueClient } from '@supabase/auth-js'
     *
     * const auth = new GoTrueClient({
     *   url: 'https://xyzcompany.supabase.co/auth/v1',
     *   headers: { apikey: 'your-publishable-key' },
     *   storageKey: 'supabase-auth',
     * })
     * ```
     */
    constructor(options) {
      var _a, _b, _c;
      this.userStorage = null;
      this.memoryStorage = null;
      this.stateChangeEmitters = /* @__PURE__ */ new Map();
      this.autoRefreshTicker = null;
      this.autoRefreshTickTimeout = null;
      this.visibilityChangedCallback = null;
      this.refreshingDeferred = null;
      this.lastRefreshFailure = null;
      this._sessionRemovalEpoch = 0;
      this.initializePromise = null;
      this.detectSessionInUrl = true;
      this.hasCustomAuthorizationHeader = false;
      this.suppressGetSessionWarning = false;
      this.lock = null;
      this.lockAcquired = false;
      this.pendingInLock = [];
      this.broadcastChannel = null;
      this.logger = console.log;
      const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
      this.storageKey = settings.storageKey;
      this.instanceID = (_a = _GoTrueClient.nextInstanceID[this.storageKey]) !== null && _a !== void 0 ? _a : 0;
      _GoTrueClient.nextInstanceID[this.storageKey] = this.instanceID + 1;
      this.logDebugMessages = !!settings.debug;
      if (typeof settings.debug === "function") {
        this.logger = settings.debug;
      }
      if (this.instanceID > 0 && isBrowser()) {
        const message = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
        console.warn(message);
        if (this.logDebugMessages) {
          console.trace(message);
        }
      }
      this.persistSession = settings.persistSession;
      this.autoRefreshToken = settings.autoRefreshToken;
      this.experimental = (_b = settings.experimental) !== null && _b !== void 0 ? _b : {};
      this.admin = new GoTrueAdminApi({
        url: settings.url,
        headers: settings.headers,
        fetch: settings.fetch,
        experimental: this.experimental
      });
      this.url = settings.url;
      this.headers = settings.headers;
      this.fetch = resolveFetch3(settings.fetch);
      this.detectSessionInUrl = settings.detectSessionInUrl;
      this.flowType = settings.flowType;
      this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
      this.throwOnError = settings.throwOnError;
      this.lockAcquireTimeout = settings.lockAcquireTimeout;
      if (settings.lock != null) {
        this.lock = settings.lock;
      }
      if (!this.jwks) {
        this.jwks = { keys: [] };
        this.jwks_cached_at = Number.MIN_SAFE_INTEGER;
      }
      this.mfa = {
        verify: this._verify.bind(this),
        enroll: this._enroll.bind(this),
        unenroll: this._unenroll.bind(this),
        challenge: this._challenge.bind(this),
        listFactors: this._listFactors.bind(this),
        challengeAndVerify: this._challengeAndVerify.bind(this),
        getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this),
        webauthn: new WebAuthnApi(this)
      };
      this.oauth = {
        getAuthorizationDetails: this._getAuthorizationDetails.bind(this),
        approveAuthorization: this._approveAuthorization.bind(this),
        denyAuthorization: this._denyAuthorization.bind(this),
        listGrants: this._listOAuthGrants.bind(this),
        revokeGrant: this._revokeOAuthGrant.bind(this)
      };
      this.passkey = {
        startRegistration: this._startPasskeyRegistration.bind(this),
        verifyRegistration: this._verifyPasskeyRegistration.bind(this),
        startAuthentication: this._startPasskeyAuthentication.bind(this),
        verifyAuthentication: this._verifyPasskeyAuthentication.bind(this),
        list: this._listPasskeys.bind(this),
        update: this._updatePasskey.bind(this),
        delete: this._deletePasskey.bind(this)
      };
      if (this.persistSession) {
        if (settings.storage) {
          this.storage = settings.storage;
        } else {
          if (supportsLocalStorage()) {
            this.storage = globalThis.localStorage;
          } else {
            this.memoryStorage = {};
            this.storage = memoryLocalStorageAdapter(this.memoryStorage);
          }
        }
        if (settings.userStorage) {
          this.userStorage = settings.userStorage;
        }
      } else {
        this.memoryStorage = {};
        this.storage = memoryLocalStorageAdapter(this.memoryStorage);
      }
      if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
        try {
          this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
        } catch (e3) {
          console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e3);
        }
        (_c = this.broadcastChannel) === null || _c === void 0 ? void 0 : _c.addEventListener("message", async (event) => {
          this._debug("received broadcast notification from other tab or client", event);
          if (event.data.event === "TOKEN_REFRESHED" || event.data.event === "SIGNED_IN") {
            this.lastRefreshFailure = null;
          }
          try {
            await this._notifyAllSubscribers(event.data.event, event.data.session, false);
          } catch (error) {
            this._debug("#broadcastChannel", "error", error);
          }
        });
      }
      if (!settings.skipAutoInitialize) {
        this.initialize().catch((error) => {
          this._debug("#initialize()", "error", error);
        });
      }
    }
    /**
     * Returns whether error throwing mode is enabled for this client.
     */
    isThrowOnErrorEnabled() {
      return this.throwOnError;
    }
    /**
     * Centralizes return handling with optional error throwing. When `throwOnError` is enabled
     * and the provided result contains a non-nullish error, the error is thrown instead of
     * being returned. This ensures consistent behavior across all public API methods.
     */
    _returnResult(result) {
      if (this.throwOnError && result && result.error) {
        throw result.error;
      }
      return result;
    }
    _logPrefix() {
      return `GoTrueClient@${this.storageKey}:${this.instanceID} (${version3}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
    }
    _debug(...args) {
      if (this.logDebugMessages) {
        this.logger(this._logPrefix(), ...args);
      }
      return this;
    }
    /**
     * Initialize the auth client by loading the session from storage or
     * detecting it from the URL after an OAuth, magic-link, or password-recovery
     * redirect.
     *
     * **Most callers do not need to invoke this directly.** The client calls it
     * automatically during construction, and to react to sign-in events (including
     * post-redirect events) you should subscribe to `onAuthStateChange` rather
     * than awaiting `initialize()`.
     *
     * You only need to call it manually when you have opted out of the automatic
     * call by passing `skipAutoInitialize: true` — for example, in an SSR context
     * where you need to control initialization timing. In that case, awaiting
     * `initialize()` returns the resolved session result (or any error encountered
     * while detecting it from the URL).
     *
     * @category Auth
     */
    async initialize() {
      if (this.initializePromise) {
        return await this.initializePromise;
      }
      this.initializePromise = (async () => {
        if (this.lock != null) {
          return await this._acquireLock(this.lockAcquireTimeout, async () => {
            return await this._initialize();
          });
        }
        return await this._initialize();
      })();
      return await this.initializePromise;
    }
    /**
     * IMPORTANT:
     * 1. Never throw in this method, as it is called from the constructor
     * 2. Never return a session from this method as it would be cached over
     *    the whole lifetime of the client
     */
    async _initialize() {
      var _a;
      try {
        let params = {};
        let callbackUrlType = "none";
        if (isBrowser()) {
          params = parseParametersFromURL(window.location.href);
          if (this._isImplicitGrantCallback(params)) {
            callbackUrlType = "implicit";
          } else if (await this._isPKCECallback(params)) {
            callbackUrlType = "pkce";
          }
        }
        if (isBrowser() && this.detectSessionInUrl && callbackUrlType !== "none") {
          const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
          if (error) {
            this._debug("#_initialize()", "error detecting session from URL", error);
            if (isAuthImplicitGrantRedirectError(error)) {
              const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
              if (errorCode === "identity_already_exists" || errorCode === "identity_not_found" || errorCode === "single_identity_not_deletable") {
                return { error };
              }
            }
            return { error };
          }
          const { session: session2, redirectType } = data;
          this._debug("#_initialize()", "detected session in URL", session2, "redirect type", redirectType);
          await this._saveSession(session2);
          setTimeout(async () => {
            if (redirectType === "recovery") {
              await this._notifyAllSubscribers("PASSWORD_RECOVERY", session2);
            } else {
              await this._notifyAllSubscribers("SIGNED_IN", session2);
            }
          }, 0);
          return { error: null };
        }
        await this._recoverAndRefresh();
        return { error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ error });
        }
        return this._returnResult({
          error: new AuthUnknownError("Unexpected error during initialization", error)
        });
      } finally {
        await this._handleVisibilityChange();
        this._debug("#_initialize()", "end");
      }
    }
    /**
     * Creates a new anonymous user.
     *
     * @returns A session where the is_anonymous claim in the access token JWT set to true
     *
     * @category Auth
     *
     * @remarks
     * - Returns an anonymous user
     * - It is recommended to set up captcha for anonymous sign-ins to prevent abuse. You can pass in the captcha token in the `options` param.
     *
     * @example Create an anonymous user
     * ```js
     * const { data, error } = await supabase.auth.signInAnonymously({
     *   options: {
     *     captchaToken
     *   }
     * });
     * ```
     *
     * @exampleResponse Create an anonymous user
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "",
     *       "phone": "",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {},
     *       "user_metadata": {},
     *       "identities": [],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *       "is_anonymous": true
     *     },
     *     "session": {
     *       "access_token": "<ACCESS_TOKEN>",
     *       "token_type": "bearer",
     *       "expires_in": 3600,
     *       "expires_at": 1700000000,
     *       "refresh_token": "<REFRESH_TOKEN>",
     *       "user": {
     *         "id": "11111111-1111-1111-1111-111111111111",
     *         "aud": "authenticated",
     *         "role": "authenticated",
     *         "email": "",
     *         "phone": "",
     *         "last_sign_in_at": "2024-01-01T00:00:00Z",
     *         "app_metadata": {},
     *         "user_metadata": {},
     *         "identities": [],
     *         "created_at": "2024-01-01T00:00:00Z",
     *         "updated_at": "2024-01-01T00:00:00Z",
     *         "is_anonymous": true
     *       }
     *     }
     *   },
     *   "error": null
     * }
     * ```
     *
     * @example Create an anonymous user with custom user metadata
     * ```js
     * const { data, error } = await supabase.auth.signInAnonymously({
     *   options: {
     *     data
     *   }
     * })
     * ```
     */
    async signInAnonymously(credentials) {
      var _a, _b, _c;
      try {
        const res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
            gotrue_meta_security: { captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken }
          },
          xform: _sessionResponse
        });
        const { data, error } = res;
        if (error || !data) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        const session2 = data.session;
        const user = data.user;
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", session2);
        }
        return this._returnResult({ data: { user, session: session2 }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Creates a new user.
     *
     * Be aware that if a user account exists in the system you may get back an
     * error message that attempts to hide this information from the user.
     * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
     *
     * @returns A logged-in session if the server has "autoconfirm" ON
     * @returns A user if the server has "autoconfirm" OFF
     *
     * @category Auth
     *
     * @remarks
     * - By default, the user needs to verify their email address before logging in. To turn this off, disable **Confirm email** in [your project](/dashboard/project/_/auth/providers).
     * - **Confirm email** determines if users need to confirm their email address after signing up.
     *   - If **Confirm email** is enabled, a `user` is returned but `session` is null.
     *   - If **Confirm email** is disabled, both a `user` and a `session` are returned.
     * - When the user confirms their email address, they are redirected to the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) by default. You can modify your `SITE_URL` or add additional redirect URLs in [your project](/dashboard/project/_/auth/url-configuration).
     * - If signUp() is called for an existing confirmed user:
     *   - When both **Confirm email** and **Confirm phone** (even when phone provider is disabled) are enabled in [your project](/dashboard/project/_/auth/providers), an obfuscated/fake user object is returned.
     *   - When either **Confirm email** or **Confirm phone** (even when phone provider is disabled) is disabled, the error message, `User already registered` is returned.
     * - To fetch the currently logged-in user, refer to [`getUser()`](/docs/reference/javascript/auth-getuser).
     *
     * @example Sign up with an email and password
     * ```js
     * const { data, error } = await supabase.auth.signUp({
     *   email: 'example@email.com',
     *   password: 'example-password',
     * })
     * ```
     *
     * @exampleResponse Sign up with an email and password
     * ```json
     * // Some fields may be null if "confirm email" is enabled.
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "example@email.com",
     *       "email_confirmed_at": "2024-01-01T00:00:00Z",
     *       "phone": "",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {},
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z"
     *     },
     *     "session": {
     *       "access_token": "<ACCESS_TOKEN>",
     *       "token_type": "bearer",
     *       "expires_in": 3600,
     *       "expires_at": 1700000000,
     *       "refresh_token": "<REFRESH_TOKEN>",
     *       "user": {
     *         "id": "11111111-1111-1111-1111-111111111111",
     *         "aud": "authenticated",
     *         "role": "authenticated",
     *         "email": "example@email.com",
     *         "email_confirmed_at": "2024-01-01T00:00:00Z",
     *         "phone": "",
     *         "last_sign_in_at": "2024-01-01T00:00:00Z",
     *         "app_metadata": {
     *           "provider": "email",
     *           "providers": [
     *             "email"
     *           ]
     *         },
     *         "user_metadata": {},
     *         "identities": [
     *           {
     *             "identity_id": "22222222-2222-2222-2222-222222222222",
     *             "id": "11111111-1111-1111-1111-111111111111",
     *             "user_id": "11111111-1111-1111-1111-111111111111",
     *             "identity_data": {
     *               "email": "example@email.com",
     *               "email_verified": false,
     *               "phone_verified": false,
     *               "sub": "11111111-1111-1111-1111-111111111111"
     *             },
     *             "provider": "email",
     *             "last_sign_in_at": "2024-01-01T00:00:00Z",
     *             "created_at": "2024-01-01T00:00:00Z",
     *             "updated_at": "2024-01-01T00:00:00Z",
     *             "email": "example@email.com"
     *           }
     *         ],
     *         "created_at": "2024-01-01T00:00:00Z",
     *         "updated_at": "2024-01-01T00:00:00Z"
     *       }
     *     }
     *   },
     *   "error": null
     * }
     * ```
     *
     * @example Sign up with a phone number and password (SMS)
     * ```js
     * const { data, error } = await supabase.auth.signUp({
     *   phone: '123456789',
     *   password: 'example-password',
     *   options: {
     *     channel: 'sms'
     *   }
     * })
     * ```
     *
     * @exampleDescription Sign up with a phone number and password (whatsapp)
     * The user will be sent a WhatsApp message which contains a OTP. By default, a given user can only request a OTP once every 60 seconds. Note that a user will need to have a valid WhatsApp account that is linked to Twilio in order to use this feature.
     *
     * @example Sign up with a phone number and password (whatsapp)
     * ```js
     * const { data, error } = await supabase.auth.signUp({
     *   phone: '123456789',
     *   password: 'example-password',
     *   options: {
     *     channel: 'whatsapp'
     *   }
     * })
     * ```
     *
     * @example Sign up with additional user metadata
     * ```js
     * const { data, error } = await supabase.auth.signUp(
     *   {
     *     email: 'example@email.com',
     *     password: 'example-password',
     *     options: {
     *       data: {
     *         first_name: 'John',
     *         age: 27,
     *       }
     *     }
     *   }
     * )
     * ```
     *
     * @exampleDescription Sign up with a redirect URL
     * - See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
     *
     * @example Sign up with a redirect URL
     * ```js
     * const { data, error } = await supabase.auth.signUp(
     *   {
     *     email: 'example@email.com',
     *     password: 'example-password',
     *     options: {
     *       emailRedirectTo: 'https://example.com/welcome'
     *     }
     *   }
     * )
     * ```
     */
    async signUp(credentials) {
      var _a, _b, _c;
      try {
        let res;
        if ("email" in credentials) {
          const { email, password, options } = credentials;
          let codeChallenge = null;
          let codeChallengeMethod = null;
          if (this.flowType === "pkce") {
            ;
            [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
          }
          res = await _request(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
            body: {
              email,
              password,
              data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
              code_challenge: codeChallenge,
              code_challenge_method: codeChallengeMethod
            },
            xform: _sessionResponse
          });
        } else if ("phone" in credentials) {
          const { phone, password, options } = credentials;
          res = await _request(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            body: {
              phone,
              password,
              data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
              channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : "sms",
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponse
          });
        } else {
          throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
        }
        const { data, error } = res;
        if (error || !data) {
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        const session2 = data.session;
        const user = data.user;
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", session2);
        }
        return this._returnResult({ data: { user, session: session2 }, error: null });
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Log in an existing user with an email and password or phone and password.
     *
     * Be aware that you may get back an error message that will not distinguish
     * between the cases where the account does not exist or that the
     * email/phone and password combination is wrong or that the account can only
     * be accessed via social login.
     *
     * @category Auth
     *
     * @remarks
     * - Requires either an email and password or a phone number and password.
     *
     * @example Sign in with email and password
     * ```js
     * const { data, error } = await supabase.auth.signInWithPassword({
     *   email: 'example@email.com',
     *   password: 'example-password',
     * })
     * ```
     *
     * @exampleResponse Sign in with email and password
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "example@email.com",
     *       "email_confirmed_at": "2024-01-01T00:00:00Z",
     *       "phone": "",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {},
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z"
     *     },
     *     "session": {
     *       "access_token": "<ACCESS_TOKEN>",
     *       "token_type": "bearer",
     *       "expires_in": 3600,
     *       "expires_at": 1700000000,
     *       "refresh_token": "<REFRESH_TOKEN>",
     *       "user": {
     *         "id": "11111111-1111-1111-1111-111111111111",
     *         "aud": "authenticated",
     *         "role": "authenticated",
     *         "email": "example@email.com",
     *         "email_confirmed_at": "2024-01-01T00:00:00Z",
     *         "phone": "",
     *         "last_sign_in_at": "2024-01-01T00:00:00Z",
     *         "app_metadata": {
     *           "provider": "email",
     *           "providers": [
     *             "email"
     *           ]
     *         },
     *         "user_metadata": {},
     *         "identities": [
     *           {
     *             "identity_id": "22222222-2222-2222-2222-222222222222",
     *             "id": "11111111-1111-1111-1111-111111111111",
     *             "user_id": "11111111-1111-1111-1111-111111111111",
     *             "identity_data": {
     *               "email": "example@email.com",
     *               "email_verified": false,
     *               "phone_verified": false,
     *               "sub": "11111111-1111-1111-1111-111111111111"
     *             },
     *             "provider": "email",
     *             "last_sign_in_at": "2024-01-01T00:00:00Z",
     *             "created_at": "2024-01-01T00:00:00Z",
     *             "updated_at": "2024-01-01T00:00:00Z",
     *             "email": "example@email.com"
     *           }
     *         ],
     *         "created_at": "2024-01-01T00:00:00Z",
     *         "updated_at": "2024-01-01T00:00:00Z"
     *       }
     *     }
     *   },
     *   "error": null
     * }
     * ```
     *
     * @example Sign in with phone and password
     * ```js
     * const { data, error } = await supabase.auth.signInWithPassword({
     *   phone: '+13334445555',
     *   password: 'some-password',
     * })
     * ```
     *
     * @exampleDescription Handling errors
     * Log the full `error` object so fields like `code`, `status`, and `name` aren't hidden. The `error.code` (e.g. `'invalid_credentials'`, `'email_not_confirmed'`) is often more useful for branching than `error.message`, and the full object surfaces both.
     *
     * @example Handling errors
     * ```js
     * const { data, error } = await supabase.auth.signInWithPassword({
     *   email: 'example@email.com',
     *   password: 'example-password',
     * })
     * if (error) {
     *   console.error(error)
     *   return
     * }
     * ```
     */
    async signInWithPassword(credentials) {
      try {
        let res;
        if ("email" in credentials) {
          const { email, password, options } = credentials;
          res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
            headers: this.headers,
            body: {
              email,
              password,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponsePassword
          });
        } else if ("phone" in credentials) {
          const { phone, password, options } = credentials;
          res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
            headers: this.headers,
            body: {
              phone,
              password,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponsePassword
          });
        } else {
          throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
        }
        const { data, error } = res;
        if (error) {
          return this._returnResult({ data: { user: null, session: null }, error });
        } else if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({
          data: Object.assign({ user: data.user, session: data.session }, data.weak_password ? { weakPassword: data.weak_password } : null),
          error
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Log in an existing user via a third-party provider.
     * This method supports the PKCE flow.
     *
     * @category Auth
     *
     * @remarks
     * - This method is used for signing in using [Social Login (OAuth) providers](/docs/guides/auth#configure-third-party-providers).
     * - It works by redirecting your application to the provider's authorization screen, before bringing back the user to your app.
     *
     * @example Sign in using a third-party provider
     * ```js
     * const { data, error } = await supabase.auth.signInWithOAuth({
     *   provider: 'github'
     * })
     * ```
     *
     * @exampleResponse Sign in using a third-party provider
     * ```json
     * {
     *   data: {
     *     provider: 'github',
     *     url: <PROVIDER_URL_TO_REDIRECT_TO>
     *   },
     *   error: null
     * }
     * ```
     *
     * @exampleDescription Sign in using a third-party provider with redirect
     * - When the OAuth provider successfully authenticates the user, they are redirected to the URL specified in the `redirectTo` parameter. This parameter defaults to the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls). It does not redirect the user immediately after invoking this method.
     * - See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
     *
     * @example Sign in using a third-party provider with redirect
     * ```js
     * const { data, error } = await supabase.auth.signInWithOAuth({
     *   provider: 'github',
     *   options: {
     *     redirectTo: 'https://example.com/welcome'
     *   }
     * })
     * ```
     *
     * @exampleDescription Sign in with scopes and access provider tokens
     * If you need additional access from an OAuth provider, in order to access provider specific APIs in the name of the user, you can do this by passing in the scopes the user should authorize for your application. Note that the `scopes` option takes in **a space-separated list** of scopes.
     *
     * Because OAuth sign-in often includes redirects, you should register an `onAuthStateChange` callback immediately after you create the Supabase client. This callback will listen for the presence of `provider_token` and `provider_refresh_token` properties on the `session` object and store them in local storage. The client library will emit these values **only once** immediately after the user signs in. You can then access them by looking them up in local storage, or send them to your backend servers for further processing.
     *
     * Finally, make sure you remove them from local storage on the `SIGNED_OUT` event. If the OAuth provider supports token revocation, make sure you call those APIs either from the frontend or schedule them to be called on the backend.
     *
     * @example Sign in with scopes and access provider tokens
     * ```js
     * // Register this immediately after calling createClient!
     * // Because signInWithOAuth causes a redirect, you need to fetch the
     * // provider tokens from the callback.
     * supabase.auth.onAuthStateChange((event, session) => {
     *   if (session && session.provider_token) {
     *     window.localStorage.setItem('oauth_provider_token', session.provider_token)
     *   }
     *
     *   if (session && session.provider_refresh_token) {
     *     window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
     *   }
     *
     *   if (event === 'SIGNED_OUT') {
     *     window.localStorage.removeItem('oauth_provider_token')
     *     window.localStorage.removeItem('oauth_provider_refresh_token')
     *   }
     * })
     *
     * // Call this on your Sign in with GitHub button to initiate OAuth
     * // with GitHub with the requested elevated scopes.
     * await supabase.auth.signInWithOAuth({
     *   provider: 'github',
     *   options: {
     *     scopes: 'repo gist notifications'
     *   }
     * })
     * ```
     */
    async signInWithOAuth(credentials) {
      var _a, _b, _c, _d;
      return await this._handleProviderSignIn(credentials.provider, {
        redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
        scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
        queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
        skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
      });
    }
    /**
     * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
     *
     * @category Auth
     *
     * @remarks
     * - Used when `flowType` is set to `pkce` in client options.
     *
     * @example Exchange Auth Code
     * ```js
     * supabase.auth.exchangeCodeForSession('34e770dd-9ff9-416c-87fa-43b31d7ef225')
     * ```
     *
     * @exampleResponse Exchange Auth Code
     * ```json
     * {
     *   "data": {
     *     session: {
     *       access_token: '<ACCESS_TOKEN>',
     *       token_type: 'bearer',
     *       expires_in: 3600,
     *       expires_at: 1700000000,
     *       refresh_token: '<REFRESH_TOKEN>',
     *       user: {
     *         id: '11111111-1111-1111-1111-111111111111',
     *         aud: 'authenticated',
     *         role: 'authenticated',
     *         email: 'example@email.com'
     *         email_confirmed_at: '2024-01-01T00:00:00Z',
     *         phone: '',
     *         confirmation_sent_at: '2024-01-01T00:00:00Z',
     *         confirmed_at: '2024-01-01T00:00:00Z',
     *         last_sign_in_at: '2024-01-01T00:00:00Z',
     *         app_metadata: {
     *           "provider": "email",
     *           "providers": [
     *             "email",
     *             "<OTHER_PROVIDER>"
     *           ]
     *         },
     *         user_metadata: {
     *           email: 'email@email.com',
     *           email_verified: true,
     *           full_name: 'User Name',
     *           iss: '<ISS>',
     *           name: 'User Name',
     *           phone_verified: false,
     *           provider_id: '<PROVIDER_ID>',
     *           sub: '<SUB>'
     *         },
     *         identities: [
     *           {
     *             "identity_id": "22222222-2222-2222-2222-222222222222",
     *             "id": "11111111-1111-1111-1111-111111111111",
     *             "user_id": "11111111-1111-1111-1111-111111111111",
     *             "identity_data": {
     *               "email": "example@email.com",
     *               "email_verified": false,
     *               "phone_verified": false,
     *               "sub": "11111111-1111-1111-1111-111111111111"
     *             },
     *             "provider": "email",
     *             "last_sign_in_at": "2024-01-01T00:00:00Z",
     *             "created_at": "2024-01-01T00:00:00Z",
     *             "updated_at": "2024-01-01T00:00:00Z",
     *             "email": "email@example.com"
     *           },
     *           {
     *             "identity_id": "33333333-3333-3333-3333-333333333333",
     *             "id": "<ID>",
     *             "user_id": "<USER_ID>",
     *             "identity_data": {
     *               "email": "example@email.com",
     *               "email_verified": true,
     *               "full_name": "User Name",
     *               "iss": "<ISS>",
     *               "name": "User Name",
     *               "phone_verified": false,
     *               "provider_id": "<PROVIDER_ID>",
     *               "sub": "<SUB>"
     *             },
     *             "provider": "<PROVIDER>",
     *             "last_sign_in_at": "2024-01-01T00:00:00Z",
     *             "created_at": "2024-01-01T00:00:00Z",
     *             "updated_at": "2024-01-01T00:00:00Z",
     *             "email": "example@email.com"
     *           }
     *         ],
     *         created_at: '2024-01-01T00:00:00Z',
     *         updated_at: '2024-01-01T00:00:00Z',
     *         is_anonymous: false
     *       },
     *       provider_token: '<PROVIDER_TOKEN>',
     *       provider_refresh_token: '<PROVIDER_REFRESH_TOKEN>'
     *     },
     *     user: {
     *       id: '11111111-1111-1111-1111-111111111111',
     *       aud: 'authenticated',
     *       role: 'authenticated',
     *       email: 'example@email.com',
     *       email_confirmed_at: '2024-01-01T00:00:00Z',
     *       phone: '',
     *       confirmation_sent_at: '2024-01-01T00:00:00Z',
     *       confirmed_at: '2024-01-01T00:00:00Z',
     *       last_sign_in_at: '2024-01-01T00:00:00Z',
     *       app_metadata: {
     *         provider: 'email',
     *         providers: [
     *           "email",
     *           "<OTHER_PROVIDER>"
     *         ]
     *       },
     *       user_metadata: {
     *         email: 'email@email.com',
     *         email_verified: true,
     *         full_name: 'User Name',
     *         iss: '<ISS>',
     *         name: 'User Name',
     *         phone_verified: false,
     *         provider_id: '<PROVIDER_ID>',
     *         sub: '<SUB>'
     *       },
     *       identities: [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "email@example.com"
     *         },
     *         {
     *           "identity_id": "33333333-3333-3333-3333-333333333333",
     *           "id": "<ID>",
     *           "user_id": "<USER_ID>",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": true,
     *             "full_name": "User Name",
     *             "iss": "<ISS>",
     *             "name": "User Name",
     *             "phone_verified": false,
     *             "provider_id": "<PROVIDER_ID>",
     *             "sub": "<SUB>"
     *           },
     *           "provider": "<PROVIDER>",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       created_at: '2024-01-01T00:00:00Z',
     *       updated_at: '2024-01-01T00:00:00Z',
     *       is_anonymous: false
     *     },
     *     redirectType: null
     *   },
     *   "error": null
     * }
     * ```
     */
    async exchangeCodeForSession(authCode) {
      await this.initializePromise;
      if (this.lock != null) {
        return this._acquireLock(this.lockAcquireTimeout, async () => {
          return this._exchangeCodeForSession(authCode);
        });
      }
      return this._exchangeCodeForSession(authCode);
    }
    /**
     * Signs in a user by verifying a message signed by the user's private key.
     * Supports Ethereum (via Sign-In-With-Ethereum) & Solana (Sign-In-With-Solana) standards,
     * both of which derive from the EIP-4361 standard
     * With slight variation on Solana's side.
     * @reference https://eips.ethereum.org/EIPS/eip-4361
     *
     * @category Auth
     *
     * @remarks
     * - Uses a Web3 (Ethereum, Solana) wallet to sign a user in.
     * - Read up on the [potential for abuse](/docs/guides/auth/auth-web3#potential-for-abuse) before using it.
     *
     * @example Sign in with Solana or Ethereum (Window API)
     * ```js
     *   // uses window.ethereum for the wallet
     *   const { data, error } = await supabase.auth.signInWithWeb3({
     *     chain: 'ethereum',
     *     statement: 'I accept the Terms of Service at https://example.com/tos'
     *   })
     *
     *   // uses window.solana for the wallet
     *   const { data, error } = await supabase.auth.signInWithWeb3({
     *     chain: 'solana',
     *     statement: 'I accept the Terms of Service at https://example.com/tos'
     *   })
     * ```
     *
     * @example Sign in with Ethereum (Message and Signature)
     * ```js
     *   const { data, error } = await supabase.auth.signInWithWeb3({
     *     chain: 'ethereum',
     *     message: '<sign in with ethereum message>',
     *     signature: '<hex of the ethereum signature over the message>',
     *   })
     * ```
     *
     * @example Sign in with Solana (Brave)
     * ```js
     *   const { data, error } = await supabase.auth.signInWithWeb3({
     *     chain: 'solana',
     *     statement: 'I accept the Terms of Service at https://example.com/tos',
     *     wallet: window.braveSolana
     *   })
     * ```
     *
     * @example Sign in with Solana (Wallet Adapter)
     * ```jsx
     *   function SignInButton() {
     *   const wallet = useWallet()
     *
     *   return (
     *     <>
     *       {wallet.connected ? (
     *         <button
     *           onClick={() => {
     *             supabase.auth.signInWithWeb3({
     *               chain: 'solana',
     *               statement: 'I accept the Terms of Service at https://example.com/tos',
     *               wallet,
     *             })
     *           }}
     *         >
     *           Sign in with Solana
     *         </button>
     *       ) : (
     *         <WalletMultiButton />
     *       )}
     *     </>
     *   )
     * }
     *
     * function App() {
     *   const endpoint = clusterApiUrl('devnet')
     *   const wallets = useMemo(() => [], [])
     *
     *   return (
     *     <ConnectionProvider endpoint={endpoint}>
     *       <WalletProvider wallets={wallets}>
     *         <WalletModalProvider>
     *           <SignInButton />
     *         </WalletModalProvider>
     *       </WalletProvider>
     *     </ConnectionProvider>
     *   )
     * }
     * ```
     */
    async signInWithWeb3(credentials) {
      const { chain } = credentials;
      switch (chain) {
        case "ethereum":
          return await this.signInWithEthereum(credentials);
        case "solana":
          return await this.signInWithSolana(credentials);
        default:
          throw new Error(`@supabase/auth-js: Unsupported chain "${chain}"`);
      }
    }
    async signInWithEthereum(credentials) {
      var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m;
      let message;
      let signature;
      if ("message" in credentials) {
        message = credentials.message;
        signature = credentials.signature;
      } else {
        const { chain, wallet, statement, options } = credentials;
        let resolvedWallet;
        if (!isBrowser()) {
          if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
            throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
          }
          resolvedWallet = wallet;
        } else if (typeof wallet === "object") {
          resolvedWallet = wallet;
        } else {
          const windowAny = window;
          if ("ethereum" in windowAny && typeof windowAny.ethereum === "object" && "request" in windowAny.ethereum && typeof windowAny.ethereum.request === "function") {
            resolvedWallet = windowAny.ethereum;
          } else {
            throw new Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`);
          }
        }
        const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
        const accounts = await resolvedWallet.request({
          method: "eth_requestAccounts"
        }).then((accs) => accs).catch(() => {
          throw new Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`);
        });
        if (!accounts || accounts.length === 0) {
          throw new Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);
        }
        const address = getAddress(accounts[0]);
        let chainId = (_b = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _b === void 0 ? void 0 : _b.chainId;
        if (!chainId) {
          const chainIdHex = await resolvedWallet.request({
            method: "eth_chainId"
          });
          chainId = fromHex(chainIdHex);
        }
        const siweMessage = {
          domain: url.host,
          address,
          statement,
          uri: url.href,
          version: "1",
          chainId,
          nonce: (_c = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _c === void 0 ? void 0 : _c.nonce,
          issuedAt: (_f = (_d = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _d === void 0 ? void 0 : _d.issuedAt) !== null && _f !== void 0 ? _f : /* @__PURE__ */ new Date(),
          expirationTime: (_g = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _g === void 0 ? void 0 : _g.expirationTime,
          notBefore: (_h = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _h === void 0 ? void 0 : _h.notBefore,
          requestId: (_j = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _j === void 0 ? void 0 : _j.requestId,
          resources: (_k = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _k === void 0 ? void 0 : _k.resources
        };
        message = createSiweMessage(siweMessage);
        signature = await resolvedWallet.request({
          method: "personal_sign",
          params: [toHex(message), address]
        });
      }
      try {
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
          headers: this.headers,
          body: Object.assign({
            chain: "ethereum",
            message,
            signature
          }, ((_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken) ? { gotrue_meta_security: { captcha_token: (_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken } } : null),
          xform: _sessionResponse
        });
        if (error) {
          throw error;
        }
        if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({ data: Object.assign({}, data), error });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    async signInWithSolana(credentials) {
      var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o;
      let message;
      let signature;
      if ("message" in credentials) {
        message = credentials.message;
        signature = credentials.signature;
      } else {
        const { chain, wallet, statement, options } = credentials;
        let resolvedWallet;
        if (!isBrowser()) {
          if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
            throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
          }
          resolvedWallet = wallet;
        } else if (typeof wallet === "object") {
          resolvedWallet = wallet;
        } else {
          const windowAny = window;
          if ("solana" in windowAny && typeof windowAny.solana === "object" && ("signIn" in windowAny.solana && typeof windowAny.solana.signIn === "function" || "signMessage" in windowAny.solana && typeof windowAny.solana.signMessage === "function")) {
            resolvedWallet = windowAny.solana;
          } else {
            throw new Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`);
          }
        }
        const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
        if ("signIn" in resolvedWallet && resolvedWallet.signIn) {
          const output = await resolvedWallet.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, options === null || options === void 0 ? void 0 : options.signInWithSolana), {
            // non-overridable properties
            version: "1",
            domain: url.host,
            uri: url.href
          }), statement ? { statement } : null));
          let outputToProcess;
          if (Array.isArray(output) && output[0] && typeof output[0] === "object") {
            outputToProcess = output[0];
          } else if (output && typeof output === "object" && "signedMessage" in output && "signature" in output) {
            outputToProcess = output;
          } else {
            throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
          }
          if ("signedMessage" in outputToProcess && "signature" in outputToProcess && (typeof outputToProcess.signedMessage === "string" || outputToProcess.signedMessage instanceof Uint8Array) && outputToProcess.signature instanceof Uint8Array) {
            message = typeof outputToProcess.signedMessage === "string" ? outputToProcess.signedMessage : new TextDecoder().decode(outputToProcess.signedMessage);
            signature = outputToProcess.signature;
          } else {
            throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
          }
        } else {
          if (!("signMessage" in resolvedWallet) || typeof resolvedWallet.signMessage !== "function" || !("publicKey" in resolvedWallet) || typeof resolvedWallet !== "object" || !resolvedWallet.publicKey || !("toBase58" in resolvedWallet.publicKey) || typeof resolvedWallet.publicKey.toBase58 !== "function") {
            throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
          }
          message = [
            `${url.host} wants you to sign in with your Solana account:`,
            resolvedWallet.publicKey.toBase58(),
            ...statement ? ["", statement, ""] : [""],
            "Version: 1",
            `URI: ${url.href}`,
            `Issued At: ${(_c = (_b = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _b === void 0 ? void 0 : _b.issuedAt) !== null && _c !== void 0 ? _c : (/* @__PURE__ */ new Date()).toISOString()}`,
            ...((_d = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _d === void 0 ? void 0 : _d.notBefore) ? [`Not Before: ${options.signInWithSolana.notBefore}`] : [],
            ...((_f = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _f === void 0 ? void 0 : _f.expirationTime) ? [`Expiration Time: ${options.signInWithSolana.expirationTime}`] : [],
            ...((_g = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _g === void 0 ? void 0 : _g.chainId) ? [`Chain ID: ${options.signInWithSolana.chainId}`] : [],
            ...((_h = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _h === void 0 ? void 0 : _h.nonce) ? [`Nonce: ${options.signInWithSolana.nonce}`] : [],
            ...((_j = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _j === void 0 ? void 0 : _j.requestId) ? [`Request ID: ${options.signInWithSolana.requestId}`] : [],
            ...((_l = (_k = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _k === void 0 ? void 0 : _k.resources) === null || _l === void 0 ? void 0 : _l.length) ? [
              "Resources",
              ...options.signInWithSolana.resources.map((resource) => `- ${resource}`)
            ] : []
          ].join("\n");
          const maybeSignature = await resolvedWallet.signMessage(new TextEncoder().encode(message), "utf8");
          if (!maybeSignature || !(maybeSignature instanceof Uint8Array)) {
            throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
          }
          signature = maybeSignature;
        }
      }
      try {
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
          headers: this.headers,
          body: Object.assign({ chain: "solana", message, signature: bytesToBase64URL(signature) }, ((_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken) ? { gotrue_meta_security: { captcha_token: (_o = credentials.options) === null || _o === void 0 ? void 0 : _o.captchaToken } } : null),
          xform: _sessionResponse
        });
        if (error) {
          throw error;
        }
        if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({ data: Object.assign({}, data), error });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    async _exchangeCodeForSession(authCode) {
      const storageItem = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
      try {
        if (!codeVerifier && this.flowType === "pkce") {
          throw new AuthPKCECodeVerifierMissingError();
        }
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
          headers: this.headers,
          body: {
            auth_code: authCode,
            code_verifier: codeVerifier
          },
          xform: _sessionResponse
        });
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (error) {
          throw error;
        }
        if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({
            data: { user: null, session: null, redirectType: null },
            error: invalidTokenError
          });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers(redirectType === "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", data.session);
        }
        return this._returnResult({ data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error });
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({
            data: { user: null, session: null, redirectType: null },
            error
          });
        }
        throw error;
      }
    }
    /**
     * Allows signing in with an OIDC ID token. The authentication provider used
     * should be enabled and configured.
     *
     * @category Auth
     *
     * @remarks
     * - Use an ID token to sign in.
     * - Especially useful when implementing sign in using native platform dialogs in mobile or desktop apps using Sign in with Apple or Sign in with Google on iOS and Android.
     * - You can also use Google's [One Tap](https://developers.google.com/identity/gsi/web/guides/display-google-one-tap) and [Automatic sign-in](https://developers.google.com/identity/gsi/web/guides/automatic-sign-in-sign-out) via this API.
     *
     * @example Sign In using ID Token
     * ```js
     * const { data, error } = await supabase.auth.signInWithIdToken({
     *   provider: 'google',
     *   token: 'your-id-token'
     * })
     * ```
     *
     * @exampleResponse Sign In using ID Token
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         ...
     *       },
     *       "user_metadata": {
     *         ...
     *       },
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "provider": "google",
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *     },
     *     "session": {
     *       "access_token": "<ACCESS_TOKEN>",
     *       "token_type": "bearer",
     *       "expires_in": 3600,
     *       "expires_at": 1700000000,
     *       "refresh_token": "<REFRESH_TOKEN>",
     *       "user": {
     *         "id": "11111111-1111-1111-1111-111111111111",
     *         "aud": "authenticated",
     *         "role": "authenticated",
     *         "last_sign_in_at": "2024-01-01T00:00:00Z",
     *         "app_metadata": {
     *           ...
     *         },
     *         "user_metadata": {
     *           ...
     *         },
     *         "identities": [
     *           {
     *             "identity_id": "22222222-2222-2222-2222-222222222222",
     *             "provider": "google",
     *           }
     *         ],
     *         "created_at": "2024-01-01T00:00:00Z",
     *         "updated_at": "2024-01-01T00:00:00Z",
     *       }
     *     }
     *   },
     *   "error": null
     * }
     * ```
     */
    async signInWithIdToken(credentials) {
      try {
        const { options, provider, token, access_token, nonce } = credentials;
        const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
          headers: this.headers,
          body: {
            provider,
            id_token: token,
            access_token,
            nonce,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponse
        });
        const { data, error } = res;
        if (error) {
          return this._returnResult({ data: { user: null, session: null }, error });
        } else if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({ data, error });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Log in a user using magiclink or a one-time password (OTP).
     *
     * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
     * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
     * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
     *
     * Be aware that you may get back an error message that will not distinguish
     * between the cases where the account does not exist or, that the account
     * can only be accessed via social login.
     *
     * Do note that you will need to configure a Whatsapp sender on Twilio
     * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
     * channel is not supported on other providers
     * at this time.
     * This method supports PKCE when an email is passed.
     *
     * @category Auth
     *
     * @remarks
     * - Requires either an email or phone number.
     * - This method is used for passwordless sign-ins where a OTP is sent to the user's email or phone number.
     * - If the user doesn't exist, `signInWithOtp()` will signup the user instead. To restrict this behavior, you can set `shouldCreateUser` in `SignInWithPasswordlessCredentials.options` to `false`.
     * - If you're using an email, you can configure whether you want the user to receive a magiclink or a OTP.
     * - If you're using phone, you can configure whether you want the user to receive a OTP.
     * - The magic link's destination URL is determined by the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls).
     * - See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
     * - Magic links and OTPs share the same implementation. To send users a one-time code instead of a magic link, [modify the magic link email template](/dashboard/project/_/auth/templates) to include `{{ .Token }}` instead of `{{ .ConfirmationURL }}`.
     * - See our [Twilio Phone Auth Guide](/docs/guides/auth/phone-login?showSMSProvider=Twilio) for details about configuring WhatsApp sign in.
     *
     * @exampleDescription Sign in with email
     * The user will be sent an email which contains either a magiclink or a OTP or both. By default, a given user can only request a OTP once every 60 seconds.
     *
     * @example Sign in with email
     * ```js
     * const { data, error } = await supabase.auth.signInWithOtp({
     *   email: 'example@email.com',
     *   options: {
     *     emailRedirectTo: 'https://example.com/welcome'
     *   }
     * })
     * ```
     *
     * @exampleResponse Sign in with email
     * ```json
     * {
     *   "data": {
     *     "user": null,
     *     "session": null
     *   },
     *   "error": null
     * }
     * ```
     *
     * @exampleDescription Sign in with SMS OTP
     * The user will be sent a SMS which contains a OTP. By default, a given user can only request a OTP once every 60 seconds.
     *
     * @example Sign in with SMS OTP
     * ```js
     * const { data, error } = await supabase.auth.signInWithOtp({
     *   phone: '+13334445555',
     * })
     * ```
     *
     * @exampleDescription Sign in with WhatsApp OTP
     * The user will be sent a WhatsApp message which contains a OTP. By default, a given user can only request a OTP once every 60 seconds. Note that a user will need to have a valid WhatsApp account that is linked to Twilio in order to use this feature.
     *
     * @example Sign in with WhatsApp OTP
     * ```js
     * const { data, error } = await supabase.auth.signInWithOtp({
     *   phone: '+13334445555',
     *   options: {
     *     channel:'whatsapp',
     *   }
     * })
     * ```
     */
    async signInWithOtp(credentials) {
      var _a, _b, _c, _d, _f;
      try {
        if ("email" in credentials) {
          const { email, options } = credentials;
          let codeChallenge = null;
          let codeChallengeMethod = null;
          if (this.flowType === "pkce") {
            ;
            [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
          }
          const { error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
            headers: this.headers,
            body: {
              email,
              data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
              create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
              code_challenge: codeChallenge,
              code_challenge_method: codeChallengeMethod
            },
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
          });
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        if ("phone" in credentials) {
          const { phone, options } = credentials;
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
            headers: this.headers,
            body: {
              phone,
              data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
              create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
              channel: (_f = options === null || options === void 0 ? void 0 : options.channel) !== null && _f !== void 0 ? _f : "sms"
            }
          });
          return this._returnResult({
            data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id },
            error
          });
        }
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
     *
     * @category Auth
     *
     * @remarks
     * - The `verifyOtp` method takes in different verification types.
     * - If a phone number is used, the type can either be:
     *   1. `sms` – Used when verifying a one-time password (OTP) sent via SMS during sign-up or sign-in.
     *   2. `phone_change` – Used when verifying an OTP sent to a new phone number during a phone number update process.
     * - If an email address is used, the type can be one of the following (note: `signup` and `magiclink` types are deprecated):
     *   1. `email` – Used when verifying an OTP sent to the user's email during sign-up or sign-in.
     *   2. `recovery` – Used when verifying an OTP sent for account recovery, typically after a password reset request.
     *   3. `invite` – Used when verifying an OTP sent as part of an invitation to join a project or organization.
     *   4. `email_change` – Used when verifying an OTP sent to a new email address during an email update process.
     * - The verification type used should be determined based on the corresponding auth method called before `verifyOtp` to sign up / sign-in a user.
     * - The `TokenHash` is contained in the [email templates](/docs/guides/auth/auth-email-templates) and can be used to sign in.  You may wish to use the hash for the PKCE flow for Server Side Auth. Read [the Password-based Auth guide](/docs/guides/auth/passwords) for more details.
     *
     * @example Verify Signup One-Time Password (OTP)
     * ```js
     * const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email'})
     * ```
     *
     * @exampleResponse Verify Signup One-Time Password (OTP)
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "example@email.com",
     *       "email_confirmed_at": "2024-01-01T00:00:00Z",
     *       "phone": "",
     *       "confirmed_at": "2024-01-01T00:00:00Z",
     *       "recovery_sent_at": "2024-01-01T00:00:00Z",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {
     *         "email": "example@email.com",
     *         "email_verified": false,
     *         "phone_verified": false,
     *         "sub": "11111111-1111-1111-1111-111111111111"
     *       },
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *       "is_anonymous": false
     *     },
     *     "session": {
     *       "access_token": "<ACCESS_TOKEN>",
     *       "token_type": "bearer",
     *       "expires_in": 3600,
     *       "expires_at": 1700000000,
     *       "refresh_token": "<REFRESH_TOKEN>",
     *       "user": {
     *         "id": "11111111-1111-1111-1111-111111111111",
     *         "aud": "authenticated",
     *         "role": "authenticated",
     *         "email": "example@email.com",
     *         "email_confirmed_at": "2024-01-01T00:00:00Z",
     *         "phone": "",
     *         "confirmed_at": "2024-01-01T00:00:00Z",
     *         "recovery_sent_at": "2024-01-01T00:00:00Z",
     *         "last_sign_in_at": "2024-01-01T00:00:00Z",
     *         "app_metadata": {
     *           "provider": "email",
     *           "providers": [
     *             "email"
     *           ]
     *         },
     *         "user_metadata": {
     *           "email": "example@email.com",
     *           "email_verified": false,
     *           "phone_verified": false,
     *           "sub": "11111111-1111-1111-1111-111111111111"
     *         },
     *         "identities": [
     *           {
     *             "identity_id": "22222222-2222-2222-2222-222222222222",
     *             "id": "11111111-1111-1111-1111-111111111111",
     *             "user_id": "11111111-1111-1111-1111-111111111111",
     *             "identity_data": {
     *               "email": "example@email.com",
     *               "email_verified": false,
     *               "phone_verified": false,
     *               "sub": "11111111-1111-1111-1111-111111111111"
     *             },
     *             "provider": "email",
     *             "last_sign_in_at": "2024-01-01T00:00:00Z",
     *             "created_at": "2024-01-01T00:00:00Z",
     *             "updated_at": "2024-01-01T00:00:00Z",
     *             "email": "example@email.com"
     *           }
     *         ],
     *         "created_at": "2024-01-01T00:00:00Z",
     *         "updated_at": "2024-01-01T00:00:00Z",
     *         "is_anonymous": false
     *       }
     *     }
     *   },
     *   "error": null
     * }
     * ```
     *
     * @example Verify SMS One-Time Password (OTP)
     * ```js
     * const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms'})
     * ```
     *
     * @example Verify Email Auth (Token Hash)
     * ```js
     * const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email'})
     * ```
     */
    async verifyOtp(params) {
      var _a, _b;
      try {
        let redirectTo = void 0;
        let captchaToken = void 0;
        if ("options" in params) {
          redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
          captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
        }
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/verify`, {
          headers: this.headers,
          body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
          redirectTo,
          xform: _sessionResponse
        });
        if (error) {
          throw error;
        }
        if (!data) {
          const tokenVerificationError = new Error("An error occurred on token verification.");
          throw tokenVerificationError;
        }
        const session2 = data.session;
        const user = data.user;
        if (session2 === null || session2 === void 0 ? void 0 : session2.access_token) {
          await this._saveSession(session2);
          await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session2);
        }
        return this._returnResult({ data: { user, session: session2 }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Attempts a single-sign on using an enterprise Identity Provider. A
     * successful SSO attempt will redirect the current page to the identity
     * provider authorization page. The redirect URL is implementation and SSO
     * protocol specific.
     *
     * You can use it by providing a SSO domain. Typically you can extract this
     * domain by asking users for their email address. If this domain is
     * registered on the Auth instance the redirect will use that organization's
     * currently active SSO Identity Provider for the login.
     *
     * If you have built an organization-specific login page, you can use the
     * organization's SSO Identity Provider UUID directly instead.
     *
     * @category Auth
     *
     * @remarks
     * - Before you can call this method you need to [establish a connection](/docs/guides/auth/sso/auth-sso-saml#managing-saml-20-connections) to an identity provider. Use the [CLI commands](/docs/reference/cli/supabase-sso) to do this.
     * - If you've associated an email domain to the identity provider, you can use the `domain` property to start a sign-in flow.
     * - In case you need to use a different way to start the authentication flow with an identity provider, you can use the `providerId` property. For example:
     *     - Mapping specific user email addresses with an identity provider.
     *     - Using different hints to identity the identity provider to be used by the user, like a company-specific page, IP address or other tracking information.
     *
     * @example Sign in with email domain
     * ```js
     *   // You can extract the user's email domain and use it to trigger the
     *   // authentication flow with the correct identity provider.
     *
     *   const { data, error } = await supabase.auth.signInWithSSO({
     *     domain: 'company.com'
     *   })
     *
     *   if (data?.url) {
     *     // redirect the user to the identity provider's authentication flow
     *     window.location.href = data.url
     *   }
     * ```
     *
     * @example Sign in with provider UUID
     * ```js
     *   // Useful when you need to map a user's sign in request according
     *   // to different rules that can't use email domains.
     *
     *   const { data, error } = await supabase.auth.signInWithSSO({
     *     providerId: '21648a9d-8d5a-4555-a9d1-d6375dc14e92'
     *   })
     *
     *   if (data?.url) {
     *     // redirect the user to the identity provider's authentication flow
     *     window.location.href = data.url
     *   }
     * ```
     */
    async signInWithSSO(params) {
      var _a, _b, _c, _d, _f;
      try {
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        const result = await _request(this.fetch, "POST", `${this.url}/sso`, {
          body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
          headers: this.headers,
          xform: _ssoResponse
        });
        if (((_d = result.data) === null || _d === void 0 ? void 0 : _d.url) && isBrowser() && !((_f = params.options) === null || _f === void 0 ? void 0 : _f.skipBrowserRedirect)) {
          window.location.assign(result.data.url);
        }
        return this._returnResult(result);
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Sends a reauthentication OTP to the user's email or phone number.
     * Requires the user to be signed-in.
     *
     * @category Auth
     *
     * @remarks
     * - This method is used together with `updateUser()` when a user's password needs to be updated.
     * - If you require your user to reauthenticate before updating their password, you need to enable the **Secure password change** option in your [project's email provider settings](/dashboard/project/_/auth/providers).
     * - A user is only require to reauthenticate before updating their password if **Secure password change** is enabled and the user **hasn't recently signed in**. A user is deemed recently signed in if the session was created in the last 24 hours.
     * - This method will send a nonce to the user's email. If the user doesn't have a confirmed email address, the method will send the nonce to the user's confirmed phone number instead.
     * - After receiving the OTP, include it as the `nonce` in your `updateUser()` call to finalize the password change.
     *
     * @exampleDescription Send reauthentication nonce
     * Sends a reauthentication nonce to the user's email or phone number.
     *
     * @example Send reauthentication nonce
     * ```js
     * const { error } = await supabase.auth.reauthenticate()
     * ```
     */
    async reauthenticate() {
      await this.initializePromise;
      if (this.lock != null) {
        return await this._acquireLock(this.lockAcquireTimeout, async () => {
          return await this._reauthenticate();
        });
      }
      return await this._reauthenticate();
    }
    async _reauthenticate() {
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError)
            throw sessionError;
          if (!session2)
            throw new AuthSessionMissingError();
          const { error } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
            headers: this.headers,
            jwt: session2.access_token
          });
          return this._returnResult({ data: { user: null, session: null }, error });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
     *
     * @category Auth
     *
     * @remarks
     * - Resends a signup confirmation, email change or phone change email to the user.
     * - Passwordless sign-ins can be resent by calling the `signInWithOtp()` method again.
     * - Password recovery emails can be resent by calling the `resetPasswordForEmail()` method again.
     * - This method will only resend an email or phone OTP to the user if there was an initial signup, email change or phone change request being made(note: For existing users signing in with OTP, you should use `signInWithOtp()` again to resend the OTP).
     * - You can specify a redirect url when you resend an email link using the `emailRedirectTo` option.
     *
     * @exampleDescription Resend an email signup confirmation
     * Resends the email signup confirmation to the user
     *
     * @example Resend an email signup confirmation
     * ```js
     * const { error } = await supabase.auth.resend({
     *   type: 'signup',
     *   email: 'email@example.com',
     *   options: {
     *     emailRedirectTo: 'https://example.com/welcome'
     *   }
     * })
     * ```
     *
     * @exampleDescription Resend a phone signup confirmation
     * Resends the phone signup confirmation email to the user
     *
     * @example Resend a phone signup confirmation
     * ```js
     * const { error } = await supabase.auth.resend({
     *   type: 'sms',
     *   phone: '1234567890'
     * })
     * ```
     *
     * @exampleDescription Resend email change email
     * Resends the email change email to the user
     *
     * @example Resend email change email
     * ```js
     * const { error } = await supabase.auth.resend({
     *   type: 'email_change',
     *   email: 'email@example.com'
     * })
     * ```
     *
     * @exampleDescription Resend phone change OTP
     * Resends the phone change OTP to the user
     *
     * @example Resend phone change OTP
     * ```js
     * const { error } = await supabase.auth.resend({
     *   type: 'phone_change',
     *   phone: '1234567890'
     * })
     * ```
     */
    async resend(credentials) {
      try {
        const endpoint = `${this.url}/resend`;
        if ("email" in credentials) {
          const { email, type, options } = credentials;
          let codeChallenge = null;
          let codeChallengeMethod = null;
          if (this.flowType === "pkce") {
            ;
            [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
          }
          const { error } = await _request(this.fetch, "POST", endpoint, {
            headers: this.headers,
            body: {
              email,
              type,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
              code_challenge: codeChallenge,
              code_challenge_method: codeChallengeMethod
            },
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
          });
          if (error) {
            await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
          }
          return this._returnResult({ data: { user: null, session: null }, error });
        } else if ("phone" in credentials) {
          const { phone, type, options } = credentials;
          const { data, error } = await _request(this.fetch, "POST", endpoint, {
            headers: this.headers,
            body: {
              phone,
              type,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            }
          });
          return this._returnResult({
            data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id },
            error
          });
        }
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Returns the session, refreshing it if necessary.
     *
     * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
     *
     * **IMPORTANT:** This method loads values directly from the storage attached
     * to the client. If that storage is based on request cookies for example,
     * the values in it may not be authentic and therefore it's strongly advised
     * against using this method and its results in such circumstances. A warning
     * will be emitted if this is detected. Use {@link #getUser()} instead.
     *
     * @category Auth
     *
     * @remarks
     * - Since the introduction of [asymmetric JWT signing keys](/docs/guides/auth/signing-keys), this method is considered low-level and we encourage you to use `getClaims()` or `getUser()` instead.
     * - Retrieves the current [user session](/docs/guides/auth/sessions) from the storage medium (local storage, cookies).
     * - The session contains an access token (signed JWT), a refresh token and the user object.
     * - If the session's access token is expired or is about to expire, this method will use the refresh token to refresh the session.
     * - When using in a browser, or you've called `startAutoRefresh()` in your environment (React Native, etc.) this function always returns a valid access token without refreshing the session itself, as this is done in the background. This function returns very fast.
     * - **IMPORTANT SECURITY NOTICE:** If using an insecure storage medium, such as cookies or request headers, the user object returned by this function **must not be trusted**. Always verify the JWT using `getClaims()` or your own JWT verification library to securely establish the user's identity and access. You can also use `getUser()` to fetch the user object directly from the Auth server for this purpose.
     * - Cross-tab refresh races are handled by the GoTrue server (the rotated token from the first tab is returned to subsequent tabs via the parent-of-active mechanism), so no client-side serialization is needed.
     *
     * @example Get the session data
     * ```js
     * const { data, error } = await supabase.auth.getSession()
     * ```
     *
     * @exampleResponse Get the session data
     * ```json
     * {
     *   "data": {
     *     "session": {
     *       "access_token": "<ACCESS_TOKEN>",
     *       "token_type": "bearer",
     *       "expires_in": 3600,
     *       "expires_at": 1700000000,
     *       "refresh_token": "<REFRESH_TOKEN>",
     *       "user": {
     *         "id": "11111111-1111-1111-1111-111111111111",
     *         "aud": "authenticated",
     *         "role": "authenticated",
     *         "email": "example@email.com",
     *         "email_confirmed_at": "2024-01-01T00:00:00Z",
     *         "phone": "",
     *         "last_sign_in_at": "2024-01-01T00:00:00Z",
     *         "app_metadata": {
     *           "provider": "email",
     *           "providers": [
     *             "email"
     *           ]
     *         },
     *         "user_metadata": {
     *           "email": "example@email.com",
     *           "email_verified": false,
     *           "phone_verified": false,
     *           "sub": "11111111-1111-1111-1111-111111111111"
     *         },
     *         "identities": [
     *           {
     *             "identity_id": "22222222-2222-2222-2222-222222222222",
     *             "id": "11111111-1111-1111-1111-111111111111",
     *             "user_id": "11111111-1111-1111-1111-111111111111",
     *             "identity_data": {
     *               "email": "example@email.com",
     *               "email_verified": false,
     *               "phone_verified": false,
     *               "sub": "11111111-1111-1111-1111-111111111111"
     *             },
     *             "provider": "email",
     *             "last_sign_in_at": "2024-01-01T00:00:00Z",
     *             "created_at": "2024-01-01T00:00:00Z",
     *             "updated_at": "2024-01-01T00:00:00Z",
     *             "email": "example@email.com"
     *           }
     *         ],
     *         "created_at": "2024-01-01T00:00:00Z",
     *         "updated_at": "2024-01-01T00:00:00Z",
     *         "is_anonymous": false
     *       }
     *     }
     *   },
     *   "error": null
     * }
     * ```
     */
    async getSession() {
      await this.initializePromise;
      if (this.lock != null) {
        return await this._acquireLock(this.lockAcquireTimeout, async () => {
          return this._useSession(async (result) => {
            return result;
          });
        });
      }
      return await this._useSession(async (result) => {
        return result;
      });
    }
    /**
     * Acquires a global lock based on the storage key.
     *
     * TODO(v3): remove along with the legacy lock path. Only called when
     * `this.lock` is non-null (custom lock supplied via constructor). The
     * default lockless path bypasses this entirely.
     */
    async _acquireLock(acquireTimeout, fn) {
      this._debug("#_acquireLock", "begin", acquireTimeout);
      try {
        if (this.lockAcquired) {
          const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
          const result = (async () => {
            await last;
            return await fn();
          })();
          this.pendingInLock.push((async () => {
            try {
              await result;
            } catch (_e) {
            }
          })());
          return result;
        }
        return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
          this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
          try {
            this.lockAcquired = true;
            const result = fn();
            this.pendingInLock.push((async () => {
              try {
                await result;
              } catch (e3) {
              }
            })());
            await result;
            while (this.pendingInLock.length) {
              const waitOn = [...this.pendingInLock];
              await Promise.all(waitOn);
              this.pendingInLock.splice(0, waitOn.length);
            }
            return await result;
          } finally {
            this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
            this.lockAcquired = false;
          }
        });
      } finally {
        this._debug("#_acquireLock", "end");
      }
    }
    /**
     * Use instead of {@link #getSession} inside the library. Loads the session
     * via `__loadSession` (which may trigger a refresh if the access token is
     * within the expiry margin) and runs `fn` with the result.
     */
    async _useSession(fn) {
      this._debug("#_useSession", "begin");
      try {
        const result = await this.__loadSession();
        return await fn(result);
      } finally {
        this._debug("#_useSession", "end");
      }
    }
    /**
     * NEVER USE DIRECTLY!
     *
     * Always use {@link #_useSession}.
     */
    async __loadSession() {
      this._debug("#__loadSession()", "begin");
      if (this.lock != null && !this.lockAcquired) {
        this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
      }
      try {
        let currentSession = null;
        const maybeSession = await getItemAsync(this.storage, this.storageKey);
        this._debug("#getSession()", "session from storage", maybeSession);
        if (maybeSession !== null) {
          if (this._isValidSession(maybeSession)) {
            currentSession = maybeSession;
          } else {
            this._debug("#getSession()", "session from storage is not valid");
            await this._removeSession();
          }
        }
        if (!currentSession) {
          return { data: { session: null }, error: null };
        }
        const hasExpired = currentSession.expires_at ? currentSession.expires_at * 1e3 - Date.now() < EXPIRY_MARGIN_MS : false;
        this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
        if (!hasExpired) {
          if (this.userStorage) {
            const maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
            if (maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) {
              currentSession.user = maybeUser.user;
            } else {
              currentSession.user = userNotAvailableProxy();
            }
          }
          if (this.storage.isServer && currentSession.user && !currentSession.user.__isUserNotAvailableProxy) {
            const suppressWarningRef = { value: this.suppressGetSessionWarning };
            currentSession.user = insecureUserWarningProxy(currentSession.user, suppressWarningRef);
            if (suppressWarningRef.value) {
              this.suppressGetSessionWarning = true;
            }
          }
          return { data: { session: currentSession }, error: null };
        }
        const { data: session2, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          const accessTokenStillValid = !!(currentSession.expires_at && currentSession.expires_at * 1e3 > Date.now());
          if (accessTokenStillValid) {
            const stillStored = await getItemAsync(this.storage, this.storageKey);
            if (stillStored && stillStored.refresh_token === currentSession.refresh_token) {
              return this._returnResult({ data: { session: currentSession }, error: null });
            }
          }
          return this._returnResult({ data: { session: null }, error });
        }
        return this._returnResult({ data: { session: session2 }, error: null });
      } finally {
        this._debug("#__loadSession()", "end");
      }
    }
    /**
     * Gets the current user details if there is an existing session. This method
     * performs a network request to the Supabase Auth server, so the returned
     * value is authentic and can be used to base authorization rules on.
     *
     * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
     *
     * @category Auth
     *
     * @remarks
     * - This method fetches the user object from the database instead of local session.
     * - This method is useful for checking if the user is authorized because it validates the user's access token JWT on the server.
     * - Should always be used when checking for user authorization on the server. On the client, you can instead use `getSession().session.user` for faster results. `getSession` is insecure on the server.
     *
     * @example Get the logged in user with the current existing session
     * ```js
     * const { data: { user } } = await supabase.auth.getUser()
     * ```
     *
     * @exampleResponse Get the logged in user with the current existing session
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "example@email.com",
     *       "email_confirmed_at": "2024-01-01T00:00:00Z",
     *       "phone": "",
     *       "confirmed_at": "2024-01-01T00:00:00Z",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {
     *         "email": "example@email.com",
     *         "email_verified": false,
     *         "phone_verified": false,
     *         "sub": "11111111-1111-1111-1111-111111111111"
     *       },
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *       "is_anonymous": false
     *     }
     *   },
     *   "error": null
     * }
     * ```
     *
     * @example Get the logged in user with a custom access token jwt
     * ```js
     * const { data: { user } } = await supabase.auth.getUser(jwt)
     * ```
     */
    async getUser(jwt) {
      if (jwt) {
        return await this._getUser(jwt);
      }
      await this.initializePromise;
      let result;
      if (this.lock != null) {
        result = await this._acquireLock(this.lockAcquireTimeout, async () => {
          return await this._getUser();
        });
      } else {
        result = await this._getUser();
      }
      if (result.data.user) {
        this.suppressGetSessionWarning = true;
      }
      return result;
    }
    async _getUser(jwt) {
      try {
        if (jwt) {
          return await _request(this.fetch, "GET", `${this.url}/user`, {
            headers: this.headers,
            jwt,
            xform: _userResponse
          });
        }
        return await this._useSession(async (result) => {
          var _a, _b, _c;
          const { data, error } = result;
          if (error) {
            throw error;
          }
          if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
            return { data: { user: null }, error: new AuthSessionMissingError() };
          }
          return await _request(this.fetch, "GET", `${this.url}/user`, {
            headers: this.headers,
            jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : void 0,
            xform: _userResponse
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          if (isAuthSessionMissingError(error)) {
            await this._removeSession();
            await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
          }
          return this._returnResult({ data: { user: null }, error });
        }
        throw error;
      }
    }
    /**
     * Updates user data for a logged in user.
     *
     * @category Auth
     *
     * @remarks
     * - In order to use the `updateUser()` method, the user needs to be signed in first.
     * - By default, email updates sends a confirmation link to both the user's current and new email.
     * To only send a confirmation link to the user's new email, disable **Secure email change** in your project's [email auth provider settings](/dashboard/project/_/auth/providers).
     *
     * @exampleDescription Update the email for an authenticated user
     * Sends a "Confirm Email Change" email to the new address. If **Secure Email Change** is enabled (default), confirmation is also required from the **old email** before the change is applied. To skip dual confirmation and apply the change after only the new email is verified, disable **Secure Email Change** in the [Email Auth Provider settings](/dashboard/project/_/auth/providers?provider=Email).
     *
     * @example Update the email for an authenticated user
     * ```js
     * const { data, error } = await supabase.auth.updateUser({
     *   email: 'new@email.com'
     * })
     * ```
     *
     * @exampleResponse Update the email for an authenticated user
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "example@email.com",
     *       "email_confirmed_at": "2024-01-01T00:00:00Z",
     *       "phone": "",
     *       "confirmed_at": "2024-01-01T00:00:00Z",
     *       "new_email": "new@email.com",
     *       "email_change_sent_at": "2024-01-01T00:00:00Z",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {
     *         "email": "example@email.com",
     *         "email_verified": false,
     *         "phone_verified": false,
     *         "sub": "11111111-1111-1111-1111-111111111111"
     *       },
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *       "is_anonymous": false
     *     }
     *   },
     *   "error": null
     * }
     * ```
     *
     * @exampleDescription Update the phone number for an authenticated user
     * Sends a one-time password (OTP) to the new phone number.
     *
     * @example Update the phone number for an authenticated user
     * ```js
     * const { data, error } = await supabase.auth.updateUser({
     *   phone: '123456789'
     * })
     * ```
     *
     * @example Update the password for an authenticated user
     * ```js
     * const { data, error } = await supabase.auth.updateUser({
     *   password: 'new password'
     * })
     * ```
     *
     * @exampleDescription Update the user's metadata
     * Updates the user's custom metadata.
     *
     * **Note**: The `data` field maps to the `auth.users.raw_user_meta_data` column in your Supabase database. When calling `getUser()`, the data will be available as `user.user_metadata`.
     *
     * @example Update the user's metadata
     * ```js
     * const { data, error } = await supabase.auth.updateUser({
     *   data: { hello: 'world' }
     * })
     * ```
     *
     * @exampleDescription Update the user's password with a nonce
     * If **Secure password change** is enabled in your [project's email provider settings](/dashboard/project/_/auth/providers), updating the user's password would require a nonce if the user **hasn't recently signed in**. The nonce is sent to the user's email or phone number. A user is deemed recently signed in if the session was created in the last 24 hours.
     *
     * @example Update the user's password with a nonce
     * ```js
     * const { data, error } = await supabase.auth.updateUser({
     *   password: 'new password',
     *   nonce: '123456'
     * })
     * ```
     */
    async updateUser(attributes, options = {}) {
      await this.initializePromise;
      if (this.lock != null) {
        return await this._acquireLock(this.lockAcquireTimeout, async () => {
          return await this._updateUser(attributes, options);
        });
      }
      return await this._updateUser(attributes, options);
    }
    async _updateUser(attributes, options = {}) {
      try {
        return await this._useSession(async (result) => {
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            throw sessionError;
          }
          if (!sessionData.session) {
            throw new AuthSessionMissingError();
          }
          const session2 = sessionData.session;
          let codeChallenge = null;
          let codeChallengeMethod = null;
          if (this.flowType === "pkce" && attributes.email != null) {
            ;
            [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
          }
          const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
            headers: this.headers,
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
            body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
            jwt: session2.access_token,
            xform: _userResponse
          });
          if (userError) {
            throw userError;
          }
          session2.user = data.user;
          await this._saveSession(session2);
          await this._notifyAllSubscribers("USER_UPDATED", session2);
          return this._returnResult({ data: { user: session2.user }, error: null });
        });
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null }, error });
        }
        throw error;
      }
    }
    /**
     * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
     * If the refresh token or access token in the current session is invalid, an error will be thrown.
     * @param currentSession The current session that minimally contains an access token and refresh token.
     *
     * @category Auth
     *
     * @remarks
     * - This method sets the session using an `access_token` and `refresh_token`.
     * - If successful, a `SIGNED_IN` event is emitted.
     *
     * @exampleDescription Set the session
     * Sets the session data from an access_token and refresh_token, then returns an auth response or error.
     *
     * @example Set the session
     * ```js
     *   const { data, error } = await supabase.auth.setSession({
     *     access_token,
     *     refresh_token
     *   })
     * ```
     *
     * @exampleResponse Set the session
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "example@email.com",
     *       "email_confirmed_at": "2024-01-01T00:00:00Z",
     *       "phone": "",
     *       "confirmed_at": "2024-01-01T00:00:00Z",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {
     *         "email": "example@email.com",
     *         "email_verified": false,
     *         "phone_verified": false,
     *         "sub": "11111111-1111-1111-1111-111111111111"
     *       },
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *       "is_anonymous": false
     *     },
     *     "session": {
     *       "access_token": "<ACCESS_TOKEN>",
     *       "refresh_token": "<REFRESH_TOKEN>",
     *       "user": {
     *         "id": "11111111-1111-1111-1111-111111111111",
     *         "aud": "authenticated",
     *         "role": "authenticated",
     *         "email": "example@email.com",
     *         "email_confirmed_at": "2024-01-01T00:00:00Z",
     *         "phone": "",
     *         "confirmed_at": "2024-01-01T00:00:00Z",
     *         "last_sign_in_at": "11111111-1111-1111-1111-111111111111",
     *         "app_metadata": {
     *           "provider": "email",
     *           "providers": [
     *             "email"
     *           ]
     *         },
     *         "user_metadata": {
     *           "email": "example@email.com",
     *           "email_verified": false,
     *           "phone_verified": false,
     *           "sub": "11111111-1111-1111-1111-111111111111"
     *         },
     *         "identities": [
     *           {
     *             "identity_id": "2024-01-01T00:00:00Z",
     *             "id": "11111111-1111-1111-1111-111111111111",
     *             "user_id": "11111111-1111-1111-1111-111111111111",
     *             "identity_data": {
     *               "email": "example@email.com",
     *               "email_verified": false,
     *               "phone_verified": false,
     *               "sub": "11111111-1111-1111-1111-111111111111"
     *             },
     *             "provider": "email",
     *             "last_sign_in_at": "2024-01-01T00:00:00Z",
     *             "created_at": "2024-01-01T00:00:00Z",
     *             "updated_at": "2024-01-01T00:00:00Z",
     *             "email": "example@email.com"
     *           }
     *         ],
     *         "created_at": "2024-01-01T00:00:00Z",
     *         "updated_at": "2024-01-01T00:00:00Z",
     *         "is_anonymous": false
     *       },
     *       "token_type": "bearer",
     *       "expires_in": 3500,
     *       "expires_at": 1700000000
     *     }
     *   },
     *   "error": null
     * }
     * ```
     */
    async setSession(currentSession) {
      await this.initializePromise;
      if (this.lock != null) {
        return await this._acquireLock(this.lockAcquireTimeout, async () => {
          return await this._setSession(currentSession);
        });
      }
      return await this._setSession(currentSession);
    }
    async _setSession(currentSession) {
      try {
        if (!currentSession.access_token || !currentSession.refresh_token) {
          throw new AuthSessionMissingError();
        }
        const timeNow = Date.now() / 1e3;
        let expiresAt2 = timeNow;
        let hasExpired = true;
        let session2 = null;
        const { payload } = decodeJWT(currentSession.access_token);
        if (payload.exp) {
          expiresAt2 = payload.exp;
          hasExpired = expiresAt2 <= timeNow;
        }
        if (hasExpired) {
          const { data: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          if (!refreshedSession) {
            return { data: { user: null, session: null }, error: null };
          }
          session2 = refreshedSession;
        } else {
          const { data, error } = await this._getUser(currentSession.access_token);
          if (error) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          session2 = {
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token,
            user: data.user,
            token_type: "bearer",
            expires_in: expiresAt2 - timeNow,
            expires_at: expiresAt2
          };
          await this._saveSession(session2);
          await this._notifyAllSubscribers("SIGNED_IN", session2);
        }
        return this._returnResult({ data: { user: session2.user, session: session2 }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { session: null, user: null }, error });
        }
        throw error;
      }
    }
    /**
     * Returns a new session, regardless of expiry status.
     * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
     * If the current session's refresh token is invalid, an error will be thrown.
     * @param currentSession The current session. If passed in, it must contain a refresh token.
     *
     * @category Auth
     *
     * @remarks
     * - This method will refresh and return a new session whether the current one is expired or not.
     *
     * @example Refresh session using the current session
     * ```js
     * const { data, error } = await supabase.auth.refreshSession()
     * const { session, user } = data
     * ```
     *
     * @exampleResponse Refresh session using the current session
     * ```json
     * {
     *   "data": {
     *     "user": {
     *       "id": "11111111-1111-1111-1111-111111111111",
     *       "aud": "authenticated",
     *       "role": "authenticated",
     *       "email": "example@email.com",
     *       "email_confirmed_at": "2024-01-01T00:00:00Z",
     *       "phone": "",
     *       "confirmed_at": "2024-01-01T00:00:00Z",
     *       "last_sign_in_at": "2024-01-01T00:00:00Z",
     *       "app_metadata": {
     *         "provider": "email",
     *         "providers": [
     *           "email"
     *         ]
     *       },
     *       "user_metadata": {
     *         "email": "example@email.com",
     *         "email_verified": false,
     *         "phone_verified": false,
     *         "sub": "11111111-1111-1111-1111-111111111111"
     *       },
     *       "identities": [
     *         {
     *           "identity_id": "22222222-2222-2222-2222-222222222222",
     *           "id": "11111111-1111-1111-1111-111111111111",
     *           "user_id": "11111111-1111-1111-1111-111111111111",
     *           "identity_data": {
     *             "email": "example@email.com",
     *             "email_verified": false,
     *             "phone_verified": false,
     *             "sub": "11111111-1111-1111-1111-111111111111"
     *           },
     *           "provider": "email",
     *           "last_sign_in_at": "2024-01-01T00:00:00Z",
     *           "created_at": "2024-01-01T00:00:00Z",
     *           "updated_at": "2024-01-01T00:00:00Z",
     *           "email": "example@email.com"
     *         }
     *       ],
     *       "created_at": "2024-01-01T00:00:00Z",
     *       "updated_at": "2024-01-01T00:00:00Z",
     *       "is_anonymous": false
     *     },
     *     "session": {
     *       "access_token": "<ACCESS_TOKEN>",
     *       "token_type": "bearer",
     *       "expires_in": 3600,
     *       "expires_at": 1700000000,
     *       "refresh_token": "<REFRESH_TOKEN>",
     *       "user": {
     *         "id": "11111111-1111-1111-1111-111111111111",
     *         "aud": "authenticated",
     *         "role": "authenticated",
     *         "email": "example@email.com",
     *         "email_confirmed_at": "2024-01-01T00:00:00Z",
     *         "phone": "",
     *         "confirmed_at": "2024-01-01T00:00:00Z",
     *         "last_sign_in_at": "2024-01-01T00:00:00Z",
     *         "app_metadata": {
     *           "provider": "email",
     *           "providers": [
     *             "email"
     *           ]
     *         },
     *         "user_metadata": {
     *           "email": "example@email.com",
     *           "email_verified": false,
     *           "phone_verified": false,
     *           "sub": "11111111-1111-1111-1111-111111111111"
     *         },
     *         "identities": [
     *           {
     *             "identity_id": "22222222-2222-2222-2222-222222222222",
     *             "id": "11111111-1111-1111-1111-111111111111",
     *             "user_id": "11111111-1111-1111-1111-111111111111",
     *             "identity_data": {
     *               "email": "example@email.com",
     *               "email_verified": false,
     *               "phone_verified": false,
     *               "sub": "11111111-1111-1111-1111-111111111111"
     *             },
     *             "provider": "email",
     *             "last_sign_in_at": "2024-01-01T00:00:00Z",
     *             "created_at": "2024-01-01T00:00:00Z",
     *             "updated_at": "2024-01-01T00:00:00Z",
     *             "email": "example@email.com"
     *           }
     *         ],
     *         "created_at": "2024-01-01T00:00:00Z",
     *         "updated_at": "2024-01-01T00:00:00Z",
     *         "is_anonymous": false
     *       }
     *     }
     *   },
     *   "error": null
     * }
     * ```
     *
     * @example Refresh session using a refresh token
     * ```js
     * const { data, error } = await supabase.auth.refreshSession({ refresh_token })
     * const { session, user } = data
     * ```
     */
    async refreshSession(currentSession) {
      await this.initializePromise;
      if (this.lock != null) {
        return await this._acquireLock(this.lockAcquireTimeout, async () => {
          return await this._refreshSession(currentSession);
        });
      }
      return await this._refreshSession(currentSession);
    }
    async _refreshSession(currentSession) {
      try {
        return await this._useSession(async (result) => {
          var _a;
          if (!currentSession) {
            const { data, error: error2 } = result;
            if (error2) {
              throw error2;
            }
            currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
          }
          if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
            throw new AuthSessionMissingError();
          }
          const { data: session2, error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          if (!session2) {
            return this._returnResult({ data: { user: null, session: null }, error: null });
          }
          return this._returnResult({ data: { user: session2.user, session: session2 }, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Gets the session data from a URL string
     */
    async _getSessionFromURL(params, callbackUrlType) {
      var _a;
      try {
        if (!isBrowser())
          throw new AuthImplicitGrantRedirectError("No browser detected.");
        if (params.error || params.error_description || params.error_code) {
          throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
            error: params.error || "unspecified_error",
            code: params.error_code || "unspecified_code"
          });
        }
        switch (callbackUrlType) {
          case "implicit":
            if (this.flowType === "pkce") {
              throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
            }
            break;
          case "pkce":
            if (this.flowType === "implicit") {
              throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
            }
            break;
          default:
        }
        if (callbackUrlType === "pkce") {
          this._debug("#_initialize()", "begin", "is PKCE flow", true);
          if (!params.code)
            throw new AuthPKCEGrantCodeExchangeError("No code detected.");
          const { data: data2, error: error2 } = await this._exchangeCodeForSession(params.code);
          if (error2)
            throw error2;
          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          window.history.replaceState(window.history.state, "", url.toString());
          return {
            data: { session: data2.session, redirectType: (_a = data2.redirectType) !== null && _a !== void 0 ? _a : null },
            error: null
          };
        }
        const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
        if (!access_token || !expires_in || !refresh_token || !token_type) {
          throw new AuthImplicitGrantRedirectError("No session defined in URL");
        }
        const timeNow = Math.round(Date.now() / 1e3);
        const expiresIn = parseInt(expires_in);
        let expiresAt2 = timeNow + expiresIn;
        if (expires_at) {
          expiresAt2 = parseInt(expires_at);
        }
        const actuallyExpiresIn = expiresAt2 - timeNow;
        if (actuallyExpiresIn * 1e3 <= AUTO_REFRESH_TICK_DURATION_MS) {
          console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
        }
        const issuedAt = expiresAt2 - expiresIn;
        if (timeNow - issuedAt >= 120) {
          console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt2, timeNow);
        } else if (timeNow - issuedAt < 0) {
          console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", issuedAt, expiresAt2, timeNow);
        }
        const { data, error } = await this._getUser(access_token);
        if (error)
          throw error;
        const session2 = {
          provider_token,
          provider_refresh_token,
          access_token,
          expires_in: expiresIn,
          expires_at: expiresAt2,
          refresh_token,
          token_type,
          user: data.user
        };
        window.location.hash = "";
        this._debug("#_getSessionFromURL()", "clearing window.location.hash");
        return this._returnResult({ data: { session: session2, redirectType: params.type }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { session: null, redirectType: null }, error });
        }
        throw error;
      }
    }
    /**
     * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
     *
     * If `detectSessionInUrl` is a function, it will be called with the URL and params to determine
     * if the URL should be processed as a Supabase auth callback. This allows users to exclude
     * URLs from other OAuth providers (e.g., Facebook Login) that also return access_token in the fragment.
     */
    _isImplicitGrantCallback(params) {
      if (typeof this.detectSessionInUrl === "function") {
        return this.detectSessionInUrl(new URL(window.location.href), params);
      }
      return Boolean(params.access_token || params.error || params.error_description || params.error_code);
    }
    /**
     * Checks if the current URL and backing storage contain parameters given by a PKCE flow
     */
    async _isPKCECallback(params) {
      const currentStorageContent = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      return !!(params.code && currentStorageContent);
    }
    /**
     * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
     *
     * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
     * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
     *
     * If using `others` scope, no `SIGNED_OUT` event is fired!
     *
     * **Warning:** the default `scope` is `'global'`. This signs the user out of
     * **every device they are currently signed in on**, not just the current
     * tab/session. If you only want to sign the user out of the current session
     * (the behavior most other auth libraries default to), pass
     * `{ scope: 'local' }` explicitly.
     *
     * @category Auth
     *
     * @remarks
     * - In order to use the `signOut()` method, the user needs to be signed in first.
     * - By default, `signOut()` uses the **global** scope, which signs out the user
     *   on every device they are signed in on (not just the current one). Pass
     *   `{ scope: 'local' }` to only sign out the current session. This is
     *   usually what apps want on a "Sign out" button, especially when users
     *   sign in from multiple devices and do not expect signing out of one to
     *   terminate the others.
     * - Since Supabase Auth uses JWTs for authentication, the access token JWT will be valid until it's expired. When the user signs out, Supabase revokes the refresh token and deletes the JWT from the client-side. This does not revoke the JWT and it will still be valid until it expires.
     *
     * @example Sign out of every device (global – default)
     * ```js
     * const { error } = await supabase.auth.signOut()
     * ```
     *
     * @example Sign out only the current session (recommended for most apps)
     * ```js
     * const { error } = await supabase.auth.signOut({ scope: 'local' })
     * ```
     *
     * @example Sign out of all other sessions, keep the current one
     * ```js
     * const { error } = await supabase.auth.signOut({ scope: 'others' })
     * ```
     */
    async signOut(options = { scope: "global" }) {
      await this.initializePromise;
      if (this.lock != null) {
        return await this._acquireLock(this.lockAcquireTimeout, async () => {
          return await this._signOut(options);
        });
      }
      return await this._signOut(options);
    }
    async _signOut({ scope } = { scope: "global" }) {
      return await this._useSession(async (result) => {
        var _a;
        const { data, error: sessionError } = result;
        if (sessionError && !isAuthSessionMissingError(sessionError)) {
          return this._returnResult({ error: sessionError });
        }
        const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
        if (accessToken) {
          const { error } = await this.admin.signOut(accessToken, scope);
          if (error) {
            if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401 || error.status === 403) || isAuthSessionMissingError(error))) {
              return this._returnResult({ error });
            }
          }
        }
        if (scope !== "others") {
          await this._removeSession();
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        }
        return this._returnResult({ error: null });
      });
    }
    /**  *
     * @category Auth
     *
     * @remarks
     * - Subscribes to important events occurring on the user's session.
     * - Use on the frontend/client. It is less useful on the server.
     * - Events are emitted across tabs to keep your application's UI up-to-date. Some events can fire very frequently, based on the number of tabs open. Use a quick and efficient callback function, and defer or debounce as many operations as you can to be performed outside of the callback.
     * - Callbacks can be `async` and can safely call other Supabase auth methods (`getUser`, `setSession`, etc.) from inside the callback.
     * - Keep callbacks quick. Events are awaited in order, so a slow callback delays subsequent events to subscribers in this tab.
     * - Emitted events:
     *   - `INITIAL_SESSION`
     *     - Emitted right after the Supabase client is constructed and the initial session from storage is loaded.
     *   - `SIGNED_IN`
     *     - Emitted each time a user session is confirmed or re-established, including on user sign in and when refocusing a tab.
     *     - Avoid making assumptions as to when this event is fired, this may occur even when the user is already signed in. Instead, check the user object attached to the event to see if a new user has signed in and update your application's UI.
     *     - This event can fire very frequently depending on the number of tabs open in your application.
     *   - `SIGNED_OUT`
     *     - Emitted when the user signs out. This can be after:
     *       - A call to `supabase.auth.signOut()`.
     *       - After the user's session has expired for any reason:
     *         - User has signed out on another device.
     *         - The session has reached its timebox limit or inactivity timeout.
     *         - User has signed in on another device with single session per user enabled.
     *         - Check the [User Sessions](/docs/guides/auth/sessions) docs for more information.
     *     - Use this to clean up any local storage your application has associated with the user.
     *   - `TOKEN_REFRESHED`
     *     - Emitted each time a new access and refresh token are fetched for the signed in user.
     *     - It's best practice and highly recommended to extract the access token (JWT) and store it in memory for further use in your application.
     *       - Avoid frequent calls to `supabase.auth.getSession()` for the same purpose.
     *     - There is a background process that keeps track of when the session should be refreshed so you will always receive valid tokens by listening to this event.
     *     - The frequency of this event is related to the JWT expiry limit configured on your project.
     *   - `USER_UPDATED`
     *     - Emitted each time the `supabase.auth.updateUser()` method finishes successfully. Listen to it to update your application's UI based on new profile information.
     *   - `PASSWORD_RECOVERY`
     *     - Emitted instead of the `SIGNED_IN` event when the user lands on a page that includes a password recovery link in the URL.
     *     - Use it to show a UI to the user where they can [reset their password](/docs/guides/auth/passwords#resetting-a-users-password-forgot-password).
     *
     * @example Listen to auth changes
     * ```js
     * const { data } = supabase.auth.onAuthStateChange((event, session) => {
     *   console.log(event, session)
     *
     *   if (event === 'INITIAL_SESSION') {
     *     // handle initial session
     *   } else if (event === 'SIGNED_IN') {
     *     // handle sign in event
     *   } else if (event === 'SIGNED_OUT') {
     *     // handle sign out event
     *   } else if (event === 'PASSWORD_RECOVERY') {
     *     // handle password recovery event
     *   } else if (event === 'TOKEN_REFRESHED') {
     *     // handle token refreshed event
     *   } else if (event === 'USER_UPDATED') {
     *     // handle user updated event
     *   }
     * })
     *
     * // call unsubscribe to remove the callback
     * data.subscription.unsubscribe()
     * ```
     *
     * @exampleDescription Listen to sign out
     * Make sure you clear out any local data, such as local and session storage, after the client library has detected the user's sign out.
     *
     * @example Listen to sign out
     * ```js
     * supabase.auth.onAuthStateChange((event, session) => {
     *   if (event === 'SIGNED_OUT') {
     *     console.log('SIGNED_OUT', session)
     *
     *     // clear local and session storage
     *     [
     *       window.localStorage,
     *       window.sessionStorage,
     *     ].forEach((storage) => {
     *       Object.entries(storage)
     *         .forEach(([key]) => {
     *           storage.removeItem(key)
     *         })
     *     })
     *   }
     * })
     * ```
     *
     * @exampleDescription Store OAuth provider tokens on sign in
     * When using [OAuth (Social Login)](/docs/guides/auth/social-login) you sometimes wish to get access to the provider's access token and refresh token, in order to call provider APIs in the name of the user.
     *
     * For example, if you are using [Sign in with Google](/docs/guides/auth/social-login/auth-google) you may want to use the provider token to call Google APIs on behalf of the user. Supabase Auth does not keep track of the provider access and refresh token, but does return them for you once, immediately after sign in. You can use the `onAuthStateChange` method to listen for the presence of the provider tokens and store them in local storage. You can further send them to your server's APIs for use on the backend.
     *
     * Finally, make sure you remove them from local storage on the `SIGNED_OUT` event. If the OAuth provider supports token revocation, make sure you call those APIs either from the frontend or schedule them to be called on the backend.
     *
     * @example Store OAuth provider tokens on sign in
     * ```js
     * // Register this immediately after calling createClient!
     * // Because signInWithOAuth causes a redirect, you need to fetch the
     * // provider tokens from the callback.
     * supabase.auth.onAuthStateChange((event, session) => {
     *   if (session && session.provider_token) {
     *     window.localStorage.setItem('oauth_provider_token', session.provider_token)
     *   }
     *
     *   if (session && session.provider_refresh_token) {
     *     window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
     *   }
     *
     *   if (event === 'SIGNED_OUT') {
     *     window.localStorage.removeItem('oauth_provider_token')
     *     window.localStorage.removeItem('oauth_provider_refresh_token')
     *   }
     * })
     * ```
     *
     * @exampleDescription Use React Context for the User's session
     * Instead of relying on `supabase.auth.getSession()` within your React components, you can use a [React Context](https://react.dev/reference/react/createContext) to store the latest session information from the `onAuthStateChange` callback and access it that way.
     *
     * @example Use React Context for the User's session
     * ```js
     * const SessionContext = React.createContext(null)
     *
     * function main() {
     *   const [session, setSession] = React.useState(null)
     *
     *   React.useEffect(() => {
     *     const {data: { subscription }} = supabase.auth.onAuthStateChange(
     *       (event, session) => {
     *         if (event === 'SIGNED_OUT') {
     *           setSession(null)
     *         } else if (session) {
     *           setSession(session)
     *         }
     *       })
     *
     *     return () => {
     *       subscription.unsubscribe()
     *     }
     *   }, [])
     *
     *   return (
     *     <SessionContext.Provider value={session}>
     *       <App />
     *     </SessionContext.Provider>
     *   )
     * }
     * ```
     *
     * @example Listen to password recovery events
     * ```js
     * supabase.auth.onAuthStateChange((event, session) => {
     *   if (event === 'PASSWORD_RECOVERY') {
     *     console.log('PASSWORD_RECOVERY', session)
     *     // show screen to update user's password
     *     showPasswordResetScreen(true)
     *   }
     * })
     * ```
     *
     * @example Listen to sign in
     * ```js
     * supabase.auth.onAuthStateChange((event, session) => {
     *   if (event === 'SIGNED_IN') console.log('SIGNED_IN', session)
     * })
     * ```
     *
     * @example Listen to token refresh
     * ```js
     * supabase.auth.onAuthStateChange((event, session) => {
     *   if (event === 'TOKEN_REFRESHED') console.log('TOKEN_REFRESHED', session)
     * })
     * ```
     *
     * @example Listen to user updates
     * ```js
     * supabase.auth.onAuthStateChange((event, session) => {
     *   if (event === 'USER_UPDATED') console.log('USER_UPDATED', session)
     * })
     * ```
     */
    onAuthStateChange(callback) {
      const id = generateCallbackId();
      const subscription = {
        id,
        callback,
        unsubscribe: () => {
          this._debug("#unsubscribe()", "state change callback with id removed", id);
          this.stateChangeEmitters.delete(id);
        }
      };
      this._debug("#onAuthStateChange()", "registered callback with id", id);
      this.stateChangeEmitters.set(id, subscription);
      (async () => {
        await this.initializePromise;
        if (this.lock != null) {
          await this._acquireLock(this.lockAcquireTimeout, async () => {
            this._emitInitialSession(id);
          });
        } else {
          await this._emitInitialSession(id);
        }
      })();
      return { data: { subscription } };
    }
    async _emitInitialSession(id) {
      return await this._useSession(async (result) => {
        var _a, _b;
        try {
          const { data: { session: session2 }, error } = result;
          if (error)
            throw error;
          await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session2));
          this._debug("INITIAL_SESSION", "callback id", id, "session", session2);
        } catch (err) {
          await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
          this._debug("INITIAL_SESSION", "callback id", id, "error", err);
          if (isAuthSessionMissingError(err)) {
            console.warn(err);
          } else {
            console.error(err);
          }
        }
      });
    }
    /**
     * Sends a password reset request to an email address. This method supports the PKCE flow.
     *
     * @param email The email address of the user.
     * @param options.redirectTo The URL to send the user to after they click the password reset link.
     * @param options.captchaToken Verification token received when the user completes the captcha on the site.
     *
     * @category Auth
     *
     * @remarks
     * - The password reset flow consist of 2 broad steps: (i) Allow the user to login via the password reset link; (ii) Update the user's password.
     * - The `resetPasswordForEmail()` only sends a password reset link to the user's email.
     * To update the user's password, see [`updateUser()`](/docs/reference/javascript/auth-updateuser).
     * - A `PASSWORD_RECOVERY` event will be emitted when the password recovery link is clicked.
     * You can use [`onAuthStateChange()`](/docs/reference/javascript/auth-onauthstatechange) to listen and invoke a callback function on these events.
     * - When the user clicks the reset link in the email they are redirected back to your application.
     * You can configure the URL that the user is redirected to with the `redirectTo` parameter.
     * See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
     * - After the user has been redirected successfully, prompt them for a new password and call `updateUser()`:
     * ```js
     * const { data, error } = await supabase.auth.updateUser({
     *   password: new_password
     * })
     * ```
     *
     * @example Reset password
     * ```js
     * const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
     *   redirectTo: 'https://example.com/update-password',
     * })
     * ```
     *
     * @exampleResponse Reset password
     * ```json
     * {
     *   data: {}
     *   error: null
     * }
     * ```
     *
     * @example Reset password (React)
     * ```js
     * /**
     *  * Step 1: Send the user an email to get a password reset token.
     *  * This email contains a link which sends the user back to your application.
     *  *\/
     * const { data, error } = await supabase.auth
     *   .resetPasswordForEmail('user@email.com')
     *
     * /**
     *  * Step 2: Once the user is redirected back to your application,
     *  * ask the user to reset their password.
     *  *\/
     *  useEffect(() => {
     *    supabase.auth.onAuthStateChange(async (event, session) => {
     *      if (event == "PASSWORD_RECOVERY") {
     *        const newPassword = prompt("What would you like your new password to be?");
     *        const { data, error } = await supabase.auth
     *          .updateUser({ password: newPassword })
     *
     *        if (data) alert("Password updated successfully!")
     *        if (error) alert("There was an error updating your password.")
     *      }
     *    })
     *  }, [])
     * ```
     */
    async resetPasswordForEmail(email, options = {}) {
      let codeChallenge = null;
      let codeChallengeMethod = null;
      if (this.flowType === "pkce") {
        ;
        [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(
          this.storage,
          this.storageKey,
          true
          // isPasswordRecovery
        );
      }
      try {
        return await _request(this.fetch, "POST", `${this.url}/recover`, {
          body: {
            email,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
            gotrue_meta_security: { captcha_token: options.captchaToken }
          },
          headers: this.headers,
          redirectTo: options.redirectTo
        });
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Gets all the identities linked to a user.
     *
     * @category Auth
     *
     * @remarks
     * - The user needs to be signed in to call `getUserIdentities()`.
     *
     * @example Returns a list of identities linked to the user
     * ```js
     * const { data, error } = await supabase.auth.getUserIdentities()
     * ```
     *
     * @exampleResponse Returns a list of identities linked to the user
     * ```json
     * {
     *   "data": {
     *     "identities": [
     *       {
     *         "identity_id": "22222222-2222-2222-2222-222222222222",
     *         "id": "2024-01-01T00:00:00Z",
     *         "user_id": "2024-01-01T00:00:00Z",
     *         "identity_data": {
     *           "email": "example@email.com",
     *           "email_verified": false,
     *           "phone_verified": false,
     *           "sub": "11111111-1111-1111-1111-111111111111"
     *         },
     *         "provider": "email",
     *         "last_sign_in_at": "2024-01-01T00:00:00Z",
     *         "created_at": "2024-01-01T00:00:00Z",
     *         "updated_at": "2024-01-01T00:00:00Z",
     *         "email": "example@email.com"
     *       }
     *     ]
     *   },
     *   "error": null
     * }
     * ```
     */
    async getUserIdentities() {
      var _a;
      try {
        const { data, error } = await this.getUser();
        if (error)
          throw error;
        return this._returnResult({ data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**  *
     * @category Auth
     *
     * @remarks
     * - The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/auth/providers).
     * - The user needs to be signed in to call `linkIdentity()`.
     * - If the candidate identity is already linked to the existing user or another user, `linkIdentity()` will fail.
     * - If `linkIdentity` is run in the browser, the user is automatically redirected to the returned URL. On the server, you should handle the redirect.
     *
     * @example Link an identity to a user
     * ```js
     * const { data, error } = await supabase.auth.linkIdentity({
     *   provider: 'github'
     * })
     * ```
     *
     * @exampleResponse Link an identity to a user
     * ```json
     * {
     *   data: {
     *     provider: 'github',
     *     url: <PROVIDER_URL_TO_REDIRECT_TO>
     *   },
     *   error: null
     * }
     * ```
     */
    async linkIdentity(credentials) {
      if ("token" in credentials) {
        return this.linkIdentityIdToken(credentials);
      }
      return this.linkIdentityOAuth(credentials);
    }
    async linkIdentityOAuth(credentials) {
      var _a;
      try {
        const { data, error } = await this._useSession(async (result) => {
          var _a2, _b, _c, _d, _f;
          const { data: data2, error: error2 } = result;
          if (error2)
            throw error2;
          const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
            redirectTo: (_a2 = credentials.options) === null || _a2 === void 0 ? void 0 : _a2.redirectTo,
            scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
            queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
            skipBrowserRedirect: true
          });
          return await _request(this.fetch, "GET", url, {
            headers: this.headers,
            jwt: (_f = (_d = data2.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _f !== void 0 ? _f : void 0
          });
        });
        if (error)
          throw error;
        if (isBrowser() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
          window.location.assign(data === null || data === void 0 ? void 0 : data.url);
        }
        return this._returnResult({
          data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url },
          error: null
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { provider: credentials.provider, url: null }, error });
        }
        throw error;
      }
    }
    async linkIdentityIdToken(credentials) {
      return await this._useSession(async (result) => {
        var _a;
        try {
          const { error: sessionError, data: { session: session2 } } = result;
          if (sessionError)
            throw sessionError;
          const { options, provider, token, access_token, nonce } = credentials;
          const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
            headers: this.headers,
            jwt: (_a = session2 === null || session2 === void 0 ? void 0 : session2.access_token) !== null && _a !== void 0 ? _a : void 0,
            body: {
              provider,
              id_token: token,
              access_token,
              nonce,
              link_identity: true,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponse
          });
          const { data, error } = res;
          if (error) {
            return this._returnResult({ data: { user: null, session: null }, error });
          } else if (!data || !data.session || !data.user) {
            return this._returnResult({
              data: { user: null, session: null },
              error: new AuthInvalidTokenResponseError()
            });
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("USER_UPDATED", data.session);
          }
          return this._returnResult({ data, error });
        } catch (error) {
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
          if (isAuthError(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      });
    }
    /**
     * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
     *
     * @category Auth
     *
     * @remarks
     * - The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/auth/providers).
     * - The user needs to be signed in to call `unlinkIdentity()`.
     * - The user must have at least 2 identities in order to unlink an identity.
     * - The identity to be unlinked must belong to the user.
     *
     * @example Unlink an identity
     * ```js
     * // retrieve all identities linked to a user
     * const identities = await supabase.auth.getUserIdentities()
     *
     * // find the google identity
     * const googleIdentity = identities.find(
     *   identity => identity.provider === 'google'
     * )
     *
     * // unlink the google identity
     * const { error } = await supabase.auth.unlinkIdentity(googleIdentity)
     * ```
     */
    async unlinkIdentity(identity) {
      try {
        return await this._useSession(async (result) => {
          var _a, _b;
          const { data, error } = result;
          if (error) {
            throw error;
          }
          return await _request(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
            headers: this.headers,
            jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Generates a new JWT.
     * @param refreshToken A valid refresh token that was returned on login.
     */
    async _refreshAccessToken(refreshToken) {
      const debugName = `#_refreshAccessToken()`;
      this._debug(debugName, "begin");
      try {
        const startedAt = Date.now();
        return await retryable(async (attempt) => {
          if (attempt > 0) {
            await sleep2(200 * Math.pow(2, attempt - 1));
          }
          this._debug(debugName, "refreshing attempt", attempt);
          return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
            body: { refresh_token: refreshToken },
            headers: this.headers,
            xform: _sessionResponse
          });
        }, (attempt, error) => {
          const nextBackOffInterval = 200 * Math.pow(2, attempt);
          return error && isAuthRetryableFetchError(error) && // retryable only if the request can be sent before the backoff overflows the tick duration
          Date.now() + nextBackOffInterval - startedAt < AUTO_REFRESH_TICK_DURATION_MS;
        });
      } catch (error) {
        this._debug(debugName, "error", error);
        if (isAuthError(error)) {
          return this._returnResult({ data: { session: null, user: null }, error });
        }
        throw error;
      } finally {
        this._debug(debugName, "end");
      }
    }
    _isValidSession(maybeSession) {
      const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
      return isValidSession;
    }
    async _handleProviderSignIn(provider, options) {
      const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
        redirectTo: options.redirectTo,
        scopes: options.scopes,
        queryParams: options.queryParams
      });
      this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
      if (isBrowser() && !options.skipBrowserRedirect) {
        window.location.assign(url);
      }
      return { data: { provider, url }, error: null };
    }
    /**
     * Recovers the session from LocalStorage and refreshes the token
     * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
     */
    async _recoverAndRefresh() {
      var _a, _b;
      const debugName = "#_recoverAndRefresh()";
      this._debug(debugName, "begin");
      try {
        const currentSession = await getItemAsync(this.storage, this.storageKey);
        if (currentSession && this.userStorage) {
          let maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
          if (!this.storage.isServer && Object.is(this.storage, this.userStorage) && !maybeUser) {
            maybeUser = { user: currentSession.user };
            await setItemAsync(this.userStorage, this.storageKey + "-user", maybeUser);
          }
          currentSession.user = (_a = maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) !== null && _a !== void 0 ? _a : userNotAvailableProxy();
        } else if (currentSession && !currentSession.user) {
          if (!currentSession.user) {
            const separateUser = await getItemAsync(this.storage, this.storageKey + "-user");
            if (separateUser && (separateUser === null || separateUser === void 0 ? void 0 : separateUser.user)) {
              currentSession.user = separateUser.user;
              await removeItemAsync(this.storage, this.storageKey + "-user");
              await setItemAsync(this.storage, this.storageKey, currentSession);
            } else {
              currentSession.user = userNotAvailableProxy();
            }
          }
        }
        this._debug(debugName, "session from storage", currentSession);
        if (!this._isValidSession(currentSession)) {
          this._debug(debugName, "session is not valid");
          if (currentSession !== null) {
            await this._removeSession();
          }
          return;
        }
        const expiresWithMargin = ((_b = currentSession.expires_at) !== null && _b !== void 0 ? _b : Infinity) * 1e3 - Date.now() < EXPIRY_MARGIN_MS;
        this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN_MS}s`);
        if (expiresWithMargin) {
          if (this.autoRefreshToken && currentSession.refresh_token) {
            const { error } = await this._callRefreshToken(currentSession.refresh_token);
            if (error) {
              if (isAuthRefreshDiscardedError(error)) {
                this._debug(debugName, "refresh discarded by commit guard", error);
              } else {
                this._debug(debugName, "refresh failed", error);
              }
            }
          }
        } else if (currentSession.user && currentSession.user.__isUserNotAvailableProxy === true) {
          try {
            const { data, error: userError } = await this._getUser(currentSession.access_token);
            if (!userError && (data === null || data === void 0 ? void 0 : data.user)) {
              currentSession.user = data.user;
              await this._saveSession(currentSession);
              await this._notifyAllSubscribers("SIGNED_IN", currentSession);
            } else {
              this._debug(debugName, "could not get user data, skipping SIGNED_IN notification");
            }
          } catch (getUserError) {
            console.error("Error getting user data:", getUserError);
            this._debug(debugName, "error getting user data, skipping SIGNED_IN notification", getUserError);
          }
        } else {
          await this._notifyAllSubscribers("SIGNED_IN", currentSession);
        }
      } catch (err) {
        this._debug(debugName, "error", err);
        console.error(err);
        return;
      } finally {
        this._debug(debugName, "end");
      }
    }
    async _callRefreshToken(refreshToken) {
      var _a, _b;
      if (!refreshToken) {
        throw new AuthSessionMissingError();
      }
      if (this.refreshingDeferred) {
        return this.refreshingDeferred.promise;
      }
      if (this.lastRefreshFailure && this.lastRefreshFailure.refreshToken === refreshToken && Date.now() < this.lastRefreshFailure.expiresAt) {
        this._debug("#_callRefreshToken()", "returning cached failure (cooldown active)");
        return this.lastRefreshFailure.result;
      }
      const debugName = `#_callRefreshToken()`;
      this._debug(debugName, "begin");
      try {
        this.refreshingDeferred = new Deferred();
        const storedAtStart = await getItemAsync(this.storage, this.storageKey);
        const { data, error } = await this._refreshAccessToken(refreshToken);
        if (error)
          throw error;
        if (!data.session)
          throw new AuthSessionMissingError();
        const storedAfter = await getItemAsync(this.storage, this.storageKey);
        const storageChangedUnderUs = storedAtStart !== null && (storedAfter === null || storedAfter.refresh_token !== storedAtStart.refresh_token);
        if (storageChangedUnderUs) {
          this._debug(debugName, "commit guard: storage changed since refresh started, discarding rotated tokens", {
            // Presence indicators only — never log refresh token fragments,
            // even partial. Logs may be forwarded to third-party services.
            startedWith: "present",
            nowHolds: storedAfter ? "replaced" : "cleared"
          });
          const discarded = {
            data: null,
            error: new AuthRefreshDiscardedError()
          };
          this.refreshingDeferred.resolve(discarded);
          return discarded;
        }
        const epochBeforeSave = this._sessionRemovalEpoch;
        await this._saveSession(data.session);
        if (this._sessionRemovalEpoch !== epochBeforeSave) {
          this._debug(debugName, "commit guard (post-save): _removeSession ran during _saveSession, undoing write");
          await removeItemAsync(this.storage, this.storageKey);
          if (this.userStorage) {
            await removeItemAsync(this.userStorage, this.storageKey + "-user");
          }
          const discarded = {
            data: null,
            error: new AuthRefreshDiscardedError()
          };
          this.refreshingDeferred.resolve(discarded);
          return discarded;
        }
        await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
        const result = { data: data.session, error: null };
        this.lastRefreshFailure = null;
        this.refreshingDeferred.resolve(result);
        return result;
      } catch (error) {
        this._debug(debugName, "error", error);
        if (isAuthError(error)) {
          const result = { data: null, error };
          if (!isAuthRetryableFetchError(error)) {
            const storedNow = await getItemAsync(this.storage, this.storageKey);
            const accessTokenStillValid = !!((storedNow === null || storedNow === void 0 ? void 0 : storedNow.expires_at) && storedNow.expires_at * 1e3 > Date.now());
            if (accessTokenStillValid) {
              this._debug(debugName, "proactive refresh failed, access token still valid \u2014 preserving session");
            } else {
              await this._removeSession();
            }
          }
          this.lastRefreshFailure = {
            refreshToken,
            result,
            expiresAt: Date.now() + REFRESH_FAILURE_COOLDOWN_MS
          };
          (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
          return result;
        }
        (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
        throw error;
      } finally {
        this.refreshingDeferred = null;
        this._debug(debugName, "end");
      }
    }
    async _notifyAllSubscribers(event, session2, broadcast = true) {
      const debugName = `#_notifyAllSubscribers(${event})`;
      this._debug(debugName, "begin", session2, `broadcast = ${broadcast}`);
      try {
        if (this.broadcastChannel && broadcast) {
          this.broadcastChannel.postMessage({ event, session: session2 });
        }
        const errors = [];
        const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
          try {
            await x.callback(event, session2);
          } catch (e3) {
            errors.push(e3);
          }
        });
        await Promise.all(promises);
        if (errors.length > 0) {
          for (let i2 = 0; i2 < errors.length; i2 += 1) {
            console.error(errors[i2]);
          }
          throw errors[0];
        }
      } finally {
        this._debug(debugName, "end");
      }
    }
    /**
     * set currentSession and currentUser
     * process to _startAutoRefreshToken if possible
     */
    async _saveSession(session2) {
      this._debug("#_saveSession()", session2);
      this.suppressGetSessionWarning = true;
      await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      const sessionToProcess = Object.assign({}, session2);
      const userIsProxy = sessionToProcess.user && sessionToProcess.user.__isUserNotAvailableProxy === true;
      if (this.userStorage) {
        if (!userIsProxy && sessionToProcess.user) {
          await setItemAsync(this.userStorage, this.storageKey + "-user", {
            user: sessionToProcess.user
          });
        } else if (userIsProxy) {
        }
        const mainSessionData = Object.assign({}, sessionToProcess);
        delete mainSessionData.user;
        const clonedMainSessionData = deepClone(mainSessionData);
        await setItemAsync(this.storage, this.storageKey, clonedMainSessionData);
      } else {
        const clonedSession = deepClone(sessionToProcess);
        await setItemAsync(this.storage, this.storageKey, clonedSession);
      }
    }
    async _removeSession() {
      this._sessionRemovalEpoch += 1;
      this._debug("#_removeSession()");
      this.lastRefreshFailure = null;
      this.suppressGetSessionWarning = false;
      await removeItemAsync(this.storage, this.storageKey);
      await removeItemAsync(this.storage, this.storageKey + "-code-verifier");
      await removeItemAsync(this.storage, this.storageKey + "-user");
      if (this.userStorage) {
        await removeItemAsync(this.userStorage, this.storageKey + "-user");
      }
      await this._notifyAllSubscribers("SIGNED_OUT", null);
    }
    /**
     * Removes any registered visibilitychange callback.
     *
     * {@see #startAutoRefresh}
     * {@see #stopAutoRefresh}
     */
    _removeVisibilityChangedCallback() {
      this._debug("#_removeVisibilityChangedCallback()");
      const callback = this.visibilityChangedCallback;
      this.visibilityChangedCallback = null;
      try {
        if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
          window.removeEventListener("visibilitychange", callback);
        }
      } catch (e3) {
        console.error("removing visibilitychange callback failed", e3);
      }
    }
    /**
     * This is the private implementation of {@link #startAutoRefresh}. Use this
     * within the library.
     */
    async _startAutoRefresh() {
      await this._stopAutoRefresh();
      this._debug("#_startAutoRefresh()");
      const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION_MS);
      this.autoRefreshTicker = ticker;
      if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
        ticker.unref();
      } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
        Deno.unrefTimer(ticker);
      }
      const timeout = setTimeout(async () => {
        await this.initializePromise;
        await this._autoRefreshTokenTick();
      }, 0);
      this.autoRefreshTickTimeout = timeout;
      if (timeout && typeof timeout === "object" && typeof timeout.unref === "function") {
        timeout.unref();
      } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
        Deno.unrefTimer(timeout);
      }
    }
    /**
     * This is the private implementation of {@link #stopAutoRefresh}. Use this
     * within the library.
     */
    async _stopAutoRefresh() {
      this._debug("#_stopAutoRefresh()");
      const ticker = this.autoRefreshTicker;
      this.autoRefreshTicker = null;
      if (ticker) {
        clearInterval(ticker);
      }
      const timeout = this.autoRefreshTickTimeout;
      this.autoRefreshTickTimeout = null;
      if (timeout) {
        clearTimeout(timeout);
      }
    }
    /**
     * Starts an auto-refresh process in the background. The session is checked
     * every few seconds. Close to the time of expiration a process is started to
     * refresh the session. If refreshing fails it will be retried for as long as
     * necessary.
     *
     * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
     * to call this function, it will be called for you.
     *
     * On browsers the refresh process works only when the tab/window is in the
     * foreground to conserve resources as well as prevent race conditions and
     * flooding auth with requests. If you call this method any managed
     * visibility change callback will be removed and you must manage visibility
     * changes on your own.
     *
     * On non-browser platforms the refresh process works *continuously* in the
     * background, which may not be desirable. You should hook into your
     * platform's foreground indication mechanism and call these methods
     * appropriately to conserve resources.
     *
     * {@see #stopAutoRefresh}
     *
     * @category Auth
     *
     * @remarks
     * - Only useful in non-browser environments such as React Native or Electron.
     * - The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.
     * - On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is _focused_ or not.
     * - To give this hint to the application, you should be calling this method when the app is in focus and calling `supabase.auth.stopAutoRefresh()` when it's out of focus.
     *
     * @example Start and stop auto refresh in React Native
     * ```js
     * import { AppState } from 'react-native'
     *
     * // make sure you register this only once!
     * AppState.addEventListener('change', (state) => {
     *   if (state === 'active') {
     *     supabase.auth.startAutoRefresh()
     *   } else {
     *     supabase.auth.stopAutoRefresh()
     *   }
     * })
     * ```
     */
    async startAutoRefresh() {
      this._removeVisibilityChangedCallback();
      await this._startAutoRefresh();
    }
    /**
     * Stops an active auto refresh process running in the background (if any).
     *
     * If you call this method any managed visibility change callback will be
     * removed and you must manage visibility changes on your own.
     *
     * See {@link #startAutoRefresh} for more details.
     *
     * @category Auth
     *
     * @remarks
     * - Only useful in non-browser environments such as React Native or Electron.
     * - The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.
     * - On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is _focused_ or not.
     * - When your application goes in the background or out of focus, call this method to stop the proactive refreshing of the session.
     *
     * @example Start and stop auto refresh in React Native
     * ```js
     * import { AppState } from 'react-native'
     *
     * // make sure you register this only once!
     * AppState.addEventListener('change', (state) => {
     *   if (state === 'active') {
     *     supabase.auth.startAutoRefresh()
     *   } else {
     *     supabase.auth.stopAutoRefresh()
     *   }
     * })
     * ```
     */
    async stopAutoRefresh() {
      this._removeVisibilityChangedCallback();
      await this._stopAutoRefresh();
    }
    /**
     * Tears down the client's background work: stops the auto-refresh interval,
     * removes the `visibilitychange` listener, closes the cross-tab
     * `BroadcastChannel`, and clears registered `onAuthStateChange` subscribers.
     *
     * Call this from cleanup hooks when the client is being replaced before
     * its JS realm is destroyed. React Strict Mode and HMR are the common
     * cases. Any in-flight `fetch` calls continue to completion and may still
     * write to storage; dispose doesn't abort them or erase storage.
     *
     * Lifecycle caveat: because in-flight refreshes are not aborted, a
     * disposed instance can still persist a rotated session to storage after
     * `dispose()` returns. A subsequent `createClient` against the same
     * `storageKey` will pick up that session on its next read. If you need
     * strict isolation between client lifecycles, await any pending auth
     * operation before calling `dispose()` (or change the `storageKey` for
     * the replacement client).
     *
     * Safe to call repeatedly.
     *
     * @category Auth
     *
     * @example Cleanup on React unmount
     * ```ts
     * useEffect(() => {
     *   const client = createClient(...)
     *   return () => { client.auth.dispose() }
     * }, [])
     * ```
     */
    async dispose() {
      var _a;
      this._removeVisibilityChangedCallback();
      await this._stopAutoRefresh();
      (_a = this.broadcastChannel) === null || _a === void 0 ? void 0 : _a.close();
      this.broadcastChannel = null;
      this.stateChangeEmitters.clear();
    }
    /**
     * Runs the auto refresh token tick.
     */
    async _autoRefreshTokenTick() {
      this._debug("#_autoRefreshTokenTick()", "begin");
      if (this.lock != null) {
        try {
          await this._acquireLock(0, async () => {
            try {
              const now = Date.now();
              try {
                return await this._useSession(async (result) => {
                  const { data: { session: session2 } } = result;
                  if (!session2 || !session2.refresh_token || !session2.expires_at) {
                    this._debug("#_autoRefreshTokenTick()", "no session");
                    return;
                  }
                  const expiresInTicks = Math.floor((session2.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
                  this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
                  if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                    await this._callRefreshToken(session2.refresh_token);
                  }
                });
              } catch (e3) {
                console.error("Auto refresh tick failed with error. This is likely a transient error.", e3);
              }
            } finally {
              this._debug("#_autoRefreshTokenTick()", "end");
            }
          });
        } catch (e3) {
          if (e3 instanceof LockAcquireTimeoutError) {
            this._debug("auto refresh token tick lock not available");
          } else {
            throw e3;
          }
        }
        return;
      }
      if (this.refreshingDeferred !== null) {
        this._debug("#_autoRefreshTokenTick()", "refresh already in flight, skipping");
        return;
      }
      try {
        const now = Date.now();
        try {
          await this._useSession(async (result) => {
            const { data: { session: session2 } } = result;
            if (!session2 || !session2.refresh_token || !session2.expires_at) {
              this._debug("#_autoRefreshTokenTick()", "no session");
              return;
            }
            const expiresInTicks = Math.floor((session2.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
            this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
            if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
              await this._callRefreshToken(session2.refresh_token);
            }
          });
        } catch (e3) {
          console.error("Auto refresh tick failed with error. This is likely a transient error.", e3);
        }
      } finally {
        this._debug("#_autoRefreshTokenTick()", "end");
      }
    }
    /**
     * Registers callbacks on the browser / platform, which in-turn run
     * algorithms when the browser window/tab are in foreground. On non-browser
     * platforms it assumes always foreground.
     */
    async _handleVisibilityChange() {
      this._debug("#_handleVisibilityChange()");
      if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
        if (this.autoRefreshToken) {
          this.startAutoRefresh();
        }
        return false;
      }
      try {
        this.visibilityChangedCallback = async () => {
          try {
            await this._onVisibilityChanged(false);
          } catch (error) {
            this._debug("#visibilityChangedCallback", "error", error);
          }
        };
        window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
        await this._onVisibilityChanged(true);
      } catch (error) {
        console.error("_handleVisibilityChange", error);
      }
    }
    /**
     * Callback registered with `window.addEventListener('visibilitychange')`.
     */
    async _onVisibilityChanged(calledFromInitialize) {
      const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
      this._debug(methodName, "visibilityState", document.visibilityState);
      if (document.visibilityState === "visible") {
        if (this.autoRefreshToken) {
          this._startAutoRefresh();
        }
        if (!calledFromInitialize) {
          await this.initializePromise;
          if (this.lock != null) {
            await this._acquireLock(this.lockAcquireTimeout, async () => {
              if (document.visibilityState !== "visible") {
                this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
                return;
              }
              await this._recoverAndRefresh();
            });
          } else {
            if (document.visibilityState !== "visible") {
              this._debug(methodName, "visibilityState is no longer visible, skipping recovery");
              return;
            }
            await this._recoverAndRefresh();
          }
        }
      } else if (document.visibilityState === "hidden") {
        if (this.autoRefreshToken) {
          this._stopAutoRefresh();
        }
      }
    }
    /**
     * Generates the relevant login URL for a third-party provider.
     * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param options.scopes A space-separated list of scopes granted to the OAuth application.
     * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
     */
    async _getUrlForProvider(url, provider, options) {
      const urlParams = [`provider=${encodeURIComponent(provider)}`];
      if (options === null || options === void 0 ? void 0 : options.redirectTo) {
        urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
      }
      if (options === null || options === void 0 ? void 0 : options.scopes) {
        urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
      }
      if (this.flowType === "pkce") {
        const [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        const flowParams = new URLSearchParams({
          code_challenge: `${encodeURIComponent(codeChallenge)}`,
          code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
        });
        urlParams.push(flowParams.toString());
      }
      if (options === null || options === void 0 ? void 0 : options.queryParams) {
        const query = new URLSearchParams(options.queryParams);
        urlParams.push(query.toString());
      }
      if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
        urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
      }
      return `${url}?${urlParams.join("&")}`;
    }
    async _unenroll(params) {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    async _enroll(params) {
      try {
        return await this._useSession(async (result) => {
          var _a, _b;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          const body = Object.assign({ friendly_name: params.friendlyName, factor_type: params.factorType }, params.factorType === "phone" ? { phone: params.phone } : params.factorType === "totp" ? { issuer: params.issuer } : {});
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors`, {
            body,
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (error) {
            return this._returnResult({ data: null, error });
          }
          if (params.factorType === "totp" && data.type === "totp" && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) {
            data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
          }
          return this._returnResult({ data, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    async _verify(params) {
      const run = async () => {
        try {
          return await this._useSession(async (result) => {
            var _a;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            const body = Object.assign({ challenge_id: params.challengeId }, "webauthn" in params ? {
              webauthn: Object.assign(Object.assign({}, params.webauthn), { credential_response: params.webauthn.type === "create" ? serializeCredentialCreationResponse(params.webauthn.credential_response) : serializeCredentialRequestResponse(params.webauthn.credential_response) })
            } : { code: params.code });
            const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
              body,
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
            if (error) {
              return this._returnResult({ data: null, error });
            }
            await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
            await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
            return this._returnResult({ data, error });
          });
        } catch (error) {
          if (isAuthError(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      };
      if (this.lock != null) {
        return this._acquireLock(this.lockAcquireTimeout, run);
      }
      return run();
    }
    async _challenge(params) {
      const run = async () => {
        try {
          return await this._useSession(async (result) => {
            var _a;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            const response = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
              body: params,
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
            if (response.error) {
              return response;
            }
            const { data } = response;
            if (data.type !== "webauthn") {
              return { data, error: null };
            }
            switch (data.webauthn.type) {
              case "create":
                return {
                  data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: deserializeCredentialCreationOptions(data.webauthn.credential_options.publicKey) }) }) }),
                  error: null
                };
              case "request":
                return {
                  data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: deserializeCredentialRequestOptions(data.webauthn.credential_options.publicKey) }) }) }),
                  error: null
                };
            }
          });
        } catch (error) {
          if (isAuthError(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      };
      if (this.lock != null) {
        return this._acquireLock(this.lockAcquireTimeout, run);
      }
      return run();
    }
    /**
     * {@see GoTrueMFAApi#challengeAndVerify}
     */
    async _challengeAndVerify(params) {
      const { data: challengeData, error: challengeError } = await this._challenge({
        factorId: params.factorId
      });
      if (challengeError) {
        return this._returnResult({ data: null, error: challengeError });
      }
      return await this._verify({
        factorId: params.factorId,
        challengeId: challengeData.id,
        code: params.code
      });
    }
    /**
     * {@see GoTrueMFAApi#listFactors}
     */
    async _listFactors() {
      var _a;
      const { data: { user }, error: userError } = await this.getUser();
      if (userError) {
        return { data: null, error: userError };
      }
      const data = {
        all: [],
        phone: [],
        totp: [],
        webauthn: []
      };
      for (const factor of (_a = user === null || user === void 0 ? void 0 : user.factors) !== null && _a !== void 0 ? _a : []) {
        data.all.push(factor);
        if (factor.status === "verified") {
          ;
          data[factor.factor_type].push(factor);
        }
      }
      return {
        data,
        error: null
      };
    }
    /**
     * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
     */
    async _getAuthenticatorAssuranceLevel(jwt) {
      var _a, _b, _c, _d;
      if (jwt) {
        try {
          const { payload: payload2 } = decodeJWT(jwt);
          let currentLevel2 = null;
          if (payload2.aal) {
            currentLevel2 = payload2.aal;
          }
          let nextLevel2 = currentLevel2;
          const { data: { user }, error: userError } = await this.getUser(jwt);
          if (userError) {
            return this._returnResult({ data: null, error: userError });
          }
          const verifiedFactors2 = (_b = (_a = user === null || user === void 0 ? void 0 : user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
          if (verifiedFactors2.length > 0) {
            nextLevel2 = "aal2";
          }
          const currentAuthenticationMethods2 = payload2.amr || [];
          return { data: { currentLevel: currentLevel2, nextLevel: nextLevel2, currentAuthenticationMethods: currentAuthenticationMethods2 }, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      const { data: { session: session2 }, error: sessionError } = await this.getSession();
      if (sessionError) {
        return this._returnResult({ data: null, error: sessionError });
      }
      if (!session2) {
        return {
          data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
          error: null
        };
      }
      const { payload } = decodeJWT(session2.access_token);
      let currentLevel = null;
      if (payload.aal) {
        currentLevel = payload.aal;
      }
      let nextLevel = currentLevel;
      const verifiedFactors = (_d = (_c = session2.user.factors) === null || _c === void 0 ? void 0 : _c.filter((factor) => factor.status === "verified")) !== null && _d !== void 0 ? _d : [];
      if (verifiedFactors.length > 0) {
        nextLevel = "aal2";
      }
      const currentAuthenticationMethods = payload.amr || [];
      return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
    }
    /**
     * Retrieves details about an OAuth authorization request.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * Returns authorization details including client info, scopes, and user information.
     * If the response includes only a redirect_url field, it means consent was already given - the caller
     * should handle the redirect manually if needed.
     */
    async _getAuthorizationDetails(authorizationId) {
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          return await _request(this.fetch, "GET", `${this.url}/oauth/authorizations/${authorizationId}`, {
            headers: this.headers,
            jwt: session2.access_token,
            xform: (data) => ({ data, error: null })
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Approves an OAuth authorization request.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     */
    async _approveAuthorization(authorizationId, options) {
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          const response = await _request(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
            headers: this.headers,
            jwt: session2.access_token,
            body: { action: "approve" },
            xform: (data) => ({ data, error: null })
          });
          if (response.data && response.data.redirect_url) {
            if (isBrowser() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) {
              window.location.assign(response.data.redirect_url);
            }
          }
          return response;
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Denies an OAuth authorization request.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     */
    async _denyAuthorization(authorizationId, options) {
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          const response = await _request(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
            headers: this.headers,
            jwt: session2.access_token,
            body: { action: "deny" },
            xform: (data) => ({ data, error: null })
          });
          if (response.data && response.data.redirect_url) {
            if (isBrowser() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) {
              window.location.assign(response.data.redirect_url);
            }
          }
          return response;
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Lists all OAuth grants that the authenticated user has authorized.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     */
    async _listOAuthGrants() {
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          return await _request(this.fetch, "GET", `${this.url}/user/oauth/grants`, {
            headers: this.headers,
            jwt: session2.access_token,
            xform: (data) => ({ data, error: null })
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Revokes a user's OAuth grant for a specific client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     */
    async _revokeOAuthGrant(options) {
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          await _request(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, {
            headers: this.headers,
            jwt: session2.access_token,
            query: { client_id: options.clientId },
            noResolveJson: true
          });
          return { data: {}, error: null };
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    async fetchJwk(kid, jwks = { keys: [] }) {
      let jwk = jwks.keys.find((key) => key.kid === kid);
      if (jwk) {
        return jwk;
      }
      const now = Date.now();
      jwk = this.jwks.keys.find((key) => key.kid === kid);
      if (jwk && this.jwks_cached_at + JWKS_TTL > now) {
        return jwk;
      }
      const { data, error } = await _request(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, {
        headers: this.headers
      });
      if (error) {
        throw error;
      }
      if (!data.keys || data.keys.length === 0) {
        return null;
      }
      this.jwks = data;
      this.jwks_cached_at = now;
      jwk = data.keys.find((key) => key.kid === kid);
      if (!jwk) {
        return null;
      }
      return jwk;
    }
    /**
     * Extracts the JWT claims present in the access token by first verifying the
     * JWT against the server's JSON Web Key Set endpoint
     * `/.well-known/jwks.json` which is often cached, resulting in significantly
     * faster responses. Prefer this method over {@link #getUser} which always
     * sends a request to the Auth server for each JWT.
     *
     * If the project is not using an asymmetric JWT signing key (like ECC or
     * RSA) it always sends a request to the Auth server (similar to {@link
     * #getUser}) to verify the JWT.
     *
     * @param jwt An optional specific JWT you wish to verify, not the one you
     *            can obtain from {@link #getSession}.
     * @param options Various additional options that allow you to customize the
     *                behavior of this method.
     *
     * @category Auth
     *
     * @remarks
     * - Parses the user's [access token](/docs/guides/auth/sessions#access-token-jwt-claims) as a [JSON Web Token (JWT)](/docs/guides/auth/jwts) and returns its components if valid and not expired.
     * - If your project is using asymmetric JWT signing keys, then the verification is done locally usually without a network request using the [WebCrypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).
     * - A network request is sent to your project's JWT signing key discovery endpoint `https://project-id.supabase.co/auth/v1/.well-known/jwks.json`, which is cached locally. If your environment is ephemeral, such as a Lambda function that is destroyed after every request, a network request will be sent for each new invocation. Supabase provides a network-edge cache providing fast responses for these situations.
     * - If the user's access token is about to expire when calling this function, the user's session will first be refreshed before validating the JWT.
     * - If your project is using a symmetric secret to sign the JWT, it always sends a request similar to `getUser()` to validate the JWT at the server before returning the decoded token. This is also used if the WebCrypto API is not available in the environment. Make sure you polyfill it in such situations.
     * - The returned claims can be customized per project using the [Custom Access Token Hook](/docs/guides/auth/auth-hooks/custom-access-token-hook).
     *
     * @example Get JWT claims, header and signature
     * ```js
     * const { data, error } = await supabase.auth.getClaims()
     * ```
     *
     * @exampleResponse Get JWT claims, header and signature
     * ```json
     * {
     *   "data": {
     *     "claims": {
     *       "aal": "aal1",
     *       "amr": [{
     *         "method": "email",
     *         "timestamp": 1715766000
     *       }],
     *       "app_metadata": {},
     *       "aud": "authenticated",
     *       "email": "example@email.com",
     *       "exp": 1715769600,
     *       "iat": 1715766000,
     *       "is_anonymous": false,
     *       "iss": "https://project-id.supabase.co/auth/v1",
     *       "phone": "+13334445555",
     *       "role": "authenticated",
     *       "session_id": "11111111-1111-1111-1111-111111111111",
     *       "sub": "11111111-1111-1111-1111-111111111111",
     *       "user_metadata": {}
     *     },
     *     "header": {
     *       "alg": "RS256",
     *       "typ": "JWT",
     *       "kid": "11111111-1111-1111-1111-111111111111"
     *     },
     *     "signature": [/** Uint8Array *\/],
     *   },
     *   "error": null
     * }
     * ```
     */
    async getClaims(jwt, options = {}) {
      try {
        let token = jwt;
        if (!token) {
          const { data, error } = await this.getSession();
          if (error || !data.session) {
            return this._returnResult({ data: null, error });
          }
          token = data.session.access_token;
        }
        const { header, payload, signature, raw: { header: rawHeader, payload: rawPayload } } = decodeJWT(token);
        if (!(options === null || options === void 0 ? void 0 : options.allowExpired)) {
          try {
            validateExp(payload.exp);
          } catch (e3) {
            throw new AuthInvalidJwtError(e3 instanceof Error ? e3.message : "JWT validation failed");
          }
        }
        const signingKey = !header.alg || header.alg.startsWith("HS") || !header.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(header.kid, (options === null || options === void 0 ? void 0 : options.keys) ? { keys: options.keys } : options === null || options === void 0 ? void 0 : options.jwks);
        if (!signingKey) {
          const { error } = await this.getUser(token);
          if (error) {
            throw error;
          }
          return {
            data: {
              claims: payload,
              header,
              signature
            },
            error: null
          };
        }
        const algorithm = getAlgorithm(header.alg);
        const publicKey = await crypto.subtle.importKey("jwk", signingKey, algorithm, true, [
          "verify"
        ]);
        const isValid = await crypto.subtle.verify(algorithm, publicKey, signature, stringToUint8Array(`${rawHeader}.${rawPayload}`));
        if (!isValid) {
          throw new AuthInvalidJwtError("Invalid JWT signature");
        }
        return {
          data: {
            claims: payload,
            header,
            signature
          },
          error: null
        };
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    // --- Passkey Methods ---
    /**
     * Sign in with a passkey. Handles the full WebAuthn ceremony:
     * 1. Fetches authentication challenge from server
     * 2. Prompts user via navigator.credentials.get()
     * 3. Verifies credential with server and creates session
     *
     * Requires `auth.experimental.passkey: true`.
     *
     * @category Auth
     */
    async signInWithPasskey(credentials) {
      var _a, _b, _c;
      assertPasskeyExperimentalEnabled(this.experimental);
      try {
        if (!browserSupportsWebAuthn()) {
          return this._returnResult({
            data: null,
            error: new AuthUnknownError("Browser does not support WebAuthn", null)
          });
        }
        const { data: options, error: optionsError } = await this._startPasskeyAuthentication({
          options: { captchaToken: (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.captchaToken }
        });
        if (optionsError || !options) {
          return this._returnResult({ data: null, error: optionsError });
        }
        const publicKeyOptions = deserializeCredentialRequestOptions(options.options);
        const signal = (_c = (_b = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _b === void 0 ? void 0 : _b.signal) !== null && _c !== void 0 ? _c : webAuthnAbortService.createNewAbortSignal();
        const { data: credential, error: credentialError } = await getCredential({
          publicKey: publicKeyOptions,
          signal
        });
        if (credentialError || !credential) {
          return this._returnResult({
            data: null,
            error: credentialError !== null && credentialError !== void 0 ? credentialError : new AuthUnknownError("WebAuthn ceremony failed", null)
          });
        }
        const serialized = serializeCredentialRequestResponse(credential);
        return this._verifyPasskeyAuthentication({
          challengeId: options.challenge_id,
          credential: serialized
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Register a passkey for the current authenticated user. Handles the full WebAuthn ceremony:
     * 1. Fetches registration challenge from server
     * 2. Prompts user via navigator.credentials.create()
     * 3. Verifies credential with server
     *
     * Requires an active session. Requires `auth.experimental.passkey: true`.
     *
     * @category Auth
     */
    async registerPasskey(credentials) {
      var _a, _b;
      assertPasskeyExperimentalEnabled(this.experimental);
      try {
        if (!browserSupportsWebAuthn()) {
          return this._returnResult({
            data: null,
            error: new AuthUnknownError("Browser does not support WebAuthn", null)
          });
        }
        const { data: options, error: optionsError } = await this._startPasskeyRegistration();
        if (optionsError || !options) {
          return this._returnResult({ data: null, error: optionsError });
        }
        const publicKeyOptions = deserializeCredentialCreationOptions(options.options);
        const signal = (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.signal) !== null && _b !== void 0 ? _b : webAuthnAbortService.createNewAbortSignal();
        const { data: credential, error: credentialError } = await createCredential({
          publicKey: publicKeyOptions,
          signal
        });
        if (credentialError || !credential) {
          return this._returnResult({
            data: null,
            error: credentialError !== null && credentialError !== void 0 ? credentialError : new AuthUnknownError("WebAuthn ceremony failed", null)
          });
        }
        const serialized = serializeCredentialCreationResponse(credential);
        return this._verifyPasskeyRegistration({
          challengeId: options.challenge_id,
          credential: serialized
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Start passkey registration for the current authenticated user.
     * Returns WebAuthn credential creation options to pass to navigator.credentials.create().
     */
    async _startPasskeyRegistration() {
      assertPasskeyExperimentalEnabled(this.experimental);
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/registration/options`, {
            headers: this.headers,
            jwt: session2.access_token,
            body: {}
          });
          if (error) {
            return this._returnResult({ data: null, error });
          }
          return this._returnResult({ data, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Verify passkey registration with the credential response.
     * The credentialResponse should be the serialized output of navigator.credentials.create().
     */
    async _verifyPasskeyRegistration(params) {
      assertPasskeyExperimentalEnabled(this.experimental);
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/registration/verify`, {
            headers: this.headers,
            jwt: session2.access_token,
            body: {
              challenge_id: params.challengeId,
              credential: params.credential
            }
          });
          if (error) {
            return this._returnResult({ data: null, error });
          }
          return this._returnResult({ data, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Start passkey authentication.
     * Returns WebAuthn credential request options to pass to navigator.credentials.get().
     */
    async _startPasskeyAuthentication(params) {
      var _a;
      assertPasskeyExperimentalEnabled(this.experimental);
      try {
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/authentication/options`, {
          headers: this.headers,
          body: {
            gotrue_meta_security: { captcha_token: (_a = params === null || params === void 0 ? void 0 : params.options) === null || _a === void 0 ? void 0 : _a.captchaToken }
          }
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        return this._returnResult({ data, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Verify passkey authentication and create a session.
     * The credential should be the serialized output of navigator.credentials.get().
     */
    async _verifyPasskeyAuthentication(params) {
      assertPasskeyExperimentalEnabled(this.experimental);
      try {
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/authentication/verify`, {
          headers: this.headers,
          body: {
            challenge_id: params.challengeId,
            credential: params.credential
          },
          xform: _sessionResponse
        });
        if (error) {
          return this._returnResult({ data: null, error });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({ data, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * List all passkeys for the current user.
     */
    async _listPasskeys() {
      assertPasskeyExperimentalEnabled(this.experimental);
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          const { data, error } = await _request(this.fetch, "GET", `${this.url}/passkeys`, {
            headers: this.headers,
            jwt: session2.access_token,
            xform: (data2) => ({ data: data2, error: null })
          });
          if (error) {
            return this._returnResult({ data: null, error });
          }
          return this._returnResult({ data, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Update a passkey.
     */
    async _updatePasskey(params) {
      assertPasskeyExperimentalEnabled(this.experimental);
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          const { data, error } = await _request(this.fetch, "PATCH", `${this.url}/passkeys/${params.passkeyId}`, {
            headers: this.headers,
            jwt: session2.access_token,
            body: { friendly_name: params.friendlyName }
          });
          if (error) {
            return this._returnResult({ data: null, error });
          }
          return this._returnResult({ data, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Delete a passkey.
     */
    async _deletePasskey(params) {
      assertPasskeyExperimentalEnabled(this.experimental);
      try {
        return await this._useSession(async (result) => {
          const { data: { session: session2 }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session2) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          const { error } = await _request(this.fetch, "DELETE", `${this.url}/passkeys/${params.passkeyId}`, {
            headers: this.headers,
            jwt: session2.access_token,
            noResolveJson: true
          });
          if (error) {
            return this._returnResult({ data: null, error });
          }
          return this._returnResult({ data: null, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
  };
  GoTrueClient.nextInstanceID = {};
  var GoTrueClient_default = GoTrueClient;

  // node_modules/@supabase/auth-js/dist/module/AuthClient.js
  var AuthClient = GoTrueClient_default;
  var AuthClient_default = AuthClient;

  // node_modules/@supabase/supabase-js/dist/index.mjs
  var version4 = "2.110.0";
  var JS_ENV = "";
  var JS_RUNTIME_VERSION;
  if (typeof Deno !== "undefined") {
    JS_ENV = "deno";
    JS_RUNTIME_VERSION = (_Deno$version = Deno.version) === null || _Deno$version === void 0 ? void 0 : _Deno$version.deno;
  } else if (typeof document !== "undefined") JS_ENV = "web";
  else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") JS_ENV = "react-native";
  else {
    JS_ENV = "node";
    JS_RUNTIME_VERSION = typeof process !== "undefined" ? (_process$version = process.version) === null || _process$version === void 0 ? void 0 : _process$version.replace(/^v/, "") : void 0;
  }
  var _Deno$version;
  var _process$version;
  var _runtimeMeta = [`runtime=${JS_ENV}`];
  if (JS_RUNTIME_VERSION) _runtimeMeta.push(`runtime-version=${JS_RUNTIME_VERSION}`);
  var DEFAULT_HEADERS3 = { "X-Client-Info": `supabase-js/${version4}; ${_runtimeMeta.join("; ")}` };
  var DEFAULT_GLOBAL_OPTIONS = { headers: DEFAULT_HEADERS3 };
  var DEFAULT_DB_OPTIONS = { schema: "public" };
  var DEFAULT_AUTH_OPTIONS = {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "implicit"
  };
  var DEFAULT_REALTIME_OPTIONS = {};
  var DEFAULT_TRACE_PROPAGATION_OPTIONS = {
    enabled: false,
    respectSamplingDecision: true
  };
  function __awaiter2(thisArg, _arguments, P2, generator) {
    function adopt(value) {
      return value instanceof P2 ? value : new P2(function(resolve) {
        resolve(value);
      });
    }
    return new (P2 || (P2 = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e3) {
          reject(e3);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e3) {
          reject(e3);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  var otelModulePromise = null;
  var OTEL_PKG = "@opentelemetry/api";
  function loadOtel() {
    if (otelModulePromise === null) otelModulePromise = import(
      /* webpackIgnore: true */
      /* turbopackIgnore: true */
      /* @vite-ignore */
      OTEL_PKG
    ).catch(() => null);
    return otelModulePromise;
  }
  function extractTraceContext() {
    return __awaiter2(this, void 0, void 0, function* () {
      try {
        const otel = yield loadOtel();
        if (!otel || !otel.propagation || !otel.context) return null;
        const carrier = {};
        otel.propagation.inject(otel.context.active(), carrier);
        const traceparent = carrier["traceparent"];
        if (!traceparent) return null;
        return {
          traceparent,
          tracestate: carrier["tracestate"],
          baggage: carrier["baggage"]
        };
      } catch (_a) {
        return null;
      }
    });
  }
  function parseTraceParent(traceparent) {
    if (!traceparent || typeof traceparent !== "string") return null;
    const parts = traceparent.split("-");
    if (parts.length !== 4) return null;
    const [version$1, traceId, parentId, traceFlags] = parts;
    if (version$1.length !== 2 || traceId.length !== 32 || parentId.length !== 16 || traceFlags.length !== 2) return null;
    const hexRegex = /^[0-9a-f]+$/i;
    if (!hexRegex.test(version$1) || !hexRegex.test(traceId) || !hexRegex.test(parentId) || !hexRegex.test(traceFlags)) return null;
    if (traceId === "00000000000000000000000000000000" || parentId === "0000000000000000") return null;
    return {
      version: version$1,
      traceId,
      parentId,
      traceFlags,
      isSampled: (parseInt(traceFlags, 16) & 1) === 1
    };
  }
  function shouldPropagateToTarget(targetUrl, targets) {
    if (!targetUrl || !targets || targets.length === 0) return false;
    let url;
    if (targetUrl instanceof URL) url = targetUrl;
    else try {
      url = new URL(targetUrl);
    } catch (error) {
      return false;
    }
    for (const target of targets) try {
      if (typeof target === "string") {
        if (matchStringTarget(url.hostname, target)) return true;
      } else if (target instanceof RegExp) {
        if (target.test(url.hostname)) return true;
      } else if (typeof target === "function") {
        if (target(url)) return true;
      }
    } catch (error) {
      continue;
    }
    return false;
  }
  function matchStringTarget(hostname, target) {
    if (target === hostname) return true;
    if (target.startsWith("*.")) {
      const domain = target.slice(2);
      if (hostname.endsWith(domain)) {
        if (hostname === domain || hostname.endsWith("." + domain)) return true;
      }
    }
    return false;
  }
  function getDefaultPropagationTargets(supabaseUrl2) {
    const targets = [];
    try {
      const url = new URL(supabaseUrl2);
      targets.push(url.hostname);
    } catch (error) {
    }
    targets.push("*.supabase.co", "*.supabase.in");
    targets.push("localhost", "127.0.0.1", "[::1]");
    return targets;
  }
  function _typeof3(o2) {
    "@babel/helpers - typeof";
    return _typeof3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
      return typeof o$1;
    } : function(o$1) {
      return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
    }, _typeof3(o2);
  }
  function toPrimitive3(t2, r2) {
    if ("object" != _typeof3(t2) || !t2) return t2;
    var e3 = t2[Symbol.toPrimitive];
    if (void 0 !== e3) {
      var i2 = e3.call(t2, r2 || "default");
      if ("object" != _typeof3(i2)) return i2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function toPropertyKey3(t2) {
    var i2 = toPrimitive3(t2, "string");
    return "symbol" == _typeof3(i2) ? i2 : i2 + "";
  }
  function _defineProperty3(e3, r2, t2) {
    return (r2 = toPropertyKey3(r2)) in e3 ? Object.defineProperty(e3, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e3[r2] = t2, e3;
  }
  function ownKeys3(e3, r2) {
    var t2 = Object.keys(e3);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e3);
      r2 && (o2 = o2.filter(function(r$1) {
        return Object.getOwnPropertyDescriptor(e3, r$1).enumerable;
      })), t2.push.apply(t2, o2);
    }
    return t2;
  }
  function _objectSpread23(e3) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys3(Object(t2), true).forEach(function(r$1) {
        _defineProperty3(e3, r$1, t2[r$1]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(t2)) : ownKeys3(Object(t2)).forEach(function(r$1) {
        Object.defineProperty(e3, r$1, Object.getOwnPropertyDescriptor(t2, r$1));
      });
    }
    return e3;
  }
  var resolveFetch4 = (customFetch) => {
    if (customFetch) return (...args) => customFetch(...args);
    return (...args) => fetch(...args);
  };
  var resolveHeadersConstructor = () => {
    return Headers;
  };
  var fetchWithAuth = (supabaseKey, supabaseUrl2, getAccessToken, customFetch, tracePropagationOptions) => {
    const fetch$1 = resolveFetch4(customFetch);
    const HeadersConstructor = resolveHeadersConstructor();
    const traceEnabled = (tracePropagationOptions === null || tracePropagationOptions === void 0 ? void 0 : tracePropagationOptions.enabled) === true;
    const respectSampling = (tracePropagationOptions === null || tracePropagationOptions === void 0 ? void 0 : tracePropagationOptions.respectSamplingDecision) !== false;
    const traceTargets = traceEnabled ? getDefaultPropagationTargets(supabaseUrl2) : null;
    return async (input, init) => {
      var _await$getAccessToken;
      const accessToken = (_await$getAccessToken = await getAccessToken()) !== null && _await$getAccessToken !== void 0 ? _await$getAccessToken : supabaseKey;
      let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
      if (!headers.has("apikey")) headers.set("apikey", supabaseKey);
      if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${accessToken}`);
      if (traceTargets) {
        const traceHeaders = await getTraceHeaders(input, traceTargets, respectSampling);
        if (traceHeaders) {
          if (traceHeaders.traceparent && !headers.has("traceparent")) headers.set("traceparent", traceHeaders.traceparent);
          if (traceHeaders.tracestate && !headers.has("tracestate")) headers.set("tracestate", traceHeaders.tracestate);
          if (traceHeaders.baggage && !headers.has("baggage")) headers.set("baggage", traceHeaders.baggage);
        }
      }
      return fetch$1(input, _objectSpread23(_objectSpread23({}, init), {}, { headers }));
    };
  };
  async function getTraceHeaders(input, targets, respectSampling) {
    if (!shouldPropagateToTarget(typeof input === "string" ? input : input instanceof URL ? input : input.url, targets)) return null;
    const traceContext = await extractTraceContext();
    if (!traceContext || !traceContext.traceparent) return null;
    if (respectSampling) {
      const parsed = parseTraceParent(traceContext.traceparent);
      if (parsed && !parsed.isSampled) return null;
    }
    return traceContext;
  }
  function normalizeTracePropagation(value) {
    return typeof value === "boolean" ? { enabled: value } : value;
  }
  function ensureTrailingSlash(url) {
    return url.endsWith("/") ? url : url + "/";
  }
  function applySettingDefaults(options, defaults) {
    var _DEFAULT_GLOBAL_OPTIO, _globalOptions$header, _ref, _tracePropagationOpti, _ref2, _tracePropagationOpti2;
    const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
    const { db: DEFAULT_DB_OPTIONS$1, auth: DEFAULT_AUTH_OPTIONS$1, realtime: DEFAULT_REALTIME_OPTIONS$1, global: DEFAULT_GLOBAL_OPTIONS$1 } = defaults;
    const tracePropagationOptions = normalizeTracePropagation(options.tracePropagation);
    const DEFAULT_TRACE_PROPAGATION_OPTIONS$1 = normalizeTracePropagation(defaults.tracePropagation);
    const result = {
      db: _objectSpread23(_objectSpread23({}, DEFAULT_DB_OPTIONS$1), dbOptions),
      auth: _objectSpread23(_objectSpread23({}, DEFAULT_AUTH_OPTIONS$1), authOptions),
      realtime: _objectSpread23(_objectSpread23({}, DEFAULT_REALTIME_OPTIONS$1), realtimeOptions),
      storage: {},
      global: _objectSpread23(_objectSpread23(_objectSpread23({}, DEFAULT_GLOBAL_OPTIONS$1), globalOptions), {}, { headers: _objectSpread23(_objectSpread23({}, (_DEFAULT_GLOBAL_OPTIO = DEFAULT_GLOBAL_OPTIONS$1 === null || DEFAULT_GLOBAL_OPTIONS$1 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS$1.headers) !== null && _DEFAULT_GLOBAL_OPTIO !== void 0 ? _DEFAULT_GLOBAL_OPTIO : {}), (_globalOptions$header = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _globalOptions$header !== void 0 ? _globalOptions$header : {}) }),
      tracePropagation: {
        enabled: (_ref = (_tracePropagationOpti = tracePropagationOptions === null || tracePropagationOptions === void 0 ? void 0 : tracePropagationOptions.enabled) !== null && _tracePropagationOpti !== void 0 ? _tracePropagationOpti : DEFAULT_TRACE_PROPAGATION_OPTIONS$1 === null || DEFAULT_TRACE_PROPAGATION_OPTIONS$1 === void 0 ? void 0 : DEFAULT_TRACE_PROPAGATION_OPTIONS$1.enabled) !== null && _ref !== void 0 ? _ref : false,
        respectSamplingDecision: (_ref2 = (_tracePropagationOpti2 = tracePropagationOptions === null || tracePropagationOptions === void 0 ? void 0 : tracePropagationOptions.respectSamplingDecision) !== null && _tracePropagationOpti2 !== void 0 ? _tracePropagationOpti2 : DEFAULT_TRACE_PROPAGATION_OPTIONS$1 === null || DEFAULT_TRACE_PROPAGATION_OPTIONS$1 === void 0 ? void 0 : DEFAULT_TRACE_PROPAGATION_OPTIONS$1.respectSamplingDecision) !== null && _ref2 !== void 0 ? _ref2 : true
      },
      accessToken: async () => ""
    };
    if (options.accessToken) result.accessToken = options.accessToken;
    else delete result.accessToken;
    return result;
  }
  function validateSupabaseUrl(supabaseUrl2) {
    const trimmedUrl = supabaseUrl2 === null || supabaseUrl2 === void 0 ? void 0 : supabaseUrl2.trim();
    if (!trimmedUrl) throw new Error("supabaseUrl is required.");
    if (!trimmedUrl.match(/^https?:\/\//i)) throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
    try {
      return new URL(ensureTrailingSlash(trimmedUrl));
    } catch (_unused) {
      throw Error("Invalid supabaseUrl: Provided URL is malformed.");
    }
  }
  var SupabaseAuthClient = class extends AuthClient_default {
    constructor(options) {
      super(options);
    }
  };
  var SupabaseClient = class {
    /**
    * Create a new client for use in the browser.
    *
    * @category Initializing
    *
    * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
    * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
    * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
    * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
    * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
    * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
    * @param options.realtime Options passed along to realtime-js constructor.
    * @param options.storage Options passed along to the storage-js constructor.
    * @param options.global.fetch A custom fetch implementation.
    * @param options.global.headers Any additional headers to send with each network request.
    *
    * @example Creating a client
    * ```js
    * import { createClient } from '@supabase/supabase-js'
    *
    * // Create a single supabase client for interacting with your database
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
    * ```
    *
    * @example With a custom domain
    * ```js
    * import { createClient } from '@supabase/supabase-js'
    *
    * // Use a custom domain as the supabase URL
    * const supabase = createClient('https://my-custom-domain.com', 'your-publishable-key')
    * ```
    *
    * @example With additional parameters
    * ```js
    * import { createClient } from '@supabase/supabase-js'
    *
    * const options = {
    *   db: {
    *     schema: 'public',
    *   },
    *   auth: {
    *     autoRefreshToken: true,
    *     persistSession: true,
    *     detectSessionInUrl: true
    *   },
    *   global: {
    *     headers: { 'x-my-custom-header': 'my-app-name' },
    *   },
    * }
    * const supabase = createClient("https://xyzcompany.supabase.co", "your-publishable-key", options)
    * ```
    *
    * @exampleDescription With custom schemas
    * By default the API server points to the `public` schema. You can enable other database schemas within the Dashboard.
    * Go to [Settings > API > Exposed schemas](/dashboard/project/_/settings/api) and add the schema which you want to expose to the API.
    *
    * Note: each client connection can only access a single schema, so the code above can access the `other_schema` schema but cannot access the `public` schema.
    *
    * @example With custom schemas
    * ```js
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key', {
    *   // Provide a custom schema. Defaults to "public".
    *   db: { schema: 'other_schema' }
    * })
    * ```
    *
    * @exampleDescription Custom fetch implementation
    * `supabase-js` uses the [`cross-fetch`](https://www.npmjs.com/package/cross-fetch) library to make HTTP requests,
    * but an alternative `fetch` implementation can be provided as an option.
    * This is most useful in environments where `cross-fetch` is not compatible (for instance Cloudflare Workers).
    *
    * @example Custom fetch implementation
    * ```js
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key', {
    *   global: { fetch: fetch.bind(globalThis) }
    * })
    * ```
    *
    * @exampleDescription React Native options with AsyncStorage
    * For React Native we recommend using `AsyncStorage` as the storage implementation for Supabase Auth.
    *
    * @example React Native options with AsyncStorage
    * ```js
    * import 'react-native-url-polyfill/auto'
    * import { createClient } from '@supabase/supabase-js'
    * import AsyncStorage from "@react-native-async-storage/async-storage";
    *
    * const supabase = createClient("https://xyzcompany.supabase.co", "your-publishable-key", {
    *   auth: {
    *     storage: AsyncStorage,
    *     autoRefreshToken: true,
    *     persistSession: true,
    *     detectSessionInUrl: false,
    *   },
    * });
    * ```
    *
    * @exampleDescription React Native options with Expo SecureStore
    * If you wish to encrypt the user's session information, you can use `aes-js` and store the encryption key in Expo SecureStore.
    * The `aes-js` library, a reputable JavaScript-only implementation of the AES encryption algorithm in CTR mode.
    * A new 256-bit encryption key is generated using the `react-native-get-random-values` library.
    * This key is stored inside Expo's SecureStore, while the value is encrypted and placed inside AsyncStorage.
    *
    * Please make sure that:
    * - You keep the `expo-secure-store`, `aes-js` and `react-native-get-random-values` libraries up-to-date.
    * - Choose the correct [`SecureStoreOptions`](https://docs.expo.dev/versions/latest/sdk/securestore/#securestoreoptions) for your app's needs.
    *   E.g. [`SecureStore.WHEN_UNLOCKED`](https://docs.expo.dev/versions/latest/sdk/securestore/#securestorewhen_unlocked) regulates when the data can be accessed.
    * - Carefully consider optimizations or other modifications to the above example, as those can lead to introducing subtle security vulnerabilities.
    *
    * @example React Native options with Expo SecureStore
    * ```ts
    * import 'react-native-url-polyfill/auto'
    * import { createClient } from '@supabase/supabase-js'
    * import AsyncStorage from '@react-native-async-storage/async-storage';
    * import * as SecureStore from 'expo-secure-store';
    * import * as aesjs from 'aes-js';
    * import 'react-native-get-random-values';
    *
    * // As Expo's SecureStore does not support values larger than 2048
    * // bytes, an AES-256 key is generated and stored in SecureStore, while
    * // it is used to encrypt/decrypt values stored in AsyncStorage.
    * class LargeSecureStore {
    *   private async _encrypt(key: string, value: string) {
    *     const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));
    *
    *     const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    *     const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
    *
    *     await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));
    *
    *     return aesjs.utils.hex.fromBytes(encryptedBytes);
    *   }
    *
    *   private async _decrypt(key: string, value: string) {
    *     const encryptionKeyHex = await SecureStore.getItemAsync(key);
    *     if (!encryptionKeyHex) {
    *       return encryptionKeyHex;
    *     }
    *
    *     const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1));
    *     const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
    *
    *     return aesjs.utils.utf8.fromBytes(decryptedBytes);
    *   }
    *
    *   async getItem(key: string) {
    *     const encrypted = await AsyncStorage.getItem(key);
    *     if (!encrypted) { return encrypted; }
    *
    *     return await this._decrypt(key, encrypted);
    *   }
    *
    *   async removeItem(key: string) {
    *     await AsyncStorage.removeItem(key);
    *     await SecureStore.deleteItemAsync(key);
    *   }
    *
    *   async setItem(key: string, value: string) {
    *     const encrypted = await this._encrypt(key, value);
    *
    *     await AsyncStorage.setItem(key, encrypted);
    *   }
    * }
    *
    * const supabase = createClient("https://xyzcompany.supabase.co", "your-publishable-key", {
    *   auth: {
    *     storage: new LargeSecureStore(),
    *     autoRefreshToken: true,
    *     persistSession: true,
    *     detectSessionInUrl: false,
    *   },
    * });
    * ```
    *
    * @example With a database query
    * ```ts
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
    *
    * const { data } = await supabase.from('profiles').select('*')
    * ```
    *
    * @exampleDescription With OpenTelemetry tracing
    * Opt in to W3C trace context propagation so the `trace_id` from your
    * client-side spans is attached to Supabase requests and appears in API
    * Gateway and Edge Function logs. Requires `@opentelemetry/api` to be
    * installed in your application. See [Tracing with the JS SDK](https://supabase.com/docs/guides/telemetry/client-side-tracing).
    *
    * @example With OpenTelemetry tracing
    * ```ts
    * import { createClient } from '@supabase/supabase-js'
    * import { trace } from '@opentelemetry/api'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key', {
    *   tracePropagation: true,
    * })
    *
    * const tracer = trace.getTracer('my-app')
    *
    * await tracer.startActiveSpan('fetch-users', async (span) => {
    *   // Outgoing request carries the active trace context.
    *   const { data, error } = await supabase.from('users').select('*')
    *   span.end()
    * })
    * ```
    */
    constructor(supabaseUrl2, supabaseKey, options) {
      var _settings$auth$storag, _settings$global$head;
      this.supabaseUrl = supabaseUrl2;
      this.supabaseKey = supabaseKey;
      const baseUrl = validateSupabaseUrl(supabaseUrl2);
      if (!supabaseKey) throw new Error("supabaseKey is required.");
      this.realtimeUrl = new URL("realtime/v1", baseUrl);
      this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
      this.authUrl = new URL("auth/v1", baseUrl);
      this.storageUrl = new URL("storage/v1", baseUrl);
      this.functionsUrl = new URL("functions/v1", baseUrl);
      const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
      const DEFAULTS = {
        db: DEFAULT_DB_OPTIONS,
        realtime: DEFAULT_REALTIME_OPTIONS,
        auth: _objectSpread23(_objectSpread23({}, DEFAULT_AUTH_OPTIONS), {}, { storageKey: defaultStorageKey }),
        global: DEFAULT_GLOBAL_OPTIONS,
        tracePropagation: DEFAULT_TRACE_PROPAGATION_OPTIONS
      };
      const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
      this.settings = settings;
      this.storageKey = (_settings$auth$storag = settings.auth.storageKey) !== null && _settings$auth$storag !== void 0 ? _settings$auth$storag : "";
      this.headers = (_settings$global$head = settings.global.headers) !== null && _settings$global$head !== void 0 ? _settings$global$head : {};
      if (!settings.accessToken) {
        var _settings$auth;
        this.auth = this._initSupabaseAuthClient((_settings$auth = settings.auth) !== null && _settings$auth !== void 0 ? _settings$auth : {}, this.headers, settings.global.fetch);
      } else {
        this.accessToken = settings.accessToken;
        this.auth = new Proxy({}, { get: (_2, prop) => {
          throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
        } });
      }
      this.fetch = fetchWithAuth(supabaseKey, supabaseUrl2, this._getAccessToken.bind(this), settings.global.fetch, settings.tracePropagation);
      this.realtime = this._initRealtimeClient(_objectSpread23({
        headers: this.headers,
        accessToken: this._getAccessToken.bind(this),
        fetch: this.fetch
      }, settings.realtime));
      if (this.accessToken) Promise.resolve(this.accessToken()).then((token) => this.realtime.setAuth(token)).catch((e3) => console.warn("Failed to set initial Realtime auth token:", e3));
      this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
        headers: this.headers,
        schema: settings.db.schema,
        fetch: this.fetch,
        timeout: settings.db.timeout,
        urlLengthLimit: settings.db.urlLengthLimit
      });
      this.storage = new StorageClient(this.storageUrl.href, this.headers, this.fetch, options === null || options === void 0 ? void 0 : options.storage);
      if (!settings.accessToken) this._listenForAuthEvents();
    }
    /**
    * Supabase Functions allows you to deploy and invoke edge functions.
    */
    get functions() {
      return new FunctionsClient(this.functionsUrl.href, {
        headers: this.headers,
        customFetch: this.fetch
      });
    }
    /**
    * Perform a query on a table or a view.
    *
    * @param relation - The table or view name to query
    */
    from(relation) {
      return this.rest.from(relation);
    }
    /**
    * Select a schema to query or perform an function (rpc) call.
    *
    * The schema needs to be on the list of exposed schemas inside Supabase.
    *
    * @param schema - The schema to query
    */
    schema(schema) {
      return this.rest.schema(schema);
    }
    /**
    * Perform a function call.
    *
    * @param fn - The function name to call
    * @param args - The arguments to pass to the function call
    * @param options - Named parameters
    * @param options.head - When set to `true`, `data` will not be returned.
    * Useful if you only need the count.
    * @param options.get - When set to `true`, the function will be called with
    * read-only access mode.
    * @param options.count - Count algorithm to use to count rows returned by the
    * function. Only applicable for [set-returning
    * functions](https://www.postgresql.org/docs/current/functions-srf.html).
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    */
    rpc(fn, args = {}, options = {
      head: false,
      get: false,
      count: void 0
    }) {
      return this.rest.rpc(fn, args, options);
    }
    /**
    * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
    *
    * @param {string} name - The name of the Realtime channel.
    * @param {Object} opts - The options to pass to the Realtime channel.
    *
    * @category Realtime
    */
    channel(name, opts = { config: {} }) {
      return this.realtime.channel(name, opts);
    }
    /**
    * Returns all Realtime channels.
    *
    * @category Realtime
    *
    * @example Get all channels
    * ```js
    * const channels = supabase.getChannels()
    * ```
    */
    getChannels() {
      return this.realtime.getChannels();
    }
    /**
    * Unsubscribes and removes Realtime channel from Realtime client.
    *
    * @param {RealtimeChannel} channel - The name of the Realtime channel.
    *
    *
    * @category Realtime
    *
    * @remarks
    * - Removing a channel is a great way to maintain the performance of your project's Realtime service as well as your database if you're listening to Postgres changes. Supabase will automatically handle cleanup 30 seconds after a client is disconnected, but unused channels may cause degradation as more clients are simultaneously subscribed.
    *
    * @example Removes a channel
    * ```js
    * supabase.removeChannel(myChannel)
    * ```
    */
    removeChannel(channel) {
      return this.realtime.removeChannel(channel);
    }
    /**
    * Unsubscribes and removes all Realtime channels from Realtime client.
    *
    * @category Realtime
    *
    * @remarks
    * - Removing channels is a great way to maintain the performance of your project's Realtime service as well as your database if you're listening to Postgres changes. Supabase will automatically handle cleanup 30 seconds after a client is disconnected, but unused channels may cause degradation as more clients are simultaneously subscribed.
    *
    * @example Remove all channels
    * ```js
    * supabase.removeAllChannels()
    * ```
    */
    removeAllChannels() {
      return this.realtime.removeAllChannels();
    }
    async _getAccessToken() {
      var _this = this;
      var _data$session$access_, _data$session;
      if (_this.accessToken) return await _this.accessToken();
      const { data } = await _this.auth.getSession();
      return (_data$session$access_ = (_data$session = data.session) === null || _data$session === void 0 ? void 0 : _data$session.access_token) !== null && _data$session$access_ !== void 0 ? _data$session$access_ : _this.supabaseKey;
    }
    _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, userStorage, storageKey, flowType, lock, debug, throwOnError, experimental, lockAcquireTimeout, skipAutoInitialize }, headers, fetch$1) {
      const authHeaders = {
        Authorization: `Bearer ${this.supabaseKey}`,
        apikey: `${this.supabaseKey}`
      };
      return new SupabaseAuthClient({
        url: this.authUrl.href,
        headers: _objectSpread23(_objectSpread23({}, authHeaders), headers),
        storageKey,
        autoRefreshToken,
        persistSession,
        detectSessionInUrl,
        storage,
        userStorage,
        flowType,
        lock,
        debug,
        throwOnError,
        experimental,
        fetch: fetch$1,
        lockAcquireTimeout,
        skipAutoInitialize,
        hasCustomAuthorizationHeader: Object.keys(this.headers).some((key) => key.toLowerCase() === "authorization")
      });
    }
    _initRealtimeClient(options) {
      return new RealtimeClient(this.realtimeUrl.href, _objectSpread23(_objectSpread23({}, options), {}, { params: _objectSpread23(_objectSpread23({}, { apikey: this.supabaseKey }), options === null || options === void 0 ? void 0 : options.params) }));
    }
    _listenForAuthEvents() {
      return this.auth.onAuthStateChange((event, session2) => {
        this._handleTokenChanged(event, "CLIENT", session2 === null || session2 === void 0 ? void 0 : session2.access_token);
      });
    }
    _handleTokenChanged(event, source, token) {
      if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
        this.changedAccessToken = token;
        this.realtime.setAuth(token);
      } else if (event === "SIGNED_OUT") {
        this.realtime.setAuth();
        if (source == "STORAGE") this.auth.signOut();
        this.changedAccessToken = void 0;
      }
    }
  };
  var createClient = (supabaseUrl2, supabaseKey, options) => {
    return new SupabaseClient(supabaseUrl2, supabaseKey, options);
  };
  function shouldShowDeprecationWarning() {
    if (typeof window !== "undefined") return false;
    const _process = globalThis["process"];
    if (!_process) return false;
    const processVersion = _process["version"];
    if (processVersion === void 0 || processVersion === null) return false;
    const versionMatch = processVersion.match(/^v(\d+)\./);
    if (!versionMatch) return false;
    return parseInt(versionMatch[1], 10) <= 20;
  }
  if (shouldShowDeprecationWarning()) console.warn("\u26A0\uFE0F  Node.js 20 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 22 or later. For more information, visit: https://github.com/orgs/supabase/discussions/45715");

  // node_modules/@paper-design/shaders/dist/vertex-shader.js
  var vertexShaderSource = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`;

  // node_modules/@paper-design/shaders/dist/shader-mount.js
  var DEFAULT_MAX_PIXEL_COUNT = 1920 * 1080 * 4;
  var ShaderMount = class {
    parentElement;
    canvasElement;
    gl;
    program = null;
    uniformLocations = {};
    /** The fragment shader that we are using */
    fragmentShader;
    /** Stores the RAF for the render loop */
    rafId = null;
    /** Time of the last rendered frame */
    lastRenderTime = 0;
    /** Total time that we have played any animation, passed as a uniform to the shader for time-based VFX */
    currentFrame = 0;
    /** The speed that we progress through animation time (multiplies by delta time every update). Allows negatives to play in reverse. If set to 0, rAF will stop entirely so static shaders have no recurring performance costs */
    speed = 0;
    /** Actual speed used that accounts for document visibility (we pause the shader if the tab is hidden) */
    currentSpeed = 0;
    /** Uniforms that are provided by the user for the specific shader being mounted (not including uniforms that this Mount adds, like time and resolution) */
    providedUniforms;
    /** Names of the uniforms that should have mipmaps generated for them */
    mipmaps = [];
    /** Just a sanity check to make sure frames don't run after we're disposed */
    hasBeenDisposed = false;
    /** If the resolution of the canvas has changed since the last render */
    resolutionChanged = true;
    /** Store textures that are provided by the user */
    textures = /* @__PURE__ */ new Map();
    minPixelRatio;
    maxPixelCount;
    isSafari = isSafari();
    uniformCache = {};
    textureUnitMap = /* @__PURE__ */ new Map();
    ownerDocument;
    constructor(parentElement, fragmentShader, uniforms, webGlContextAttributes, speed = 0, frame = 0, minPixelRatio = 2, maxPixelCount = DEFAULT_MAX_PIXEL_COUNT, mipmaps = []) {
      if (parentElement?.nodeType === 1) {
        this.parentElement = parentElement;
      } else {
        throw new Error("Paper Shaders: parent element must be an HTMLElement");
      }
      this.ownerDocument = parentElement.ownerDocument;
      if (!this.ownerDocument.querySelector("style[data-paper-shader]")) {
        const styleElement = this.ownerDocument.createElement("style");
        styleElement.innerHTML = defaultStyle;
        styleElement.setAttribute("data-paper-shader", "");
        this.ownerDocument.head.prepend(styleElement);
      }
      const canvasElement = this.ownerDocument.createElement("canvas");
      this.canvasElement = canvasElement;
      this.parentElement.prepend(canvasElement);
      this.fragmentShader = fragmentShader;
      this.providedUniforms = uniforms;
      this.mipmaps = mipmaps;
      this.currentFrame = frame;
      this.minPixelRatio = minPixelRatio;
      this.maxPixelCount = maxPixelCount;
      const gl = canvasElement.getContext("webgl2", webGlContextAttributes);
      if (!gl) {
        throw new Error("Paper Shaders: WebGL is not supported in this browser");
      }
      this.gl = gl;
      this.initProgram();
      this.setupPositionAttribute();
      this.setupUniforms();
      this.setUniformValues(this.providedUniforms);
      this.setupResizeObserver();
      visualViewport?.addEventListener("resize", this.handleVisualViewportChange);
      this.setSpeed(speed);
      this.parentElement.setAttribute("data-paper-shader", "");
      this.parentElement.paperShaderMount = this;
      this.ownerDocument.addEventListener("visibilitychange", this.handleDocumentVisibilityChange);
    }
    initProgram = () => {
      const program = createProgram(this.gl, vertexShaderSource, this.fragmentShader);
      if (!program) return;
      this.program = program;
    };
    setupPositionAttribute = () => {
      const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
      const positionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
      const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(positionAttributeLocation);
      this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    };
    setupUniforms = () => {
      const uniformLocations = {
        u_time: this.gl.getUniformLocation(this.program, "u_time"),
        u_pixelRatio: this.gl.getUniformLocation(this.program, "u_pixelRatio"),
        u_resolution: this.gl.getUniformLocation(this.program, "u_resolution")
      };
      Object.entries(this.providedUniforms).forEach(([key, value]) => {
        uniformLocations[key] = this.gl.getUniformLocation(this.program, key);
        if (value instanceof HTMLImageElement) {
          const aspectRatioUniformName = `${key}AspectRatio`;
          uniformLocations[aspectRatioUniformName] = this.gl.getUniformLocation(this.program, aspectRatioUniformName);
        }
      });
      this.uniformLocations = uniformLocations;
    };
    /**
     * The scale that we should render at.
     * - Used to target 2x rendering even on 1x screens for better antialiasing
     * - Prevents the virtual resolution from going beyond the maximum resolution
     * - Accounts for the page zoom level so we render in physical device pixels rather than CSS pixels
     */
    renderScale = 1;
    parentWidth = 0;
    parentHeight = 0;
    parentDevicePixelWidth = 0;
    parentDevicePixelHeight = 0;
    devicePixelsSupported = false;
    resizeObserver = null;
    setupResizeObserver = () => {
      this.resizeObserver = new ResizeObserver(([entry]) => {
        if (entry?.borderBoxSize[0]) {
          const physicalPixelSize = entry.devicePixelContentBoxSize?.[0];
          if (physicalPixelSize !== void 0) {
            this.devicePixelsSupported = true;
            this.parentDevicePixelWidth = physicalPixelSize.inlineSize;
            this.parentDevicePixelHeight = physicalPixelSize.blockSize;
          }
          this.parentWidth = entry.borderBoxSize[0].inlineSize;
          this.parentHeight = entry.borderBoxSize[0].blockSize;
        }
        this.handleResize();
      });
      this.resizeObserver.observe(this.parentElement);
    };
    // Visual viewport resize handler, mainly used to react to browser zoom changes.
    // Resize observer by itself does not react to pinch zoom, and although it usually
    // reacts to classic browser zoom, it's not guaranteed in edge cases.
    // Since timing between visual viewport changes and resize observer is complex
    // and because we'd like to know the device pixel sizes of elements, we just restart
    // the observer to get a guaranteed fresh callback regardless if it would have triggered or not.
    handleVisualViewportChange = () => {
      this.resizeObserver?.disconnect();
      this.setupResizeObserver();
    };
    /** Resize handler for when the container div changes size or the max pixel count changes and we want to resize our canvas to match */
    handleResize = () => {
      let targetPixelWidth = 0;
      let targetPixelHeight = 0;
      const dpr = Math.max(1, window.devicePixelRatio);
      const pinchZoom = visualViewport?.scale ?? 1;
      if (this.devicePixelsSupported) {
        const scaleToMeetMinPixelRatio = Math.max(1, this.minPixelRatio / dpr);
        targetPixelWidth = this.parentDevicePixelWidth * scaleToMeetMinPixelRatio * pinchZoom;
        targetPixelHeight = this.parentDevicePixelHeight * scaleToMeetMinPixelRatio * pinchZoom;
      } else {
        let targetRenderScale = Math.max(dpr, this.minPixelRatio) * pinchZoom;
        if (this.isSafari) {
          const zoomLevel = bestGuessBrowserZoom(this.ownerDocument);
          targetRenderScale *= Math.max(1, zoomLevel);
        }
        targetPixelWidth = Math.round(this.parentWidth) * targetRenderScale;
        targetPixelHeight = Math.round(this.parentHeight) * targetRenderScale;
      }
      const maxPixelCountHeadroom = Math.sqrt(this.maxPixelCount) / Math.sqrt(targetPixelWidth * targetPixelHeight);
      const scaleToMeetMaxPixelCount = Math.min(1, maxPixelCountHeadroom);
      const newWidth = Math.round(targetPixelWidth * scaleToMeetMaxPixelCount);
      const newHeight = Math.round(targetPixelHeight * scaleToMeetMaxPixelCount);
      const newRenderScale = newWidth / Math.round(this.parentWidth);
      if (this.canvasElement.width !== newWidth || this.canvasElement.height !== newHeight || this.renderScale !== newRenderScale) {
        this.renderScale = newRenderScale;
        this.canvasElement.width = newWidth;
        this.canvasElement.height = newHeight;
        this.resolutionChanged = true;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.render(performance.now());
      }
    };
    render = (currentTime) => {
      if (this.hasBeenDisposed) return;
      if (this.program === null) {
        console.warn("Tried to render before program or gl was initialized");
        return;
      }
      const dt = currentTime - this.lastRenderTime;
      this.lastRenderTime = currentTime;
      if (this.currentSpeed !== 0) {
        this.currentFrame += dt * this.currentSpeed;
      }
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.useProgram(this.program);
      this.gl.uniform1f(this.uniformLocations.u_time, this.currentFrame * 1e-3);
      if (this.resolutionChanged) {
        this.gl.uniform2f(this.uniformLocations.u_resolution, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform1f(this.uniformLocations.u_pixelRatio, this.renderScale);
        this.resolutionChanged = false;
      }
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      if (this.currentSpeed !== 0) {
        this.requestRender();
      } else {
        this.rafId = null;
      }
    };
    requestRender = () => {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }
      this.rafId = requestAnimationFrame(this.render);
    };
    /** Creates a texture from an image and sets it into a uniform value */
    setTextureUniform = (uniformName, image) => {
      if (!image.complete || image.naturalWidth === 0) {
        throw new Error(`Paper Shaders: image for uniform ${uniformName} must be fully loaded`);
      }
      const existingTexture = this.textures.get(uniformName);
      if (existingTexture) {
        this.gl.deleteTexture(existingTexture);
      }
      if (!this.textureUnitMap.has(uniformName)) {
        this.textureUnitMap.set(uniformName, this.textureUnitMap.size);
      }
      const textureUnit = this.textureUnitMap.get(uniformName);
      this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
      const texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
      if (this.mipmaps.includes(uniformName)) {
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
      }
      const error = this.gl.getError();
      if (error !== this.gl.NO_ERROR || texture === null) {
        console.error("Paper Shaders: WebGL error when uploading texture:", error);
        return;
      }
      this.textures.set(uniformName, texture);
      const location2 = this.uniformLocations[uniformName];
      if (location2) {
        this.gl.uniform1i(location2, textureUnit);
        const aspectRatioUniformName = `${uniformName}AspectRatio`;
        const aspectRatioLocation = this.uniformLocations[aspectRatioUniformName];
        if (aspectRatioLocation) {
          const aspectRatio = image.naturalWidth / image.naturalHeight;
          this.gl.uniform1f(aspectRatioLocation, aspectRatio);
        }
      }
    };
    /** Utility: recursive equality test for all the uniforms */
    areUniformValuesEqual = (a2, b2) => {
      if (a2 === b2) return true;
      if (Array.isArray(a2) && Array.isArray(b2) && a2.length === b2.length) {
        return a2.every((val, i2) => this.areUniformValuesEqual(val, b2[i2]));
      }
      return false;
    };
    /** Sets the provided uniform values into the WebGL program, can be a partial list of uniforms that have changed */
    setUniformValues = (updatedUniforms) => {
      this.gl.useProgram(this.program);
      Object.entries(updatedUniforms).forEach(([key, value]) => {
        let cacheValue = value;
        if (value instanceof HTMLImageElement) {
          cacheValue = `${value.src.slice(0, 200)}|${value.naturalWidth}x${value.naturalHeight}`;
        }
        if (this.areUniformValuesEqual(this.uniformCache[key], cacheValue)) return;
        this.uniformCache[key] = cacheValue;
        const location2 = this.uniformLocations[key];
        if (!location2) {
          console.warn(`Uniform location for ${key} not found`);
          return;
        }
        if (value instanceof HTMLImageElement) {
          this.setTextureUniform(key, value);
        } else if (Array.isArray(value)) {
          let flatArray = null;
          let valueLength = null;
          if (value[0] !== void 0 && Array.isArray(value[0])) {
            const firstChildLength = value[0].length;
            if (value.every((arr) => arr.length === firstChildLength)) {
              flatArray = value.flat();
              valueLength = firstChildLength;
            } else {
              console.warn(`All child arrays must be the same length for ${key}`);
              return;
            }
          } else {
            flatArray = value;
            valueLength = flatArray.length;
          }
          switch (valueLength) {
            case 2:
              this.gl.uniform2fv(location2, flatArray);
              break;
            case 3:
              this.gl.uniform3fv(location2, flatArray);
              break;
            case 4:
              this.gl.uniform4fv(location2, flatArray);
              break;
            case 9:
              this.gl.uniformMatrix3fv(location2, false, flatArray);
              break;
            case 16:
              this.gl.uniformMatrix4fv(location2, false, flatArray);
              break;
            default:
              console.warn(`Unsupported uniform array length: ${valueLength}`);
          }
        } else if (typeof value === "number") {
          this.gl.uniform1f(location2, value);
        } else if (typeof value === "boolean") {
          this.gl.uniform1i(location2, value ? 1 : 0);
        } else {
          console.warn(`Unsupported uniform type for ${key}: ${typeof value}`);
        }
      });
    };
    /** Gets the current total animation time from 0ms */
    getCurrentFrame = () => {
      return this.currentFrame;
    };
    /** Set a frame to get a deterministic result, frames are literally just milliseconds from zero since the animation started */
    setFrame = (newFrame) => {
      this.currentFrame = newFrame;
      this.lastRenderTime = performance.now();
      this.render(performance.now());
    };
    /** Set an animation speed (or 0 to stop animation) */
    setSpeed = (newSpeed = 1) => {
      this.speed = newSpeed;
      this.setCurrentSpeed(this.ownerDocument.hidden ? 0 : newSpeed);
    };
    setCurrentSpeed = (newSpeed) => {
      this.currentSpeed = newSpeed;
      if (this.rafId === null && newSpeed !== 0) {
        this.lastRenderTime = performance.now();
        this.rafId = requestAnimationFrame(this.render);
      }
      if (this.rafId !== null && newSpeed === 0) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    };
    /** Set the maximum pixel count for the shader, this will limit the number of pixels that will be rendered */
    setMaxPixelCount = (newMaxPixelCount = DEFAULT_MAX_PIXEL_COUNT) => {
      this.maxPixelCount = newMaxPixelCount;
      this.handleResize();
    };
    /** Set the minimum pixel ratio for the shader */
    setMinPixelRatio = (newMinPixelRatio = 2) => {
      this.minPixelRatio = newMinPixelRatio;
      this.handleResize();
    };
    /** Update the uniforms that are provided by the outside shader, can be a partial set with only the uniforms that have changed */
    setUniforms = (newUniforms) => {
      this.setUniformValues(newUniforms);
      this.providedUniforms = { ...this.providedUniforms, ...newUniforms };
      this.render(performance.now());
    };
    handleDocumentVisibilityChange = () => {
      this.setCurrentSpeed(this.ownerDocument.hidden ? 0 : this.speed);
    };
    /** Dispose of the shader mount, cleaning up all of the WebGL resources */
    dispose = () => {
      this.hasBeenDisposed = true;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.gl && this.program) {
        this.textures.forEach((texture) => {
          this.gl.deleteTexture(texture);
        });
        this.textures.clear();
        this.gl.deleteProgram(this.program);
        this.program = null;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.getError();
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      visualViewport?.removeEventListener("resize", this.handleVisualViewportChange);
      this.ownerDocument.removeEventListener("visibilitychange", this.handleDocumentVisibilityChange);
      this.uniformLocations = {};
      this.canvasElement.remove();
      delete this.parentElement.paperShaderMount;
    };
  };
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  function createProgram(gl, vertexShaderSource2, fragmentShaderSource) {
    const format = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);
    const precision = format ? format.precision : null;
    if (precision && precision < 23) {
      vertexShaderSource2 = vertexShaderSource2.replace(/precision\s+(lowp|mediump)\s+float;/g, "precision highp float;");
      fragmentShaderSource = fragmentShaderSource.replace(/precision\s+(lowp|mediump)\s+float/g, "precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g, "$1 highp $3");
    }
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource2);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return null;
    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  }
  var defaultStyle = `@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;
  function isSafari() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android");
  }
  function bestGuessBrowserZoom(doc) {
    const viewportScale = visualViewport?.scale ?? 1;
    const viewportWidth = visualViewport?.width ?? window.innerWidth;
    const scrollbarWidth = window.innerWidth - doc.documentElement.clientWidth;
    const innerWidth = viewportScale * viewportWidth + scrollbarWidth;
    const ratio = outerWidth / innerWidth;
    const zoomPercentageRounded = Math.round(100 * ratio);
    if (zoomPercentageRounded % 5 === 0) {
      return zoomPercentageRounded / 100;
    }
    if (zoomPercentageRounded === 33) {
      return 1 / 3;
    }
    if (zoomPercentageRounded === 67) {
      return 2 / 3;
    }
    if (zoomPercentageRounded === 133) {
      return 4 / 3;
    }
    return ratio;
  }

  // node_modules/@paper-design/shaders/dist/shader-sizing.js
  var ShaderFitOptions = {
    none: 0,
    contain: 1,
    cover: 2
  };

  // node_modules/@paper-design/shaders/dist/shader-utils.js
  var declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`;
  var rotation2 = `
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;
  var proceduralHash21 = `
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;
  var colorBandingFix = `
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);
`;
  var simplexNoise = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

  // node_modules/@paper-design/shaders/dist/shaders/heatmap.js
  var heatmapMeta = {
    maxColorCount: 10
  };
  var heatmapFragmentShader = `#version 300 es
precision highp float;

in mediump vec2 v_imageUV;
in mediump vec2 v_objectUV;
out vec4 fragColor;

uniform sampler2D u_image;
uniform float u_time;
uniform mediump float u_imageAspectRatio;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${heatmapMeta.maxColorCount}];
uniform float u_colorsCount;

uniform float u_angle;
uniform float u_noise;
uniform float u_innerGlow;
uniform float u_outerGlow;
uniform float u_contour;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

float getImgFrame(vec2 uv, float th) {
  float frame = 1.;
  frame *= smoothstep(0., th, uv.y);
  frame *= 1. - smoothstep(1. - th, 1., uv.y);
  frame *= smoothstep(0., th, uv.x);
  frame *= 1. - smoothstep(1. - th, 1., uv.x);
  return frame;
}

float circle(vec2 uv, vec2 c, vec2 r) {
  return 1. - smoothstep(r[0], r[1], length(uv - c));
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

float sst(float edge0, float edge1, float x) {
  return smoothstep(edge0, edge1, x);
}

float shadowShape(vec2 uv, float t, float contour) {
  vec2 scaledUV = uv;

  // base shape tranjectory
  float posY = mix(-1., 2., t);

  // scaleX when it's moving down
  scaledUV.y -= .5;
  float mainCircleScale = sst(0., .8, posY) * lst(1.4, .9, posY);
  scaledUV *= vec2(1., 1. + 1.5 * mainCircleScale);
  scaledUV.y += .5;

  // base shape
  float innerR = .4;
  float outerR = 1. - .3 * (sst(.1, .2, t) * (1. - sst(.2, .5, t)));
  float s = circle(scaledUV, vec2(.5, posY - .2), vec2(innerR, outerR));
  float shapeSizing = sst(.2, .3, t) * sst(.6, .3, t);
  s = pow(s, 1.4);
  s *= 1.2;

  // flat gradient to take over the shadow shape
  float topFlattener = 0.;
  {
    float pos = posY - uv.y;
    float edge = 1.2;
    topFlattener = lst(-.4, 0., pos) * (1. - sst(.0, edge, pos));
    topFlattener = pow(topFlattener, 3.);
    float topFlattenerMixer = (1. - sst(.0, .3, pos));
    s = mix(topFlattener, s, topFlattenerMixer);
  }

  // apple right circle
  {
    float visibility = sst(.6, .7, t) * (1. - sst(.8, .9, t));
    float angle = -2. -t * TWO_PI;
    float rightCircle = circle(uv, vec2(.95 - .2 * cos(angle), .4 - .1 * sin(angle)), vec2(.15, .3));
    rightCircle *= visibility;
    s = mix(s, 0., rightCircle);
  }

  // apple top circle
  {
    float topCircle = circle(uv, vec2(.5, .19), vec2(.05, .25));
    topCircle += 2. * contour * circle(uv, vec2(.5, .19), vec2(.2, .5));
    float visibility = .55 * sst(.2, .3, t) * (1. - sst(.3, .45, t));
    topCircle *= visibility;
    s = mix(s, 0., topCircle);
  }

  float leafMask = circle(uv, vec2(.53, .13), vec2(.08, .19));
  leafMask = mix(leafMask, 0., 1. - sst(.4, .54, uv.x));
  leafMask = mix(0., leafMask, sst(.0, .2, uv.y));
  leafMask *= (sst(.5, 1.1, posY) * sst(1.5, 1.3, posY));
  s += leafMask;

  // apple bottom circle
  {
    float visibility = sst(.0, .4, t) * (1. - sst(.6, .8, t));
    s = mix(s, 0., visibility * circle(uv, vec2(.52, .92), vec2(.09, .25)));
  }

  // random balls that are invisible if apple logo is selected
  {
    float pos = sst(.0, .6, t) * (1. - sst(.6, 1., t));
    s = mix(s, .5, circle(uv, vec2(.0, 1.2 - .5 * pos), vec2(.1, .3)));
    s = mix(s, .0, circle(uv, vec2(1., .5 + .5 * pos), vec2(.1, .3)));

    s = mix(s, 1., circle(uv, vec2(.95, .2 + .2 * sst(.3, .4, t) * sst(.7, .5, t)), vec2(.07, .22)));
    s = mix(s, 1., circle(uv, vec2(.95, .2 + .2 * sst(.3, .4, t) * (1. - sst(.5, .7, t))), vec2(.07, .22)));
    s /= max(1e-4, sst(1., .85, uv.y));
  }

  s = clamp(0., 1., s);
  return s;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;

  float w1 = 1.0, w2 = 2.0, w4 = 4.0;
  float norm = 16.0;
  float sum = w4 * centerSample;

  sum += w2 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).g;
  sum += w2 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).g;
  sum += w2 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).g;
  sum += w2 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).g;

  sum += w1 * textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).g;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).g;
  sum += w1 * textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).g;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).g;

  return sum / norm;
}

void main() {
  vec2 uv = v_objectUV + .5;
  uv.y = 1. - uv.y;

  vec2 imgUV = v_imageUV;
  imgUV -= .5;
  imgUV *= 0.5714285714285714;
  imgUV += .5;
  float imgSoftFrame = getImgFrame(imgUV, .03);

  vec4 img = texture(u_image, imgUV);
  vec2 dudx = dFdx(imgUV);
  vec2 dudy = dFdy(imgUV);

  if (img.a == 0.) {
    fragColor = u_colorBack;
    return;
  }

  float t = .1 * u_time;
  t -= .3;

  float tCopy = t + 1. / 3.;
  float tCopy2 = t + 2. / 3.;

  t = mod(t, 1.);
  tCopy = mod(tCopy, 1.);
  tCopy2 = mod(tCopy2, 1.);

  vec2 animationUV = imgUV - vec2(.5);
  float angle = -u_angle * PI / 180.;
  float cosA = cos(angle);
  float sinA = sin(angle);
  animationUV = vec2(
  animationUV.x * cosA - animationUV.y * sinA,
  animationUV.x * sinA + animationUV.y * cosA
  ) + vec2(.5);

  float shape = img[0];

  img[1] = blurEdge3x3(u_image, imgUV, dudx, dudy, 8., img[1]);

  float outerBlur = 1. - mix(1., img[1], shape);
  float innerBlur = mix(img[1], 0., shape);
  float contour = mix(img[2], 0., shape);

  outerBlur *= imgSoftFrame;

  float shadow = shadowShape(animationUV, t, innerBlur);
  float shadowCopy = shadowShape(animationUV, tCopy, innerBlur);
  float shadowCopy2 = shadowShape(animationUV, tCopy2, innerBlur);

  float inner = .8 + .8 * innerBlur;
  inner = mix(inner, 0., shadow);
  inner = mix(inner, 0., shadowCopy);
  inner = mix(inner, 0., shadowCopy2);

  inner *= mix(0., 2., u_innerGlow);

  inner += (u_contour * 2.) * contour;
  inner = min(1., inner);
  inner *= (1. - shape);

  float outer = 0.;
  {
    t *= 3.;
    t = mod(t - .1, 1.);

    outer = .9 * pow(outerBlur, .8);
    float y = mod(animationUV.y - t, 1.);
    float animatedMask = sst(.3, .65, y) * (1. - sst(.65, 1., y));
    animatedMask = .5 + animatedMask;
    outer *= animatedMask;
    outer *= mix(0., 5., pow(u_outerGlow, 2.));
    outer *= imgSoftFrame;
  }

  inner = pow(inner, 1.2);
  float heat = clamp(inner + outer, 0., 1.);

  heat += (.005 + .35 * u_noise) * (fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453123) - .5);

  float mixer = heat * u_colorsCount;
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  float outerShape = 0.;
  for (int i = 1; i < ${heatmapMeta.maxColorCount + 1}; i++) {
    if (i > int(u_colorsCount)) break;
    float m = clamp(mixer - float(i - 1), 0., 1.);
    if (i == 1) {
      outerShape = m;
    }
    vec4 c = u_colors[i - 1];
    c.rgb *= c.a;
    gradient = mix(gradient, c, m);
  }

  vec3 color = gradient.rgb * outerShape;
  float opacity = gradient.a * outerShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1.0 - opacity);
  opacity = opacity + u_colorBack.a * (1.0 - opacity);

  color += .02 * (fract(sin(dot(uv + 1., vec2(12.9898, 78.233))) * 43758.5453123) - .5);

  fragColor = vec4(color, opacity);
}
`;

  // node_modules/@paper-design/shaders/dist/shaders/liquid-metal.js
  var liquidMetalFragmentShader = `#version 300 es
precision mediump float;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform vec2 u_resolution;
uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorTint;

uniform float u_softness;
uniform float u_repetition;
uniform float u_shiftRed;
uniform float u_shiftBlue;
uniform float u_distortion;
uniform float u_contour;
uniform float u_angle;

uniform float u_shape;
uniform bool u_isImage;

in vec2 v_objectUV;
in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;
in vec2 v_imageUV;

out vec4 fragColor;

${declarePI}
${rotation2}
${simplexNoise}

float getColorChanges(float c1, float c2, float stripe_p, vec3 w, float blur, float bump, float tint) {

  float ch = mix(c2, c1, smoothstep(.0, 2. * blur, stripe_p));

  float border = w[0];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  if (u_isImage == true) {
    bump = smoothstep(.2, .8, bump);
  }
  border = w[0] + .4 * (1. - bump) * w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + .5 * (1. - bump) * w[1];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border, border + .5 * blur, stripe_p));

  // Tint color is applied with color burn blending
  ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);
  return ch;
}

float getImgFrame(vec2 uv, float th) {
  float frame = 1.;
  frame *= smoothstep(0., th, uv.y);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.y);
  frame *= smoothstep(0., th, uv.x);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.x);
  return frame;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;

  float w1 = 1.0, w2 = 2.0, w4 = 4.0;
  float norm = 16.0;
  float sum = w4 * centerSample;

  sum += w2 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).r;

  sum += w1 * textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).r;

  return sum / norm;
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

void main() {

  const float firstFrameOffset = 2.8;
  float t = .3 * (u_time + firstFrameOffset);

  vec2 uv = v_imageUV;
  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec4 img = textureGrad(u_image, uv, dudx, dudy);

  if (u_isImage == false) {
    uv = v_objectUV + .5;
    uv.y = 1. - uv.y;
  }

  float cycleWidth = u_repetition;
  float edge = 0.;
  float contOffset = 1.;

  vec2 rotatedUV = uv - vec2(.5);
  float angle = (-u_angle + 70.) * PI / 180.;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rotatedUV = vec2(
  rotatedUV.x * cosA - rotatedUV.y * sinA,
  rotatedUV.x * sinA + rotatedUV.y * cosA
  ) + vec2(.5);

  if (u_isImage == true) {
    float edgeRaw = img.r;
    edge = blurEdge3x3(u_image, uv, dudx, dudy, 6., edgeRaw);
    edge = pow(edge, 1.6);
    edge *= mix(0.0, 1.0, smoothstep(0.0, 0.4, u_contour));
  } else {
    if (u_shape < 1.) {
      // full-fill on canvas
      vec2 borderUV = v_responsiveUV + .5;
      float ratio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
      vec2 mask = min(borderUV, 1. - borderUV);
      vec2 pixel_thickness = min(250. / v_responsiveBoxGivenSize, vec2(.5));
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);

      uv = v_responsiveUV;
      if (ratio > 1.) {
        uv.y /= ratio;
      } else {
        uv.x *= ratio;
      }
      uv += .5;
      uv.y = 1. - uv.y;

      cycleWidth *= 2.;
      contOffset = 1.5;

    } else if (u_shape < 2.) {
      // circle
      vec2 shapeUV = uv - .5;
      shapeUV *= .67;
      edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);
    } else if (u_shape < 3.) {
      // daisy
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.68;

      float r = length(shapeUV) * 2.;
      float a = atan(shapeUV.y, shapeUV.x) + .2;
      r *= (1. + .05 * sin(3. * a + 2. * t));
      float f = abs(cos(a * 3.));
      edge = smoothstep(f, f + .7, r);
      edge *= edge;

      uv *= .8;
      cycleWidth *= 1.6;

    } else if (u_shape < 4.) {
      // diamond
      vec2 shapeUV = uv - .5;
      shapeUV = rotate(shapeUV, .25 * PI);
      shapeUV *= 1.42;
      shapeUV += .5;
      vec2 mask = min(shapeUV, 1. - shapeUV);
      vec2 pixel_thickness = vec2(.15);
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 5.) {
      // metaballs
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.3;
      edge = 0.;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float speed = 1.5 + 2./3. * sin(fi * 12.345);
        float angle = -fi * 1.5;
        vec2 dir1 = vec2(cos(angle), sin(angle));
        vec2 dir2 = vec2(cos(angle + 1.57), sin(angle + 1.));
        vec2 traj = .4 * (dir1 * sin(t * speed + fi * 1.23) + dir2 * cos(t * (speed * 0.7) + fi * 2.17));
        float d = length(shapeUV + traj);
        edge += pow(1.0 - clamp(d, 0.0, 1.0), 4.0);
      }
      edge = 1. - smoothstep(.65, .9, edge);
      edge = pow(edge, 4.);
    }

    edge = mix(smoothstep(.9 - 2. * fwidth(edge), .9, edge), edge, smoothstep(0.0, 0.4, u_contour));

  }

  float opacity = 0.;
  if (u_isImage == true) {
    opacity = img.g;
    float frame = getImgFrame(v_imageUV, 0.);
    opacity *= frame;
  } else {
    opacity = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);
    if (u_shape < 2.) {
      edge = 1.2 * edge;
    } else if (u_shape < 5.) {
      edge = 1.8 * pow(edge, 1.5);
    }
  }

  float diagBLtoTR = rotatedUV.x - rotatedUV.y;
  float diagTLtoBR = rotatedUV.x + rotatedUV.y;

  vec3 color = vec3(0.);
  vec3 color1 = vec3(.98, 0.98, 1.);
  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR));

  vec2 grad_uv = uv - .5;

  float dist = length(grad_uv + vec2(0., .2 * diagBLtoTR));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagBLtoTR) * PI);
  float direction = grad_uv.x;

  float bump = pow(1.8 * dist, 1.2);
  bump = 1. - bump;
  bump *= pow(uv.y, .3);


  float thin_strip_1_ratio = .12 / cycleWidth * (1. - .4 * bump);
  float thin_strip_2_ratio = .07 / cycleWidth * (1. + .4 * bump);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

  float thin_strip_1_width = cycleWidth * thin_strip_1_ratio;
  float thin_strip_2_width = cycleWidth * thin_strip_2_ratio;

  float noise = snoise(uv - t);

  edge += (1. - edge) * u_distortion * noise;

  direction += diagBLtoTR;
  float contour = 0.;
  direction -= 2. * noise * diagBLtoTR * (smoothstep(0., 1., edge) * (1.0 - smoothstep(0., 1., edge)));
  direction *= mix(1., 1. - edge, smoothstep(.5, 1., u_contour));
  direction -= 1.7 * edge * smoothstep(.5, 1., u_contour);
  direction += .2 * pow(u_contour, 4.) * (1.0 - smoothstep(0., 1., edge));

  bump *= clamp(pow(uv.y, .1), .3, 1.);
  direction *= (.1 + (1.1 - edge) * bump);

  direction *= (.4 + .6 * (1.0 - smoothstep(.5, 1., edge)));
  direction += .18 * (smoothstep(.1, .2, uv.y) * (1.0 - smoothstep(.2, .4, uv.y)));
  direction += .03 * (smoothstep(.1, .2, 1. - uv.y) * (1.0 - smoothstep(.2, .4, 1. - uv.y)));

  direction *= (.5 + .5 * pow(uv.y, 2.));
  direction *= cycleWidth;
  direction -= t;


  float colorDispersion = (1. - bump);
  colorDispersion = clamp(colorDispersion, 0., 1.);
  float dispersionRed = colorDispersion;
  dispersionRed += .03 * bump * noise;
  dispersionRed += 5. * (smoothstep(-.1, .2, uv.y) * (1.0 - smoothstep(.1, .5, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, 1., bump)));
  dispersionRed -= diagBLtoTR;

  float dispersionBlue = colorDispersion;
  dispersionBlue *= 1.3;
  dispersionBlue += (smoothstep(0., .4, uv.y) * (1.0 - smoothstep(.1, .8, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, .8, bump)));
  dispersionBlue -= .2 * edge;

  dispersionRed *= (u_shiftRed / 20.);
  dispersionBlue *= (u_shiftBlue / 20.);

  float blur = 0.;
  float rExtraBlur = 0.;
  float gExtraBlur = 0.;
  if (u_isImage == true) {
    float softness = 0.05 * u_softness;
    blur = softness + .5 * smoothstep(1., 10., u_repetition) * smoothstep(.0, 1., edge);
    float smallCanvasT = 1.0 - smoothstep(100., 500., min(u_resolution.x, u_resolution.y));
    blur += smallCanvasT * smoothstep(.0, 1., edge);
    rExtraBlur = softness * (0.05 + .1 * (u_shiftRed / 20.) * bump);
    gExtraBlur = softness * 0.05 / max(0.001, abs(1. - diagBLtoTR));
  } else {
    blur = u_softness / 15. + .3 * contour;
  }

  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bump);
  float stripe_r = fract(direction + dispersionRed);
  float r = getColorChanges(color1.r, color2.r, stripe_r, w, blur + fwidth(stripe_r) + rExtraBlur, bump, u_colorTint.r);
  float stripe_g = fract(direction);
  float g = getColorChanges(color1.g, color2.g, stripe_g, w, blur + fwidth(stripe_g) + gExtraBlur, bump, u_colorTint.g);
  float stripe_b = fract(direction - dispersionBlue);
  float b = getColorChanges(color1.b, color2.b, stripe_b, w, blur + fwidth(stripe_b), bump, u_colorTint.b);

  color = vec3(r, g, b);
  color *= opacity;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${colorBandingFix}

  fragColor = vec4(color, opacity);
}
`;
  var LiquidMetalShapes = {
    none: 0,
    circle: 1,
    daisy: 2,
    diamond: 3,
    metaballs: 4
  };

  // node_modules/@paper-design/shaders/dist/shaders/halftone-dots.js
  var halftoneDotsFragmentShader = `#version 300 es
precision mediump float;

uniform float u_rotation;

uniform float u_time;

uniform vec4 u_colorFront;
uniform vec4 u_colorBack;
uniform float u_radius;
uniform float u_contrast;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_size;
uniform float u_grainMixer;
uniform float u_grainOverlay;
uniform float u_grainSize;
uniform float u_grid;
uniform bool u_originalColors;
uniform bool u_inverted;
uniform float u_type;

in vec2 v_imageUV;

out vec4 fragColor;

${declarePI}
${rotation2}
${proceduralHash21}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

float sst(float edge0, float edge1, float x) {
  return smoothstep(edge0, edge1, x);
}

float getCircle(vec2 uv, float r, float baseR) {
  r = mix(.25 * baseR, 0., r);
  float d = length(uv - .5);
  float aa = fwidth(d);
  return 1. - smoothstep(r - aa, r + aa, d);
}

float getCell(vec2 uv) {
  float insideX = step(0.0, uv.x) * (1.0 - step(1.0, uv.x));
  float insideY = step(0.0, uv.y) * (1.0 - step(1.0, uv.y));
  return insideX * insideY;
}

float getCircleWithHole(vec2 uv, float r, float baseR) {
  float cell = getCell(uv);

  r = mix(.75 * baseR, 0., r);
  float rMod = mod(r, .5);

  float d = length(uv - .5);
  float aa = fwidth(d);
  float circle = 1. - smoothstep(rMod - aa, rMod + aa, d);
  if (r < .5) {
    return circle;
  } else {
    return cell - circle;
  }
}

float getGooeyBall(vec2 uv, float r, float baseR) {
  float d = length(uv - .5);
  float sizeRadius = .3;
  if (u_grid == 1.) {
    sizeRadius = .42;
  }
  sizeRadius = mix(sizeRadius * baseR, 0., r);
  d = 1. - sst(0., sizeRadius, d);

  d = pow(d, 2. + baseR);
  return d;
}

float getSoftBall(vec2 uv, float r, float baseR) {
  float d = length(uv - .5);
  float sizeRadius = clamp(baseR, 0., 1.);
  sizeRadius = mix(.5 * sizeRadius, 0., r);
  d = 1. - lst(0., sizeRadius, d);
  float powRadius = 1. - lst(0., 2., baseR);
  d = pow(d, 4. + 3. * powRadius);
  return d;
}

float getUvFrame(vec2 uv, vec2 pad) {
  float aa = 0.0001;

  float left   = smoothstep(-pad.x, -pad.x + aa, uv.x);
  float right  = smoothstep(1.0 + pad.x, 1.0 + pad.x - aa, uv.x);
  float bottom = smoothstep(-pad.y, -pad.y + aa, uv.y);
  float top    = smoothstep(1.0 + pad.y, 1.0 + pad.y - aa, uv.y);

  return left * right * bottom * top;
}

float sigmoid(float x, float k) {
  return 1.0 / (1.0 + exp(-k * (x - 0.5)));
}

float getLumAtPx(vec2 uv, float contrast) {
  vec4 tex = texture(u_image, uv);
  vec3 color = vec3(
  sigmoid(tex.r, contrast),
  sigmoid(tex.g, contrast),
  sigmoid(tex.b, contrast)
  );
  float lum = dot(vec3(0.2126, 0.7152, 0.0722), color);
  lum = mix(1., lum, tex.a);
  lum = u_inverted ? (1. - lum) : lum;
  return lum;
}

float getLumBall(vec2 p, vec2 pad, vec2 inCellOffset, float contrast, float baseR, float stepSize, out vec4 ballColor) {
  p += inCellOffset;
  vec2 uv_i = floor(p);
  vec2 uv_f = fract(p);
  vec2 samplingUV = (uv_i + .5 - inCellOffset) * pad + vec2(.5);
  float outOfFrame = getUvFrame(samplingUV, pad * stepSize);

  float lum = getLumAtPx(samplingUV, contrast);
  ballColor = texture(u_image, samplingUV);
  ballColor.rgb *= ballColor.a;
  ballColor *= outOfFrame;

  float ball = 0.;
  if (u_type == 0.) {
    // classic
    ball = getCircle(uv_f, lum, baseR);
  } else if (u_type == 1.) {
    // gooey
    ball = getGooeyBall(uv_f, lum, baseR);
  } else if (u_type == 2.) {
    // holes
    ball = getCircleWithHole(uv_f, lum, baseR);
  } else if (u_type == 3.) {
    // soft
    ball = getSoftBall(uv_f, lum, baseR);
  }

  return ball * outOfFrame;
}


void main() {

  float stepMultiplier = 1.;
  if (u_type == 0.) {
    // classic
    stepMultiplier = 2.;
  } else if (u_type == 1. || u_type == 3.) {
    // gooey & soft
    stepMultiplier = 6.;
  }

  float cellsPerSide = mix(300., 7., pow(u_size, .7));
  cellsPerSide /= stepMultiplier;
  float cellSizeY = 1. / cellsPerSide;
  vec2 pad = cellSizeY * vec2(1. / u_imageAspectRatio, 1.);
  if (u_type == 1. && u_grid == 1.) {
    // gooey diagonal grid works differently
    pad *= .7;
  }

  vec2 uv = v_imageUV;
  uv -= vec2(.5);
  uv /= pad;

  float contrast = mix(0., 15., pow(u_contrast, 1.5));
  float baseRadius = u_radius;
  if (u_originalColors == true) {
    contrast = mix(.1, 4., pow(u_contrast, 2.));
    baseRadius = 2. * pow(.5 * u_radius, .3);
  }

  float totalShape = 0.;
  vec3 totalColor = vec3(0.);
  float totalOpacity = 0.;

  vec4 ballColor;
  float shape;
  float stepSize = 1. / stepMultiplier;
  for (float x = -0.5; x < 0.5; x += stepSize) {
    for (float y = -0.5; y < 0.5; y += stepSize) {
      vec2 offset = vec2(x, y);

      if (u_grid == 1.) {
        float rowIndex = floor((y + .5) / stepSize);
        float colIndex = floor((x + .5) / stepSize);
        if (stepSize == 1.) {
          rowIndex = floor(uv.y + y + 1.);
          if (u_type == 1.) {
            colIndex = floor(uv.x + x + 1.);
          }
        }
        if (u_type == 1.) {
          if (mod(rowIndex + colIndex, 2.) == 1.) {
            continue;
          }
        } else {
          if (mod(rowIndex, 2.) == 1.) {
            offset.x += .5 * stepSize;
          }
        }
      }

      shape = getLumBall(uv, pad, offset, contrast, baseRadius, stepSize, ballColor);
      totalColor   += ballColor.rgb * shape;
      totalShape   += shape;
      totalOpacity += shape;
    }
  }

  const float eps = 1e-4;

  totalColor /= max(totalShape, eps);
  totalOpacity /= max(totalShape, eps);

  float finalShape = 0.;
  if (u_type == 0.) {
    finalShape = min(1., totalShape);
  } else if (u_type == 1.) {
    float aa = fwidth(totalShape);
    float th = .5;
    finalShape = smoothstep(th - aa, th + aa, totalShape);
  } else if (u_type == 2.) {
    finalShape = min(1., totalShape);
  } else if (u_type == 3.) {
    finalShape = totalShape;
  }

  vec2 grainSize = mix(2000., 200., u_grainSize) * vec2(1., 1. / u_imageAspectRatio);
  vec2 grainUV = v_imageUV - .5;
  grainUV *= grainSize;
  grainUV += .5;
  float grain = valueNoise(grainUV);
  grain = smoothstep(.55, .7 + .2 * u_grainMixer, grain);
  grain *= u_grainMixer;
  finalShape = mix(finalShape, 0., grain);

  vec3 color = vec3(0.);
  float opacity = 0.;

  if (u_originalColors == true) {
    color = totalColor * finalShape;
    opacity = totalOpacity * finalShape;

    vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
    color = color + bgColor * (1. - opacity);
    opacity = opacity + u_colorBack.a * (1. - opacity);
  } else {
    vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
    float fgOpacity = u_colorFront.a;
    vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
    float bgOpacity = u_colorBack.a;

    color = fgColor * finalShape;
    opacity = fgOpacity * finalShape;
    color += bgColor * (1. - opacity);
    opacity += bgOpacity * (1. - opacity);
  }

  float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
  grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  color = mix(color, grainOverlayColor, .5 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`;
  var HalftoneDotsTypes = {
    classic: 0,
    gooey: 1,
    holes: 2,
    soft: 3
  };
  var HalftoneDotsGrids = {
    square: 0,
    hex: 1
  };

  // node_modules/@paper-design/shaders/dist/shaders/halftone-cmyk.js
  var halftoneCmykFragmentShader = `#version 300 es
precision mediump float;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform vec4 u_colorBack;
uniform vec4 u_colorC;
uniform vec4 u_colorM;
uniform vec4 u_colorY;
uniform vec4 u_colorK;
uniform float u_size;
uniform float u_minDot;
uniform float u_contrast;
uniform float u_grainSize;
uniform float u_grainMixer;
uniform float u_grainOverlay;
uniform float u_gridNoise;
uniform float u_softness;
uniform float u_floodC;
uniform float u_floodM;
uniform float u_floodY;
uniform float u_floodK;
uniform float u_gainC;
uniform float u_gainM;
uniform float u_gainY;
uniform float u_gainK;
uniform float u_type;
uniform sampler2D u_noiseTexture;

in vec2 v_imageUV;
out vec4 fragColor;

const float shiftC = -.5;
const float shiftM = -.25;
const float shiftY = .2;
const float shiftK = 0.;

// Precomputed sin/cos for rotation angles (15\xB0, 75\xB0, 0\xB0, 45\xB0)
const float cosC = 0.9659258;  const float sinC = 0.2588190;   // 15\xB0
const float cosM = 0.2588190;  const float sinM = 0.9659258;   // 75\xB0
const float cosY = 1.0;        const float sinY = 0.0;         // 0\xB0
const float cosK = 0.7071068;  const float sinK = 0.7071068;   // 45\xB0

${declarePI}

vec2 randomRG(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).rg;
}
vec3 hash23(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.3183099, 0.3678794, 0.3141592)) + 0.1;
  p3 += dot(p3, p3.yzx + 19.19);
  return fract(vec3(p3.x * p3.y, p3.y * p3.z, p3.z * p3.x));
}

float sst(float edge0, float edge1, float x) {
  return smoothstep(edge0, edge1, x);
}

vec3 valueNoise3(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec3 a = hash23(i);
  vec3 b = hash23(i + vec2(1.0, 0.0));
  vec3 c = hash23(i + vec2(0.0, 1.0));
  vec3 d = hash23(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  vec3 x1 = mix(a, b, u.x);
  vec3 x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float getUvFrame(vec2 uv, vec2 pad) {
  float left   = smoothstep(-pad.x, 0., uv.x);
  float right  = smoothstep(1. + pad.x, 1., uv.x);
  float bottom = smoothstep(-pad.y, 0., uv.y);
  float top    = smoothstep(1. + pad.y, 1., uv.y);

  return left * right * bottom * top;
}

vec4 RGBAtoCMYK(vec4 rgba) {
  float k = 1. - max(max(rgba.r, rgba.g), rgba.b);
  float denom = 1. - k;
  vec3 cmy = vec3(0.);
  if (denom > 1e-5) {
    cmy = (1. - rgba.rgb - vec3(k)) / denom;
  }
  return vec4(cmy, k) * rgba.a;
}

vec3 applyContrast(vec3 rgb) {
  return clamp((rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
}

// Single-component CMYK extractors with contrast built-in, alpha-aware
float getCyan(vec4 rgba) {
  vec3 c = clamp((rgba.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float maxRGB = max(max(c.r, c.g), c.b);
  return (maxRGB > 1e-5 ? (maxRGB - c.r) / maxRGB : 0.) * rgba.a;
}
float getMagenta(vec4 rgba) {
  vec3 c = clamp((rgba.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float maxRGB = max(max(c.r, c.g), c.b);
  return (maxRGB > 1e-5 ? (maxRGB - c.g) / maxRGB : 0.) * rgba.a;
}
float getYellow(vec4 rgba) {
  vec3 c = clamp((rgba.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float maxRGB = max(max(c.r, c.g), c.b);
  return (maxRGB > 1e-5 ? (maxRGB - c.b) / maxRGB : 0.) * rgba.a;
}
float getBlack(vec4 rgba) {
  vec3 c = clamp((rgba.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  return (1. - max(max(c.r, c.g), c.b)) * rgba.a;
}

vec2 cellCenterPos(vec2 uv, vec2 cellOffset, float channelIdx) {
  vec2 cellCenter = floor(uv) + .5 + cellOffset;
  return cellCenter + (randomRG(cellCenter + channelIdx * 50.) - .5) * u_gridNoise;
}

vec2 gridToImageUV(vec2 cellCenter, float cosA, float sinA, float shift, vec2 pad) {
  vec2 uvGrid = mat2(cosA, -sinA, sinA, cosA) * (cellCenter - shift);
  return uvGrid * pad + 0.5;
}

void colorMask(vec2 pos, vec2 cellCenter, float rad, float transparency, float grain, float channelAddon, float channelgain, float generalComp, bool isJoined, inout float outMask) {
  float dist = length(pos - cellCenter);

  float radius = rad;
  radius *= (1. + generalComp);
  radius += (.15 + channelgain * radius);
  radius = max(0., radius);
  radius = mix(0., radius, transparency);
  radius += channelAddon;
  radius *= (1. - grain);

  float mask = 1. - sst(0., radius, dist);
  if (isJoined) {
    // ink or sharp (joined)
    mask = pow(mask, 1.2);
  } else {
    // dots (separate)
    mask = sst(.5 - .5 * u_softness, .51 + .49 * u_softness, mask);
  }

  mask *= mix(1., mix(.5, 1., 1.5 * radius), u_softness);
  outMask += mask;
}

vec3 applyInk(vec3 paper, vec3 inkColor, float cov) {
  vec3 inkEffect = mix(vec3(1.0), inkColor, clamp(cov, 0.0, 1.0));
  return paper * inkEffect;
}

void main() {
  vec2 uv = v_imageUV;

  float cellsPerSide = mix(400.0, 7.0, pow(u_size, 0.7));
  float cellSizeY = 1.0 / cellsPerSide;
  vec2 pad = cellSizeY * vec2(1.0 / u_imageAspectRatio, 1.0);
  vec2 uvGrid = (uv - .5) / pad;
  float insideImageBox = getUvFrame(uv, pad);

  float generalComp = .1 * u_softness + .1 * u_gridNoise + .1 * (1. - step(0.5, u_type)) * (1.5 - u_softness);

  vec2 uvC = mat2(cosC, sinC, -sinC, cosC) * uvGrid + shiftC;
  vec2 uvM = mat2(cosM, sinM, -sinM, cosM) * uvGrid + shiftM;
  vec2 uvY = mat2(cosY, sinY, -sinY, cosY) * uvGrid + shiftY;
  vec2 uvK = mat2(cosK, sinK, -sinK, cosK) * uvGrid + shiftK;

  vec2 grainSize = mix(2000., 200., u_grainSize) * vec2(1., 1. / u_imageAspectRatio);
  vec2 grainUV = (v_imageUV - .5) * grainSize + .5;
  vec3 noiseValues = valueNoise3(grainUV);
  float grain = sst(.55, 1., noiseValues.r);
  grain *= u_grainMixer;

  vec4 outMask = vec4(0.);
  bool isJoined = u_type > 0.5;

  if (u_type < 1.5) {
    // dots or ink: per-cell color sampling
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        vec2 cellOffset = vec2(float(dx), float(dy));

        vec2 cellCenterC = cellCenterPos(uvC, cellOffset, 0.);
        vec4 texC = texture(u_image, gridToImageUV(cellCenterC, cosC, sinC, shiftC, pad));
        colorMask(uvC, cellCenterC, getCyan(texC), insideImageBox * texC.a, grain, u_floodC, u_gainC, generalComp, isJoined, outMask[0]);

        vec2 cellCenterM = cellCenterPos(uvM, cellOffset, 1.);
        vec4 texM = texture(u_image, gridToImageUV(cellCenterM, cosM, sinM, shiftM, pad));
        colorMask(uvM, cellCenterM, getMagenta(texM), insideImageBox * texM.a, grain, u_floodM, u_gainM, generalComp, isJoined, outMask[1]);

        vec2 cellCenterY = cellCenterPos(uvY, cellOffset, 2.);
        vec4 texY = texture(u_image, gridToImageUV(cellCenterY, cosY, sinY, shiftY, pad));
        colorMask(uvY, cellCenterY, getYellow(texY), insideImageBox * texY.a, grain, u_floodY, u_gainY, generalComp, isJoined, outMask[2]);

        vec2 cellCenterK = cellCenterPos(uvK, cellOffset, 3.);
        vec4 texK = texture(u_image, gridToImageUV(cellCenterK, cosK, sinK, shiftK, pad));
        colorMask(uvK, cellCenterK, getBlack(texK), insideImageBox * texK.a, grain, u_floodK, u_gainK, generalComp, isJoined, outMask[3]);
      }
    }
  } else {
    // sharp: direct px color sampling
    vec4 tex = texture(u_image, uv);
    tex.rgb = applyContrast(tex.rgb);
    insideImageBox *= tex.a;
    vec4 cmykOriginal = RGBAtoCMYK(tex);
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        vec2 cellOffset = vec2(float(dx), float(dy));

        colorMask(uvC, cellCenterPos(uvC, cellOffset, 0.), cmykOriginal.x, insideImageBox, grain, u_floodC, u_gainC, generalComp, isJoined, outMask[0]);
        colorMask(uvM, cellCenterPos(uvM, cellOffset, 1.), cmykOriginal.y, insideImageBox, grain, u_floodM, u_gainM, generalComp, isJoined, outMask[1]);
        colorMask(uvY, cellCenterPos(uvY, cellOffset, 2.), cmykOriginal.z, insideImageBox, grain, u_floodY, u_gainY, generalComp, isJoined, outMask[2]);
        colorMask(uvK, cellCenterPos(uvK, cellOffset, 3.), cmykOriginal.w, insideImageBox, grain, u_floodK, u_gainK, generalComp, isJoined, outMask[3]);
      }
    }
  }

  float shape;

  float C = outMask[0];
  float M = outMask[1];
  float Y = outMask[2];
  float K = outMask[3];

  if (isJoined) {
    // ink or sharp: apply threshold for joined dots
    float th = .5;
    float sLeft = th * u_softness;
    float sRight = (1. - th) * u_softness + .01;
    C = smoothstep(th - sLeft - fwidth(C), th + sRight, C);
    M = smoothstep(th - sLeft - fwidth(M), th + sRight, M);
    Y = smoothstep(th - sLeft - fwidth(Y), th + sRight, Y);
    K = smoothstep(th - sLeft - fwidth(K), th + sRight, K);
  }

  C *= u_colorC.a;
  M *= u_colorM.a;
  Y *= u_colorY.a;
  K *= u_colorK.a;

  vec3 ink = vec3(1.);
  ink = applyInk(ink, u_colorK.rgb, K);
  ink = applyInk(ink, u_colorC.rgb, C);
  ink = applyInk(ink, u_colorM.rgb, M);
  ink = applyInk(ink, u_colorY.rgb, Y);

  shape = clamp(max(max(C, M), max(Y, K)), 0., 1.);

  vec3 color = u_colorBack.rgb * u_colorBack.a;

  float opacity = u_colorBack.a;
  color = mix(color, ink, shape);
  opacity += shape;
  opacity = clamp(opacity, 0., 1.);

  float grainOverlay = mix(noiseValues.g, noiseValues.b, .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  color = mix(color, grainOverlayColor, .5 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`;
  var HalftoneCmykTypes = {
    dots: 0,
    ink: 1,
    sharp: 2
  };

  // node_modules/@paper-design/shaders/dist/shaders/gem-smoke.js
  var gemSmokeMeta = {
    maxColorCount: 6
  };
  var gemSmokeFragmentShader = `#version 300 es
precision mediump float;

in mediump vec2 v_imageUV;
in mediump vec2 v_objectUV;
in mediump vec2 v_responsiveUV;
in mediump vec2 v_responsiveBoxGivenSize;
out vec4 fragColor;

// Image
uniform sampler2D u_image;
uniform float u_imageAspectRatio;

// Canvas
uniform vec2 u_resolution;
uniform float u_time;

// Colors
uniform vec4 u_colors[${gemSmokeMeta.maxColorCount}];
uniform float u_colorsCount;
uniform vec4 u_colorBack;
uniform vec4 u_colorInner;

// Effect controls
uniform float u_innerDistortion;
uniform float u_outerDistortion;
uniform float u_outerGlow;
uniform float u_innerGlow;
uniform float u_offset;
uniform float u_angle;
uniform float u_size;

// Shape controls
uniform float u_shape;
uniform bool u_isImage;

${declarePI}
${rotation2}

// 9x9 Gaussian blur on R and G channels
vec2 gaussBlur9x9RG(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = max(radius, 0.0) * texel;
  // Pascal's row 8: sum = 256, 2D norm = 65536
  const float k[9] = float[9](1.0, 8.0, 28.0, 56.0, 70.0, 56.0, 28.0, 8.0, 1.0);
  vec2 sum = vec2(0.0);

  for (int j = -4; j <= 4; ++j) {
    float wy = k[j + 4];
    for (int i = -4; i <= 4; ++i) {
      float w = k[i + 4] * wy;
      vec2 off = vec2(float(i) * r.x, float(j) * r.y);
      sum += w * texture(tex, uv + off).rg;
    }
  }

  return sum / 65536.0;
}

float sst(float a, float b, float x) {
  return smoothstep(a, b, x);
}

void main() {
  float time = u_time;

  float roundness = 0.;
  float imgAlpha = 0.;

  if (u_isImage == true) {
    // Image sampling (UV scaled inward to account for padding)
    vec2 imageUV = v_imageUV;
    imageUV -= .5;
    imageUV *= .95;
    imageUV += .5;

    vec2 dudx = dFdx(v_imageUV);
    vec2 dudy = dFdy(v_imageUV);

    // Blurred image: x = roundness, y = alpha
    vec2 blurred = gaussBlur9x9RG(u_image, imageUV, dudx, dudy, 10.);
    roundness = 1. - blurred.x;
    vec2 texelA = 1.0 / vec2(textureSize(u_image, 0));
    const float k3[3] = float[3](1.0, 2.0, 1.0);
    for (int j = -1; j <= 1; ++j) {
      for (int i = -1; i <= 1; ++i) {
        imgAlpha += k3[i + 1] * k3[j + 1] * texture(u_image, imageUV + vec2(float(i) * texelA.x, float(j) * texelA.y)).g;
      }
    }
    imgAlpha /= 16.0;
  } else {
    vec2 uv = v_objectUV + .5;
    uv.y = 1. - uv.y;
    float edge = 0.;

    if (u_shape < 1.) {
      // full-fill on canvas
      vec2 borderUV = v_responsiveUV + .5;
      vec2 mask = min(borderUV, 1. - borderUV);
      vec2 pixel_thickness = min(250. / v_responsiveBoxGivenSize, vec2(.5));
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 2.) {
      // circle
      vec2 shapeUV = uv - .5;
      shapeUV *= .67;
      edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);
    } else if (u_shape < 3.) {
      // daisy
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.68;

      float r = length(shapeUV) * 2.;
      float a = atan(shapeUV.y, shapeUV.x) + .2;
      r *= (1. + .05 * sin(3. * a + 2. * time));
      float f = abs(cos(a * 3.));
      edge = smoothstep(f, f + .7, r);
      edge *= edge;
    } else if (u_shape < 4.) {
      // diamond
      vec2 shapeUV = uv - .5;
      shapeUV = rotate(shapeUV, .25 * PI);
      shapeUV *= 1.42;
      shapeUV += .5;
      vec2 mask = min(shapeUV, 1. - shapeUV);
      vec2 pixel_thickness = vec2(.15);
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 5.) {
      // metaballs
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.3;
      edge = 0.;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float speed = 1.5 + 2./3. * sin(fi * 12.345);
        float angle = -fi * 1.5;
        vec2 dir1 = vec2(cos(angle), sin(angle));
        vec2 dir2 = vec2(cos(angle + 1.57), sin(angle + 1.));
        vec2 traj = .4 * (dir1 * sin(time * speed + fi * 1.23) + dir2 * cos(time * (speed * 0.7) + fi * 2.17));
        float d = length(shapeUV + traj);
        edge += pow(1.0 - clamp(d, 0.0, 1.0), 4.0);
      }
      edge = 1. - smoothstep(.65, .9, edge);
      edge = pow(edge, 4.);
    }

    imgAlpha = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);
    roundness = 1. - edge;
  }

// Smoke UV setup
  vec2 smokeUV = v_objectUV;
  smokeUV = rotate(smokeUV, u_angle * PI / 180.);
  smokeUV *= mix(4., 1., u_size);

  // Two swirl paths: inner (shape-masked) and outer (free), each with independent distortion
  vec2 innerUV = smokeUV;
  vec2 outerUV = smokeUV;

  // Vertical displacement \u2014 applied independently to inner and outer
  innerUV.y += u_innerDistortion * (1. - sst(0., 1., length(.4 * innerUV)));
  innerUV.y -= .4 * u_innerDistortion;
  innerUV.y += .7 * u_offset * roundness;

  outerUV.y += u_outerDistortion * (1. - sst(0., 1., length(.4 * outerUV)));
  outerUV.y -= .4 * u_outerDistortion;

  float innerSwirl = u_innerDistortion * roundness;
  float outerSwirl = u_outerDistortion;

  for (int i = 1; i < 5; i++) {
    float fi = float(i);

    float stretchIn = max(length(dFdx(innerUV)), length(dFdy(innerUV)));
    float dampenIn = 1. / (1. + stretchIn * 8.);
    float sIn = innerSwirl * dampenIn;
    innerUV.x += sIn / fi * cos(time + fi * 2.9 * innerUV.y);
    innerUV.y += sIn / fi * cos(time + fi * 1.5 * innerUV.x);

    float stretchOut = max(length(dFdx(outerUV)), length(dFdy(outerUV)));
    float dampenOut = 1. / (1. + stretchOut * 8.);
    float sOut = outerSwirl * dampenOut;
    outerUV.x += sOut / fi * cos(time + fi * 2.9 * outerUV.y);
    outerUV.y += sOut / fi * cos(time + fi * 1.5 * outerUV.x);
  }

  // Smoke shapes from swirl fields
  float innerShape = exp(-1.5 * dot(innerUV, innerUV));
  float outerShape = exp(-1.5 * dot(outerUV, outerUV));

  // Visibility masks
  float outerMask = pow(u_outerGlow, 2.) * (1. - imgAlpha);
  float innerMask = (.01 + .99 * u_innerGlow) * imgAlpha;

  innerShape *= innerMask;
  outerShape *= outerMask;

  // Color gradient
  float mixer = (innerShape + outerShape) * u_colorsCount;
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;

  float smokeMask = 0.;
  for (int i = 1; i < ${gemSmokeMeta.maxColorCount + 1}; i++) {
    if (i > int(u_colorsCount)) break;

    float m = sst(0., 1., clamp(mixer - float(i - 1), 0., 1.));
    if (i == 1) smokeMask = m;

    vec4 c = u_colors[i - 1];
    c.rgb *= c.a;
    gradient = mix(gradient, c, m);
  }

  // Compositing (premultiplied alpha, front-to-back)
  vec3 color = gradient.rgb * smokeMask;
  float opacity = gradient.a * smokeMask;

  float innerOpacity = u_colorInner.a * imgAlpha;
  vec3 innerColor = u_colorInner.rgb * innerOpacity;
  color += innerColor * (1.0 - opacity);
  opacity += innerOpacity * (1.0 - opacity);

  vec3 backColor = u_colorBack.rgb * u_colorBack.a;
  color += backColor * (1.0 - opacity);
  opacity += u_colorBack.a * (1.0 - opacity);

  fragColor = vec4(color, opacity);
}
`;
  var GemSmokeShapes = {
    none: 0,
    circle: 1,
    daisy: 2,
    diamond: 3,
    metaballs: 4
  };

  // node_modules/@paper-design/shaders/dist/get-shader-color-from-string.js
  function getShaderColorFromString(colorString) {
    if (Array.isArray(colorString)) {
      if (colorString.length === 4) return colorString;
      if (colorString.length === 3) return [...colorString, 1];
      return fallbackColor;
    }
    if (typeof colorString !== "string") {
      return fallbackColor;
    }
    let r2, g2, b2, a2 = 1;
    if (colorString.startsWith("#")) {
      [r2, g2, b2, a2] = hexToRgba(colorString);
    } else if (colorString.startsWith("rgb")) {
      [r2, g2, b2, a2] = parseRgba(colorString);
    } else if (colorString.startsWith("hsl")) {
      [r2, g2, b2, a2] = hslaToRgba(parseHsla(colorString));
    } else {
      console.error("Unsupported color format", colorString);
      return fallbackColor;
    }
    return [clamp(r2, 0, 1), clamp(g2, 0, 1), clamp(b2, 0, 1), clamp(a2, 0, 1)];
  }
  function hexToRgba(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map((char) => char + char).join("");
    }
    if (hex.length === 6) {
      hex = hex + "ff";
    }
    const r2 = parseInt(hex.slice(0, 2), 16) / 255;
    const g2 = parseInt(hex.slice(2, 4), 16) / 255;
    const b2 = parseInt(hex.slice(4, 6), 16) / 255;
    const a2 = parseInt(hex.slice(6, 8), 16) / 255;
    return [r2, g2, b2, a2];
  }
  function parseRgba(rgba) {
    const match = rgba.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);
    if (!match) return [0, 0, 0, 1];
    return [
      parseInt(match[1] ?? "0") / 255,
      parseInt(match[2] ?? "0") / 255,
      parseInt(match[3] ?? "0") / 255,
      match[4] === void 0 ? 1 : parseFloat(match[4])
    ];
  }
  function parseHsla(hsla) {
    const match = hsla.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);
    if (!match) return [0, 0, 0, 1];
    return [
      parseInt(match[1] ?? "0"),
      parseInt(match[2] ?? "0"),
      parseInt(match[3] ?? "0"),
      match[4] === void 0 ? 1 : parseFloat(match[4])
    ];
  }
  function hslaToRgba(hsla) {
    const [h2, s2, l2, a2] = hsla;
    const hDecimal = h2 / 360;
    const sDecimal = s2 / 100;
    const lDecimal = l2 / 100;
    let r2, g2, b2;
    if (s2 === 0) {
      r2 = g2 = b2 = lDecimal;
    } else {
      const hue2rgb = (p22, q2, t2) => {
        if (t2 < 0) t2 += 1;
        if (t2 > 1) t2 -= 1;
        if (t2 < 1 / 6) return p22 + (q2 - p22) * 6 * t2;
        if (t2 < 1 / 2) return q2;
        if (t2 < 2 / 3) return p22 + (q2 - p22) * (2 / 3 - t2) * 6;
        return p22;
      };
      const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
      const p3 = 2 * lDecimal - q;
      r2 = hue2rgb(p3, q, hDecimal + 1 / 3);
      g2 = hue2rgb(p3, q, hDecimal);
      b2 = hue2rgb(p3, q, hDecimal - 1 / 3);
    }
    return [r2, g2, b2, a2];
  }
  var clamp = (n2, min, max) => Math.min(Math.max(n2, min), max);
  var fallbackColor = [0, 0, 0, 1];

  // node_modules/@paper-design/shaders/dist/get-shader-noise-texture.js
  function getShaderNoiseTexture() {
    if (typeof window === "undefined") {
      return void 0;
    }
    const img = new Image();
    img.src = noiseSrc;
    return img;
  }
  var noiseSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAADAFBMVEUCAQMBAf7/AgMD/wID//7+/wT+A/4FAmYIAqIKnw7+//4EAisEAUgGBIYIewkFVhEJjAoFAuEFA8GWAv6T/gz+AzER/25z/wu1/w1nAggL/049BQUC/y39BrckAQQp/wr+AZYNOvx9AQkN/pELUvMFaAZTBAgIRgsO/7cJNQT+YgkLwRELIf5O/wlP/v79/q4IGAYLK4+kAQ1tAv4IdMpc/4xNMBF2/lQN2vTFAws9BLf9/3kJJgsMRF3+HwkLxfv9BVL8BHEN/9gMsg7cA/13/vv9OAqWA0sOofP9TAsIe/4FQqoF4Q/aAgsQwnKQAwa5BP0JW21NqgmY/f3Z/wkI7whGjAr7oAkLrGGf/JH8jg4zAj4R0Qr+xQ8VZv1Y/8O6//wfA/5bAT79/lQ1AGn8egkKdom0BgYOsfjtBAVDBoz9/zG0A238P/tsbQ/+A9rIig/HCEtvIgrM/1lwBWgIlmr62Q5qA5FndnEIXa+PthUMrqiRfw6SAodE/0cQm6UOirP5swuMCrEOjvo/dBVSA/79KvCgSBL9M1E/TwjUag/e//2WdPZ2TQ9ZMvfPxRD7aPpmOFqXSPu3pww5B/wR00wTgVf3y6dXW137ffv3c7GNj/icJG+4xvYQ61++CZOVll8p//uXzgyTKg6m/1L47w3cAY8EI1T7xvgKbkr7UsGBJPNsB7xL2wuvd5z3svmDmgipcGT8jez8oP0R6bNYuVpUxRn9LZVkqIijYxK7K/dZBtjH/71ZT/1myfz52fVm2WBfk0vxUFj+Vfv9/9plbfz3yl6VUl+flbNijrpfpfz5TZSGRKAI15X14pSt4vwQKMHOTQlKifz1sKW6A9u2A7R65waprffGcfeY/8iyUsFh3rn4lGERMUHJolveAs+PBdb5iZFuX8S8SH7Ekfe8Lwy0t5cLwsD3s2TzbHXa/478nLtNQ6NtstW15QvaKgr25FJm4vyXwFlPInIPId79dUr77fmr18BGdLHIS/mGx6dKw64L7v6k32XMJrWl8ELA3C70AAAgAElEQVR42gTBCTyUeQMA4P97zIx3ZjDvHGaMYQxjhhm33BGTY8h95sodkaNkXVGhKGdUri+SIxQ6nG36VUhS0rnZ6tsVfR2ibKlta7/d5wH7kMaTxlOVozEoHgU29/ayNC9YlrZdyVT+Lf/dAsDDc/xfzX+MLBa2LK23goK0aXhCxZ8qIAdXYj+c8zviDOtRkhEtRxNajHWLuCtdcfQqV2mgRlpDD6wJpKpBrGON27qa4nNeQOU8ViU0pZ2eCMN5mWO7bfR17Q9ItpsqgZJNJcJSq6cSWiV4q1zIDMmkqzAdpqT8gI5G3qm3YEyliPPG9kiwF7P99ghNn7zLs9EXFvFdLmlOdKBAp2ZyGTcI4JuBPYrWyGCYwgFwOhTmHeYC0zEDSp1iX3W71cqoW332M++OAYJUrEySVX0c5lzmDgLcAQ1yFVVOgQ5l+j1k6TEBidTUek7OF4T2kDYo2eVGwOrglKyGBXYyBrxFv9ptR16B+BJ0IFCsryJve0ZEuzNjLeEcw/0aK/kyku6JW0BiicnCBFptKAQRRNRrtmUV/YOn6GNMHXddsFf1YZCHMnFWgcyp2gnLOWTTBcVQVvM/FTgJAHl0NWHHzL0eqzuRXTDCEO03DoThV3kezhrtpNqKW0Bb3MSSAJMmmVnLEpexS8JrmYOr4KXz1cUmByty3N/sbEzBSP8tfGSCJ3caYDhymsPdGbwO4HAl/+PYDCZNf+H6kofkNk4N4Zn6NM4y1lJD7Tt2gyklnrR48dgbfHXgd9uzHvpamm3wKhcaLcawXWxL5T97dL7MeW3aZ7NDWksVZyZv8VQyjm94CDU7UjtbedqOCvB2DdE+wFC6a5JcEIgkKRJ8cfTGmW/2jMS5LEWWKiGY0BFaDNQ++2+sOifPMQ7CcHeFx+PPpcbzRoy4IKmVwHg/1842BwoGc2qlRVoNjCF59oXsrcBgVEP4u1GIX7jshIMqqPdbGTRJzMXcyyyiNG5fr5qFrUVntrktt4QdJugkr1kzNJCK1roWpTraix9JVMpZcsxGYsJlGiSyEgOFZzHy6YVlilnicmxUVkdX/PetzMBk92PNJNkIaLhmA30XPCrMuncWxOZK9kpLnqpYOOsLFFmaf2Mk8OH+BbwPH7HBX2KGI0Ns80gleH+Y6k0YZcF0sWgpoJA30BBbG59XaKyBHoxFtc2p9sFvyXqo2v2aRKN+1HLPshCibfZESAESYsLXmz3tT4wNMp0Wali+VPN93JIJaQ0AcXGrNMnSS0YASPcaNh32NhO0sWHKPhrNVpCBzyk4EWR/PnmKE+3s2cDO+YF6OddPNx7G4AIrZBPldw6tcss4bqzb6hBy6ccf3YaBSNRBFELueRFp7DXWNMFVAT9J1LNTntEyEI2gJS64oyKMKvSRrbpPQGE0rEEmHyqCl2oQravq51FwJXG0m/pPdRA6Xp3sSLdwGwNytaLg3g3VEE2eFESy/GijQPwmYPjwJT+bH/ax0dNT0NZAFQxyIqKzET00vUDuJ+T25QGCclaGZiJBxsjtz3YMZ0PPsq751h0ldwbZstMgHfnauk/7n1eZxEmYIPf5wPt0KJvg2V9bcYWGgua/Lvn/xG5q98tPLcGzHaac2+Cbs3niyPtGgfYgBT2OHgxvhGxzApoPxPoCOtUNCXX+ojW0ug7DOuyrOOG5GkWhaAzx6ZyGE8qbCPS1oxzPjcWSrG/ICNaNMKsra8bIlQVvmRQ/FY4WiHhnrVz/VfdOiOu6u66gG3NKogJ/0rGdbC+iPN1pbZ4HQAZODS+mC2z9dNBqSzd6mTQWKq+EI3fXgJQdqfqz6jY6Fbs4sWT/QkaLUOBnMhWRmSdrpTy769BcCql1UOmaqtFbDA9d7qEox8Lpa+TPXX+xm40jrB7EBK1lwu6IMud9xh7NBZCbq6PNN/QdTu0BVa2neF+s8b1dGns5tMGxQIP/+fiY60jZNp9n5D9MLm4NLWO2gXVG4xwDXHeHXMFEAITOVUGJRoBUwOV3miiTEPPzLrwDm74zFsW9zkfCASQvPi2RaF9qJ2HHWMJNxCHzDym6tNfXiEe28ZnjmHVGwlSvfgBo4afqcoTh4NNq7QQ1KrPJW+1uHEK1VvTghGa0DAePo8D6D1NCYgEPY239D/RQSUMxWJsAIi5KEp/3/9LH1wSTwl8/mfekwWyIhAwMPErzWxVSL7sFnFT1NqJ+Zb8hX4cqwyucXdUVkaqNeVL7abNtJV++aASn/d+Fw9qlVwplz4SqpVw5CBK7nq483nxbZ8p/8TtFwr8oD5uhq+lxfovd0x4+MHo1Wv14SJzqBo9Un1KCZ8NWfbA7jLeoMjnCcS8bjtKuxii0+0RPZlLS6NdhNKHeN2NSdCswa+K+aGFUTD9MLW9R7mhPT5i88TZvV5rWtuek07W/vBev9eJznPGkM8FrCZ53AB8+Ig7vKms99yRb5fpyoQssijTwz0i22O+HvjsjyGXpqseb4t4j6YW86PfJF2cnjmy8EKVF8sIomGUdVGBquOIDIlHsrgPkJEzw7KovqHB/kS+NPgs9nG9FkG1MJiA0GNwTyj5dRS0uiWTfSLf7jpL0ioLExajL/OJPkUbA6CIdKjpU6XrSY/6mE5Z1IDBoHX7tGx9fFkJZQPrPIW49pj9oUEykkiolzaein8mBh/C/0eAzYoFXHWJxYZWrv/ayPmcWsjfWyDy8ndnmPTldcJ05MaxOoIHWPcND2SOan44Wc1Oxyk59KHbiXwbrxB3qvAEA+Pd3zc3MkDFmxjG3K4ZxjHHfFXKNI691kyRLjmRCUmTQWnQo6XS8JNFBsTkqiRQpijalraTe1VPbpa1394/4PM+naUIl5jb9OQw4tXHsFyAoD/x8vmlYJu23hfowcTnJOXSMUdKum4IqKUd4HJguRiprd/Etw9K/NJ+UKE+T2v39ms2JRGhtNDxShw6kmZEdsr6fwVSzZUCgj/xK8CaD46MMqjtVmEE0DTPS7yo7so402lkAAr5A9TA8YbapYO+4tLHK+uBAqCsdrmkNB/tSNQxgrZRiBjhVSt904TQbBmEDW36UhZEwZN9TbWh1vtrLVYdkQKayJHgjO5aVftyaOhbtIVFjq0gImWcFJbXqPp+aGTaOzHzPptvWbli/tEz5BHs2WdU4y01sOWIdG+CPWbxSDnQ/KbYgddG1ggtPPUFvXeLdNH2EoslAveJl8GUVaLs6WWsoo3G2Q8KnvSkrNV13rJm4fF2jG2NKE3FMgjWPyCyVVZXDxk0WKQyzIcdGvhovfXwvS237WZN3PvX9Dh50V1CMuemc5AkPWBJzzlg8giqz/M3mICBajNsO3PSuByw3zV51gCTybHlfu/R+zXwVekhzN1C0gZCgqc3x8EUR5Mt8LndPRv3AbLnf2ZMLJ2TZBapthY8hSsIET5/vpH1T7/l1IKZl4pTp2eMVFT8J+1JyElnizM32GmBQTaTDJOwuvPCV3QDonD/6xjwgR6SA92MF+v+Xlo/BDyOZJpkM7QFh73uKxzX9hlDol/x5HVESyPM/HNyF6MwCg866UWXm9Jd2xsjrXyEKgjl11K41nEwzFzjyP0V9T87dStAustB/MkOwBaQoOCNG0+6dfSw2YIL2d+aAFbtewoPIATWJC+6il2nDFDx8Vlxg2a22oZG4My48gnrQEcDxOuE71wz51mkfvC3B8gjF04baNRpg6SGoHIAc+zB2Qqqn9yEzCXfpmpdN2kxdkiMQ/W/X7iT/RzkpBGvlGrx2Bs4pl3s8Akl3mRTsubk3x+CQH47r1ZNgECzf7IP0nV8lRUj1XqsW9+wNI0+oAx/lOGVsHcmalqdAqT/Rb+rp3wthEPxjXI6irxhTZc9U20OHSbYAJCX6MKHYW/P8XRlyam7KHfk5VTu8Tmebd889NmQ7hiuPb6bQu8inM/FOXkO7iEWd9hgyBVEErR+8P+Om2lFcXGp8DGe734LHfS2Pk7/pzSwPvdrkd7/NgVo0V8s5ir4NYME0CzGbOVoiygQKh+vexBN5PkUBa1bYInKhFqBi7f3FP9xdy5wmH5ByEL6YmlsN4H+lvQJBG8TSvwBmhcGUafV9uPlIYlkx7S81YuG+rzfC3Eb07PGLSnvKO1ujlkiGMoliWkYJ6XYpHzhP4z5odeImZqKxZT1hFN+arPz5Dw2e00ODXsBCGrf4jB+45ZT7UrN7VBRUYgrUJx0WkxNyMCSxRCIYwgyqxP8Zv9VC+6aiUgB0eIt08YI0fh2ZFRqSilUuRRvmt5jejdoSCjfaRFSca6RXh9kVAjX/OeC8Fbgdo+Ffx9K0zF8p4sLEk27kG2vWNThL82M/h1BScI2Kr8fOKkYdh+WXxAYVPhsD11sx5SDIEyx5CGwE1cQ3osdYdlEP3/AZPwvH8oc1WdqXU/OM6fdPELtY9JRSNHEepmC3ZWgsLZss2H2qwq00xxA81SAexVdwbL1ektQlJeVMZAGObIMXLK5lkb95dhjMzkc/Lq17iiAPa1uAovfIZZLe/kaNzRCUCr39gjN5YW18DwBEKdQkVriaJc5BKEHi5s3DEMukQIe9bStXDHyciJ0Xv84FSgb6OW6WuhFqtyjdjWTw/jt87MnpqzC9LTP5d6vqhMo3Y4u6dwfNAzL++6ah0G8ahltlcWiZPeGtcG104UJ67f4QMwOqq/jMIFw8leQ9VsbOhuOtjYqx9cXIaiBcng3fueAQPIz7hl+NJ2ltWAECQIyl81LAaRwlbECUyuuxtH/i/nb25kFilIsdm9q0qzIVxbO2/dyBPwsOdwI/A1NIhXctIgDDfKCMOLIhEHXE0TYiDRDEMkzWtQ9aBbO3WRIhTdI8MGpPh+xE3SEvZM3TsaSkSwo8aIp7vcBPSpNIUWc9dx2ihGIUfcCMA6h6H0sgzlYo2LzwzsSBG/vPLUKBRAIDClNo2hylJMPNHUF6/FyCi7vsPpUBU5f1Zryco/9dyqeIEYzdzRL4fhRqyDTW1lv0jlQjuBtfaUaKBPI7Hr/G7RcawKWd8xytCCHq0tGrABFlLf+tFnXvcFRUS9SdsaU+DOI67yy47KiS86yVHnkbvbnhw7R5+QMX6efQ0ueOVdVkKZ5o+0GzRYPc72WXnZ220/EEPvQ2mJs9umccvaJ9JQDlWujkWdH+bCuOl6OBriPwtt/6D57aofIHy0JVbraWRZDo7xiUeThF4JL+APjur4ftrBDOoDbMmJGGRvnl0iv71YPgcPgMSa8PT1ZvFkRgx3zPM6BFff0dTJbRNIHNd92hlQTTuYNVd2W6Pu7Myx+NgVOiFPeih7aHHc/Dn2tVtPIQZTLWhr1BSVJzNpZo72uzoDQW1D6KG7aCPz+193FdMxFtZ/hYE8idJqfsq7jHo6USnTep5tp8D4LWtSPqIJS9+U4cc8Ym8lJ94wuv8uj5DlIsflhtItJUoeNhAnkdEmUMIsLbGt6thjaw5suLGIwXg96aII8ttrigpcKpcdmqmOegLraj5h8AAQj+90zF3YhqscELTAFaWZuUAQMThYiUb/FNHAlDUttdbQAyP0iCmwvBlXj3bwwGkEZxh7Y8fY1TB+UUdVfjDXKAaoLYaWGWCmVzzxQxUQK7wSFq7btNyjcmKx2vXgKNSocDI3W0q3gacABoST1YfO0NC0OZ3VJ2PUAwXIcsOj7fJ6GGGw3hkT0GAMOIASUuHGB1NI2BNAAuhQtFj2vT4FWOBwA8AZQCJQw8v+fPYq97G8tFNng/7Ieg+y8KHAcI5wACkQOUMBG9bgUsiYNGzPHqgpWonRw8Fzw7aDForw4oGUkSvQQ4H18ev2sHhEVc+aMCAykFFh8LmGKQVJKhIlOdALmkAKIDBkf5txoCxwKdUAz0ToWOJaUGAeneA3pOjwFyZwApO7V3akpwjkl8oyOFoQqEjYfUC0cBHVCoAzuMMH42EggBKSJqxhsQWwBEu1doBqQKAktnbzMzwTSck8w4yPZwGjYeKiAjDxSHIz0HE3EjHAUOAk5RLXQHqIsOrysqUAHM8BmGZRVNw6Mi1QOeAQRaLLABABIkQAM0yABTbYCxYAC+HWBJ00xdN0r3YZU7ubbjAi0CrjFHxLMzaNEjFLz+4ScStCg4r358a5kbAtifbaHcTY18qVrMIdEEISdanHgWFdkBnM8/SEkTKfoHaS1aNTmZvNwAflsqqgZLAjBXyAMFyrIpbAVGV6oAKrCcPqAr45KYS/sfi9mObGiSlB0D+wALckOOCGOriDK83ywNfxUfTw5tHzwDGiJaJ4SU9holF5fx3X6qZhsRAQeNjT8E/kvHIKvUY1sAUZAea4Onlj9sE68EoEUB458HLCDmAB8MIw6JSiQAN73SPLEOfGU31KMYEYrTousmiyRtBTQ7ClaT3ANP6uFYKL84ahsIP6ssogAAK2ks+AYESgB6V3UYAypGWgKVqngClwwJ4MMim9fqCAHJWh0U5DQ7OVAdSk8dtdOMDCrNkgSBo/c0qyIuBDEFbkh0SUHxE+47GQEo0sga4YD6zesDkgAXwjKzLArVShiyFFWSYXkS3iSlNQsBUb4kAQKUESNv4bFLCMoBtfxJAAAACsmEpW4PjIM0DDK2ZbpZmBCz6FoZBgXsbtnLKab9EAxgAVmSeUimBgihp8IvMSfWAwTyz2AE0IhEJxVzmmrwNT0PncoCGQXQtXwua50xk3uPDI1DfqKHdklTBVYAioGcInu/CGIX1GcrkE1cTAHQHxBAprY2Ib/AxT4WBxZveQAd5CwBQsaMPgkdmgYbVQpqCW6JAP29BmFQDW+aDAMuXCMvfT9WrGXn00cmaaaXZvgDOV/4nwXQKgfTiEmisC6eemBCMrpfiElpnHRef3auBiVEA0qLWeFLEAUBBa5BCblqmQV/CgAZ1UEFS2EgCvpyuAMpGyc9BVooZsCBADmIoACXkboDAEwGNNmnABevAQcGNhceIVFDux3uWIIEPQAsjr5l1g8ClQpMAwJsOVsOFi0Uvq4cDl8PEVl0AAdaC6mFaVQiDNeeA9ECv47hpTZ7Qk1VRRwbdRax8vFXryTiYolAIwprBlZ0pa+KKl5wBU1lQRMCjFIw0l0YdXYDC6i9MgDUC6kp3+A48fLH86hBDQILLQBhZJ5hWwInm3QIHgYZEWvbV70xWqoFLAPERDLK4HM5/cWVKbX8bAMEE7o/Am2aue5ZF6OcLqqvVu8EC6f8aJbYBZOWXW5xKyBANEqjA6AskyIoAf5MBQGnKBpoPTABR+0/oFUHAU1VAKsOqV5NYgBBHwZZh1rUncwDCp7sSWwDQTYKBQdpCzmIrMgNN5QDEbEvW2QFgmmkKFOns0WDQamWLPHDNVGTniIfRQ5HqfKsg8Uue/ER8pZHd+ebUSOm7KgF63WiTIhrWg6oJYgEMYc0LhWELTvncXdcgScC3S+BnrjLYYsZK1PXQ4GJZugCuQAClGncjGcMCJwGMHx8c7mRwoVCQAMJPQO/MQBbcs68Zz2lDQgs/R85PVvPAzRJwGkC7MYIF/UDBRoHd1GhwYuAEoXDO6sFqIIUr3wOHGmZFK1zH11Bh8iGFWc8HgEoQwXvQRxHJDEUBTF/AplEfWUmWSMJpiEUvAcghlFGEQtETwA/BxQAeDBBt1IYKa4cADo6WpUuAAMg0w4DBroB1hgTiAJ/RN9REX0qcIM3Fb7b2AEEm+mOawIEXgFg1ne8ByE6fvMKVpI3IjdsAQETBiWUmjZGDQhjQTF8FgldAgNRNiACM16kCBXhkWoUp+4SP+hEEghL9k9wZjlmc6scT6cUqAASj5U5aTAbAwOEl3ICCG25JR4ffsEKYfUNKIkoY2UMcAkXDqEhrGQ2b2RrqaXjAx81CAUWeXVrAI4mGDm6bXtoAwYVMi4GSk5PUVtclscH8gIhvXQ9UiUA1unQH3gHBwkwq/5SRAaUD0GYbE0QL2MAiQbzlasuGxcYAwE0vhmvfgAe3CW/9BQfAiZ8Tnxx5COM3BRtf6U+K/tpYA+lJQO+LQPteW4WmCHRYyCQALcpWAIX8w0S5CQPI1seMBmCcEAegczCb/8FJpCzbAWD3H5NorMaMENXbcyM+SqnzMa1KAA9KRESUQB+C5mbhqFe5lVYhRtCGAK/a7AxcRIgu2O0PwDuLixjUViaEgz3FA0zqDci2tBRCSARPgRBM/NkGRlZeCFnHlEiyaQrgIgQyl66REcXNJslVzwimlyANCOKfrhClEyKOdFL7hiibMlFBQQg1jaLPAADCPz3BFXbRsbE1+oiTTkKCl8XnvRMQbUbRUgqR+ICSw/lJnACx3kIAhaIfB8W/BnkAGo4MoPAYEEA7RTnB5Sg3RinVnQRBQYS8wR+CaYzXT07BdYMDs8Gu44ABtULIyJHDl9wejIEAGo6jg0VoCpEOI0/YewzCgIzcEmGYDY8+rhtRfEyZQblSwUeDSI/X7sFhPM8FQbc4nCqKe0BtEIkeVqJcscyajxYOUfpyk2ANDYfAOmZD6zJTRSBDpgL/N5wnUqyClKcYB05MI1UBooALCvUhuAcyf9sJiv8GyJRzX/IQQCyC3ZBSzwcO9sXB4AIlRE2vh0HBpcF5grsAQPnqAA7obcALildiZ92TM224bdMmAwPQINWrPd+RCgHJxgDfwMv0YKRlEBHJnpxkJytDXXpANUtIEdWWmUSBAcJCSPkZZ0GEy8MDKof72cdh+oTQjqaLH0McSmDa3cQnJ6lQ0N/+aitLGabIwgrEzCvmmp/o49p5V0GNlRLPRbu2UehI31oa8rgCQhEB6mYuZpU0KMCA2URBW47L4EFCEEgFz8IC8xlQBN3t0iRJY+oxFKsIMEPAMBxbQZ5ChYjF24zfKVBA5UGcHmAAsQ3Zgwn9mMueQ53L9/rahkcB2PJEpl5AIasYhP/UBsSETYp00xgawArAIQDBEgPegICAY7xP353eEuT/Ty9fCWnKMRFNQQACMlLA661MINMsM2jlS7bJr8GyFo0bmasanYGCDqsgIONKQqkAGeBYAkHowDYzhhEM59lCAFQLOH9SCzwQAl9AQZI8AdUPFsoFXJbAAEoFp1vvyL6CQ8nDsdymYQNX0B+FM0EBi+IBmIX5R0i5ed+S0/eRBB2EQBmGBUDWLTLNyEHJKJOPiJaTmkSDpwQNgYCGQqA1LUHqtAwOYMi/of0CMIHTBipAIYEO2MKkkC1BQPDFD4Ax8nmll9bNkZ7bmwv1wIH6qkQQndEHQYPeXxUrLUnE28cVsctUWoZGjYVKWe9VAI7RFHZnmsoBWVmYD4xTWNtGZ9wFawr+wAASdAIf6sAjAbfucWuRAx4jNliQHDSAII30QYUYqZ4xSGTct2+WT1bCnw+AJcbNXKKSE8ZFR+fPATWLFkeHQcVH4CxT9sDtA1cAFADBk8ZBBaRRpJovyFHBAEoMwPaXYvvOh8bfQxDvxShtHKe4KQeeg/AXhcIJKBkjxwgXgB+PCAtPifdTwusJGdXJibqGQzCPyySkBZJpz9En7iGYiCX83wDeQbt1TdkV6IAAGxhL0wERTmBBzESBRUdFRMctnmVblQLazgBAsJXtHhcHCclXRoeywgpDynhVqyFWAZBYTWCEviIXzaHwMxdN05xDT5FAwDkBC0TbBYFo2ssKCNOTQkodAEG0uYMXix5sMvSBZxfQ3Egc5k+AjwvJQOEN9rFpuYXv4oFPCULWRr5AKprOYWuCATtAAlKBrcGkIICAd6cnwxqtl0lfz/5+hUR6q/mHdbFA68Qz8syO8Gibp8LetHFNF8tRAV0bEYORkJhTRQFxAMdPwUJMicmXlQKBmMsZwKoAMA1DGAAEQEnMhcBtQZgNggLxcHiAoCFFYEMAd91E7K+4vHKXBbOfJrOAG1E1YEkqxGsNwUr0w0pR2MitIQ5BlqXAA1atwMCSgBYnTuUtAxxNg0ApC4fgrhL7D5sQQM+pLcGg2RmHwIZNZPGC/cI+3Dbb8WlBSCJ/uO2txmjCBULLyHgqeRjEBLnACxYAkBvBQE2owNsMXy0kzWqADm6Oh7HbSK2kQ53AIoKAFWwN02IAuhiBIQgP30OBTUCcpQr5T2fJjB+bUd/2g5Go9sMv5CrnFlpfAWsi+mamCLtIz5VFsBrbb4AM42rGna4cyoQ2eMO3z8NN8BeNKCKBQp3jFrOL+zqP9WWCQukQGBjmPsTAChybv4zgnVctaQ+ynQlaFQJtTPSxEAsRLwRAK0pStgs2M0EBQtIBmKomNWHKHU1uDIsAg2kEHvlUc5/AgICJ34VcpskFZHSgGFydLhFCo6nCXFfWXgIGgY6R9CKIkFdswK6euK1SRkYAxdXV1Z+9UWpQQOzIqloZy0FIoAZfxX7FAEasEKHC04pAAbnGP4CkFFkEZniWC3xBD13ADNArAFjkW8nICQKAOvmzBI8y+QwMBUgcrY0WJdtSxl0hFiiptgP3hDTlmpdVwDTCwZ0BDrZS0eTQt5GALQLQQJcPsQNOkguZZwCIMTEeadTAyR+ijoz4Qo4VzZZAAAlkSVs6VUcZJepUq0Svzx14BNIbWLpMC7XFJGvfVpoWr+cAI4twmWi2I9wqgwAaiwDPtB9E7z2SlYSA4hvaKQ1nAZ/MnZ2kRZ5P60FIq16lCYDVwVsKAx1BqPRgzsOZvKTPIoBn9kCKTDuDtMFqtp2nRYWNRw6ZBc0MvZ2DYu0CLhiWBeCK9jSZwBQ2CySAafnVwKo3rdJXGWGUQv5gHlWsQQUAFUmWXi4AQNX/oqvEnkEUKG6tlZ9QkzDT1jLpmR9fWCg4wByAi0AWeNCBgYJ12ItvmMCNwrVZkYzcU5GBs8aT0XcqZ04IN6FTgQuL9dZDbIa1W0ER64dUb07oB0eE80fZ8/do84xBFGBcwGbppkJq530TW9GuGMsjLJLNAWrBU0KAKYedUoDH3QB0iGTAE7OOxuOVL8BIAMPUxKLA7HUBjHBHEQvFD87HYE40ZqAAXEF3+EI/FQAACAASURBVAA5VAcYSqwlTR4TFY8AFHwtHQXQhYMABwj490xjbrxCQRY1FA0MBmQdfy8KK5JQK5jIhiNb0AgjOAP7zB0TqcsihQUwRXSdVE4CD0RhWQx6EEYLhhYAeoE3P05iEwbgIiTEHEUiq1SOJcmGFl7Xv0dlavCgAliw5QDiemOUAuaucf5lhTXGhc5AoiqoZFu0WZDr+oQYAoJy3YAB2FsNETiWuCXLoc1tIQasfWYAMgQUTgYARFslHwpiRDUs1hBRoB0bQ7+s0NKTRd1E/RCeHiCeUK9JN5EAdJfznAEq8htHb5ADuUQCf8tY/UgQKaRCDSYrhAiA7UateS9WPksK2cYTfUrVpCTmA0SUrFBkXh0Am/veTf7P7Lb4DU8aKbKXz0zdwW3XchzRimAwkx59hHaKO2GnMbYaFW0YBYkNxWp1SEXiNNCm5g3DNIMgtw+ShZNpOpYq/Q8AswmkIiOEHX99N+JMMAC+JKYI7yrXvJWhZgcNbtz2wQA+bk7APAHTMxnOjSWcrcbzX+OZWahITJEaSlVq6X0QGs2kD7jsDlU8ixd3KQOKAgHdAVMANmNMOIuMjEusSjd7Aw4HHBUmlmJgCkxWYk4Veq5jVQ9CFDiuddoVjHF4dDYARDwtTkEhkSROFdWSdDsWaCj4BExuaA8OTiCxBNJIORyAAoMOTk1iT5wDLiZJBrs7VV4uAKKQCxESEKAfymPGhzOP0pVhBGA8ol5iCxpyOoZZFCJJRRXFTm8sA7PfEnuAEgFx0kBskwNQZhyzMLaesB4SdgBuQAKmhMetRhYAICQAP7EL9S9J8rk7xDAYgIxMIlDWBG0DAW8BYAdGkayHGwwrAi4b/r5sA0rCezgdXjtnijaFR5eSBAz/aVQ+mggCDxmYem6hDQtN369pqjuUEgAYD0BSUCT2CaA0BkkSSiDM6jOEQDOFjTDiIQAVX1TPI7bMwK6hF1sFT16bBoFTnVAAFcgndTYODzc/52xpHRZyNxDDkQBPhGMNhklGAbYDJLs3NFGGnC8lCpbuAl06ZWbRM0QQJgfnBAVVCyqR6L9SLIHQDAVNGpYiAIc1AJk8AIAA0TfDOzNArLrhf7hEtVMnMAEBCT81VCmAL7wJ+AKFpQS0Xx0tbQDcQgEJZzcdBW4AOQB2yAAFEeGWwhWAatIHABBbsCfCPlQAikYBjxdYEHgjNAUNL8OWdGkAXgMfOQDJ05gDZyTItT4pIibKF7+xXSp4Shfkxy9Vylsra8P4h50uKHAGw0KZJbkH2GZs1xvMPI3ddzg1sNxcsWHdA6IsCN0GeRJtVDCuDUWwaQAlQj0Ad2Ca6wMJA8+cfEoKOwP0EoXGHg6EdQUZaed7cUveOVMeswMfGy++GDwFsSsb6S9ehSIqVZF71JbZh6LBFLIRDiAACUrQGh3yN1sIIYIkUOeTKl1MTeQYCiMBFATQgh+ynTsCSAOav9AxNUF/AClE0gY7BIsUJiVNABBFJRT2FwgAslkF4mtM9lMDI6AGHrsDBEMhcPQBAnwmdg8o7YkIzxJYkJ77A35vQ2M8AOfeGivv6N1CumQj+RUGPQOXLeEAqgIp1Ig6o3nGdRl8PTUJyQFDEAJ/KNdr3gkIBywcNHDoiAfNW0CHClyw+AbbsU+ruOwbBAncmpU0WePmFgtJd4UAHD+zLgBSQQAugirUKWA8ERwyAjfDPLchDh3EdJRQgbHANWS4bDX2QWzJ2mJZh18YFTBxVgJsBe9gFSoE7VZXKLlzBo5G6q7l1hLxmQMMA6MLWH9PJUb3QgGZC4SBAx0BINreFj822QBjNwMgk00EK/kAtPUvcwxhc8cPRQBSsLgAbRwSGiMBLa5gDN0OekNWCnc1aV9sqeReuiznCC+PLMjJAh4xhq9iAwgOI3IvvyBg2TibaC5IlpM0Lkp8BdcGL9/LB3D9u3oJVwBZDSkkPQIITsjVS5NtqzukBoSUItLaLUeGQlRph9bxmRwAOCK8upGsTd/aP9AhFkwjBnErDQYAAT28k+5LG8IaPTLcvCciEHIbDW8PS3F7ZABuCV2xjgQ+9MHk5jktIvwbTCddCpWOGVBD4QIOfa+MURkdX70FKoRNAA08ttApUKfTq7tHm6YZAJYNRtEWHxgn4AKWIzQrKipAgSK8tk9aOQpky24DUkQGZnVQoRUBP0NDRI/UwgIAMfAoEBSLZDEgLRO1Br6SV38EF7rXIx/JAQ8E3EALBQcSgN0AFFDXMM+Lcw4EFpWDb2knRW/mRYYdfAUdfQLwWhkUCJQyms1ksgTMpHhbAHil+gEBS7anHDTwiRpCrmULHlgkaWl2VL1GDsrg1apysgeLQcKytiGpZUOcDMqz7zAAQwIiuAc+MjjuBK+JmoanK95NcXD4JyZd2Nh5dmU8IRLLDQdeCTYLvtBn6g+P6dw9JTYeVpoGi4ogu1N/K1HYkQC/YBpZAtrEZABeIfY1qIPPzFLFqQ4DDANRwxLNOQFjDca2WfiWsYh/pDePNz8H8AwduiJsSFkTWQRoen8WGw4Ahh81nyQBP5AGhR0E26ZwQ6DHcrwHTrJhA8yogTgLH9PiAFsgFGUJZgB2SLsyWzN9ASa5CB0yXwEJCam2WKEPNT54YlMBn+0OZwAdDwgEA9SnqxNDFoEDQT0NGaOFEHRADFm8F23JWUQQGhMCArWvLhNCfHChBBcNC6QNK40boQEAO+lRHA2CUxLhZyStpJ7pkDc/Cj5S9VMYHgC1PkR/KyVZmwEdKqJACDEcjSYbdxq+AKHVJUhxUMLPdHUdbAACCP33H9UAA8AELkYySGs1NZFvoAsnLu86CBTGMDtrpS3xOIHVHOVVSwUjxA3XFS3diDMPLbOzB9k7Wc9QwVJ5rhsB6E8S1AAGLXom2BIGMhblrl1bFXIYjQSmRiUtBVEKRbNsx4GKS0NiJC+HPpi9LQ76mjyf6OVwqBcGUmYEXgMTd2A6HWqzv7eGEQxBjkcBU/NVLCeshKpDLHJlq2tKGXeSSwFCJS0yAwEd0QEQYULiWW5o1uMgCv2UbVQVInoFKCv7FzYEEgB+31t4HjUs6mheCcGtRwxkMsMlBBHf1b0ADh8dZLtXOJM2kDUSjgxbWZmpAjISVgRbC4sCJugEjdR31gAp7hMAnkgTM5YXSQOZPGsHOAKwefkwknwPEBMqfn0NhJUI15ICbM0TWmmseAWuYeBQiaoWCRAA1AKbxAo92wPXEUQw7wDfnSIrnG4CGV3YXaBnPavwW4OXApQBfZxDwQ1iC6MENCEJAOKZqDFUARg48iFDTDLhNwWjqH4WHAE7PALJFQV7EwMBmYl4Mx4WDqsCAVgA3AQC/Ncp2LMA2aotBnxeNApPDKe9EVSiGS9JMEtKwJUIlwMUDac5oIEPRnapEikLMwAhzQUgJ3QiA/CiOgqWe23hYA0ZAglKDSQZOAEOC72KBJoavjfOPF3IWRciaEYtEzhLKwC2bklkNZgpRwI6WBtPAw+npsDsD6wU0TJ18JCbBy4aNIHPCstFAhRbFzkDOiYSlyULWoWJuUmHMaMPQhe5B3kbXkVL5bZfW0cOMzb+WAAAkGLfDwBkZAAVpGI4umrpsOchSIGKAzcBIjSXoBNokAlDLAFxFpsCbPTQTw5xswgtiyR9QVUGBDzWTAaVDqEAbCsATiO9za1IUezkU2NfcW/LHFaJ0Z8ACSpJVAV9AnL57hOjBs+jBFaPVyvne8dqLUfbF8GOEKVCDVsBLgxdJgBoClkAqUMmZS9cZrUUCgko/DTSHhYGPC75Dm1CIhnzGV44TgJ57DncEMTOEBWMAIEzFCASqi8BMQDtz2WwAChwVFEFYF5qEVJU837Uyx7fUGxE1YBGgu1N0nEsGiYBARCJGiv7nw4CCctmfyoGrnruhwzdwJUyHQMCWypq8T6caAAE20uVHZAlymbvOgSEAwDthEIcfAVjEQBvBRkXkhxrAm2ikI8RNt45FNuOoFokRRdegaaQOtexKJK1HiUAJWEDJgZz22IINjqFaReWG/QEzfsCRBPGyDdYRgcCrzIksE9ZRSXiAdKtH2VYAuzuqgMa3rADi5QGUH9vDzLeOQIEWwAJV4ubXVPDh5EkEzIVBjBkdMcxmAdVxQcDjxzkZr7HeTUzAQ3p9AaLaZGNHWb007EKkvOzc+9NfzgpIllL5myLFbQLygM4XgYF1J2Tvk0uFwIOEtlkSmFFA/yLJ80NAoMAXcbeHgxwl1jcouxbixCh2lPHTFx3qtaG2fp20wrwOgAL5yMrCgRJvQQtg38vXwf6doIW284PZBpHpsBJPzedw5AHCAEMS7YabRQzbkW6L7ndADPqNCkhAZiLdAMYfiZIPOYjGAwGD9Y6vGuiItqzLShPPJ6nT1V7ZoqepyOwL/dvFVxifBwAiHaMARYTQUxgAgACKxRvBh4kjk4AAwUq3gAAEeZC8yAMw5i22C0+GDtgBDwBXg98AwkROUA8S8YCBF903leViZjUa90cdTEOBrwDXHw1Bg8SIAD9EsSgIQwFDEcasGfBcl/3AGhtMD6YjLVaO7gLSl0BA32wU8o5AecqKYOtbh4BdQNIjo0geknWgXWS7wGzHxZ0A3NqHQEBcwCtNqlyt+c0AOkASngGAApBSYNSsGARwxoqz0NA/ggLh2AmkXEAlkauySUDu3QbBNpQUzkdYm+uYokbAjUmTZkCjHh5Zg4uAQ1OY2Z3mUl9vCwNoKYnFjSlbmiP4RmPUKK7eZ0DPgnn0ZqDmJDuA98yAQ+aL1PCSm9NBjcyE3BMmwCmEOyvBOilD8z03gZJS04dEK5yxwBKUnLULgA795xy0+1MXWEPe0MSTWdOSllnH4JfHofxViJmgMVAnbIMYSY+wAUMGScQ1g8AYqARnwEBAwBI5pMFeFOj84MHBNMeuweIjvkDExPKh9omslGCSVgAiN7YEB44Qpp2LiBjPdarEADOBIQdaOdMeA1XMJ8TpvwQ2tGMe61kiAcdEAoCrtBNJ2/Rhs5WfILCBiM/lIG64B5EVH5MfuQS8x03Za2ACu7cEw7NMQ8fIgA9EhYzJYmjV4svwhdqDI+guRTTWvBAXB1UdpDG1QI4DIY3NMjq48cHAg/PbAeQEFlY8rE5ClIACwBx5RxSJp0jQxFhGENVSjUQBQw2iMOKTHxkGjWS9SnbArELcrY0rwyMZT8ShykQV+FwUJMuUgaIWSeyRBZdbRACRCCiiSAml2AEGGImDUh7HGwsHG5KaxaGKsADQ18qC6KJsaYtDUsAATMPnDFfNa8EAH09YH2HsN5GykhFWAxNkwAGCSh0Vh/nMSOlhmUY7RVMBADQmDc6QPpXOVQoBbAMOyECuunUyxPgsQ0ETnBwRXQBAD4Z9IYX3tRMpbUBBbEOtydiCAIYue+9ssJjHgR/2AeVIIGbAmlLYUymQyRwZQTXBlCWmgNl48hVM7QSIL0CdJNSu2lFnk8fiZUZPRFODQCEH0ExjxJKSHJHTWlhSvJmIZZqczI+ADBfRQ6D4Q78UtkAAwsBw2I4MWsZlxhDLwD/BwD4WAUGCne4shiGGyeronSUAQXP5UkAOZ+BfwIRRANQS2eyNSEDcP67cPQAAA5dPwTl5Eg5FHSFGiQZF6BZBxttv2GoyEQFB0xSNBUW/EssG1aRABX0L0oXTk9w9P/nm+ZVMmhBQhcIGxhYOHHoHwNzJldxFQB0KHapYgBDkY+WKIQBBS3cJQYOvmYAR0qKAE8GApuhVQDTKawrE0mPBQG0gt28GoU0YHBDwfqHHhjbkDpoSWVWA6kEs0e1jAIvmkyegpM6G1IBXUzELwUOM2kAISwmADRsQ0MwYxeYL/A6RQABzliwKBgSK4MIxgogDTzGA86dDMa+XUMCLkazOuVDGApvbCfg4CQac2iJU8SvkQMoMrD+PQICV+oinEEdBm0iJT4MyAhTZgFYEnkWnG9xn0y74ilvXe25Jbli4UIJQAJDDjXiA4QDDSiVdiMi/rXIbh7VAPAPxA4UU/bFj9kDQwQKkZtHAlmRGwAt1n4c5uKmg4kORgd5WBq/V17bNiFuAu4AXIauVmwyb1tJ3gLMkljMvYJpCGEM79RBkhofAX06o1gaLwLwTDaMDQEFuzw6UlE9ASVc4VhyijlwMBC8q5TXBwY+MsgHe0VJoAJjlgAUvh8zAAcyNgUYl0e7u2JdGR5GbEOPBQRZBIQBZnrZAvJGzYKVQg8nTwskXgRp1hvgBRwEizz0V35fMqtosBADNwJ5EsGJBAriES8rADV+1ohgBwcBL3YBFAiISgIAAaiaHtpdDgh2Oj1Dg8G1gzdxdGkYQwW7CQCTNDW1GGtT5qJptqfhAAM2bhqP/YwZCWvDU8wVZmt9qQ2yMo6+KHLZ/dslAgWy5BanAIcBnb5hcjI7WBZ6AqTuASP9LHZRiHh0WQ1dJzgqMXGNqSWF7duSohXEqt3EAck4ZwUVVX45ChZEIBYeFnpOC5wPIwA/Gt0cIcKsoqTJPZ1UTRMBWA9OMqWcK8/YAIvfnzBhEwXifwgthgYgEecXBAsQZSVfVQ0ER3w4TgE8iE6ZEIwoFTYzUwGwt2El03Wp4Q2IALsOJnVYBGZdKCUBwQAqAFqlQEZJRbtrwqcgXlIIUx2NcEShuvIBbgq0XVCNBAKhUT4JQB/OBgqIf3FzY6V7OyKAOAoBASg2GU9GAA4AfSMKojG0m5gyqAe3MXWTUgDAAgxFtBcbx3gCmAYBRCEIaWdBmXYDgQdPhQMSeVkjt+IFTuC6Ij8N8+cIOhMxFvN0DJU7rf6eCTpJ9QNR1LoQQQMgEY26fApxVC5HOGr9sKU9GORpdSRjAW4rUEs3GgRFo9IJvYmKIxn3EuAwADMMjc+dCqyePSGpQbkhEXoVHwb9SJ5eMR3zbXZ4JW2BqZVw2l7pIXRrAhSAEAVRS84yK4rNO2l2wNVcCFW7FQwbADpohDhH+ALV5AgD4rQpGReMQ9tkmLIzbxPPHStlIdXCbS1hCEj4yktcH8cO9QspuSFFc2sfFMjhw8WBfwH4AL00SwUDOthSQB54xEsG0i0ACE7WuddaHtLJZxcCSUEYrDRF7xRceFE3AC2x0k8HnShj+8mn1AICDQvHh7yrNLLpdSMBOF7XG0MIKTpg3XePZSgxj4EUDQW6ERczAmkHACMqRzp7jwLBHE1J+9rgGE0jMKR9eAC3iUeONakBJAvMALJ5jyVnHDpo4HcqIQQqJDKFNBhoGQpAAb6m34tpMCwA0p2et1pv9wIkr2yOkSgpxQLKc1IqDDsWJgQWiFnICOdG5B2pQ1FQEqBk2k0FSQ8oLkFGe38tCE61lDAABt0AMaACES7m5uDMWkOQJp0/Hg41dp5mhRNyv+xrYjkRExpXAACXB7ToUYIOVBcRGpltVbe8OYgfXFsByY4hGhkpkyoB7hcF6K0uvEqfZ3griUwBA1c/lD66CQFPcuK8UwRxQHrjeyZEa4w1vRQqYTgxzxgQEhpdGRUUHRNnf4vqR4ObYGCWlrtDMwhWI0ZhExohPDYcfbYDowruYrcukRU+j0IGABZOTatOWA6DbwRHWnODFRc4PImVa24k7ATGb0kbQpcSsL4YFbkgARWhBHl6vFpBPRSyVmOdTmIXefPQCLgLUWUpNV+MAwdW3p10p0eu5BxC504BVIXy9c4JWFeJA2BjBxPZAnIBVQAZhQU1ADH4DjnMGeNHLOhzGY0L6yQtbYoXAJyb6u1PF7UZ5yAt4JwGYldYBd0VembYLQBnVTpvhSA/ckID5KwqDCHKBp0YAiR0oOcfXFD5GQY+oUJH5JqHAR8UBB9QqIcTPwQDE/cukJsaOVIbAuUBaxEVKvd3i2+Q8BAfV8nGOwKY/DtMAgkLMOnoHpCTARcGXgIUhPyYDnVrAExDQSJ1gGIMGgtYAytm5mAuUxtoB58TXTtv6wUAa0NdRSmbkMUEc15QPzEmWRQCSiw5cA1VoRQfWtxc+T0F03kr1T9b7QirrbwAXiw9TpIQLwMRz1BPIlLVz2C9KLQez0US9jMGnUkwCDWWKKWkjQlmXDZjQFxL7nsoey5VQwonAARTHV+7T2o2FlIjAghKc4pLVFWlP5YBH+iWBrccMUpWvxfLgF2Uc3GlpxBgKSA1C26DD6lECOuPBZ1vBhzxaoJkOfOGBXEfH4SpqLmcqQgHLqpA2FJvoLGFBTTtEVwPgIAWD5czgF1YKwbKK0omhid9pnsG3sdBFgMCnWEwrAt/AAxsDcl3PWYuBXYZt/VAEHZFRyu9ERMlZA7aGdcCBgAJCPb3D2AtAxKrHCcRQEh3PMxxSgZzhpKkABTYngRSabRPLwAEwOdIZ7q4CXUDSQBW4y0NAs3GAJEzApI+A3ch8L5wJxDHl31utHwtomsfuOkYFHczQFQ9YpEkspI90XQaQREGQDYArfYUTT1n+WnEVRlkMK0YFEehewNFXB9Qf7NnPPRJozTB8ggFWhokACEeqsVTFD4NFOtfQSlGkYutE1BndA5zBjM1zCAsKWfDYBYCKsZanqqU8mgF3ANrEAI/HOsHDjgi8oycUYmlahbDEym+E2RZoJ7CuZQvFIZ+Jo+CNsk+dvgAXSsCovgCRS0tyH+aFYaA2V8ApQLIFAW2ZfgiAlIEuwIO4Ap2I1xnL9wAdig3UgIGf6YE6DbBBHsBdxUYPHjSAHNWkIRV4yToTJo9fHKeIa32X0luKS0KMxP3Ko1eRBJCWkIMxCT0QmGFVau4JCE8fyjMBrtGXRFQD0ey3ylvRggAFQMds0jrARM9SsnGPBPwES6Nxm00yQBywllTABaqCdwPMUoO5Qd85Skqddq+OgvwnB0cAXVO92EWHA4IdbRkNjHKtgz1P9igRVKWJTcjwZrR8wLfBG0HCOFOoHq8bxdTQkAxKg8nE1DGHtA3kQgro0sY9PUYwjnZqgN5FQeHiEMAFRkElNIELGVYpCzs7psuagceOx6VnFMNPy/MDQe9BwEqPVUNBAhc0tpXAFewAxZ+AKsGSriss+52JIsIOj6JVHuNtiQnblFpaV8ED8LHvw4EmBgHL1UP5gNrBQ0SQdz+AxUBqnMDNuBtmgbCMweoGxIq9AbOQIyvOd0DVEUOXzQAcJCuFF52j5Jz5aHRQ5YwMny8QQJcFYgAF1sGkRMQBTDDzDdfK4SKytaorCm44gSOswA1lc1IVWqFuh+6x3LnBSUAE2QIWigFHb3YC1BVDwWdb4eIFzrNRimjqSKpwzltIIWEdI49Mh06XQYKBw41oWjUAHwgEoKXEKItKQEDAAsANWhxAN8K2QR2g1UjAts3mDkh2jA/LHK7BM5OEQ6oBqLLHj0aA3U3MX2Kb1wEBNIHNul/ogAnOGEERQWVVxvZA01dshtiBA9sUJqjJEs0APzrxA5TLhld+ImbOIIBSAJ5CsWQ9nwDE4EAmwYAFsoF28p6D1uFMYMFfgYtE6qkNwAATiwqvE9QADoAAQBqF4wG3QAumBeeN0klpFMCJGmFA9QrBAiYUiAsAFvNnm/HCXOBHKIZXyFlQikDC34xeT4IqQES+kh8NAMYAUEAvgB0HiVoCiMIbI4DGSYNQndiOymW01MRHDwWzs/FkmNBosBbZlMJj0LSAQJUiguvPQAHSxcATgAEbkceKlAmA966PQGGvYaul2NcZG64cOS55stIjxIVAZyuYlwBAVoJLrV6cSQeOwLpDQQb3gMFBUOMOKCAHgTAJd/0fsZGRCZz9eoBhQZ9Lx+BmQgjUNWgNZEbkzIzJz7Kn22XMHV5p49UihqXk6EAeqS6kDqzQcAcjElhAwsAIw4bkjXuBXHmkwJFAT8NLgCQSA9fAmoWAII8yBinKIFM5qNFDVITCBY3q1P2BKNnIPIJoA1wSGtOVkMVL0wuW3qGmRItFEJdIwMNRwI4VlZyFA5ntqYu3bk8FuzvX73m+0e8MiSObrkfXIS3PqwgW30csgKb+sNWNAqkAUAHHBcAHisPF8KyNVwdjib4CQEEqB8BBk3RmxoOcAYqEdnBQnikHk+GCzazSTmuSQXIjV1IPVWWBJEz61wSEA0AQA89r+DVIWexHfEtWzwaxWhXkAxh4jFolqsEVsMROEk9ijfAAR5jTmj6exsBtYRyIiMoZ/4tVhPlPMTKWBfLMQIxUwEAmQxJGCMFSwPjJwj2GUxYFhcWg5u0ntEASB9dCwNnhlcp7wADVo2t9ZEqG8wJWw3bW4IBpoWxDiGWcPxTjgYaN78JGGW0oA4BFsFpqTAKAAQ80REueg8DlcPFnx1jXTAK5NnxwgEb60cNmUb1gDo4IDUGyQgCAW8uBE8AClg+kQEACiJyVT5uW8RBG87AFApFlOwHAicmhoIYJ5YKAQzVZCfCeuuSnEUSeZckEiordDgJUX3LlPazKnfNjiIeqMxVZAZZADTEEkZ8EXGL+gFGwrjaTHyCEb//H6AY7NQKJgsWLAEZPFuLZnZGRnQtp1EuJRVuJTGdca2pHwCthB51+ZgAuXp+lRMyJ2SAgrYB6m0Q+/4YDM6aKGi/fSuVCQVuWtMBKztbqWEoa85PVdo7zihmsFxiXjnaYQAUn5bbKOh6s08RBhjdaU82QD8htgUalV8OGmIHAFTgUJyiMgTgxg8fON4ZAaBIgnxJeaqd1gRvBBMITAdGJWRKWx0lAVHR0j4AdvYAdQNaQJUDRHlHml5cSLMjaYxAqHmbAaTZAZcZ5s6JLJGip7sCXaw2LCRnK1YMO4sFRAgVWgfXMfc+zt038JeI6lkCDQU5yCGeZRBOA9aMG3e0AZ7cmQmKjgeCWvmJnn7yAwY8uoEEL1wLBADizps1VFIzm5UYtBHFT5Qy46UAsQTBZCwPgljNPekNGEwdic0FR1JmP5AAhShTl4MCWwq2By1NKlUqzQQGAidkywDoSgYGtQ8JRdefJLqPjw5YsD85GiBWlRsDZ2GzVDkCvRSyUzIq16YUXEBLd2kGn+rLIwAAAK1JREFUf54DD3C0WwmGPi9OSjpCA0A7fFwUZTm0ktDZLl5VXmbFDDQACl7+QSry5QCM2bfNC+WAFj1LAzLsiwEBaQCW/1EGcMN/tG8OViQtylulBUxRADYm5SEBRAcAARkeMC5iRNgZhOoxnz4oHApa6gD3ASdbmF188wxpDZVKUL4RUhTSSRvrQAZLDcgauImabgJzkXIaALePAXot1j6Bdwe3AXoQAnXMFVuCApGWbjuRvTu7AAAAAElFTkSuQmCC";

  // src/app.js
  var shaderLayer = document.querySelector("#shader-layer");
  var favicon = document.querySelector("#favicon");
  var logoSheet = document.querySelector(".logo-sheet");
  var grid = document.querySelector("#logo-grid");
  var shuffleButton = document.querySelector("#shuffle-button");
  var infoButton = document.querySelector("#info-button");
  var settingsButton = document.querySelector("#settings-button");
  var settingsPopover = document.querySelector("#settings-popover");
  var settingsGradientToggle = document.querySelector("#settings-gradient");
  var settingsFontButton = document.querySelector("#settings-font-button");
  var settingsFontOptions = document.querySelector("#settings-font-options");
  var settingsFontOptionButtons = [...document.querySelectorAll(".font-picker-option")];
  var dialog = document.querySelector("#logo-dialog");
  var infoDialog = document.querySelector("#info-dialog");
  var fullscreenLogo = document.querySelector("#fullscreen-logo");
  var closeButton = dialog.querySelector(".close-button");
  var infoCloseButton = infoDialog.querySelector(".info-close-button");
  var previousButton = dialog.querySelector(".nav-button--previous");
  var nextButton = dialog.querySelector(".nav-button--next");
  var defaultProjectId = "00000000-0000-4000-8000-000000000001";
  var appConfig = window.EEG_SUPABASE_CONFIG ?? {};
  var routePath = window.location.pathname.replace(/\/+$/, "") || "/";
  var isAdminRoute = routePath === "/admin" || window.location.hash === "#admin";
  var projectId = new URLSearchParams(window.location.search).get("project") || appConfig.projectId || defaultProjectId;
  var supabaseUrl = String(appConfig.supabaseUrl || appConfig.url || "").trim();
  var supabasePublishableKey = String(
    appConfig.supabasePublishableKey || appConfig.publishableKey || appConfig.anonKey || ""
  ).trim();
  var supabase = supabaseUrl && supabasePublishableKey ? createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    }
  }) : null;
  var session = null;
  var currentProfile = null;
  var canVote = false;
  var clientVotes = /* @__PURE__ */ new Map();
  var adminVoteRows = [];
  var statusElement = null;
  var accessPanel = null;
  var authForm = null;
  var authMessage = null;
  var clientBar = null;
  var adminPanel = null;
  var adminContent = null;
  var exportCsvButton = null;
  var logoOrder = [
    6,
    9,
    90,
    13,
    14,
    16,
    15,
    96,
    25,
    67,
    70,
    71,
    76,
    77,
    78,
    18,
    12,
    43,
    17,
    100,
    37,
    101,
    38,
    10,
    11,
    24,
    26,
    58,
    80,
    82,
    86,
    106,
    1,
    60,
    21,
    22,
    27,
    105,
    127,
    129,
    61,
    31,
    36,
    133,
    134,
    135,
    136,
    137,
    138,
    7,
    8,
    40,
    41,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    79,
    140,
    139,
    57,
    62,
    81,
    83,
    50,
    97,
    44,
    45,
    46,
    47,
    48,
    51,
    52,
    53,
    54,
    55,
    56,
    68,
    69,
    84,
    85,
    102,
    49,
    89,
    91,
    92,
    93,
    94,
    95,
    103,
    39,
    122,
    123,
    124,
    125,
    126,
    130,
    120,
    121,
    3,
    4,
    5,
    23,
    65,
    42,
    63,
    64,
    73,
    74,
    87,
    88,
    108,
    109,
    110,
    98,
    111,
    112,
    72,
    131,
    132,
    19,
    20,
    99,
    2,
    33,
    59,
    75
  ];
  var logoCount = logoOrder.length;
  var currentLogoId = logoId(logoOrder[0]);
  var gradientMode = false;
  var gridLogoScale = 1;
  var fullscreenLogoScale = 1;
  var defaultPalette = { ink: "#111111", paper: "#ffffff", ratio: 21, source: "Default" };
  var invertedPalette = { ink: "#ffffff", paper: "#111111", ratio: 21, source: "Inverted" };
  var currentPalette = defaultPalette;
  var currentShaderIndex = -1;
  var selectedFont = settingsFontButton.textContent.trim();
  var lockupMode = false;
  var shaderMount = null;
  var fullscreenShaderMount = null;
  var perIconShaderMounts = /* @__PURE__ */ new Map();
  var perIconLogoImageCache = /* @__PURE__ */ new Map();
  var perIconShaderPending = /* @__PURE__ */ new Set();
  var minLogoScale = 0.5;
  var maxLogoScale = 1.5;
  var shaderToken = 0;
  var mobileDialogMedia = window.matchMedia("(max-width: 720px)");
  var mobilePaletteTapCount = 0;
  var mobileLogoSwipeDistance = 44;
  var mobileLogoSwipeDrift = 70;
  var mobileLogoSwipe = null;
  var mobileGridLockupMode = false;
  var suppressNextMobileLogoClick = false;
  var lockupText = "EEG";
  var lockupCanvas = document.createElement("canvas");
  var lockupFontFamilies = {
    Helvetica: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
    Inter: 'Inter, "Inter Tight", Arial, sans-serif',
    "Inter Tight": '"Inter Tight", Inter, Arial, sans-serif',
    "Open Runde": '"Open Runde", "Arial Rounded MT Bold", Arial, sans-serif',
    "Vercel Geist": '"Vercel Geist", Geist, Inter, Arial, sans-serif',
    Gotham: 'Gotham, Montserrat, "Helvetica Neue", Arial, sans-serif',
    "SF Pro": '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
    "Google Sans": '"Google Sans", "Product Sans", Arial, sans-serif',
    Manrope: "Manrope, Inter, Arial, sans-serif",
    Satoshi: "Satoshi, Inter, Arial, sans-serif"
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
  function logoFaviconHref(id) {
    const markup = logoMarkup(id);
    if (!markup) return logoPath(id);
    const ink = parseColor(currentPalette.ink);
    const paper = parseColor(currentPalette.paper);
    const faviconScale = 2.4;
    const viewBox = markup.match(/\bviewBox="([^"]+)"/i)?.[1]?.trim().split(/\s+/).map(Number);
    const [minX, minY, width, height] = viewBox?.length === 4 && viewBox.every(Number.isFinite) ? viewBox : [0, 0, 1200, 1200];
    const translateX = minX + width * (1 - faviconScale) / 2;
    const translateY = minY + height * (1 - faviconScale) / 2;
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
    const faviconMarkup = markup.replace(/<svg\b([^>]*)>/, `<svg$1>${colorStyle}<g class="favicon-mark" transform="${faviconTransform}">`).replace(/<\/svg>\s*$/, "</g></svg>");
    return `data:image/svg+xml,${encodeURIComponent(faviconMarkup)}`;
  }
  function updateFaviconForTopLogo() {
    const topLogoId = grid.querySelector(".logo-tile")?.dataset.logoId ?? logoId(logoOrder[0]);
    favicon?.setAttribute("href", logoFaviconHref(topLogoId));
  }
  function isAdmin() {
    return currentProfile?.role === "admin";
  }
  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
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
    const progress = (Math.min(maxLogoScale, Math.max(minLogoScale, scale)) - minLogoScale) / (maxLogoScale - minLogoScale);
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
    return lockupMode ? lockupMarkup(id) : `<span class="fullscreen-logo-art" aria-hidden="true">${logoMarkup(id)}</span>`;
  }
  function measureLockupText(fontSize, fontFamily) {
    const context = lockupCanvas.getContext("2d");
    context.font = `700 ${fontSize}px ${fontFamily}`;
    const metrics = context.measureText(lockupText);
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    return {
      width: metrics.width,
      height: height || fontSize * 0.72
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
        viewBoxHeight
      ].map((value) => Number(value.toFixed(2))).join(" "));
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      return viewBoxWidth / viewBoxHeight;
    } catch {
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
      const textMetrics2 = measureLockupText(fontSize, fontFamily);
      const markHeight2 = fontSize * 1.02;
      const markWidth2 = markHeight2 * markAspect;
      const gap2 = Math.min(84, Math.max(22, fontSize * 0.27));
      const totalWidth = markWidth2 + gap2 + textMetrics2.width;
      const totalHeight = Math.max(markHeight2, fontSize);
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
      lockupMode ? `EEG logo exploration ${currentLogoId} lockup with EEG text` : `EEG logo exploration ${currentLogoId}`
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
    const voteControls = document.createElement("figcaption");
    const upButton = document.createElement("button");
    const downButton = document.createElement("button");
    tile.className = "logo-tile";
    tile.dataset.logoIndex = String(id);
    tile.dataset.logoId = logoId(id);
    tile.dataset.sortIndex = String(position);
    tile.dataset.vote = "0";
    button.className = "logo-button";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `Fullscreen EEG logo exploration ${logoId(id)}`);
    logo.className = "logo-art";
    logo.setAttribute("aria-hidden", "true");
    logo.innerHTML = logoMarkup(id);
    voteControls.className = "vote-controls";
    upButton.className = "vote-button vote-button--up";
    upButton.type = "button";
    upButton.disabled = true;
    upButton.dataset.voteValue = "1";
    upButton.setAttribute("aria-label", `Upvote EEG logo exploration ${logoId(id)}`);
    downButton.className = "vote-button vote-button--down";
    downButton.type = "button";
    downButton.disabled = true;
    downButton.dataset.voteValue = "-1";
    downButton.setAttribute("aria-label", `Downvote EEG logo exploration ${logoId(id)}`);
    button.addEventListener("pointerdown", (event) => {
      if (!mobileDialogMedia.matches || !event.isPrimary) return;
      mobileLogoSwipe = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY
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
  });
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
      password: String(formData.get("password") ?? "")
    });
    if (error) {
      authMessage.textContent = error.message;
    }
  }
  async function loadProfile() {
    if (!supabase || !session?.user) return null;
    const { data, error } = await supabase.from("profiles").select("id,email,role").eq("id", session.user.id).maybeSingle();
    if (error) {
      setStatus(error.message);
      return null;
    }
    return data;
  }
  async function loadMembership() {
    if (!supabase || !session?.user || isAdmin()) return Boolean(isAdmin());
    const { data, error } = await supabase.from("project_members").select("project_id,user_id").eq("project_id", projectId).eq("user_id", session.user.id).maybeSingle();
    if (error) {
      setStatus(error.message);
      return false;
    }
    return Boolean(data);
  }
  async function loadClientVotes() {
    if (!supabase || !session?.user) return;
    const { data, error } = await supabase.from("logo_votes").select("logo_id,vote").eq("project_id", projectId).eq("user_id", session.user.id);
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
      clientVotes = /* @__PURE__ */ new Map();
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
    const { error } = await supabase.from("logo_votes").upsert({
      project_id: projectId,
      user_id: session.user.id,
      logo_id: id,
      vote: nextValue
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
    const summaries = new Map(logoOrder.map((id) => [
      logoId(id),
      { logo_id: logoId(id), score: 0, upvotes: 0, downvotes: 0, clients: [] }
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
    const { data, error } = await supabase.from("logo_votes").select("logo_id,vote,user_id,updated_at,profiles(email)").eq("project_id", projectId);
    if (error) {
      adminContent.innerHTML = `<p class="admin-empty">${escapeHtml(error.message)}</p>`;
      return;
    }
    adminVoteRows = (data ?? []).map((row) => ({
      ...row,
      email: row.profiles?.email ?? row.user_id
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
        row.clients.join("; ")
      ])
    ];
    const csv = lines.map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
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
      clientVotes = /* @__PURE__ */ new Map();
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
  function randomizeLogoOrder() {
    const tiles = [...grid.querySelectorAll(".logo-tile")];
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
  function openInfoDialog() {
    if (infoDialog.open) return;
    closeSettingsPopover();
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
  var commonShaderSizing = {
    u_fit: ShaderFitOptions.cover,
    u_scale: 1,
    u_rotation: 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_offsetX: 0,
    u_offsetY: 0,
    u_worldWidth: 0,
    u_worldHeight: 0
  };
  var shaderPresets = [
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
        u_isImage: true
      }),
      mipmaps: ["u_image"]
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
        u_isImage: true
      }),
      mipmaps: ["u_image"]
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
        u_isImage: true
      }),
      mipmaps: ["u_image"]
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
          mixColors(palette.ink, "#ff3b20", 0.38)
        ]),
        u_colorsCount: 4,
        u_contour: 0.62,
        u_angle: 38,
        u_noise: 0.16,
        u_innerGlow: 0.68,
        u_outerGlow: 0.26
      }),
      mipmaps: ["u_image"]
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
        u_grainSize: 0.22
      }),
      mipmaps: ["u_image"]
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
        u_grainSize: 0.52
      }),
      mipmaps: ["u_image"]
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
        u_grainSize: 0.66
      }),
      mipmaps: ["u_image"]
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
        u_grainSize: 0.88
      }),
      mipmaps: ["u_image"]
    }
  ];
  function shaderColor(color, alpha = 1) {
    const [r2, g2, b2] = getShaderColorFromString(parseColor(color));
    return [r2, g2, b2, alpha];
  }
  function shaderColors(colors) {
    return colors.map((color) => shaderColor(color));
  }
  function mixColors(a2, b2, amount = 0.5) {
    const left = hexToRgb(parseColor(a2));
    const right = hexToRgb(parseColor(b2));
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
    for (let i2 = -size; i2 < size * 1.8; i2 += 74) {
      context.save();
      context.translate(i2, size * 0.5);
      context.rotate(-0.38);
      context.fillRect(0, -size, 28, size * 2.2);
      context.restore();
    }
    context.strokeStyle = alphaColor(palette.ink, 0.16);
    context.lineWidth = 2;
    for (let y2 = 42; y2 < size; y2 += 86) {
      context.beginPath();
      context.moveTo(0, y2);
      context.bezierCurveTo(size * 0.28, y2 - 24, size * 0.65, y2 + 26, size, y2 - 8);
      context.stroke();
    }
    for (let i2 = 0; i2 < 420; i2 += 1) {
      const radius = Math.random() * 1.8 + 0.4;
      context.fillStyle = alphaColor(i2 % 3 === 0 ? palette.paper : palette.ink, 0.08);
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
    if (!image) return Promise.resolve(void 0);
    if (image.complete && image.naturalWidth > 0) return Promise.resolve(image);
    return new Promise((resolve) => {
      image.addEventListener("load", () => resolve(image), { once: true });
      image.addEventListener("error", () => resolve(void 0), { once: true });
    });
  }
  var maskFrame = null;
  var perIconFrame = null;
  function scheduleLogoShaderMask() {
    if (currentShaderIndex < 0 || !shaderLayer?.classList.contains("is-active")) return;
    window.cancelAnimationFrame(maskFrame);
    maskFrame = window.requestAnimationFrame(updateLogoShaderMask);
  }
  function updateLogoShaderMask() {
    if (currentShaderIndex < 0 || !shaderLayer?.classList.contains("is-active")) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const visibleLogos = [...grid.querySelectorAll(".logo-art svg")].map((svg) => ({ svg, box: svg.getBoundingClientRect() })).filter(({ box }) => {
      return box.width > 0 && box.height > 0 && box.right >= 0 && box.bottom >= 0 && box.left <= width && box.top <= height;
    });
    if (!visibleLogos.length) {
      shaderLayer.style.webkitMaskImage = "";
      shaderLayer.style.maskImage = "";
      return;
    }
    const logoMarkup2 = visibleLogos.map(({ svg, box }) => {
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
        <g class="logo-mask">${logoMarkup2}</g>
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
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
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
      fontSize: parseFloat(textStyle.fontSize) || parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--lockup-font-size")) || 160
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
      for (let y2 = 1; y2 <= height; y2 += 1) {
        let rowSum = 0;
        for (let x = 1; x <= width; x += 1) {
          rowSum += source[(y2 - 1) * width + x - 1];
          integral[y2 * (width + 1) + x] = integral[(y2 - 1) * (width + 1) + x] + rowSum;
        }
      }
      for (let y2 = 0; y2 < height; y2 += 1) {
        const y1 = Math.max(0, y2 - radius);
        const y22 = Math.min(height - 1, y2 + radius);
        for (let x = 0; x < width; x += 1) {
          const x1 = Math.max(0, x - radius);
          const x2 = Math.min(width - 1, x + radius);
          const area = (x2 - x1 + 1) * (y22 - y1 + 1);
          const a2 = integral[y1 * (width + 1) + x1];
          const b2 = integral[y1 * (width + 1) + x2 + 1];
          const c2 = integral[(y22 + 1) * (width + 1) + x1];
          const d2 = integral[(y22 + 1) * (width + 1) + x2 + 1];
          output[y2 * width + x] = (d2 - b2 - c2 + a2) / area;
        }
      }
      source = output;
    }
    return source;
  }
  async function lightweightTextureFromImage(image, type, { preserveAspect = false } = {}) {
    const baseSize = 192;
    const maxSize = 512;
    const aspect = image.naturalWidth > 0 && image.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : 1;
    const width = preserveAspect ? Math.max(1, Math.round(aspect >= 1 ? maxSize : maxSize * aspect)) : baseSize;
    const height = preserveAspect ? Math.max(1, Math.round(aspect >= 1 ? maxSize / aspect : maxSize)) : baseSize;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Failed to create logo texture context");
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    const sourcePixels = ctx.getImageData(0, 0, width, height);
    const alpha = new Float32Array(width * height);
    for (let i2 = 0; i2 < alpha.length; i2 += 1) {
      alpha[i2] = sourcePixels.data[i2 * 4 + 3] / 255;
    }
    const texture = ctx.createImageData(width, height);
    const output = texture.data;
    if (type === "heatmap") {
      const inverse = new Float32Array(alpha.length);
      for (let i2 = 0; i2 < alpha.length; i2 += 1) {
        inverse[i2] = 1 - alpha[i2];
      }
      const contour = boxBlur(inverse, width, height, 2, 1);
      const outerBlur = boxBlur(inverse, width, height, 18, 2);
      const innerBlur = boxBlur(inverse, width, height, 6, 2);
      for (let i2 = 0; i2 < alpha.length; i2 += 1) {
        const px = i2 * 4;
        output[px] = contour[i2] * 255;
        output[px + 1] = outerBlur[i2] * 255;
        output[px + 2] = innerBlur[i2] * 255;
        output[px + 3] = 255;
      }
    } else {
      const softMask = boxBlur(alpha, width, height, 10, 2);
      for (let i2 = 0; i2 < alpha.length; i2 += 1) {
        const px = i2 * 4;
        output[px] = (1 - softMask[i2]) * 255;
        output[px + 1] = alpha[i2] * 255;
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
      loadedNoiseTexture()
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
        Math.random() * 12e3,
        1,
        1600 * 1600,
        preset.mipmaps
      );
    } catch (error) {
      layer.remove();
      fullscreenLogo.classList.remove("has-fullscreen-shader");
      console.error("Failed to mount fullscreen shader", error);
    }
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
    currentShaderIndex = (index % shaderPresets.length + shaderPresets.length) % shaderPresets.length;
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
  function clamp2(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }
  function hslToHex(h2, s2, l2) {
    const hue = (h2 % 360 + 360) % 360;
    const sat = clamp2(s2);
    const light = clamp2(l2);
    const chroma = (1 - Math.abs(2 * light - 1)) * sat;
    const x = chroma * (1 - Math.abs(hue / 60 % 2 - 1));
    const m3 = light - chroma / 2;
    const [r2, g2, b2] = hue < 60 ? [chroma, x, 0] : hue < 120 ? [x, chroma, 0] : hue < 180 ? [0, chroma, x] : hue < 240 ? [0, x, chroma] : hue < 300 ? [x, 0, chroma] : [chroma, 0, x];
    return rgbToHex([r2 + m3, g2 + m3, b2 + m3].map((channel) => Math.round(channel * 255)));
  }
  function rgbToHex(rgb) {
    return `#${rgb.map((channel) => Math.round(clamp2(channel / 255) * 255).toString(16).padStart(2, "0")).join("")}`;
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
    const value = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
    return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
  }
  function luminance(hex) {
    return hexToRgb(hex).map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  }
  function contrastRatio(a2, b2) {
    const light = Math.max(luminance(a2), luminance(b2));
    const dark = Math.min(luminance(a2), luminance(b2));
    return (light + 0.05) / (dark + 0.05);
  }
  function alphaColor(hex, alpha) {
    const [r2, g2, b2] = hexToRgb(hex);
    return `rgb(${r2} ${g2} ${b2} / ${alpha})`;
  }
  function randomFrom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }
  var recentPaletteKeys = [];
  var recentPaletteSignatures = [];
  var recentPaletteLimit = 72;
  function paletteKey(palette) {
    return `${palette.ink}/${palette.paper}`;
  }
  function hueFromHex(hex) {
    const [r2, g2, b2] = hexToRgb(hex).map((channel) => channel / 255);
    const max = Math.max(r2, g2, b2);
    const min = Math.min(r2, g2, b2);
    const delta = max - min;
    if (delta === 0) return 0;
    if (max === r2) return ((g2 - b2) / delta % 6 + 6) % 6 * 60;
    if (max === g2) return ((b2 - r2) / delta + 2) * 60;
    return ((r2 - g2) / delta + 4) * 60;
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
            score: (ratio >= comfortableLogoContrast ? 1 : 0.35) + Math.random() * 3
          });
        }
      }
    }
    if (candidates.length) return candidates;
    const seed = normalized[0] ?? "#ffffff";
    const blackRatio = contrastRatio("#111111", seed);
    const whiteRatio = contrastRatio("#ffffff", seed);
    return [blackRatio >= whiteRatio ? { ink: "#111111", paper: seed, ratio: blackRatio } : { ink: "#ffffff", paper: seed, ratio: whiteRatio }].map((pair) => ({ ...pair, source, score: 0 }));
  }
  var paletteSources = [
    ["FettePalette", fettePaletteColors],
    ["RampenSau", rampensauColors],
    ["Poline", polineColors],
    ["RYBitten", rybittenColors],
    ["WildCard", wildCardColors]
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
    return Array.from({ length: 18 }, (_2, index) => {
      const hue = (baseHue + index / 18 + Math.random() * 0.045) % 1;
      const saturation = 0.45 + Math.random() * 0.45;
      const lightness = 0.08 + Math.random() * 0.86;
      return rgbToHex(A2([hue, saturation, lightness]).map((channel) => channel * 255));
    });
  }
  function wildCardColors() {
    const base = Math.random() * 360;
    return Array.from({ length: 18 }, (_2, index) => {
      const hue = base + index * (90 + Math.random() * 70);
      const saturation = 0.28 + Math.random() * 0.72;
      const lightness = 0.08 + Math.random() * 0.84;
      return hslToHex(hue, saturation, lightness);
    });
  }
  var standardPalettePairs = [
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
    ["#d9c6a3", "#243b2f"]
  ];
  function standardPalette() {
    const shuffled = [...standardPalettePairs].sort(() => Math.random() - 0.5);
    const pair = shuffled.find(([ink, paper]) => {
      const palette2 = { ink, paper };
      return !recentPaletteKeys.includes(paletteKey(palette2)) && !recentPaletteSignatures.includes(paletteSignature(palette2));
    }) ?? randomFrom(standardPalettePairs);
    const palette = {
      ink: pair[0],
      paper: pair[1],
      ratio: contrastRatio(pair[0], pair[1]),
      source: "Standard"
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
              score: ratio + gradientContrast * 0.75 + Math.random() * 2.5
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
      source: "Standard Gradient"
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
      return !recentPaletteKeys.includes(paletteKey(candidate)) && !recentPaletteSignatures.includes(paletteSignature(candidate));
    });
    const pool = fresh.length >= 12 ? fresh : candidates.filter((candidate) => !recentPaletteKeys.includes(paletteKey(candidate)));
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
      return !recentPaletteKeys.includes(paletteKey(candidate)) && !recentPaletteSignatures.includes(paletteSignature(candidate));
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
        `linear-gradient(${angle}deg, ${palette.gradientStops[0]}, ${palette.gradientStops[1]})`
      );
    } else {
      document.documentElement.style.setProperty("--logo-bg-paint", palette.paper);
    }
    document.documentElement.style.setProperty("--editor-mark-color", alphaColor(palette.ink, 0.36));
    updateFaviconForTopLogo();
    refreshShaderPalette();
  }
  function toggleDefaultPalette() {
    const isInverted = currentPalette.ink.toLowerCase() === invertedPalette.ink && currentPalette.paper.toLowerCase() === invertedPalette.paper;
    applyPalette(isInverted ? defaultPalette : invertedPalette);
  }
  function applyMobilePaletteTap() {
    mobilePaletteTapCount = (mobilePaletteTapCount + 1) % 5;
    if (mobilePaletteTapCount === 4 || mobilePaletteTapCount === 0) {
      gradientMode = false;
      settingsGradientToggle.checked = false;
      applyPalette(mobilePaletteTapCount === 4 ? defaultPalette : invertedPalette);
      return;
    }
    applyPalette(randomPalette());
  }
  function setGradientMode(enabled) {
    gradientMode = enabled;
    settingsGradientToggle.checked = gradientMode;
    applyPalette(gradientMode ? randomGradientPalette() : defaultPalette);
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
    if (infoDialog.open) return;
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
  initializeClientAccess();
})();
