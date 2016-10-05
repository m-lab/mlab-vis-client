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
    console.log(rawTests)
    return (
      <div className="HomePage">
        <Helmet title="Home" />
        <h1>Home</h1>
        <div>
          <LocationSearch />
          <WorldMap
            data={rawTests}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
