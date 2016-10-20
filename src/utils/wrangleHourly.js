import d3 from '../d3';
import { sum, average } from './math';

/**
 * Filter the data and group it by hour and by date
 * @param {Object} hourly the hourly data object { results }
 * @param {Object} viewMetric the active view metric to wrangle the data for
 * @return {Object} the prepared data { filteredData, dataByHour, overallData }
 */
export default function wrangleHourly(hourly, viewMetric) {
  if (!hourly) {
    return undefined;
  }

  const data = hourly.results;
  const yKey = viewMetric.dataKey;

  // filter so all data has a value for yKey
  const filteredData = (data || []).filter(d => d[yKey] != null);

  // produce the byHour array
  const groupedByHour = d3.nest().key(d => d.hour).object(filteredData);

  // use d3.range(24) instead of Object.keys to ensure we get an entry for each hour
  const dataByHour = d3.range(24).map(hour => {
    const hourPoints = groupedByHour[hour];
    const count = sum(hourPoints, 'count') || 0;

    return {
      hour,
      points: hourPoints || [],
      count,
      overall: average(hourPoints, yKey),
    };
  });

  // compute the overall data for an average line
  const overallData = dataByHour.map(d => ({
    [yKey]: d.overall,
    hour: d.hour,
    count: d.count,
  })).filter(d => d[yKey] != null);


  return {
    filteredData,
    overallData,
    dataByHour,
  };
}
