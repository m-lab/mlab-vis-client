import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as GlobalSearchActions from '../../redux/globalSearch/actions';
import * as GlobalSearchSelectors from '../../redux/globalSearch/selectors';

import { Search } from '../../components';

function mapStateToProps(state) {
  return {
    searchResults: GlobalSearchSelectors.getClientIspSearchResults(state),
  };
}

class ClientIspSearch extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    onSuggestionSelected: PropTypes.func,
    router: PropTypes.object,
    searchResults: PropTypes.array,
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
  }

  /**
   * Callback for when the search query changes
   */
  onSearchQueryChange(query) {
    const { dispatch } = this.props;
    dispatch(GlobalSearchActions.fetchClientIspSearchIfNeeded(query));
  }

  render() {
    const { searchResults, onSuggestionSelected } = this.props;

    return (
      <Search
        className="ClientIspSearch"
        placeholder="Search for a client ISP"
        searchResults={searchResults}
        onSearchChange={this.onSearchQueryChange}
        onSuggestionSelected={onSuggestionSelected}
      />
    );
  }
}

export default connect(mapStateToProps)(withRouter(ClientIspSearch));
