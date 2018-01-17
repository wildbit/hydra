/**
*
* Icons
*
*/

import React from 'react';
import { branch, compose, renderComponent, renderNothing } from 'recompose';
import { Icon } from 'components/Icon';

const Badge = (props) => {
  let { background, color, children, ...rest } = props;
  return (
    <span className={`pull-right badge badge-pill ${background}-${color} border border-${color}`}>
      {children}
    </span>
  );
}

const SelectedBadge = (props) =>
  (<Badge background="badge" {...props} />);

const UnSelectedBadge = (props) =>
  (<Badge background="text" {...props} />);

const IsCurrentBadge = branch(
  ({ isCurrent }) => isCurrent,
  renderComponent(SelectedBadge),
  renderComponent(UnSelectedBadge)
)(Badge);

const SuccessBadge = (props) =>
  (<IsCurrentBadge color="success" {...props} />);

const WarningBadge = (props) =>
  (<IsCurrentBadge color="warning" {...props} />);

export const ProxyBadge = compose(
  branch(
    ({ proxies }) => proxies && proxies.length === 0,
    renderNothing
  ),
  branch(
    ({ proxies }) => {
        return proxies &&
        proxies.filter(proxy =>  proxy.normalized_status === 'available').length === proxies.length;
    },
    renderComponent(SuccessBadge),
    renderComponent(WarningBadge)
  )
)(IsCurrentBadge);

const ConnectionIcon = ({ status }) =>
  (<Icon className={`instance-state ${status}`} name="circle" />)

const Connected = () =>
  (<ConnectionIcon status="connected" />);

const Disconnected = () =>
  (<ConnectionIcon status="disconnected" />);

export const Connection = branch(
  ({ is_available }) => is_available,
  renderComponent(Connected),
  renderComponent(Disconnected)
)(ConnectionIcon);

const PendingIcon = () =>
  (<Icon className="text-primary" name="circle-o-notch" spin />);

export const Pending = branch(
  ({ has_loaded, is_available }) => !has_loaded && is_available === null,
  renderComponent(PendingIcon),
  renderNothing
)(PendingIcon);
