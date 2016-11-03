import React, { PureComponent, PropTypes } from 'react';
import moment from 'moment';

import jquery from 'jquery';
import daterangepicker from 'bootstrap-daterangepicker'; // eslint-disable-line

import momentPropTypes from 'react-moment-proptypes';

import '../../assets/daterangepicker.scss';
import './DateRangeSelector.scss';

/**
 * Date Range Selector Component. Wraps http://www.daterangepicker.com/
 */
export default class DateRangeSelector extends PureComponent {
  static propTypes = {
    alwaysShowCalendars: PropTypes.bool,
    endDate: momentPropTypes.momentObj,
    maxDate: momentPropTypes.momentObj,
    minDate: momentPropTypes.momentObj,
    onChange: PropTypes.func,
    ranges: PropTypes.object,
    showDropdowns: PropTypes.bool,
    startDate: momentPropTypes.momentObj,
  }

  static defaultProps = {
    alwaysShowCalendars: true,
    maxDate: moment(),
    minDate: moment('2009-01-01'), // actual min date seems to be: 2009-02-18 00:00:00 UTC
    ranges: {
      'Last 3 Months': [moment().subtract(3, 'months'), moment()],
      'Last 6 Months': [moment().subtract(6, 'months'), moment()],
      'Last 1 Year': [moment().subtract(1, 'year'), moment()],
      'Last 3 Years': [moment().subtract(3, 'years'), moment()],
      'Last 5 Years': [moment().subtract(5, 'years'), moment()],
      'This Year': [moment().startOf('year'), moment().endOf('year')],
    },
    showDropdowns: true,
  }

  /**
   * Main constructor. Bind handlers here.
   */
  constructor(props) {
    super(props);

    this.onDatesChange = this.onDatesChange.bind(this);
  }

  // mount the jquery based date picker
  componentDidMount() {
    const { alwaysShowCalendars, minDate, maxDate, startDate, endDate, ranges, showDropdowns } = this.props;
    jquery(this.root).daterangepicker({
      alwaysShowCalendars,
      startDate,
      endDate,
      minDate,
      maxDate,
      ranges,
      showDropdowns,
    }).on('apply.daterangepicker', (evt, datePicker) => {
      this.onDatesChange(datePicker);
    });
  }

  componentWillUpdate(nextProps) {
    // synchronize the props with the datepicker
    jquery(this.root).data('daterangepicker').setStartDate(nextProps.startDate);
    jquery(this.root).data('daterangepicker').setEndDate(nextProps.endDate);
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
   * The main render method.
   * @return {React.Component} The rendered component
   */
  render() {
    return (
      <div className="DateRangeSelector">
        <input className="main-date-input form-control" ref={(node) => { this.root = node; }} />
      </div>
    );
  }
}
