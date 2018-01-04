/**
*
* Switch
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withState } from 'recompose';
// import styled from 'styled-components';

const enhance = compose(
  withHandlers({
    handleOnChange: ({ onChange, checked }) => event => {
      let { target } = event;
      onChange({ target, checked: !checked });
    }
  }),
);

const Switch = enhance(({ checked, onChange, handleOnChange, ...rest }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={handleOnChange} {...rest} />
      <span className="slider round"></span>
    </label>
  );
});

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Switch;
