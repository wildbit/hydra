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

const Server = ({ proxyId, name, status, weight, onStatusChanged, onWeightChanged }) => {
  return (
    <tr className={status == 'up' ? 'table-success' : 'table-danger'} data-proxy-id={proxyId} data-server-id={name}>
      <td className="text-capitalize">{status}</td>
      <td>{name}</td>
      <td><Slider onChange={onWeightChanged} value={weight} /></td>
      <td><Switch onChange={onStatusChanged} checked={status === 'up'} /></td>
    </tr>
  );
}

Server.propTypes = {
  proxyId: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.string,
  weight: PropTypes.string,
  onStatusChanged: PropTypes.func,
  onWeightChanged: PropTypes.func
};

export default Server;
