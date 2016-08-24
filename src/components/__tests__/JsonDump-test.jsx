import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { JsonDump } from 'components';

chai.use(chaiEnzyme());

describe('JsonDump', () => {
  const testInfo = {
    message: 'This came from the api server',
    time: Date.now(),
  };

  it('renders a pre tag', () => {
    const wrapper = shallow(<JsonDump json={testInfo} />);
    expect(wrapper.find('pre')).to.have.length(1);
  });

  it('renders with correct value', () => {
    const wrapper = shallow(<JsonDump json={testInfo} />);
    expect(wrapper.find('pre')).to.have.text(JSON.stringify(testInfo));
  });
});
