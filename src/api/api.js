import * as ClientIsp from './calls/clientIsp';
import * as ClientIspTransitIsp from './calls/clientIspTransitIsp';
import * as Location from './calls/location';
import * as LocationClientIsp from './calls/locationClientIsp';
import * as LocationClientIspTransitIsp from './calls/locationClientIspTransitIsp';
import * as LocationTransitIsp from './calls/locationTransitIsp';
import * as TransitIsp from './calls/transitIsp';
import * as Search from './calls/search';

const calls = {
  ...ClientIsp,
  ...ClientIspTransitIsp,
  ...Location,
  ...LocationClientIsp,
  ...LocationClientIspTransitIsp,
  ...LocationTransitIsp,
  ...TransitIsp,
  ...Search,
};

export default calls;
