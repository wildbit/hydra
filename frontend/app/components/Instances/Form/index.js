/**
*
* Form
*
*/

import React from 'react';
import Modal from 'components/Modal';
import Header from 'components/Modal/Header';
import Title from 'components/Modal/Title';
import Body from 'components/Modal/Body';
import Footer from 'components/Modal/Footer';
import Store from 'models/Store.ts';
import { compose, withState, withHandlers } from 'recompose';
import { InstanceValidator } from 'utils/validators/Instance';
import $ from 'jquery';

const Form = ({ id, current, title, state, setState, handleOnSubmit, handleOnCancel, handleOnChange }) => {
  let { name, url, username, password, errors } = state;

  return (
    <form onSubmit={handleOnSubmit}>
      <Modal id={id}>
        <Header onClose={handleOnCancel}>
          <Title>{title}</Title>
        </Header>
        <Body>
          <div className="form-group">
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              className={`form-control ${(errors.name || []).length > 0 ? 'is-invalid' : ''}`}
              placeholder="production-proxy-01"
              value={name}
              data-field="name"
              onChange={handleOnChange} />
            <div className="invalid-feedback">
              {(errors.name || []).map((e, i) => <span key={`name-${i}`}>{e}</span>)}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="Url">Url</label>
            <input
              type="text"
              className={`form-control ${(errors.url || []).length > 0 ? 'is-invalid' : ''}`}
              placeholder="http://localhost:10000"
              data-field="url"
              value={url}
              onChange={handleOnChange} />
            <div className="invalid-feedback">
              {(errors.url || []).map((e, i) => <span key={`url-${i}`}>{e}</span>)}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="administrator"
              data-field="username"
              value={username}
              onChange={handleOnChange} />
          </div>
          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="12345"
              data-field="password"
              value={password}
              onChange={handleOnChange} />
          </div>
        </Body>
        <Footer>
          <button className="btn btn-primary">Save</button>
          <a href="#" onClick={handleOnCancel} aria-label="Cancel">Cancel</a>
        </Footer>
      </Modal>
    </form>
  );
}

Form.propTypes = {
};

const defaultState = (current) => {
  if (!current) { current = { settings: {} } }
  return {
    name: current.display_name || '',
    url: current.settings.url || '',
    username: current.settings.username || '',
    password: current.settings.password || '',
    errors: {}
  };
};

const any = (errors) => {
  return [].concat(...Object.keys(errors).map(k => errors[k])).length > 0;
};

const enhance = compose(
  withState('state', 'setState', ({ current }) => {
    console.log('INITIAL STATE', current);
    return defaultState(current);
  }),
  withHandlers({
    handleOnCancel: ({ id, current, setState }) => event => {
      setState(defaultState(current));
      $(`#${id}`).modal('hide');
    },
    handleOnChange: ({ current, state, setState }) => event => {
      let $input = $(event.target);
      let field = $input.data('field');
      let value = event.target.value.trim();
      let errors = InstanceValidator().validate({ current, field, value });

      delete state.errors[field];

      if (errors.length > 0) {
        state.errors[field] = errors;
      }

      state[field] = value;

      setState(state);
    },
    handleOnSubmit: ({ id, current, onSubmit, state, setState }) => event => {
      event.preventDefault();

      let validator = InstanceValidator();
      let errors = {}

      validator.fields.forEach(field => {
        errors[field] = validator.validate({ current, field, value: state[field] });
      });

      if (any(errors)) {
        state.errors = errors;
        setState(state);
        return;
      }

      onSubmit(state, (reset) => {
        if (reset) {
          setState(defaultState());
        }

        $(`#${id}`).modal('hide');
      });
    },
  })
);

export default enhance(Form);
