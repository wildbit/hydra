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
import $ from 'jquery';

import Store from 'models/Store.ts'
import { HAProxyInstance } from 'models/HAProxy.ts';

import Layout from 'components/Layout';
import Proxy from 'components/Proxy';
import ServerList from 'components/Servers';
import Server from 'components/Server';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { instances: {}, current: { proxies: {} } };
  }

  componentDidMount() {
    this.refresher = setInterval(this.refresh, 60000);
    this.setInitialState();
  }

  componentWillUnmount() {
    clearInterval(this.refresher);
  }

  setInitialState = () => {
    let { instances, current } = this.state;
    let { params } = this.props.match;

    Store.instance.List().forEach((haProxy, i) => {
      let { id, display_name } = haProxy;
      instances[id] = { name: display_name, haProxy, proxies: {} };

      if (params.id === display_name || i === 0) {
        current = instances[id];
      }
    });

    this.setState({ instances, current }, () => {
      this.refresh();
    });
  }

  refresh = () => {
    let { instances, current } = this.state;
    
    current.haProxy
      .Proxies()
      .then(proxies => {
        current.proxies = this.mapProxiesToState(proxies);
        this.setState({ current });
      })
      .catch(error => {
        console.log(`${current.name} - FETCHING PROXIES FAILED`, error);
        current.proxies = {};
        this.setState({ current });
      });

    Object.keys(instances).forEach(id => {
      if (instances[id] !== current) {
        let haProxy = new HAProxyInstance(instances[id].haProxy);

        haProxy
          .Proxies()
          .then(proxies => {
            instances[id].proxies = this.mapProxiesToState(proxies);
            this.setState({ instances });
          })
          .catch(error => {
            instances[id].proxies = {};
            this.setState({ instances });
            console.log(`${instance.name} - FETCHING PROXIES FAILED`, error);
          });
      }
    });
  }

  mapProxiesToState = (proxies) => {
    let proxy = {};

    proxies.forEach(p => {
      let servers = {};

      p.servers.forEach(s => {
        servers[s.full_server_name] = {
          name: s.full_server_name,
          weight: s.weight,
          active: s.is_active,
          self: s
        }
      });

      proxy[p.name] = { id: p.name, name: p.name, servers };
    });

    return proxy;
  }

  mapProxyToComponent = (proxy) => {
    const { servers } = proxy;
    let serverIds = Object.keys(servers);
    return (
      <Proxy name={proxy.name} key={proxy.name}>
        <ServerList>
          {serverIds.map(server => this.mapServerToComponent({ proxy, server: servers[server] }))}
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

  handleOnInstanceCreated = (instance, callback) => {
    if (Store.instance.Add(instance.url, instance.name, instance.username, instance.password)) {
      callback();
      this.refresh();
    }
  }

  changeWeight = ({ proxyId, serverId, weight }) => {
    let { current } = this.state;
    let server = current.proxies[proxyId].servers[serverId].self;

    server
      .SetWeight(parseInt(weight))
      .then(() => {
        current.proxies[proxyId].servers[serverId].weight = weight;
      })
      .catch(error => {
        console.log(`${serverId} - SET WEIGHT FAILED`, error);
      });

    this.setState({ current }, () => {
      console.log(`${serverId} weight changed to ${weight}`);
    })
  }

  handleOnWeightChanged = (event) => {
    let $server = $(event.target).parents('tr');

    this.changeWeight({
      proxyId: $server.data('proxy-id'),
      serverId: $server.data('server-id'),
      weight: event.target.value
    });
  }

  handleOnStatusChanged = (event) => {
    let $server = $(event.target).parents('tr');

    this.changeWeight({
      proxyId: $server.data('proxy-id'),
      serverId: $server.data('server-id'),
      weight: event.target.checked ? '100' : '0'
    });
  }

  render() {
    let { instances, current } = this.state;
    let { proxies } = current;
    let proxyIds = Object.keys(proxies);

    if (proxyIds.length === 0) {
      return (
        <Layout instances={instances} onInstanceCreated={this.handleOnInstanceCreated}>
          <p>No proxies found</p>
        </Layout>
      );
    }

    return (
      <Layout instances={instances} onInstanceCreated={this.handleOnInstanceCreated}>
        {proxyIds.map(id => this.mapProxyToComponent(proxies[id]))}
      </Layout>
    );
  }
}
