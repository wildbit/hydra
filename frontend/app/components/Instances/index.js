/**
*
* Instances
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Instance = (i) => {
  return (
    <li className="list-group-item list-group-item-action" >
      <a className={i.isCurrent ? 'text-success' : ''} href={`/${i.display_name}`}><span>{i.display_name}</span></a>
      { i.has_loaded_proxies ? '' : ' (load pending)' }
    </li>
  );
};

const Instances = ({ model }) => {
  return (
    <ul className="list-group">
      {model.instances.map(i =>
        <Instance key={i.key} isCurrent={model.current && model.current.key == i.key}  {...i} />)}
    </ul>
  );
};

Instances.propTypes = {
  instances: PropTypes.object
};

export default Instances;
