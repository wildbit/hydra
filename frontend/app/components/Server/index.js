/**
*
* Server
*
*/

import React from 'react';
import Weight from 'components/Weight';
import { Icon } from 'components/Icon';
import Status from 'components/Status';

const Server = ({ server, onStatusChanged, onWeightChanged }) => {
  let statusIndicator = <Icon className={`instance-state ${server.status.toLowerCase() === 'up' ? 'online': 'offline'}`}
                     name="circle" />

  return (
    <tr
      data-proxy-id={server.proxy_id}
      data-server-id={server.service_id}>
      <td>
        <span data-toggle="tooltip" data-placement="top" title="Tooltip on top">
          {statusIndicator} { server.status } {server.service_name}
        </span>
      </td>
      <td><Weight onChange={onWeightChanged} server={server} /></td>
      <td><Status onChange={onStatusChanged} server={server} /></td>
    </tr>
  );
}

export default Server;
