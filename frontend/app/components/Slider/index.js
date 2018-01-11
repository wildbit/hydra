/**
*
* Slider
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';

const enhance = compose(
  withHandlers({
    handleOnChange: ({ server, onChange }) => event => {
      let weight = parseInt(event.target.value);
      onChange({ server, weight });
    }
  })
);

const Slider = enhance(({ server, handleOnChange }) => {
  let { weight } = server;

  return (
    <div>
      <input type="range" min="0" max="256" list="tickmarks" value={weight} onChange={handleOnChange} />
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

Slider.propTypes = {
  server: PropTypes.object,
  onChange: PropTypes.func,
};

export default Slider;
