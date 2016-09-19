/**
 * Actions for comparePage
 */
import { urlReplaceAction } from '../../url/actions';

/** Actions that replace values in the URL */
export const changeTimeAggregation = urlReplaceAction('timeAggregation');
export const changeViewMetric = urlReplaceAction('viewMetric');
export const changeFacetType = urlReplaceAction('facetType');
export const changeStartDate = urlReplaceAction('startDate');
export const changeEndDate = urlReplaceAction('endDate');
