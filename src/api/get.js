import superagent from 'superagent';
import config from '../config';
import LRUCache from './LRUCache';

const apiCache = new LRUCache(config.apiCacheLimit);
const searchCache = new LRUCache(config.searchCacheLimit);

/**
 * Formats a URL to go via the API server
 *
 * @param {String} path the relative path of the API call
 */
function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  // Prepend API root
  return `${config.apiRoot}${adjustedPath}`;
}

/**
 * Create a caching key based on the URL
 *
 * @param {String} path the URL path
 * @param {Object} params the query parameters
 * @return {String} the cache key
 */
function urlCacheKey(path, params) {
  return JSON.stringify({ path, params });
}

/**
 * Makes an AJAX get request
 *
 * @param {String} path The relative API URL to request from
 * @param {Object} query The request query params
 * @return {Promise} The promise for the request
 */
export default function get(path, query) {
  // simple validation by ensuring no consecutive slashes. since we work with relative
  // URLs, this is fine (does not receive paths including http://)
  if (path.includes('//')) {
    return Promise.reject(`Missing URL parameters: ${path}`);
  }

  // choose the cache based on the type
  let cache;
  if (/search$/.test(path)) {
    cache = searchCache;
  } else {
    cache = apiCache;
  }

  return new Promise((resolve, reject) => {
    // check for a cached response
    const cacheKey = urlCacheKey(path, query);
    const cached = cache.get(cacheKey);

    // found in cache
    if (cached) {
      resolve(cached);
      return;
    }

    // wasn't cached, so make a request
    const request = superagent.get(formatUrl(path));

    // add in query parameters
    if (query) {
      request.query(query);
    }

    request.end((err, { body } = {}) => {
      // reject if there was an error or there is an error key in the body
      if (err || (body && body.error)) {
        reject(body || err);
      }

      // wasn't an error, so cache the result.
      // since the body is what is cached, this happens before transformations
      // if you want to cache transformed data, modify the body object directly
      // and make sure your transform checks to see if the data is already
      // transformed.
      cache.put(cacheKey, body);
      resolve(body);
    });
  });
}
