import { expect } from 'chai';
import queryRebuild from '../queryRebuild';

describe('url', () => {
  describe('UrlHandler', () => {
    describe('queryRebuild', () => {
      it('keeps params by default', () => {
        const query = { keep: 'yes' };
        const config = { keeper: { urlKey: 'keep' } };
        const rebuilt = queryRebuild(query, config);
        expect(rebuilt).to.deep.equal(query);
      });

      it('excludes non-persisted params', () => {
        const query = { keep: 'yes', nope: 'noooo' };
        const config = {
          dontKeep: { urlKey: 'nope', persist: false },
          keeper: { urlKey: 'keep' },
        };
        const rebuilt = queryRebuild(query, config);
        expect(rebuilt).to.deep.equal({ keep: 'yes' });
      });

      it('includes explicitly persisted params', () => {
        const query = { keep: 'yes', nope: 'noooo' };
        const config = {
          dontKeep: { urlKey: 'nope', persist: false },
          keeper: { urlKey: 'keep', persist: true },
        };
        const rebuilt = queryRebuild(query, config);
        expect(rebuilt).to.deep.equal({ keep: 'yes' });
      });

      it('excludes params not in config', () => {
        const query = { keep: 'yes', nope: 'noooo' };
        const config = {
          keeper: { urlKey: 'keep' },
        };
        const rebuilt = queryRebuild(query, config);
        expect(rebuilt).to.deep.equal({ keep: 'yes' });
      });
    });
  });
});
