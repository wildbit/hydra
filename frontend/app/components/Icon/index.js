import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ className, name, spin }) => (<span className={`fa fa-${name} ${className} ${spin ? 'fa-spin' : ''}`} aria-hidden="true"></span>);

Icon.PropTypes = {
  name: PropTypes.string.isRequired,
  spin: PropTypes.boolean,
  className: PropTypes.string,
};

export { Icon };
