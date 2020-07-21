import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';
import {
    App,
    HomePage,
    LocationPage,
    ComparePage,
    DashboardPage,
    DataPage,
    AboutPage,
    NotFoundPage,
  } from './containers';

export default () => (
  /**
   * Please keep routes in alphabetical order
   */
  <Route path="/" component={App}>
    { /* Home (main) route */ }
    <IndexRoute component={HomePage} />

    { /* Routes */ }
    <Redirect from="location" to="/" />
    <Route path="location" component={LocationPage}>
      <Route path=":locationId" />
    </Route>

    {/* Default to location compare */}
    <Redirect from="compare" to="compare/location" />
    <Route path="compare" component={ComparePage}>
      <Route path=":facetType" />
    </Route>

    <Route path="data" component={DataPage} />

    <Route path="about" component={AboutPage} />

    <Route path="dashboard" component={DashboardPage} />

    { /* Catch all route */ }
    <Route path="*" component={NotFoundPage} status={404} />
  </Route>
);
