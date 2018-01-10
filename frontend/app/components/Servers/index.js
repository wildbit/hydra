/**
*
* Servers
*
*/

import React from 'react';
import { branch, compose, renderComponent } from 'recompose';

// import styled from 'styled-components';


const NullServers = () => {
  return (
    <p>No servers found</p>
  );
};

const Servers = ({ children }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Status</th>
        <th>Server</th>
        <th>Weight</th>
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
