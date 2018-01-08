/**
*
* Header
*
*/

import React from 'react';
import styled from 'styled-components';

const Heading = styled.header`
  padding-bottom: 100px;
`;


const Header = ({ children }) => {
  return (
    <Heading>
      <div className="container">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <a href="#" className="navbar-brand">Hydra</a>
          <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse" id="navbarCollapse">
            {children}
          </div>
        </nav>
      </div>
    </Heading>
  );
}

Header.propTypes = {

};

export default Header;
