import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import info from './info';

export default combineReducers({
  routing: routerReducer,
  info,
});
