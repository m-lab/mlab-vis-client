import React, { PureComponent, PropTypes } from 'react';

import { DateRangePicker } from 'react-dates';

import moment from 'moment';

import '../../assets/datepicker.css';
import './DateRangeSelector.scss';


export default class DateRangeSelector extends PureComponent {

  static propTypes = {
    endDate: PropTypes.string,
    startDate: React.PropTypes.string,
  }

  static defaultProps = {
    endDate: '2015-12-01',
    startDate: '2015-11-01',
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

  onDatesChange({ startDate, endDate }) {
    console.log(startDate);
  }

  onFocusChange(focus) {
    console.log(focus);
    this.setState({
      focus,
    });
  }

  render() {
    const { startDate, endDate } = this.props;
    const { focus } = this.state;


    const mstartDate = moment(startDate);
    const mendDate = moment(endDate);

    return (
      <div className="DateRangeSelector">
        <DateRangePicker
          startDate={mstartDate}
          endDate={mendDate}
          focusedInput={focus}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          isOutsideRange={() => false}
        />
      </div>
    );
  }
}
