/**
*
* ServerListing
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Server = (props) => {
  const { name } = props;
  return (
    <li>{name}</li>
  );
};

const Listing = styled.ul`
  font-size: large;
  list-style-type: none;
  margin: 0;
  padding: 10px 15px;

  & li {
   list-style-type: none;
  }
`;

Server.propTypes = {
  name: PropTypes.string
};

const Servers = (props) => {
  const { instances } = props;

  return (
    <Listing>
      {instances.map(instance => <Server key={instance.name} {...instance} />)}
    </Listing>
  );
};

Servers.propTypes = {
  instances: PropTypes.array
};

export default Servers;
