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

const Status = ({ server, handleOnClick }) => {
  return (
    <div className="btn-group btn-group-sm" role="group" aria-label="Status">
      <button type="button" onClick={handleOnClick} className={`btn btn-${(server.status === 'drain') ? 'secondary' : 'light'}`} value='DRAIN'>DRAIN</button>
      <button type="button" onClick={handleOnClick} className={`btn btn-${(server.status === 'maint') ? 'secondary' : 'light'}`} value='MAIN'>MAINT</button>
      <button type="button" onClick={handleOnClick} className={`btn btn-${(server.status === 'ready') ? 'secondary' : 'light'}`} value='READY'>READY</button>
    </div>
  );
}

Status.propTypes = {
  server: PropTypes.object,
  onChange: PropTypes.func,
};

export default enhance(Status);
