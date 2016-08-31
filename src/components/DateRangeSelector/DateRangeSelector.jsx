import React, { PureComponent, PropTypes } from 'react';

import { DateRangePicker } from 'react-dates';

import momentPropTypes from 'react-moment-proptypes';

import '../../assets/datepicker.css';
import './DateRangeSelector.scss';


/**
 * Date Range Selector Component
 */
export default class DateRangeSelector extends PureComponent {

  static propTypes = {
    endDate: momentPropTypes.momentObj,
    onChange: PropTypes.func,
    startDate: momentPropTypes.momentObj,
  }

  /**
   * Main constructor. Bind handlers here.
   */
  constructor(props) {
    super(props);

    this.state = {
      focus: null,
    };
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  /**
   * Callback for when date changes
   * @param {Object} obj object with startDate and endDate attributes
   */
  onDatesChange({ startDate, endDate }) {
    const { onChange } = this.props;
    onChange(startDate, endDate);
  }

  /**
   * Callback for when date changes
   * @param {String} focus  Which field is focused
   */
  onFocusChange(focus) {
    this.setState({
      focus,
    });
  }

  /**
   * The main render method.
   * @return {React.Component} The rendered component
   */
  render() {
    const { startDate, endDate } = this.props;
    const { focus } = this.state;

    return (
      <div className="DateRangeSelector">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          focusedInput={focus}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          isOutsideRange={() => false}
        />
      </div>
    );
  }
}
