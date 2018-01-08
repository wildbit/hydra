/**
*
* Modal
*
*/

import React from 'react';
// import styled from 'styled-components';

const Modal = ({ id, children }) => {
  return (
    <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {

};

export default Modal;
