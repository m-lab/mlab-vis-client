/**
 * Helper function to create the params for `top` queries
 *
 * @param {String} filtertype locations, clients, or servers
 * @param {String|String[]} ids the ID or IDs to filter top by
 */
export default function getTopParams(topType, filterType, ids) {
  return {
    // we want extra locations since we do a multi-level sort on them and want
    // to get cities in there if available (at the top)
    limit: topType === 'locations' ? 100 : 20,
    filtertype: filterType,
    filtervalue: Array.isArray(ids) ? ids.join(',') : ids,
  };
}
