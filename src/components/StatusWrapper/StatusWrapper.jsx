import React, { PureComponent, PropTypes } from 'react';

import './StatusWrapper.scss';

/**
 * A component that lets the user choose a metric to view
 *
 * @prop {String} status The active metric value
 * @prop {Any} children The children to wrap
 */
export default class StatusWrapper extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    status: PropTypes.string,
  }

  render() {
    const { children, status } = this.props;

    return (
      <div className={`status-wrapper status-${status}`}>
        {children}
      </div>
    );
  }
}
