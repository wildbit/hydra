/**
*
* Server
*
*/

import React from 'react';
import Weight from 'components/Weight';
import { Icon } from 'components/Icon';
import Status from 'components/Status';

import { Up } from 'utils/Server';

const Server = ({ server, onStatusChanged, onWeightChanged }) => {
  let status = <Icon className={`instance-state ${Up.indexOf(server.status.toLowerCase()) !== -1 ? 'online': 'offline'}`}
                     name="circle" />

  console.log('SERVER -', server.proxy.name, server.service_name, 'status', server.status.toLowerCase());

  return (
    <tr>
      <td>
        <span data-toggle="tooltip" data-placement="top" title="Tooltip on top">
          {status}{server.service_name}
        </span>
      </td>
      <td><Weight onChange={onWeightChanged} server={server} /></td>
      <td><Status onChange={onStatusChanged} server={server} /></td>
    </tr>
  );
}

export default Server;
