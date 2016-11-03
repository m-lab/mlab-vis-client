import React, { PureComponent, PropTypes } from 'react';
import { timeAggregations } from '../../constants';
import { SelectableList, HelpTip } from '../../components';

/**
 * A component that lets the user choose which time aggregate to use
 */
export default class TimeAggregationSelector extends PureComponent {
  static propTypes = {
    // The active metric value
    active: PropTypes.string,
    // change callback
    onChange: PropTypes.func,
  }

  render() {
    const { active, onChange } = this.props;

    return (
      <div className="time-aggregation-selector">
        <h5>Time Aggregation <HelpTip id="time-agg-tip" /></h5>
        <SelectableList items={timeAggregations} active={active} onChange={onChange} />
      </div>
    );
  }
}
