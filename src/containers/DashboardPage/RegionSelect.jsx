import PropTypes from 'prop-types';
import React from 'react';

import Autosuggest from 'react-autosuggest';

import regions from './regions';

class RegionSelect extends React.Component {
  constructor(props) {
    super(props);

    const match = regions.find(r => {
      return r.id === this.props.value
    })

    this.state = {
      suggestions: regions,
      value: match ? match.label : '',
    };

    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(
      this
    );
    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(
      this
    );
    this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this)
  }

  getSuggestionValue(suggestion) {
    return suggestion.label;
  }

  handleSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  handleSuggestionsFetchRequested({ value, reason }) {    
    const filtered = value !== '' ? regions.filter((r) => {
      const lowerLabel = r.label.toLowerCase();
      const lowerValue = value.toLowerCase();
      return lowerLabel.includes(lowerValue);
    }) : regions;
    
    this.setState({ suggestions: filtered });
  }

  handleSuggestionSelected(proxy, selected) {
    const { suggestion, suggestionValue } = selected
    const { id } = suggestion
    this.props.onChange(id)
    this.setState({
      suggestions: [],
      value: suggestionValue,
    })
  }

  renderSuggestion(suggestion, { isHighlighted }) {
    return (
      <span style={{ backgroundColor: isHighlighted ? 'deeppink' : 'white' }}>
        {suggestion.label}
      </span>
    );
  }

  render() {
    const { suggestions, value: stateValue } = this.state;
    const handleChange = (e, { newValue }) => {
      this.setState({ value: newValue });
    };
    const inputProps = {
      onChange: handleChange,
      value: stateValue, 
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        getSuggestionValue={this.getSuggestionValue}
        inputProps={inputProps}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        renderSuggestion={this.renderSuggestion}
      />
    );
  }
}

RegionSelect.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default RegionSelect;
