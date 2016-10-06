import { apiRoot } from '../config';
import getMetricsParams from './getMetricsParams';

function queryParamsToString(params) {
  const parts = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
  return parts.length ? `?${parts}` : '';
}

/**
 * Helper function to create a URL for API metrics endpoints
 */
export default function getMetricsUrl(urlParts, relative = true) {
  const {
    locationId,
    clientIspId,
    transitIspId,
  } = urlParts;

  const parts = [];
  if (locationId != null) {
    parts.push(`locations/${locationId}`);
  }
  if (clientIspId != null) {
    parts.push(`clients/${clientIspId}`);
  }
  if (transitIspId != null) {
    parts.push(`servers/${transitIspId}`);
  }

  const urlRoot = `${relative ? '/' : `${apiRoot}/`}${parts.join('/')}/metrics`;
  const metricsParams = getMetricsParams(urlParts.timeAggregation, urlParts);

  return `${urlRoot}${queryParamsToString(metricsParams)}`;
}
