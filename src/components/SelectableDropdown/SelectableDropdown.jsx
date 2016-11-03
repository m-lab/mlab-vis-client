import React, { PureComponent, PropTypes } from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';


/**
 * A component that lets the user choose from a dropdown list of values
 */
export default class SelectableDropdown extends PureComponent {
  static propTypes = {
    // The value of the active item
    active: PropTypes.any,
    // The items { label, value } to select from
    items: PropTypes.array,
    // unique name for dropdown to use.
    name: PropTypes.string,
    // change callback
    onChange: PropTypes.func,
  }

  /**
   * Render individual item using Bootstrap
   */
  renderItem(item) {
    const { active, onChange, name } = this.props;
    const isActive = (active.value === item.value);

    return (
      <MenuItem
        eventKey="1"
        onClick={() => onChange && onChange(name, item.value)}
        active={isActive}
        key={item.value}
      >
        {item.label}
      </MenuItem>
    );
  }

  /**
   * Render
   */
  render() {
    const { items, name, active } = this.props;

    const title = active ? active.label : '__';

    return (
      <DropdownButton bsStyle="primary" title={title} key={name} id={`dropdown-basic-${name}`}>
        {items.map((item) => this.renderItem(item))}
      </DropdownButton>
    );
  }
}
