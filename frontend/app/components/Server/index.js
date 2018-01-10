/**
*
* Server
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Slider from 'components/Slider';
import Switch from 'components/Switch';

const Server = ({ server, onStatusChanged, onWeightChanged }) => {
  return (
    <tr className={server.status.toLowerCase() == 'up' ? 'table-success' : 'table-danger'} data-proxy-id={server.proxy.id} data-server-id={server.service_name}>
      <td className="text-capitalize">{server.status}</td>
      <td>{server.service_name}</td>
      <td><Slider onChange={onWeightChanged} value={server.weight} /></td>
      <td><Switch onChange={onStatusChanged} checked={server.status.toLowerCase() === 'up'} /></td>
    </tr>
  );
}

// Server.propTypes = {
//   proxyId: PropTypes.string,
//   name: PropTypes.string,
//   status: PropTypes.string,
//   weight: PropTypes.string,
//   onStatusChanged: PropTypes.func,
//   onWeightChanged: PropTypes.func
// };

export default Server;
