import React, { PureComponent, PropTypes } from 'react';

import {
  ChartExportControls,
  LineChartWithCounts,
  StatusWrapper,
} from '../../components';

/**
 * Component for rendering the time series charts on the compare page
 */
export default class CompareTimeSeriesCharts extends PureComponent {
  static propTypes = {
    breakdownBy: PropTypes.string,
    colors: PropTypes.object,
    combinedTimeSeries: PropTypes.object,
    facetItemId: PropTypes.string,
    facetItemInfo: PropTypes.object,
    facetItemTimeSeries: PropTypes.object,
    filter1Ids: PropTypes.array,
    filter1Infos: PropTypes.array,
    filter2Ids: PropTypes.array,
    filter2Infos: PropTypes.array,
    highlightTimeSeriesDate: PropTypes.object,
    highlightTimeSeriesLine: PropTypes.object,
    onHighlightTimeSeriesDate: PropTypes.func,
    onHighlightTimeSeriesLine: PropTypes.func,
    viewMetric: PropTypes.object,
  }

  renderTimeSeries(chartId, timeSeries) {
    const {
      colors,
      highlightTimeSeriesDate,
      highlightTimeSeriesLine,
      onHighlightTimeSeriesDate,
      onHighlightTimeSeriesLine,
      viewMetric,
    } = this.props;

    if (!timeSeries) {
      return null;
    }

    const { status, data: seriesData } = timeSeries;

    if (!seriesData || seriesData.length === 0) {
      return null;
    }

    return (
      <StatusWrapper status={status}>
        <LineChartWithCounts
          id={chartId}
          colors={colors}
          series={seriesData}
          onHighlightDate={onHighlightTimeSeriesDate}
          highlightDate={highlightTimeSeriesDate}
          onHighlightLine={onHighlightTimeSeriesLine}
          highlightLine={highlightTimeSeriesLine}
          yFormatter={viewMetric.formatter}
          width={840}
          xKey="date"
          yAxisLabel={viewMetric.label}
          yAxisUnit={viewMetric.unit}
          yKey={viewMetric.dataKey}
        />
        <ChartExportControls
          chartId={chartId}
          data={seriesData}
          filename={`compare_${viewMetric.value}_${chartId}`}
        />
      </StatusWrapper>
    );
  }

  // if filters are empty, show the facet item line in the chart
  renderNoFilters(facetItemInfo) {
    const {
      facetItemTimeSeries,
    } = this.props;

    if (!facetItemTimeSeries) {
      return null;
    }

    const chartId = `facet-time-series-${facetItemInfo.id}`;
    const timeSeries = facetItemTimeSeries.timeSeries.find(seriesData => seriesData.id === facetItemInfo.id);

    return this.renderTimeSeries(chartId, timeSeries);
  }

  // if one filter has items, show the lines for those filter items in the chart
  renderSingleFilter(facetItemInfo) {
    const {
      combinedTimeSeries,
    } = this.props;

    if (!combinedTimeSeries) {
      return null;
    }

    const chartId = `facet-single-filtered-time-series-${facetItemInfo.id}`;

    const timeSeriesObject = combinedTimeSeries;
    return this.renderTimeSeries(chartId, timeSeriesObject);
  }

  // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
  renderBothFilters(facetItemInfo, filter1Infos, filter2Infos) {
    const {
      combinedTimeSeries,
      breakdownBy,
    } = this.props;

    if (!combinedTimeSeries) {
      return null;
    }

    const baseChartId = `facet-double-filtered-time-series-${facetItemInfo.id}`;
    const breakdownInfos = breakdownBy === 'filter1' ? filter1Infos : filter2Infos;

    return (
      <div>
        {Object.keys(combinedTimeSeries).map((breakdownId) => {
          const breakdownInfo = breakdownInfos.find(d => d.id === breakdownId) || { label: 'Loading...' };
          const timeSeriesObject = combinedTimeSeries[breakdownId];
          const chartId = `${baseChartId}-${breakdownId}`;
          return (
            <div key={breakdownId}>
              <h5>{breakdownInfo.label}</h5>
              {this.renderTimeSeries(chartId, timeSeriesObject)}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { facetItemInfo, filter1Ids, filter1Infos, filter2Ids, filter2Infos } = this.props;
    // if filters are empty, show the facet item line in the chart
    // if one filter has items, show the lines for those filter items in the chart
    // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
    let groupCharts;

    // no filters
    if (!filter1Ids.length && !filter2Ids.length) {
      groupCharts = this.renderNoFilters(facetItemInfo);

    // only one filter (client ISPs)
    } else if (filter1Ids.length && !filter2Ids.length) {
      groupCharts = this.renderSingleFilter(facetItemInfo, filter1Infos);

    // only one filter (transit ISPs)
    } else if (!filter1Ids.length && filter2Ids.length) {
      groupCharts = this.renderSingleFilter(facetItemInfo, filter2Infos);

    // else two filters
    } else {
      // TODO: order filter1, filter2 based on breakdownBy
      groupCharts = this.renderBothFilters(facetItemInfo, filter1Infos, filter2Infos);
    }

    return (
      <div>
        <h4>{facetItemInfo.label}</h4>
        {groupCharts}
      </div>
    );
  }
}
