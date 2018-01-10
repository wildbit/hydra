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

const Layout = ({ children, hideSidebar, model, onInstanceCreated }) => {
  return (
    <div>
      <Header>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
              <a className="nav-link" href="/about">About</a>
          </li>
        </ul>
      </Header>
      <main role="main" className="container-fluid">
        <div className="row">
          <Sidebar hidden={hideSidebar}>
            <Instances model={ model } />
            <div className="controls">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                data-toggle="modal"
                data-target="#create-instance">
                + HAProxy Instance
              </button>
            </div>
          </Sidebar>
          <View>
            {children}
          </View>
          <CreateInstance id="create-instance" onSubmit={onInstanceCreated} />
        </div>
      </main>
      <footer>
        test footer
      </footer>
    </div>
  );
}

Layout.propTypes = {
};

export default Layout;
