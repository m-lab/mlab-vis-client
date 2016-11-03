import React, { PureComponent, PropTypes } from 'react';

import './StatusWrapper.scss';
import loadingImage from '../../assets/loading.gif';

/**
 * A component that indicates loading or error status of its children.
 * Renders a spinner for loading/partially loading.
 */
export default class StatusWrapper extends PureComponent {
  static propTypes = {
    // The children to wrap
    children: PropTypes.any,
    // The active metric value
    status: PropTypes.string,
  }

  render() {
    const { children, status } = this.props;
    const showSpinner = status === 'loading' || status === 'unknown' || status === 'partially-loaded';

    return (
      <div className={`status-wrapper status-${status}`}>
        <div className="status-wrapper-inner">
          {children}
        </div>
        {showSpinner ? <img src={loadingImage} className="loading-spinner" alt="Loading..." /> : null}
      </div>
    );
  }
}
