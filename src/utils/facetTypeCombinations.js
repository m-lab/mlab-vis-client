import { facetTypes } from '../constants';

/**
 * Helper for doing recursive combining of the facet types
 */
function getFacetTypeCombinationsHelper(types, combined, prefix = []) {
  if (!types.length) {
    return combined;
  }

  const rootType = types[0];
  const remainingTypes = types.slice(1);
  const newPrefix = [...prefix, rootType.value];
  combined.push(newPrefix);
  for (let i = 0; i < remainingTypes.length; i += 1) {
    combined = getFacetTypeCombinationsHelper(remainingTypes.slice(i), combined, newPrefix);
  }

  return combined;
}

/**
 * Gets the combination of all facet types as an array of arrays.
 */
function getFacetTypeCombinations() {
  const totalCombined = [];
  for (let i = 0; i < facetTypes.length; i += 1) {
    getFacetTypeCombinationsHelper(facetTypes.slice(i), totalCombined);
  }

  return totalCombined;
}

// return the singleton result
export default getFacetTypeCombinations();
