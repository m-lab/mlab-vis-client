import superagent from 'superagent';
import config from '../config';
import LRUCache from './LRUCache';

const apiCache = new LRUCache(config.apiCacheLimit);
if (__DEVELOPMENT__ && __CLIENT__) {
  console.log('[dev] apiCache = ', apiCache);
  window.apiCache = apiCache;
}

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
 * @param {Object} options The request options
 * @param {Object} options.params The query parameters
 * @return {Promise} The promise for the request
 */
export default function get(path, { params } = {}) {
  return new Promise((resolve, reject) => {
    // check for a cached response
    const cacheKey = urlCacheKey(path, params);
    const cached = apiCache.get(cacheKey);

    // found in cache
    if (cached) {
      resolve(cached);
      return;
    }

    // wasn't cached, so make a request
    const request = superagent.get(formatUrl(path));

    // add in query parameters
    if (params) {
      request.query(params);
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
      apiCache.put(cacheKey, body);
      resolve(body);
    });
  });
}

