import * as Actions from './actions';

/**
locationPage:
  locationId
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
  locationId: undefined,
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
    case Actions.CHANGE_LOCATION:
      return {
        ...state,
        locationId: action.locationId,

        // reset client ISPs and locations
        selectedClientIsps: initialState.selectedClientIsps,
        selectedLocations: initialState.selectedLocations,
      };
    default:
      return state;
  }
}


// Export the reducer
export default locationPage;
