/**
*
* Instances
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Instance = (props) => {
  const { name } = props;
  return (
    <li className="list-group-item list-group-item-action">{name}</li>
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

Instance.propTypes = {
  name: PropTypes.string
};

const Instances = (props) => {
  const { instances } = props;

  return (
    <Listing className="list-group">
      {instances.map(instance => <Instance key={instance.name} {...instance} />)}
    </Listing>
  );
};

Instances.propTypes = {
  instances: PropTypes.array
};

export default Instances;
