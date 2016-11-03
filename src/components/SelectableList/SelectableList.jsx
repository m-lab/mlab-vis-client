import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import { HelpTip } from '../../components';

import './SelectableList.scss';

/**
 * A component that lets the user choose from a list of values
 */
export default class SelectableList extends PureComponent {
  static propTypes = {
    // The value of the active item
    active: PropTypes.any,
    // The items { label, value } to select from
    items: PropTypes.array,
    // change callback
    onChange: PropTypes.func,
  }

  renderHelpTip(item) {
    if (item.description) {
      return (
        <HelpTip id={`${item.value}-tip`} content={item.description} />
      );
    }

    return null;
  }

  render() {
    const { active, items, onChange } = this.props;

    return (
      <div className="selectable-list">
        <ul className="list-unstyled">
          {items.map(item => (
            <li key={item.value}>
              <button
                className={classNames({ active: active === item.value })}
                onClick={() => onChange && onChange(item.value)}
              >
                {item.label} {this.renderHelpTip(item)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
