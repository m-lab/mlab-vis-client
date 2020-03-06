
import React, { PureComponent, PropTypes } from 'react';
import IncidentTip from '../IncidentTip/IncidentTip';

import './IspSelectWithIncidents.scss';
import { Icon } from '../../components';

/**
 * ISP Selection and display component
 */
export default class IspSelectWithIncidents extends PureComponent {

  static propTypes = {
    incidentData: React.PropTypes.object,
    isps: PropTypes.object,
    onChange: React.PropTypes.func,
    onChangeIncidentASN: React.PropTypes.func,
    onShowIncident: React.PropTypes.func,
    placeholder: PropTypes.string,
    selected: PropTypes.array,
  }

  static defaultProps = {
    isps: {},
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
   * @param {Object} addValue option object to Add
   */
  onAdd(addValue) {
    const { selected, onChange, onChangeIncidentASN } = this.props;
    // remove incident viewer if present
    onChangeIncidentASN();
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
   * @param {Object} removeValue ISP object to remove
   */
  onRemove(removeValue) {
    const { selected, onChange, onChangeIncidentASN } = this.props;
    // remove incident viewer if present
    onChangeIncidentASN();
    const filtered = selected.filter((isp) => isp.client_asn_number !== removeValue.client_asn_number);
    const values = this.getOptions(filtered);
    if (onChange) {
      onChange(values.map(value => value.value));
    }
  }

  /**
   * convert dictionary of ISPs to an array of options to display
   * @param {Array} isps ISPs to convert
   * @param {Dictionary} incidentData Information about which ISPs have incidents in the timeframe.
   * @return {Array} array of {value: label:} objects
   */
  getOptions(isps, incidentData) {
    let options = Object.values(isps);
    options = options.map(isp => ({ value: isp.client_asn_number, label: isp.client_asn_name }));

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

  /**
   * Removes all ISPs except the desired incident ISP and toggles the incident viewer on.
   * @param {Object} value An object containing the ASN of our desired ISP
   */
  showIncident(value) {
    const { onChangeIncidentASN } = this.props;
    const incidentASN = value.target.id;
    // deselect all other ISPs except the ISP with incidents and force time aggregation to month
    this.removeAllExceptOne(incidentASN);
    // toggle the incident viewer on
    onChangeIncidentASN(incidentASN);
  }

  /**
   * Toggles the dropdown. Currently, this function handles all of the logic that belongs in state and css.
   * See Issue #20 for more about this possible code-health improvement.
   */
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
   * @param {Array} incidentASN ISP object to isolate
   */
  removeAllExceptOne(incidentASN) {
    const { isps, selected, onShowIncident } = this.props;
    const ispsToRemoveObjs = selected.filter((optionObj) => optionObj.client_asn_number !== incidentASN);
    const ispsToRemoveASNs = ispsToRemoveObjs.map(obj => obj.client_asn_number);
    const filtered = selected.filter((isp) =>
      !ispsToRemoveASNs.includes(isp.client_asn_number)
    );

    // if provided ISP was unselected, we then force select it
    if (selected.length === ispsToRemoveASNs.length) {
      const incidentObject = isps[incidentASN];
      filtered.push(incidentObject);
    }

    const values = this.getOptions(filtered);
    if (onShowIncident) {
      onShowIncident(values.map(value => value.value));
    }
  }

  /**
   * Callback to handle checkbox ticking and unticking.
   * @param {Object} value Used to identify which ISP's checkbox has been toggled. 
   */
  toggleCheckbox(value) {
    const { isps } = this.props;
    // get option Object for corresponding ISP
    const optionObj = isps[value.target.id];
    if (value.target.checked === true) {
      this.onAdd(optionObj);
    } else {
      this.onRemove(optionObj);
    }
  }

  /**
   * Render function that pulls logic pieces together and creates visual checkbox dropdown.
   * @return {React.Component} The rendered container
   */
  renderDropdown() {
    const { isps, selected, incidentData } = this.props;
    const options = this.getOptions(isps, incidentData);
    const selectedASNs = selected.map(obj => obj.client_asn_number);

    const items = options.map(option => {
      const checkedVal = !!selectedASNs.includes(option.value);
      if ('hasInc' in option) {
        return (
          <li key={option.value}>
            <input
              className="isp-toggle-checkbox"
              type="checkbox" id={option.value}
              checked={checkedVal}
              onClick={this.toggleCheckbox}
            />
            {option.label} <IncidentTip id="incident-isp-tip" />
            <button className="show-inc-btn" id={option.value} onClick={this.showIncident}>Show Incident</button>
          </li>
        );
      }
      return (<li key={option.value}>
        <input
          className="isp-toggle-checkbox"
          type="checkbox" id={option.value}
          checked={checkedVal}
          onClick={this.toggleCheckbox}
        />
        {option.label}
      </li>);
    });

    return (
      <div className="dropdownCheckList">
        <span id="anchor" className="anchor" onClick={this.toggleDropdown}>Select Client ISP to view
          <Icon id="dropdown-arrow" className="dropdown-arrow" name="sort-down" />
        </span>
        <ul id="items" className="items">
          {items}
        </ul>
      </div>
    );
  }

  /**
   * The main render method.
   * @return {React.Component} The rendered container
   */
  render() {
    return (
      <div >
        {this.renderDropdown()}
      </div>
    );
  }
}
