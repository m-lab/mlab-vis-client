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
import createStore from './redux/create';
import * as api from './api/Api';
import getRoutes from './routes';
import DevTools from './containers/DevTools/DevTools';

const dest = document.getElementById('content');
const store = createStore(browserHistory, api, window.__data); // eslint-disable-line no-underscore-dangle, max-len
const history = syncHistoryWithStore(browserHistory, store);

if (__DEVELOPMENT__) {
  window.Perf = require('react-addons-perf'); // eslint-disable-line
}

const component = (
  <Router history={history} render={applyRouterMiddleware(useScroll())}>
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

  if (!dest || !dest.firstChild || !dest.firstChild.attributes ||
    !dest.firstChild.attributes['data-react-checksum']) {
    console.error(`Server-side React render was discarded. Make sure that your
      initial render does not contain any client-side code.`);
  }
}


if (__DEVTOOLS__ && !window.devToolsExtension) {
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
