import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import './Home.scss';

function mapStateToProps(/* state */) {
  return {
  };
}

class Home extends PureComponent {
  render() {
    return (
      <div className="home">
        <Helmet title="Home" />
        <div><Link to="/about">About</Link></div>
        <div>This is the home page.</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Home);
