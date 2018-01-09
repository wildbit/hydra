/**
*
* Page
*
*/

import React from 'react';
// import styled from 'styled-components';


const Page = ({ children }) => {
  return (
    <div className="col-md-9 main instance-details">
      {children}
    </div>
  );
}

Page.propTypes = {

};

export default Page;
