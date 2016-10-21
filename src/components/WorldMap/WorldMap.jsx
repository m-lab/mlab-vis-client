import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import addComputedProps from '../../hoc/addComputedProps';

import { pointToFeature, pointsToLine } from '../../utils/geo';

import { createJaggedPoints } from '../../utils/path';

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
  const durationScale = d3.scalePow()
    .exponent(2)
    .domain([0, 20])
    .range([8000, 500])
    .clamp(true);

  path
    .attr('stroke-dasharray', '0,100000') // fix safari flash
    .transition()
    .duration(d => durationScale(d.properties.data.download_speed_mbps))
    .ease(d3.easeQuadOut)
    .attrTween('stroke-dasharray', tweenDash)
    // this should remove dashing on transition end
    // .on('end', function endDashTransition() { d3.select(this).attr('stroke-dasharray', 'none'); })
    .style('stroke-dashoffset', '0%')
    .transition()
    .duration(500)
    // make the line disappear the way it came
    .styleTween('stroke-dashoffset', function dashoffsetTween() {
      const l = this.getTotalLength();
      return t => `-${t * l}px`;
    })
    .remove();
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

  const rScale = d3.scaleSqrt()
    .domain([0, 100])
    .range([2, 18])
    .clamp(true);

  const colors = ['#fd150b', '#ff8314', '#ffc33b', '#f3f5e7', '#6fb7d0', '#2970ac'].reverse();

  const colorScale = d3.scaleLinear()
    .range(colors)
    .domain([1, 5, 10, 15, 20, 30])
    .clamp(true);


  return {
    geoData,
    servers,
    rScale,
    colorScale,
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
    colorScale: PropTypes.func,
    data: PropTypes.array,
    geoData: PropTypes.object,
    location: PropTypes.array,
    rScale: PropTypes.func,
    servers: PropTypes.array,
    updateFrequency: PropTypes.number,
    zoom: PropTypes.number,
  }

  static defaultProps = {
    // position so we can see NA and EU/AS
    location: [25.8, 0],
    updateFrequency: 200,
    zoom: 2,
  }

  constructor(props) {
    super(props);

    this.visibleFeatures = [];

    this.update = this.update.bind(this);
    this.updateViewable = this.updateViewable.bind(this);
    this.projectPoint = this.projectPoint.bind(this);
  }

  /*
   * componentDidMount
   */
  componentDidMount() {
    this.setup();
  }

  componentWillUnmount() {
    this.timer.stop();
  }

  /*
   * Convert d3 / geojson point to leaflet point
   */
  projectPoint(geo, x, y) {
    // NEEDS the map here.
    const point = this.map.latLngToLayerPoint(new L.LatLng(y, x));
    geo.stream.point(point.x, point.y);
  }

  setupDefs(svg) {
    const defs = svg.append('defs');

    const filter = defs.append('filter')
      .attr('width', '300%')
      .attr('x', '-100%')
      .attr('height', '300%')
      .attr('y', '-100%')
      .attr('id', 'glow');

    filter.append('feGaussianBlur')
      .attr('class', 'blur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    const filterIntense = defs.append('filter')
      .attr('width', '300%')
      .attr('x', '-100%')
      .attr('height', '300%')
      .attr('y', '-100%')
      .attr('id', 'glow-intense');

    filterIntense.append('feGaussianBlur')
      .attr('class', 'blur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
  }

  /**
   * Setup Map, background layer, and other globals.
   */
  setup() {
    const { location, zoom, updateFrequency } = this.props;
    if (!this.map) {
      this.map = L.map(this.root,
        { maxZoom: 4, minZoom: 2, scrollWheelZoom: false }
      );
      const layer = Tangram.leafletLayer({
        scene: 'refill-style.yaml',
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
      });

      this.map.setView(location, zoom);
      layer.addTo(this.map);
    }


    this.svg = d3.select(this.map.getPanes().overlayPane).append('svg');
    this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');

    this.setupDefs(this.svg);

    // pointProject needs access to itself (this) and this's (that) map
    const that = this;
    const transform = d3.geoTransform({ point(...args) { that.projectPoint(this, ...args); } });

    // Used in the update to rerender paths
    this.path = d3.geoPath().projection(transform);

    // happens when zooming
    this.map.on('viewreset', this.update());

    // update visual
    this.timer = d3.interval(this.updateViewable, updateFrequency);
  }


  update() {
    const { geoData } = this.props;

    if (!geoData || geoData.features.length === 0) {
      return;
    }

    this.updateBase();
    this.updateClients();
    this.updateBlasts();
    this.updateServers();
    this.updateLines();
  }

  /**
   * Update number of tests being viewed.
   */
  updateViewable() {
    const { geoData } = this.props;

    if (!geoData || geoData.features.length === 0) {
      return;
    }

    // if (this.visibleFeatures.length > 10) return;

    // reset if we reached the limit
    if (this.visibleFeatures.length === geoData.features.length) {
      this.visibleFeatures = [];
    }

    // add in the next feature
    this.visibleFeatures.push(geoData.features[this.visibleFeatures.length]);

    this.update();
  }


  updateBase() {
    const { geoData } = this.props;

    const bounds = this.path.bounds(geoData);
    const topLeft = bounds[0];
    const bottomRight = bounds[1];

    this.svg.attr('width', bottomRight[0] - topLeft[0])
      .attr('height', bottomRight[1] - topLeft[1])
      .style('left', `${topLeft[0]}px`)
      .style('top', `${topLeft[1]}px`);

    this.g.attr('transform', `translate(${-topLeft[0]},${-topLeft[1]})`);
  }

  /**
   * Redraw points on update or zoom
   */
  updateClients() {
    const { colorScale } = this.props;

    // grab those points that are to be 'viewable'
    const viewable = this.visibleFeatures;

    // pointRadius determines radius size of points.
    // set to 0 first.
    this.path.pointRadius(0);

    // CLIENTS
    const clientTransitionSpeed = 1000;
    const clientRadius = 3;

    // bind to viewable points
    const points = this.g.selectAll('.client')
      .data(viewable, (d) => d.id);

    // // points enter
    const pointsE = points.enter()
      .append('path')
      .classed('client', true)
      .style('opacity', 0.0)
      .attr('d', this.path);

    // base point radius on download speed.
    this.path.pointRadius(clientRadius);

    // transition entered points
    pointsE.transition()
      .duration(clientTransitionSpeed)
      .style('opacity', 0.5)
      .attr('d', this.path)
      .style('fill', (d) => colorScale(d.properties.data.download_speed_mbps))
      .style('stroke', (d) => d3.color(colorScale(d.properties.data.download_speed_mbps)).darker(0.2));

    // existing points need to be reprojected in case of zoom
    points
      .attr('d', this.path);

    points
      .exit()
      .remove();
  }

  /**
   * Render the blasts at each client
   */
  updateBlasts() {
    const { colorScale } = this.props;

    const viewable = this.visibleFeatures;
    const blastRadius = 15;
    const blastTransitionSpeed = 2000;
    const blastData = viewable[viewable.length - 1];

    const blast = this.g.selectAll('.blast')
      .data([blastData], (d) => d.id);

    this.path.pointRadius(0);
    const blastE = blast.enter()
      .append('path')
      .classed('blast', true)
      .style('stroke', (d) => d3.color(colorScale(d.properties.data.download_speed_mbps)).brighter(0.4))
      .style('stroke-width', 2)
      .style('fill', 'none')
      .attr('d', this.path)
      .style('stroke-opacity', 1.0)
      .style('filter', 'url(#glow)');

    this.path.pointRadius(blastRadius);
    blastE.transition()
      .duration(blastTransitionSpeed)
      .style('stroke-opacity', 0.0)
      .attr('d', this.path)
      .remove();
  }

  updateServers() {
    const { servers } = this.props;
    // SERVERS
    this.path.pointRadius(3);
    const server = this.g.selectAll('.server')
      .data(servers, (d) => d.id);

    const serverE = server.enter()
      .append('path')
      .classed('server', true)
      .style('fill-opacity', 1.0);

    server.merge(serverE)
      .attr('d', this.path);
  }

  /**
   * Helper to draw lines for each test
   */
  updateLines() {
    const { colorScale } = this.props;

    // LINES
    const viewable = this.visibleFeatures;

    // right now we take the last 50 points to
    // make lines for.
    const minLineIndex = Math.max(0, viewable.length - 50);
    const lineData = viewable.slice(minLineIndex, viewable.length);

    // bind to the line data
    const lines = this.g.selectAll('.line')
      .data(lineData, (d) => d.id);

    const linesE = lines.enter()
      .append('path')
      .classed('line', true)
      .each((d) => {
        d.points = createJaggedPoints(d.properties.clientPos, d.properties.serverPos, 1.1, 2);
        return d;
      });

    // transition callback function
    linesE
      .style('stroke', d => colorScale(d.properties.data.download_speed_mbps))
      .call(transitionLine)
      .attr('d', (d) => this.path(pointsToLine(d.points)));

    // lines exit and remove themselves at the end of transitionLine.
    // it's important to let them reach the end of that transition first
    // since otherwise they'd start exiting before reaching their destination.
  }

  /**
   * Render
   */
  render() {
    const styles = { height: '600px' };

    return (
      <div className="WorldMapContainer">
        <div
          className="WorldMap"
          style={styles}
          ref={node => { this.root = node; }}
        />
        <p>
          Color and line speed represents download speed, with blue being slow and red being fast.
          <br />
          Lines go from a speed test client's location to a MLab's server location. MLab servers are in <span className="server">black</span>.
          <br />
          Data displayed is only a small sample of speed test data from the last three months, with tests extracted from countries worldwide.
        </p>
      </div>
    );
  }
}

export default addComputedProps(visProps)(WorldMap);
