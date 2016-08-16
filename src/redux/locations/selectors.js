import { createSelector } from 'reselect';
import { parseDate } from '../../utils/utils';

// ----------------------
// Input Selectors
// ----------------------

/**
 * Input selector for getting location metrics
 */
function getLocationMetrics(state) {
  return state.locations.metricsData;
}

function getHourlyLocationMetrics(state) {
  return state.locations.hourlyData;
}


// ----------------------
// Selectors
// ----------------------

/**
 * A selector to transform API data to be usable in a time series chart.
 */
export const getLocationMetricsTimeSeriesData = createSelector(
  [getLocationMetrics],
  (locationMetrics) => {
    if (!locationMetrics || !locationMetrics.metrics) {
      return undefined;
    }

    // make the date field an actual date
    return locationMetrics.metrics.map(d =>
      Object.assign({}, d, {
        date: new Date(d.date),
      })
    );
  }
);

/**
 * A selector to transform the hourly API into an array grouped by hour.
 * @param  {function} [getHourlyLocationLetrics] input selector for data property
 * @param  {function} hourlyLocationMetrics  selector for hourly location metrics
 * @return {Array}  Array of grouped hourly data
 */
export const getHourlyLocationMetricsTimeSeriesData = createSelector(
  [getHourlyLocationMetrics],
  (hourlyLocationMetrics) => {
    if (!hourlyLocationMetrics || !hourlyLocationMetrics.metrics) {
      return undefined;
    }

    // group by hour
    const hourly = new Array(24);
    hourlyLocationMetrics.metrics.forEach(d => {
      const hour = parseInt(d.hour, 10);

      if (hourly[hour] === undefined) {
        hourly[hour] = [];
      }

      hourly[hour].push(Object.assign({}, d, {
        date_parsed: parseDate(d.date),
      }));
    });

    return hourly;
  }
);
