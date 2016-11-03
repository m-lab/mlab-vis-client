import React, { PureComponent, PropTypes } from 'react';

import './JsonDump.scss';

/**
 * Simple component that dumps JSON data for debugging
 */
export default class JsonDump extends PureComponent {
  static propTypes = {
    fetchJson: PropTypes.func,
    json: PropTypes.any,
  }

  renderJson() {
    const { json } = this.props;

    if (!json) {
      return <div>No JSON data.</div>;
    }

    return (
      <div>
        <h3>JSON Data</h3>
        <pre>{JSON.stringify(json)}</pre>
      </div>
    );
  }

  render() {
    const { fetchJson } = this.props;

    return (
      <div className="json-dump">
        {this.renderJson()}
        {fetchJson ?
          <button className="btn btn-primary" onClick={fetchJson}>Reload from server</button> :
          null}
      </div>
    );
  }
}
