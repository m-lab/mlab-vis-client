import get from '../get';


/**
 * Get raw test sample
 *
 * @return {Promise} A promise after the get request was made
 */
export function getRawSample() {
  return get('/raw/tests');
}
