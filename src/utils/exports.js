/**
 * Module for handling exporting data (e.g. as JSON or CSV)
 */
import { encodeDate } from './serialization';
import moment from 'moment';

/**
 * Create a Blob object from the data string
 */
export function createBlob(dataString, mimeType) {
  // convert to byte array to maintain UTF-8 encoding
  const uint8 = new Uint8Array(dataString.length);
  for (let i = 0; i < uint8.length; i++) {
    uint8[i] = dataString.charCodeAt(i);
  }

  const blob = new Blob([uint8], { type: mimeType });
  return blob;
}

/**
 * Very similar to what is used in save-svg-as-png
 * https://github.com/exupero/saveSvgAsPng/blob/gh-pages/saveSvgAsPng.js
 */
export function download(dataString, mimeType, filename) {
  const blob = createBlob(dataString, mimeType);

  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const a = document.createElement('a');
    a.download = filename;
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
  }
}

/**
 * Create CSV from an array of objects.
 */
export function createCsv(data) {
  if (!data || !data.length) {
    return '';
  }

  // discover all columns
  const columnsDiscover = {};

  data.forEach(d => {
    Object.keys(d).forEach(column => {
      columnsDiscover[column] = true;
    });
  });
  // use the keys from the discover map as the list of columns
  const columns = Object.keys(columnsDiscover);

  // convert all objects in the data array to lines
  const lines = data.map(d =>
    columns.map(column => {
      const value = d[column];

      // escape double quotes for strings and wrap them in double quotes
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      } else if (value instanceof Date || moment.isMoment(value)) {
        return encodeDate(value);
      }

      return value;
    }).join(',')
  );

  // join all lines with new line character to make one big string and return it
  return `${[columns.join(','), ...lines].join('\n')}\n`;
}

/**
 * Take metrics data of form { meta, results: [...] } and flatten it
 * to integrate meta into each result item
 */
function mergeMetaIntoResults({ meta = {}, results = [] } = {}) {
  return results.map(d => ({ ...meta, ...d }));
}

/**
 * Take metrics data for line charts and convertthem for CSV.
 * Uses mergeMetaIntoResults.
 */
export function prepareMetricsLineChartForCsv(data = []) {
  const [series = [], annotationSeries = []] = data;

  return [].concat(series, annotationSeries).reduce((combined, dataset) => {
    const flattened = mergeMetaIntoResults(dataset);
    return combined.concat(flattened);
  }, []);
}
