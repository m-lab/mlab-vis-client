import React, { PureComponent, PropTypes } from 'react';
import { withRouter } from 'react-router';
import Autosuggest from 'react-autosuggest';
import d3 from 'd3';

import { formatNumber, stringToKey } from '../../utils/format';

import './OmniSearch.scss';

/**
 * Omni Search component.
 * Allows for auto completing Location Searches
 */
class OmniSearch extends PureComponent {

  static propTypes = {
    onSearchChange: PropTypes.func,
    router: PropTypes.object,
    searchQuery: PropTypes.string,
    searchResults: PropTypes.array,
  }

  static defaultProps = {
    searchQuery: '',
    searchResults: [],
  }

  /**
   * constructor sets up search value.
   */
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: this.formatSuggestions(props.searchResults),
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.renderSectionTitle = this.renderSectionTitle.bind(this);
    this.getSectionSuggestions = this.getSectionSuggestions.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  /**
   * Lifecycle method. Updates state with the combined data.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.searchResults) {
      this.setState({
        suggestions: this.formatSuggestions(nextProps.searchResults),
      });
    }
  }

  /**
  * callback for modification of search input
  * @param {Object} event change event
  * @param {String} newValue
  */
  onChange(event, { newValue }) {
    this.setState({
      value: newValue,
    });
  }

  /**
  * callback for suggestion selection
  * @param {Object} event change event
  * @param {String} suggestion The suggestion object selected
  */
  onSuggestionSelected(event, { suggestion }) {
    const { router } = this.props;
    this.setState({ value: '' });
    const suggestionId = suggestion.id;
    const path = `/location/${suggestionId}`;
    router.push(path);
  }

  /**
  * Callback when search input is changed.
  * @param {String} value New search value
  */
  onSuggestionsFetchRequested({ value }) {
    const { onSearchChange } = this.props;

    // TODO: should this be in a different location?
    const search = stringToKey(value);

    if (search.length > 2) {
      onSearchChange(search);
    } else {
      // this.setState({
      //   suggestions: this.formatSuggestions([]),
      // });
    }
  }

  /**
   * Callback when suggestions are to be cleared
   */
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  /**
  * Extracts subsection of nested search results
  * @param {Object} section
  * @return {Array} array of search result groups
  */
  getSectionSuggestions(section) {
    return section.values.slice(0, 5);
  }

  /**
  * When suggestion is selected, this function tells
  * what should be the value of the input.
  * @param {Object} suggestion Suggestion selected
  */
  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  /**
  * Extracts search results from combined data
  * @return {String} search term we are searching for
  */
  formatSuggestions(results) {
    const nest = d3.nest()
      .key((d) => d.meta.type)
      .entries(results);
    return nest;
  }

  /**
  * render section header
  * @param {Object} section Section of search suggestions
  */
  renderSectionTitle(section) {
    return (
      <strong>{section.key}</strong>
    );
  }

  /**
  * render suggestion including synonyms and search only names (if matched)
  * @param {Object} suggestion Suggestion object to display
  */
  renderSuggestion(suggestion) {
    return (
      <span>{suggestion.name} <span className="text-muted">{formatNumber(suggestion.data.test_count)}</span></span>
    );
  }

  /**
   * Render out JSX for Search.
   * @return {ReactElement} JSX markup.
   */
  render() {
    // const { searchQuery, searchResults } = this.props;
    const { value, suggestions } = this.state;
    // const { value, suggestions } = this.state;
    // const suggestions = this.getSuggestions(value);
    const inputProps = {
      placeholder: 'Search for a Location',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        multiSection
        focusInputOnSuggestionClick={false}
        renderSectionTitle={this.renderSectionTitle}
        getSectionSuggestions={this.getSectionSuggestions}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
}

export default withRouter(OmniSearch);
