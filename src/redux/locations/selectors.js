/**
 * Selectors for locations
 */

// import { createSelector } from 'reselect';
import { initialState } from './reducer';
import status from '../status';

// ----------------------
// Input Selectors / Helpers
// ----------------------
export function getLocations(state) {
  return state.locations;
}

export function getLocation(state, props, locationId) {
  // read in locationId from props if not provided explicitly
  if (locationId == null) {
    locationId = props.locationId;
  }

  if (locationId == null || !state.locations[locationId]) {
    return initialState;
  }

  return state.locations[locationId];
}


export function getLocationInfo(state, props, locationId) {
  const location = getLocation(state, props, locationId);
  return location.info.data;
}

export function getLocationFixed(state, props, locationId) {
  const location = getLocation(state, props, locationId);
  return location.fixed.data;
}

export function getLocationHourly(state, props, locationId) {
  const location = getLocation(state, props, locationId);
  return location.time.hourly.data;
}

export function getLocationHourlyStatus(state, props, locationId) {
  const location = getLocation(state, props, locationId);
  return status(location.time.hourly);
}

export function getLocationTimeSeries(state, props, locationId) {
  const location = getLocation(state, props, locationId);
  return location.time.timeSeries.data;
}

export function getLocationTimeSeriesStatus(state, props, locationId) {
  const location = getLocation(state, props, locationId);
  return status(location.time.timeSeries);
}

export function getLocationTopClientIsps(state, props, locationId) {
  const location = getLocation(state, props, locationId);
  return location.topClientIsps.data;
}

// ----------------------
// Selectors
// ----------------------

