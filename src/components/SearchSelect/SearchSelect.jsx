import React, { PureComponent, PropTypes } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { Icon } from '../../components';
import { LocationSearch, ClientIspSearch, TransitIspSearch } from '../../containers';

import { colorsFor } from '../../utils/color';

import '../../assets/react-select.scss';
import './SearchSelect.scss';

/**
 * Select search results into a pilled list
 *
 */
export default class SearchSelect extends PureComponent {
  static propTypes = {
    colors: PropTypes.object,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    searchFilterItemIds: PropTypes.array,
    searchFilterType: PropTypes.string,
    selected: PropTypes.array,
    // NOTE: we pass in the IDs separately since they are typically
    // available before the infos used in selected are. This way we
    // can render a Loading... pill while the info is loaded.
    selectedIds: PropTypes.array,

    // The type of the search to use ('location', 'clientIsp', 'transitIsp')
    type: PropTypes.oneOf(['location', 'clientIsp', 'transitIsp']),
  }

  static defaultProps = {
    disabled: false,
    orientation: 'horizontal',
    searchFilterItemIds: [],
    selected: [],
    selectedIds: [],
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onAdd = this.onAdd.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  /**
   * Callback to add a specified option to the selected list
   * @param {Object} addValue item to add from search results
   */
  onAdd(addValue) {
    const { selected, onChange } = this.props;
    const newValues = [...selected, addValue.meta];
    if (onChange) {
      onChange(newValues);
    }
  }

  /**
   * Callback to remove a specified item from the selected list
   * @param {Object} removeValue item to remove
   */
  onRemove(removeValue) {
    const { selected, onChange } = this.props;
    const newValues = selected.filter(d => d.id !== removeValue.id);

    if (onChange) {
      onChange(newValues);
    }
  }

  onClear() {
    const { onChange } = this.props;

    if (onChange) {
      onChange([]);
    }
  }

  getColors(selected) {
    return colorsFor(selected, (d) => d.id);
  }

  /**
   * Render individual selected item
   * @return {React.Component}
   */
  renderSelectedItem(item, color) {
    const style = { backgroundColor: color };
    return (
      <div key={item.id} className="selected-item" style={style}>
        <span className="item-label">{item.label}</span>
        <Icon
          name="close"
          className="item-remove-control"
          onClick={() => this.onRemove(item)}
        />
      </div>
    );
  }

  /**
   * Render all selected items as pills
   * @return {React.Component}
   */
  renderSelectedItems() {
    const { colors, selected, selectedIds } = this.props;
    return (
      <div className="active-items">
        {selectedIds.map((id) => {
          const item = selected.find(d => d.id === id) || { id, label: 'Loading...' };
          return this.renderSelectedItem(item, colors[id]);
        })}
      </div>
    );
  }

  /**
   * Renders the clear selection control if there are items selected.
   */
  renderClearSelection() {
    const { selected } = this.props;
    if (!selected || !selected.length) {
      return null;
    }

    return (
      <button className="clear-selection-btn" onClick={this.onClear}>Clear</button>
    );
  }

  /**
   * The main render method.
   * @return {React.Component} The rendered component
   */
  render() {
    const { disabled, type, selected, orientation, searchFilterItemIds, searchFilterType } = this.props;
    const colSize = orientation === 'vertical' ? 12 : 6;

    // decide which search component to use based on type
    let SearchComponent;
    if (type === 'clientIsp') {
      SearchComponent = ClientIspSearch;
    } else if (type === 'transitIsp') {
      SearchComponent = TransitIspSearch;
    } else {
      SearchComponent = LocationSearch;
    }

    return (
      <div className="SearchSelect">
        <Row>
          <Col md={colSize}>
            <div className="search-container">
              <SearchComponent
                disabled={disabled}
                onSuggestionSelected={this.onAdd}
                exclude={selected}
                searchFilterItemIds={searchFilterItemIds}
                searchFilterType={searchFilterType}
              />
              {this.renderClearSelection()}
            </div>
          </Col>
          <Col md={colSize}>
            {this.renderSelectedItems()}
          </Col>
        </Row>
      </div>
    );
  }
}
