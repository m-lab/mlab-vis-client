import React, { Component } from 'react';
import shallowEquals from '../utils/shallowEquals';

/**
 * Higher order component (HOC) that injects computed props from the
 * computedPropsFunc to the wrapped component. Re-runs computedPropsFunc when props
 * change (except when only those in ignoreChangeProps change).
 *
 * @param {Function} computedPropsFunc `function(props) -> {Object}` returns props to inject
 * @param {Array} [ignoreChangeProps] if provided, changes to these props does not trigger re-running computedPropsFunc.
 * @return {React.Component}
 */
export default function addComputedProps(computedPropsFunc, ignoreChangeProps) {
  return function addPropsWrapper(WrappedComponent) {
    class AddComputedProps extends Component {
      componentWillMount() {
        this.propsToAdd = computedPropsFunc(this.props);
      }

      componentWillUpdate(nextProps) {
        // recompute props to add only when the props change
        if (!shallowEquals(this.props, nextProps, ignoreChangeProps)) {
          this.propsToAdd = computedPropsFunc(nextProps);
        }
      }

      render() {
        const addedProps = this.propsToAdd || {};
        return <WrappedComponent {...this.props} {...addedProps} />;
      }
    }

    const componentDisplayName = WrappedComponent.displayName ||
      WrappedComponent.name || 'Component';
    const addPropsDisplayName = `AddComputedProps(${componentDisplayName})`;
    AddComputedProps.displayName = addPropsDisplayName;
    AddComputedProps.WrappedComponent = WrappedComponent;

    return AddComputedProps;
  };
}
