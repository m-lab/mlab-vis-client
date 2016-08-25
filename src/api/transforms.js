import d3 from 'd3';
import { metrics } from '../constants';
import { decodeDate } from '../utils/serialization';

// ----------------
// Data Transforms
// ----------------

/* eslint-disable no-param-reassign */

/**
 * Function to help run multiple transformations if `transformed` hasn't already been
 * set on the body.
 *
 * @param {Function} ...transformFuncs Transform functions to call on the body
 * @return {Function} `function (body)`  that runs the transforms on the body
 */
export function transform(...transformFuncs) {
  return function transformApplier(body) {
    if (body.transformed) {
      return body;
    }

    // call each transform func with the output of the previous and return the end result
    // note this assumes each transformFunc modifies body itself
    transformFuncs.reduce((body, transformFunc) => transformFunc(body), body);
    body.transformed = true;

    return body;
  };
}

/**
 * Compute the extent for each of the metrics and for the date
 *
 * @param {Array} points the data points to iterate over
 */
function computeDataExtents(points) {
  // make a key array for all the metrics plus date
  const extentKeys = metrics.reduce((keys, metric) => {
    keys.push(metric.dataKey);
    return keys;
  }, ['date']);

  // for each of the keys, generate an extent
  const extents = extentKeys.reduce((extents, key) => {
    extents[key] = d3.extent(points, d => d[key]);
    return extents;
  }, {});

  const downloadKey = metrics.find(d => d.value === 'download').dataKey;
  const uploadKey = metrics.find(d => d.value === 'upload').dataKey;

  // compute the combined throughput extent
  extents.throughput = [
    Math.min(extents[downloadKey][0] || 0, extents[uploadKey][0] || 0),
    Math.max(extents[downloadKey][1] || 0, extents[uploadKey][1] || 0),
  ];

  return extents;
}


/**
 * Transforms the response from time series data before passing it into
 * the application.
 *
 * - Converts date field to js Date object
 * - Adds in the extent for each of the metrics and the date
 *
 * @param {Object} body The response body
 * @return {Object} The transformed response body
 */
export function transformTimeSeries(body) {
  // NOTE: modifying body directly means it modifies what is stored in the API cache
  if (body.results) {
    const points = body.results;
    points.forEach(d => {
      // convert date from string to Date object
      d.date = decodeDate(d.date);
    });

    // add new entries to the body object
    Object.assign(body, {
      results: points,
      extents: computeDataExtents(points),
    });
  }

  return body;
}

/**
 * Transforms the response from hourly data before passing it into
 * the application.
 *
 * - Converts date field to js Date object
 * - Converts hour to integers
 * - Adds in the extent for each of the metrics and the date
 *
 * @param {Object} body The response body
 * @return {Object} The transformed response body
 */
export function transformHourly(body) {
  // NOTE: modifying body directly means it modifies what is stored in the API cache
  if (body.results) {
    const points = body.results;

    // convert date from string to Date object and hour to number
    points.forEach(d => {
      d.date = decodeDate(d.date);
      d.hour = parseInt(d.hour, 10);
    });

    // add new entries to the body object
    Object.assign(body, {
      results: points,
      extents: computeDataExtents(points),
    });
  }

  return body;
}


/**
 * Transforms the response from search before rest of application uses it.
 *
 * @param {Object} body The response body
 * @return {Object} The transformed response body
 */
export function transformSearchResults(body) {
  // NOTE: modifying body directly means it modifies what is stored in the API cache
  if (body.results) {
    const results = body.results;
    results.forEach(d => {
      // convert date from string to Date object
      d.name = d.meta.location;
      if (d.meta.type === 'city') {
        if (d.meta.client_country === 'United States') {
          d.name += `, ${d.meta.client_region}`;
        } else {
          d.name += `, ${d.meta.client_country}`;
        }
      }
      d.id = d.meta.location_key;
    });

    // add new entries to the body object
    Object.assign(body, {
      results,
    });
  } else {
    Object.assign(body, {
      results: [],
    });
  }

  return body;
}
