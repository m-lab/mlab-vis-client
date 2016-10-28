/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import status from '../status';


describe('redux', () => {
  describe('status', () => {
    const loading = { isFetching: true, isFetched: true };
    const ready = { isFetched: true };
    const error = { error: 'error' };
    const unknown = {};

    it('get the status of a single object', () => {
      expect(status(loading)).to.equal('loading');
      expect(status(ready)).to.equal('ready');
      expect(status(error)).to.equal('error');
      expect(status(unknown)).to.equal('unknown');
    });

    it('get the status of an array of objects', () => {
      expect(status([ready, unknown, loading])).to.equal('partially-loaded');
      expect(status([unknown, unknown, loading])).to.equal('loading');
      expect(status([unknown, unknown, ready])).to.equal('ready');
      expect(status([error, ready, loading, unknown])).to.equal('error');
      expect(status([unknown, unknown, unknown])).to.equal('unknown');
    });


    it('get the status of an array of strings', () => {
      expect(status(['ready', 'unknown', 'loading'])).to.equal('partially-loaded');
      expect(status(['unknown', 'unknown', 'loading'])).to.equal('loading');
      expect(status(['unknown', 'unknown', 'ready'])).to.equal('ready');
      expect(status(['error', 'ready', 'loading', 'unknown'])).to.equal('error');
      expect(status(['unknown', 'unknown', 'unknown'])).to.equal('unknown');
    });
  });
});
