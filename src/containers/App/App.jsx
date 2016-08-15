import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { fetchInfoIfNeeded, fetchInfo } from 'redux/modules/info';
import { Link } from 'react-router';
import { JsonDump } from 'components';
import config from '../../config';

import './App.scss';

function mapStateToProps(state) {
  return {
    info: state.info.data,
  };
}

class App extends PureComponent {
  static propTypes = {
    dispatch: React.PropTypes.func,
    children: PropTypes.object.isRequired,
    info: PropTypes.object,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleFetchInfo = this.handleFetchInfo.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchInfoIfNeeded());
  }

  handleFetchInfo() {
    const { dispatch } = this.props;
    dispatch(fetchInfo());
  }

  render() {
    const { info } = this.props;

    return (
      <div>
        <Helmet {...config.app.head} />
        <div className="nav">
          <div className="container">
            <ul className="list-inline">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/location">Location</Link></li>
            </ul>
          </div>
        </div>
        <div className="container">
          {this.props.children}
        </div>
        <div className="container" style={{ marginTop: 100 }}>
          <div className="well">
            <JsonDump fetchJson={this.handleFetchInfo} json={info} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
