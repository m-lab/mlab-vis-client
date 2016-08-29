import React, { PureComponent, PropTypes } from 'react';
import { saveSvg, saveSvgAsPng } from 'save-svg-as-png';
import { createCsv, download } from '../../utils/exports';

import './ChartExportControls.scss';

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
    this.onSavePng = this.onSavePng.bind(this);
    this.onSaveSvg = this.onSaveSvg.bind(this);
    this.onSaveJson = this.onSaveJson.bind(this);
    this.onSaveCsv = this.onSaveCsv.bind(this);

    this.outputs = [
      { label: 'PNG', handler: this.onSavePng },
      { label: 'SVG', handler: this.onSaveSvg },
      { label: 'JSON', handler: this.onSaveJson },
      { label: 'CSV', handler: this.onSaveCsv },
    ];
  }

  onSavePng() {
    const { chartId, filename } = this.props;
    const svg = document.getElementById(chartId);
    saveSvgAsPng(svg, `${filename}.png`);
  }

  onSaveSvg() {
    const { chartId, filename } = this.props;
    const svg = document.getElementById(chartId);
    saveSvg(svg, `${filename}.svg`);
  }

  onSaveJson() {
    const { data, filename } = this.props;
    const jsonDataString = JSON.stringify(data);
    download(jsonDataString, 'application/json', `${filename}.json`);
  }

  onSaveCsv() {
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
              <button onClick={output.handler}>
                {output.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
