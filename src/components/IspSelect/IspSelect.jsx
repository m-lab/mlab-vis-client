
import React, { PureComponent, PropTypes } from 'react';
import Select from 'react-select';

import { Icon } from '../../components';

import './react-select.scss';
import './IspSelect.scss';

/**
 * ISP Selection and display component
 */
export default class IspSelect extends PureComponent {

  static propTypes = {
    isps: PropTypes.array,
    onChange: React.PropTypes.func,
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
    // addValue is a option Object
    values.push(addValue);
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
    const filtered = selected.filter((isp) => isp.meta.client_asn_number !== removeValue.meta.client_asn_number);
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
  getOptions(isps) {
    return isps.map(isp => ({ value: isp.meta.client_asn_number, label: isp.meta.client_asn_name }));
  }

  /**
   * Render individual isp name
   * @return {React.Component} active isps
   */
  renderIsp(isp) {
    return (
      <div key={isp.meta.client_asn_number} className="selected-isp">
        <span className="isp-label">{isp.meta.client_asn_name}</span>
        <Icon
          name="close"
          className="isp-remove-control"
          onClick={() => this.onRemove(isp)}
        />
      </div>
    );
  }

  /**
   * Render selected ISP pills
   * @return {React.Component} active isps
   */
  renderSelectedIsps(selectedIsps) {
    return (
      <div className="active-isps">
        {selectedIsps.map((selectedIsp, i) =>
          this.renderIsp(selectedIsp, i)
        )}
      </div>
    );
  }

  /**
   * The main render method.
   * @return {React.Component} The rendered container
   */
  render() {
    const { isps, selected } = this.props;
    const options = this.getOptions(isps);
    // const values = this.getOptions(selected);
    return (
      <div className="IspSelect">
        <Select
          name="isp-select-input"
          options={options}
          onChange={this.onAdd}
          placeholder="Select Client ISP to view"
        />
      {this.renderSelectedIsps(selected)}
      </div>
    );
  }
}
