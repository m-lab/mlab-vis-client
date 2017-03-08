/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { useScroll } from 'react-router-scroll';
import createStore from './redux/createStore';
import api from './api/api';
import getRoutes from './routes';
import { logPageView } from './analytics.js';

const dest = document.getElementById('content');
let store;
if (__DISABLE_SSR__) {
  store = createStore(browserHistory, api);
} else {
  store = createStore(browserHistory, api, window.__data); // eslint-disable-line no-underscore-dangle, max-len
}

const history = syncHistoryWithStore(browserHistory, store);

if (__DEVELOPMENT__) {
  window.Perf = require('react-addons-perf'); // eslint-disable-line
  // for debug convenience
  window.d3 = require('d3').default; // eslint-disable-line
}

// do not scroll unless the pathname changes.
const scrollMiddleware = useScroll((prevRouterProps, { location }) => (
  prevRouterProps && location.pathname !== prevRouterProps.location.pathname
));

const component = (
  <Router history={history} render={applyRouterMiddleware(scrollMiddleware)} onUpdate={logPageView}>
    {getRoutes(store)}
  </Router>
);


ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!__DISABLE_SSR__ && (!dest || !dest.firstChild || !dest.firstChild.attributes ||
    !dest.firstChild.attributes['data-react-checksum'])) {
    console.error(`Server-side React render was discarded. Make sure that your
      initial render does not contain any client-side code.`);
  }
}
