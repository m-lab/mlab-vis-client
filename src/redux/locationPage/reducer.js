/**
 * Reducer for locationPage
 */
import * as Actions from './actions';

const initialState = {
  highlightHourly: undefined,
};

// the location page reducer
function locationPage(state = initialState, action = {}) {
  switch (action.type) {
    case Actions.HIGHLIGHT_HOURLY:
      return {
        ...state,
        highlightHourly: action.highlightPoint,
      };

    default:
      return state;
  }
}


// Export the reducer
export default locationPage;
