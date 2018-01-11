/**
*
* Header
*
*/

import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ children }) => {
  return (
    <header className="navbar-dark bg-dark flex-column flex-md-row">
      <nav className="navbar navbar-expand">
        <Link to="/" className="navbar-brand">Hydra</Link>
        <button className="navbar-toggler collapsed" type="button"
          data-toggle="collapse" data-target="#navbarCollapse"
          aria-controls="navbarCollapse" aria-expanded="false"
          aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse collapse" id="navbarCollapse">
          {children}
        </div>
      </nav>
    </header>
  );
}

Header.propTypes = {

};

export default Header;
