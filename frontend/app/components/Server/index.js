/**
*
* Server
*
*/

import React from 'react';
import Slider from 'components/Slider';
import Switch from 'components/Switch';
import { Icon } from 'components/Icon';

const Server = ({ server, onStatusChanged, onWeightChanged }) => {
  let status = <Icon className={`instance-state ${server.status.toLowerCase() === 'up' ? 'online': 'offline'}`}
                     name="circle" />
  return (
    <tr
      data-proxy-id={server.proxy_id}
      data-server-id={server.service_id}
    >
      <td>
        <span data-toggle="tooltip" data-placement="top" title="Tooltip on top">
          {status}{server.service_name}
        </span>
      </td>
      <td><Slider onChange={onWeightChanged} value={server.weight} /></td>
      <td><Switch onChange={onStatusChanged} checked={server.status.toLowerCase() === 'up'} /></td>
    </tr>
  );
}


export default Server;
