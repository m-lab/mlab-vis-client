import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';
import {
    DashboardPage,
    NotFoundPage,
  } from './containers';

export default () => (
  /**
   * Please keep routes in alphabetical order
   */
  <Route path="/" component={DashboardPage}>
    { /* Home (main) route */ }
    <IndexRoute component={DashboardPage} />

    { /* Routes */ }
    <Redirect from="location" to="/" />

    <Route path="dashboard" component={DashboardPage} />

    { /* Catch all route */ }
    <Route path="*" component={NotFoundPage} status={404} />
  </Route>
);
