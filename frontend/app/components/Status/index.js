/**
*
* Status
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { compose, withHandlers } from 'recompose';
import { Up, Down } from 'utils/Server';

// import styled from 'styled-components';

const enhance = compose(
  withHandlers({
    handleOnClick: ({ server, onChange }) => event => {
      let status = event.target.value;
      onChange({ server, status });
    }
  })
);

const active = ({ current, status }) => {
  if (status === 'ready') {
    return (Up.indexOf(current.toLowerCase()) !== -1 || current === status) ? 'active' : '';
  }

  if (status === 'maint') {
    return (Down.indexOf(current.toLowerCase()) !== -1 || current === status) ? 'active' : '';
  }

  return (current === status) ? 'active' : '';
};

const Status = ({ server, handleOnClick }) => {
  let { status } = server;
  let states = ['drain', 'maint', 'ready'];

  return (
    <div className="btn-group btn-group-sm pull-right" role="group" aria-label="Status">
      {
        states.map(s => {
          return (
            <button
              key={s}
              type="button"
              onClick={handleOnClick}
              className={`text-uppercase btn btn-secondary ${active({ current: status, status: s })}`.trim()}
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
