import React, { PureComponent, PropTypes } from 'react';
import { Autosuggest } from 'react-autosuggest';

import './OmniSearch.scss';


/**
 * Omni Search component.
 * Allows for auto completing Cell Lines or Drugs
 */
export default class OmniSearch extends PureComponent {

  static propTypes = {
    onChange: PropTypes.function,
    searchResults: PropTypes.array,
  }

  static contextTypes = {
    router: PropTypes.object,
  }
  /**
   * constructor sets up search value.
   */
  constructor(props) {
    super(props);

    // this.state = {
    //   value: '',
    //   combinedData: this.formatResults(props.searchResults),
    //   suggestions: [],
    // };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.renderSectionTitle = this.renderSectionTitle.bind(this);
    this.getSectionSuggestions = this.getSectionSuggestions.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  /**
   * Lifecycle method. Updates state with the combined data.
   */
  // componentWillReceiveProps(nextProps) {
    // if (nextProps.cellLines && nextProps.drugs &&
    //   (nextProps.cellLines !== this.props.cellLines || nextProps.drugs !== this.props.drugs)) {
    //
    //   this.setState({
    //     combinedData: this.combineData(nextProps.cellLines, nextProps.drugs),
    //     suggestions: this.getSuggestions('')
    //   });
    // }
  // }


  /**
   * Lifecycle method for checking update
   */
  // shouldComponentUpdate(nextProps, nextState) {
  //   return shallowCompare(this, nextProps, nextState);
  // }

  /**
  * callback for modification of search input
  * @param {Object} event change event
  * @param {String} newValue
  */
  onChange(event, { newValue }) {
    // this.setState({
    //   value: newValue,
    // });
  }

  /**
  * callback for suggestion selection
  * @param {Object} event change event
  * @param {String} suggestion The suggestion object selected
  */
  onSuggestionSelected(event, { suggestion, sectionIndex }) {
    // this.setState({ value: '' });
    // const suggestionId = suggestion.id;
    // const suggestionType = this.state.combinedData[sectionIndex].id;
    // const path = `/${suggestionType}/${suggestionId}`;
    // this.context.router.push(path);
  }

  /**
  * Callback when search input is changed.
  * @param {String} value New search value
  */
  onSuggestionsUpdateRequested({ value }) {
    // this.setState({
    //   suggestions: this.getSuggestions(value),
    // });
  }

  /**
  * Extracts search results from combined data
  * @return {String} search term we are searching for
  */
  getSuggestions(search) {
    search = search.trim();

    if (search.length > 0) {
      // return this.state.combinedData.map((data) => {
      //   const filteredData = _.clone(data);
      //   filteredData.values = filteredData.values.filter((value) => {
      //     let found = false;
      //
      //     // create a function to access properties by path on the object `value`
      //     const getAttrValue = _.propertyOf(value);
      //
      //     // check if any of the search attributes match
      //     found = data.searchAttrs.some((attr) => {
      //       const searchAttrValue = getAttrValue(attr);
      //       let matches = false;
      //
      //       // handle array value of strings (e.g. synonyms, searchIndexOnlyNames)
      //       if (_.isArray(searchAttrValue)) {
      //         matches = searchAttrValue.some(val => normalize(val).includes(search));
      //       } else if (normalize(searchAttrValue).includes(search)) {
      //         matches = true;
      //       }
      //
      //       return matches;
      //     });
      //     return found;
      //   });
      //
      //   return filteredData;
      // });
    }
    return [];
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
    let name = '';
    if (suggestion.cellLine) {
      name = suggestion.cellLine.label;
    } else if (suggestion.name) {
      name = suggestion.name.label;
    } else {
      name = suggestion.id;
    }

    return name;
  }


  /**
   * Merge cell line and drug data together for display and search.
   */
  formatResults(rawResults) {
    console.log(rawResults);
    return [];
  }


  /**
  * render section header
  * @param {Object} section Section of search suggestions
  */
  renderSectionTitle(section) {
    return (
      <strong>{section.label}</strong>
    );
  }

  /**
  * render suggestion including synonyms and search only names (if matched)
  * @param {Object} suggestion Suggestion object to display
  */
  renderSuggestion(suggestion, { value: search }) {
    let name = this.getSuggestionValue(suggestion);

    const synonymsToUse = suggestion.synonyms ? [...suggestion.synonyms] : [];

    // include searchIndexOnlyName if it matches
    if (suggestion.searchIndexOnlyNames && suggestion.searchIndexOnlyNames.length) {
      const match = suggestion.searchIndexOnlyNames.find(searchName => normalize(searchName).includes(normalize(search)));

      if (match) {
        synonymsToUse.push(match);
      }
    }

    let synonyms;
    if (synonymsToUse.length) {
      synonyms = <span className="text-muted">{` (aka ${synonymsToUse.join(', ')})`}</span>;
    }

    return (
      <span>{name}{synonyms}</span>
    );
  }

  /**
   * Render out JSX for Search.
   * @return {ReactElement} JSX markup.
   */
  render() {
    const value = 'hhh';
    const suggestions = [];
    // const { value, suggestions } = this.state;
    // const suggestions = this.getSuggestions(value);
    const inputProps = {
      placeholder: 'Search for a location',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
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
