/**
*
* Weight
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withState } from 'recompose';
import Slider, { createSliderWithTooltip } from 'rc-slider';

const SliderWithTooltip = createSliderWithTooltip(Slider);

const enhance = compose(
  withState('state', 'setState', { weight: null }),
  withHandlers({
    handleOnChange: ({ setState }) => value => {
      setState({ weight: value });
    },
    handleOnAfterChange: ({ server, onChange }) => value => {
      onChange({ server, weight: value });
    }
  })
);

const Weight = enhance(({ server, state, handleOnChange, handleOnAfterChange }) => {
  let weight = state.weight || server.weight;
  return (
    <SliderWithTooltip
      min={0}
      max={256}
      value={weight}
      onChange={handleOnChange}
      disabled={ !server.haproxyInstance.is_available }
      onAfterChange={ handleOnAfterChange }
      trackStyle={[{'background-color': '#4bd495'}]}
      handleStyle={[{'border-color': '#4bd495'}]} />
  );
});

Weight.propTypes = {
  server: PropTypes.object,
  onChange: PropTypes.func,
};

export default Weight;
