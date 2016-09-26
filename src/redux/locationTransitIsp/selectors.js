/**
 * Selectors for locations + transit ISP
 */

// import { createSelector } from 'reselect';
import makeId from './makeId';

// ----------------------
// Helpers
// ----------------------

// helper to find entry for a specific location and transit ISP
export function findLocationTransitIsp(locationTransitIsps, locationId, transitIspId) {
  const id = makeId(locationId, transitIspId);
  return locationTransitIsps[id];
}


// ----------------------
// Input Selectors
// ----------------------

/**
 * Input selector to get the map of transit ISP+location
 */
export function getLocationTransitIsps(state, props) {
  return state.locationTransitIsp;
}

// ----------------------
// Selectors
// ----------------------

