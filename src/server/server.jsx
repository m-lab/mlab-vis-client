import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import PrettyError from 'pretty-error';
import http from 'http';

import { match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';

import createStore from '../redux/createStore';
import * as api from '../api/api';
import Html from './Html';
import getRoutes from '../routes';
import config from '../config';


// Create the Express server
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

app.use(compression());
app.use(favicon(path.join(__dirname, '..', '..', 'static', 'favicon.ico')));
app.use(Express.static(path.join(__dirname, '..', '..', 'static')));

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }


  // react-router history
  const memoryHistory = createHistory(req.originalUrl);

  // Redux store creation
  const store = createStore(memoryHistory, api);

  // react-router-redux setup
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send(`<!doctype html>${ReactDOM.renderToString(
      <Html assets={webpackIsomorphicTools.assets()} store={store} />)}`);
  }

  // if server-side rendering is disabled, do not render on server.
  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  // match the route and load the appropriate components
  match({ history, routes: getRoutes(store), location: req.originalUrl },
    (error, redirectLocation, renderProps) => {
      // redirect as necessary
      if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);

      // handle errors
      } else if (error) {
        console.error('ROUTER ERROR:', pretty.render(error));
        res.status(500);
        hydrateOnClient();

      // render the component from the route
      } else if (renderProps) {
        // connect redux
        const component = (
          <Provider store={store} key="provider">
            <RouterContext {...renderProps} />
          </Provider>
        );

        res.status(200);
        global.navigator = { userAgent: req.headers['user-agent'] };

        // send response with rendered component
        const appHtml = ReactDOM.renderToString(
          <Html
            assets={webpackIsomorphicTools.assets()}
            component={component}
            store={store}
          />);
        res.send(`<!doctype html>${appHtml}`);

      // not found (404)
      } else {
        res.status(404).send('Not found');
      }
    }
  );
});


// start listening on the port
if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running', config.app.title);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.',
      config.host, config.port);
    console.info('==> API service root: ', config.apiRoot);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
