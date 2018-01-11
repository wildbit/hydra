/**
*
* Proxy
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProxyContainer = styled.div`
  border-radius: 5px;
  margin-bottom: 1em;
  background-color: #FFF;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0,.07);
`;

const Title = styled.h4`
  font-size: 20px;
  margin: 1.5rem;
`;

const Proxy = ({ name, children }) => {
  return (
    <ProxyContainer>
      <Title>{name} <span className="badge-count">{children.props.children.length}</span></Title>
      {children}
    </ProxyContainer>
  );
}

Proxy.propTypes = {
  name: PropTypes.string,
};

export default Proxy;
