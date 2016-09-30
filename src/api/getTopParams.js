/**
 * Helper function to create the params for `top` queries
 *
 * @param {String} filtertype locations, clients, or servers
 * @param {String|String[]} ids the ID or IDs to filter top by
 */
export default function getTopParams(filtertype, ids) {
  return {
    filtertype,
    filtervalue: Array.isArray(ids) ? ids.join(',') : ids,
  };
}
