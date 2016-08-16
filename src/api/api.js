import superagent from 'superagent';
import { groupBy } from 'lodash';
import config from '../config';
import { parseDate } from '../utils/utils';
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

/**
 * API Calls
 */
/* eslint-disable no-param-reassign */
/**
 * Get data for a location in a given time aggregation.
 *
 * Converts date field to js Date object
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} locationKey The location to query (e.g., NA+US+MA+Cambridge)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTimeSeries(timeAggregation, locationKey) {
  return get(`/locations/${locationKey}/time/${timeAggregation}/metrics`)
    .then(body => {
      // transform the data before sending it back to the app
      // convert dates to Date objects
      body.metrics.forEach(d => {
        d.date = parseDate(d.date);
      });

      return body;
    });
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
    .then(body => {
      // transform the data before sending it back to the app
      // convert dates to Date objects
      body.metrics.forEach(d => {
        d.date = parseDate(d.date);
        d.hour = parseInt(d.hour, 10);
      });

      body.byHour = groupBy(body.metrics, 'hour');

      return body;
    });
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
