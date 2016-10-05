import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { LocationSearch } from '../../containers';

import './DataPage.scss';

function mapStateToProps(/* state */) {
  return {};
}

class DataPage extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  render() {
    return (
      <div className="DataPage">
        <Helmet title="Data" />
        <h1>Data</h1>
        <div>
          This is the data page.
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(DataPage);
