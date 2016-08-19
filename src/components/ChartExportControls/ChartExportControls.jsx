import React, { PureComponent, PropTypes } from 'react';
import { saveSvg, saveSvgAsPng } from 'save-svg-as-png';
import { encodeDate } from '../../utils/serialization';

function createBlob(dataString, mimeType) {
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
function download(dataString, mimeType, filename) {
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
function createCsv(data) {
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
      } else if (value instanceof Date) {
        return encodeDate(value);
      }

      return value;
    }).join(',')
  );

  // join all lines with new line character to make one big string and return it
  return [columns.join(','), ...lines].join('\n');
}

/**
 * A component that exports charts in a variety of ways
 */
export default class ChartExportControls extends PureComponent {
  static propTypes = {
    chartId: PropTypes.string.isRequired,
    data: PropTypes.any,
    filename: PropTypes.string,
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.handleSavePng = this.handleSavePng.bind(this);
    this.handleSaveSvg = this.handleSaveSvg.bind(this);
    this.handleSaveJson = this.handleSaveJson.bind(this);
    this.handleSaveCsv = this.handleSaveCsv.bind(this);

    this.outputs = [
      { label: 'PNG', handler: this.handleSavePng },
      { label: 'SVG', handler: this.handleSaveSvg },
      { label: 'JSON', handler: this.handleSaveJson },
      { label: 'CSV', handler: this.handleSaveCsv },
    ];
  }

  handleSavePng() {
    const { chartId, filename } = this.props;
    const svg = document.getElementById(chartId);
    saveSvgAsPng(svg, `${filename}.png`);
  }

  handleSaveSvg() {
    const { chartId, filename } = this.props;
    const svg = document.getElementById(chartId);
    saveSvg(svg, `${filename}.svg`);
  }

  handleSaveJson() {
    const { data, filename } = this.props;
    const jsonDataString = JSON.stringify(data);
    download(jsonDataString, 'application/json', `${filename}.json`);
  }

  handleSaveCsv() {
    const { data, filename } = this.props;
    const csvDataString = createCsv(data);
    download(csvDataString, 'application/csv', `${filename}.csv`);
  }

  render() {
    return (
      <div className="chart-export-controls">
        <ul className="list-inline">
          {this.outputs.map(output => (
            <li key={output.label}>
              <button className="btn btn-xs btn-default" onClick={output.handler}>
                {output.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
