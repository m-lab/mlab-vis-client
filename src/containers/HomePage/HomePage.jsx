import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { WorldMap } from '../../components';
import { LocationSearch } from '../../containers';

import * as RawSelectors from '../../redux/raw/selectors';
import * as RawActions from '../../redux/raw/actions';

import './HomePage.scss';

function mapStateToProps(state) {
  return {
    rawTests: RawSelectors.getRawTests(state),
  };
}

class HomePage extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    rawTests: PropTypes.array,
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  // componentWillReceiveProps(nextProps) {
  //   this.fetchData(nextProps);
  // }

  fetchData(props) {
    const { dispatch } = props;

    dispatch(RawActions.fetchRawTestsIfNeeded());
  }

  render() {
    const { rawTests } = this.props;
    return (
      <div className="HomePage">
        <Helmet title="Home" />
        <div className="feature">
          <h1>Measurement Lab Visualizations</h1>
          <p>Measurement Lab records and analyzes over <strong>200 million</strong> user generated
             internet speed tests from over <strong>4,000 cities</strong>.
          </p>
        </div>
        <div className="section no-border">
          <h3>Find Your City</h3>
          <LocationSearch />
        </div>

        <div className="section no-border">
          <header>
            <h3>Internet Speed Tests Around the World</h3>
          </header>
          <p>Take a look at a sample of internet speed tests from across the globe below:</p>
          <WorldMap data={rawTests} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
