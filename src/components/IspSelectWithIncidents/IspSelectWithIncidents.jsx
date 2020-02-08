
import React, { PureComponent, PropTypes } from 'react';
import Select from 'react-select';

import { Icon } from '../../components';

import { colorsFor } from '../../utils/color';

import '../../assets/react-select.scss';
import './IspSelectWithIncidents.scss';

/**
 * ISP Selection and display component
 */
export default class IspSelectWithIncidents extends PureComponent {

  static propTypes = {
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
  getOptions(isps, selected) {
    let options = isps;
    if (selected && selected.length) {
      options = isps.filter(isp => !selected.find(d => d.client_asn_number === isp.client_asn_number));
    }
    return options.map(isp => ({ value: isp.client_asn_number, label: isp.client_asn_name }));
  }

  /**
   * Render individual isp name
   * @return {React.Component} active isps
   */
  renderIsp(isp, color) {
    const style = { backgroundColor: color };
    return (
      <div key={isp.client_asn_number} className="selected-isp" style={style}>
        <span className="isp-label">{isp.client_asn_name}</span>
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
    const colors = colorsFor(selectedIsps, (d) => d.client_asn_number);
    return (
      <div className="active-isps">
        {/* TODO: use map of selected ISPs to render the checkboxes in the dropdown instead of creating labels */}
        {selectedIsps.map((selectedIsp) =>
          this.renderIsp(selectedIsp, colors[selectedIsp.client_asn_number])
        )}
      </div>
    );
  }

  /**
   * The main render method.
   * @return {React.Component} The rendered container
   */
  render() {
    const { isps, selected, placeholder } = this.props;
    const options = this.getOptions(isps, selected);
    const placeholderText = placeholder || 'Select Client ISP to view';
    return (
      <div className="IspSelectWithIncidents">
        {/* TODO: Check if is possible to add an on hover button to a React Select object
            or if we need to create our own with custom styling. (https://react-select.com/styles) */}
        <Select
          name="isp-select-with-incidents-input"
          options={options}
          onChange={this.onAdd}
          placeholder={placeholderText}
        />
        {this.renderSelectedIsps(selected)}
      </div>
    );
  }
}
