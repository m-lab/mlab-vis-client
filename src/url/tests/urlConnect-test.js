import React, { Component } from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import urlConnect from '../urlConnect';

chai.use(chaiEnzyme());

describe('url', () => {
  describe('urlConnect', () => {
    const config = {
      myStr: { type: 'string', defaultValue: 'download', urlKey: 'str' },
      myBool: { type: 'boolean', defaultValue: false },
      myDate: { type: 'date' },
    };

    const query = {
      myBool: '1',
      myDate: '2015-01-01',
    };

    const urlHandler = new UrlHandler(config);


    class MyComponent extends Component {
      render() {
        return <div />;
      }
    }

    describe('mapStateToProps', () => {
      it('produces the correct value', () => {
        // test that mapStateToProps has URL props in there
        function mapStateToProps(state, props) {
          console.log('99999999999');
          expect(true).to.be.ok;
        }

        const WrappedMyComponent = urlConnect(urlHandler, mapStateToProps)(MyComponent);

        const wrapper = shallow(<WrappedMyComponent json={testInfo} />);



      });
    });

    describe('dispatch', () => {
      // test that dispatch uses UrlHandler on URL_REPLACE
      // test that dispatch passes through to Redux in general
      // test that reduxDispatch is available on the component
    });
  });
});
