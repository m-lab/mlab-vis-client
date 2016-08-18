/**
 * Selectors for locationPage
 */

// import { createSelector } from 'reselect';
import { initialLocationState } from '../locations/reducer';

// ----------------------
// Input Selectors
// ----------------------

export function getActiveLocation(state, props) {
  // read in locationId from props
  const { locationId } = props;

  if (locationId == null || !state.locations[locationId]) {
    return initialLocationState;
  }

  return state.locations[locationId];
}

export function getActiveLocationHourly(state, props) {
  const location = getActiveLocation(state, props);
  return location.time.hourly.data;
}

export function getActiveLocationTimeSeries(state, props) {
  const location = getActiveLocation(state, props);
  return location.time.timeSeries.data;
}


// ----------------------
// Selectors
// ----------------------

