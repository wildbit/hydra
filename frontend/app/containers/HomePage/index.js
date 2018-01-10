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

import Layout from 'components/Layout';
import Proxy from 'components/Proxy';
import ServerList from 'components/Servers';
import Server from 'components/Server';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { instances: [], current: null };
  }

  componentDidMount() {
    Store.instance.RegisterListener(this, (updatedModels) => {
      let { instances, current } = this.state;
      instances = updatedModels;
      current = current || instances[0];
      this.setState({ instances, current });
    });
  }

  componentWillUnmount() {
    Store.instance.UnregisterListener(this);
  }

  mapProxyToComponent = (proxy) => {
    return (
      <Proxy name={proxy.name} key={proxy.key}>
        <ServerList>
          {proxy.servers.map(server => this.mapServerToComponent(server))}
        </ServerList>
      </Proxy>
    )
  }

  mapServerToComponent = (server) => {
    return (
      <Server
        key={server.key}
        onStatusChanged={this.handleOnStatusChanged}
        onWeightChanged={this.handleOnWeightChanged}
        server={server}
      />
    );
  }

  handleOnInstanceCreated = (instance, callback) => {
    let newInstance = Store.instance
      .Add(instance.url, instance.name, instance.username, instance.password);
    if (newInstance) {
      callback();
    }
  }

  changeWeight = ({ proxyId, serverId, weight }) => {
    // let { current } = this.state;
    // let server = current.proxies[proxyId].servers[serverId].self;

    // server
    //   .SetWeight(parseInt(weight))
    //   .then(() => {
    //     current.proxies[proxyId].servers[serverId].weight = weight;
    //   })
    //   .catch(error => {
    //     console.log(`${serverId} - SET WEIGHT FAILED`, error);
    //   });

    // this.setState({ current }, () => {
    //   console.log(`${serverId} weight changed to ${weight}`);
    // })
  }

  handleOnWeightChanged = (event) => {
    // let $server = $(event.target).parents('tr');

    // this.changeWeight({
    //   proxyId: $server.data('proxy-id'),
    //   serverId: $server.data('server-id'),
    //   weight: event.target.value
    // });
  }

  handleOnStatusChanged = (event) => {
    // let $server = $(event.target).parents('tr');

    // this.changeWeight({
    //   proxyId: $server.data('proxy-id'),
    //   serverId: $server.data('server-id'),
    //   weight: event.target.checked ? '100' : '0'
    // });
  }

  render() {
    if (!this.state.current) {
      return (
        <Layout model={this.state} onInstanceCreated={this.handleOnInstanceCreated}>
          <p>No HAProxy Instance Selected. Please select one from the list on the left.</p>
        </Layout>
      );
    }

    else {
      return (
        <Layout model={this.state} onInstanceCreated={this.handleOnInstanceCreated}>
          { this.state.current.proxies.map((proxy) => this.mapProxyToComponent(proxy)) }
        </Layout>
      );
    }  
  }
}