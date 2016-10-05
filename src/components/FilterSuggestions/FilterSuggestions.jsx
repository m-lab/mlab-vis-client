import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';

import './FilterSuggestions.scss';

export default class FilterSuggestions extends PureComponent {
  static propTypes = {
    labelKey: PropTypes.string,
    maxSuggestions: PropTypes.number,
    onSelect: PropTypes.func,
    suggestions: PropTypes.array,
  }

  static defaultProps = {
    maxSuggestions: 10,
  }

  render() {
    const { labelKey, suggestions, onSelect, maxSuggestions } = this.props;
    const { data = [], status } = suggestions;
    const topSuggestions = data.slice(0, maxSuggestions);

    const isLoading = !status || status === 'loading';
    let loading;
    if (isLoading) {
      loading = <span className="loading-text">Loading...</span>;
    }

    return (
      <div className={classNames('filter-suggestions', { loading: isLoading })}>
        <h5>Suggestions{loading}</h5>
        <ul className="list-inline">
          {topSuggestions.map((suggestion, i) => (
            <li key={i}>
              <button onClick={() => onSelect(suggestion)} className="filter-suggestion">
                {suggestion[labelKey]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
