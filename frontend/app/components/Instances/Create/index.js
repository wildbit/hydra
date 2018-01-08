/**
*
* Create
*
*/

import React from 'react';
import Modal from 'components/Modal';
import Header from 'components/Modal/Header';
import Title from 'components/Modal/Title';
import Body from 'components/Modal/Body';
import Footer from 'components/Modal/Footer';
import { compose, withHandlers, withState } from 'recompose';
import $ from 'jquery';

const Create = ({ id, state, handleOnSubmit, handleOnChange }) => {
  let { name, url, username, password } = state;
  return (
    <form onSubmit={handleOnSubmit}>
      <Modal id={id}>
        <Header>
          <Title>Add HAProxy Instance</Title>
        </Header>
        <Body>
          <div className="form-group">
            <label htmlFor="Name">Name</label>
            <input type="text" className="form-control" placeholder="Proxy-01" required={true} value={name} data-field="name" onChange={handleOnChange} />
          </div>
          <div className="form-group">
            <label htmlFor="Url">Url</label>
            <input type="text" className="form-control" placeholder="http://localhost:10000" required={true} data-field="url" value={url} onChange={handleOnChange} />
          </div>
          <div className="form-group">
            <label htmlFor="Username">Username</label>
            <input type="text" className="form-control" placeholder="administrator" data-field="username" value={username} onChange={handleOnChange} />
          </div>
          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input type="text" className="form-control" placeholder="12345" data-field="password" value={password} onChange={handleOnChange} />
          </div>
        </Body>
        <Footer>
          <button className="btn btn-primary">Save</button>
          <a href="#" data-dismiss="modal" aria-label="Cancel">Cancel</a>
        </Footer>
      </Modal>
    </form>
  );
}

Create.propTypes = {

};

const defaultState = () => {
  return { name: '', url: '', username: '', password: '' };
};

const enhance = compose(
  withState('state', 'setState', defaultState()),
  withHandlers({
    handleOnChange: ({ state, setState }) => event => {
      let $input = $(event.target);
      state[$input.data('field')] = event.target.value;
      setState(state);
    },
    handleOnSubmit: ({ id, onSubmit, state, setState }) => event => {
      event.preventDefault();
      onSubmit(state, () => {
        setState(defaultState());
        $(`#${id}`).modal('hide');
      });
    },
  })
);

export default enhance(Create);
