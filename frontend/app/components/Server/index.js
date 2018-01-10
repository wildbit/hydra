/**
*
* Server
*
*/

import React from 'react';
import Slider from 'components/Slider';
import Switch from 'components/Switch';

const Server = ({ server, onStatusChanged, onWeightChanged }) => {
  return (
    <tr
      className={server.status.toLowerCase() === 'up' ? 'table-success' : 'table-danger'}
      data-proxy-id={server.proxy_id}
      data-server-id={server.service_id}
    >
      <td className="text-capitalize">{server.status}</td>
      <td>{server.service_name}</td>
      <td><Slider onChange={onWeightChanged} value={server.weight} /></td>
      <td><Switch onChange={onStatusChanged} checked={server.status.toLowerCase() === 'up'} /></td>
    </tr>
  );
}


export default Server;
