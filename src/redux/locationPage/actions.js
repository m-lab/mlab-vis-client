/**
 * Actions for locationPage
 */
import { urlReplaceAction } from '../../url/actions';

export const HIGHLIGHT_HOURLY = 'locationPage/HIGHLIGHT_HOURLY';

/**
 * Action for highlighting the hourly chart
 */
export function highlightHourly(highlightPoint) {
  return {
    type: HIGHLIGHT_HOURLY,
    highlightPoint,
  };
}

/** Actions that replace values in the URL */
export const changeTimeAggregation = urlReplaceAction('timeAggregation');
export const changeViewMetric = urlReplaceAction('viewMetric');
export const changeShowBaselines = urlReplaceAction('showBaselines');
export const changeShowRegionalValues = urlReplaceAction('showRegionalValues');

export const changeSelectedClientIspIds = urlReplaceAction('selectedClientIspIds');
export const changeStartDate = urlReplaceAction('startDate');
export const changeEndDate = urlReplaceAction('endDate');
