import * as ClientIsp from './calls/clientIsp';
import * as Location from './calls/location';
import * as TransitIsp from './calls/transitIsp';

const calls = {
  ...ClientIsp,
  ...Location,
  ...TransitIsp,
};

export default calls;
