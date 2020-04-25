import React from 'react';
import { shallow, mount } from 'enzyme';
import chai, { expect } from 'chai';

import chaiEnzyme from 'chai-enzyme';
import { IspSelectWithIncidents } from 'components';

chai.use(chaiEnzyme());

describe('components', () => {
  describe('IspSelectWithIncidents', () => {
    it('selecting multiple ISPs', () => {
      const selected = [];

      const mockChange = function (ispId) { selected.push(ispId); };

      // Sample data for this test
      const isps = {
        AS10774x: { client_asn_name: 'AT&T', client_asn_number: 'AS10774x' },
        AS10796x: { client_asn_name: 'Time Warner Cable', client_asn_number: 'AS10796x' },
        AS11486x: { client_asn_name: 'Verizon', client_asn_number: 'AS11486x' },
        AS10507: { client_asn_name: 'Sprint Personal Communications Systems', client_asn_number: 'AS10507' },
      };

      const incidentData = {};

      const onChangeIncidentASN = function () { return; };

      const wrapper = mount(
        <IspSelectWithIncidents
          incidentData={incidentData}
          isps={isps}
          onChangeIncidentASN={onChangeIncidentASN}
          selected={selected}
          onChange={mockChange}
        />
      );

      // Call select function on AT&T
      const att = isps.AS10774x;
      wrapper.instance().onAdd({ client_asn_name: att.client_asn_name, client_asn_number: att.client_asn_number });

      console.log('AT&T');
      console.log(selected);

      // Make sure that an item has been added to parent's 'selected' member
      expect(selected).to.have.lengthOf(1);
      expect(selected).to.eql([[att.client_asn_number]]);

      // Add Verizon
      wrapper.instance().onAdd({ client_asn_name: 'Verison', client_asn_number: 'AS11486x' });

      // Expect Verizon and AT&T to be in selected
      expect(selected).to.have.lengthOf(2);

      wrapper.unmount();
    });

    it('removing multiple ISPs', () => {
      const selected = ['AS10774x', 'AS11486x', 'AS10796x'];

      const mockChange = function (ispId) {
        const i = selected.indexOf(ispId);
        selected.splice(i, 1);
      };

      // Sample data for this test
      const isps = {
        AS10774x: { client_asn_name: 'AT&T', client_asn_number: 'AS10774x' },
        AS10796x: { client_asn_name: 'Time Warner Cable', client_asn_number: 'AS10796x' },
        AS11486x: { client_asn_name: 'Verizon', client_asn_number: 'AS11486x' },
        AS10507: { client_asn_name: 'Sprint Personal Communications Systems', client_asn_number: 'AS10507' },
      };
      const incidentData = {};

      const onChangeIncidentASN = function () { return; };

      const wrapper = mount(
        <IspSelectWithIncidents
          incidentData={incidentData}
          isps={isps}
          onChangeIncidentASN={onChangeIncidentASN}
          selected={selected}
          onChange={mockChange}
        />
      );

      // Call select function on AT&T
      wrapper.instance().onRemove({ client_asn_name: 'AT&T', client_asn_number: 'AS10774x' });

      // Make sure that an item has been added to parent's 'selected' member
      expect(selected).to.have.lengthOf(2);

      // Add Verizon
      wrapper.instance().onRemove({ client_asn_name: 'Verison', client_asn_number: 'AS11486x' });

      // Select AT&T
      expect(selected).to.have.lengthOf(1);

      wrapper.unmount();
    });

    it('check if ISPs with incidents have an incident tooltip and an incident viewer button', () => {
      // Sample data for this test, should have two ISPs with incidents out of a total of four ISPs
      const isps = {
        AS10774x: { client_asn_name: 'AT&T', client_asn_number: 'AS10774x' },
        AS10796x: { client_asn_name: 'Time Warner Cable', client_asn_number: 'AS10796x' },
        AS11486x: { client_asn_name: 'Verizon', client_asn_number: 'AS11486x' },
        AS10507: { client_asn_name: 'Sprint Personal Communications Systems', client_asn_number: 'AS10507' },
      };
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
