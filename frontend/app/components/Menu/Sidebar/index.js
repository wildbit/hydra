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
    <aside className="col-md-3 sidebar">
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
