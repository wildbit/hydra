/**
*
* Proxy
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'components/Icon';
import { Listeners } from 'components/Listener';

const ProxyContainer = styled.div`
  border-radius: 5px;
  margin-bottom: 1em;
  background-color: #FFF;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0,.07);
`;

const Title = styled.h4`
  font-size: 20px;
  margin: 1.5rem;
`;

function getIconType(model) {
  //if the model is a listener, then let's indicate that right away.
  if (model.is_listener) { return { name: "arrows-h", title: `Listener (Frontend + Backends) - ${model.status} `}; }
  else if (model.is_simple_frontend) { return { name: "long-arrow-right", title: "Frontend" }; }
  else if (model.is_simple_backend) { return { name: "long-arrow-left", title: "Backend" }; }
}

function getStatusIndicator(model) {
  switch (model.normalized_status) {
    case 'available': return 'text-success';
    case 'down': return 'text-danger';
    case 'other': return 'text-warning';
    default: return '';
  }
}

// const BlankState = styled.p`
//   padding: 0 1.5rem 1rem;
//   text-align: center;
//   color: #afb2bb;
// `;


// const NullServers = ({ simple_frontend }) => {
//   return (
//     <BlankState hidden={simple_frontend} >
//       <Icon name="server" /><br/>No servers found
//     </BlankState>
//   );
// };

const Proxy = ({ model, children }) => {
  let icon = getIconType(model);

  return (
    <ProxyContainer>
      <Title>
      <Icon name={icon.name} title={icon.title} className={getStatusIndicator(model)} />&nbsp;
        {model.name} <span className="badge-count">{model.servers.length}</span></Title>
      <Listeners listeners={ model.listeners } />
      {children}
    </ProxyContainer>
  );
}

Proxy.propTypes = {
  name: PropTypes.string,
};

export default Proxy;
