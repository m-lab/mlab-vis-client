import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';

import './FilterSuggestions.scss';

/**
 * Render the suggestions shown beneath filters like location search,
 * transit isp search, or client isp search.
 */
export default class FilterSuggestions extends PureComponent {
  static propTypes = {
    header: PropTypes.string,
    labelKey: PropTypes.string,
    maxSuggestions: PropTypes.number,
    onSelect: PropTypes.func,
    suggestions: PropTypes.object,
  }

  static defaultProps = {
    header: 'Suggestions',
    labelKey: 'label',
    maxSuggestions: 10,
  }

  render() {
    const { labelKey, suggestions, onSelect, maxSuggestions, header } = this.props;
    if (!suggestions) {
      return null;
    }

    const { data = [], status } = suggestions;
    const topSuggestions = data.slice(0, maxSuggestions);


    const isLoading = !status || status === 'loading';

    // don't show anything if no suggestions and not loading.
    if (!topSuggestions.length && !isLoading) {
      return null;
    }

    let loading;
    if (isLoading) {
      loading = <span className="loading-text">Loading...</span>;
    }

    return (
      <div className={classNames('FilterSuggestions', { loading: isLoading })}>
        <h5>{header}{loading}</h5>
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
