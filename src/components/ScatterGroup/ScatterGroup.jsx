import React, { PureComponent, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';

import { ScatterPlot } from '../../components';

import './ScatterGroup.scss';

/**
 * Chart for showing dots
 *
 * @prop {Array} data The array of data points indexed by hour. Should be
 *   an array of length 24 of form [{ hour:Number(0..23), points: [{ yKey:Number }, ...]}, ...]
 * @prop {Number} height The height of the chart
 * @prop {Function} onHover Callback for when a point is hovered on
 * @prop {Number} width The width of the chart
 * @prop {Array} yExtent The min and max value of the yKey in the chart
 * @prop {String} yKey="y" The key in the data points to read the y value from
 */
export default class ScatterGroup extends PureComponent {
  static propTypes = {
    fields: PropTypes.array,
    height: PropTypes.number,
    id: React.PropTypes.string,
    onHover: PropTypes.func,
    summary: PropTypes.object,
    width: PropTypes.number,
    xKey: PropTypes.string,
    yKey: PropTypes.string,
  }

  static defaultProps = {
    yKey: 'y',
    xKey: 'x',
    width: 200,
    height: 200,
  }

  renderPlot(field, allData) {
    const { width, height, ...other } = this.props;
    const data = allData ? allData.clientIspsData : [];
    console.log(data);
    return (
      <Col md={3} key={field.id} className="scatter-plot-container">
        <h4>{field.label}</h4>
        <ScatterPlot
          key={field.id}
          data={data}
          width={width}
          height={height}
          {...other}
        />
      </Col>
    );
  }

  render() {
    const { fields, summary } = this.props;
    return (
      <div className="ScatterGroup">
        <Row>
          {fields.map((f) => this.renderPlot(f, summary[f.id]))}
        </Row>
      </div>
    );
  }
}
