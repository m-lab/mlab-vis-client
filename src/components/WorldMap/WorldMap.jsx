import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import addComputedProps from '../../hoc/addComputedProps';


import { pointToFeature, pointsToLine } from '../../utils/geo';

import './leaflet.css';
import './WorldMap.scss';


/**
 * Convert data array to geoJson data object.
 * @param {Array} data
 * @return {Object} FeatureCollection of objects.
 */
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

/*
 * Dashed line interpolation hack from
 * https://bl.ocks.org/mbostock/5649592
 */
function tweenDash() {
  const l = this.getTotalLength();
  const i = d3.interpolateString(`0,${l}`, `${l},${l}`);
  return function dasher(t) { return i(t); };
}

/*
 * transition line callback. Could be part of class.
 * adds dashed line transition
 */
function transitionLine(path) {
  path.transition()
    .duration(6500)
    .ease(d3.easeQuadOut)
    .attrTween('stroke-dasharray', tweenDash)
    // this should remove dashing on transition end
    .on('end', function endDashTransition() { d3.select(this).attr('stroke-dasharray', 'none'); });
}

/*
 * Add props related to visualization
 */
function visProps(props) {
  const {
    data,
  } = props;

  if (!data) {
    return {};
  }

  const geoData = dataToGeoJson(data);
  const servers = geoData.features.map((d, i) => pointToFeature(i, d.properties.serverPos));

  return {
    geoData,
    servers,
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
    geoData: PropTypes.object,
    location: PropTypes.array,
    servers: PropTypes.array,
    updateFrequency: PropTypes.number,
    zoom: PropTypes.number,
  }

  static defaultProps = {
    location: [25.8, -34.8],
    updateFrequency: 200,
    zoom: 3,
  }

  constructor(props) {
    super(props);

    // TODO: this is a variable that is incremented by a timer
    // where should it go? Adding it to state causes unnecessary renders.
    this.viewableIndex = 1;

    this.updatePoints = this.updatePoints.bind(this);
    this.updateViewable = this.updateViewable.bind(this);
    this.projectPoint = this.projectPoint.bind(this);
  }

  componentDidMount() {
    this.setup();
  }

  /*
   * Convert d3 / geojson point to leaflet point
   */
  projectPoint(geo, x, y) {
    // NEEDS the map here.
    const point = this.map.latLngToLayerPoint(new L.LatLng(y, x)); // eslint-disable-line
    geo.stream.point(point.x, point.y);
  }

  /**
   * Setup Map, background layer, and other globals.
   */
  setup() {
    const { location, zoom, updateFrequency } = this.props;
    this.map = L.map(this.root, // eslint-disable-line
        { maxZoom: 4, minZoom: 1 }
    );

    const layer = Tangram.leafletLayer({ // eslint-disable-line
      scene: 'refill-style.yaml',
      attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
    });

    this.map.setView(location, zoom);
    layer.addTo(this.map);

    this.svg = d3.select(this.map.getPanes().overlayPane).append('svg');
    this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');

    // pointProject needs access to itself (this) and this's (that) map
    const that = this;
    const transform = d3.geoTransform({ point(...args) { that.projectPoint(this, ...args); } });

    // Used in the update to rerender paths
    this.path = d3.geoPath().projection(transform);

    this.map.on('viewreset', this.updatePoints);

    // update visual
    this.timer = d3.interval(this.updateViewable, updateFrequency);
  }


  /**
   * Update viewable index.
   */
  updateViewable() {
    const { geoData } = this.props;

    if (!geoData || geoData.features.length === 0) {
      return;
    }

    this.viewableIndex += 1;

    this.updatePoints();

    if (this.viewableIndex >= geoData.features.length) {
      this.timer.stop();
    }
  }

  /**
   * Redraw points on update or zoom
   */
  updatePoints() {
    const { geoData, servers } = this.props;
    // const { viewableIndex } = this.state;

    if (!geoData || geoData.features.length === 0) {
      return;
    }

    const bounds = this.path.bounds(geoData);
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
    this.path.pointRadius((d) => pointScale(d.properties.data.download_speed_mbps));

    const viewable = geoData.features.slice(0, this.viewableIndex);

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
      .attr('d', this.path)
      .style('fill', 'black');


      // LINES

    this.path.pointRadius(3);
    const minLineIndex = Math.max(0, viewable.length - 50);

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

    lines.exit()
      .transition()
      .duration(200)
      .style('stroke-opacity', 0.0)
      .remove();

    lines.merge(linesE)
      .attr('d', (d) => this.path(pointsToLine([d.properties.clientPos, d.properties.serverPos])))
      .style('stroke', 'black');


    // SERVERS
    this.path.pointRadius(3);
    const server = this.g.selectAll('.server')
      .data(servers, (d) => d.id);

    const serverE = server.enter()
      .append('path')
      .classed('server', true)
      .style('fill-opacity', 0.5);

    server.merge(serverE)
      .attr('d', this.path);
  }

  /**
   * Render
   */
  render() {
    const styles = { width: '100%', height: '600px' };

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
