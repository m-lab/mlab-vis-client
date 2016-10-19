import getMetricsParams from '../getMetricsParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformClientIspLabel,
  transformLocationLabel,
  transformFixedData,
} from '../transforms';


/**
 * Get information for a client ISP in a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspInfo(locationId, clientIspId) {
  return get(`/locations/${locationId}/clients/${clientIspId}/info`)
    .then(transform(transformFixedData, transformClientIspLabel));
}

/**
 * Get time series data for a client ISP in a location in a given time aggregation
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @param {Object} options with startDate and endDate moment objects
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspTimeSeries(timeAggregation, locationId, clientIspId, options = {}) {
  const params = getMetricsParams(timeAggregation, options);

  return get(`/locations/${locationId}/clients/${clientIspId}/metrics`, params)
    .then(transform(transformLocationLabel, transformClientIspLabel, transformTimeSeries));
}


/**
 * Get hourly data for a client ISP in a location in a given time aggregation
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @param {Object} options with startDate and endDate moment objects
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspHourly(timeAggregation, locationId, clientIspId, options = {}) {
  const params = getMetricsParams(`${timeAggregation}_hour`, options);

  return get(`/locations/${locationId}/clients/${clientIspId}/metrics`, params)
    .then(transform(transformLocationLabel, transformClientIspLabel, transformHourly));
}
