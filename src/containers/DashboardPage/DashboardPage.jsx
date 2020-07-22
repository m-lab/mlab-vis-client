import { mean, sum } from 'd3-array';
import { nest } from 'd3-collection';
import { format } from 'd3-format'
import { timeParse } from 'd3-time-format';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';

import regions from './regions';
import BarChart from './BarChart';
import RegionSelect from './RegionSelect';

import './DashboardPage.scss';

import DATA from './data.json';

const urlQueryConfig = {};

const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);

function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
  };
}

const parseDate = timeParse('%Y-%m-%d')

class DashboardPage extends Component {
  static propTypes = {}

  constructor(props) {
    super(props);

    this.state = {
      regionId: 'NA/US/MD',
      regionLabel: 'Maryland',
      data: [],
      audioServicePercent: 0,
      meanSamples: 0,
      samplesBarChartData: [],
      videoServicePercent: 0,
      totalSamples: 0,
      zeroSampleDays: 0,
    };

    this.processDataFromFetch = this.processDataFromFetch.bind(this);
    this.setStateWithRegion = this.setStateWithRegion.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
  }

  componentDidMount() {
    this.processDataFromFetch(DATA);
  }

  setStateWithRegion({ regionId, regionLabel }) {
    if (this.state.regionId === regionId) return;

    this.setState({
      ...this.state,
      regionId,
      regionLabel,
    });

    this.processDataFromFetch(DATA);
  }

  calculatePercentageOfSamplesAboveThreshold(tests, threshold) {
    const aboveThreshold = tests.filter(d => d.bucket_max > threshold)
    const totalSamplesAbove = aboveThreshold.reduce((accum, next) => {
      const sampleCount = next.frac * +next.samples;
      return accum + sampleCount;
    }, 0);
    const percentageAbove = totalSamplesAbove / +tests[0].samples
    return percentageAbove;
  }

  processDataFromFetch(fetchData) {
    const data = fetchData;
    const byDate = nest().key(d => d.test_date).entries(fetchData);
    const samples = [];
    const audioServicePercents = [];
    const videoServicePercents = [];
    const samplesBarChartData = [];

    byDate.forEach(d => {
      samples.push(+d.values[0].samples);

      samplesBarChartData.push({
        date: parseDate(d.key),
        samples: +d.values[0].samples,
      });

      audioServicePercents.push(
        this.calculatePercentageOfSamplesAboveThreshold(
          d.values, 2.51188643150958
        )
      );

      videoServicePercents.push(
        this.calculatePercentageOfSamplesAboveThreshold(
          d.values, 10
        )
      );
    });

    this.setState({
      ...this.state,
      data,
      audioServicePercent: mean(audioServicePercents),
      meanSamples: mean(samples),
      samplesBarChartData,
      totalSamples: sum(samples),
      videoServicePercent: mean(videoServicePercents),
      zeroSampleDays: samples.filter(d => d === 0).length,
    });
  }

  handleRegionChange(e) {
    const { value } = e.target;
    const match = regions.find(region => {
      const key = `${region.continent}/${region.country}/${region.region}`;
      return key === value;
    });

    // if (!match) return;

    this.setStateWithRegion({
      regionId: value,
      regionLabel: match.label,
    });
  }

  render() {
    const {
      audioServicePercent,
      meanSamples,
      regionId,
      regionLabel,
      samplesBarChartData,
      videoServicePercent,
      totalSamples,
      zeroSampleDays,
    } = this.state;

    const dataSourceUrl = `https://api.measurementlab.net/${regionId}/histogram_daily_stats.json`;

    return (<div className="AA">
      <div className="group sticky">
        <p>
          Measurement Lab has recorded approximately <span className="dynamic-value">{format(',')(totalSamples)}</span> speed tests from
          {' '}
          <RegionSelect onChange={this.handleRegionChange} value={regionId} />
          {' '}
          since <span className="dynamic-value">January 1, 2020</span>. You can see the <a href={dataSourceUrl}>data from our API</a> or <a>contribute to the global data set by taking a speed test</a>.
        </p>
      </div>
      <div className="group">
        <div>
          <p>
            On average, <span className="dynamic-value">{format('.0%')(audioServicePercent)}</span> of the tests had sufficient bandwidth for making audio calls (at least 2 megabits per second) and <span className="dynamic-value">{format('.0%')(videoServicePercent)}</span> of the tests enough for successful video calls (at least 10 mbps).
          </p>
          <p>You can hover over the chart to the right to see more details about a particular day. <i>The previous sentence will change with the viewer's mouse to become the "tooltip" for the chart. When the cursor is moved off of the chart, the original text will be restored.</i></p>
        </div>
        <div className="chart-placeholder">
          "Percentage of samples that clear service thresholds" (line chart) goes here
        </div>
      </div>
      <div className="group">
        <div className="chart-placeholder">
          Samples per day
          <BarChart
            data={samplesBarChartData}
            xAttribute="date"
            yAttribute="samples"
          />
        </div>
        <div>
          <p>Our data from <span className="dynamic-value">{regionLabel}</span> during this time period is <span className="dynamic-value">pretty good</span>, with a mean of approximately <span className="dynamic-value">{format(',.0f')(meanSamples)}</span> tests per day. There were <span className="dynamic-value">{format(',.0f')(zeroSampleDays)}</span> days where no successful test was recorded.</p>
          <p>You can hover over the chart to the left to see more details about a particular day. <i>The previous sentence will change with the viewer's mouse to become the "tooltip" for the chart. When the cursor is moved off of the chart, the original text will be restored.</i></p>
        </div>
      </div>
      <div className="group">
        <div>
          <p>Another way we can look at our data from <span className="dynamic-value">{regionLabel}</span> is to look at the percentage of tests (per day) that were within a speed "bucket".</p>
          <details>
            <summary>Learn more about our bucket approach.</summary>
            <div>We divide up our traffic into "buckets", depending on the measured speed. We do this because of X, Y, and Z.</div>
          </details>
          <p>The more tests that were within a bucket, the brighter the color will be in the chart to the right.</p>
        </div>
        <div className="chart-placeholder">
          "Binned sample speed distribution" (heatmap) goes here
        </div>
      </div>
    </div>);
  }
}


export default urlConnect(urlHandler, mapStateToProps)(DashboardPage);
