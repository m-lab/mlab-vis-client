import React, { Component, PropTypes } from 'react';
import { createStore } from 'redux';
import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import moment from 'moment';
import urlConnect from '../urlConnect';
import UrlHandler from '../UrlHandler';
import { URL_REPLACE } from '../actions';

chai.use(sinonChai);
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

    const location = { query };
    const params = { myParam: 'paramValue' };

    const urlHandler = new UrlHandler(config);


    class MyComponent extends Component {
      render() {
        return <div />;
      }
    }

    describe('mapStateToProps', () => {
      it('includes decoded URL query params in props', () => {
        const store = createStore(() => ({}));

        // test that mapStateToProps has URL props in there
        function mapStateToProps(state, props) {
          expect(props).to.contain.keys('myStr', 'myBool', 'myDate');
          expect(props.myStr).to.equal('download');
          expect(props.myBool).to.equal(true);
          expect(props.myDate).to.deep.equal(moment(new Date(2015, 0, 1)));

          return props;
        }

        const WrappedMyComponent = urlConnect(urlHandler, mapStateToProps)(MyComponent);

        shallow(<WrappedMyComponent store={store} location={location} />);
      });

      it('includes decoded URL params in props', () => {
        const store = createStore(() => ({}));

        // test that mapStateToProps has URL props in there
        function mapStateToProps(state, props) {
          expect(props).to.contain.keys('myParam');
          expect(props.myParam).to.equal('paramValue');

          return props;
        }

        const WrappedMyComponent = urlConnect(urlHandler, mapStateToProps)(MyComponent);

        shallow(<WrappedMyComponent store={store} params={params} />);
      });

      it('includes all other props in props', () => {
        const store = createStore(() => ({}));

        // test that mapStateToProps has URL props in there
        function mapStateToProps(state, props) {
          expect(props).to.contain.keys('other', 'other2');
          expect(props.other).to.equal(1);
          expect(props.other2).to.equal(2);

          return props;
        }

        const WrappedMyComponent = urlConnect(urlHandler, mapStateToProps)(MyComponent);

        shallow(<WrappedMyComponent store={store} other={1} other2={2} />);
      });

      it('decodes only if the value has changed, otherwise reuses previous', () => {
        const store = createStore(() => ({}));

        const config = {
          myArray: { type: 'array' },
          myObject: { type: 'object' },
          myArray2: { type: 'array' },
        };
        const urlHandler = new UrlHandler(config);

        const query = {
          myArray: '1_2_3',
          myObject: 'a-1_b-2',
          myArray2: '3_4_5',
        };

        const location = { query };

        // test that mapStateToProps has URL props in there
        let myArrayPrev;
        let myObjectPrev;
        let myArray2Prev;

        function mapStateToProps(state, props) {
          expect(props).to.contain.keys('myArray', 'myObject');
          expect(props.myArray).to.deep.equal(['1', '2', '3']);
          expect(props.myObject).to.deep.equal({ a: '1', b: '2' });

          if (myArrayPrev) {
            expect(props.myArray).to.equal(myArrayPrev);
          }
          if (myObjectPrev) {
            expect(props.myObject).to.equal(myObjectPrev);
          }
          if (myArray2Prev) {
            expect(props.myArray2).to.not.equal(myArray2Prev);
            expect(props.myArray2).to.deep.equal(['4', '5', '6']);
            expect(myArray2Prev).to.deep.equal(['3', '4', '5']);
          }

          myArrayPrev = props.myArray;
          myObjectPrev = props.myObject;
          myArray2Prev = props.myArray2;

          return props;
        }

        const WrappedMyComponent = urlConnect(urlHandler, mapStateToProps)(MyComponent);

        const wrapped = mount(<WrappedMyComponent store={store} location={location} />);
        wrapped.setProps({ location: { query: { ...query, myArray2: '4_5_6' } } });
      });
    });

    describe('dispatch', () => {
      it('dispatch uses UrlHandler on URL_REPLACE', () => {
        const store = createStore(() => ({}));
        store.dispatch = sinon.spy();

        const spyHandler = {
          replaceInQuery: sinon.spy(),
          decodeQuery: sinon.spy(),
        };

        const action = { type: URL_REPLACE, key: 'myKey', value: 'myValue' };

        class DispatchingComponent extends Component {
          static propTypes = { dispatch: PropTypes.func };
          componentDidMount() {
            const { dispatch } = this.props;
            dispatch(action);
          }
          render() {
            return <div />;
          }
        }

        const WrappedMyComponent = urlConnect(spyHandler)(DispatchingComponent);
        mount(<WrappedMyComponent store={store} location={location} />);

        expect(spyHandler.replaceInQuery).to.have.been.calledOnce;
        expect(spyHandler.replaceInQuery).to.have.been.calledWith(location, 'myKey', 'myValue');
        expect(store.dispatch).to.have.callCount(0);
      });

      it('dispatch uses redux dispatch for non-URL actions', () => {
        const store = createStore(() => ({}));
        store.dispatch = sinon.spy();

        const spyHandler = {
          replaceInQuery: sinon.spy(),
          decodeQuery: sinon.spy(),
        };

        const action = { type: 'SOME_NON_URL_ACTION' };

        class DispatchingComponent extends Component {
          static propTypes = { dispatch: PropTypes.func };
          componentDidMount() {
            const { dispatch } = this.props;
            dispatch(action);
          }
          render() {
            return <div />;
          }
        }

        const WrappedMyComponent = urlConnect(spyHandler)(DispatchingComponent);
        mount(<WrappedMyComponent store={store} location={location} />);

        expect(spyHandler.replaceInQuery).to.have.callCount(0);
        expect(store.dispatch).to.have.been.calledOnce;
        expect(store.dispatch).to.have.been.calledWith(action);
      });

      it('redux dispatch available as prop', () => {
        const store = createStore(() => ({}));
        store.dispatch = sinon.spy();

        const spyHandler = {
          replaceInQuery: sinon.spy(),
          decodeQuery: sinon.spy(),
        };

        const action = { type: URL_REPLACE, key: 'myKey', value: 'myValue' };

        class DispatchingComponent extends Component {
          static propTypes = { reduxDispatch: PropTypes.func };
          componentDidMount() {
            const { reduxDispatch } = this.props;
            reduxDispatch(action);
          }
          render() {
            return <div />;
          }
        }

        const WrappedMyComponent = urlConnect(spyHandler)(DispatchingComponent);
        mount(<WrappedMyComponent store={store} location={location} />);

        expect(spyHandler.replaceInQuery).to.have.callCount(0);
        expect(store.dispatch).to.have.been.calledOnce;
        expect(store.dispatch).to.have.been.calledWith(action);
      });
    });
  });
});
