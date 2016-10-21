
/**
 * Compute counts based on multiple series data
 *
 * @param {Object[]} series The series objects to sum the counts over
 * @return {Object[]} The counts array { count, date }
 */
export default function computeTimeSeriesCounts(series) {
  // compute the counts here
  const countsByDate = series.data.reduce((countsByDate, oneSeries) => {
    oneSeries.results.forEach(d => {
      const { count = 0, date } = d;
      if (!countsByDate[date]) {
        countsByDate[date] = {
          count,
          date,
        };
      } else {
        countsByDate[date].count += count;
      }
    });

    return countsByDate;
  }, {});

  return Object.keys(countsByDate).map(key => countsByDate[key]);
}
