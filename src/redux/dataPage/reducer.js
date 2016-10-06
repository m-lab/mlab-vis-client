/**
 * Reducer for dataPage
 */
import * as Actions from './actions';

export const initialState = {
  autoTimeAggregation: true,
  downloadStatus: undefined,
};

// the data page reducer
function dataPage(state = initialState, action) {
  switch (action.type) {
    case Actions.CHANGE_AUTO_TIME_AGGREGATION:
      return {
        ...state,
        autoTimeAggregation: action.autoTimeAggregation,
      };
    case Actions.CHANGE_DOWNLOAD_STATUS:
      return {
        ...state,
        downloadStatus: action.downloadStatus,
      };

    default:
      return state;
  }
}

// Export the reducer
export default dataPage;
