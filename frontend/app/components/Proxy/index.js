/**
*
* Proxy
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'components/Icon';

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
  if (model.is_listener) { return { name: "arrows-h", title: "Listener (Frontend + Backends)" }; }
  else if (model.is_simple_frontend) { return { name: "long-arrow-right", title: "Frontend" }; }
  else if (model.is_simple_backend) { return { name: "long-arrow-left", title: "Backend" }; }
}

const Proxy = ({ model, children }) => {
  let icon = getIconType(model);
  return (
    <ProxyContainer>
      <Title>
        <Icon name={icon.name} title={icon.title} className="text-muted" />&nbsp;
        {model.name} <span className="badge-count">{children.props.children.length}</span></Title>
      <ul>
        <li>Status: {model.status}</li>
        <li>Current Sessions: {model.current_sessions}</li>
        <li>Max Sessions: {model.max_sessions}</li>
      </ul>
      {children}
    </ProxyContainer>
  );
}

Proxy.propTypes = {
  name: PropTypes.string,
};

export default Proxy;
