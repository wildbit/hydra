/**
*
* Instances
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'components/Icon';
import { Connection, Pending, ProxyBadge } from 'components/Instances/Icons';

const Instance = (haProxy) => {
  let { proxies } = haProxy
  let available = proxies.filter(proxy => proxy.normalized_status === 'available');

  return (
    <li className="nav-item">
      <Link className={`nav-link instance-item ${haProxy.isCurrent ? 'disabled' : ''}`}
        to={`/${haProxy.display_name}`}>
        <Connection {...haProxy} />
        <span>{haProxy.display_name}</span>
        &nbsp;<Pending {...haProxy} />
        <ProxyBadge {...haProxy}>{available.length}/{proxies.length}</ProxyBadge>
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
