import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import location from './location';

export default combineReducers({
  routing: routerReducer,
  location,
});
