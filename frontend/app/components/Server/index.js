/**
*
* Server
*
*/

import React from 'react';
import Slider from 'components/Slider';
import { Icon } from 'components/Icon';
import Status from 'components/Status';

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
      <td><Status onChange={onStatusChanged} server={server} /></td>
    </tr>
  );
}

export default Server;
