/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Proxy from 'components/Proxy';
import ServerList from 'components/Servers';
import Server from 'components/Server';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.state = {
      proxies: {
        'frontend-1': {
          id: 'frontend-1',
          name: 'Frontend 1',
          servers: {}
        },
        'frontend-2': {
          id: 'frontend-2',
          name: 'Frontend 2',
          servers: {},
        },
        'backend-1': {
          id: 'backend-1',
          name: 'Backend 1',
          servers: {
            'p-pm-open01': {
              name: 'p-pm-open01',
              status: 'up',
              weight: '100',
            },
            'p-pm-open02': {
              name: 'p-pm-open02',
              status: 'up',
              weight: '100',
            },
            'p-pm-open03': {
              name: 'p-pm-open03',
              status: 'down',
              weight: '0',
            },
          }
        }
      }
    };
  }

  mapProxyToComponent = (proxy) => {
    const { servers } = proxy;
    return (
      <Proxy name={proxy.name} key={proxy.name}>
        <ServerList>
          {Object.keys(servers).map(server => this.mapServerToComponent({ proxy, server: servers[server] }))}
        </ServerList>
      </Proxy>
    )
  }

  mapServerToComponent = ({ proxy, server }) => {
    return (
      <Server
        key={[proxy.id, server.name].join('+')}
        onStatusChanged={this.handleOnStatusChanged}
        onWeightChanged={this.handleOnWeightChanged}
        proxyId={proxy.id}
        {...server}
      />
    );
  }

  changeWeight = ({ proxyId, serverId, weight }) => {
    let { proxies } = this.state;

    if (weight === '0') {
      proxies[proxyId].servers[serverId].status = 'down';
    } else {
      proxies[proxyId].servers[serverId].status = 'up';
    }

    proxies[proxyId].servers[serverId].weight = weight;

    this.setState({ proxies }, () => {
      console.log(`${serverId} weight changed to ${weight}`);
    })
  }

  handleOnWeightChanged = (event) => {
    let $server = $(ReactDOM.findDOMNode(event.target)).parents('tr');

    this.changeWeight({
      proxyId: $server.data('proxy-id'),
      serverId: $server.data('server-id'),
      weight: event.target.value
    });
  }

  handleOnStatusChanged = (event) => {
    let $server = $(ReactDOM.findDOMNode(event.target)).parents('tr');

    this.changeWeight({
      proxyId: $server.data('proxy-id'),
      serverId: $server.data('server-id'),
      weight: event.target.checked ? '100' : '0'
    });
  }

  render() {
    let { proxies } = this.state;

    return (
      <div>
        {Object.keys(proxies).map(proxy => this.mapProxyToComponent(proxies[proxy]))}
      </div>
    );
  }
}
