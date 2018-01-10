/**
*
* Page
*
*/

import React from 'react';
// import styled from 'styled-components';


const Page = ({ children }) => {
  return (
    <div className="main instance-details col-12 col-md-9 col-xl-9 pt-md-4 pb-md-4 pl-md-5 pr-md-5">
      {children}
    </div>
  );
}

Page.propTypes = {

};

export default Page;
