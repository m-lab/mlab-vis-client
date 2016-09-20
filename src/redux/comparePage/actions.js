/**
 * Actions for comparePage
 */
import { urlReplaceAction } from '../../url/actions';
import { saveLocationInfoIfNeeded } from '../locations/actions';

/** Actions that replace values in the URL */
export const changeTimeAggregation = urlReplaceAction('timeAggregation');
export const changeViewMetric = urlReplaceAction('viewMetric');
export const changeFacetType = urlReplaceAction('facetType');
export const changeStartDate = urlReplaceAction('startDate');
export const changeEndDate = urlReplaceAction('endDate');

const changeFacetLocationIds = urlReplaceAction('facetLocationIds');


export function changeFacetLocations(newFacetLocations, urlConnectDispatch) {
  return () => {
    // ensure these locations are all saved in the location map
    newFacetLocations.forEach(locationInfo => {
      urlConnectDispatch(saveLocationInfoIfNeeded(locationInfo));
    });

    // update the IDs in the URL
    urlConnectDispatch(changeFacetLocationIds(newFacetLocations.map(d => d.id)));
  };
}
