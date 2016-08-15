import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';


function mapStateToProps(/* state */) {
  return {
  };
}

class LocationPage extends PureComponent {
  render() {
    return (
      <div>
        <Helmet title="Location" />
        <h1>Location</h1>
        <div>This is the location page.</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LocationPage);
