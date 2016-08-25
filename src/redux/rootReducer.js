import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { reducer as clientIsps } from './clientIsps';
import { reducer as locations } from './locations';
import { reducer as locationPage } from './locationPage';
import { reducer as globalSearch } from './globalSearch';

export default combineReducers({
  clientIsps,
  locationPage,
  locations,
  globalSearch,
  routing: routerReducer,
});
