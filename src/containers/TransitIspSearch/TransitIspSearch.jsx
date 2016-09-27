import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as GlobalSearchActions from '../../redux/globalSearch/actions';
import * as GlobalSearchSelectors from '../../redux/globalSearch/selectors';

import { Search } from '../../components';

function mapStateToProps(state, props) {
  return {
    searchResults: GlobalSearchSelectors.getTransitIspSearchResults(state, props),
  };
}

class TransitIspSearch extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    dispatch: PropTypes.func,
    exclude: PropTypes.array,
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
    dispatch(GlobalSearchActions.fetchTransitIspSearchIfNeeded(query));
  }

  render() {
    const { disabled, searchResults, onSuggestionSelected } = this.props;

    return (
      <Search
        className="TransitIspSearch"
        defaultSectionName="Transit ISPs"
        disabled={disabled}
        placeholder="Search for a transit ISP"
        searchResults={searchResults}
        onSearchChange={this.onSearchQueryChange}
        onSuggestionSelected={onSuggestionSelected}
      />
    );
  }
}

export default connect(mapStateToProps)(withRouter(TransitIspSearch));
