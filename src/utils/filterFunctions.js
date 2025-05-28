// src/utils/filterFunctions.js

export const applyFilter = (imageData, filterName) => {
  const data = imageData.data;

  switch (filterName) {
    case "moon":
      for (let i = 0; i < data.length; i += 4) {
        const avg = ((data[i] + data[i + 1] + data[i + 2]) / 3) * 1.1;
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
      break;

    case "gingham":
      for (let i = 0; i < data.length; i += 4) {
        let [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        r *= 1.05;
        g *= 1.05;
        b *= 1.05;
        r = (r - 128) * 0.9 + 128;
        g = (g - 128) * 0.9 + 128;
        b = (b - 128) * 0.9 + 128;
        const sr = r * 0.393 + g * 0.769 + b * 0.189;
        const sg = r * 0.349 + g * 0.686 + b * 0.168;
        const sb = r * 0.272 + g * 0.534 + b * 0.131;
        r = r * 0.96 + sr * 0.04;
        g = g * 0.96 + sg * 0.04;
        b = b * 0.96 + sb * 0.04;
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;

    case "slumber":
      for (let i = 0; i < data.length; i += 4) {
        let [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        r *= 0.65;
        g *= 0.65;
        b *= 0.65;
        const gray = r * 0.2126 + g * 0.7152 + b * 0.0722;
        r = gray + (r - gray) * 1.1;
        g = gray + (g - gray) * 1.1;
        b = gray + (b - gray) * 1.1;
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;

    case "lark":
      for (let i = 0; i < data.length; i += 4) {
        let [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        r = (r - 128) * 1.1 + 128;
        g = (g - 128) * 1.1 + 128;
        b = (b - 128) * 1.1 + 128;
        const gray = r * 0.2126 + g * 0.7152 + b * 0.0722;
        r = gray + (r - gray) * 1.15;
        g = gray + (g - gray) * 1.15;
        b = gray + (b - gray) * 1.15;
        r *= 1.05;
        g *= 1.05;
        b *= 1.05;
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;

    case "reyes":
      for (let i = 0; i < data.length; i += 4) {
        let [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        const sr = r * 0.393 + g * 0.769 + b * 0.189;
        const sg = r * 0.349 + g * 0.686 + b * 0.168;
        const sb = r * 0.272 + g * 0.534 + b * 0.131;
        r = r * 0.8 + sr * 0.2;
        g = g * 0.8 + sg * 0.2;
        b = b * 0.8 + sb * 0.2;
        r = (r - 128) * 0.9 + 128;
        g = (g - 128) * 0.9 + 128;
        b = (b - 128) * 0.9 + 128;
        r *= 1.05;
        g *= 1.05;
        b *= 1.05;
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;

    case "juno":
      const cosA = Math.cos((-10 * Math.PI) / 180);
      const sinA = Math.sin((-10 * Math.PI) / 180);
      const m = [
        0.213 + cosA * 0.787 - sinA * 0.213,
        0.715 - cosA * 0.715 - sinA * 0.715,
        0.072 - cosA * 0.072 + sinA * 0.928,
        0.213 - cosA * 0.213 + sinA * 0.143,
        0.715 + cosA * 0.285 + sinA * 0.14,
        0.072 - cosA * 0.072 - sinA * 0.283,
        0.213 - cosA * 0.213 - sinA * 0.787,
        0.715 - cosA * 0.715 + sinA * 0.715,
        0.072 + cosA * 0.928 + sinA * 0.072,
      ];
      for (let i = 0; i < data.length; i += 4) {
        let [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        const r2 = r * m[0] + g * m[1] + b * m[2];
        const g2 = r * m[3] + g * m[4] + b * m[5];
        const b2 = r * m[6] + g * m[7] + b * m[8];
        r = r2;
        g = g2;
        b = b2;
        r = (r - 128) * 1.05 + 128;
        g = (g - 128) * 1.05 + 128;
        b = (b - 128) * 1.05 + 128;
        const sr = r * 0.213 + g * 0.715 + b * 0.072;
        r = sr + (r - sr) * 1.2;
        g = sr + (g - sr) * 1.2;
        b = sr + (b - sr) * 1.2;
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;

    default:
      // "no filter" 또는 알 수 없는 경우 처리 없음
      break;
  }

  return imageData;
};
