import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import addComputedProps from '../../hoc/addComputedProps';


import { pointToFeature, pointsToLine } from '../../utils/geo';

import './leaflet.css';
import './WorldMap.scss';


function dataToGeoJson(data) {
  const features = data.map((d, i) => {
    const clientPos = [+d.meta.client_longitude, +d.meta.client_latitude];
    const serverPos = [+d.meta.server_longitude, +d.meta.server_latitude];
    const feature = pointToFeature(i, clientPos);
    feature.properties = {
      clientPos,
      serverPos,
      data: d.data,
      meta: d.meta,
    };

    return feature;
  });

  return { type: 'FeatureCollection', features };
}

function tweenDash() {
  const l = this.getTotalLength();
  const i = d3.interpolateString(`0,${l}`, `${l},${l}`);
  return function dasher(t) { return i(t); };
}


function transitionLine(path) {
  path.transition()
  .duration(6500)
  .ease(d3.easeQuadOut)
  .attrTween('stroke-dasharray', tweenDash)
  .on('end', function endDashTransition() { d3.select(this).attr('stroke-dasharray', 'none'); });
}

function visProps(props) {
  const {
    data,
  } = props;

  if (!data) {
    return {};
  }

  const geoData = dataToGeoJson(data);

  return {
    geoData,
  };
}

/**
 * A component that lets the user choose from a list of values
 *
 * @prop {Any} active The value of the active item
 * @prop {Object[]} items The items { label, value } to select from
 * @prop {Function} onChange change callback
 */
class WorldMap extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    geoData: PropTypes.array,
    location: PropTypes.array,
    zoom: PropTypes.number,
  }

  static defaultProps = {
    location: [41.484375, 49.83798245308484],
    zoom: 3,
  }

  constructor(props) {
    super(props);

    this.state = {
      viewableIndex: 1,
    };

    this.updatePoints = this.updatePoints.bind(this);
    this.updateViewable = this.updateViewable.bind(this);
    this.projectPoint = this.projectPoint.bind(this);
  }

  componentDidMount() {
    const { location, zoom } = this.props;
    this.map = L.map(this.root,
        { maxZoom: 5 }
    );

    const layer = Tangram.leafletLayer({
      scene: 'refill-style.yaml',
      attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
    });

    this.map.setView(location, zoom);
    layer.addTo(this.map);

    this.timer = d3.interval(this.updateViewable, 200);
  }

  projectPoint(x, y) {
    const point = this.map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  update() {
    this.updatePoints();
  }

  updateViewable() {
    const { geoData } = this.props;
    let { viewableIndex } = this.state;

    if (!geoData) {
      return;
    }

    viewableIndex += 1;
    this.setState({
      viewableIndex,
    });

    this.updatePoints();

    if (viewableIndex >= geoData.features.length) {
      this.timer.stop();
    }
  }

  updatePoints() {
    const { geoData } = this.props;
    const { viewableIndex } = this.state;

    if (!geoData) {
      return;
    }

    const transform = d3.geoTransform({ point: this.projectPoint });
    const path = d3.geoPath().projection(transform);

    const bounds = path.bounds(geoData);
    const topLeft = bounds[0];
    const bottomRight = bounds[1];

    this.svg.attr('width', bottomRight[0] - topLeft[0])
      .attr('height', bottomRight[1] - topLeft[1])
      .style('left', `${topLeft[0]}px`)
      .style('top', `${topLeft[1]}px`);

    this.g.attr('transform', `translate(${-topLeft[0]},${-topLeft[1]})`);

    const pointScale = d3.scaleSqrt()
      .domain([0, 100])
      .range([2, 18])
      .clamp(true);

      // CLIENTS
    path.pointRadius((d) => pointScale(d.properties.data.download_speed_mbps));

    const viewable = geoData.features.slice(0, viewableIndex);

    const points = this.g.selectAll('.client')
      .data(viewable, (d) => d.id);

    const pointsE = points.enter()
      .append('path')
      .classed('client', true)
      .style('fill-opacity', 0.0);

    pointsE.transition()
      .duration(500)
      .style('fill-opacity', 0.5);

    points
      .style('fill-opacity', 0.5);

    points.exit().remove();

    points.merge(pointsE)
      .attr('d', path)
      .style('fill', 'black');


      // LINES

    path.pointRadius(3);
    const minLineIndex = Math.max(0, viewable.length - 100);

    const lineData = viewable.slice(minLineIndex, viewable.length);

    const lines = this.g.selectAll('.line')
      .data(lineData, (d) => d.id);

    const linesE = lines.enter()
      .append('path')
      .classed('line', true)
      .style('stroke', 'black')
      .style('fill', 'none')
      .style('stroke-opacity', 0.5);


    linesE
      .call(transitionLine);

      // linesE.transition()
      //   .delay(400)
      //   .duration(200)
      //   .style('stroke-opacity', 0.5)

    lines.exit()
      .transition()
      .duration(200)
      .style('stroke-opacity', 0.0)
      .remove();

    lines.merge(linesE)
      // .attr("d", (d) => path(jankLine(d.properties.clientPos, d.properties.serverPos, 10)))
      .attr('d', (d) => path(pointsToLine([d.properties.clientPos, d.properties.serverPos])))
      .style('stroke', 'black');


      // SERVERS
    const servers = geoData.features.map((d, i) => pointToFeature(i, d.properties.serverPos));

    path.pointRadius(3);
    const server = this.g.selectAll('.server')
      .data(servers, (d) => d.id);


    const serverE = server.enter()
      .append('path')
      .classed('server', true)
      .style('fill-opacity', 0.5);

    server.exit().remove();
    server.merge(serverE)
      .attr('d', path)
      .style('fill-opacity', 0.5)
      .style('fill', 'red');
  }


  render() {
    const styles = { width: '1100px', height: '500px' };

    return (
      <div
        className="WorldMap"
        style={styles}
        ref={node => { this.root = node; }}
      />
    );
  }
}

export default addComputedProps(visProps)(WorldMap);
