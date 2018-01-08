/**
 *
 * Layout
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Menu/Header';
import Sidebar from 'components/Menu/Sidebar';
import View from 'components/View';
import Instances from 'components/Instances';
import CreateInstance from 'components/Instances/Create'
import Store from '../../models/Store.ts'

export class Layout extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      instances: {
        'p-pm-proxy01': {
          name: 'p-pm-proxy01',
          url:  'http://localhost:10000',
          username: 'user',
          password: 'password',
        },
        'p-pm-proxy02': {
          name: 'p-pm-proxy02',
          url: 'http://localhost:9000',
          username: 'user',
          password: 'password'
        },
      }
    };
  }

  handleOnCreateInstance = (instance) => {
    let { instances } = this.state;
    instances[instance.name] = instance

    this.setState(instances, () => {
      Store.instance.Add(instance.url, instance.name, instance.password);
    });
  }

  render() {
    let { instances } = this.state;

    return (
      <div>
        <Header>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/about">About</a>
            </li>
          </ul>
        </Header>
        <main role="main" className="container">
          <div className="row">
            <Sidebar className="col-md-3">
              <Instances instances={instances} />
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                data-toggle="modal"
                data-target="#create-instance">
                Add Instance
              </button>
            </Sidebar>
            <View className="col-md-9">
              {this.props.children}
            </View>
            <CreateInstance id="create-instance" onSubmit={this.handleOnCreateInstance} />
          </div>
        </main>
        <footer className="text-center text-muted small">
          Wildbit, LLC &copy; { new Date().getFullYear() }
        </footer>
      </div>
    );
  }
}

Layout.propTypes = {
};

export default Layout;
