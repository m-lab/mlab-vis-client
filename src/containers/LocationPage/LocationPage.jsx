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
      <div className="container">
        <Helmet title="Location" />
        <div><Link to="/">Home</Link></div>
        <div>This is the location page.</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LocationPage);
