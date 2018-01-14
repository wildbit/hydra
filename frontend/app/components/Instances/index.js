/**
*
* Instances
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';

const Instance = (i) => {
  let pending = '';
  if (!i.has_loaded && i.is_available === null) {
    pending = <Icon className="text-primary" name="circle-o-notch" spin />;
  }

  let count = '';
  if (i.has_loaded) {
    var availableProxies = i.proxies.filter(f => f.normalized_status == 'available').length;
    var totalProxies = i.proxies.length;
    let coloring = availableProxies == totalProxies ? 'success' : 'warning';
    let classes = 'pull-right badge badge-pill'
    if (i.isCurrent) { classes = `${classes} badge-${coloring}`; }
    else { classes = `${classes} text-${coloring} border-${coloring} border border-${coloring}`; }
    count = <span className={classes} tooltip='Proxies Available'>{availableProxies}/{totalProxies}</span>
  }
  return (
    <li className="nav-item" >
      <Link className={`nav-link instance-item ${i.isCurrent ? 'disabled' : ''}`} to={`/${i.display_name}`}>
        <Icon className={`instance-state ${i.is_available ? 'connected': 'disconnected'}`} name="circle" />
        <span>{i.display_name}</span>
        &nbsp;{pending}
        {count}
      </Link>
    </li>
  );
};

const Instances = ({ instances, current }) => (
  <div className="instances">
    <ul className="nav flex-column">
      {
        instances.map((i) => <Instance key={i.key} isCurrent={current && current.key === i.key} {...i} />)
      }
    </ul>
  </div>
);

Instances.propTypes = {
  instances: PropTypes.array,
  current: PropTypes.object
};

export default Instances;
