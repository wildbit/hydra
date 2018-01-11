/**
 *
 * Layout
 *
 */

import React from 'react';
import Header from 'components/Menu/Header';
import Sidebar from 'components/Menu/Sidebar';
import View from 'components/View';
import Instances from 'components/Instances';
import CreateInstance from 'components/Instances/Create'
import RemoveInstance from 'components/Instances/Remove'
import { Link } from 'react-router-dom';
import { Icon } from 'components/Icon';

const Layout = ({ children, hideSidebar, model, onInstanceCreated, onInstanceRemoved }) => {
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
            <Instances model={ model } />
            <div className="controls">
              <button
                type="button"
                className="btn btn-primary btn-block"
                data-toggle="modal"
                data-target="#create-instance">
                <Icon name="plus-circle" /> HAProxy Instance
              </button>
              <button
                type="button"
                className="btn btn-danger btn-block"
                data-toggle="modal"
                style={{ "display": (!model.current) ? 'none': '' }}
                data-target="#remove-instance">
                <Icon name="minus-circle" /> HAProxy Instance
              </button>

            </div>
          </Sidebar>
          <View>
            {children}
            <footer className="text-muted small text-center">
              &copy; Wildbit, LLC { new Date().getFullYear() }
            </footer>
          </View>
          <CreateInstance id="create-instance" onSubmit={onInstanceCreated} />
          <RemoveInstance id="remove-instance" onClick={onInstanceRemoved} current={model.current} />
        </div>
      </main>
    </div>
  );
}

export default Layout;
