import superagent from 'superagent';
import config from '../config';

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

/**
 * Get data for a location in a given time aggregation
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} locationKey The location to query (e.g., NA+US+MA+Cambridge)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationMetrics(timeAggregation, locationKey) {
  return get(`/locations/${locationKey}/time/${timeAggregation}/metrics`);
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
