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
  let { status } = server;
  let states = ['DRAIN', 'MAIN', 'READY'];

  return (
    <div className="btn-group btn-group-sm" role="group" aria-label="Status">
      {
        states.map(s => {
          return (
            <button
              type="button"
              onClick={handleOnClick}
              className={`btn btn-secondary ${active(status === s)}`}
              value={s}>
              {s}
            </button>
          );
        })
      }
    </div>
  );
}

Status.propTypes = {
  server: PropTypes.object,
  onChange: PropTypes.func,
};

export default enhance(Status);
