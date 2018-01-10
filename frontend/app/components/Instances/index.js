/**
*
* Instances
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Instance = (i) => {
  let pending = '';
  if (!i.has_loaded) {
    pending = <span className="spinner"></span>
  }
  return (
    <li className="nav-item" >
      <Link className={`nav-link instance-item ${i.isCurrent ? 'disabled' : ''}`} to={`/${i.display_name}`}>
        <span className={`instance-state ${i.is_available ? 'online': 'offline'}`}></span>
        <span>{i.display_name}</span>
        {pending}
      </Link>
    </li>
  );
};

const Instances = ({ model }) => (
  <div className="instances">
    <ul className="nav flex-column">
      {model.instances.map((i) =>
        <Instance key={i.key} isCurrent={model.current && model.current.key === i.key} {...i} />)}
    </ul>
  </div>
);

Instances.propTypes = {
  model: PropTypes.object,
};

export default Instances;
