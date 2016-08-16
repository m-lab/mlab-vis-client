import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { persistState } from 'redux-devtools';
import createMiddleware from './clientMiddleware';
import DevTools from '../containers/DevTools/DevTools';
import rootReducer from './rootReducer';

// create the Redux store
export default function createStore(history, api, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);

  const middleware = [createMiddleware(api), reduxRouterMiddleware];

  let finalCreateStore;

  // apply middleware - on client, add in the redux dev tools
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);

  // apply middleware without redux dev tools
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const store = finalCreateStore(rootReducer, data);

  // add in hook for hot reloading reducer
  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(require('./rootReducer').default); // eslint-disable-line
    });
  }

  return store;
}
