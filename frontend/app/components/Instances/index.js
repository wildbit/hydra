/**
*
* Instances
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Instance = (i) => {
  let indicator = <span>&nbsp;</span>;
  if (!i.is_available) {
    indicator = <span className="text-warning">offline!</span>;
  }
  return (
    <li className="list-group-item list-group-item-action" >
      {indicator}
      <Link className={i.isCurrent ? 'text-success' : ''} to={`/${i.display_name}`}><span>{i.display_name}</span></Link>{i.has_loaded ? '' : ' (pending)'}
    </li>
  );
};

const Instances = ({ model }) => (
  <div className="instances">
    <ul className="list-group">
      {model.instances.map((i) =>
        <Instance key={i.key} isCurrent={model.current && model.current.key === i.key} {...i} />)}
    </ul>
  </div>
);

Instances.propTypes = {
  model: PropTypes.object,
};

export default Instances;
