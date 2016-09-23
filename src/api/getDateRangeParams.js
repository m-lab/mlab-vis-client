const DATE_FORMATS = {
  day: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY',
};

/**
 * Get information for a location
 *
 * @param {String} timeAggregation either day, month, or year
 * @param {Object} options with optional startDate and endDate
 * @return {Array} array of parameters for start and end date
 */
export default function getDateRangeParams(timeAggregation, options) {
  const params = {};
  const dateFormat = DATE_FORMATS[timeAggregation];
  if (options.startDate) {
    params.startdate = options.startDate.format(dateFormat);
    // params.push(`startdate=${options.startDate.format(dateFormat)}`);
  }
  if (options.endDate) {
    // params.push(`enddate=${options.endDate.format(dateFormat)}`);
    params.enddate = options.endDate.format(dateFormat);
  }

  return params;
}
