/**
*
* Header
*
*/

import React from 'react';
// import styled from 'styled-components';

const Header = ({ children }) => {
  return (
    <div className="modal-header">
      {children}
      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

Header.propTypes = {

};

export default Header;
