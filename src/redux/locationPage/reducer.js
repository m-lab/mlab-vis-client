/**
 * Reducer for locationPage
 */
import * as Actions from './actions';

/**
locationPage:
  viewMetric (download, upload, RTT, retransmission rate)

  selectedClientIsps
    - clientIsp1
    - clientIsp2

  selectedLocations
    - location1
    - location2

  selectedTime:
    startDate
    endDate
    timeAggregation (day, month, year)

  chartOptions:
    showBaselines
    showRegionalValues

  fixed:
    timeFrame (lastWeek, lastMonth, lastYear)
    xMetric (download, upload, RTT, retransmission rate)
    yMetric (download, upload, RTT, retransmission rate)
 */

const initialState = {
  viewMetric: 'download',

  selectedClientIsps: [],
  selectedLocations: [],

  selectedTime: {
    startDate: undefined,
    endDate: undefined,
    timeAggregation: 'day',
  },

  chartOptions: {
    showBaselines: false,
    showRegionalValues: true,
  },

  fixed: {
    timeFrame: 'lastMonth',
    xMetric: 'download',
    yMetric: 'upload',
  },
};

// the location page reducer
function locationPage(state = initialState, action = {}) {
  switch (action.type) {
    case Actions.RESET_SELECTED_LOCATIONS:
      return {
        ...state,
        selectedLocations: initialState.selectedLocations,
      };
    case Actions.RESET_SELECTED_CLIENT_ISPS:
      return {
        ...state,
        selectedClientIsps: initialState.selectedClientIsps,
      };
    default:
      return state;
  }
}


// Export the reducer
export default locationPage;
