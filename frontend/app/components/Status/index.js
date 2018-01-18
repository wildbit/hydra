/**
*
* Status
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { compose, withHandlers } from 'recompose';

const enhance = compose(
  withHandlers({
    handleOnClick: ({ server, onChange }) => event => {
      let status = event.target.value;
      onChange({ server, status });
    }
  })
);

const active = (isActive) => {
  return isActive ? 'btn-primary' : 'btn-outline-primary';
};

const Status = ({ server, handleOnClick }) => {
  let { normalized_status, haproxyInstance } = server;
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
              disabled={ !haproxyInstance.is_available }
              className={`text-uppercase btn ${active(normalized_status === s)}`}
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
