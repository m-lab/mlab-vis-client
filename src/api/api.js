import superagent from 'superagent';
import { groupBy } from 'lodash';
import d3 from 'd3';
import config from '../config';
import { decodeDate } from '../utils/serialization';
import { metrics } from '../constants';

/**
 * Formats a URL to go via the API server
 *
 * @param {String} path the relative path of the API call
 */
function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  // Prepend API root
  return `${config.apiRoot}${adjustedPath}`;
}

/**
 * Makes an AJAX get request
 *
 * @param {String} path The relative API URL to request from
 * @param {Object} options The request options
 * @param {Object} options.params The query parameters
 * @param {Any} options.data The data to send with the request
 * @return {Promise} The promise for the request
 */
function get(path, { params, data } = {}) {
  return new Promise((resolve, reject) => {
    const request = superagent.get(formatUrl(path));

    // add in query parameters
    if (params) {
      request.query(params);
    }

    // add in data
    if (data) {
      request.send(data);
    }

    request.end((err, { body } = {}) => {
      // reject is there was an error or there is an error key in the body
      if (err || (body && body.error)) {
        reject(body || err);
      }

      resolve(body);
    });
  });
}

// ----------------
// Data Transforms
// ----------------

/* eslint-disable no-param-reassign */
/**
 * Compute the extent for each of the metrics and for the date
 *
 * @param {Array} points the data points to iterate over
 */
function computeDataExtents(points) {
  // make a key array for all the metrics plus date
  const extentKeys = metrics.reduce((keys, metric) => {
    keys.push(metric.dataKey);
    return keys;
  }, ['date']);

  // for each of the keys, generate an extent
  const extents = extentKeys.reduce((extents, key) => {
    extents[key] = d3.extent(points, d => d[key]);
    return extents;
  }, {});

  return extents;
}

/**
 * Transforms the response from time series data before passing it into
 * the application.
 *
 * - Converts date field to js Date object
 * - Adds in the extent for each of the metrics and the date
 *
 * @param {Object} body The response body
 * @return {Object} The transformed response body
 */
function transformTimeSeries(body) {
  if (body.results) {
    const points = body.results;
    points.forEach(d => {
      // convert date from string to Date object
      d.date = decodeDate(d.date);
    });

    // overwrite the results with the transformed data
    body.results = {
      points,
      extents: computeDataExtents(points),
    };
  }

  return body;
}

/**
 * Transforms the response from hourly data before passing it into
 * the application.
 *
 * - Converts date field to js Date object
 * - Converts hour to integers
 * - Adds in the extent for each of the metrics and the date
 *
 * @param {Object} body The response body
 * @return {Object} The transformed response body
 */
function transformHourly(body) {
  if (body.results) {
    const points = body.results;

    // convert date from string to Date object and hour to number
    points.forEach(d => {
      d.date = decodeDate(d.date);
      d.hour = parseInt(d.hour, 10);
    });

    // overwrite the results with the transformed data
    body.results = {
      points,
      extents: computeDataExtents(points),
    };
  }

  return body;
}


// -------------
// API Calls
// -------------

/**
 * Get data for a location in a given time aggregation.
 *
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} locationKey The location to query (e.g., NA+US+MA+Cambridge)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTimeSeries(timeAggregation, locationKey) {
  return get(`/locations/${locationKey}/time/${timeAggregation}/metrics`)
    .then(transformTimeSeries);
}

/**
 * Get hourly data for a location in a given time aggregation.
 *
 * Converts date field to js Date object, hour to integer, and provides
 * byHour field where the data is grouped by hour
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} locationKey The location to query (e.g., NA+US+MA+Cambridge)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationHourly(timeAggregation, locationKey) {
  return get(`/locations/${locationKey}/time/${timeAggregation}_hour/metrics`)
    .then(transformHourly);
}

/**
 * Get data for a client ISP in a location in a given time aggregation
 * @param {String} locationKey The location to query (e.g., NA+US+MA+Cambridge)
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} clientISP The AS number of the ISP (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientISPMetrics(timeAggregation, locationKey, clientISP) {
  return get(`/locations/${locationKey}/time/${timeAggregation}/clientisps/${clientISP}/metrics`);
}
