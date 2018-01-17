/**
*
* Listener
*
*/

import React from 'react';
import { Icon } from 'components/Icon';

function getStatus(status) {
  if (/^(up)|(open)/i.test(status)) return 'text-success';
  if (/^drain/i.test(status)) return 'text-info';
  if (/^down/i.test(status)) return 'text-danger';
  if (/^maint/i.test(status)) return 'text-warning';
  return 'text-muted';
}


const Listener = ({ listener }) => {
  const statusIndicator = (<Icon
    className={`instance-state ${getStatus(listener.status)}`}
    name="circle"
    title={listener.status}
  />);
  return (
    <tr>
      <td>
        <span>{statusIndicator} {listener.service_name}</span>
      </td>
      <td>{listener.mode}</td>
      <td>{listener.current_sessions}</td>
    </tr>
  );
};

const Listeners = ({ listeners }) => {
  if (listeners.length == 0) { return null; }
  return (
    <table className='table listener-table' >
      <thead>
        <tr><th>Listener</th><th>Mode</th><th>Current Sessions</th></tr>
      </thead>
      <tbody>
        {listeners.map((k) => <Listener key={k.key} listener={k} />)}
      </tbody>
    </table>
  );
};

export { Listener, Listeners };

