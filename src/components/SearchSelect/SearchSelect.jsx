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
 * @prop {String} type The type of the search to use ('location', 'clientIsp', 'transitIsp')
 */
export default class SearchSelect extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    selected: PropTypes.array,
    type: PropTypes.oneOf(['location', 'clientIsp', 'transitIsp']),
  }

  static defaultProps = {
    disabled: false,
    orientation: 'horizontal',
    selected: [],
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onAdd = this.onAdd.bind(this);
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
  renderSelectedItems(selected) {
    const colors = this.getColors(selected);
    return (
      <div className="active-items">
        {selected.map((item) =>
          this.renderSelectedItem(item, colors[item.id])
        )}
      </div>
    );
  }

  /**
   * The main render method.
   * @return {React.Component} The rendered component
   */
  render() {
    const { disabled, type, selected, orientation } = this.props;
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
            <SearchComponent disabled={disabled} onSuggestionSelected={this.onAdd} exclude={selected} />
          </Col>
          <Col md={colSize}>
            {this.renderSelectedItems(selected)}
          </Col>
        </Row>
      </div>
    );
  }
}
