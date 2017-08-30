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
              <a href="/">
                <img alt="M-Lab" src="/img/mlab_site_logo.png" />
                <span>viz</span>
              </a>
            </Navbar.Brand>
          </Navbar.Header>        
          <Nav activeKey={3}>
            <NavItem eventKey={1} href="https://www.measurementlab.net/">Home</NavItem>
            <NavItem eventKey={2} href="https://www.measurementlab.net/about/">About</NavItem>
            <NavItem eventKey={3} href="/">Visualizations</NavItem>
            <NavItem eventKey={4} href="https://www.measurementlab.net/data/">Data</NavItem>
            <NavItem eventKey={5} href="https://www.measurementlab.net/tests/">Tests</NavItem>
            <NavItem eventKey={6} href="https://www.measurementlab.net/publications/">Publications</NavItem>
            <NavItem eventKey={7} href="https://www.measurementlab.net/learn/">Learn</NavItem>
            <NavItem eventKey={8} href="https://www.measurementlab.net/contribute/">Contribute</NavItem>
          </Nav>
        </Navbar>
        <Navbar bsClass="submenu">      
          <Nav>
            <IndexLinkContainer to="/"><NavItem eventKey={1}>Locations</NavItem></IndexLinkContainer>
            <LinkContainer to="/compare"><NavItem eventKey={4}>Compare</NavItem></LinkContainer>
            <LinkContainer to="/data"><NavItem eventKey={4}>Data</NavItem></LinkContainer>
            <LinkContainer to="/about"><NavItem eventKey={5}>About M-Lab Viz</NavItem></LinkContainer>
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
