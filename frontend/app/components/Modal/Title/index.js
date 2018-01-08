/**
*
* Title
*
*/

import React from 'react';
// import styled from 'styled-components';

const Title = ({ children }) => {
  return (
    <h5 className="modal-title">
      {children}
    </h5>
  );
}

Title.propTypes = {

};

export default Title;
