import { stringToKey } from '../../utils/format';
import getDateRangeParams from '../getDateRangeParams';
import get from '../get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformLocationSearchResults,
  transformLocationInfo,
  transformLocationLabel,
  transformFixedData,
  transformMapMeta,
} from '../transforms';

/**
 * Get information for a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationInfo(locationId) {
  return get(`/locations/${locationId}/info`)
    .then(transform(transformLocationInfo, transformFixedData));
}

/**
 * Get data for a location in a given time aggregation.
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {Options} object Options with startDate and endDate
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTimeSeries(timeAggregation, locationId, options = {}) {
  const params = getDateRangeParams(timeAggregation, options);
  return get(`/locations/${locationId}/time/${timeAggregation}/metrics`, { params })
    .then(transform(transformLocationLabel, transformTimeSeries));
}

/**
 * Get hourly data for a location in a given time aggregation.
 *
 * Converts date field to js Date object, hour to integer, and provides
 * byHour field where the data is grouped by hour
 *
 * @param {String} timeAggregation The aggregation of the data (one of day, month, year)
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {Options} object Options with startDate and endDate
 * @return {Promise} A promise after the get request was made
 */
export function getLocationHourly(timeAggregation, locationId, options = {}) {
  const params = getDateRangeParams(timeAggregation, options);
  return get(`/locations/${locationId}/time/${timeAggregation}_hour/metrics`, { params })
    .then(transform(transformLocationLabel, transformHourly));
}

/**
 * Get the top N ISPs in a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTopClientIsps(locationId) {
  return get(`/locations/${locationId}/clients`)
    .then(transform(transformMapMeta));
}


/**
 * Get Search results for a location
 *
 * @param {String} searchQuery search to search for.
 * @return {Promise} A promise after the get request was made
 */
export function getLocationSearch(searchQuery) {
  return get('/locations/search', { params: { q: stringToKey(searchQuery) } })
    .then(transform(transformLocationSearchResults));
}
