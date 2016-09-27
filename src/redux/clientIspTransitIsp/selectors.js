/**
 * Selectors for client ISP + transit ISP
 */

// import { createSelector } from 'reselect';
import makeId from './makeId';

// ----------------------
// Helpers
// ----------------------

// helper to find entry for a specific clientIsp and transit ISP
export function findClientIspTransitIsp(clientIspTransitIsps, clientIspId, transitIspId) {
  const id = makeId(clientIspId, transitIspId);
  return clientIspTransitIsps[id];
}


// ----------------------
// Input Selectors
// ----------------------

/**
 * Input selector to get the map of transit ISP+clientIsp
 */
export function getClientIspTransitIsps(state, props) {
  return state.clientIspTransitIsp;
}

// ----------------------
// Selectors
// ----------------------

