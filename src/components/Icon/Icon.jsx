import React, { PureComponent, PropTypes } from 'react';

/**
 * Simple wrapper for Font Awesome icons. react-fa doesn't work with
 * serverside rendering. test
 */
export default class Icon extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  render() {
    const { name } = this.props;

    return (
      <i className={`fa fa-${name}`} />
    );
  }
}
