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
export const changeFacetType = urlReplaceAction('facetType');
export const changeStartDate = urlReplaceAction('startDate');
export const changeEndDate = urlReplaceAction('endDate');

// handle Facet locations
const changeFacetItemIds = urlReplaceAction('facetItemIds');
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
const changeFilter1Ids = urlReplaceAction('filter1Ids');
export function changeFilterClientIsps(newFilterClientIsps, urlConnectDispatch) {
  return () => {
    // ensure these locations are all saved in the location map
    newFilterClientIsps.forEach(clientIspInfo => {
      urlConnectDispatch(saveClientIspInfoIfNeeded(clientIspInfo));
    });

    // update the IDs in the URL
    urlConnectDispatch(changeFilter1Ids(newFilterClientIsps.map(d => d.id)));
  };
}

// handle Filter transit ISPs
const changeFilter2Ids = urlReplaceAction('filter2Ids');
export function changeFilterTransitIsps(newFilterTransitIsps, urlConnectDispatch) {
  return () => {
    // ensure these locations are all saved in the location map
    newFilterTransitIsps.forEach(transitIspInfo => {
      urlConnectDispatch(saveTransitIspInfoIfNeeded(transitIspInfo));
    });

    // update the IDs in the URL
    urlConnectDispatch(changeFilter2Ids(newFilterTransitIsps.map(d => d.id)));
  };
}

// TODO changing filter locations will need to update filter1Ids or filter2Ids depending on which facetType is selected
// if facetType = client, then filter1, if facetType = transit, filter2.
