import React, { PureComponent, PropTypes } from 'react';
import { metrics } from '../../constants';
import { SelectableList, HelpTip } from '../../components';

/**
 * A component that lets the user choose a metric to view
 */
export default class MetricSelector extends PureComponent {
  static propTypes = {
    // The active metric value
    active: PropTypes.string,
    // change callback
    onChange: PropTypes.func,
  }

  render() {
    const { active, onChange } = this.props;

    return (
      <div className="metric-selector">
        <h5>Metric <HelpTip id="metric-tip" />
        </h5>
        <SelectableList items={metrics} active={active} onChange={onChange} />
      </div>
    );
  }
}
