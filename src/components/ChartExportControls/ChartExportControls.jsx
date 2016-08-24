import React, { PureComponent, PropTypes } from 'react';
import { saveSvg, saveSvgAsPng } from 'save-svg-as-png';
import { createCsv, download } from '../../utils/exports';

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
