/**
 * Reducer for comparePage
 */
import * as Actions from './actions';

export const initialState = {
  highlightHourly: undefined,
  highlightTimeSeriesDate: undefined,
  highlightTimeSeriesLine: undefined,
};

// the compare page reducer
function comparePage(state = initialState, action = {}) {
  switch (action.type) {
    case Actions.CHANGE_AUTO_TIME_AGGREGATION:
      return {
        ...state,
        autoTimeAggregation: action.autoTimeAggregation,
      };
    case Actions.HIGHLIGHT_HOURLY:
      return {
        ...state,
        highlightHourly: action.highlightPoint,
      };
    case Actions.HIGHLIGHT_TIME_SERIES_DATE:
      return {
        ...state,
        highlightTimeSeriesDate: action.highlightDate,
      };
    case Actions.HIGHLIGHT_TIME_SERIES_LINE:
      return {
        ...state,
        highlightTimeSeriesLine: action.highlightLine,
      };

    default:
      return state;
  }
}


// Export the reducer
export default comparePage;
