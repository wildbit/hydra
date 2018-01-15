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
      <Proxy model={proxy} key={proxy.key}>
        <ServerList simple_frontend={ proxy.is_simple_frontend }>
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
    server.SetStatus(status);
  }

  renderStatusIcon = () => {
    let status = this.state.current.is_available ? 'Connected' : 'Disconnected';
    return (
      <span className={`instance-state-label ${status.toLowerCase()}`}>
        <Icon className={`instance-state instance-state--title ${status.toLowerCase()}`}
              name="circle" />
        {status}
     </span>
    )
  }

  render() {
    let { current, instances } = this.state;

    if (instances.length == 0) {
      return (
        <Layout {...this.props} hideSidebar={true}>
          <br/>  
          <div className="container text-center card alert-secondary alert">
            <div className="">
              <p>
              This interface has not been configured to manage any HAProxy instances.
              </p>
              <button
                type="button"
                className="btn btn-success"
                data-toggle="modal"
                data-target="#create-instance">
                <Icon name="plus-circle" /> Add HAProxy Instance
              </button>
            </div>  
          </div>  
        </Layout>
      );  
    }
    else if (!current) {
      return (
        <Layout {...this.props}>
          <div className="text-center">
             To view details, select one of the instances from the sidebar.
          </div>
        </Layout>
      );
    }

    let availableState;
    if (!current.is_available && current.last_update == null) {
      availableState = <div className="alert alert-warning text-center">
        <strong><Icon name="chain-broken"/> We haven't been able to connect to this HAProxy instance yet.</strong><br/>
        Perhaps you need to start a VPN connection or open up an SSH Tunnel to the server?
      </div>;
    } else {
      availableState = current.proxies.map((proxy) => this.mapProxyToComponent(proxy));
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
        <div className="last-updated-label text-muted small">Updated: {current.last_update || 'Never'}<br /><br /></div>
        {availableState}
        <RemoveInstance id="remove-instance" onClick={this.handleOnInstanceRemoved} current={current} />
      </Layout>
    );
  }
}
