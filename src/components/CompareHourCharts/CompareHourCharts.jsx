import React, { PureComponent, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import AutoWidth from 'react-auto-width';
import { mergeMetaIntoResults } from '../../utils/exports';

import {
  ChartExportControls,
  HourChartWithCounts,
  StatusWrapper,
} from '../../components';

/**
 * Component for rendering the hour charts on the compare page
 */
export default class CompareHourCharts extends PureComponent {
  static propTypes = {
    breakdownBy: PropTypes.string,
    colors: PropTypes.object,
    combinedHourly: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    combinedHourlyExtents: PropTypes.object,
    facetItemHourly: PropTypes.array,
    facetItemHourlyExtents: PropTypes.object,
    facetItemId: PropTypes.string,
    facetItemInfo: PropTypes.object,
    facetType: PropTypes.object,
    filter1Ids: PropTypes.array,
    filter1Infos: PropTypes.array,
    filter2Ids: PropTypes.array,
    filter2Infos: PropTypes.array,
    filterTypes: PropTypes.array,
    highlightHourly: PropTypes.number,
    onHighlightHourly: PropTypes.func,
    viewMetric: PropTypes.object,
  }

  renderHourly(chartId, hourly, dataType, hourlyExtents) {
    const {
      highlightHourly,
      viewMetric,
      colors,
      onHighlightHourly,
    } = this.props;

    if (!hourly) {
      return null;
    }

    const { status, data: hourlyData, wrangled } = hourly;

    if (!hourlyData || hourlyData.length === 0) {
      return null;
    }
    const color = colors[hourlyData.meta[dataType.idKey]];

    return (
      <StatusWrapper status={status}>
        <AutoWidth>
          <HourChartWithCounts
            color={color}
            countExtent={hourlyExtents.count}
            dataByHour={wrangled.dataByHour}
            overallData={wrangled.overallData}
            highlightHour={highlightHourly}
            id={chartId}
            onHighlightHour={onHighlightHourly}
            yAxisLabel={viewMetric.label}
            yAxisUnit={viewMetric.unit}
            yExtent={hourlyExtents[viewMetric.dataKey]}
            yFormatter={viewMetric.formatter}
            yKey={viewMetric.dataKey}
          />
        </AutoWidth>
        <ChartExportControls
          className="for-hour-chart"
          chartId={chartId}
          data={hourlyData}
          prepareForCsv={mergeMetaIntoResults}
          filename={`compare_hourly_${viewMetric.value}_${chartId}`}
        />
      </StatusWrapper>
    );
  }

  // if filters are empty, show the facet item line in the chart
  renderNoFilters(facetItemInfo) {
    const {
      facetItemHourly,
      facetItemHourlyExtents,
      facetType,
    } = this.props;

    if (!facetItemHourly) {
      return null;
    }

    const chartId = `facet-hourly-${facetItemInfo.id}`;
    const hourly = facetItemHourly.find(hourly => hourly.id === facetItemInfo.id);

    return this.renderHourly(chartId, hourly, facetType, facetItemHourlyExtents);
  }

  // if one filter has items, show the lines for those filter items in the chart
  renderSingleFilter(facetItemInfo, filterInfos, dataType) {
    const {
      combinedHourly,
      combinedHourlyExtents,
    } = this.props;

    if (!combinedHourly) {
      return null;
    }

    const baseChartId = `facet-single-filtered-hourly-${facetItemInfo.id}`;

    // render a chart for each filter item
    return (
      <Row>
        {combinedHourly.map(hourlyObject => {
          const info = filterInfos.find(d => d.id === hourlyObject.id) || { label: 'Loading...' };
          const chartId = `${baseChartId}-${hourlyObject.id}`;
          return (
            <Col key={hourlyObject.id} md={6}>
              <h5>{info.label}</h5>
              {this.renderHourly(chartId, hourlyObject, dataType, combinedHourlyExtents)}
            </Col>
          );
        })}
      </Row>
    );
  }

  // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
  renderBothFilters(facetItemInfo, filter1Infos, filter2Infos) {
    const {
      combinedHourly,
      combinedHourlyExtents,
      breakdownBy,
      filterTypes,
    } = this.props;

    if (!combinedHourly) {
      return null;
    }

    const baseChartId = `facet-single-filtered-hourly-${facetItemInfo.id}`;
    const breakdownInfos = breakdownBy === 'filter1' ? filter1Infos : filter2Infos;
    const filterInfos = breakdownBy === 'filter1' ? filter2Infos : filter1Infos;
    const dataType = breakdownBy === 'filter1' ? filterTypes[1] : filterTypes[0];

    // render a chart for each filter item
    return (
      <div>
        {Object.keys(combinedHourly).map((breakdownId) => {
          const breakdownInfo = breakdownInfos.find(d => d.id === breakdownId) || { label: 'Loading...' };
          const hourObjects = combinedHourly[breakdownId];
          const breakdownChartId = `${baseChartId}-${breakdownId}`;
          return (
            <div key={breakdownId}>
              <h5>{breakdownInfo.label}</h5>
              <Row>
                {hourObjects.map((hourObject) => {
                  const filterId = hourObject.id;
                  const filterInfo = filterInfos.find(d => d.id === filterId) || { label: 'Loading...' };
                  const chartId = `${breakdownChartId}-${filterId}`;
                  return (
                    <Col key={`${breakdownId}-${filterId}`} md={6}>
                      <h6>{filterInfo.label}</h6>
                      {this.renderHourly(chartId, hourObject, dataType, combinedHourlyExtents)}
                    </Col>
                  );
                })}
              </Row>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { facetItemInfo, filter1Ids, filter1Infos, filter2Ids, filter2Infos, filterTypes } = this.props;
    // if filters are empty, show the facet item line in the chart
    // if one filter has items, show the lines for those filter items in the chart
    // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
    let groupCharts;
    let colSize = 6;

    // no filters
    if (!filter1Ids.length && !filter2Ids.length) {
      groupCharts = this.renderNoFilters(facetItemInfo);

    // only one filter (client ISPs)
    } else if (filter1Ids.length && !filter2Ids.length) {
      colSize = 12;
      groupCharts = this.renderSingleFilter(facetItemInfo, filter1Infos, filterTypes[0]);

    // only one filter (transit ISPs)
    } else if (!filter1Ids.length && filter2Ids.length) {
      colSize = 12;
      groupCharts = this.renderSingleFilter(facetItemInfo, filter2Infos, filterTypes[1]);

    // else two filters
    } else {
      // TODO: order filter1, filter2 based on breakdownBy
      colSize = 12;
      groupCharts = this.renderBothFilters(facetItemInfo, filter1Infos, filter2Infos);
    }

    return (
      <Col key={facetItemInfo.id} md={colSize}>
        <h4>{facetItemInfo.label}</h4>
        {groupCharts}
      </Col>
    );
  }
}
