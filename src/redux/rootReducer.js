import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Locations from './locations';

export default combineReducers({
  routing: routerReducer,
  locations: Locations.reducer,
});
