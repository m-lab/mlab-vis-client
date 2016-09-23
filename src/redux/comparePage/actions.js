/**
 * Actions for comparePage
 */
import { urlReplaceAction } from '../../url/actions';
import { saveLocationInfoIfNeeded } from '../locations/actions';
import { saveClientIspInfoIfNeeded } from '../clientIsps/actions';
import { saveTransitIspInfoIfNeeded } from '../transitIsps/actions';

export const HIGHLIGHT_HOURLY = 'comparePage/HIGHLIGHT_HOURLY';
export const HIGHLIGHT_TIME_SERIES_DATE = 'comparePage/HIGHLIGHT_TIME_SERIES_DATE';
export const HIGHLIGHT_TIME_SERIES_LINE = 'comparePage/HIGHLIGHT_TIME_SERIES_LINE';

/**
 * Action for highlighting the hourly chart
 */
export function highlightHourly(highlightPoint) {
  return {
    type: HIGHLIGHT_HOURLY,
    highlightPoint,
  };
}

/**
 * Action for highlighting the time series chart via date
 */
export function highlightTimeSeriesDate(highlightDate) {
  return {
    type: HIGHLIGHT_TIME_SERIES_DATE,
    highlightDate,
  };
}

/**
 * Action for highlighting the time series chart via line
 */
export function highlightTimeSeriesLine(highlightLine) {
  return {
    type: HIGHLIGHT_TIME_SERIES_LINE,
    highlightLine,
  };
}


/** Actions that replace values in the URL */
export const changeTimeAggregation = urlReplaceAction('timeAggregation');
export const changeViewMetric = urlReplaceAction('viewMetric');
export const changeStartDate = urlReplaceAction('startDate');
export const changeEndDate = urlReplaceAction('endDate');
const changeFacetItemIds = urlReplaceAction('facetItemIds');
const changeFilter1Ids = urlReplaceAction('filter1Ids');
const changeFilter2Ids = urlReplaceAction('filter2Ids');

// handle Facet locations
export function changeFacetLocations(newFacetLocations, urlConnectDispatch) {
  return () => {
    // ensure these locations are all saved in the location map
    newFacetLocations.forEach(locationInfo => {
      urlConnectDispatch(saveLocationInfoIfNeeded(locationInfo));
    });

    // update the IDs in the URL
    urlConnectDispatch(changeFacetItemIds(newFacetLocations.map(d => d.id)));
  };
}

// handle Filter client ISPs
export function changeFilterClientIsps(newFilterClientIsps, filterNum, urlConnectDispatch) {
  return () => {
    // ensure these locations are all saved in the location map
    newFilterClientIsps.forEach(clientIspInfo => {
      urlConnectDispatch(saveClientIspInfoIfNeeded(clientIspInfo));
    });

    // update the IDs in the URL
    if (filterNum === 'filter1') {
      urlConnectDispatch(changeFilter1Ids(newFilterClientIsps.map(d => d.id)));
    } else {
      urlConnectDispatch(changeFilter2Ids(newFilterClientIsps.map(d => d.id)));
    }
  };
}

// handle Filter transit ISPs
export function changeFilterTransitIsps(newFilterTransitIsps, filterNum, urlConnectDispatch) {
  return () => {
    // ensure these locations are all saved in the location map
    newFilterTransitIsps.forEach(transitIspInfo => {
      urlConnectDispatch(saveTransitIspInfoIfNeeded(transitIspInfo));
    });

    // update the IDs in the URL
    if (filterNum === 'filter1') {
      urlConnectDispatch(changeFilter1Ids(newFilterTransitIsps.map(d => d.id)));
    } else {
      urlConnectDispatch(changeFilter2Ids(newFilterTransitIsps.map(d => d.id)));
    }
  };
}

// handle Filter locations
export function changeFilterLocations(newFilterLocations, filterNum, urlConnectDispatch) {
  return () => {
    // ensure these locations are all saved in the location map
    newFilterLocations.forEach(locationInfo => {
      urlConnectDispatch(saveTransitIspInfoIfNeeded(locationInfo));
    });

    // update the IDs in the URL
    if (filterNum === 'filter1') {
      urlConnectDispatch(changeFilter1Ids(newFilterLocations.map(d => d.id)));
    } else {
      urlConnectDispatch(changeFilter2Ids(newFilterLocations.map(d => d.id)));
    }
  };
}

