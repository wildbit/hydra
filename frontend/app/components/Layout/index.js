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

const Layout = ({ children, instances, onInstanceCreated }) => {
  return (
    <div>
      <Header>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#">Disabled</a>
          </li>
        </ul>
      </Header>
      <main role="main" className="container">
        <div className="row">
          <Sidebar>
            <Instances instances={instances} />
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              data-toggle="modal"
              data-target="#create-instance">
              + HA Proxy Instance
            </button>
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
