import { multiExtent } from './array';

/**
 * Helper to compute a shared extent for multiple hourly data items
 * Expects hourlyItems of form [{ wrangled }, ...]
 *
 * @return {Object} extents { dataKey: [], count: [] }
 */
export default function computeHourlyExtents(hourlyItems, dataKey) {
  const extents = {};

  if (!hourlyItems) {
    return extents;
  }

  const filtered = hourlyItems
    .map(d => d.wrangled)
    .filter(d => d != null);

  if (filtered.length) {
    // get the extents filtered to the 95% percentile while making sure overallData fits
    const extent = multiExtent(filtered, d => d[dataKey], d => d.filteredData, 0.95);

    // check the overallData extent
    const overallExtent = multiExtent(filtered, d => d[dataKey], d => d.overallData);
    extent[0] = Math.min(extent[0], overallExtent[0]);
    extent[1] = Math.max(extent[1], overallExtent[1]);

    extents[dataKey] = extent;

    // get the count extent
    extents.count = multiExtent(filtered, d => d.count, d => d.overallData);
  }

  return extents;
}
