/**
*
* Instances
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Instance = ({ current, name }) => {
  return (
    <li className="list-group-item list-group-item-action"><a href={`/${name}`}>{name}</a></li>
  );
};

const Instances = ({ current, instances }) => {
  return (
    <ul className="list-group">
      {Object.keys(instances).map(instanceId => <Instance key={instanceId} current={current} {...instances[instanceId]} />)}
    </ul>
  );
};

Instances.propTypes = {
  instances: PropTypes.object
};

export default Instances;
