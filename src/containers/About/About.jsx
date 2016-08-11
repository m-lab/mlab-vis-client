import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';


function mapStateToProps(/* state */) {
  return {
  };
}

class About extends Component {
  render() {
    return (
      <div className="container">
        <Helmet title="About Us" />
        <div><Link to="/">Home</Link></div>
        <div>This is the about page.</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(About);
