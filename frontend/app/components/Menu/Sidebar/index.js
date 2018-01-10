/**
*
* Sidebar
*
*/

import React from 'react';
import { branch, compose, renderComponent } from 'recompose';
// import styled from 'styled-components';


const NullSidebar = () => {
  return null;
}

const Sidebar = ({ children }) => {
  return (
    <aside className="sidebar col-12 col-md-3 col-xl-3">
      {children}
    </aside>
  );
}

Sidebar.propTypes = {

};

const enhance = compose(
  branch(
    ({ hidden }) => hidden,
    renderComponent(NullSidebar)
  )
);

export default enhance(Sidebar);
