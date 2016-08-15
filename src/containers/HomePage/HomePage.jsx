import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import './HomePage.scss';

function mapStateToProps(/* state */) {
  return {
  };
}

class HomePage extends PureComponent {
  render() {
    return (
      <div className="home-page">
        <Helmet title="Home" />
        <h1>Home</h1>
        <div>This is the home page.</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
