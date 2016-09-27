/**
 * Selectors for locations + client ISP + transit ISP
 */

// import { createSelector } from 'reselect';
import makeId from './makeId';

// ----------------------
// Helpers
// ----------------------

// helper to find entry for a specific location and client ISP and transit ISP
export function findLocationClientIspTransitIsp(locationClientIspTransitIsps, locationId, clientIspId, transitIspId) {
  const id = makeId(locationId, clientIspId, transitIspId);
  return locationClientIspTransitIsps[id];
}


// ----------------------
// Input Selectors
// ----------------------

/**
 * Input selector to get the map of client ISP+location+transit ISP
 */
export function getLocationClientIspTransitIsps(state, props) {
  return state.locationClientIspTransitIsp;
}

// ----------------------
// Selectors
// ----------------------

