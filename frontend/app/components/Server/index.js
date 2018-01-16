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

function humanTimeDuration(duration) {
    if (!duration) { return 'None';}
    var sec_num = parseInt(duration, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

const Server = ({ server, onStatusChanged, onWeightChanged }) => {
  let statusIndicator = <Icon className={`instance-state ${getStatus(server.status)}`}
                     name="circle" title={ server.status } />

  return (
    <tr>
      <td>
        <span>{statusIndicator} {server.service_name}</span>
      </td>
      <td className="text-center" title={`Seconds since last request: ${server.last_request}`} >{server.current_sessions}</td>
      {/* <td className="text-center">{humanTimeDuration(server.last_status_change)}<br/>{server.status}</td> */}
      <td className="text-center">{humanTimeDuration(server.downtime)}</td>
      <td className="text-center"><Weight onChange={onWeightChanged} server={server} /></td>
      <td className="text-right"><Status onChange={onStatusChanged} server={server} /></td>
    </tr>
  );
}

export default Server;
