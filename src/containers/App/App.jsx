import React, { PureComponent, PropTypes } from 'react';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import PageHeader from 'react-bootstrap/lib/PageHeader';


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
      <div>    
        <PageHeader bsClass="mlab-site-header">
          <a href="https://measurementlab.net"><img alt="MLab" src="/img/mlab_site_logo.png" /></a>
          Measurement Lab is a partnership between New America's Open Technology Institute, Google Open Source Research, Princeton University's PlanetLab, and other supporting partners.
          <small><PageHeader.Link href="https://measurementlab.net/about">Learn more about M-Lab</PageHeader.Link></small>
        </PageHeader>
        <Navbar>
          <Nav bsClass="mlab-site-nav">
            <NavItem eventKey={1} href="https://measurementlab.net/visualizations/">Visualizations</NavItem>
            <NavItem eventKey={2} href="https://measurementlab.net/tests/">Tests</NavItem>
            <NavItem eventKey={3} href="https://measurementlab.net/data/">Data</NavItem>
            <NavItem eventKey={4} href="https://measurementlab.net/contribute/">Contribute</NavItem>
            <NavItem eventKey={5} href="https://measurementlab.net/blog/">Blog</NavItem>
            <NavItem eventKey={6} href="https://measurementlab.net/publications/">Publications</NavItem>
            <NavItem eventKey={6} href="https://measurementlab.net/about/">About</NavItem>
          </Nav>
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
