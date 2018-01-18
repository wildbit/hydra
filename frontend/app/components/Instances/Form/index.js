/**
*
* Form
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import reactTriggerChange from 'react-trigger-change';

import Modal from 'components/Modal';
import Header from 'components/Modal/Header';
import Title from 'components/Modal/Title';
import Body from 'components/Modal/Body';
import Footer from 'components/Modal/Footer';
import { branch, compose, withState, withHandlers, renderNothing } from 'recompose';
import { InstanceValidator } from 'utils/validators/Instance';
import { IllegalUrlCharacters as illegal, Protocol as protocol } from 'utils/regular-expressions';

const defaultState = ({ name = '', url = '', username = '', password = '', errors = {} } = {}) => {
  return {
    name,
    url,
    username,
    password,
    errors
  };
};

const any = (errors) => {
  return [].concat(...Object.keys(errors).map(k => errors[k])).length > 0;
};

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState();
    this._name = null;
  }

  componentDidMount() {
    this.mapStateFromProps(this.props);
    $(ReactDOM.findDOMNode(this))
      .on('hidden.bs.modal', this.handleOnCancel);
  }

  componentWillUnmount() {
    $(ReactDOM.findDOMNode(this))
      .off('hidden.bs.modal', this.handleOnCancel);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.props.current) {
      this.mapStateFromProps(nextProps);
    }
  }

  mapStateFromProps = (props) => {
    let { current } = props;

    if (!current) {
      return;
    }

    let { display_name, settings } = current;
    let { url, username, password } = settings;

    this.setState(state => {
      return {
        ...state,
        name: display_name,
        url,
        username,
        password
      };
    })
  }

  handleOnCancel = (event) => {
    this.setState(defaultState());
    this.mapStateFromProps(this.props);
  }

  handleOnChange = (event) => {
    const { current } = this.props;

    let { state } = this;
    let field = ReactDOM.findDOMNode(event.target).getAttribute('data-field');
    let value = event.target.value.trim();
    let errors = InstanceValidator().validate({ current, field, value });

    delete state.errors[field];
    state[field] = value;

    if (errors.length > 0) {
      state.errors[field] = errors;
    }

    this.setState(state);
  }

  handleOnUrlChange = (event) => {
    this.handleOnChange(event);

    if (this.props.current) {
      return;
    }

    let { name, url } = this.state;

    if (protocol.test(url)) {
      name = url.replace(protocol, '').replace(illegal, '-');

      this.setState({ name }, () => {
        if (name.length > 0) {
          reactTriggerChange(this._name);
        }
      });
    }
  }

  handleOnSubmit = (event) => {
    event.preventDefault();

    const { current, onSubmit } = this.props;

    let { state } = this;
    let validator = InstanceValidator();
    let errors = {}

    validator.fields.forEach(field => {
      errors[field] = validator.validate({ current, field, value: state[field] });
    });

    if (any(errors)) {
      state.errors = errors;
      this.setState(state);
      return;
    }

    onSubmit(state, () => {
      $(ReactDOM.findDOMNode(this)).modal('hide');
    });
  }

  render() {
    const { id, title } = this.props;
    let { name, url, username, password, errors } =  this.state;

    return (
      <Modal id={id}>
        <form onSubmit={this.handleOnSubmit}>
          <Header>
            <Title>{title}</Title>
          </Header>
          <Body>
            <div className="form-group">
              <label htmlFor="Url">Url</label>
              <input
                type="text"
                className={`form-control ${(errors.url || []).length > 0 ? 'is-invalid' : ''}`}
                placeholder="http://localhost:10000"
                data-field="url"
                value={url}
                onChange={this.handleOnUrlChange} />
              <Errors errors={errors.url} />
            </div>
            <div className="form-group">
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                className={`form-control ${(errors.name || []).length > 0 ? 'is-invalid' : ''}`}
                placeholder="production-proxy-01"
                value={name}
                ref={(input) => { this._name = input; }}
                data-field="name"
                onChange={this.handleOnChange} />
              <Errors errors={errors.name} />
            </div>
            <div className="form-group">
              <label htmlFor="Username">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="administrator"
                data-field="username"
                value={username}
                onChange={this.handleOnChange} />
            </div>
            <div className="form-group">
              <label htmlFor="Password">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="12345"
                data-field="password"
                value={password}
                onChange={this.handleOnChange} />
            </div>
          </Body>
          <Footer>
            <button className="btn btn-primary">Save</button>
            <a href="#" data-dismiss="modal" aria-label="Cancel">Cancel</a>
          </Footer>
        </form>
      </Modal>
    );
  }
}

Form.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  OnSubmit: PropTypes.func,
};

const enhanced = branch(
  ({ errors }) => !errors,
  renderNothing
);

const Errors = enhanced(({ errors }) => {
  return (
    <div className="invalid-feedback">
      {errors.map((e, i) => <span key={i}>{e}</span>)}
    </div>
  );
});
