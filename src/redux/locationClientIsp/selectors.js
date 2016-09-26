/**
 * Selectors for locations
 */

// import { createSelector } from 'reselect';
import makeId from './makeId';

// ----------------------
// Helpers
// ----------------------

// helper to find entry for a specific location and client ISP
export function findLocationClientIsp(locationClientIsps, locationId, clientIspId) {
  const id = makeId(locationId, clientIspId);
  return locationClientIsps[id];
}


// ----------------------
// Input Selectors
// ----------------------

/**
 * Input selector to get the map of  client ISP+location
 */
export function getLocationClientIsps(state, props) {
  return state.locationClientIsp;
}

// ----------------------
// Selectors
// ----------------------

