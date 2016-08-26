import get from './get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformSearchResults,
} from './transforms';

// -------------
// API Calls
// -------------

/**
 * Get data for a location in a given time aggregation.
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTimeSeries(timeAggregation, locationId) {
  return get(`/locations/${locationId}/time/${timeAggregation}/metrics`)
    .then(transform(transformTimeSeries));
}

/**
 * Get hourly data for a location in a given time aggregation.
 *
 * Converts date field to js Date object, hour to integer, and provides
 * byHour field where the data is grouped by hour
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationHourly(timeAggregation, locationId) {
  return get(`/locations/${locationId}/time/${timeAggregation}_hour/metrics`)
    .then(transform(transformHourly));
}

/**
 * Get data for a client ISP in a location in a given time aggregation
 * @param {String} timeAggregation The aggregation of the data (one of day, month,
 *    year, day_hour, month_hour, year_hour)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspTimeSeries(timeAggregation, locationId, clientIspId) {
  return get(`/locations/${locationId}/time/${timeAggregation}/clientisps/${clientIspId}/metrics`)
    .then(transform(transformTimeSeries));
}

/**
 * Get the top N ISPs in a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIsps(locationId) {
  return get(`/locations/${locationId}/clientisps`);
}


/**
 * Get Search results for a location
 *
 * @param {String} searchQuery search to search for.
 * @return {Promise} A promise after the get request was made
 */
export function getLocationSearch(searchQuery) {
  return get(`/locations/search/${searchQuery}`)
    .then(transform(transformSearchResults));
}
