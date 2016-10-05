import React, { PureComponent, PropTypes } from 'react';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';


import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';

import config from '../../config';

import '../../assets/base.scss';
import './App.scss';

function mapStateToProps() {
  return {
  };
}

class App extends PureComponent {
  static propTypes = {
    children: PropTypes.object.isRequired,
    dispatch: React.PropTypes.func,
    info: PropTypes.object,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  renderNav() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/">
              <img alt="MLab" src="/img/mlab_logo_white.png" />
              <span>vis</span>
            </IndexLink>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <IndexLinkContainer to="/"><NavItem eventKey={1}>Home</NavItem></IndexLinkContainer>
          <LinkContainer to="/location"><NavItem eventKey={3}>Location</NavItem></LinkContainer>
          <LinkContainer to="/compare"><NavItem eventKey={4}>Compare</NavItem></LinkContainer>
          <LinkContainer to="/data"><NavItem eventKey={4}>Data</NavItem></LinkContainer>
        </Nav>
      </Navbar>
    );
  }

  render() {
    return (
      <div>
        <Helmet {...config.app.head} />
        {this.renderNav()}
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
