/**
 * Selectors for locationPage
 */
// import { createSelector } from 'reselect';
// import { colorsFor } from '../../utils/color';
import timeAggregationFromDates from '../../utils/timeAggregationFromDates';

// ----------------------
// Input Selectors
// ----------------------
export function getAutoTimeAggregation(state) {
  return state.locationPage.autoTimeAggregation;
}

export function getTimeAggregation(state, props) {
  let { timeAggregation } = props;

  // this sets the default value
  if (timeAggregation == null) {
    timeAggregation = timeAggregationFromDates(props.startDate, props.endDate);
  }

  return timeAggregation;
}

// ----------------------
// Selectors
// ----------------------
