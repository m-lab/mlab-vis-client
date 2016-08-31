import React, { PureComponent, PropTypes } from 'react';

/**
 * Simple wrapper for Font Awesome icons. react-fa doesn't work with
 * serverside rendering.
 */
export default class Icon extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  render() {
    const { name, ...other } = this.props;

    return (
      <i {...other} className={`fa fa-${name} ${other.className || ''}`} />
    );
  }
}
