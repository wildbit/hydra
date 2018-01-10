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
import { Link } from 'react-router-dom';
import { Icon } from 'components/Icon';

const Layout = ({ children, hideSidebar, model, onInstanceCreated }) => {
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
            </div>
          </Sidebar>
          <View>
            {children}

            <footer className="text-muted small text-center">
              &copy; Wildbit, LLC { new Date().getFullYear() }
            </footer>
          </View>
          <CreateInstance id="create-instance" onSubmit={onInstanceCreated} />
        </div>
      </main>
    </div>
  );
}

export default Layout;
