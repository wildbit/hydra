import React from 'react';
import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.css';

const Icon = ({ className, name, spin, title, ...rest }) =>
  (<span className={`fa fa-${name} ${className} ${spin ? 'fa-spin' : ''}`} title={title} aria-hidden="true" {...rest}></span>);


Icon.PropTypes = {
  name: PropTypes.string.isRequired,
  spin: PropTypes.boolean,
  className: PropTypes.string,
  title: PropTypes.string
};

export { Icon };
