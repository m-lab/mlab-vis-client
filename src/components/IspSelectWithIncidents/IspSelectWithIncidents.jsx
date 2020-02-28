
import React, { PureComponent, PropTypes } from 'react';
import IncidentTip from '../IncidentTip/IncidentTip';

// import { Icon } from '../../components';

// import { colorsFor } from '../../utils/color';

import './IspSelectWithIncidents.scss';
import {Icon} from '../../components';

/**
 * ISP Selection and display component
 */
export default class IspSelectWithIncidents extends PureComponent {

  static propTypes = {
    changeTimeAggregation: React.PropTypes.func,
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
    this.showIncident = this.showIncident.bind(this);
    this.removeAllExceptOne = this.removeAllExceptOne.bind(this);
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

  /**
   * convert array of ISPs to an array of options to display
   * @param {Array} isps ISPs to convert
   * @return {Array} array of {value: label:} objects
   */
  getOptions(isps, incidentData) {
    let options = isps;
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

  showIncident(value) {
    const { isps, changeTimeAggregation } = this.props;

    // deselect all other ISPs except the ISP with incidents
    this.removeAllExceptOne(value.target.id);

    // TODO: force time aggregation to month view
    // changeTimeAggregation('month');

    // TODO: toggle the incident viewer on
  }


  toggleDropdown() {
    const items = document.getElementById('items');
    const anchor = document.getElementById('anchor');
    const arrow = document.getElementById('dropdown-arrow');
    if (items.classList.contains('visible')) {
      items.classList.remove('visible');
      items.style.display = 'none';
      arrow.style.transform = 'none';
      anchor.style.borderRadius = '4px';
    } else {
      items.classList.add('visible');
      items.style.display = 'block';
      anchor.style.borderRadius = '4px 4px 0px 0px';
      arrow.style.transform = 'translateY(6px) rotate(180deg)';
    }
  }

  /**
   * Callback to remove all selected values except the asn provided.
   * If provided asn is unselected, it is then forcefully selected.
   * @param {Array} {Object} ISP object to remove
   */
  removeAllExceptOne(incidentASN) {
    const { isps, selected, onChange } = this.props;
    const ispsToRemoveObjs = selected.filter((optionObj) => optionObj.client_asn_number !== incidentASN);
    const ispsToRemoveASNs = ispsToRemoveObjs.map(obj => obj.client_asn_number);
    const filtered = selected.filter((isp) =>
      !ispsToRemoveASNs.includes(isp.client_asn_number)
    );

    // if provided ISP was unselected, we then force select it
    if (selected.length === ispsToRemoveObjs.length) {
      const incidentObject = isps.find(isp => isp.client_asn_number === incidentASN);
      filtered.push(incidentObject);
    }

    const values = this.getOptions(filtered);
    if (onChange) {
      onChange(values.map(value => value.value));
    }
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
    const options = this.getOptions(isps, incidentData);
    // TODO: maybe have isps be a asn number to corresponding object map so it doesn't have to create it each time its rendered
    const selectedASNs = selected.map(obj => obj.client_asn_number);

    // TODO: Before making pull request make sure that console errors dont result from async and this code.
    const items = options.map(option => {
      const checkedVal = !!selectedASNs.includes(option.value);
      if ('hasInc' in option) {
        return (<li key={option.value}>
          <input className="isp-toggle-checkbox" type="checkbox" id={option.value} checked={checkedVal} onClick={this.toggleCheckbox} />
          {option.label} <IncidentTip id="incident-isp-tip" /> 
          <button className="show-inc-btn" id={option.value} onClick={this.showIncident}>Show Incident</button>
        </li>);
      }
      return (<li key={option.value}>
        <input className="isp-toggle-checkbox" type="checkbox" id={option.value} checked={checkedVal} onClick={this.toggleCheckbox} />
        {option.label}
      </li>);
    });

    return (
      <div className="dropdownCheckList">
        <span id="anchor" className="anchor" onClick={this.toggleDropdown}>Select Client ISP to view <Icon id="dropdown-arrow" className="dropdown-arrow" name="sort-down" /></span>
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
