import React, { PureComponent, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import d3 from 'd3';
import classNames from 'classnames';

import { formatNumber, stringToKey } from '../../utils/format';

import './Search.scss';

/**
 * Search component.
 * Allows for auto completing Location Searches
 */
class Search extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    defaultSectionName: PropTypes.string,
    disabled: PropTypes.bool,
    onSearchChange: PropTypes.func,
    onSuggestionSelected: PropTypes.func,
    placeholder: PropTypes.string,
    searchResults: PropTypes.array,
  }

  static defaultProps = {
    placeholder: 'Search',
    searchResults: [],
    defaultSectionName: 'Other',
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
    /* React-autosuggest automatically calls onChange with the first suggestion after
     * clearing when focusFirstSuggestion is true. The problem is, this first suggestion
     * is still the one that was just selected. This sets the text of the field to
     * match the value of the just selected one while leaving the dropdown open. Ideal
     * behavior for us is that pressing enter (and thus selecting the first item due to
     * focusFirstSuggestion being true) operates the same as if we pressed down then enter,
     * which clears the text field and hides the suggestions. So if we just cleared, ignore
     * setting the value here. (Issue #201 in mlab-vis-client)
     */
    if (!this.justCleared) {
      this.setState({
        value: newValue,
      });
    }
  }

  /**
  * callback for suggestion selection
  * @param {Object} event change event
  * @param {String} suggestion The suggestion object selected
  */
  onSuggestionSelected(event, { suggestion }) {
    const { onSuggestionSelected } = this.props;
    this.setState({ value: '' });

    if (onSuggestionSelected) {
      onSuggestionSelected(suggestion);
    }
  }

  /**
  * Callback when search input is changed.
  * @param {String} value New search value
  */
  onSuggestionsFetchRequested({ value }) {
    const { onSearchChange } = this.props;

    const search = stringToKey(value);

    if (search.length > 2) {
      onSearchChange(search);
    }
  }

  /**
   * Callback when suggestions are to be cleared
   */
  onSuggestionsClearRequested() {
    // flag that we just cleared so we can ignore setting the value (Issue #201)
    this.justCleared = true;
    this.setState({
      suggestions: [],
    }, () => {
      // remove the just cleared flag after the next render
      this.justCleared = false;
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
    return suggestion.meta.label;
  }

  /**
  * Extracts search results from combined data
  * @return {String} search term we are searching for
  */
  formatSuggestions(results) {
    const { defaultSectionName } = this.props;

    const nest = d3.nest()
      .key((d) => d.meta.type || defaultSectionName)
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
      <div>
        <span className="suggestion-count">{formatNumber(suggestion.data.test_count)}</span>
        <span className="suggestion-name">{suggestion.meta.label}</span>
      </div>
    );
  }

  /**
   * Render out JSX for Search.
   * @return {ReactElement} JSX markup.
   */
  render() {
    const { disabled, placeholder, className } = this.props;
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange,
      disabled,
    };

    return (
      <div className={classNames('Search', className, { disabled })}>
        <Autosuggest
          focusFirstSuggestion
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
      </div>
    );
  }
}

export default Search;
