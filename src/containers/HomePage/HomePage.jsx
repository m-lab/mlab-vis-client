import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { LocationSearch } from '../../containers';

import './HomePage.scss';

function mapStateToProps(/* state */) {
  return {};
}

class HomePage extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  render() {
    return (
      <div className="HomePage">
        <Helmet title="Home" />
        <h1>Home</h1>
        <div>
          <LocationSearch />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
