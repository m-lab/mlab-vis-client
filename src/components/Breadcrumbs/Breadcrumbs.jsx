import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';

import './Breadcrumbs.scss';

/**
 * Component for rendering navigation breadcrumbs for a location
 */
export default class Breadcrumbs extends PureComponent {
  static propTypes = {
    // the location info object. contains label, parents ([{label, id}, ...])
    info: PropTypes.object,

    // the query parameters for the URL to use in the links
    query: PropTypes.object,
  }

  static defaultProps = {
    info: { label: 'Loading...' },
  }

  render() {
    const { info, query } = this.props;
    const { shortLabel, label, parents = [] } = info;

    return (
      <div className="Breadcrumbs">
        <ul className="list-inline">
          {parents.map(parent => (
            <li key={parent.id}>
              <Link to={`/location/${parent.id}`} query={query}>{parent.label}</Link>
              <span className="breadcrumb-separator">/</span>
            </li>
          ))}
          <li className="breadcrumb-current">{shortLabel || label}</li>
        </ul>
      </div>
    );
  }
}
