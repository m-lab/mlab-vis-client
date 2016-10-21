import React, { PureComponent, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { metrics } from '../../constants';
import { colorsFor } from '../../utils/color';
import { multiExtent } from '../../utils/array';
import d3 from '../../d3';
import { ScatterPlot, SelectableDropdown } from '../../components';

import './ScatterGroup.scss';

/**
 * A group of scatterplots
 *
 * @prop {Array} fields The ids / labels of the different fields to show plots for
 * @prop {Object} summary Summary data for ISPs
 * @prop {Number} height The height of the charts
 * @prop {Number} width The width of the charts
 * @prop {Func} onChange Metric change callback
 */
export default class ScatterGroup extends PureComponent {
  static propTypes = {
    compareMetrics: PropTypes.object,
    fields: PropTypes.array,
    height: PropTypes.number,
    id: React.PropTypes.string,
    onChange: PropTypes.func,
    summary: PropTypes.object,
    width: PropTypes.number,
  }

  static defaultProps = {
    width: 250,
    height: 250,
  }

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    this.state = {
      highlightPointId: null,
    };

    this.onMetricChange = this.onMetricChange.bind(this);
    this.onHighlightPoint = this.onHighlightPoint.bind(this);
  }

  /**
   * callback for when metric to compare changes
   * @param {String} compareName either 'x' or 'y'
   * @param {String} metricValue new value.
   */
  onMetricChange(compareName, metricValue) {
    const { onChange } = this.props;

    if (onChange) {
      onChange(compareName, metricValue);
    }
  }

  /**
   * Callback when a point is highlighted
   * @param {Object} highlightPoint the point to highlight
   */
  onHighlightPoint(highlightPointId) {
    this.setState({
      highlightPointId,
    });
  }

  /**
   * Renders plot
   * @param {Object} field Name and id of group of metrics to show in chart
   * @param {Object} data Data for the field from summary
   */
  renderPlot(field, data, xExtent, yExtent, colors) {
    const { compareMetrics, width, height } = this.props;
    const { highlightPointId } = this.state;

    const xMetric = (compareMetrics && compareMetrics.x) || metrics[0];
    const yMetric = (compareMetrics && compareMetrics.y) || metrics[1];
    const xKey = xMetric.dataKey;
    const yKey = yMetric.dataKey;

    return (
      <Col md={4} key={field.id} className="scatter-plot-container">
        <h4>{field.label}</h4>
        <ScatterPlot
          key={field.id}
          colors={colors}
          data={data}
          width={width}
          height={height}
          highlightPointId={highlightPointId}
          onHighlightPoint={this.onHighlightPoint}
          xAxisLabel={xMetric.label}
          xAxisUnit={xMetric.unit}
          xExtent={xExtent}
          xFormatter={xMetric.formatter}
          xKey={xKey}
          yAxisLabel={yMetric.label}
          yAxisUnit={yMetric.unit}
          yExtent={yExtent}
          yFormatter={yMetric.formatter}
          yKey={yKey}
        />
      </Col>
    );
  }

  /**
   * Render dropdown
   * @param {String} name 'x' or 'y'
   */
  renderDropDown(name) {
    const { compareMetrics } = this.props;

    const activeMetric = compareMetrics[name];
    return (
      <SelectableDropdown
        items={metrics}
        key={name}
        name={name}
        active={activeMetric}
        onChange={this.onMetricChange}
      />
    );
  }

  /**
   * Render
   */
  render() {
    const { fields, summary, compareMetrics } = this.props;

    // find the x and y keys
    const xMetric = (compareMetrics && compareMetrics.x) || metrics[0];
    const yMetric = (compareMetrics && compareMetrics.y) || metrics[1];
    const xKey = xMetric.dataKey;
    const yKey = yMetric.dataKey;

    // compute the shared extents
    const combinedData = {};
    const dataIds = {};
    fields.forEach(f => {
      const allData = summary[f.id];

      if (allData) {
        // filter out those with no data
        combinedData[f.id] = [allData.locationData].concat(allData.clientIspsData)
          .filter(d => d != null && d[yKey] != null && d[xKey] != null);

        // register the client ISP ID exists
        allData.clientIspsData.forEach(d => { dataIds[d.id] = d.id; });
      }
    });

    // compute the max extents across all data in all charts
    const xExtent = multiExtent(d3.values(combinedData), d => d[xKey]);
    const yExtent = multiExtent(d3.values(combinedData), d => d[yKey]);

    // compute the shared colors based only on client ISP IDs (location gets default: gray)
    const colors = colorsFor(d3.values(dataIds));

    return (
      <div className="ScatterGroup">
        <Row>
          <Col md={12}>
            <div>
              Comparing {this.renderDropDown('x')} with {this.renderDropDown('y')}
            </div>
          </Col>
        </Row>
        <Row>
          {fields.map((f) => this.renderPlot(f, combinedData[f.id], xExtent, yExtent, colors))}
        </Row>
      </div>
    );
  }
}
