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
import '../../assets/_mlab_site_header.scss'

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
        <div class="header-section">
          <div class="container">
            <div class="row">
              <div class="col-xs-2 col-sm-2 col-md-4">
                <h1 class="main-logo"><a href="/m-lab.github.io/">M-Lab</a></h1>
              </div>
              <div class="col-xs-8 col-sm-8" id="assist-cta">
                <a href="/m-lab.github.io/about/" class="header-cta assist-cta">
                <span class="pull-right">
                  <h2>Measurement Lab is a partnership between New America's Open Technology Institute, Google Open Source Research, Princeton University's PlanetLab, and other supporting partners.</h2>
                  <h3>Learn more about M-Lab</h3>
                </span>
                <div class="assist-cta"></div></a> 
              </div>
            </div>
          </div>
        </div>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/">
              <img alt="MLab" src="/img/mlab_logo_white.png" />
              <span>vis</span>
            </IndexLink>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <IndexLinkContainer to="/"><NavItem eventKey={1}>Locations</NavItem></IndexLinkContainer>
          <LinkContainer to="/compare"><NavItem eventKey={4}>Compare</NavItem></LinkContainer>
          <LinkContainer to="/data"><NavItem eventKey={4}>Data</NavItem></LinkContainer>
          <LinkContainer to="/about"><NavItem eventKey={5}>About</NavItem></LinkContainer>
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
