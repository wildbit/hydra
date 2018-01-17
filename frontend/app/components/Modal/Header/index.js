/**
*
* Header
*
*/

import React from 'react';

const Header = ({ children }) => {
  return (
    <div className="modal-header">
      {children}
      <button
        type="button"
        data-dismiss="modal"
        className="close"
        aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

Header.propTypes = {

};

export default Header;
