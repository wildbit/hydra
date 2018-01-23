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
import { Redirect } from 'react-router-dom';
import $ from 'jquery';

import Store from 'models/Store.ts'

import Layout from 'containers/Layout';
import Proxy from 'components/Proxy';
import ServerList from 'components/Servers';
import Server from 'components/Server';
import Form from 'components/Instances/Form'
import Remove from 'components/Instances/Remove'
import { Icon } from 'components/Icon';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { instances: [], current: null, redirect: null };
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
    this.setState({ instances }, ()  => {
      this.setCurrent(this.props);
    });
  }

  setCurrent = (props) => {
    let { instances, redirect }  = this.state;
    let { params, url } = props.match;
    let current = (!params.key) ? instances[0] : instances.find(i => i.display_name === params.key)

    if (redirect) {
      redirect = null;
    }

    this.setState({ current, redirect });
  }

  mapProxyToComponent = (proxy) => {
    return (
      <Proxy model={proxy} key={proxy.key}>
        <ServerList simple_frontend={proxy.is_simple_frontend}>
          {proxy.servers.map(this.mapServerToComponent)}
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

  handleOnInstanceUpdated = (instance, callback) => {
    let { current } = this.state;
    let updated = Store.instance.Update(current, instance.url, instance.name, instance.username, instance.password);

    if (updated) {
      this.setState({ redirect: { pathname: `/ha-proxy/${instance.name}` } });
      callback();
    }
  }

  handleOnInstanceRemoved = (instance, callback) => {
    Store.instance.Remove(instance);
    this.setState({ redirect: { pathname: '/' } });
    callback();
  }

  handleOnWeightChanged = ({ server, weight }) => {
    server.SetWeight(weight);
  }

  handleOnStatusChanged = ({ server, status }) => {
    server.SetStatus(status);
  }

  renderRedirect = () => {
    let { redirect } = this.state;

    if (!redirect) {
      return null;
    }

    return (
      <Redirect to={redirect} />
    );
  }

  renderEmptyInstances = () => {
    let { instances } = this.state;

    if (instances.length > 0) {
      return null;
    }

    return (
      <div>
        <br/>
        <div className="container text-center card alert-secondary alert">
          <div>
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
      </div>
    );
  }

  renderUnavailableInstance = () => {
    let { current } = this.state;

    if (!current) {
      return null;
    }

    if (current.is_available) {
      return null;
    }

    return (
      <div className="alert alert-warning text-center">
        <strong><Icon name="chain-broken"/> We haven't been able to connect to this HAProxy instance yet.</strong><br/>
        Perhaps you need to start a VPN connection or open up an SSH Tunnel to the server?
      </div>
    );
  }

  renderProxies = () => {
    let { current } = this.state;

    if (!current) {
      return null;
    }

    return (
      <div>
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
          <button
            type="button"
            className="btn btn-light text-secondary pull-right"
            data-toggle="modal"
            disabled={!current}
            data-target="#update-instance">
            <Icon name="pencil" /> Edit
          </button>
        </h2>
        <div className="last-updated-label text-muted small">Updated: {current.last_update || 'Never'}<br /><br /></div>
        {this.renderUnavailableInstance()}
        {current.proxies.map(this.mapProxyToComponent)}
        <Form
          id="update-instance"
          title={`Update ${current.display_name}`}
          current={current}
          onSubmit={this.handleOnInstanceUpdated} />
        <Remove
          id="remove-instance"
          onClick={this.handleOnInstanceRemoved}
          current={current} />
      </div>
    );
  }

  renderStatusIcon = () => {
    let { current } = this.state;
    let status = current.is_available ? 'Connected' : 'Disconnected';

    return (
      <span className={`instance-state-label ${status.toLowerCase()}`}>
        <Icon
          className={`instance-state instance-state--title ${status.toLowerCase()}`}
          name="circle" />
        {status}
     </span>
    )
  }

  render() {
    let { current, instances, redirect } = this.state;

    return (
      <Layout {...this.props} hideSidebar={instances.length === 0}>
        {this.renderRedirect()}
        {this.renderEmptyInstances()}
        {this.renderProxies()}
      </Layout>
    );
  }
}
