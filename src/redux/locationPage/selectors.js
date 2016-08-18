/**
 * Selectors for locationPage
 */

// import { createSelector } from 'reselect';
import { initialLocationState } from '../locations/reducer';
import { metrics } from '../../constants';

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

export function getHighlightHourly(state) {
  return state.locationPage.highlightHourly;
}

/**
 * Input selector to get the currently viewed metric
 * @param {Object} state the redux state
 * @param {Object} props the react props with URL query params included
 */
export function getViewMetric(state, props) {
  const value = props.viewMetric || 'download';
  let metric = metrics.find(metric => metric.value === value);
  if (!metric) {
    if (__DEVELOPMENT__) {
      console.warn('Metric not found', value, '-- using download');
    }

    metric = metrics[0];
  }

  return metric;
}


// ----------------------
// Selectors
// ----------------------
