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
      const location = this.uniformLocations[uniformName];
      if (location) {
        this.gl.uniform1i(location, textureUnit);
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
        const location = this.uniformLocations[key];
        if (!location) {
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
              this.gl.uniform2fv(location, flatArray);
              break;
            case 3:
              this.gl.uniform3fv(location, flatArray);
              break;
            case 4:
              this.gl.uniform4fv(location, flatArray);
              break;
            case 9:
              this.gl.uniformMatrix3fv(location, false, flatArray);
              break;
            case 16:
              this.gl.uniformMatrix4fv(location, false, flatArray);
              break;
            default:
              console.warn(`Unsupported uniform array length: ${valueLength}`);
          }
        } else if (typeof value === "number") {
          this.gl.uniform1f(location, value);
        } else if (typeof value === "boolean") {
          this.gl.uniform1i(location, value ? 1 : 0);
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
  var proceduralHash11 = `
  float hash11(float p) {
    p = fract(p * 0.3183099) + 0.1;
    p *= p + 19.19;
    return fract(p * p);
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

  // node_modules/@paper-design/shaders/dist/shaders/dithering.js
  var ditheringFragmentShader = `#version 300 es
precision mediump float;

uniform float u_time;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

uniform float u_pxSize;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_shape;
uniform float u_type;

out vec4 fragColor;

${simplexNoise}
${declarePI}
${proceduralHash11}
${proceduralHash21}

float getSimplexNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));

  return noise;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
0, 8, 2, 10,
12, 4, 14, 6,
3, 11, 1, 9,
15, 7, 13, 5
);

const int bayer8x8[64] = int[64](
0, 32, 8, 40, 2, 34, 10, 42,
48, 16, 56, 24, 50, 18, 58, 26,
12, 44, 4, 36, 14, 46, 6, 38,
60, 28, 52, 20, 62, 30, 54, 22,
3, 35, 11, 43, 1, 33, 9, 41,
51, 19, 59, 27, 49, 17, 57, 25,
15, 47, 7, 39, 13, 45, 5, 37,
63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(fract(uv / float(size)) * float(size));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}


void main() {
  float t = .5 * u_time;

  float pxSize = u_pxSize * u_pixelRatio;
  vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;
  vec2 normalizedUV = canvasPixelizedUV / u_resolution;

  vec2 ditheringNoiseUV = canvasPixelizedUV;
  vec2 shapeUV = normalizedUV;

  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * PI / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 boxSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  
  if (u_shape > 3.5) {
    vec2 objectBoxSize = vec2(0.);
    // fit = none
    objectBoxSize.x = min(boxSize.x, boxSize.y);
    if (u_fit == 1.) { // fit = contain
      objectBoxSize.x = min(u_resolution.x, u_resolution.y);
    } else if (u_fit == 2.) { // fit = cover
      objectBoxSize.x = max(u_resolution.x, u_resolution.y);
    }
    objectBoxSize.y = objectBoxSize.x;
    vec2 objectWorldScale = u_resolution.xy / objectBoxSize;

    shapeUV *= objectWorldScale;
    shapeUV += boxOrigin * (objectWorldScale - 1.);
    shapeUV += vec2(-u_offsetX, u_offsetY);
    shapeUV /= u_scale;
    shapeUV = graphicRotation * shapeUV;
  } else {
    vec2 patternBoxSize = vec2(0.);
    // fit = none
    patternBoxSize.x = patternBoxRatio * min(boxSize.x / patternBoxRatio, boxSize.y);
    float patternWorldNoFitBoxWidth = patternBoxSize.x;
    if (u_fit == 1.) { // fit = contain
      patternBoxSize.x = patternBoxRatio * min(u_resolution.x / patternBoxRatio, u_resolution.y);
    } else if (u_fit == 2.) { // fit = cover
      patternBoxSize.x = patternBoxRatio * max(u_resolution.x / patternBoxRatio, u_resolution.y);
    }
    patternBoxSize.y = patternBoxSize.x / patternBoxRatio;
    vec2 patternWorldScale = u_resolution.xy / patternBoxSize;

    shapeUV += vec2(-u_offsetX, u_offsetY) / patternWorldScale;
    shapeUV += boxOrigin;
    shapeUV -= boxOrigin / patternWorldScale;
    shapeUV *= u_resolution.xy;
    shapeUV /= u_pixelRatio;
    if (u_fit > 0.) {
      shapeUV *= (patternWorldNoFitBoxWidth / patternBoxSize.x);
    }
    shapeUV /= u_scale;
    shapeUV = graphicRotation * shapeUV;
    shapeUV += boxOrigin / patternWorldScale;
    shapeUV -= boxOrigin;
    shapeUV += .5;
  }

  float shape = 0.;
  if (u_shape < 1.5) {
    // Simplex noise
    shapeUV *= .001;

    shape = 0.5 + 0.5 * getSimplexNoise(shapeUV, t);
    shape = smoothstep(0.3, 0.9, shape);

  } else if (u_shape < 2.5) {
    // Warp
    shapeUV *= .003;

    for (float i = 1.0; i < 6.0; i++) {
      shapeUV.x += 0.6 / i * cos(i * 2.5 * shapeUV.y + t);
      shapeUV.y += 0.6 / i * cos(i * 1.5 * shapeUV.x + t);
    }

    shape = .15 / max(0.001, abs(sin(t - shapeUV.y - shapeUV.x)));
    shape = smoothstep(0.02, 1., shape);

  } else if (u_shape < 3.5) {
    // Dots
    shapeUV *= .05;

    float stripeIdx = floor(2. * shapeUV.x / TWO_PI);
    float rand = hash11(stripeIdx * 10.);
    rand = sign(rand - .5) * pow(.1 + abs(rand), .4);
    shape = sin(shapeUV.x) * cos(shapeUV.y - 5. * rand * t);
    shape = pow(abs(shape), 6.);

  } else if (u_shape < 4.5) {
    // Sine wave
    shapeUV *= 4.;

    float wave = cos(.5 * shapeUV.x - 2. * t) * sin(1.5 * shapeUV.x + t) * (.75 + .25 * cos(3. * t));
    shape = 1. - smoothstep(-1., 1., shapeUV.y + wave);

  } else if (u_shape < 5.5) {
    // Ripple

    float dist = length(shapeUV);
    float waves = sin(pow(dist, 1.7) * 7. - 3. * t) * .5 + .5;
    shape = waves;

  } else if (u_shape < 6.5) {
    // Swirl

    float l = length(shapeUV);
    float angle = 6. * atan(shapeUV.y, shapeUV.x) + 4. * t;
    float twist = 1.2;
    float offset = 1. / pow(max(l, 1e-6), twist) + angle / TWO_PI;
    float mid = smoothstep(0., 1., pow(l, twist));
    shape = mix(0., fract(offset), mid);

  } else {
    // Sphere
    shapeUV *= 2.;

    float d = 1. - pow(length(shapeUV), 2.);
    vec3 pos = vec3(shapeUV, sqrt(max(0., d)));
    vec3 lightPos = normalize(vec3(cos(1.5 * t), .8, sin(1.25 * t)));
    shape = .5 + .5 * dot(lightPos, pos);
    shape *= step(0., d);
  }


  int type = int(floor(u_type));
  float dithering = 0.0;

  switch (type) {
    case 1: {
      dithering = step(hash21(ditheringNoiseUV), shape);
    } break;
    case 2:
    dithering = getBayerValue(pxSizeUV, 2);
    break;
    case 3:
    dithering = getBayerValue(pxSizeUV, 4);
    break;
    default :
    dithering = getBayerValue(pxSizeUV, 8);
    break;
  }

  dithering -= .5;
  float res = step(.5, shape + dithering);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);

  fragColor = vec4(color, opacity);
}
`;
  var DitheringTypes = {
    "random": 1,
    "2x2": 2,
    "4x4": 3,
    "8x8": 4
  };

  // node_modules/@paper-design/shaders/dist/shaders/water.js
  var waterFragmentShader = `#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorHighlight;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_size;
uniform float u_highlights;
uniform float u_layering;
uniform float u_edges;
uniform float u_caustic;
uniform float u_waves;

in vec2 v_imageUV;

out vec4 fragColor;

${declarePI}
${rotation2}
${simplexNoise}

float getUvFrame(vec2 uv) {
  float aax = 2. * fwidth(uv.x);
  float aay = 2. * fwidth(uv.y);

  float left   = smoothstep(0., aax, uv.x);
  float right = 1.0 - smoothstep(1. - aax, 1., uv.x);
  float bottom = smoothstep(0., aay, uv.y);
  float top = 1.0 - smoothstep(1. - aay, 1., uv.y);

  return left * right * bottom * top;
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float getCausticNoise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 6; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.1;
  }
  return (N.x + N.y + 1.);
}

void main() {
  vec2 imageUV = v_imageUV;
  vec2 patternUV = v_imageUV - .5;
  patternUV = (patternUV * vec2(u_imageAspectRatio, 1.));
  patternUV /= (.01 + .09 * u_size);

  float t = u_time;

  float wavesNoise = snoise((.3 + .1 * sin(t)) * .1 * patternUV + vec2(0., .4 * t));

  float causticNoise = getCausticNoise(patternUV + u_waves * vec2(1., -1.) * wavesNoise, 2. * t, 1.5);

  causticNoise += u_layering * getCausticNoise(patternUV + 2. * u_waves * vec2(1., -1.) * wavesNoise, 1.5 * t, 2.);
  causticNoise = causticNoise * causticNoise;

  float edgesDistortion = smoothstep(0., .1, imageUV.x);
  edgesDistortion *= smoothstep(0., .1, imageUV.y);
  edgesDistortion *= (smoothstep(1., 1.1, imageUV.x) + (1.0 - smoothstep(.8, .95, imageUV.x)));
  edgesDistortion *= (1.0 - smoothstep(.9, 1., imageUV.y));
  edgesDistortion = mix(edgesDistortion, 1., u_edges);

  float causticNoiseDistortion = .02 * causticNoise * edgesDistortion;

  float wavesDistortion = .1 * u_waves * wavesNoise;

  imageUV += vec2(wavesDistortion, -wavesDistortion);
  imageUV += (u_caustic * causticNoiseDistortion);

  float frame = getUvFrame(imageUV);

  vec4 image = texture(u_image, imageUV);
  vec4 backColor = u_colorBack;
  backColor.rgb *= backColor.a;

  vec3 color = mix(backColor.rgb, image.rgb, image.a * frame);
  float opacity = backColor.a + image.a * frame;

  causticNoise = max(-.2, causticNoise);

  float hightlight = .025 * u_highlights * causticNoise;
  hightlight *= u_colorHighlight.a;
  color = mix(color, u_colorHighlight.rgb, .05 * u_highlights * causticNoise);
  opacity += hightlight;

  color += hightlight * (.5 + .5 * wavesNoise);
  opacity += hightlight * (.5 + .5 * wavesNoise);

  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`;

  // node_modules/@paper-design/shaders/dist/shaders/fluted-glass.js
  var flutedGlassFragmentShader = `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_rotation;

uniform vec4 u_colorBack;
uniform vec4 u_colorShadow;
uniform vec4 u_colorHighlight;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_size;
uniform float u_shadows;
uniform float u_angle;
uniform float u_stretch;
uniform float u_shape;
uniform float u_distortion;
uniform float u_highlights;
uniform float u_distortionShape;
uniform float u_shift;
uniform float u_blur;
uniform float u_edges;
uniform float u_marginLeft;
uniform float u_marginRight;
uniform float u_marginTop;
uniform float u_marginBottom;
uniform float u_grainMixer;
uniform float u_grainOverlay;

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

float getUvFrame(vec2 uv, float softness) {
  float aax = 2. * fwidth(uv.x);
  float aay = 2. * fwidth(uv.y);
  float left   = smoothstep(0., aax + softness, uv.x);
  float right  = 1. - smoothstep(1. - softness - aax, 1., uv.x);
  float bottom = smoothstep(0., aay + softness, uv.y);
  float top    = 1. - smoothstep(1. - softness - aay, 1., uv.y);
  return left * right * bottom * top;
}

const int MAX_RADIUS = 50;
vec4 samplePremultiplied(sampler2D tex, vec2 uv) {
  vec4 c = texture(tex, uv);
  c.rgb *= c.a;
  return c;
}
vec4 getBlur(sampler2D tex, vec2 uv, vec2 texelSize, vec2 dir, float sigma) {
  if (sigma <= .5) return texture(tex, uv);
  int radius = int(min(float(MAX_RADIUS), ceil(3.0 * sigma)));

  float twoSigma2 = 2.0 * sigma * sigma;
  float gaussianNorm = 1.0 / sqrt(TWO_PI * sigma * sigma);

  vec4 sum = samplePremultiplied(tex, uv) * gaussianNorm;
  float weightSum = gaussianNorm;

  for (int i = 1; i <= MAX_RADIUS; i++) {
    if (i > radius) break;

    float x = float(i);
    float w = exp(-(x * x) / twoSigma2) * gaussianNorm;

    vec2 offset = dir * texelSize * x;
    vec4 s1 = samplePremultiplied(tex, uv + offset);
    vec4 s2 = samplePremultiplied(tex, uv - offset);

    sum += (s1 + s2) * w;
    weightSum += 2.0 * w;
  }

  vec4 result = sum / weightSum;
  if (result.a > 0.) {
    result.rgb /= result.a;
  }

  return result;
}

vec2 rotateAspect(vec2 p, float a, float aspect) {
  p.x *= aspect;
  p = rotate(p, a);
  p.x /= aspect;
  return p;
}

float smoothFract(float x) {
  float f = fract(x);
  float w = fwidth(x);

  float edge = abs(f - 0.5) - 0.5;
  float band = smoothstep(-w, w, edge);

  return mix(f, 1.0 - f, band);
}

void main() {

  float patternRotation = -u_angle * PI / 180.;
  float patternSize = mix(200., 5., u_size);

  vec2 uv = v_imageUV;

  vec2 uvMask = gl_FragCoord.xy / u_resolution.xy;
  vec2 sw = vec2(.005);
  vec4 margins = vec4(u_marginLeft, u_marginTop, u_marginRight, u_marginBottom);
  float mask =
  smoothstep(margins[0], margins[0] + sw.x, uvMask.x + sw.x) *
  smoothstep(margins[2], margins[2] + sw.x, 1.0 - uvMask.x + sw.x) *
  smoothstep(margins[1], margins[1] + sw.y, uvMask.y + sw.y) *
  smoothstep(margins[3], margins[3] + sw.y, 1.0 - uvMask.y + sw.y);
  float maskOuter =
  smoothstep(margins[0] - sw.x, margins[0], uvMask.x + sw.x) *
  smoothstep(margins[2] - sw.x, margins[2], 1.0 - uvMask.x + sw.x) *
  smoothstep(margins[1] - sw.y, margins[1], uvMask.y + sw.y) *
  smoothstep(margins[3] - sw.y, margins[3], 1.0 - uvMask.y + sw.y);
  float maskStroke = maskOuter - mask;
  float maskInner =
  smoothstep(margins[0] - 2. * sw.x, margins[0], uvMask.x) *
  smoothstep(margins[2] - 2. * sw.x, margins[2], 1.0 - uvMask.x) *
  smoothstep(margins[1] - 2. * sw.y, margins[1], uvMask.y) *
  smoothstep(margins[3] - 2. * sw.y, margins[3], 1.0 - uvMask.y);
  float maskStrokeInner = maskInner - mask;

  uv -= .5;
  uv *= patternSize;
  uv = rotateAspect(uv, patternRotation, u_imageAspectRatio);

  float curve = 0.;
  float patternY = uv.y / u_imageAspectRatio;
  if (u_shape > 4.5) {
    // pattern
    curve = .5 + .5 * sin(.5 * PI * uv.x) * cos(.5 * PI * patternY);
  } else if (u_shape > 3.5) {
    // zigzag
    curve = 10. * abs(fract(.1 * patternY) - .5);
  } else if (u_shape > 2.5) {
    // wave
    curve = 4. * sin(.23 * patternY);
  } else if (u_shape > 1.5) {
    // lines irregular
    curve = .5 + .5 * sin(.5 * uv.x) * sin(1.7 * uv.x);
  } else {
    // lines
  }

  vec2 UvToFract = uv + curve;
  vec2 fractOrigUV = fract(uv);
  vec2 floorOrigUV = floor(uv);

  float x = smoothFract(UvToFract.x);
  float xNonSmooth = fract(UvToFract.x) + .0001;

  float highlightsWidth = 2. * max(.001, fwidth(UvToFract.x));
  highlightsWidth += 2. * maskStrokeInner;
  float highlights = smoothstep(0., highlightsWidth, xNonSmooth);
  highlights *= smoothstep(1., 1. - highlightsWidth, xNonSmooth);
  highlights = 1. - highlights;
  highlights *= u_highlights;
  highlights = clamp(highlights, 0., 1.);
  highlights *= mask;

  float shadows = pow(x, 1.3);
  float distortion = 0.;
  float fadeX = 1.;
  float frameFade = 0.;

  float aa = fwidth(xNonSmooth);
  aa = max(aa, fwidth(uv.x));
  aa = max(aa, fwidth(UvToFract.x));
  aa = max(aa, .0001);

  if (u_distortionShape == 1.) {
    distortion = -pow(1.5 * x, 3.);
    distortion += (.5 - u_shift);

    frameFade = pow(1.5 * x, 3.);
    aa = max(.2, aa);
    aa += mix(.2, 0., u_size);
    fadeX = smoothstep(0., aa, xNonSmooth) * smoothstep(1., 1. - aa, xNonSmooth);
    distortion = mix(.5, distortion, fadeX);
  } else if (u_distortionShape == 2.) {
    distortion = 2. * pow(x, 2.);
    distortion -= (.5 + u_shift);

    frameFade = pow(abs(x - .5), 4.);
    aa = max(.2, aa);
    aa += mix(.2, 0., u_size);
    fadeX = smoothstep(0., aa, xNonSmooth) * smoothstep(1., 1. - aa, xNonSmooth);
    distortion = mix(.5, distortion, fadeX);
    frameFade = mix(1., frameFade, .5 * fadeX);
  } else if (u_distortionShape == 3.) {
    distortion = pow(2. * (xNonSmooth - .5), 6.);
    distortion -= .25;
    distortion -= u_shift;

    frameFade = 1. - 2. * pow(abs(x - .4), 2.);
    aa = .15;
    aa += mix(.1, 0., u_size);
    fadeX = smoothstep(0., aa, xNonSmooth) * smoothstep(1., 1. - aa, xNonSmooth);
    frameFade = mix(1., frameFade, fadeX);

  } else if (u_distortionShape == 4.) {
    x = xNonSmooth;
    distortion = sin((x + .25) * TWO_PI);
    shadows = .5 + .5 * asin(distortion) / (.5 * PI);
    distortion *= .5;
    distortion -= u_shift;
    frameFade = .5 + .5 * sin(x * TWO_PI);
  } else if (u_distortionShape == 5.) {
    distortion -= pow(abs(x), .2) * x;
    distortion += .33;
    distortion -= 3. * u_shift;
    distortion *= .33;

    frameFade = .3 * (smoothstep(.0, 1., x));
    shadows = pow(x, 2.5);

    aa = max(.1, aa);
    aa += mix(.1, 0., u_size);
    fadeX = smoothstep(0., aa, xNonSmooth) * smoothstep(1., 1. - aa, xNonSmooth);
    distortion *= fadeX;
  }

  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec2 grainUV = v_imageUV - .5;
  grainUV *= (.8 / vec2(length(dudx), length(dudy)));
  grainUV += .5;
  float grain = valueNoise(grainUV);
  grain = smoothstep(.4, .7, grain);
  grain *= u_grainMixer;
  distortion = mix(distortion, 0., grain);

  shadows = min(shadows, 1.);
  shadows += maskStrokeInner;
  shadows *= mask;
  shadows = min(shadows, 1.);
  shadows *= pow(u_shadows, 2.);
  shadows = clamp(shadows, 0., 1.);

  distortion *= 3. * u_distortion;
  frameFade *= u_distortion;

  fractOrigUV.x += distortion;
  floorOrigUV = rotateAspect(floorOrigUV, -patternRotation, u_imageAspectRatio);
  fractOrigUV = rotateAspect(fractOrigUV, -patternRotation, u_imageAspectRatio);

  uv = (floorOrigUV + fractOrigUV) / patternSize;
  uv += pow(maskStroke, 4.);

  uv += vec2(.5);

  uv = mix(v_imageUV, uv, smoothstep(0., .7, mask));
  float blur = mix(0., 50., u_blur);
  blur = mix(0., blur, smoothstep(.5, 1., mask));

  float edgeDistortion = mix(.0, .04, u_edges);
  edgeDistortion += .06 * frameFade * u_edges;
  edgeDistortion *= mask;
  float frame = getUvFrame(uv, edgeDistortion);

  float stretch = 1. - smoothstep(0., .5, xNonSmooth) * smoothstep(1., 1. - .5, xNonSmooth);
  stretch = pow(stretch, 2.);
  stretch *= mask;
  stretch *= getUvFrame(uv, .1 + .05 * mask * frameFade);
  uv.y = mix(uv.y, .5, u_stretch * stretch);

  vec4 image = getBlur(u_image, uv, 1. / u_resolution / u_pixelRatio, vec2(0., 1.), blur);
  image.rgb *= image.a;
  vec4 backColor = u_colorBack;
  backColor.rgb *= backColor.a;
  vec4 highlightColor = u_colorHighlight;
  highlightColor.rgb *= highlightColor.a;
  vec4 shadowColor = u_colorShadow;

  vec3 color = highlightColor.rgb * highlights;
  float opacity = highlightColor.a * highlights;

  shadows = mix(shadows * shadowColor.a, 0., highlights);
  color = mix(color, shadowColor.rgb * shadowColor.a, .5 * shadows);
  color += .5 * pow(shadows, .5) * shadowColor.rgb;
  opacity += shadows;
  color = clamp(color, vec3(0.), vec3(1.));
  opacity = clamp(opacity, 0., 1.);

  color += image.rgb * (1. - opacity) * frame;
  opacity += image.a * (1. - opacity) * frame;

  color += backColor.rgb * (1. - opacity);
  opacity += backColor.a * (1. - opacity);

  float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
  grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  grainOverlayStrength *= mask;
  color = mix(color, grainOverlayColor, .35 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`;
  var GlassGridShapes = {
    lines: 1,
    linesIrregular: 2,
    wave: 3,
    zigzag: 4,
    pattern: 5
  };
  var GlassDistortionShapes = {
    prism: 1,
    lens: 2,
    contour: 3,
    cascade: 4,
    flat: 5
  };

  // node_modules/@paper-design/shaders/dist/shaders/image-dithering.js
  var imageDitheringFragmentShader = `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;

uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

uniform vec4 u_colorFront;
uniform vec4 u_colorBack;
uniform vec4 u_colorHighlight;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_type;
uniform float u_pxSize;
uniform bool u_originalColors;
uniform bool u_inverted;
uniform float u_colorSteps;

out vec4 fragColor;


${proceduralHash21}
${declarePI}

float getUvFrame(vec2 uv, vec2 pad) {
  float aa = 0.0001;

  float left   = smoothstep(-pad.x, -pad.x + aa, uv.x);
  float right  = smoothstep(1.0 + pad.x, 1.0 + pad.x - aa, uv.x);
  float bottom = smoothstep(-pad.y, -pad.y + aa, uv.y);
  float top    = smoothstep(1.0 + pad.y, 1.0 + pad.y - aa, uv.y);

  return left * right * bottom * top;
}

vec2 getImageUV(vec2 uv) {
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  float r = u_rotation * PI / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

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

  vec2 imageUV = uv;
  imageUV *= imageBoxScale;
  imageUV += boxOrigin * (imageBoxScale - 1.);
  imageUV += graphicOffset;
  imageUV /= u_scale;
  imageUV.x *= u_imageAspectRatio;
  imageUV = graphicRotation * imageUV;
  imageUV.x /= u_imageAspectRatio;

  imageUV += .5;
  imageUV.y = 1. - imageUV.y;

  return imageUV;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
0, 8, 2, 10,
12, 4, 14, 6,
3, 11, 1, 9,
15, 7, 13, 5
);

const int bayer8x8[64] = int[64](
0, 32, 8, 40, 2, 34, 10, 42,
48, 16, 56, 24, 50, 18, 58, 26,
12, 44, 4, 36, 14, 46, 6, 38,
60, 28, 52, 20, 62, 30, 54, 22,
3, 35, 11, 43, 1, 33, 9, 41,
51, 19, 59, 27, 49, 17, 57, 25,
15, 47, 7, 39, 13, 45, 5, 37,
63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(fract(uv / float(size)) * float(size));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}


void main() {

  float pxSize = u_pxSize * u_pixelRatio;
  vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;
  vec2 normalizedUV = canvasPixelizedUV / u_resolution;

  vec2 imageUV = getImageUV(normalizedUV);
  vec2 ditheringNoiseUV = canvasPixelizedUV;
  vec4 image = texture(u_image, imageUV);
  float frame = getUvFrame(imageUV, pxSize / u_resolution);

  int type = int(floor(u_type));
  float dithering = 0.0;

  float lum = dot(vec3(.2126, .7152, .0722), image.rgb);
  lum = u_inverted ? (1. - lum) : lum;

  switch (type) {
    case 1: {
      dithering = step(hash21(ditheringNoiseUV), lum);
    } break;
    case 2:
    dithering = getBayerValue(pxSizeUV, 2);
    break;
    case 3:
    dithering = getBayerValue(pxSizeUV, 4);
    break;
    default :
    dithering = getBayerValue(pxSizeUV, 8);
    break;
  }

  float colorSteps = max(floor(u_colorSteps), 1.);
  vec3 color = vec3(0.0);
  float opacity = 1.;

  dithering -= .5;
  float brightness = clamp(lum + dithering / colorSteps, 0.0, 1.0);
  brightness = mix(0.0, brightness, frame);
  brightness = mix(0.0, brightness, image.a);
  float quantLum = floor(brightness * colorSteps + 0.5) / colorSteps;
  quantLum = mix(0.0, quantLum, frame);

  if (u_originalColors == true) {
    vec3 normColor = image.rgb / max(lum, 0.001);
    color = normColor * quantLum;

    float quantAlpha = floor(image.a * colorSteps + 0.5) / colorSteps;
    opacity = mix(quantLum, 1., quantAlpha);
  } else {
    vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
    float fgOpacity = u_colorFront.a;
    vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
    float bgOpacity = u_colorBack.a;
    vec3 hlColor = u_colorHighlight.rgb * u_colorHighlight.a;
    float hlOpacity = u_colorHighlight.a;

    fgColor = mix(fgColor, hlColor, step(1.02 - .02 * u_colorSteps, brightness));
    fgOpacity = mix(fgOpacity, hlOpacity, step(1.02 - .02 * u_colorSteps, brightness));

    color = fgColor * quantLum;
    opacity = fgOpacity * quantLum;
    color += bgColor * (1.0 - opacity);
    opacity += bgOpacity * (1.0 - opacity);
  }

  fragColor = vec4(color, opacity);
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
  var noiseSrc = "data:image/png;base64,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";

  // src/app.js
  var shaderLayer = document.querySelector("#shader-layer");
  var grid = document.querySelector("#logo-grid");
  var copyOrderButton = document.querySelector("#copy-order");
  var resetOrderButton = document.querySelector("#reset-order");
  var toggleGradientButton = document.querySelector("#toggle-gradient");
  var orderStatus = document.querySelector("#order-status");
  var dialog = document.querySelector("#logo-dialog");
  var fullscreenLogo = document.querySelector("#fullscreen-logo");
  var shaderTitle = document.querySelector("#shader-title");
  var closeButton = dialog.querySelector(".close-button");
  var previousButton = dialog.querySelector(".nav-button--previous");
  var nextButton = dialog.querySelector(".nav-button--next");
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
    61,
    31,
    36,
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
  var draggedTile = null;
  var draggedTiles = [];
  var pointerDrag = null;
  var suppressNextClick = false;
  var dragPreview = null;
  var gradientMode = false;
  var logoScale = 1;
  var currentPalette = { ink: "#111111", paper: "#ffffff", source: "Default" };
  var currentShaderIndex = -1;
  var shaderMount = null;
  var fullscreenShaderMount = null;
  var perIconShaderMounts = /* @__PURE__ */ new Map();
  var perIconLogoImageCache = /* @__PURE__ */ new Map();
  var perIconShaderPending = /* @__PURE__ */ new Set();
  var shaderToken = 0;
  function logoId(id) {
    return String(id).padStart(3, "0");
  }
  function logoMarkup(id) {
    return window.LOGO_SVGS?.[logoId(id)] ?? "";
  }
  function setLogoScale(nextScale) {
    logoScale = Math.min(1.5, Math.max(0.55, Math.round(nextScale * 100) / 100));
    document.documentElement.style.setProperty("--logo-scale", String(logoScale));
    if (dialog.open) mountFullscreenShader();
    scheduleLogoShaderMask();
    setStatus(`Logo size ${Math.round(logoScale * 100)}%`);
  }
  function showLogoById(id) {
    currentLogoId = logoId(id);
    fullscreenLogo.innerHTML = `<span class="fullscreen-logo-art" aria-hidden="true">${logoMarkup(id)}</span>`;
    fullscreenLogo.setAttribute("aria-label", `EEG logo exploration ${currentLogoId}`);
    if (dialog.open) mountFullscreenShader();
  }
  function showAdjacentLogo(offset) {
    const order = tileOrder();
    const position = order.indexOf(currentLogoId);
    const nextPosition = ((position + offset) % order.length + order.length) % order.length;
    showLogoById(Number(order[nextPosition]));
  }
  function openLogoDialog(id) {
    document.activeElement?.blur?.();
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
  function setStatus(message) {
    orderStatus.textContent = message;
    window.clearTimeout(setStatus.timeout);
    setStatus.timeout = window.setTimeout(() => {
      orderStatus.textContent = "";
    }, 2200);
  }
  function updateShaderTitle() {
    const preset = currentShaderIndex >= 0 ? shaderPresets[currentShaderIndex] : null;
    if (!shaderTitle) return;
    shaderTitle.textContent = dialog.open && preset ? preset.label : "";
    shaderTitle.hidden = !dialog.open || !preset;
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
  function insertionAnchorFromPreview(x, y2) {
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
      top: y2 - previewHeight / 2,
      bottom: y2 + previewHeight / 2
    };
    const dx = x - pointerDrag.lastX;
    const dy = y2 - pointerDrag.lastY;
    const edgeBias = 0.22;
    const useHorizontalEdge = Math.abs(dx) >= Math.abs(dy);
    const useVerticalEdge = Math.abs(dy) > Math.abs(dx);
    const slotX = useHorizontalEdge ? dx >= 0 ? preview.right - tileWidth * edgeBias : preview.left + tileWidth * edgeBias : x;
    const slotY = useVerticalEdge ? dy >= 0 ? preview.bottom - tileHeight * edgeBias : preview.top + tileHeight * edgeBias : y2;
    const columns = Math.max(1, Math.round(gridBox.width / tileWidth));
    const rows = Math.ceil((stationaryTiles.length + draggedTiles.length) / columns);
    const column = Math.max(0, Math.min(columns - 1, Math.floor((slotX - gridBox.left) / tileWidth)));
    const row = Math.max(0, Math.min(rows - 1, Math.floor((slotY - gridBox.top) / tileHeight)));
    const insertionIndex = Math.max(0, Math.min(stationaryTiles.length, row * columns + column));
    return stationaryTiles[insertionIndex] ?? null;
  }
  function updateDragPreview(x, y2) {
    if (!dragPreview) return;
    const width = Number(dragPreview.dataset.width);
    const height = Number(dragPreview.dataset.height);
    dragPreview.style.transform = `translate3d(${x - width / 2}px, ${y2 - height / 2}px, 0)`;
  }
  function createDragPreview(tile, x, y2) {
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
    updateDragPreview(x, y2);
  }
  function removeDragPreview() {
    dragPreview?.remove();
    dragPreview = null;
  }
  function startReorderDrag(tile, x, y2) {
    draggedTile = tile;
    draggedTiles = tile.classList.contains("is-selected") ? [...grid.querySelectorAll(".logo-tile.is-selected")] : [tile];
    draggedTiles.forEach((selectedTile) => selectedTile.classList.add("is-dragging"));
    document.body.classList.add("is-reordering");
    createDragPreview(tile, x, y2);
  }
  function moveDraggedTiles(x, y2) {
    if (!draggedTile) return;
    const anchor = insertionAnchorFromPreview(x, y2);
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
      started: false
    };
    tile.setPointerCapture(event.pointerId);
  });
  grid.addEventListener("pointermove", (event) => {
    if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;
    const distance2 = Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY);
    if (!pointerDrag.started && distance2 > 6) {
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
  copyOrderButton.addEventListener("click", async () => {
    const order = tileOrder().join(", ");
    try {
      await navigator.clipboard.writeText(order);
      setStatus("Copied order");
    } catch {
      window.prompt("Copy this order:", order);
      setStatus("Copy manually");
    }
  });
  resetOrderButton.addEventListener("click", () => {
    [...grid.querySelectorAll(".logo-tile")].sort((a2, b2) => Number(a2.dataset.sortIndex) - Number(b2.dataset.sortIndex)).forEach((tile) => grid.append(tile));
    clearSelection();
    scheduleLogoShaderMask();
    schedulePerIconShaderSync();
    setStatus("Reset order");
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.shiftKey) return;
    if (dialog.open || event.target.closest(".reorder-toolbar")) return;
    if (event.target.closest(".logo-tile.is-selected")) return;
    clearSelection();
  });
  function closeDialog() {
    disposeFullscreenShader();
    dialog.close();
    document.activeElement?.blur?.();
    updateShaderTitle();
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
    updateShaderTitle();
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
      label: "Fluted Glass - Default",
      fragment: flutedGlassFragmentShader,
      speed: 0,
      uniforms: (palette, image, noiseTexture) => ({
        ...commonShaderSizing,
        u_image: image,
        u_noiseTexture: noiseTexture,
        u_colorBack: shaderColor(palette.paper),
        u_colorShadow: shaderColor(palette.ink, 0.45),
        u_colorHighlight: shaderColor(palette.paper, 0.82),
        u_shadows: 0.28,
        u_highlights: 0.16,
        u_size: 0.75,
        u_shape: GlassGridShapes.linesIrregular,
        u_angle: 18,
        u_distortionShape: GlassDistortionShapes.prism,
        u_distortion: 0.54,
        u_shift: 0.08,
        u_stretch: 0.12,
        u_blur: 0.05,
        u_edges: 0.2,
        u_marginLeft: 0,
        u_marginRight: 0,
        u_marginTop: 0,
        u_marginBottom: 0,
        u_grainMixer: 0.08,
        u_grainOverlay: 0.06
      }),
      mipmaps: ["u_image"]
    },
    {
      label: "Fluted Glass - Abstract",
      fragment: flutedGlassFragmentShader,
      speed: 0,
      uniforms: (palette, image, noiseTexture) => ({
        ...commonShaderSizing,
        u_image: image,
        u_noiseTexture: noiseTexture,
        u_colorBack: shaderColor(palette.paper),
        u_colorShadow: shaderColor(palette.ink, 0.52),
        u_colorHighlight: shaderColor(mixColors(palette.paper, palette.ink, 0.18), 0.8),
        u_shadows: 0.44,
        u_highlights: 0.22,
        u_size: 0.68,
        u_shape: GlassGridShapes.pattern,
        u_angle: 64,
        u_distortionShape: GlassDistortionShapes.cascade,
        u_distortion: 0.72,
        u_shift: -0.16,
        u_stretch: 0.32,
        u_blur: 0.1,
        u_edges: 0.34,
        u_marginLeft: 0,
        u_marginRight: 0,
        u_marginTop: 0,
        u_marginBottom: 0,
        u_grainMixer: 0.18,
        u_grainOverlay: 0.1
      }),
      mipmaps: ["u_image"]
    },
    {
      label: "Water - Slow-mo",
      fragment: waterFragmentShader,
      speed: 0.12,
      uniforms: (palette, image) => ({
        ...commonShaderSizing,
        u_image: image,
        u_colorBack: shaderColor(palette.paper),
        u_colorHighlight: shaderColor(palette.ink, 0.28),
        u_highlights: 0.1,
        u_layering: 0.36,
        u_edges: 0.44,
        u_waves: 0.24,
        u_caustic: 0.12,
        u_size: 1.08
      }),
      mipmaps: ["u_image"]
    },
    {
      label: "Image Dithering - Natural",
      fragment: imageDitheringFragmentShader,
      speed: 0,
      uniforms: (palette, image) => ({
        ...commonShaderSizing,
        u_image: image,
        u_colorBack: shaderColor(palette.paper),
        u_colorFront: shaderColor(palette.ink, 0.9),
        u_colorHighlight: shaderColor(mixColors(palette.paper, palette.ink, 0.42), 0.84),
        u_type: DitheringTypes.random,
        u_pxSize: 4,
        u_colorSteps: 4,
        u_originalColors: false,
        u_inverted: false
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
      label: "Halftone Dots - Mosaic",
      fragment: halftoneDotsFragmentShader,
      speed: 0,
      uniforms: (palette, image) => ({
        ...commonShaderSizing,
        u_image: image,
        u_colorBack: shaderColor(palette.paper),
        u_colorFront: shaderColor(mixColors(palette.ink, palette.paper, 0.08)),
        u_originalColors: false,
        u_type: HalftoneDotsTypes.holes,
        u_inverted: false,
        u_grid: HalftoneDotsGrids.square,
        u_size: 0.5,
        u_radius: 1.56,
        u_contrast: 0.58,
        u_grainMixer: 0.2,
        u_grainOverlay: 0.08,
        u_grainSize: 0.62
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
      label: "Halftone CMYK - Newspaper",
      fragment: halftoneCmykFragmentShader,
      speed: 0,
      uniforms: (palette, image, noiseTexture) => ({
        ...commonShaderSizing,
        u_image: image,
        u_noiseTexture: noiseTexture,
        u_colorBack: shaderColor(mixColors(palette.paper, "#f1ead7", 0.36)),
        u_colorC: shaderColor("#1f7fa3", 0.2),
        u_colorM: shaderColor("#8b284b", 0.16),
        u_colorY: shaderColor("#a9822b", 0.16),
        u_colorK: shaderColor(palette.ink, 0.86),
        u_size: 0.12,
        u_gridNoise: 0.08,
        u_type: HalftoneCmykTypes.dots,
        u_softness: 0.38,
        u_contrast: 1.42,
        u_floodC: -0.12,
        u_floodM: -0.12,
        u_floodY: -0.1,
        u_floodK: 0.1,
        u_gainC: -0.08,
        u_gainM: -0.08,
        u_gainY: -0.08,
        u_gainK: 0.34,
        u_grainMixer: 0.18,
        u_grainOverlay: 0.14,
        u_grainSize: 0.74
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
      label: "Heatmap - Sepia",
      perIcon: true,
      logoTexture: "heatmap",
      fragment: heatmapFragmentShader,
      speed: 0.22,
      uniforms: (palette, image) => ({
        ...commonShaderSizing,
        u_image: image,
        u_colorBack: shaderColor(palette.paper, 0),
        u_colors: shaderColors([
          "#2b180f",
          "#70401f",
          "#b87834",
          "#ead2a2",
          mixColors(palette.paper, "#fff4d2", 0.64)
        ]),
        u_colorsCount: 5,
        u_contour: 0.5,
        u_angle: 22,
        u_noise: 0.28,
        u_innerGlow: 0.58,
        u_outerGlow: 0.18
      }),
      mipmaps: ["u_image"]
    },
    {
      label: "Liquid Metal - Default",
      perIcon: true,
      logoTexture: "logo",
      fragment: liquidMetalFragmentShader,
      speed: 0.42,
      uniforms: (palette, image) => ({
        ...commonShaderSizing,
        u_image: image,
        u_colorBack: shaderColor(palette.paper, 0),
        u_colorTint: shaderColor(mixColors(palette.ink, "#b7c7d8", 0.38), 0.72),
        u_repetition: 4.8,
        u_shiftRed: 0.12,
        u_shiftBlue: -0.1,
        u_contour: 0.62,
        u_softness: 0.42,
        u_distortion: 0.48,
        u_angle: 18,
        u_shape: LiquidMetalShapes.none,
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
      label: "Liquid Metal - Stripes",
      perIcon: true,
      logoTexture: "logo",
      fragment: liquidMetalFragmentShader,
      speed: 0.58,
      uniforms: (palette, image) => ({
        ...commonShaderSizing,
        u_image: image,
        u_colorBack: shaderColor(palette.paper, 0),
        u_colorTint: shaderColor(mixColors(palette.ink, "#e5e5e5", 0.48), 0.76),
        u_repetition: 8.2,
        u_shiftRed: 0.26,
        u_shiftBlue: -0.22,
        u_contour: 0.5,
        u_softness: 0.18,
        u_distortion: 0.22,
        u_angle: 124,
        u_shape: LiquidMetalShapes.none,
        u_isImage: true
      }),
      mipmaps: ["u_image"]
    },
    {
      label: "Gem Smoke - Default",
      perIcon: true,
      logoTexture: "logo",
      fragment: gemSmokeFragmentShader,
      speed: 0.28,
      uniforms: (palette, image) => ({
        ...commonShaderSizing,
        u_image: image,
        u_colorBack: shaderColor(palette.paper, 0),
        u_colors: shaderColors([
          mixColors(palette.paper, "#76e4ff", 0.7),
          "#9d80ff",
          mixColors(palette.ink, "#ffffff", 0.28)
        ]),
        u_colorsCount: 3,
        u_innerDistortion: 0.5,
        u_outerDistortion: 0.2,
        u_outerGlow: 0.26,
        u_innerGlow: 0.78,
        u_colorInner: shaderColor(palette.paper, 0.06),
        u_offset: -0.05,
        u_angle: 34,
        u_size: 0.58,
        u_shape: GemSmokeShapes.none,
        u_isImage: true
      }),
      mipmaps: ["u_image"]
    },
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
      label: "Gem Smoke - Fluorescent",
      perIcon: true,
      logoTexture: "logo",
      fragment: gemSmokeFragmentShader,
      speed: 0.46,
      uniforms: (palette, image) => ({
        ...commonShaderSizing,
        u_image: image,
        u_colorBack: shaderColor(palette.paper, 0),
        u_colors: shaderColors(["#00ffb7", "#b7ff00", "#00b8ff", "#ff4dff"]),
        u_colorsCount: 4,
        u_innerDistortion: 0.74,
        u_outerDistortion: 0.34,
        u_outerGlow: 0.4,
        u_innerGlow: 0.92,
        u_colorInner: shaderColor("#ffffff", 0.12),
        u_offset: -0.12,
        u_angle: 118,
        u_size: 0.54,
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
  function sourceLogoImageFromSvg(svg) {
    const image = new Image();
    return new Promise((resolve, reject) => {
      image.addEventListener("load", () => resolve(image), { once: true });
      image.addEventListener("error", () => reject(new Error("Failed to load logo SVG texture")), { once: true });
      image.src = logoSourceUrlFromSvg(svg);
    });
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
  async function lightweightLogoTexture(sourceElement, type) {
    const svg = sourceElement?.matches?.("svg") ? sourceElement : sourceElement?.querySelector?.("svg");
    const image = await sourceLogoImageFromSvg(svg);
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
    for (let i2 = 0; i2 < alpha.length; i2 += 1) {
      alpha[i2] = sourcePixels.data[i2 * 4 + 3] / 255;
    }
    const texture = ctx.createImageData(size, size);
    const output = texture.data;
    if (type === "heatmap") {
      const inverse = new Float32Array(alpha.length);
      for (let i2 = 0; i2 < alpha.length; i2 += 1) {
        inverse[i2] = 1 - alpha[i2];
      }
      const contour = boxBlur(inverse, size, size, 2, 1);
      const outerBlur = boxBlur(inverse, size, size, 18, 2);
      const innerBlur = boxBlur(inverse, size, size, 6, 2);
      for (let i2 = 0; i2 < alpha.length; i2 += 1) {
        const px = i2 * 4;
        output[px] = contour[i2] * 255;
        output[px + 1] = outerBlur[i2] * 255;
        output[px + 2] = innerBlur[i2] * 255;
        output[px + 3] = 255;
      }
    } else {
      const softMask = boxBlur(alpha, size, size, 10, 2);
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
  async function fullscreenShaderImage(preset) {
    const svg = fullscreenLogo.querySelector(".fullscreen-logo-art svg");
    if (!svg) return null;
    if (!preset.logoTexture) {
      return paletteTextureImage(currentPalette);
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
    updateShaderTitle();
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
    const mask = logoMaskUrlFromSvg(svg);
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
      updateShaderTitle();
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
  async function mountShader(index) {
    shaderMount?.dispose();
    shaderMount = null;
    if (shaderLayer) {
      shaderLayer.innerHTML = "";
      shaderLayer.classList.remove("is-active");
    }
    disposePerIconShaders();
    currentShaderIndex = (index % shaderPresets.length + shaderPresets.length) % shaderPresets.length;
    const preset = shaderPresets[currentShaderIndex];
    updateShaderTitle();
    if (dialog.open) {
      await mountFullscreenShader();
    } else {
      disposeFullscreenShader();
      updateShaderTitle();
    }
  }
  function resetShaderView() {
    currentShaderIndex = -1;
    shaderToken += 1;
    shaderMount?.dispose();
    shaderMount = null;
    if (shaderLayer) {
      shaderLayer.innerHTML = "";
      shaderLayer.classList.remove("is-active");
      shaderLayer.style.webkitMaskImage = "";
      shaderLayer.style.maskImage = "";
    }
    disposeFullscreenShader();
    disposePerIconShaders();
    updateShaderTitle();
  }
  function cycleShader(direction) {
    const nextIndex = currentShaderIndex < 0 ? direction > 0 ? 0 : shaderPresets.length - 1 : currentShaderIndex + direction;
    mountShader(nextIndex);
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
  window.addEventListener("resize", scheduleLogoShaderMask);
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
    refreshShaderPalette();
  }
  toggleGradientButton.addEventListener("click", () => {
    gradientMode = !gradientMode;
    toggleGradientButton.setAttribute("aria-pressed", String(gradientMode));
    applyPalette(gradientMode ? randomGradientPalette() : { ink: "#111111", paper: "#ffffff", ratio: 21, source: "Default" });
  });
  document.addEventListener("keydown", (event) => {
    const target = event.target;
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
      toggleGradientButton.setAttribute("aria-pressed", "false");
      applyPalette({ ink: "#111111", paper: "#ffffff", ratio: 21, source: "Default" });
    }
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setLogoScale(logoScale + 0.1);
    }
    if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      setLogoScale(logoScale - 0.1);
    }
  });
})();
