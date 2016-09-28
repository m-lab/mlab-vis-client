import { stringToKey } from '../../utils/format';
import get from '../get';
import {
  transform,
  transformLocationSearchResults,
  transformClientIspSearchResults,
  transformTransitIspSearchResults,
} from '../transforms';

/**
 * Create the params that map the API endpoint for a potentially filtered search
 */
function searchParams(searchQuery, searchFilterType, searchFilterItemIds = []) {
  const params = {
    q: stringToKey(searchQuery),
  };

  if (searchFilterType) {
    const filterTypeMap = {
      location: 'locations',
      clientIsp: 'clients',
      transitIsp: 'servers',
    };

    params.filtertype = filterTypeMap[searchFilterType];
    params.filtervalue = searchFilterItemIds.join(',');
  }

  return params;
}

/**
 * Get Search results for a location
 *
 * @param {String} searchQuery search to search for.
 * @return {Promise} A promise after the get request was made
 */
export function getLocationSearch(searchQuery, searchFilterType, searchFilterItemIds) {
  return get('/locations/search', searchParams(searchQuery, searchFilterType, searchFilterItemIds))
    .then(transform(transformLocationSearchResults));
}

/**
 * Get Search results for a client ISP
 *
 * @param {String} searchQuery search to search for. (e.g. comcas)
 * @return {Promise} A promise after the get request was made
 */
export function getClientIspSearch(searchQuery, searchFilterType, searchFilterItemIds) {
  return get('/clients/search', searchParams(searchQuery, searchFilterType, searchFilterItemIds))
    .then(transform(transformClientIspSearchResults));
}

/**
 * Get Search results for a transit ISP
 *
 * @param {String} searchQuery search to search for. (e.g. comcas)
 * @return {Promise} A promise after the get request was made
 */
export function getTransitIspSearch(searchQuery, searchFilterType, searchFilterItemIds) {
  return get('/servers/search', searchParams(searchQuery, searchFilterType, searchFilterItemIds))
    .then(transform(transformTransitIspSearchResults));
}
