import React, { PureComponent, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import { colorsFor } from '../../utils/color';
import { Histogram } from '../../components';

import './HistoGroup.scss';

/**
 * A group of histograms
 */
export default class HistoGroup extends PureComponent {
  static propTypes = {
    // The ids / labels of the different fields to show plots for
    fields: PropTypes.array,

    // The height of an individual chart
    height: PropTypes.number,

    // Summary data for ISPs
    summary: PropTypes.object,
    viewMetric: PropTypes.object,

    // The width of an individual chart
    width: PropTypes.number,
    yExtent: PropTypes.array,
    yFormatter: PropTypes.func,
  }

  static defaultProps = {
    width: 300,
    height: 250,
    yExtent: [0, 100],
  }

  constructor(props) {
    super(props);

    this.state = {
      highlightBin: null,
    };

    this.onHighlightBin = this.onHighlightBin.bind(this);
  }

  /**
   * Callback when a bin is highlighted
   * @param {Object} highlightBin the bin to highlight
   */
  onHighlightBin(highlightBin) {
    this.setState({
      highlightBin,
    });
  }

  renderPlot(info, bins, color) {
    const { width, height, viewMetric, yExtent, yFormatter } = this.props;
    const { highlightBin } = this.state;

    if (!bins) {
      return null;
    }

    return (
      <Col md={4} key={info.id}>
        <p className="truncate">{info.label}</p>
        <Histogram
          bins={bins}
          width={width}
          height={height}
          highlightBin={highlightBin}
          onHighlightBin={this.onHighlightBin}
          id={info.id}
          color={color}
          binStart={viewMetric.binStart}
          binWidth={viewMetric.binWidth}
          xFormatter={viewMetric.formatter}
          xAxisLabel={viewMetric.label}
          xAxisUnit={viewMetric.unit}
          yExtent={yExtent}
          yFormatter={yFormatter}
        />
      </Col>
    );
  }

  /**
   * Renders plot
   * @param {Object} field Name and id of group of metrics to show in chart
   * @param {Object} allData Data for the field from summary
   */
  renderPlots(field, allData) {
    const { viewMetric } = this.props;
    const data = allData ? allData.clientIspsData : [];
    const binSets = data.map((d) => d[viewMetric.percentBinKey]);
    const colors = colorsFor(data, (d) => d.id);

    return (
      <Row key={field.id} className="histogram-row">
        <Col md={12}>
          <h4>{field.label}</h4>
        </Col>
        {binSets.map((bins, i) => this.renderPlot(data[i], bins, colors[data[i].id]))}
      </Row>
    );
  }

  /**
   * Render
   */
  render() {
    const { fields, summary } = this.props;
    return (
      <div className="HistoGroup">
        {fields.map((f) => this.renderPlots(f, summary[f.id]))}
      </div>
    );
  }
}
