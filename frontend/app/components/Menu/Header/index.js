/**
*
* Header
*
*/

import React from 'react';
import styled from 'styled-components';

const Heading = styled.header``;


const Header = ({ children }) => {
  return (
    <Heading className="navbar-dark bg-dark flex-column flex-md-row">
      <nav className="navbar navbar-expand">
        <a href="/" className="navbar-brand">Hydra</a>
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
    </Heading>
  );
}

Header.propTypes = {

};

export default Header;
