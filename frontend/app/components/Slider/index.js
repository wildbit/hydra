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
      <input type="range" min="0" max="100" list="tickmarks" value={value} onChange={handleOnChange} />
      <datalist id="tickmarks">
        <option value="0" label="0%" />
        <option value="25" />
        <option value="50" label="50%" />
        <option value="75" />
        <option value="100" label="100%" />
      </datalist>
    </div>
  );
});

PercentageSlider.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default PercentageSlider;
