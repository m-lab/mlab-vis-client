import { stringToKey } from '../../utils/format';
import getMetricsParams from '../getMetricsParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformTransitIspSearchResults,
  transformTransitIspInfo,
  transformTransitIspLabel,
} from '../transforms';

/**
 * Get Search results for a transit ISP
 *
 * @param {String} searchQuery search to search for. (e.g. comcas)
 * @return {Promise} A promise after the get request was made
 */
export function getTransitIspSearch(searchQuery) {
  return get('/servers/search', { q: stringToKey(searchQuery) })
    .then(transform(transformTransitIspSearchResults));
}

/**
 * Get information for a transit ISP
 *
 * @param {String} transitIspId The transit ISP to query (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getTransitIspInfo(transitIspId) {
  // return get(`/servers/${clientIspId}/info`)
  return get('/locations/nauswa/info')
    .then(transform(transformTransitIspInfo(transitIspId)));
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
