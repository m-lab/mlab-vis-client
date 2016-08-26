import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as GlobalSearchActions from '../../redux/globalSearch/actions';
import * as GlobalSearchSelectors from '../../redux/globalSearch/selectors';

import { OmniSearch } from '../../components';

import './HomePage.scss';

function mapStateToProps(state) {
  return {
    locationSearchResults: GlobalSearchSelectors.getLocationSearchResults(state),
    locationSearchQuery: GlobalSearchSelectors.getLocationSearchQuery(state),
  };
}

class HomePage extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    locationSearchQuery: PropTypes.string,
    locationSearchResults: PropTypes.array,
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
  }

  /**
   * Callback for when viewMetric changes - updates URL
   */
  onSearchQueryChange(query) {
    const { dispatch } = this.props;
    dispatch(GlobalSearchActions.fetchLocationSearchIfNeeded(query));
  }

  renderSearch() {
    const { locationSearchResults } = this.props;
    return (
      <OmniSearch
        searchResults={locationSearchResults}
        onSearchChange={this.onSearchQueryChange}
      />
    );
  }

  render() {
    return (
      <div className="home-page">
        <Helmet title="Home" />
        <h1>Home</h1>
        <div>This is the home page.</div>

        <div className="omni-search-container">
          {this.renderSearch()}
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
