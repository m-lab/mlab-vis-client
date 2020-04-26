import React from 'react';
import { shallow, mount } from 'enzyme';
import chai, { expect } from 'chai';

import chaiEnzyme from 'chai-enzyme';
import { IspSelectWithIncidents } from 'components';

chai.use(chaiEnzyme());

describe('components', () => {
  describe('IspSelectWithIncidents', () => {

    let selected = [];

    const changeSelected = function(ispId) {
        if ispId in selected {
            selected.splice(selected.indexOf(ispId);, 1);
         } else {
            selected.append(ispId);
         }
    };

    // Sample data for this test
    const isps = {
      AS10774x: { client_asn_name: 'AT&T', client_asn_number: 'AS10774x' },
      AS10796x: { client_asn_name: 'Time Warner Cable', client_asn_number: 'AS10796x' },
      AS11486x: { client_asn_name: 'Verizon', client_asn_number: 'AS11486x' },
      AS10507: { client_asn_name: 'Sprint Personal Communications Systems', client_asn_number: 'AS10507' },
    };

    it('selecting multiple ISPs', () => {

        
      const incidentData = {};

      const onChangeIncidentASN = function(){return;};

      const wrapper = mount(
        <IspSelectWithIncidents
          incidentData={incidentData}
          isps={isps}
          onChangeIncidentASN={onChangeIncidentASN}
          selected={selected}
          onChange={changeSelected}
        />
      );

      let instance = wrapper.instance();

      // Call select function on AT&T
      instance.onAdd({client_asn_name: 'AT&T', client_asn_number: 'AS10774x' });

      // Make sure that an item has been added to parent's 'selected' member
      expect(selected).to.have.lengthOf(1);

      // Add verizon
      instance.onAdd({client_asn_name: 'verizon', client_asn_number: 'AS11486x' });
      
      // Make sure another item has been added
      expect(selected).to.have.lengthOf(2);
    });

    it('removing multiple ISPs', () => {
      selected = ['AS10774x', 'AS11486x', 'AS10796x'];

      const incidentData = {};

      const onChangeIncidentASN = function(){ return; };

      const wrapper = mount(
        <IspSelectWithIncidents
          incidentData={incidentData}
          isps={isps}
          onChangeIncidentASN={onChangeIncidentASN}
          selected={selected}
          onChange={changeSelected}
        />
      );

      // Call select function on AT&T
      wrapper.instance().onRemove({client_asn_name: 'AT&T', client_asn_number: 'AS10774x' });

      // Make sure that item was removed
      expect(selected).to.have.lengthOf(2);

      // Remove verizon
      wrapper.instance().onRemove({client_asn_name: 'verizon', client_asn_number: 'AS11486x' });
      
      // Make sure that item was removed
      expect(selected).to.have.lengthOf(1);

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
    });

  });
});
