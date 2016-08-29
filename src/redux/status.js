/**
 * Given a standard data object in a store, return the status of it.
 * Looks at `isFetching`, `isFetched`, and `error`.
 *
 * @param {Object} obj The data object
 * @return {String} The status ('loading', 'ready', 'error', 'unknown')
 */
function objStatus(obj) {
  if (obj) {
    if (obj.isFetching) {
      return 'loading';
    } else if (obj.isFetched) {
      return 'ready';
    } else if (obj.error) {
      return 'error';
    }
  }

  return 'unknown';
}

/**
 * Function to choose a single status message from an array of them
 *
 * @param {String[]} statuses The status strings to merge (e.g. ['loading', 'unknown'])
 * @return {String} status
 */
export function mergeStatuses(statuses) {
  if (statuses) {
    if (statuses.includes('error')) {
      return 'error';
    } else if (statuses.includes('loading')) {
      return 'loading';
    } else if (statuses.includes('ready')) {
      return 'ready';
    }
  }

  return 'unknown';
}

/**
 * Given a standard data object or an array of them, return the status of it/them.
 * Looks at `isFetching`, `isFetched`, and `error`.
 *
 * @param {Array|Object} input A data object or an array of data objects
 * @return {String} The status ('loading', 'ready', 'error', 'unknown')
 */
export function status(input) {
  if (Array.isArray(input)) {
    return mergeStatuses(input.map(objStatus));
  }

  return objStatus(input);
}
