import React, { PureComponent, PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';

import { stringToKey } from '../../utils/format';
import getMetricsUrl from '../../api/getMetricsUrl';

/**
 * Component to create a link to an API download endpoint based on the passed
 * in props.
 */
export default class ApiDownloadLink extends PureComponent {
  static propTypes = {
    clientIspId: PropTypes.string,
    clientIspLabel: PropTypes.string,
    dataFormat: PropTypes.string,
    endDate: momentPropTypes.momentObj,
    locationId: PropTypes.string,
    locationLabel: PropTypes.string,
    separator: PropTypes.string,
    startDate: momentPropTypes.momentObj,
    timeAggregation: PropTypes.string,
    transitIspId: PropTypes.string,
    transitIspLabel: PropTypes.string,
  }

  static defaultProps = {
    separator: ' --- ',
  }

  getLabel() {
    const {
      clientIspId,
      clientIspLabel,
      locationId,
      locationLabel,
      separator,
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


    return parts.join(separator);
  }

  getUrl() {
    return getMetricsUrl(Object.assign({ download: true }, this.props), false);
  }

  getFilename() {
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

    return parts.map(stringToKey).join('_');
  }

  render() {
    return (
      <a download={this.getFilename()} href={this.getUrl()}>
        {this.getLabel()}
      </a>
    );
  }
}
