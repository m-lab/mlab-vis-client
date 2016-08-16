import React, { PureComponent, PropTypes } from 'react';

import './JsonDump.scss';

export default class JsonDump extends PureComponent {
  static propTypes = {
    fetchJson: PropTypes.func,
    json: PropTypes.object,
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
    const { json, fetchJson } = this.props;
    console.log('json = ', json);

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
