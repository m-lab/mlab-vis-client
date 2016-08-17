/**
 * Selectors for locationPage
 */

// import { createSelector } from 'reselect';
import { initialLocationState } from '../locations/reducer';

// ----------------------
// Input Selectors
// ----------------------

export function getActiveLocation(state, props) {
  // read in locationId from the URL
  const { locationId } = props.params;

  if (locationId == null || !state.locations[locationId]) {
    return initialLocationState;
  }

  return state.locations[locationId];
}

export function getActiveLocationHourly(state, props) {
  const location = getActiveLocation(state, props);
  return location.time.hourly.data && location.time.hourly.data.byHour;
}

export function getActiveLocationTimeSeries(state, props) {
  const location = getActiveLocation(state, props);
  return location.time.timeSeries.data && location.time.timeSeries.data.metrics;
}

export function getTimeAggregation(state) {
  return state.locationPage.selectedTime.timeAggregation;
}

// ----------------------
// Selectors
// ----------------------

