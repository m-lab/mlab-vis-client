const DATE_FORMATS = {
  day: 'YYYY-MM-DD',
  day_hour: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  month_hour: 'YYYY-MM',
  year: 'YYYY',
  year_hour: 'YYYY',
};

/**
 * Creates the query params for metric api calls
 *
 * @param {String} timeAggregation either day, month, or year
 * @param {Object} options with optional startDate and endDate
 * @return {Array} array of parameters for start and end date
 */
export default function getMetricsParams(timeAggregation, options) {
  const params = {};
  const dateFormat = DATE_FORMATS[timeAggregation];
  if (options.startDate) {
    params.startdate = options.startDate.format(dateFormat);
  }
  if (options.endDate) {
    params.enddate = options.endDate.format(dateFormat);
  }
  if (options.dataFormat) {
    params.format = options.dataFormat;
  }
  if (options.download) {
    params.download = 1;
  }

  params.timebin = timeAggregation;

  return params;
}
