import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { LineChart } from 'components';

chai.use(chaiEnzyme());

let wrapper;
describe('verifying ', () => {
  describe('LineChart', () => {
    const incidentData = {
      AS11486x: [{}, {}], // Verizon with 2 incidents
      AS10774x: [{}],  // AT&T with one incident
    };

    it('renders the svg for the component', () => {
      wrapper = mount(
        <LineChart
          series={[]}
          annotationSeries={[]}
          incidentData={incidentData}
          selectedASN="AS10774x"
        />
      );
      expect(wrapper.find('svg')).to.have.lengthOf(1);
      wrapper.unmount();
    });


    // TODO: delete code below if not going to test the d3 code
    // it('verifying that the elements needed to show an incident for an ISP exist', () => {
    //   wrapper = mount(
    //     <LineChart
    //       series={[]}
    //       annotationSeries={[]}
    //       incidentData={incidentData}
    //       selectedASN="AS10774x"
    //     />
    //   );

    //   // wrapper.update();
    //   // const { root } = wrapper.instance();  //https://github.com/enzymejs/enzyme/blob/master/docs/common-issues.md
    //   console.log(wrapper.debug());

    //   expect(root.find('.good-incident-line')).to.have.lengthOf(1);
    //   expect(wrapper.find('.good-incident-line').length).toBe(1);

    //   wrapper.unmount();
    // });

    // it('verifying that the elements needed to show multiple incidents for an ISP exist', () => {
    //   expect(true).to.equal(true);
    // });
  });
});
