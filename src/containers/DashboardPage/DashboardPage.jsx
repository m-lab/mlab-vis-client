import { mean, sum } from "d3-array";
import { nest } from "d3-collection";
import { format } from "d3-format";
import { timeParse, timeFormat } from "d3-time-format";
import uniqBy from "lodash.uniqby";
import React, { Component } from "react";
import { browserHistory } from "react-router";

import UrlHandler from "../../url/UrlHandler";
import urlConnect from "../../url/urlConnect";

import regions from "./regions";
import BarChart from "./BarChart";
import HeatmapChart from "./HeatmapChart";
import LineChart from "./LineChart";
import RegionSelect from "./RegionSelect";

import "./DashboardPage.scss";

// import DATA from './data.json';

const urlQueryConfig = {};

const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);

function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
  };
}

const formatDate = timeFormat("%B %e");
const parseDate = timeParse("%Y-%m-%d");

class DashboardPage extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      currentHoverIndicatorDate: null,
      heatMapData: [],
      isHoverDisabled: false,
      isFetching: true,
      meanAudioServicePercent: "--",
      meanSamples: "--",
      regionId: "NA/US",
      regionLabel: "the United States",
      samplesBarChartData: [],
      serviceThresholdLineChartData: [],
      meanVideoServicePercent: "--",
      totalSamples: "--",
      year: 2020,
      zeroSampleDays: "--",
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleChartClick = this.handleChartClick.bind(this);
    this.handleChartHover = this.handleChartHover.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.processDataFromFetch = this.processDataFromFetch.bind(this);
    this.renderBarChartText = this.renderBarChartText.bind(this);
    this.renderLineChartText = this.renderLineChartText.bind(this);
    this.setStateWithRegion = this.setStateWithRegion.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { regionId, year } = this.state;
    // https://storage.cloud.google.com/api.measurementlab.net/NA/US/MD/2020/histogram_daily_stats.json
    // https://statistics.mlab-sandbox.measurementlab.net/v0/NA/US/2020/histogram_daily_stats.json
    const url = `https://statistics.mlab-sandbox.measurementlab.net/v0/${regionId}/${year}/histogram_daily_stats.json`;

    this.setState(
      {
        ...this.state,
        isFetching: true,
        meanAudioServicePercent: "--",
        meanSamples: "--",
        meanVideoServicePercent: "--",
        totalSamples: "--",
        zeroSampleDays: "--",
      },
      () => {
        console.log(`fetching data from ${url}`);
        fetch(url).then((response) => {
          const { status } = response;

          if (status !== 200) {
            console.error(
              `There was an error (${status}) returned from the fetch`
            );
            return;
          }

          response.json().then((data) => this.processDataFromFetch(data));
        });
      }
    );
  }

  setStateWithRegion({ regionId, regionLabel }) {
    if (this.state.regionId === regionId) return;

    this.setState(
      {
        ...this.state,
        regionId,
        regionLabel,
      },
      () => {
        this.fetchData();
      }
    );
  }

  calculatePercentageOfSamplesAboveThreshold(tests, threshold) {
    const uniqTests = uniqBy(tests, (d) => d.bucket_max);
    const aboveThreshold = uniqTests.filter((d) => d.bucket_max > threshold);
    const totalSamplesAbove = aboveThreshold.reduce((accum, next) => {
      // const sampleCount = next.dl_frac * +next.dl_samples;
      return accum + next.dl_samples_bucket;
    }, 0);
    const percentageAbove = totalSamplesAbove / +tests[0].dl_samples_day;
    return percentageAbove;
  }

  processDataFromFetch(fetchData) {
    const byDate = nest()
      .key((d) => d.date)
      .entries(fetchData)
      .map(({ key, values }) => {
        const unique = uniqBy(values, (d) => d.bucket_max);
        const sorted = unique.sort((a, b) => {
          if (a.bucket_max > b.bucket_max) return 1;
          if (a.bucket_max < b.bucket_max) return -1;
          return 0;
        });
        return {
          key,
          values: sorted,
        };
      });
    const samples = [];
    const audioServicePercents = [];
    const videoServicePercents = [];
    const samplesBarChartData = [];
    const serviceThresholdLineChartData = [
      {
        name: "Audio",
        values: [],
      },
      {
        name: "Video",
        values: [],
      },
    ];

    byDate.forEach((d) => {
      samples.push(+d.values[0].dl_samples_day);

      samplesBarChartData.push({
        date: parseDate(d.key),
        samples: +d.values[0].dl_samples_day,
      });

      audioServicePercents.push(
        this.calculatePercentageOfSamplesAboveThreshold(
          d.values,
          2.51188643150958
        )
      );

      videoServicePercents.push(
        this.calculatePercentageOfSamplesAboveThreshold(d.values, 10)
      );
    });

    byDate.forEach((d, i) => {
      const date = parseDate(d.key);
      const audioServicePercent = audioServicePercents[i];
      const videoServicePercent = videoServicePercents[i];

      serviceThresholdLineChartData[0].values.push({
        date,
        samples_above_threshold_pct: audioServicePercent,
      });

      serviceThresholdLineChartData[1].values.push({
        date,
        samples_above_threshold_pct: videoServicePercent,
      });
    });

    const heatMapData = byDate.map((dateGroup) => {
      const { key, values } = dateGroup;

      const binned = [
        {
          min: 0,
          max: 2,
        },
        {
          min: 2,
          max: 10,
        },
        {
          min: 10,
          max: 64, // real bucket value is 63.095734448019655
        },
        {
          min: 63,
          max: 101,
        },
        {
          min: 100,
          max: 1000,
        },
        {
          min: 1000,
          max: 10000,
        },
      ];

      let totalSamples = 0;

      values.forEach((value, i) => {
        const {
          bucket_max,
          bucket_min,
          dl_samples_bucket,
          dl_samples_day,
        } = value;

        // eslint-disable-next-line camelcase
        if (i === 0) totalSamples = +dl_samples_day;
        // eslint-disable-next-line camelcase
        const numberOfSamplesInValue = dl_samples_bucket;

        const bin = binned.find((b) => {
          const isMinOrGreater =
            parseInt(bucket_min, 10) >= parseInt(b.min, 10);
          const isMaxOrLess = b.max
            ? parseInt(bucket_max, 10) <= parseInt(b.max, 10)
            : true;
          return isMinOrGreater && isMaxOrLess;
        });

        if (!bin.samples) {
          bin.samples = 0;
        }

        bin.samples += numberOfSamplesInValue;
      });

      const median = values[0].download_MED;

      return {
        key,
        median: values[0].download_MED,
        values: binned.map((b) => {
          const { min, max, samples } = b;

          return {
            bucket_max: max,
            bucket_min: min,
            dl_samples: samples,
            dl_frac: samples / totalSamples,
            includes_median: median > min && median < max,
          };
        }),
      };
    });

    this.setState({
      ...this.state,
      heatMapData,
      isFetching: false,
      meanAudioServicePercent: mean(audioServicePercents),
      meanSamples: mean(samples),
      meanVideoServicePercent: mean(videoServicePercents),
      samplesBarChartData,
      serviceThresholdLineChartData,
      totalSamples: sum(samples),
      zeroSampleDays: samples.filter((d) => d === 0).length,
    });
  }

  handleChartClick() {
    const { isHoverDisabled } = this.state;

    this.setState({
      isHoverDisabled: !isHoverDisabled,
    });
  }

  handleChartHover(hoverDate) {
    this.setState({
      currentHoverIndicatorDate: hoverDate,
    });
  }

  handleRegionChange(nextRegionId) {
    console.log({ nextRegionId });
    const match = regions.find((region) => {
      let key = `${region.continent}/${region.country}/${region.country}-${region.region}`;
      if (!region.region) {
        key = `${region.continent}/${region.country}`;
      }
      return key === nextRegionId;
    });

    this.setStateWithRegion({
      regionId: nextRegionId,
      regionLabel: match.label,
    });
  }

  handleYearChange(e) {
    const { value } = e.target;
    this.setState(
      {
        ...this.state,
        year: +value,
      },
      () => {
        this.fetchData();
      }
    );
  }

  renderDataQualityText() {
    const { meanSamples, zeroSampleDays } = this.state;

    if (zeroSampleDays === 0 && meanSamples > 200) return "pretty good";
    if (zeroSampleDays === 0 && meanSamples < 200) return "OK";
    if (zeroSampleDays > 0 && meanSamples < 200) return "sparse";
    return "normal";
  }

  renderBarChartText() {
    const {
      currentHoverIndicatorDate,
      regionLabel,
      meanSamples,
      samplesBarChartData,
      zeroSampleDays,
    } = this.state;
    const formatNumber = format(",.0f");
    if (currentHoverIndicatorDate === null) {
      return (
        <p>
          Our data from <span className="dynamic-value">{regionLabel}</span>{" "}
          during this time period is{" "}
          <span className="dynamic-value">{this.renderDataQualityText()}</span>,
          with a mean of approximately{" "}
          <span className="dynamic-value">
            {typeof meanSamples === "string"
              ? `${meanSamples}`
              : formatNumber(meanSamples)}
          </span>{" "}
          tests per day. There were{" "}
          <span className="dynamic-value">
            {typeof zeroSampleDays === "string"
              ? zeroSampleDays
              : formatNumber(zeroSampleDays)}
          </span>{" "}
          days where no successful test was recorded.
        </p>
      );
    }

    const match = samplesBarChartData.find(
      (d) => formatDate(d.date) === formatDate(currentHoverIndicatorDate)
    );

    return (
      <p>
        We recorded{" "}
        <span className="dynamic-value">{formatNumber(match.samples)}</span>{" "}
        tests from <span className="dynamic-value">{regionLabel}</span> on{" "}
        <span className="dynamic-value">
          {formatDate(currentHoverIndicatorDate)}
        </span>
        .
      </p>
    );
  }

  renderLineChartText() {
    const {
      currentHoverIndicatorDate,
      meanAudioServicePercent,
      meanVideoServicePercent,
      serviceThresholdLineChartData,
    } = this.state;

    if (currentHoverIndicatorDate === null) {
      return (
        <p>
          On average,{" "}
          <span className="dynamic-value">
            {typeof meanAudioServicePercent === "string"
              ? meanAudioServicePercent
              : format(".0%")(meanAudioServicePercent)}
          </span>{" "}
          of the tests had sufficient bandwidth for making{" "}
          <span className="audio-label">audio</span> calls (at least 2 megabits
          per second) and{" "}
          <span className="dynamic-value">
            {typeof meanVideoServicePercent === "string"
              ? meanVideoServicePercent
              : format(".0%")(meanVideoServicePercent)}
          </span>{" "}
          of the tests enough for successful{" "}
          <span className="video-label">video</span> calls (at least 10 mbps).
        </p>
      );
    }

    const serviceThresholdData = serviceThresholdLineChartData[0]
      ? [
          serviceThresholdLineChartData[0].values.find(
            (d) => formatDate(d.date) === formatDate(currentHoverIndicatorDate)
          ),
          serviceThresholdLineChartData[1].values.find(
            (d) => formatDate(d.date) === formatDate(currentHoverIndicatorDate)
          ),
        ]
      : [];

    if (!serviceThresholdData[0]) {
      return "";
    }

    return (
      <p>
        On{" "}
        <span className="dynamic-value">
          {formatDate(currentHoverIndicatorDate)}
        </span>
        ,{" "}
        <span className="dynamic-value">
          {format(".0%")(serviceThresholdData[0].samples_above_threshold_pct)}
        </span>{" "}
        of the tests had sufficient bandwidth for making{" "}
        <span className="audio-label">audio</span> calls (at least 2 megabits
        per second) and{" "}
        <span className="dynamic-value">
          {format(".0%")(serviceThresholdData[1].samples_above_threshold_pct)}
        </span>{" "}
        of the tests enough for successful{" "}
        <span className="video-label">video</span> calls (at least 10 mbps).
      </p>
    );
  }

  render() {
    const {
      currentHoverIndicatorDate,
      heatMapData,
      isHoverDisabled,
      isFetching,
      regionId,
      regionLabel,
      samplesBarChartData,
      serviceThresholdLineChartData,
      totalSamples,
      year,
    } = this.state;

    const dataSourceUrl = `https://api.measurementlab.net/${regionId}/${year}/histogram_daily_stats.json`;

    const timeParameterEl = (
      <span style={{ display: "inline-block" }}>
        {year === 2020 ? "since" : "between"}{" "}
        <span className="dynamic-value">
          January 1{year === 2020 ? ", " : " and December 31,"}
          <select onChange={this.handleYearChange} value={year}>
            <option>2020</option>
            <option>2019</option>
          </select>
        </span>
        .
      </span>
    );

    return (
      <div className="dashboard-page">
        <div className="dashboard-controls sticky">
          <div>
            Measurement Lab has recorded approximately{" "}
            <span className="dynamic-value">
              {typeof totalSamples === "string"
                ? totalSamples
                : format(",")(totalSamples)}
            </span>{" "}
            speed tests from{" "}
            <RegionSelect onChange={this.handleRegionChange} value={regionId} />{" "}
            {timeParameterEl} You can see the{" "}
            <a href={dataSourceUrl}>data from our API</a> or{" "}
            <a>contribute to the global data set by taking a speed test</a>.
          </div>
        </div>
        <h1>Internet speed data from {regionLabel}</h1>
        <div className="group">
          <div>
            {this.renderLineChartText()}
            <p>
              <i>
                You can hover over the chart to the right to see more details
                about a particular day.
              </i>
            </p>
          </div>
          <div className="chart-placeholder">
            Percentage of tests by service thresholds in {regionLabel}
            <LineChart
              currentHoverIndicatorDate={currentHoverIndicatorDate}
              data={serviceThresholdLineChartData}
              isHoverDisabled={isHoverDisabled}
              isFetching={isFetching}
              onClick={this.handleChartClick}
              onHover={this.handleChartHover}
              strokeFn={(d) => {
                if (d.name === "Audio") return "rgb(225, 138, 212)";
                return "rgb(155, 210, 199)";
              }}
              xAttribute="date"
              yAttribute="samples_above_threshold_pct"
            />
          </div>
        </div>
        <div className="group column-reverse">
          <div className="chart-placeholder">
            Speed tests per day in {regionLabel}
            <BarChart
              currentHoverIndicatorDate={currentHoverIndicatorDate}
              data={samplesBarChartData}
              isHoverDisabled={isHoverDisabled}
              isFetching={isFetching}
              onClick={this.handleChartClick}
              onHover={this.handleChartHover}
              xAttribute="date"
              yAttribute="samples"
            />
          </div>
          <div>
            {this.renderBarChartText()}
            <p>
              <i>
                You can hover over the chart to the left to see more details
                about a particular day.
              </i>
            </p>
          </div>
        </div>
        <div className="group">
          <div>
            <p>
              Another way we can look at our data from{" "}
              <span className="dynamic-value">{regionLabel}</span> is to look at
              the percentage of tests (per day) that were within a download
              speed "bucket".
            </p>
            <details>
              <summary>Learn more about our bucket approach.</summary>
              <div>
                We divide up our traffic into "buckets", depending on the
                measured speed for both upload and download values. We do this
                because of X, Y, and Z.
              </div>
            </details>
            <p>
              A gray color indicates that the number of samples within that
              bucket was close to the mean. A pink color tells you that there
              was a higher than average amount of samples in the bucket, and a
              more green color tells you that there less than the average amount
              of tests in that bucket.
            </p>
          </div>
          <div className="chart-placeholder">
            Distribution of tests by bucket per day in {regionLabel}
            <HeatmapChart
              currentHoverIndicatorDate={currentHoverIndicatorDate}
              data={heatMapData}
              isHoverDisabled={isHoverDisabled}
              isFetching={isFetching}
              onClick={this.handleChartClick}
              onHover={this.handleChartHover}
            />
          </div>
        </div>
        <h2>Data by internal political boundaries</h2>
        <div>
          <p>
            We have more detailed geographic data for{" "}
            <span className="dynamic-value">{regionLabel}</span> and you can see
            data for{" "}
            <span className="dynamic-value">
              {regionLabel === "Louisiana" ? "parishes" : "counties"},
              Congressional districts, and ZIP codes
            </span>{" "}
            below. The tables represent the daily average values for the time
            period and you can see the underlying data with the "source" links.
          </p>
          <div>
            <table>
              <caption>
                <span>
                  <h3>
                    Speed tests by{" "}
                    {regionLabel === "Louisiana" ? "parish" : "county"}{" "}
                  </h3>
                  <span>
                    <a>See the data</a>
                  </span>
                </span>
              </caption>
              <thead>
                <tr>
                  <th>
                    {regionLabel === "Louisiana" ? "Parish" : "County"} name
                  </th>
                  <th>FIPS</th>
                  <th>Test count</th>
                  <th>Sufficient for audio</th>
                  <th>Sufficient for video</th>
                  <th>Median dl</th>
                  <th>Median up</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>County 1</td>
                  <td>00000</td>
                  <td>100</td>
                  <td>40%</td>
                  <td>20%</td>
                  <td>100 mbps</td>
                  <td>40 mbps</td>
                </tr>
                <tr>
                  <td>County 1</td>
                  <td>00000</td>
                  <td>100</td>
                  <td>40%</td>
                  <td>20%</td>
                  <td>100 mbps</td>
                  <td>40 mbps</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table>
              <caption>
                <span>
                  <h3>Speed tests by Congressional districts</h3>
                  <span>
                    <a>See the data</a>
                  </span>
                </span>
              </caption>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Test count</th>
                  <th>Sufficient for audio</th>
                  <th>Sufficient for video</th>
                  <th>Median dl</th>
                  <th>Median up</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>District 4</td>
                  <td>100</td>
                  <td>40%</td>
                  <td>20%</td>
                  <td>100 mbps</td>
                  <td>40 mbps</td>
                </tr>
                <tr>
                  <td>District 5</td>
                  <td>100</td>
                  <td>40%</td>
                  <td>20%</td>
                  <td>100 mbps</td>
                  <td>40 mbps</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table>
              <caption>
                <span>
                  <h3>Speed tests by ZIP code</h3>
                  <span>
                    <a>See the data</a>
                  </span>
                </span>
              </caption>
              <thead>
                <tr>
                  <th>ZIP</th>
                  <th>Test count</th>
                  <th>Sufficient for audio</th>
                  <th>Sufficient for video</th>
                  <th>Median dl</th>
                  <th>Median up</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>99923</td>
                  <td>100</td>
                  <td>40%</td>
                  <td>20%</td>
                  <td>100 mbps</td>
                  <td>40 mbps</td>
                </tr>
                <tr>
                  <td>99924</td>
                  <td>100</td>
                  <td>40%</td>
                  <td>20%</td>
                  <td>100 mbps</td>
                  <td>40 mbps</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default urlConnect(urlHandler, mapStateToProps)(DashboardPage);
