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
    colors: PropTypes.object,
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
    singleFilterTimeSeries: PropTypes.object,
    viewMetric: PropTypes.object,
  }

  renderTimeSeries(chartId, status, seriesData) {
    const {
      colors,
      highlightTimeSeriesDate,
      highlightTimeSeriesLine,
      onHighlightTimeSeriesDate,
      onHighlightTimeSeriesLine,
      viewMetric,
    } = this.props;

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
  renderBreakdownGroupNoFilters(facetItemInfo) {
    const {
      facetItemTimeSeries,
    } = this.props;

    const chartId = `facet-time-series-${facetItemInfo.id}`;
    const timeSeries = facetItemTimeSeries.timeSeries.find(seriesData => seriesData.id === facetItemInfo.id);

    return this.renderTimeSeries(chartId, timeSeries.status, timeSeries.data);
  }

  // if one filter has items, show the lines for those filter items in the chart
  renderBreakdownGroupSingleFilter(facetItemInfo) {
    const {
      singleFilterTimeSeries,
    } = this.props;

    const chartId = `facet-single-filtered-time-series-${facetItemInfo.id}`;

    const timeSeriesObject = singleFilterTimeSeries[facetItemInfo.id];
    return this.renderTimeSeries(chartId, timeSeriesObject.status, timeSeriesObject.data);
  }

  // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
  renderBreakdownGroupBothFilters(facetItemInfo, filter1Infos, filter2Infos) {
    const {
      facetItemTimeSeries,
    } = this.props;

    const chartId = `facet-double-filtered-time-series-${facetItemInfo.id}`;

    // TODO: produce a number of time series based on filter1 -> filter2
    const timeSeries = facetItemTimeSeries.timeSeries.find(seriesData => seriesData.id === facetItemInfo.id);

    return this.renderTimeSeries(chartId, timeSeries.status, timeSeries.data);
  }

  render() {
    const { facetItemInfo, filter1Ids, filter1Infos, filter2Ids, filter2Infos } = this.props;
    // if filters are empty, show the facet item line in the chart
    // if one filter has items, show the lines for those filter items in the chart
    // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
    let groupCharts;

    // no filters
    if (!filter1Ids.length && !filter2Ids.length) {
      groupCharts = this.renderBreakdownGroupNoFilters(facetItemInfo);

    // only one filter (client ISPs)
    } else if (filter1Ids.length && !filter2Ids.length) {
      groupCharts = this.renderBreakdownGroupSingleFilter(facetItemInfo, filter1Infos);

    // only one filter (transit ISPs)
    } else if (!filter1Ids.length && filter2Ids.length) {
      groupCharts = this.renderBreakdownGroupSingleFilter(facetItemInfo, filter2Infos);

    // else two filters
    } else {
      // TODO: order filter1, filter2 based on breakdownBy
      groupCharts = this.renderBreakdownGroupBothFilters(facetItemInfo, filter1Infos, filter2Infos);
    }

    return (
      <div>
        <h4>{facetItemInfo.label}</h4>
        {groupCharts}
      </div>
    );
  }
}
