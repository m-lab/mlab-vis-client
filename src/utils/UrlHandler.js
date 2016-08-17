/**
 * Functions for working with URL parameters via react-router
 */

import { decode, encode } from './serialization';

export default class UrlHandler {
  /**
   * Constructor
   * @param {Object} urlQueryConfig Should take the form `{ key: { type, defaultValue }, ... }`.
   */
  constructor(urlQueryConfig, router) {
    this.config = urlQueryConfig;
  }

  /**
   * Decodes a query based on the config.
   *
   * @param {Object} query The query object (typically from props.location.query)
   * @return {Object} the decoded values `{ key: decodedValue, ... }`
   */
  decodeQuery(query) {
    return Object.keys(this.config).reduce((decoded, key) => {
      const keyConfig = this.config[key];
      decoded[key] = decode(keyConfig.type, query[key], keyConfig.defaultValue)
      return decoded;
    }, {});
  }

  /**
   * Replaces the value for `key` in the query and returns the
   * new location object. If `router` is provided, router.replace
   * is called to update the URL.
   *
   * @param {Object} location react-router's location object (props.location)
   * @param {String} key the key to replace, should be in this.config
   * @param {Any} value The value to encode in the query for the key
   * @param {Object} [router] The react-router router.
   */
  replaceInQuery(location, key, value, router) {
    const keyConfig = this.config[key];

    // create the new location object
    const newLocation = {
      ...location,
      query: {
        ...location.query,
        [key]: encode(keyConfig.type, value),
      },
    }

    // remove if it is the default value
    if (value === keyConfig.defaultValue) {
      delete newLocation.query[key];
    }

    // if router is available, replace the URL
    if (router) {
      router.replace(newLocation);
    }

    return newLocation;
  }
}
