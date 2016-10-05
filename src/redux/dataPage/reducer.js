/**
 * Reducer for dataPage
 */
import * as Actions from './actions';

export const initialState = {
  autoTimeAggregation: true,
};

// the data page reducer
function dataPage(state = initialState, action) {
  switch (action.type) {
    case Actions.CHANGE_AUTO_TIME_AGGREGATION:
      return {
        ...state,
        autoTimeAggregation: action.autoTimeAggregation,
      };

    default:
      return state;
  }
}

// Export the reducer
export default dataPage;
