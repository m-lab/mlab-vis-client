import getDateRangeParams from '../getDateRangeParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformClientIspLabel,
  transformFixedData,
} from '../transforms';

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
export function getLocationClientIspTimeSeries(timeAggregation, locationId, clientIspId, transitIspId, options = {}) {
  const params = getDateRangeParams(timeAggregation, options);

  return get(`/locations/${locationId}/time/${timeAggregation}/clients/${clientIspId}/servers/${transitIspId}/metrics`, { params })
    .then(transform(transformClientIspLabel, transformTimeSeries));
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
export function getLocationClientIspHourly(timeAggregation, locationId, clientIspId, transitIspId, options = {}) {
  const params = getDateRangeParams(timeAggregation, options);

  return get(`/locations/${locationId}/time/${timeAggregation}_hour/clients/${clientIspId}/servers/${transitIspId}/metrics`, { params })
    .then(transform(transformClientIspLabel, transformHourly));
}

/**
 * Get information for a client ISP + transit ISP in a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspInfo(locationId, clientIspId, transitIspId) {
  return get(`/locations/${locationId}/clients/${clientIspId}/servers/${transitIspId}/info`)
    .then(transform(transformFixedData));
}
