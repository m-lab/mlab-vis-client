import React, { PureComponent, PropTypes } from 'react';

import './StatusWrapper.scss';
import loadingImage from '../../assets/loading.gif';

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
