import React, { PureComponent, PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';
import classNames from 'classnames';
import { withRouter, browserHistory } from 'react-router';
import Helmet from 'react-helmet';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';

import timeAggregationFromDates from '../../utils/timeAggregationFromDates';
import { timeAggregations, defaultStartDate, defaultEndDate } from '../../constants';
import facetTypeCombinations from '../../utils/facetTypeCombinations';
import { apiRoot } from '../../config';
import {
  DateRangeSelector,
  ApiDownloadLink,
  FilterSuggestions,
  SearchSelect,
} from '../../components';
import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';

import * as DataPageActions from '../../redux/dataPage/actions';
import * as DataPageSelectors from '../../redux/dataPage/selectors';
import * as LocationsActions from '../../redux/locations/actions';
import * as ClientIspsActions from '../../redux/clientIsps/actions';
import * as TransitIspsActions from '../../redux/transitIsps/actions';
import * as TopActions from '../../redux/top/actions';

import './DataPage.scss';


// Define how to read/write state to URL query parameters
const urlQueryConfig = {
  dataFormat: { type: 'string', defaultValue: 'csv', urlKey: 'format' },

  // selected time
  startDate: { type: 'date', urlKey: 'start', defaultValue: defaultStartDate },
  endDate: { type: 'date', urlKey: 'end', defaultValue: defaultEndDate },
  timeAggregation: { type: 'string', urlKey: 'aggr' },
  clientIspIds: { type: 'set', urlKey: 'clientIsps', defaultValue: [] },
  transitIspIds: { type: 'set', urlKey: 'transitIsps', defaultValue: [] },
  locationIds: { type: 'set', urlKey: 'locations', defaultValue: [] },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);
function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    autoTimeAggregation: DataPageSelectors.getAutoTimeAggregation(state, propsWithUrl),
    clientIspInfos: DataPageSelectors.getClientIspInfos(state, propsWithUrl),
    clientIspSuggestionsForLocations: DataPageSelectors.getClientIspSuggestionsForLocations(state, propsWithUrl),
    clientIspSuggestionsForTransitIsps: DataPageSelectors.getClientIspSuggestionsForTransitIsps(state, propsWithUrl),
    colors: DataPageSelectors.getColors(state, propsWithUrl),
    downloadStatus: DataPageSelectors.getDownloadStatus(state, propsWithUrl),
    locationInfos: DataPageSelectors.getLocationInfos(state, propsWithUrl),
    locationSuggestionsForClientIsps: DataPageSelectors.getLocationSuggestionsForClientIsps(state, propsWithUrl),
    locationSuggestionsForTransitIsps: DataPageSelectors.getLocationSuggestionsForTransitIsps(state, propsWithUrl),
    timeAggregation: DataPageSelectors.getTimeAggregation(state, propsWithUrl),
    transitIspInfos: DataPageSelectors.getTransitIspInfos(state, propsWithUrl),
    transitIspSuggestionsForLocations: DataPageSelectors.getTransitIspSuggestionsForLocations(state, propsWithUrl),
    transitIspSuggestionsForClientIsps: DataPageSelectors.getTransitIspSuggestionsForClientIsps(state, propsWithUrl),
  };
}

class DataPage extends PureComponent {
  static propTypes = {
    autoTimeAggregation: PropTypes.bool,
    clientIspIds: PropTypes.array,
    clientIspInfos: PropTypes.array,
    clientIspSuggestionsForLocations: PropTypes.object,
    clientIspSuggestionsForTransitIsps: PropTypes.object,
    colors: PropTypes.object,
    dataFormat: PropTypes.string,
    dispatch: PropTypes.func,
    downloadStatus: PropTypes.string,
    endDate: momentPropTypes.momentObj,
    locationIds: PropTypes.array,
    locationInfos: PropTypes.array,
    locationSuggestionsForClientIsps: PropTypes.object,
    locationSuggestionsForTransitIsps: PropTypes.object,
    router: PropTypes.object, // react-router
    startDate: momentPropTypes.momentObj,
    timeAggregation: PropTypes.string,
    transitIspIds: PropTypes.array,
    transitIspInfos: PropTypes.array,
    transitIspSuggestionsForClientIsps: PropTypes.object,
    transitIspSuggestionsForLocations: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onReset = this.onReset.bind(this);
    this.onDataFormatChange = this.onDataFormatChange.bind(this);
    this.onTimeAggregationChange = this.onTimeAggregationChange.bind(this);
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onLocationsChange = this.onLocationsChange.bind(this);
    this.onClientIspsChange = this.onClientIspsChange.bind(this);
    this.onTransitIspsChange = this.onTransitIspsChange.bind(this);
    this.onLocationsAdd = this.onLocationsAdd.bind(this);
    this.onClientIspsAdd = this.onClientIspsAdd.bind(this);
    this.onTransitIspsAdd = this.onTransitIspsAdd.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }

  /**
   * Fetch the data for the page if needed
   */
  fetchData(props) {
    const { dispatch, locationIds, clientIspIds, transitIspIds } = props;

    // get location info if needed
    locationIds.forEach(locationId => {
      dispatch(LocationsActions.fetchInfoIfNeeded(locationId));
    });

    // get client ISP info if needed
    clientIspIds.forEach(clientIspId => {
      dispatch(ClientIspsActions.fetchInfoIfNeeded(clientIspId));
    });

    // get transit ISP info if needed
    transitIspIds.forEach(transitIspId => {
      dispatch(TransitIspsActions.fetchInfoIfNeeded(transitIspId));
    });

    // get suggestions
    if (locationIds.length) {
      dispatch(TopActions.fetchClientIspsForLocationsIfNeeded(locationIds));
      dispatch(TopActions.fetchTransitIspsForLocationsIfNeeded(locationIds));
    }
    if (clientIspIds.length) {
      dispatch(TopActions.fetchLocationsForClientIspsIfNeeded(clientIspIds));
      dispatch(TopActions.fetchTransitIspsForClientIspsIfNeeded(clientIspIds));
    }
    if (transitIspIds.length) {
      dispatch(TopActions.fetchClientIspsForTransitIspsIfNeeded(transitIspIds));
      dispatch(TopActions.fetchLocationsForTransitIspsIfNeeded(transitIspIds));
    }
  }

  onDataFormatChange(dataFormat) {
    const { dispatch } = this.props;
    dispatch(DataPageActions.changeDataFormat(dataFormat));
  }

  /**
   * Callback for when reset is clicked
   */
  onReset() {
    const { router } = this.props;
    const path = '/data';

    router.push({ pathname: path });
  }

  /**
   * Callback for when start or end date is changed
   * @param {Date} startDate new startDate
   * @param {Date} endDate new endDate
   */
  onDateRangeChange(newStartDate, newEndDate) {
    const { dispatch, autoTimeAggregation, startDate, endDate } = this.props;
    // if we are auto-detecting time aggregation, set it based on the dates
    if (autoTimeAggregation) {
      dispatch(DataPageActions.changeTimeAggregation(timeAggregationFromDates(newStartDate, newEndDate)));
    }

    if ((!startDate && newStartDate) || (newStartDate && !newStartDate.isSame(startDate, 'day'))) {
      dispatch(DataPageActions.changeStartDate(newStartDate.toDate()));
    }
    if ((!endDate && newEndDate) || (newEndDate && !newEndDate.isSame(endDate, 'day'))) {
      dispatch(DataPageActions.changeEndDate(newEndDate.toDate()));
    }
  }

  /**
   * Callback for time aggregation checkbox
   */
  onTimeAggregationChange(evt) {
    const { dispatch, autoTimeAggregation } = this.props;
    const { value } = evt.target;
    dispatch(DataPageActions.changeTimeAggregation(value));

    // when we change time aggregation, we no longer want auto detection of it based on dates
    if (autoTimeAggregation) {
      dispatch(DataPageActions.changeAutoTimeAggregation(false));
    }
  }

  /**
   * Callback when the location list changes
   * @param {Array} locations array of info objects
   */
  onLocationsChange(locations) {
    const { dispatch } = this.props;
    dispatch(DataPageActions.changeLocations(locations, dispatch));
  }

  /**
   * Callback when the client ISP list changes
   * @param {Array} clientIsps array of info objects
   */
  onClientIspsChange(clientIsps) {
    const { dispatch } = this.props;
    dispatch(DataPageActions.changeClientIsps(clientIsps, dispatch));
  }

  /**
   * Callback when the transit ISP list changes
   * @param {Array} transitIsps array of info objects
   */
  onTransitIspsChange(transitIsps) {
    const { dispatch } = this.props;
    dispatch(DataPageActions.changeTransitIsps(transitIsps, dispatch));
  }

  onLocationsAdd(suggestion) {
    const { locationInfos } = this.props;
    const newValues = [...locationInfos, suggestion];
    this.onLocationsChange(newValues);
  }

  onClientIspsAdd(suggestion) {
    const { clientIspInfos } = this.props;
    const newValues = [...clientIspInfos, suggestion];
    this.onClientIspsChange(newValues);
  }

  onTransitIspsAdd(suggestion) {
    const { transitIspInfos } = this.props;
    const newValues = [...transitIspInfos, suggestion];
    this.onTransitIspsChange(newValues);
  }

  renderSuggestions(header, filterIds, suggestions, labelKey, onSelect) {
    if (!filterIds || !filterIds.length) {
      return null;
    }

    return (
      <FilterSuggestions
        header={header}
        suggestions={suggestions}
        onSelect={onSelect}
        labelKey={labelKey}
      />
    );
  }

  renderFilters() {
    const {
      colors,
      locationIds,
      locationInfos,
      locationSuggestionsForClientIsps,
      locationSuggestionsForTransitIsps,
      clientIspIds,
      clientIspInfos,
      clientIspSuggestionsForLocations,
      clientIspSuggestionsForTransitIsps,
      transitIspIds,
      transitIspInfos,
      transitIspSuggestionsForLocations,
      transitIspSuggestionsForClientIsps,
    } = this.props;

    return (
      <div className="features-section">
        <h4>Features</h4>
        <p>
          Select which features you would like to gather data about. You must select at least one.
        </p>
        <Row>
          <Col md={4}>
            <h5>Locations</h5>
            <SearchSelect
              type="location"
              orientation="vertical"
              onChange={this.onLocationsChange}
              selected={locationInfos}
              colors={colors}
            />
            {this.renderSuggestions(
              'Suggestions based on Client ISPs',
              clientIspIds,
              locationSuggestionsForClientIsps,
              'client_location_label',
              this.onLocationsAdd
            )}
            {this.renderSuggestions(
              'Suggestions based on Transit ISPs',
              transitIspIds,
              locationSuggestionsForTransitIsps,
              'client_location_label',
              this.onLocationsAdd
            )}
          </Col>
          <Col md={4}>
            <h5>Client ISPs</h5>
            <SearchSelect
              type="clientIsp"
              orientation="vertical"
              onChange={this.onClientIspsChange}
              selected={clientIspInfos}
              colors={colors}
            />
            {this.renderSuggestions(
              'Suggestions based on Locations',
              locationIds,
              clientIspSuggestionsForLocations,
              'client_asn_name',
              this.onClientIspsAdd
            )}
            {this.renderSuggestions(
              'Suggestions based on Transit ISPs',
              transitIspIds,
              clientIspSuggestionsForTransitIsps,
              'client_asn_name',
              this.onClientIspsAdd
            )}
          </Col>
          <Col md={4}>
            <h5>Transit ISPs</h5>
            <SearchSelect
              type="transitIsp"
              orientation="vertical"
              onChange={this.onTransitIspsChange}
              selected={transitIspInfos}
              colors={colors}
            />
            {this.renderSuggestions(
              'Suggestions based on Locations',
              locationIds,
              transitIspSuggestionsForLocations,
              'server_asn_name',
              this.onTransitIspsAdd
            )}
            {this.renderSuggestions(
              'Suggestions based on Client ISPs',
              clientIspIds,
              transitIspSuggestionsForClientIsps,
              'server_asn_name',
              this.onTransitIspsAdd
            )}
          </Col>
        </Row>
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
        <select className="time-aggr form-control" value={timeAggregation} onChange={this.onTimeAggregationChange}>
          {timeAggregations.map(aggr =>
            <option key={aggr.value} value={aggr.value}>{aggr.label}</option>)}
        </select>
      </div>
    );
  }

  renderTimeRangeSelector() {
    const { startDate, endDate } = this.props;

    return (
      <div>
        <h5>Time Range</h5>
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onChange={this.onDateRangeChange}
        />
      </div>
    );
  }

  getDownloadCombinations() {
    function makeEntry(id, type, infos) {
      const info = infos.find(d => d.id === id) || { label: id };
      return {
        [`${type}Id`]: id,
        [`${type}Label`]: info.label,
      };
    }

    function labelFromTypes(types) {
      const labelMap = {
        clientIsp: 'Client ISPs',
        transitIsp: 'Transit ISPs',
        location: 'Locations',
      };
      const separator = ' --- ';

      return types.map(type => labelMap[type]).join(separator);
    }

    /**
     * Takes a combined type like location-clientIsp and creates entries for all combinations
     * of those two types based on the selected data.
     *
     * @param {String[]} combinedType the combined type e.g. ['location', 'clientIsp']
     * @return {Object[]} entries for this combined type
     */
    function getEntriesForCombinedType(combinedType, props) {
      // start with all the items for the first type (e.g. all selected locations)
      const firstType = combinedType[0];
      const firstTypeIds = props[`${firstType}Ids`];
      const firstTypeInfos = props[`${firstType}Infos`];
      let entries = firstTypeIds.map(id => makeEntry(id, firstType, firstTypeInfos));

      // now expand so we get an entry for each combination of types
      // e.g. then for each location, add an entry for each client Isp, and so on for each type.
      const remainingTypes = combinedType.slice(1);
      remainingTypes.forEach(type => {
        // here "type" is one of ('location', 'clientIsp', 'transitIsp')
        const newEntries = [];
        const ids = props[`${type}Ids`];
        const infos = props[`${type}Infos`];

        // augment entries with data for this type
        entries.forEach(entry => {
          // create a new entry for each selected item of this type
          ids.forEach(id => {
            // important to keep the attrs from the entry we are expanding with ...entry
            newEntries.push({ ...entry, ...makeEntry(id, type, infos) });
          });
        });

        entries = newEntries;
      });

      // wrap the results with some meta information: label, types.
      return { label: labelFromTypes(combinedType), types: combinedType, entries };
    }

    // only keep the combination types for which we have items for
    return facetTypeCombinations.filter(types =>
      types.every(type => this.props[`${type}Ids`].length))
    // build up all combinations for the types we have items for
    .map(combinedType => getEntriesForCombinedType(combinedType, this.props))
    .sort((a, b) => a.types.length - b.types.length);
  }


  renderDownloadLinks() {
    const { timeAggregation, startDate, endDate, dataFormat } = this.props;

    // build up all combinations based on facetTypes
    const combinations = this.getDownloadCombinations();

    return (
      <div className="section download-plan">
        <header>
          <h4>Download Links</h4>
        </header>
        <Row>
          {combinations.length ?
            combinations.map(combination => {
              const { label, entries } = combination;

              return (
                <Col md={12} key={label}>
                  <h5>{label}</h5>
                  <ul className="list-unstyled">
                    {entries.map((entry, i) =>
                      <li key={i}>
                        <ApiDownloadLink
                          {...entry}
                          timeAggregation={timeAggregation}
                          startDate={startDate}
                          endDate={endDate}
                          dataFormat={dataFormat}
                        />
                      </li>)}
                  </ul>
                </Col>
              );
            }) :
            <Col md={12}>
              <p>Please select at least one feature to generate the links to download data.</p>
            </Col>}
        </Row>
      </div>
    );
  }

  render() {
    return (
      <div className="DataPage">
        <Helmet title="Data" />
        <div className="section top-section">
          <header>
            <h2>Data</h2>
          </header>
          <Row>
            <Col md={8}>
              <p>
                There are several different ways to access the data used for these visualizations.
                You can download the data for the individual charts by clicking the CSV or JSON buttons
                beneath them, you can use the <a href={apiRoot}>REST API</a> that powers these
                visualizations directly, or you can use the interface below.
              </p>
              <p>
                For more advanced users, you also can access the data directly through <a href="http://www.measurementlab.net/data/bq/quickstart/">BigQuery</a>.
              </p>
            </Col>
            <Col md={1}>
              <button className="btn btn-default" onClick={this.onReset}>Reset</button>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              {this.renderTimeRangeSelector()}
            </Col>
            <Col md={4}>
              {this.renderTimeAggregationSelector()}
            </Col>
            <Col md={4}>
              {this.renderDataFormatSelector()}
            </Col>
          </Row>
          {this.renderFilters()}
        </div>
        {this.renderDownloadLinks()}
      </div>
    );
  }
}

export default urlConnect(urlHandler, mapStateToProps)(withRouter(DataPage));
