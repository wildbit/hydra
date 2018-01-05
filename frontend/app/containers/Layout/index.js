/**
 *
 * Layout
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Page from 'components/Page';
import Instances from 'components/Instances';

export class Layout extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
              <Instances instances={[{ name: 'p-pm-proxy01' }, { name: 'p-pm-proxy02' }]} />
            </Sidebar>
            <Page>
              {this.props.children}
            </Page>
          </div>
        </main>
        <footer>
          test footer
        </footer>
      </div>
    );
  }
}

Layout.propTypes = {
};

export default Layout;
