import d3 from '../d3';

/**
 * Takes query and returns an object of query values that adhere to the
 * following conditions:
 * - the parameter is an urlKey attribute of one of the values in urlQueryConfig
 * - the urlQueryConfig for the parameter is marked with persist = true.
 *
 * Persistance defaults to true - so the absense of a persist flag is the same
 * as persist = true.
 * @param {Object} urlQuery Query object from something location.query
 * @param {Object} urlQueryConfig URL configuration object with object values
 * including `urlKey`.
 * @return {Object} rebuilt query Object only including persistent values.
 */
export default function queryRebuild(urlQuery, urlQueryConfig) {
  const rebuiltQuery = {};

  const configValues = d3.values(urlQueryConfig);

  configValues.forEach((config) => {
    // persist defaults to true.
    if (config.persist !== false) {
      const urlKey = config.urlKey;
      if (urlQuery[urlKey]) {
        rebuiltQuery[urlKey] = urlQuery[urlKey];
      }
    }
  });

  return rebuiltQuery;
}
