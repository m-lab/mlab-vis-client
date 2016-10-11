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
        <div>
          <div className="writeup">
            <p>Measurement Lab records and analyzes over <strong>5 billion</strong> user generated interet speed tests from over <strong>4,000 cities</strong>.</p>
          </div>
          <h2>Find Your City</h2>
          <LocationSearch />
          <div className="writeup">
            <p>Here is a sample of recent tests from around the globe.</p>
          </div>

          <WorldMap
            data={rawTests}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
