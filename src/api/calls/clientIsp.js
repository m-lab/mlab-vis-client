import { stringToKey } from '../../utils/format';
import getMetricsParams from '../getMetricsParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformClientIspSearchResults,
  transformClientIspLabel,
  transformClientIspInfo,
} from '../transforms';

/**
 * Get Search results for a client ISP
 *
 * @param {String} searchQuery search to search for. (e.g. comcas)
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspSearch(searchQuery) {
  return get('/clients/search', { q: stringToKey(searchQuery) })
    .then(transform(transformClientIspSearchResults));
}

/**
 * Get information for a client ISP
 *
 * @param {String} clientIspId The client ISP to query (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspInfo(clientIspId) {
  // return get(`/clients/${clientIspId}/info`)
  return get('/locations/nauswa/info')
    .then(transform(transformClientIspInfo(clientIspId)));
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
