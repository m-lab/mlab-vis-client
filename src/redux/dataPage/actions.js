/**
 * Actions for dataPage
 */
import { urlReplaceAction } from '../../url/actions';

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
