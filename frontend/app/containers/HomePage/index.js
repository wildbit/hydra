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

import Layout from 'containers/Layout';
import Proxy from 'components/Proxy';
import RemoveInstance from 'components/Instances/Remove'
import ServerList from 'components/Servers';
import Server from 'components/Server';
import { Icon } from 'components/Icon';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { instances: [], current: null };
  }

  componentDidMount() {
    Store.instance.RegisterListener(this, (instances) => {
      this.refresh(instances);
    });

    this.refresh(Store.instance.List());
  }

  componentWillReceiveProps(nextProps) {
    this.setCurrent(nextProps);
  }

  componentWillUnmount() {
    Store.instance.UnregisterListener(this);
  }

  refresh = (instances) => {
    this.setState({ instances: instances }, ()  => {
      this.setCurrent();
    });
  }

  setCurrent = (nextProps) => {
    let { instances }  = this.state;
    let { params } = (nextProps || this.props).match;
    let current = (!params.key) ? instances[0] : instances.find(i => i.display_name === params.key)

    this.setState({ current });
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

  handleOnInstanceRemoved = (instance, callback) => {
    Store.instance.Remove(instance);
    callback();
  }

  handleOnWeightChanged = ({ server, weight }) => {
    server.SetWeight(weight);
  }

  handleOnStatusChanged = ({ server, status }) => {
    console.log(server.proxy.name, server.service_name, 'change status', 'from', server.status, 'to', status);
    server.SetStatus(status);
  }

  renderStatusIcon = () => {
    let status = this.state.current.is_available ? 'Online' : 'Offline';
    return (
      <span className={`instance-state-label ${status.toLowerCase()}`}>
        <Icon className={`instance-state instance-state--title ${status.toLowerCase()}`}
              name="circle" />
        {status}
     </span>
    )
  }

  render() {
    let { current } = this.state;

    if (!current) {
      return (
        <Layout {...this.props}>
          <p>No HAProxy Instance Selected. Please select one from the list on the left.</p>
        </Layout>
      );
    }

    return (
      <Layout {...this.props}>
        <h2>
          <span>{current.display_name}</span>
          {this.renderStatusIcon()}
          <button
            type="button"
            className="btn btn-light text-danger pull-right"
            data-toggle="modal"
            disabled={!current}
            data-target="#remove-instance">
            <Icon name="trash-o" /> Remove
          </button>
        </h2>
        {current.proxies.map((proxy) => this.mapProxyToComponent(proxy))}
        <RemoveInstance id="remove-instance" onClick={this.handleOnInstanceRemoved} current={current} />
      </Layout>
    );
  }
}
