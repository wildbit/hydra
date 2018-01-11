/**
*
* Status
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { compose, withHandlers } from 'recompose';

// import styled from 'styled-components';

const enhance = compose(
  withHandlers({
    handleOnClick: ({ server, onChange }) => event => {
      let status = event.target.value;
      onChange({ server, status });
    }
  })
);

const active = (isActive) => {
  return isActive ? 'active' : '';
};

const Status = ({ server, handleOnClick }) => {
  return (
    <div className="btn-group btn-group-sm" role="group" aria-label="Status">
      <button type="button" onClick={handleOnClick} className={`btn btn-secondary ${active(server.status === 'drain')}`} value='DRAIN'>DRAIN</button>
      <button type="button" onClick={handleOnClick} className={`btn btn-secondary ${active(server.status === 'main')}`} value='MAIN'>MAINT</button>
      <button type="button" onClick={handleOnClick} className={`btn btn-secondary ${active(server.status === 'ready')}`} value='READY'>READY</button>
    </div>
  );
}

Status.propTypes = {
  server: PropTypes.object,
  onChange: PropTypes.func,
};

export default enhance(Status);
