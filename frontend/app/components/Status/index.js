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
  let states = ['drain', 'main', 'ready'];

  return (
    <div className="btn-group btn-group-sm pull-right" role="group" aria-label="Status">
      {
        states.map(s => {
          return (
            <button
              key={s}
              type="button"
              onClick={handleOnClick}
              className={`text-uppercase btn btn-secondary ${active(status === s)}`.trim()}
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
