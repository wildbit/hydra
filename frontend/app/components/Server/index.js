/**
*
* Server
*
*/

import React from 'react';
import Weight from 'components/Weight';
import { Icon } from 'components/Icon';
import Status from 'components/Status';

function getStatus(status) {
  if (/^up/i.test(status)) return 'text-success';
  if (/^drain/i.test(status)) return 'text-info';
  if (/^down/i.test(status)) return 'text-danger';
  if (/^maint/i.test(status)) return 'text-warning';
  return 'text-muted';
}

const Server = ({ server, onStatusChanged, onWeightChanged }) => {
  let statusIndicator = <Icon className={`instance-state ${getStatus(server.status)}`}
                     name="circle" title={ server.status } />

  return (
    <tr
      data-proxy-id={server.proxy_id}
      data-server-id={server.service_id}>
      <td>
        <span>{statusIndicator} {server.service_name}</span>
      </td>
      <td className="text-center">{server.current_sessions}</td>
      <td className="text-center"><Weight onChange={onWeightChanged} server={server} /></td>
      <td className="text-right"><Status onChange={onStatusChanged} server={server} /></td>
    </tr>
  );
}

export default Server;
