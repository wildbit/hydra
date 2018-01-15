/**
*
* Servers
*
*/

import React from 'react';
import { branch, compose, renderComponent } from 'recompose';
import styled from 'styled-components';
import { Icon } from 'components/Icon';

const BlankState = styled.p`
  padding: 0 1.5rem 1rem;
  text-align: center;
  color: #afb2bb;
`;


const NullServers = ({ simple_frontend }) => {
  return (
    <BlankState hidden={simple_frontend} >
      <Icon name="server" /><br/>No servers found
    </BlankState>
  );
};

const Servers = ({ children }) => (
  <table className="table server-table">
    <thead>
      <tr>
        <th>Server</th>
        <th className="text-center">Current Sessions</th>
        {/* <th className="text-center">Status</th> */}
        <th className="text-center">Downtime</th>
        <th className="text-center">Weight</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {children}
    </tbody>
  </table>
);



const enhance = compose(
  branch(
    ({ children }) => children.length === 0,
    renderComponent(NullServers)
  )
);

export default enhance(Servers);
