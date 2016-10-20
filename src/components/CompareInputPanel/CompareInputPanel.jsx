import React, { PureComponent, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import {
  FilterSuggestions,
  SearchSelect,
} from '../../components';

import './CompareInputPanel.scss';

/**
 * Component for selecting inputs for the compare page
 */
export default class CompareLocationsInput extends PureComponent {
  static propTypes = {
    colors: PropTypes.object,
    facetItemIds: PropTypes.array,
    facetItemInfos: PropTypes.array,
    facetType: PropTypes.object,
    filter1Ids: PropTypes.array,
    filter1Infos: PropTypes.array,
    filter2Ids: PropTypes.array,
    filter2Infos: PropTypes.array,
    filterTypes: PropTypes.array,
    onFacetItemsChange: PropTypes.func,
    onFilter1Change: PropTypes.func,
    onFilter2Change: PropTypes.func,
    topFilter1: PropTypes.object,
    topFilter2: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onFilter1Add = this.onFilter1Add.bind(this);
    this.onFilter2Add = this.onFilter2Add.bind(this);
  }

  onFilter1Add(suggestion) {
    const { filter1Infos, onFilter1Change } = this.props;
    const newValues = [...filter1Infos, suggestion];
    if (onFilter1Change) {
      onFilter1Change(newValues);
    }
  }

  onFilter2Add(suggestion) {
    const { filter2Infos, onFilter2Change } = this.props;
    const newValues = [...filter2Infos, suggestion];
    if (onFilter2Change) {
      onFilter2Change(newValues);
    }
  }

  renderFilterClientIspsInput(changeCallback) {
    const { colors, facetItemIds, filter1Infos, filter2Infos, filterTypes, facetType } = this.props;
    const infos = filterTypes[0].value === 'clientIsp' ? filter1Infos : filter2Infos;
    const hasFacetItems = facetItemIds.length;

    return (
      <div>
        <h4>Filter by Client ISP</h4>
        <p>Select one or more Client ISPs to filter the measurements by.</p>
        <SearchSelect
          type="clientIsp"
          orientation="vertical"
          disabled={!hasFacetItems}
          onChange={changeCallback}
          searchFilterItemIds={facetItemIds}
          searchFilterType={facetType.value}
          selected={infos}
          colors={colors}
        />
      </div>
    );
  }

  renderFilterTransitIspsInput(changeCallback) {
    const { colors, facetItemIds, filter1Infos, filter2Infos, filterTypes, facetType } = this.props;
    const infos = filterTypes[0].value === 'transitIsp' ? filter1Infos : filter2Infos;
    const hasFacetItems = facetItemIds.length;

    return (
      <div>
        <h4>Filter by Transit ISP</h4>
        <p>Select one or more Transit ISPs to filter the measurements by.</p>
        <SearchSelect
          type="transitIsp"
          orientation="vertical"
          disabled={!hasFacetItems}
          onChange={changeCallback}
          searchFilterItemIds={facetItemIds}
          searchFilterType={facetType.value}
          selected={infos}
          colors={colors}
        />
      </div>
    );
  }

  renderFilterLocationsInput(changeCallback) {
    const { colors, facetItemIds, filter1Infos, filter2Infos, filterTypes, facetType } = this.props;
    const infos = filterTypes[0].value === 'location' ? filter1Infos : filter2Infos;

    const hasFacetItems = facetItemIds.length;
    return (
      <div>
        <h4>Filter by Location</h4>
        <p>Select one or more locations to filter the measurements by.</p>
        <SearchSelect
          type="location"
          orientation="vertical"
          disabled={!hasFacetItems}
          onChange={changeCallback}
          searchFilterItemIds={facetItemIds}
          searchFilterType={facetType.value}
          selected={infos}
          colors={colors}
        />
      </div>
    );
  }

  renderFilterInput(filterType, changeCallback) {
    if (filterType.value === 'location') {
      return this.renderFilterLocationsInput(changeCallback);
    } else if (filterType.value === 'clientIsp') {
      return this.renderFilterClientIspsInput(changeCallback);
    } else if (filterType.value === 'transitIsp') {
      return this.renderFilterTransitIspsInput(changeCallback);
    }

    return undefined;
  }

  renderFacetLocationsInput() {
    const { colors, facetItemInfos, onFacetItemsChange } = this.props;
    return (
      <div>
        <header>
          <h3>Locations</h3>
        </header>
        <p>Select one or more locations to explore measurements in. Each location will get its own chart.</p>
        <SearchSelect
          type="location"
          onChange={onFacetItemsChange}
          selected={facetItemInfos}
          colors={colors}
        />
      </div>
    );
  }

  renderFacetClientIspsInput() {
    const { colors, facetItemInfos, onFacetItemsChange } = this.props;
    return (
      <div>
        <header>
          <h3>Client ISPs</h3>
        </header>
        <p>Select one or more client ISPs to explore measurements in. Each client ISP will get its own chart.</p>
        <SearchSelect
          type="clientIsp"
          onChange={onFacetItemsChange}
          selected={facetItemInfos}
          colors={colors}
        />
      </div>
    );
  }

  renderFacetTransitIspsInput() {
    const { colors, facetItemInfos, onFacetItemsChange } = this.props;
    return (
      <div>
        <header>
          <h3>Transit ISPs</h3>
        </header>
        <p>Select one or more transit ISPs to explore measurements in. Each transit ISP will get its own chart.</p>
        <SearchSelect
          type="transitIsp"
          onChange={onFacetItemsChange}
          selected={facetItemInfos}
          colors={colors}
        />
      </div>
    );
  }

  renderFacetInput() {
    const { facetType } = this.props;
    if (facetType.value === 'location') {
      return this.renderFacetLocationsInput();
    } else if (facetType.value === 'clientIsp') {
      return this.renderFacetClientIspsInput();
    } else if (facetType.value === 'transitIsp') {
      return this.renderFacetTransitIspsInput();
    }

    return undefined;
  }

  renderFilterSuggestions(filterType, top, onAdd) {
    const { facetItemIds } = this.props;
    if (!facetItemIds || !facetItemIds.length) {
      return null;
    }

    return (
      <FilterSuggestions suggestions={top} labelKey={filterType.labelKey} onSelect={onAdd} />
    );
  }

  render() {
    const { filterTypes, onFilter1Change, onFilter2Change, topFilter1, topFilter2 } = this.props;

    return (
      <div className="CompareInputPanel input-section subsection">
        {this.renderFacetInput()}
        <Row>
          <Col md={6}>
            {this.renderFilterInput(filterTypes[0], onFilter1Change)}
            {this.renderFilterSuggestions(filterTypes[0], topFilter1, this.onFilter1Add)}
          </Col>
          <Col md={6}>
            {this.renderFilterInput(filterTypes[1], onFilter2Change)}
            {this.renderFilterSuggestions(filterTypes[1], topFilter2, this.onFilter2Add)}
          </Col>
        </Row>
      </div>
    );
  }
}
