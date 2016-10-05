import React, { PureComponent, PropTypes } from 'react';
import { apiRoot } from '../../config';

/**
 * Component to create a link to an API download endpoint based on the passed
 * in props.
 */
export default class ApiDownloadLink extends PureComponent {
  static propTypes = {
    clientIspId: PropTypes.string,
    clientIspLabel: PropTypes.string,
    locationId: PropTypes.string,
    locationLabel: PropTypes.string,
    transitIspId: PropTypes.string,
    transitIspLabel: PropTypes.string,
  }

  getLabel() {
    const {
      clientIspId,
      clientIspLabel,
      locationId,
      locationLabel,
      transitIspId,
      transitIspLabel,
    } = this.props;

    const parts = [];

    if (locationId) {
      parts.push(locationLabel || locationId);
    }
    if (clientIspId) {
      parts.push(clientIspLabel || clientIspId);
    }
    if (transitIspId) {
      parts.push(transitIspLabel || transitIspId);
    }


    return parts.join(' --- ');
  }

  getUrl() {
    return apiRoot;
  }

  render() {
    return (
      <a href={this.getUrl()}>
        {this.getLabel()}
      </a>
    );
  }
}
