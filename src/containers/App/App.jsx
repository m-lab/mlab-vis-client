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
      <div>    
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="https://www.measurementlab.net/">
                <img alt="M-Lab" src="/img/mlab_site_logo.png" />
                <span>viz</span>
              </IndexLink>
            </Navbar.Brand>
          </Navbar.Header>        
          <Nav activeKey={1}>
            <NavItem eventKey={1} href="https://www.measurementlab.net/visualizations/">Visualizations</NavItem>
            <NavItem eventKey={2} href="https://www.measurementlab.net/tests/">Tests</NavItem>
            <NavItem eventKey={3} href="https://www.measurementlab.net/data/">Data</NavItem>
            <NavItem eventKey={4} href="https://www.measurementlab.net/contribute/">Contribute</NavItem>
            <NavItem eventKey={5} href="https://www.measurementlab.net/blog/">Blog</NavItem>
            <NavItem eventKey={6} href="https://www.measurementlab.net/publications/">Publications</NavItem>
            <NavItem eventKey={6} href="https://www.measurementlab.net/about/">About M-Lab</NavItem>
          </Nav>
        </Navbar>
        <Navbar bsClass="submenu">      
          <Nav>
            <NavItem eventKey={1} href="/">Locations</NavItem>
            <NavItem eventKey={4} href"/compare">Compare</NavItem>
            <NavItem eventKey={4} href="/data">Data</NavItem>
            <NavItem eventKey={5} href="/about">About M-Lab Viz</NavItem>
          </Nav>
        </Navbar>
      </div>
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
