/**
*
* Helpers
*
*/

import React from 'react';
import { branch, compose, renderComponent } from 'recompose';
import { Icon } from 'components/Icon';

const ListenerIcon = ({ model, ...rest }) =>
  (<Icon name="arrows-h" title={`Listener (Frontend + Backend) - ${model.status}`} {...rest} />);

const FrontendIcon = ({ model, ...rest }) =>
  (<Icon name="long-arrow-right" title={`Frontend - ${model.status}`} {...rest} />);

const BackendIcon = ({ model, ...rest }) =>
  (<Icon name="long-arrow-left" title={`Backend - ${model.status}`} {...rest} />);

export const ProxyIcon = compose(
  branch(
    ({ model }) => model.is_listener,
    renderComponent(ListenerIcon),
  ),
  branch(
    ({ model }) => model.is_simple_frontend,
    renderComponent(FrontendIcon)
  ),
)(BackendIcon);
