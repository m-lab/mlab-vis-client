/**
 * Actions for dataPage
 */
import { urlReplaceAction } from '../../url/actions';
import { saveLocationInfoIfNeeded } from '../locations/actions';
import { saveClientIspInfoIfNeeded } from '../clientIsps/actions';
import { saveTransitIspInfoIfNeeded } from '../transitIsps/actions';

export const CHANGE_AUTO_TIME_AGGREGATION = 'dataPage/CHANGE_AUTO_TIME_AGGREGATION';

/**
 * Action for changing whether or not we automatically determine
 * time aggregate based on date range size.
 */
export function changeAutoTimeAggregation(autoTimeAggregation) {
  return {
    type: CHANGE_AUTO_TIME_AGGREGATION,
    autoTimeAggregation,
  };
}

/** Actions that replace values in the URL */
export const changeTimeAggregation = urlReplaceAction('timeAggregation');
export const changeDataFormat = urlReplaceAction('dataFormat');

export const changeClientIspIds = urlReplaceAction('clientIspIds');
export const changeTransitIspIds = urlReplaceAction('transitIspIds');
export const changeLocationIds = urlReplaceAction('locationIds');
export const changeStartDate = urlReplaceAction('startDate');
export const changeEndDate = urlReplaceAction('endDate');


// handle locations
export function changeLocations(locations, urlConnectDispatch) {
  return () => {
    // ensure these locations are all saved in the location map
    locations.forEach(locationInfo => {
      urlConnectDispatch(saveLocationInfoIfNeeded(locationInfo));
    });

    // update the IDs in the URL
    urlConnectDispatch(changeLocationIds(locations.map(d => d.id)));
  };
}


// handle client ISPs
export function changeClientIsps(clientIsps, urlConnectDispatch) {
  return () => {
    // ensure these client ISPs are all saved in the client ISP map
    clientIsps.forEach(clientIspInfo => {
      urlConnectDispatch(saveClientIspInfoIfNeeded(clientIspInfo));
    });

    // update the IDs in the URL
    urlConnectDispatch(changeClientIspIds(clientIsps.map(d => d.id)));
  };
}


// handle transit ISPs
export function changeTransitIsps(transitIsps, urlConnectDispatch) {
  return () => {
    // ensure these transit ISPs are all saved in the transit ISP map
    transitIsps.forEach(transitIspInfo => {
      urlConnectDispatch(saveTransitIspInfoIfNeeded(transitIspInfo));
    });

    // update the IDs in the URL
    urlConnectDispatch(changeTransitIspIds(transitIsps.map(d => d.id)));
  };
}
