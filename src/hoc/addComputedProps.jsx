import React, { Component } from 'react';
import shallowEquals, { shallowEqualsDebug } from '../utils/shallowEquals';

let debugAll = false;
if (typeof __DEBUG_COMPUTED_PROPS__ !== 'undefined') {
  debugAll = __DEBUG_COMPUTED_PROPS__;
}

/**
 * Higher order component (HOC) that injects computed props from the
 * computedPropsFunc to the wrapped component. Re-runs computedPropsFunc when props
 * change (except when options say otherwise)
 *
 * Options include:
 *
 * - alwaysRecompute {Boolean} if true, always re-runs computedPropsFunc even if the props didn't change.
 * - changeExclude {String[]} if provided, changes to these props do NOT trigger re-running computedPropsFunc. Can't be used with `changeInclude`.
 * - changeInclude {String[]} if provided, ONLY changes to these props triggers re-running computedPropsFunc. Can't be used with `changeExclude`.
 * - debug {Boolean} if true, prints to the console what props caused it to re-run computedPropsFunc.
 *
 * @param {Function} computedPropsFunc `function(props) -> {Object}` returns props to inject
 * @param {Object} [options] see above
 * @return {React.Component}
 */
export default function addComputedProps(computedPropsFunc, options = {}) {
  return function addPropsWrapper(WrappedComponent) {
    const { alwaysRecompute, debug, changeExclude, changeInclude } = options;
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    class AddComputedProps extends Component {
      static displayName = `AddComputedProps(${displayName})`
      static WrappedComponent = WrappedComponent
      static defaultProps = WrappedComponent.defaultProps

      componentWillMount() {
        this.propsToAdd = computedPropsFunc(this.props);
      }

      componentWillUpdate(nextProps) {
        // recompute props to add only when the props change
        if (alwaysRecompute || !shallowEquals(this.props, nextProps, changeExclude, changeInclude)) {
          if (debug === true || debugAll) {
            shallowEqualsDebug(this.props, nextProps, changeExclude, changeInclude,
              `Computing props in ${displayName} due to prop changes`);
          }
          this.propsToAdd = computedPropsFunc(nextProps);
        }
      }

      render() {
        const addedProps = this.propsToAdd || {};
        return <WrappedComponent {...this.props} {...addedProps} />;
      }
    }

    return AddComputedProps;
  };
}
