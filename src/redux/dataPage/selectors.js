/**
 * Selectors for dataPage
 */
import { createSelector } from 'reselect';
// import { colorsFor } from '../../utils/color';
import timeAggregationFromDates from '../../utils/timeAggregationFromDates';
import * as LocationsSelectors from '../locations/selectors';
import * as ClientIspsSelectors from '../clientIsps/selectors';
import * as TransitIspsSelectors from '../transitIsps/selectors';

// ----------------------
// Input Selectors
// ----------------------
export function getAutoTimeAggregation(state) {
  return state.dataPage.autoTimeAggregation;
}

export function getTimeAggregation(state, props) {
  let { timeAggregation } = props;

  // this sets the default value
  if (timeAggregation == null) {
    timeAggregation = timeAggregationFromDates(props.startDate, props.endDate);
  }

  return timeAggregation;
}

function getLocationIds(state, props) {
  return props.locationIds;
}

function getClientIspIds(state, props) {
  return props.clientIspIds;
}

function getTransitIspIds(state, props) {
  return props.transitIspIds;
}

// ----------------------
// Selectors
// ----------------------
export const getLocations = createSelector(
  getLocationIds, LocationsSelectors.getLocations,
  (locationIds, allLocations) => {
    if (locationIds && allLocations) {
      const locations = locationIds.map(id => allLocations[id]).filter(d => d != null);
      return locations;
    }

    return [];
  }
);

export const getLocationInfos = createSelector(
  getLocations,
  (locations) => locations.map(location => location.info.data)
    .filter(d => d != null));


export const getClientIsps = createSelector(
  getClientIspIds, ClientIspsSelectors.getClientIsps,
  (clientIspIds, allClientIsps) => {
    if (clientIspIds && allClientIsps) {
      const clientIsps = clientIspIds.map(id => allClientIsps[id]).filter(d => d != null);
      return clientIsps;
    }

    return [];
  }
);

export const getClientIspInfos = createSelector(
  getClientIsps,
  (clientIsps) => clientIsps.map(clientIsp => clientIsp.info.data)
    .filter(d => d != null));


export const getTransitIsps = createSelector(
  getTransitIspIds, TransitIspsSelectors.getTransitIsps,
  (transitIspIds, allTransitIsps) => {
    if (transitIspIds && allTransitIsps) {
      const transitIsps = transitIspIds.map(id => allTransitIsps[id]).filter(d => d != null);
      return transitIsps;
    }

    return [];
  }
);

export const getTransitIspInfos = createSelector(
  getTransitIsps,
  (transitIsps) => transitIsps.map(transitIsp => transitIsp.info.data)
    .filter(d => d != null));
