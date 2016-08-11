import React from 'react';
import ReactDOM from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import { expect } from 'chai';
import { JsonDump } from 'components';

describe('JsonDump', () => {
  const testInfo = {
    message: 'This came from the api server',
    time: Date.now(),
  };

  const renderer = renderIntoDocument(
    <JsonDump json={testInfo} />
  );
  const dom = ReactDOM.findDOMNode(renderer);

  it('should render correctly', () => {
    expect(renderer).to.be.ok;
  });

  it('should render with correct value', () => {
    const text = dom.getElementsByTagName('pre')[0].textContent;
    expect(text).to.equal(JSON.stringify(testInfo));
  });

  it('should render with a reload button', () => {
    const text = dom.getElementsByTagName('button')[0].textContent;
    expect(text).to.be.a('string');
  });
});
