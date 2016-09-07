
import d3 from 'd3';
import { mod } from './math';


const HCL_COLORS = [
  [58, 41.304, 34.656],
  [298, 75.161, 42.059],
  [137, 64.651, 58.731],
  [328, 84.426, 53.029],
  [120, 47.749, 58.34],
  [311, 82.059, 43.205],
  [98, 51.58, 57.183],
  [313, 67.87, 28.574],
  [64, 62.705, 58.549],
  [284, 55.45, 55.61],
  [37, 74.374, 52.407],
  [304, 65.081, 55.232],
  [127, 39.378, 37.807],
  [340, 73.623, 55.366],
  [165, 36.472, 56.113],
  [359, 66.681, 52.232],
  [269, 34.85, 55.85],
  [39, 58.141, 37.967],
  [297, 49.28, 31.17],
  [77, 39.453, 52.82],
  [321, 66.556, 56.371],
  [37, 43.641, 57.443],
  [304, 36.142, 30.132],
  [14, 56.059, 50.812],
  [309, 43.404, 55.378],
  [15, 38.89, 30.752],
  [333, 60.682, 40.155],
  [345, 42.869, 60.46],
  [335, 43.323, 26.682],
  [345, 39.365, 43.355],
];

/**
 * color for isps
 */
export function hashAsn(asnNumber, maxCount) {
  if (!asnNumber) {
    return 0;
  }
  const asn = +(asnNumber.replace(/\D+/g, ''));
  return mod(asn, maxCount);
}

/**
 * color for isps
 */
function varyColor(colors, overlaps) {
  overlaps.forEach((overlap) => {
    const length = overlap.values.length;
    if (length > 1) {
      let brightenToggle = true;
      let k = 1.0;
      let i = 1;
      // Start at the 2nd overlapping index
      for (i = 1; i < length; i++) {
        const index = overlap.values[i].index;
        colors[index] = (brightenToggle) ? colors[index].brighter(k) : colors[index].darker(k);
        brightenToggle = !brightenToggle;
        if (brightenToggle) {
          k += 1.0;
        }
      }
    }
  });

  return colors;
}

/**
 * create an array of colors, one for each value in values
 */
export function extractColors(values, valueAccessor = d => d, hashFunction = hashAsn) {
  const maxCount = HCL_COLORS.length;
  const indexes = values.map((v, i) => ({ index: i, hash: hashFunction(valueAccessor(v), maxCount) }));

  const colors = indexes.map((h) => d3.hcl(...HCL_COLORS[h.hash]));


  const overlaps = d3.nest()
    .key((d) => d.hash)
    .entries(indexes);

  const variedColors = varyColor(colors, overlaps);

  return variedColors.map((c) => c.toString());
}

/**
 * create an object with keys as values, mapped to colors
 */
export function colorsFor(values, valueAccessor = d => d, hashFunction = hashAsn) {
  const colors = extractColors(values, valueAccessor, hashFunction);
  const colorMap = {};
  colors.forEach((color, index) => {
    colorMap[valueAccessor(values[index])] = color;
  });

  return colorMap;
}
