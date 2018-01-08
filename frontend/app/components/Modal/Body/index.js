/**
*
* Body
*
*/

import React from 'react';
// import styled from 'styled-components';


const Body = ({ children }) => {
  return (
    <div className="modal-body">
      {children}
    </div>
  );
}

Body.propTypes = {

};

export default Body;
