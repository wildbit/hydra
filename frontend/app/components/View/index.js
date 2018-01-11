/**
*
* Page
*
*/

import React from 'react';

const Page = ({ children, fullScreen }) => (
  <div className={`main instance-details ${fullScreen ? 'col-12' : 'col-12 col-md-9 col-xl-9 pt-md-4 pb-md-4 pl-md-5 pr-md-5'}`} >
    {children}
  </div>
);

export default Page;
