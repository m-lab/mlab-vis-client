import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { reducer as locations } from './locations';

export default combineReducers({
  routing: routerReducer,
  locations,
});
