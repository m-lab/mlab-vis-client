import PropTypes from 'prop-types';
import React from 'react';

import regions from './regions';

const RegionSelect = ({ onChange, value }) => {
  return (
    <select onChange={onChange} value={value}>
      {regions.map(region => (
        <option
          key={`${region.continent}/${region.country}/${region.region}`}
          value={`${region.continent}/${region.country}/${region.region}`}
        >
          {region.label}
        </option>
      ))}
    </select>
  );
};

RegionSelect.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default RegionSelect;
