import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect, beforeAll } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { LocationPage } from 'components';
import * as moment from 'moment';

chai.use(chaiEnzyme());

describe('components', () => {

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  // eslint-disable-next-line func-names
  const emptyFunc = function () {};
  // const sampleDate = moment('2020-03-11');

  describe('Location Page', () => {
    const props = {
      annotationTimeSeries: [],
      autoTimeAggregation: false,
      clientIspHourly: [],
      clientIspTimeSeries: {},
      colors: {},
      compareMetrics: {},
      dispatch: emptyFunc,
      // endDate: sampleDate,
      highlightHourly: 0,
      highlightTimeSeriesDate: {},
      highlightTimeSeriesLine: {},
      hourlyExtents: {},
      location: {},
      locationAndClientIspTimeSeries: [],
      locationHourly: {},
      locationId: '',
      locationInfo: {},
      locationTimeSeries: {},
      selectedClientIspIds: [],
      selectedClientIspInfo: [],
      showBaselines: false,
      showRegionalValues: false,
      // startDate: sampleDate,
      summary: {},
      timeAggregation: '',
      timeSeriesStatus: '',
      topClientIsps: [],
      viewMetric: {},
    };
    const wrapper = shallow(<LocationPage {...props} />);
    expect(wrapper).to.have.length(1);
  });
});
