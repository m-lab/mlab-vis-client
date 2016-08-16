/**
 * Converts a date in the format 'YYYY-mm-dd...' into a proper date, because
 * new Date() does not do that correctly. The date can be as complete or incomplete
 * as necessary (aka, '2015', '2015-10', '2015-10-01').
 * It will not work for dates that have times included in them.
 * @TODO replace with proper date library at some point.
 * @param  {String} dateString String date form like '2015-10-01'
 * @return {Date} parsed date
 */
export function parseDate(dateString) {
  const parts = dateString.split('-');
  parts[1] -= 1; // Note: months are 0-based

  return new Date(...parts);
}
