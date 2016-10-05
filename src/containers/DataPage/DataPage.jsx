import React, { PureComponent, PropTypes } from 'react';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import Helmet from 'react-helmet';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';

import { apiRoot } from '../../config';
import { LocationSearch } from '../../containers';
import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';

import './DataPage.scss';


// Define how to read/write state to URL query parameters
const urlQueryConfig = {
  dataFormat: { type: 'string', defaultValue: 'csv', urlKey: 'format' },

  // selected time
  // TODO: change defaults to more recent time period when data is up-to-date
  startDate: { type: 'date', urlKey: 'start', defaultValue: moment('2015-10-1') },
  endDate: { type: 'date', urlKey: 'end', defaultValue: moment('2015-11-1') },
  timeAggregation: { type: 'string', urlKey: 'aggr' },
  clientIspIds: { type: 'array', urlKey: 'clientIsps' },
  transitIspIds: { type: 'array', urlKey: 'transitIsps' },
  locationIds: { type: 'array', urlKey: 'locations' },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);
function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
  };
}

class DataPage extends PureComponent {
  static propTypes = {
    autoTimeAggregation: PropTypes.bool,
    clientIspIds: PropTypes.array,
    colors: PropTypes.object,
    dataFormat: PropTypes.string,
    dispatch: PropTypes.func,
    endDate: momentPropTypes.momentObj,
    locationIds: PropTypes.array,
    startDate: momentPropTypes.momentObj,
    timeAggregation: PropTypes.string,
    transitIspIds: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.onDataFormatChange = this.onDataFormatChange.bind(this);
  }

  onDataFormatChange(dataFormat) {
    console.log('TODO: got new data format', dataFormat);
  }

  renderFilters() {
    return (
      <div className="features-section">
        <h4>Features</h4>
        <p>
          Select which features you would like to gather data about. You must select at least one.
        </p>
        <Row>
          <Col md={4}>
            <h5>Locations</h5>
            <input className="form-control" />
          </Col>
          <Col md={4}>
            <h5>Client ISPs</h5>
            <input className="form-control" />
          </Col>
          <Col md={4}>
            <h5>Transit ISPs</h5>
            <input className="form-control" />
          </Col>
        </Row>
      </div>
    );
  }

  renderRestUrl() {
    const restUrl = apiRoot;

    return (
      <div className="section">
        <h4>Rest API URL</h4>
        <p>
          This is the URL you can use to get the generated data directly from the REST API.
        </p>
        <input className="form-control" readOnly value={restUrl} />
      </div>
    );
  }

  renderDataFormatSelector() {
    const { dataFormat } = this.props;

    return (
      <div>
        <h5>Data Format</h5>
        <ButtonGroup>
          <Button
            className={classNames({ active: dataFormat === 'csv' })}
            onClick={() => this.onDataFormatChange('csv')}
          >
            CSV
          </Button>
          <Button
            className={classNames({ active: dataFormat === 'json' })}
            onClick={() => this.onDataFormatChange('json')}
          >
            JSON
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  renderTimeAggregationSelector() {
    const { timeAggregation } = this.props;

    return (
      <div>
        <h5>Time Aggregation</h5>
        <select className="form-control" />
      </div>
    );
  }

  render() {
    return (
      <div className="DataPage">
        <Helmet title="Data" />
        <h1>Data</h1>
        <Row>
          <Col md={8}>
            <p>
              There are several different ways to access the data used for these visualizations.
              You can download the data for the individual charts by clicking the CSV or JSON buttons
              beneath them, you can use the <a href={apiRoot}>REST API</a> that powers these
              visualizations directly, or you can use the interface below.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <h5>Time Range</h5>
            <input className="form-control" />
          </Col>
          <Col md={4}>
            {this.renderTimeAggregationSelector()}
          </Col>
          <Col md={4}>
            {this.renderDataFormatSelector()}
          </Col>
        </Row>
        {this.renderFilters()}
        <button className="btn btn-primary download-btn">Download Data</button>
        {this.renderRestUrl()}
      </div>
    );
  }
}

export default urlConnect(urlHandler, mapStateToProps)(DataPage);
