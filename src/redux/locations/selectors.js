// import { createSelector } from 'reselect';
import { initialLocationState } from './reducer';

// ----------------------
// Input Selectors
// ----------------------

export function getActiveLocation(state) {
  // TODO- get proper location ID
  const activeLocationId = 'NA+US+MA+Cambridge';
  return state.locations[activeLocationId] || initialLocationState;
}

export function getHourly(state) {
  const location = getActiveLocation(state);
  return location.time.hourly.data && location.time.hourly.data.byHour;
}

export function getTimeSeries(state) {
  const location = getActiveLocation(state);
  return location.time.timeSeries.data && location.time.timeSeries.data.metrics;
}


// ----------------------
// Selectors
// ----------------------

