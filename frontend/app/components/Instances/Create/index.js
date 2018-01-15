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
import Store from 'models/Store.ts';
import { compose, withHandlers, withState } from 'recompose';
import $ from 'jquery';

const Create = ({ id, state, handleOnSubmit, handleOnChange }) => {
  let { name, url, username, password, errors } = state;
  return (
    <form onSubmit={handleOnSubmit}>
      <Modal id={id}>
        <Header>
          <Title>Add HAProxy Instance</Title>
        </Header>
        <Body>
          <div className="form-group">
            <label htmlFor="Name">Name</label>
            <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="production-proxy-01"
              required={true} value={name} data-field="name"  onChange={handleOnChange} />
            <div className="invalid-feedback">{errors.name}</div>
          </div>
          <div className="form-group">
            <label htmlFor="Url">Url</label>
            <input type="text" className={`form-control ${errors.url ? 'is-invalid' : ''}`}
              placeholder="http://localhost:10000" required={true}
              data-field="url" value={url} onChange={handleOnChange} />
            <div className="invalid-feedback">{errors.url}</div>
          </div>
          <div className="form-group">
            <label htmlFor="Username">Username</label>
            <input type="text" className="form-control" placeholder="administrator"
              data-field="username" value={username} onChange={handleOnChange} />
          </div>
          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input type="password" className="form-control" placeholder="12345"
              data-field="password" value={password} onChange={handleOnChange} />
          </div>
        </Body>
        <Footer>
          <button className="btn btn-primary" disabled={Object.keys(errors).length > 0} >Save</button>
          <a href="#" data-dismiss="modal" aria-label="Cancel">Cancel</a>
        </Footer>
      </Modal>
    </form>
  );
}

Create.propTypes = {

};

const defaultState = () => {
  return { name: '', url: '', username: '', password: '', errors: {} };
};

const enhance = compose(
  withState('state', 'setState', defaultState()),
  withHandlers({
    handleOnChange: ({ state, setState }) => event => {
      //Not sure if this is an ideal way to do validation, but it does work...
      let $input = $(event.target);
      let inputName = $input.data('field');
      var newValue = event.target.value.trim();
      delete state.errors[inputName];
      switch (inputName) {
        case 'name':
          let nonUnique = Store.instance.List()
            .filter(x => x.display_name.toLowerCase() == newValue.toLowerCase()).length > 0;
          if (nonUnique) {
            state.errors['name'] = 'The name for the instance must be unique.';
          } else if (newValue.length == 0) {
            state.errors['name'] = 'A name for this instance is required.';
          }
          break;  
        case 'url':
          const urlMatcher = /^http(s)?:\/\/[a-z0-9.-]+([:][0-9]{1,5}($|\\|\/))?/i;
          const httpsMatcher = /^https:/i;
          if (!urlMatcher.test(newValue)) {
            state.errors['url'] = 'This must be a valid http or https url.'
          }
          else if (httpsMatcher.test(window.location.protocol) && !httpsMatcher.test(newValue)) {
            state.errors['url'] = 'Because this interface was loaded over https, only https urls are supported.'
          }
          break;
      }
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
