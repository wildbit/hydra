/**
 *
 * Layout
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Servers from 'components/Servers';

export class Layout extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="flex-container">
        <header>
          HAProxy
        </header>
        <nav className="nav">
          <Servers instances={[{ name: 'p-pm-proxy01' }, { name: 'p-pm-proxy02' }]} />
        </nav>
        <section className="main">
          {this.props.children}
        </section>
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
