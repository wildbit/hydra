/**
*
* Page
*
*/

import React from 'react';
// import styled from 'styled-components';


const Page = ({ children }) => {
  return (
    <div className="col-sm-9 main">
      {children}
    </div>
  );
}

Page.propTypes = {

};

export default Page;
