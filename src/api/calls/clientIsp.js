import getMetricsParams from '../getMetricsParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformClientIspLabel,
  transformClientIspInfo,
  transformTopLocations,
  transformTopTransitIsps,
} from '../transforms';


/**
 * Get information for a client ISP
 *
 * @param {String} clientIspId The client ISP to query (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspInfo(clientIspId) {
  return get(`/clients/${clientIspId}/info`)
    .then(transform(transformClientIspInfo));
}

/**
 * Get data for a client ISP in a given time aggregation.
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} clientIspId The client ISP to query (e.g., nauswaseattle)
 * @param {Options} object Options with startDate and endDate
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspTimeSeries(timeAggregation, clientIspId, options = {}) {
  const params = getMetricsParams(timeAggregation, options);
  return get(`/clients/${clientIspId}/metrics`, params)
    .then(transform(transformClientIspLabel, transformTimeSeries));
}

/**
 * Get hourly data for a client ISP in a given time aggregation.
 *
 * Converts date field to js Date object, hour to integer, and provides
 * byHour field where the data is grouped by hour
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} clientIspId The client ISP to query (e.g., nauswaseattle)
 * @param {Options} object Options with startDate and endDate
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspHourly(timeAggregation, clientIspId, options = {}) {
  const params = getMetricsParams(`${timeAggregation}_hour`, options);
  return get(`/clients/${clientIspId}/metrics`, params)
    .then(transform(transformClientIspLabel, transformHourly));
}

/**
 * Get the top N locations that have the client ISP
 *
 * @param {String} clientIspId The client ISP to query (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspTopLocations(clientIspId) {
  return get(`/clients/${clientIspId}/locations`)
    .then(transform(transformTopLocations));
}

/**
 * Get the top N Transit ISPs that have the client ISP
 *
 * @param {String} clientIspId The client ISP to query (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspTopTransitIsps(clientIspId) {
  return get(`/clients/${clientIspId}/servers`)
    .then(transform(transformTopTransitIsps));
}
