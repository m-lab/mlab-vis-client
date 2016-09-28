import getMetricsParams from '../getMetricsParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformLocationLabel,
  transformClientIspLabel,
  transformTransitIspLabel,
  transformFixedData,
} from '../transforms';


/**
 * Get information for a client ISP + transit ISP in a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspTransitIspInfo(locationId, clientIspId, transitIspId) {
  return get(`/locations/${locationId}/clients/${clientIspId}/servers/${transitIspId}/info`)
    .then(transform(transformFixedData));
}

/**
 * Get time series data for a client ISP + transit ISP in a location in a given time aggregation
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @param {Object} options with startDate and endDate moment objects
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspTransitIspTimeSeries(timeAggregation, locationId, clientIspId, transitIspId, options = {}) {
  const params = getMetricsParams(timeAggregation, options);

  return get(`/locations/${locationId}/clients/${clientIspId}/servers/${transitIspId}/metrics`, params)
    .then(transform(transformLocationLabel, transformClientIspLabel, transformTransitIspLabel, transformTimeSeries));
}


/**
 * Get hourly data for a client ISP + transit ISP in a location in a given time aggregation
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @param {Object} options with startDate and endDate moment objects
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspTransitIspHourly(timeAggregation, locationId, clientIspId, transitIspId, options = {}) {
  const params = getMetricsParams(`${timeAggregation}_hour`, options);

  return get(`/locations/${locationId}/clients/${clientIspId}/servers/${transitIspId}/metrics`, params)
    .then(transform(transformLocationLabel, transformClientIspLabel, transformTransitIspLabel, transformHourly));
}
