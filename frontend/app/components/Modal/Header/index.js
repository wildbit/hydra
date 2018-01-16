/**
*
* Header
*
*/

import React from 'react';

const Header = ({ onClose, children }) => {
  if (!onClose) {
    return (
      <div className="modal-header">
        {children}
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }

  return (
    <div className="modal-header">
      {children}
      <button
        type="button"
        className="close"
        onClick={onClose}
        aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

Header.propTypes = {

};

export default Header;
