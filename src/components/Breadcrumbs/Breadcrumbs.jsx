import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';

import './Breadcrumbs.scss';

/**
 * Component for rendering navigation breadcrumbs for a location
 *
 * @prop {Object} info the location info object. contains name, parents ([{name, locationKey}, ...])
 */
export default class Breadcrumbs extends PureComponent {
  static propTypes = {
    info: PropTypes.object,
    query: PropTypes.object,
  }

  static defaultProps = {
    info: { name: 'Loading...' },
  }

  render() {
    const { info, query } = this.props;
    const { name, parents = [] } = info;

    return (
      <div className="Breadcrumbs">
        <ul className="list-inline">
          {parents.map(parent => (
            <li key={parent.locationKey}>
              <Link to={`/location/${parent.locationKey}`} query={query}>{parent.name}</Link>
              <span className="breadcrumb-separator">/</span>
            </li>
          ))}
          <li className="breadcrumb-current">{name}</li>
        </ul>
      </div>
    );
  }
}
