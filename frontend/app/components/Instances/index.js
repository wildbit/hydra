/**
*
* Instances
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Instance = ({ name }) => {
  return (
    <li className="list-group-item list-group-item-action">{name}</li>
  );
};

const Instances = ({ instances }) => {
  return (
    <ul className="list-group">
      {Object.keys(instances).map(instanceId => <Instance key={instanceId} {...instances[instanceId]} />)}
    </ul>
  );
};

Instances.propTypes = {
  instances: PropTypes.object
};

export default Instances;
