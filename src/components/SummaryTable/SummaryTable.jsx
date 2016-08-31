import React, { PureComponent, PropTypes } from 'react';

/**
 * Table for showing summary data
 */
export default class SummaryData extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
  }

  render() {
    const { data } = this.props;
    console.log('got summary table', data);
    return (
      <div className="SummaryTable">
        summary table.
      </div>
    );
  }
}
