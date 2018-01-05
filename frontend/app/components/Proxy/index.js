/**
*
* Proxy
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FieldSet = styled.fieldset`
  border: 1px groove rgba(0, 0, 0, 0.125);
  border-radius: 0.15em;
  padding: 5px 10px;

  & legend {
    padding: 5px 10px;
    width: auto;
  }
`;


const Proxy = ({ name, children }) => {
  return (
    <FieldSet>
      <legend>{name}</legend>
      {children}
    </FieldSet>
  );
}

Proxy.propTypes = {
  name: PropTypes.string,
};

export default Proxy;
