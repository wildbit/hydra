/**
*
* PercentageSlider
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
// import styled from 'styled-components';

const enhance = compose(
  withHandlers({
    handleOnChange: ({ onChange }) => event => {
      let { target } = event;
      let { value } = target;

      onChange({ target, value });
    }
  })
);

const PercentageSlider = enhance(({ value, handleOnChange }) => {
  return (
    <div>
      <input type="range" min="0" max="256" list="tickmarks" value={value} onChange={handleOnChange} />
      <datalist id="tickmarks">
        <option value="0" label="DRAIN" />
        <option value="20" />
        <option value="40" />
        <option value="60" />
        <option value="80" />
        <option value="100"/>
        <option value="256"/>
      </datalist>
    </div>
  );
});

PercentageSlider.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default PercentageSlider;
