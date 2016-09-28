import getMetricsParams from '../getMetricsParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformTransitIspLabel,
  transformLocationLabel,
  transformFixedData,
} from '../transforms';


/**
 * Get information for a transit ISP in a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTransitIspInfo(locationId, transitIspId) {
  return get(`/locations/${locationId}/servers/${transitIspId}/info`)
    .then(transform(transformFixedData));
}

/**
 * Get time series data for a transit ISP in a location in a given time aggregation
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @param {Object} options with startDate and endDate moment objects
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTransitIspTimeSeries(timeAggregation, locationId, transitIspId, options = {}) {
  const params = getMetricsParams(timeAggregation, options);

  return get(`/locations/${locationId}/servers/${transitIspId}/metrics`, params)
    .then(transform(transformLocationLabel, transformTransitIspLabel, transformTimeSeries));
}


/**
 * Get hourly data for a transit ISP in a location in a given time aggregation
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} transitIspId The AS number of the ISP (e.g., AS7922)
 * @param {Object} options with startDate and endDate moment objects
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTransitIspHourly(timeAggregation, locationId, transitIspId, options = {}) {
  const params = getMetricsParams(`${timeAggregation}_hour`, options);

  return get(`/locations/${locationId}/servers/${transitIspId}/metrics`, params)
    .then(transform(transformLocationLabel, transformTransitIspLabel, transformHourly));
}
