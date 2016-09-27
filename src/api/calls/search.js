import { stringToKey } from '../../utils/format';
import get from '../get';
import {
  transform,
  transformLocationSearchResults,
  transformClientIspSearchResults,
  transformTransitIspSearchResults,
} from '../transforms';

/**
 * Get Search results for a location
 *
 * @param {String} searchQuery search to search for.
 * @return {Promise} A promise after the get request was made
 */
export function getLocationSearch(searchQuery) {
  return get('/locations/search', { q: stringToKey(searchQuery) })
    .then(transform(transformLocationSearchResults));
}

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
 * Get Search results for a transit ISP
 *
 * @param {String} searchQuery search to search for. (e.g. comcas)
 * @return {Promise} A promise after the get request was made
 */
export function getTransitIspSearch(searchQuery) {
  return get('/servers/search', { q: stringToKey(searchQuery) })
    .then(transform(transformTransitIspSearchResults));
}
