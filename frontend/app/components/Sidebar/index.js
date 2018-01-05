/**
*
* Sidebar
*
*/

import React from 'react';
// import styled from 'styled-components';


const Sidebar = ({ children }) => {
  return (
    <aside className="col-sm-3 ml-sm-auto sidebar">
      {children}
    </aside>
  );
}

Sidebar.propTypes = {

};

export default Sidebar;
