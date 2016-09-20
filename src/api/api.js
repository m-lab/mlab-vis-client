import get from './get';
import {
  transform,
  transformTimeSeries,
  transformHourly,
  transformLocationSearchResults,
  transformClientIspSearchResults,
  transformClientIspLabel,
  transformLocationInfo,
  transformLocationLabel,
  transformFixedData,
  transformMapMeta,
} from './transforms';

const DATE_FORMATS = {
  day: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY',
};

/**
 * Get information for a location
 *
 * @param {String} timeAggregation either day, month, or year
 * @param {Object} options with optional startDate and endDate
 * @return {Array} array of parameters for start and end date
 */
function getDateRangeParams(timeAggregation, options) {
  const params = {};
  const dateFormat = DATE_FORMATS[timeAggregation];
  if (options.startDate) {
    params.startdate = options.startDate.format(dateFormat);
    // params.push(`startdate=${options.startDate.format(dateFormat)}`);
  }
  if (options.endDate) {
    // params.push(`enddate=${options.endDate.format(dateFormat)}`);
    params.enddate = options.endDate.format(dateFormat);
  }

  return params;
}

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
  const params = getDateRangeParams(timeAggregation, options);

  return get(`/locations/${locationId}/time/${timeAggregation}/clientisps/${clientIspId}/metrics`, { params })
    .then(transform(transformClientIspLabel, transformTimeSeries));
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
  const params = getDateRangeParams(timeAggregation, options);

  return get(`/locations/${locationId}/time/${timeAggregation}_hour/clientisps/${clientIspId}/metrics`, { params })
    .then(transform(transformClientIspLabel, transformHourly));
}

/**
 * Get the top N ISPs in a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationTopClientIsps(locationId) {
  return get(`/locations/${locationId}/clientisps`)
    .then(transform(transformMapMeta));
}


/**
 * Get Search results for a location
 *
 * @param {String} searchQuery search to search for.
 * @return {Promise} A promise after the get request was made
 */
export function getLocationSearch(searchQuery) {
  return get(`/locations/search/${searchQuery}`)
    .then(transform(transformLocationSearchResults));
}

/**
 * Get information for a client ISP in a location
 *
 * @param {String} locationId The location to query (e.g., nauswaseattle)
 * @param {String} clientIspId The AS number of the ISP (e.g., AS7922)
 * @return {Promise} A promise after the get request was made
 */
export function getLocationClientIspInfo(locationId, clientIspId) {
  return get(`/locations/${locationId}/clientisps/${clientIspId}/info`)
    .then(transform(transformFixedData));
}


/**
 * Get Search results for a client ISP
 *
 * @param {String} searchQuery search to search for.
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspSearch(searchQuery) {
  return get(`/client_asns/search/${searchQuery}`)
    .then(transform(transformClientIspSearchResults));
}
