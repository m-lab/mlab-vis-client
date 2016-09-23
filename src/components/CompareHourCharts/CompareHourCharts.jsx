import React, { PureComponent, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import {
  ChartExportControls,
  HourChartWithCounts,
  StatusWrapper,
} from '../../components';

/**
 * Component for rendering the time series charts on the compare page
 */
export default class CompareHourCharts extends PureComponent {
  static propTypes = {
    colors: PropTypes.object,
    facetItemHourly: PropTypes.array,
    facetItemId: PropTypes.string,
    facetItemInfo: PropTypes.object,
    filter1Ids: PropTypes.array,
    filter1Infos: PropTypes.array,
    filter2Ids: PropTypes.array,
    filter2Infos: PropTypes.array,
    highlightHourly: PropTypes.number,
    onHighlightHourly: PropTypes.func,
    singleFilterHourly: PropTypes.object,
    viewMetric: PropTypes.object,
  }

  renderHourly(chartId, status, hourlyData) {
    const {
      highlightHourly,
      viewMetric,
      colors,
      onHighlightHourly,
    } = this.props;

    if (!hourlyData || hourlyData.length === 0) {
      return null;
    }
    const color = colors[hourlyData.meta.id];

    return (
      <StatusWrapper status={status}>
        <HourChartWithCounts
          color={color}
          data={hourlyData.results}
          highlightHour={highlightHourly}
          id={chartId}
          onHighlightHour={onHighlightHourly}
          threshold={30}
          width={400}
          yAxisLabel={viewMetric.label}
          yAxisUnit={viewMetric.unit}
          yExtent={hourlyData.extents[viewMetric.dataKey]}
          yFormatter={viewMetric.formatter}
          yKey={viewMetric.dataKey}
        />
        <ChartExportControls
          chartId={chartId}
          data={hourlyData.results}
          filename={`compare_hourly_${viewMetric.value}_${chartId}`}
        />
      </StatusWrapper>
    );
  }

  // if filters are empty, show the facet item line in the chart
  renderBreakdownGroupHourlyNoFilters(facetItemInfo) {
    const {
      facetItemHourly,
    } = this.props;
    const chartId = `facet-hourly-${facetItemInfo.id}`;
    const hourly = facetItemHourly.find(hourly => hourly.id === facetItemInfo.id);

    return this.renderHourly(chartId, hourly.status, hourly.data);
  }

  // if one filter has items, show the lines for those filter items in the chart
  renderBreakdownGroupHourlySingleFilter(facetItemInfo, filter1Infos) {
    const {
      singleFilterHourly,
    } = this.props;


    const hourlyObjects = singleFilterHourly[facetItemInfo.id];

    // render a chart for each filter item
    return (
      <Row>
        {hourlyObjects.map(hourlyObject => {
          const info = filter1Infos.find(d => d.id === hourlyObject.id) || { label: 'Loading...' };
          const chartId = `facet-single-filtered-hourly-${facetItemInfo.id}-${hourlyObject.id}`;
          return (
            <Col key={hourlyObject.id} md={6}>
              <h5>{info.label}</h5>
              {this.renderHourly(chartId, hourlyObject.status, hourlyObject.data)}
            </Col>
          );
        })}
      </Row>
    );
  }

  // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
  renderBreakdownGroupHourlyBothFilters(facetItemInfo, filter1Infos, filter2Infos) {
    const {
      facetItemHourly,
    } = this.props;

    const chartId = `facet-double-filtered-hourly-${facetItemInfo.id}`;

    // TODO: produce a number of time series based on filter1 -> filter2
    const hourly = facetItemHourly.find(hourly => hourly.id === facetItemInfo.id);

    return this.renderHourly(chartId, hourly.status, hourly.data);
  }

  render() {
    const { facetItemInfo, filter1Ids, filter1Infos, filter2Ids, filter2Infos } = this.props;
    // if filters are empty, show the facet item line in the chart
    // if one filter has items, show the lines for those filter items in the chart
    // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
    let groupCharts;
    let colSize = 6;

    // no filters
    if (!filter1Ids.length && !filter2Ids.length) {
      groupCharts = this.renderBreakdownGroupHourlyNoFilters(facetItemInfo);

    // only one filter (client ISPs)
    } else if (filter1Ids.length && !filter2Ids.length) {
      colSize = 12;
      groupCharts = this.renderBreakdownGroupHourlySingleFilter(facetItemInfo, filter1Infos);

    // only one filter (transit ISPs)
    } else if (!filter1Ids.length && filter2Ids.length) {
      colSize = 12;
      groupCharts = this.renderBreakdownGroupHourlySingleFilter(facetItemInfo, filter2Infos);

    // else two filters
    } else {
      // TODO: order filter1, filter2 based on breakdownBy
      colSize = 12;
      groupCharts = this.renderBreakdownGroupHourlyBothFilters(facetItemInfo, filter1Infos, filter2Infos);
    }

    return (
      <Col key={facetItemInfo.id} md={colSize}>
        <h4>{facetItemInfo.label}</h4>
        {groupCharts}
      </Col>
    );
  }
}
