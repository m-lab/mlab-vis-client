import React, { PureComponent, PropTypes } from 'react';
import { metrics } from '../../constants';
import { SelectableList, HelpTip } from '../../components';

/**
 * A component that lets the user choose a metric to view
 *
 * @prop {String} active The active metric value
 * @prop {Function} onChange change callback
 */
export default class MetricSelector extends PureComponent {
  static propTypes = {
    active: PropTypes.string,
    onChange: PropTypes.func,
  }

  render() {
    const { active, onChange } = this.props;

    return (
      <div className="metric-selector">
        <h5>Metric <HelpTip content="Specify which metric to visualize." id="metric-tip" />
        </h5>
        <SelectableList items={metrics} active={active} onChange={onChange} />
      </div>
    );
  }
}
