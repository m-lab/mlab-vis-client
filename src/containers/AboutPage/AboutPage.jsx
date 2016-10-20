import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import './AboutPage.scss';

class AboutPage extends PureComponent {
  /* eslint-disable max-len */
  static sections = [
    {
      id: 'about',
      title: 'About',
      content:
      [
        <p>
          MLab Vis is a collaboration between <a href="https://bocoup.com/datavis" target="_blank" rel="noopener noreferrer">Bocoup Data Vis</a> and <a href="https://www.measurementlab.net/" target="_blank" rel="noopener noreferrer">Measurement Lab</a> to visualize aggregations of over 200 million Internet speed tests from around the world.
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
        <p>
          A number of metrics are used in these tools to attempt to provide a robust and accurate picture of the state of the Internet. Here, we describe the primary metrics used:
        </p>,
        <h4>Download Speed</h4>,
        <p>
          The Download Speed metric provides the <strong>median</strong> download speed in megabytes per second. Speeds are aggregated by ISP, or location, or both, depending on use.

          Speeds are further aggregated by the selected time aggregation: day, month, or year.
        </p>,
        <h4>Upload Speed</h4>,
        <p>
          Similar to download, the Upload Speed metric provides the <strong>median</strong> upload speed in megabytes per second. Speeds are aggregated by ISP, or location, or both, depending on use.

          Speeds are further aggregated by the selected time aggregation: day, month, or year.
        </p>,
        <h4>Round-trip Time</h4>,
        <p>
          Round-trip Time refers to the <strong>average</strong> round trip time taken for each portion of the speed test to complete.

          Round-trip is aggregated in the same way as upload and download speed.
        </p>,
        <h4>Retransmission Rate</h4>,
        <p>
          Retransmission rate is the <strong>average</strong> ratio of retransmitted packets during the speed test.
        </p>,
      ],
    },
    {
      id: 'data',
      title: 'Data Collection',
      content:
      [
        <p>Here we describe a number of details related to how the data for this visualization tool is processed.</p>,
        <h4>Local Time</h4>,
        <p>
          Measurement Lab speed test data is recorded in UTC time. For this visualization tool, we wanted to provide a more immediately useful temporal view of the data and so convert to local time before displaying the data.

          This is done via mapping the estimated position of the download test client to a time zone and using this time zone to convert the UTC time.
        </p>,
        <h4>ISP Names</h4>,
        <p>
          The names used for ISPs are based on mapping recorded Autonomous System Numbers (ASN) to names via <a href="http://dev.maxmind.com/geoip/legacy/geolite/#Autonomous_System_Numbers">MaxMind's ASN Database</a>.

          This mapping is a community effort and can lead to ambiguous and misleading ISP names. To partiallty account for this, we have worked to clean up the names so that they related to better to the actual companies using these ASNs.

          This is a work in progress, and will continue to improve as more inconsistencies are discovered.
        </p>,
      ],
    },
  ]
  /* eslint-enable max-len */

  renderSection(section) {
    return (
      <div key={section.id} className="section">
        <header>
          <h2 id={section.id}>{section.title}</h2>
        </header>
        <div className="content">
          {section.content.map((c, i) => React.cloneElement(c, { key: i }))}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="AboutPage">
        <Helmet title="About" />
        <Row>
          <Col md={10} lg={8}>
            {AboutPage.sections.map((s) => this.renderSection(s))}
          </Col>
        </Row>
      </div>
    );
  }
}

export default AboutPage;
