import React, { PureComponent, PropTypes } from 'react';
import { timeAggregations } from '../../constants';
import { SelectableList, HelpTip } from '../../components';

/**
 * A component that lets the user choose a metric to view
 *
 * @prop {String} active The active metric value
 * @prop {Function} onChange change callback
 */
export default class TimeAggregationSelector extends PureComponent {
  static propTypes = {
    active: PropTypes.string,
    onChange: PropTypes.func,
  }

  render() {
    const { active, onChange } = this.props;

    return (
      <div className="time-aggregation-selector">
        <h5>Time Aggregation <HelpTip id="time-agg-tip" content="Specify how the data should be binned by time." /></h5>
        <SelectableList items={timeAggregations} active={active} onChange={onChange} />
      </div>
    );
  }
}
