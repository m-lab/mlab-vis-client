import React from 'react';
import { shallow, mount } from 'enzyme';
import chai, { expect } from 'chai';

import chaiEnzyme from 'chai-enzyme';
import { IspSelectWithIncidents } from 'components';

chai.use(chaiEnzyme());

describe('components', () => {
  describe('IspSelectWithIncidents', () => {
    // Sample data for tests
    const isps = {
      AS10774x: { client_asn_name: 'AT&T', client_asn_number: 'AS10774x' },
      AS10796x: { client_asn_name: 'Time Warner Cable', client_asn_number: 'AS10796x' },
      AS11486x: { client_asn_name: 'Verizon', client_asn_number: 'AS11486x' },
      AS10507: { client_asn_name: 'Sprint Personal Communications Systems', client_asn_number: 'AS10507' },
    };

    const att = isps.AS10774x;
    const twc = isps.AS10796x;
    const verizon = isps.AS11486x;

    it('selecting multiple ISPs', () => {
      const selected = [];

      function mockSelect(ispIds) {
        // Add ISP to selected if currently not added
        for (let i = 0; i < ispIds.length; i++) {
          const ispId = ispIds[i];
          const existsInSelected = selected.some(isp => isp.client_asn_number === ispId);
          if (!existsInSelected) {
            selected.push(isps[ispId]);
          }
        }
      }

      const incidentData = {};

      const onChangeIncidentASN = function () { return; };

      const wrapper = mount(
        <IspSelectWithIncidents
          incidentData={incidentData}
          isps={isps}
          onChangeIncidentASN={onChangeIncidentASN}
          selected={selected}
          onChange={mockSelect}
        />
      );

      const instance = wrapper.instance();

      // Call select function on AT&T
      instance.onAdd(att);

      // Make sure that an item has been added to parent's 'selected' member
      expect(selected).to.eql([att]);

      // Add Verizon
      instance.onAdd(verizon);

      // Expect Verizon and AT&T to be in selected
      expect(selected).to.eql([att, verizon]);

      wrapper.unmount();
    });

    it('removing multiple ISPs', () => {
      const selected = [att, verizon, twc];

      function mockRemove(ispIds) {
        // ISP is deleted if in selected but not passed into this function
        for (let i = 0; i < selected.length; i++) {
          const isp = selected[i];
          if (!ispIds.includes(isp.client_asn_number)) {
            selected.splice(i, 1);
          }
        }
      }

      const incidentData = {};

      const onChangeIncidentASN = function () { return; };

      const wrapper = mount(
        <IspSelectWithIncidents
          incidentData={incidentData}
          isps={isps}
          onChangeIncidentASN={onChangeIncidentASN}
          selected={selected}
          onChange={mockRemove}
        />
      );

      const instance = wrapper.instance();

      // Remove AT&T from selected
      instance.onRemove(att);

      // Make sure that AT&T was removed
      expect(selected).to.eql([verizon, twc]);

      // Remove Verizon from selected
      instance.onRemove(verizon);

      // Make sure that Verizon was removed
      expect(selected).to.eql([twc]);

      wrapper.unmount();
    });

    it('check if ISPs with incidents have an incident tooltip and an incident viewer button', () => {
      const incidentData = {
        AS11486x: [{}, {}], // Verizon with 2 incidents
        AS10774x: [{}],  // AT&T with one incident
      };
      const selected = [];

      const wrapper = shallow(
        <IspSelectWithIncidents
          incidentData={incidentData}
          isps={isps}
          selected={selected}
        />
      );

      // There should be two incident tips because of the two different ISPs
      expect(wrapper.find('#incident-isp-tip')).to.have.lengthOf(2);

      // Both the row itself and the 'Show Incident' button have the same id,
      // so each ISP with an incident should have two instances of their id.
      expect(wrapper.find('#AS11486x')).to.have.lengthOf(2);
      expect(wrapper.find('#AS10774x')).to.have.lengthOf(2);

      wrapper.unmount();
    });
  });
});
