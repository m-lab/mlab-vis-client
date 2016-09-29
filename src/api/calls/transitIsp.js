import getMetricsParams from '../getMetricsParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformTransitIspInfo,
  transformTransitIspLabel,
  transformTopLocations,
  transformTopClientIsps,
} from '../transforms';


/**
 * Get information for a transit ISP
 *
 * @param {String} transitIspId The transit ISP to query (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getTransitIspInfo(transitIspId) {
  return get(`/servers/${transitIspId}/info`)
    .then(transform(transformTransitIspInfo));
}

/**
 * Get data for a transit ISP in a given time aggregation.
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} transitIspId The transit ISP to query (e.g., nauswaseattle)
 * @param {Options} object Options with startDate and endDate
 * @return {Promise} A promise after the get request was made
 */
export function getTransitIspTimeSeries(timeAggregation, transitIspId, options = {}) {
  const params = getMetricsParams(timeAggregation, options);
  return get(`/servers/${transitIspId}/metrics`, params)
    .then(transform(transformTransitIspLabel, transformTimeSeries));
}

/**
 * Get hourly data for a transit ISP in a given time aggregation.
 *
 * Converts date field to js Date object, hour to integer, and provides
 * byHour field where the data is grouped by hour
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} transitIspId The transit ISP to query (e.g., nauswaseattle)
 * @param {Options} object Options with startDate and endDate
 * @return {Promise} A promise after the get request was made
 */
export function getTransitIspHourly(timeAggregation, transitIspId, options = {}) {
  const params = getMetricsParams(`${timeAggregation}_hour`, options);
  return get(`/servers/${transitIspId}/metrics`, params)
    .then(transform(transformTransitIspLabel, transformHourly));
}

/**
 * Get the top N locations that have the transit ISP
 *
 * @param {String} transitIspId The transit ISP to query (e.g., AS174)
 * @return {Promise} A promise after the get request was made
 */
export function getTransitIspTopLocations(transitIspId) {
  return get(`/servers/${transitIspId}/locations`)
  .then(transform(transformTopLocations));
}

/**
 * Get the top N Client ISPs that have the transit ISP
 *
 * @param {String} transitIspId The transit ISP to query (e.g., AS174)
 * @return {Promise} A promise after the get request was made
 */
export function getTransitIspTopClientIsps(transitIspId) {
  return get(`/servers/${transitIspId}/clients`)
  .then(transform(transformTopClientIsps));
}
