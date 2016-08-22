import superagent from 'superagent';
import d3 from 'd3';
import config from '../config';
import { decodeDate } from '../utils/serialization';
import { metrics } from '../constants';
import LRUCache from './LRUCache';

const apiCache = new LRUCache(config.apiCacheLimit);
if (__DEVELOPMENT__ && __CLIENT__) {
  console.log('[dev] apiCache = ', apiCache);
  window.apiCache = apiCache;
}

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
 * Create a caching key based on the URL
 *
 * @param {String} path the URL path
 * @param {Object} params the query parameters
 * @return {String} the cache key
 */
function urlCacheKey(path, params) {
  return JSON.stringify({ path, params });
}

/**
 * Makes an AJAX get request
 *
 * @param {String} path The relative API URL to request from
 * @param {Object} options The request options
 * @param {Object} options.params The query parameters
 * @return {Promise} The promise for the request
 */
function get(path, { params } = {}) {
  return new Promise((resolve, reject) => {
    // check for a cached response
    const cacheKey = urlCacheKey(path, params);
    const cached = apiCache.get(cacheKey);

    // found in cache
    if (cached) {
      resolve(cached);
      return;
    }

    // wasn't cached, so make a request
    const request = superagent.get(formatUrl(path));

    // add in query parameters
    if (params) {
      request.query(params);
    }

    request.end((err, { body } = {}) => {
      // reject if there was an error or there is an error key in the body
      if (err || (body && body.error)) {
        reject(body || err);
      }

      // wasn't an error, so cache the result
      apiCache.put(cacheKey, body);
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

  const downloadKey = metrics.find(d => d.value === 'download').dataKey;
  const uploadKey = metrics.find(d => d.value === 'upload').dataKey;

  // compute the combined throughput extent
  extents.throughput = [
    Math.min(extents[downloadKey][0] || 0, extents[uploadKey][0] || 0),
    Math.max(extents[downloadKey][1] || 0, extents[uploadKey][1] || 0),
  ];

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
  // NOTE: modifying body directly means it modifies what is stored in the API cache
  if (body.results && !body.transformed) {
    // set the transformed flag to true so we do not do this more than once
    // (this helps in the case of cached data)
    body.transformed = true;

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
  // NOTE: modifying body directly means it modifies what is stored in the API cache
  if (body.results && !body.transformed) {
    // set the transformed flag to true so we do not do this more than once
    // (this helps in the case of cached data)
    body.transformed = true;

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
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTimeSeries(timeAggregation, locationId) {
  return get(`/locations/${locationId}/time/${timeAggregation}/metrics`)
    .then(transformTimeSeries);
}

/**
 * Get hourly data for a location in a given time aggregation.
 *
 * Converts date field to js Date object, hour to integer, and provides
 * byHour field where the data is grouped by hour
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationHourly(timeAggregation, locationId) {
  return get(`/locations/${locationId}/time/${timeAggregation}_hour/metrics`)
    .then(transformHourly);
}

/**
 * Get data for a client ISP in a location in a given time aggregation
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspMetrics(timeAggregation, locationId, clientIspId) {
  return get(`/locations/${locationId}/time/${timeAggregation}/clientisps/${clientIspId}/metrics`)
    .then(transformTimeSeries);
}

/**
 * Get the top N ISPs in a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIsps(locationId) {
  return get(`/locations/${locationId}/clientisps`);
}
