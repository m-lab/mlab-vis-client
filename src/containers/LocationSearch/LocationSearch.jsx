import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as GlobalSearchActions from '../../redux/globalSearch/actions';
import * as GlobalSearchSelectors from '../../redux/globalSearch/selectors';

import { Search } from '../../components';

function mapStateToProps(state, props) {
  return {
    searchResults: GlobalSearchSelectors.getLocationSearchResults(state, props),
  };
}

/**
 * Component for rendering a Location search field
 */
class LocationSearch extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    dispatch: PropTypes.func,
    // eslint-disable-next-line
    exclude: PropTypes.array, // this prop is read in the searchResults selector
    onSuggestionSelected: PropTypes.func,
    query: PropTypes.object,
    router: PropTypes.object,
    searchFilterItemIds: PropTypes.array,
    searchFilterType: PropTypes.string,
    searchResults: PropTypes.array,
  }

  static defaultProps = {
    query: {},
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  /**
   * Default is to navigate to the location page. This is only used
   * if no `onSuggestionSelected` prop is passed in.
   */
  onSuggestionSelected(suggestion) {
    const { router, query } = this.props;

    const suggestionId = suggestion.meta.id;
    const path = `/location/${suggestionId}`;
    router.push({ pathname: path, query });
  }

  /**
   * Callback for when the search query changes
   */
  onSearchQueryChange(query) {
    const { dispatch, searchFilterType, searchFilterItemIds } = this.props;
    dispatch(GlobalSearchActions.fetchLocationSearchIfNeeded(query, searchFilterType, searchFilterItemIds));
  }

  render() {
    const { disabled, searchResults, onSuggestionSelected } = this.props;
    return (
      <Search
        className="LocationSearch"
        disabled={disabled}
        placeholder="Search for a location"
        searchResults={searchResults}
        onSearchChange={this.onSearchQueryChange}
        onSuggestionSelected={onSuggestionSelected || this.onSuggestionSelected}
      />
    );
  }
}

export default connect(mapStateToProps)(withRouter(LocationSearch));
