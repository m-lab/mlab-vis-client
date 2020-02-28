
import React, { PureComponent, PropTypes } from 'react';
import IncidentTip from '../IncidentTip/IncidentTip';

import { Icon } from '../../components';

import { colorsFor } from '../../utils/color';

// import '../../assets/react-select.scss';
import './IspSelectWithIncidents.scss';

/**
 * ISP Selection and display component
 */
export default class IspSelectWithIncidents extends PureComponent {

  static propTypes = {
    incidentData: React.PropTypes.object,
    isps: PropTypes.array,
    onChange: React.PropTypes.func,
    placeholder: PropTypes.string,
    selected: PropTypes.array,
  }

  static defaultProps = {
    isps: [],
    selected: [],
  }

  /**
   * Main constructor. Bind handlers here.
   */
  constructor(props) {
    super(props);
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  /**
   * Callback to add a specified option to the
   * selected ISP list
   * @param {Object} {value: label:} option object to Add
   */
  onAdd(addValue) {
    const { selected, onChange } = this.props;
    // convert to options first
    const values = this.getOptions(selected);
    values.push({ value: addValue.client_asn_number, label: addValue.client_asn_name });
    if (onChange) {
      onChange(values.map(value => value.value));
    }
  }

  /**
   * Callback to remove a specified value from the
   * selected ISP list
   * @param {Object} ISP object to remove
   */
  onRemove(removeValue) {
    const { selected, onChange } = this.props;
    const filtered = selected.filter((isp) => isp.client_asn_number !== removeValue.client_asn_number);
    const values = this.getOptions(filtered);
    if (onChange) {
      onChange(values.map(value => value.value));
    }
  }

  toggleDropdown() {
    var items = document.getElementById('items');
    var anchor = document.getElementById('anchor');
    if (items.classList.contains('visible')){
      items.classList.remove('visible');
      items.style.display = "none";
      // Make border-radius 4 for bottom corners of anchor
      anchor.style.borderRadius = "4px";
    }
  
    else {
        items.classList.add('visible');
        items.style.display = "block";
      // Make border-radius 0 for bottom corners of anchor
      anchor.style.borderRadius = "4px 4px 0px 0px";
    }
  }

  toggleCheckbox(value) {
    const { isps } = this.props;
    // get option Object for corresponding ISP
    const optionObj = isps.find(isp => isp.client_asn_number === value.target.id);
    if (value.target.checked == true) {
      // TODO: onAdding not updated selected isps and url params
      this.onAdd(optionObj);
    }
    else {
      this.onRemove(optionObj);
    }
  }

  /**
   * convert array of ISPs to an array of options to display
   * @param {Array} isps ISPs to convert
   * @return {Array} array of {value: label:} objects
   */
  getOptions(isps, selected, incidentData) {
    let options = isps;
    // TODO: delete this code and remove selected from function header and calls (make sure doesn't break existing functionality)
    // if (selected && selected.length) {
    //   options = isps.filter(isp => !selected.find(d => d.client_asn_number === isp.client_asn_number));
    // }
    options = options.map(isp => ({ value: isp.client_asn_number, label: isp.client_asn_name }));

    // TODO: without checking incidentData, onAdd + onRemove throw errors. Do we always want to pass in incidentData?
    if (incidentData) {
      let i;
      for (i of options) {
        if (i.value in incidentData) {
          i.hasInc = true;
        }
      }
    }
    return options;
  }

  toggleCheckbox(value) {
    const { isps } = this.props;
    // get option Object for corresponding ISP
    const optionObj = isps.find(isp => isp.client_asn_number === value.target.id);
    if (value.target.checked === true) {
      this.onAdd(optionObj);
    } else {
      this.onRemove(optionObj);
    }
  }

  renderDropdown() {
    const { isps, selected, incidentData } = this.props;
    const options = this.getOptions(isps, selected, incidentData);
    // TODO: maybe have isps be a asn number to corresponding object map so it doesn't have to create it each time its rendered
    const selectedASNs = selected.map(obj => obj.client_asn_number);

    // TODO: Before making pull request make sure that console errors dont result from async and this code.
    const items = options.map(option => {
      let checkedVal = selectedASNs.includes(option.value) ? true : false;
      if ('hasInc' in option) {
        return <li><input type="checkbox" id={option.value} checked={checkedVal} onClick={this.toggleCheckbox}/> {option.label}<IncidentTip id="incident-isp-tip" /></li>;
      }
      return <li><input type="checkbox" id={option.value} checked={checkedVal} onClick={this.toggleCheckbox}/>{option.label}</li>;
    });

    return (
      <div className="dropdownCheckList">
        <span id="anchor" className="anchor" onClick={this.toggleDropdown}>Select Client ISP to view</span>
        <ul id="items" className="items">
          {items}
        </ul>
      </div>
    );
  }

  // TODO: put selected pills back
  // /**
  //  * Render individual isp name
  //  * @return {React.Component} active isps
  //  */
  // renderIsp(isp, color) {
  //   const style = { backgroundColor: color };
  //   return (
  //     <div key={isp.client_asn_number} className="selected-isp" style={style}>
  //       <span className="isp-label">{isp.client_asn_name}</span>
  //       <Icon
  //         name="close"
  //         className="isp-remove-control"
  //         onClick={() => this.onRemove(isp)}
  //       />
  //     </div>
  //   );
  // }

  // /**
  //  * Render selected ISP pills
  //  * @return {React.Component} active isps
  //  */
  // renderSelectedIsps(selectedIsps) {
  //   const colors = colorsFor(selectedIsps, (d) => d.client_asn_number);
  //   return (
  //     <div className="active-isps">
  //       {selectedIsps.map((selectedIsp) =>
  //         this.renderIsp(selectedIsp, colors[selectedIsp.client_asn_number])
  //       )}
  //     </div>
  //   );
  // }

  /**
   * The main render method.
   * @return {React.Component} The rendered container
   */
  render() {
    return (
      <div >
        {this.renderDropdown()}
        {/* {this.renderSelectedIsps(selected)} */}
       </div>
    );
  }
}
