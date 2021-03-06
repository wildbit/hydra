/**
 *
 * Layout
 *
 */

import React from 'react';

import Store from 'models/Store.ts'

import Header from 'components/Menu/Header';
import Sidebar from 'components/Menu/Sidebar';
import View from 'components/View';
import Instances from 'components/Instances';
import Form from 'components/Instances/Form'
import GithubCommit from 'components/GithubCommit';
import { Link } from 'react-router-dom';
import { Icon } from 'components/Icon';

export default class Layout extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
    this.setState({ instances }, ()  => {
      this.setCurrent(this.props);
    });
  }

  setCurrent = (props) => {
    let { instances }  = this.state;
    let { params } = props.match;
    let current = (!params.key) ? instances[0] : instances.find(i => i.display_name === params.key)

    this.setState({ current });
  }

  handleOnInstanceCreated = (instance, callback) => {
    let newInstance = Store.instance.Add(instance.url, instance.name, instance.username, instance.password);

    if (newInstance) {
      callback();
    }
  }

  render() {
    let { current } = this.state;
    const { children, hideSidebar } = this.props;

    return (
      <div>
        <Header>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/about">About</Link>
            </li>
          </ul>
        </Header>
        <main role="main" className="container-fluid">
          <div className="row flex-xl-nowrap">
            <Sidebar hidden={hideSidebar}>
              <Instances {...this.state} />
              <div className="controls">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  data-toggle="modal"
                  data-target="#create-instance">
                  <Icon name="plus-circle" /> HAProxy Instance
                </button>
              </div>
            </Sidebar>
            <View fullScreen={hideSidebar} >
              {children}
              <footer className="text-muted small text-center">
                &copy; Wildbit, LLC { new Date().getFullYear() }
                <span className="pull-right">
                  <GithubCommit {...process.env} />
                </span>
              </footer>
            </View>
            <Form
              id="create-instance"
              title="Add HAProxy Instance"
              onSubmit={this.handleOnInstanceCreated} />
          </div>
        </main>
      </div>
    );
  }
}
