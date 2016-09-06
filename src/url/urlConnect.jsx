import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { URL_REPLACE } from './actions';

/**
 * Decorator for a react component class that adds in dispatching for URL actions
 * and Redux actions via the standard redux `dispatch` prop. Also integrates
 * props from the URL into the props received by mapStateToProps based on the
 * urlHandler passed in (which gets it from a urlConfig).
 *
 * Should be used in place of react-redux's `connect`. For example:
 *
 * export default urlConnect(urlHandler, mapStateToProps)(LocationPage);
 *
 * @param {Object} urlHandler A UrlHandler instance
 * @param {Function} mapStateToProps as for `connect`
 * @param {Function} mapDispatchToProps as for `connect`
 * @param {Function} mergeProps as for `connect`
 * @param {Object} options as for `connect`
 * @return {React.Component} A react component, enhanced with redux, react-router
 *   and UrlHandler integration
 */
export default function urlConnect(urlHandler, mapStateToProps, mapDispatchToProps,
  mergeProps, options = {}) {
  // if no URL handler, just use react-redux connect
  if (!urlHandler) {
    return connect(mapStateToProps, mapDispatchToProps, mergeProps, options);
  }

  // otherwise, add in query params to mapStateToProps
  function mapStateToPropsWithUrl(state, props) {
    const currentQuery = (props.location && props.location.query) || {};
    const urlQueryParams = urlHandler.decodeQuery(currentQuery);
    const urlParams = props.params || {};

    const propsWithUrl = {
      ...urlQueryParams,
      ...urlParams,
      ...props,
    };

    return mapStateToProps ? mapStateToProps(state, propsWithUrl) : propsWithUrl;
  }

  /**
   * Function to actually do the wrapping. do it this way instead of making WrappedComponent
   * an argument of urlConnect so you don't need to supply all of `connect`'s  arguments.
   */
  function wrapComponentWithUrlConnect(WrappedComponent) {
    const componentDisplayName = WrappedComponent.displayName ||
      WrappedComponent.name || 'Component';
    const urlConnectDisplayName = `UrlConnect(${componentDisplayName})`;

    class UrlConnect extends Component {
      static propTypes = {
        dispatch: PropTypes.func,
        location: PropTypes.object,
      }

      // bind urlConnectDispatch so we don't create a new function each time render is called
      constructor(...args) {
        super(...args);
        this.urlConnectDispatch = this.urlConnectDispatch.bind(this);
      }

      /**
       * The new dispatch function that chooses between redux's dispatch
       * and updating the URL based on the type of the action.
       */
      urlConnectDispatch(action, ...other) {
        const { location, dispatch } = this.props;
        const { type } = action;

        // handle with URL handler -- doesn't go to Redux dispatcher
        if (type === URL_REPLACE) {
          const { key, value } = action;
          urlHandler.replaceInQuery(location, key, value);

        // otherwise handle in Redux
        } else {
          dispatch(action, ...other);
        }
      }

      /**
       * Overwrites the `dispatch` prop with `this.urlConnectDispatch` and retains
       * the original value as `reduxDispatch` in props.
       */
      render() {
        return (
          <WrappedComponent
            {...this.props}
            reduxDispatch={this.props.dispatch}
            dispatch={this.urlConnectDispatch}
          />
        );
      }
    }

    UrlConnect.displayName = urlConnectDisplayName;
    UrlConnect.WrappedComponent = WrappedComponent;
    UrlConnect.urlHandler = urlHandler;

    return connect(mapStateToPropsWithUrl, mapDispatchToProps, mergeProps, options)(UrlConnect);
  }

  return wrapComponentWithUrlConnect;
}
