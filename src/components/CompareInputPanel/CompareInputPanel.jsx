import React, { PureComponent, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import {
  SearchSelect,
} from '../../components';

/**
 * Component for selecting inputs for the compare page
 */
export default class CompareLocationsInput extends PureComponent {
  static propTypes = {
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
  }

  renderFilterClientIspsInput(changeCallback) {
    const { facetItemIds, filter1Infos, filter2Infos, filterTypes, facetType } = this.props;
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
        />
      </div>
    );
  }

  renderFilterTransitIspsInput(changeCallback) {
    const { facetItemIds, filter1Infos, filter2Infos, filterTypes, facetType } = this.props;
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
        />
      </div>
    );
  }

  renderFilterLocationsInput(changeCallback) {
    const { facetItemIds, filter1Infos, filter2Infos, filterTypes, facetType } = this.props;
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
    const { facetItemInfos, onFacetItemsChange } = this.props;
    return (
      <div>
        <header>
          <h3>Locations</h3>
        </header>
        <p>Select one or more locations to explore measurements in. Each location will get its own chart.</p>
        <SearchSelect type="location" onChange={onFacetItemsChange} selected={facetItemInfos} />
      </div>
    );
  }

  renderFacetClientIspsInput() {
    const { facetItemInfos, onFacetItemsChange } = this.props;
    return (
      <div>
        <header>
          <h3>Client ISPs</h3>
        </header>
        <p>Select one or more client ISPs to explore measurements in. Each client ISP will get its own chart.</p>
        <SearchSelect type="clientIsp" onChange={onFacetItemsChange} selected={facetItemInfos} />
      </div>
    );
  }

  renderFacetTransitIspsInput() {
    const { facetItemInfos, onFacetItemsChange } = this.props;
    return (
      <div>
        <header>
          <h3>Transit ISPs</h3>
        </header>
        <p>Select one or more transit ISPs to explore measurements in. Each transit ISP will get its own chart.</p>
        <SearchSelect type="transitIsp" onChange={onFacetItemsChange} selected={facetItemInfos} />
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

  render() {
    const { filterTypes, onFilter1Change, onFilter2Change } = this.props;
    return (
      <div className="input-section subsection">
        {this.renderFacetInput()}
        <Row>
          <Col md={6}>
            {this.renderFilterInput(filterTypes[0], onFilter1Change)}
          </Col>
          <Col md={6}>
            {this.renderFilterInput(filterTypes[1], onFilter2Change)}
          </Col>
        </Row>
      </div>
    );
  }
}
