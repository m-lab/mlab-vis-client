import PropTypes from 'prop-types';
import React from 'react';

import regions from './regions';

const RegionSelect = ({ onChange, value }) => {
  return (
    <select onChange={onChange} value={value}>
      {regions.map(region => {
        let value = `${region.continent}/${region.country}/${region.region}`;

        if (!region.region) {
          value = `${region.continent}/${region.country}`;
        }
        return (
          <option key={value} value={value}>
            {region.label}
          </option>
        );
      })}
    </select>
  );
};

RegionSelect.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default RegionSelect;
