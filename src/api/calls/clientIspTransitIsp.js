import getMetricsParams from '../getMetricsParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformTransitIspLabel,
  transformFixedData,
} from '../transforms';


/**
 * Get information for a transit ISP in a clientIsp
 *
 * @param {String} clientIspId The clientIsp to query (e.g., nauswaseattle)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspTransitIspInfo(clientIspId, transitIspId) {
  return get(`/clients/${clientIspId}/servers/${transitIspId}/info`)
    .then(transform(transformFixedData));
}

/**
 * Get time series data for a transit ISP in a clientIsp in a given time aggregation
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} clientIspId The clientIsp to query (e.g., nauswaseattle)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @param {Object} options with startDate and endDate moment objects
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspTransitIspTimeSeries(timeAggregation, clientIspId, transitIspId, options = {}) {
  const params = getMetricsParams(timeAggregation, options);

  return get(`/clients/${clientIspId}/servers/${transitIspId}/metrics`, params)
    .then(transform(transformTransitIspLabel, transformTimeSeries));
}


/**
 * Get hourly data for a transit ISP in a clientIsp in a given time aggregation
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} clientIspId The clientIsp to query (e.g., nauswaseattle)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @param {Object} options with startDate and endDate moment objects
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspTransitIspHourly(timeAggregation, clientIspId, transitIspId, options = {}) {
  const params = getMetricsParams(`${timeAggregation}_hour`, options);

  return get(`/clients/${clientIspId}/servers/${transitIspId}/metrics`, params)
    .then(transform(transformTransitIspLabel, transformHourly));
}
