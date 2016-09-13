/**
 * Actions for locationPage
 */
import { urlReplaceAction } from '../../url/actions';

export const HIGHLIGHT_HOURLY = 'locationPage/HIGHLIGHT_HOURLY';
export const HIGHLIGHT_TIME_SERIES_DATE = 'locationPage/HIGHLIGHT_TIME_SERIES_DATE';
export const HIGHLIGHT_TIME_SERIES_LINE = 'locationPage/HIGHLIGHT_TIME_SERIES_LINE';

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
export const changeShowBaselines = urlReplaceAction('showBaselines');
export const changeShowRegionalValues = urlReplaceAction('showRegionalValues');

export const changeSelectedClientIspIds = urlReplaceAction('selectedClientIspIds');
export const changeStartDate = urlReplaceAction('startDate');
export const changeEndDate = urlReplaceAction('endDate');
