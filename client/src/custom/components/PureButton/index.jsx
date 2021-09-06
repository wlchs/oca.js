/* React imports */
import React from 'react';
import PropTypes from 'prop-types';

/* Custom imports */
import './index.css';
import { NavLink } from 'react-router-dom';
import { SafeAnchor } from 'react-bootstrap';

function PureButton({
  to, children, onClick, link, className,
}) {
  if (to) {
    return (
      <NavLink to={to} className={`${className} button-link link`} onClick={onClick}>
        {children}
      </NavLink>
    );
  }

  if (link) {
    return (
      <SafeAnchor type="button" className={`${className} button-link link`} href={link}>
        {children}
      </SafeAnchor>
    );
  }

  return (
    <button type="button" className={`${className} button-link link`} onClick={onClick}>
      {children}
    </button>
  );
}

PureButton.propTypes = {
  to: PropTypes.string,
  link: PropTypes.string,
  children: PropTypes.oneOfType(
    [PropTypes.string, PropTypes.object, PropTypes.element],
  ).isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

PureButton.defaultProps = {
  to: null,
  link: null,
  onClick: null,
  className: '',
};

export default PureButton;
