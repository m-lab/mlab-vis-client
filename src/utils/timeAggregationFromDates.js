/**
 * Gives a different timeAggregation value based on how far away the dates are.
 *
 * @param {moment} startDate
 * @param {moment} endDate
 * @return {String} timeAggregation - 'day', 'month', or 'year'
 */
export default function timeAggregationFromDates(startDate, endDate) {
  if (endDate.diff(startDate, 'years') >= 3) {
    return 'year';
  }

  if (endDate.diff(startDate, 'months') >= 3) {
    return 'month';
  }

  return 'day';
}
