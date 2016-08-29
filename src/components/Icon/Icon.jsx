import React, { PureComponent, PropTypes } from 'react';

/**
 * Simple wrapper for Font Awesome icons. react-fa doesn't work with
 * serverside rendering. test
 */
export default class Icon extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  render() {
    const { name, className, onClick } = this.props;

    return (
      <i className={`fa fa-${name} ${className}`} onClick={onClick} />
    );
  }
}
