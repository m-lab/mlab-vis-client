import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';
import {
    App,
    HomePage,
    LocationPage,
    ComparePage,
    DataPage,
    NotFoundPage,
  } from 'containers';

export default () => (
  /**
   * Please keep routes in alphabetical order
   */
  <Route path="/" component={App}>
    { /* Home (main) route */ }
    <IndexRoute component={HomePage} />

    { /* Routes */ }
    {/* Temporarily default to seattle */}
    <Redirect from="location" to="location/nauswaseattle" />
    <Route path="location" component={LocationPage}>
      <Route path=":locationId" />
    </Route>

    {/* Default to location compare */}
    <Redirect from="compare" to="compare/location" />
    <Route path="compare" component={ComparePage}>
      <Route path=":facetType" />
    </Route>

    <Route path="data" component={DataPage} />

    { /* Catch all route */ }
    <Route path="*" component={NotFoundPage} status={404} />
  </Route>
);
