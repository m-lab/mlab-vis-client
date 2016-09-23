import React, { PureComponent, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { metrics } from '../../constants';

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
 * @prop {Func} onHover Point hover callback
 */
export default class ScatterGroup extends PureComponent {
  static propTypes = {
    compareMetrics: PropTypes.object,
    fields: PropTypes.array,
    height: PropTypes.number,
    id: React.PropTypes.string,
    onChange: PropTypes.func,
    onHover: PropTypes.func,
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

    this.onMetricChange = this.onMetricChange.bind(this);
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
   * Renders plot
   * @param {Object} field Name and id of group of metrics to show in chart
   * @param {Object} allData Data for the field from summary
   */
  renderPlot(field, allData) {
    const { compareMetrics, width, height } = this.props;
    const data = allData && allData.clientIspsData;
    const xMetric = (compareMetrics && compareMetrics.x) || metrics[0];
    const yMetric = (compareMetrics && compareMetrics.y) || metrics[1];
    const xKey = xMetric.dataKey;
    const yKey = yMetric.dataKey;

    return (
      <Col md={4} key={field.id} className="scatter-plot-container">
        <h4>{field.label}</h4>
        <ScatterPlot
          key={field.id}
          data={data}
          width={width}
          height={height}
          xAxisLabel={xMetric.label}
          xAxisUnit={xMetric.unit}
          xKey={xKey}
          yAxisLabel={yMetric.label}
          yAxisUnit={yMetric.unit}
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
    const { fields, summary } = this.props;
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
          {fields.map((f) => this.renderPlot(f, summary[f.id]))}
        </Row>
      </div>
    );
  }
}
