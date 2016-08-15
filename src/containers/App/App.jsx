import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { fetchInfoIfNeeded, fetchInfo } from 'redux/modules/info';
import { JsonDump } from 'components';
import config from '../../config';


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
        <div>
          {this.props.children}
        </div>
        <JsonDump fetchJson={this.handleFetchInfo} json={info} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
