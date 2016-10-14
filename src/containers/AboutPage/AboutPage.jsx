import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';


import './AboutPage.scss';

class AboutPage extends PureComponent {
  static sections = [
    {
      id: 'about',
      title: 'About',
      content:
      [
        <p>
          MLab Vis is a collaboration between <a href="https://bocoup.com/datavis" target="_blank" rel="noopener noreferrer">Bocoup Data Vis</a> and <a href="https://www.measurementlab.net/" target="_blank" rel="noopener noreferrer">Measurement Lab</a> to visualize aggregations of over 500 million Internet speed tests from around the world.
        </p>,
        <p>
          The <Link to={'/location/'}>Location</Link> section focuses on breaking these speed tests down by city, region, country and continent.

          The <Link to={'/compare'}>Compare</Link> section allows for comparsisions to be made between different locations and ISPs.

          The <Link to={'/data'}>Data</Link> section provides direct access to JSON and CSV dumps of the data for offline exploration.
        </p>,
      ],
    },
    {
      id: 'metrics',
      title: 'Metric Calculations',
      content:
      [
        <h4>Hamper</h4>,
        <p>
        </p>,
      ],
    },
  ]

  renderSection(section) {
    return (
      <div key={section.id} className="section">
        <h2 id={section.id}>{section.title}</h2>
        <div className="content">
          {section.content.map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="AboutPage">
        <Helmet title="About" />
        {AboutPage.sections.map((s) => this.renderSection(s))}
      </div>
    );
  }
}

export default AboutPage;
