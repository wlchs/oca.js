/* React imports */
import React from 'react';
import PropTypes from 'prop-types';

/* Custom imports */
import './index.css';
import { Col } from 'react-bootstrap';
import MissingContent from '../MissingContent';
import PureButton from '../../components/PureButton';

const EMAIL_ENTRY_KEY = 'email';

function ContactEmailContent({ attributes }) {
  const emailEntry = attributes.find((entry) => entry.key === EMAIL_ENTRY_KEY);
  if (!emailEntry) {
    return <MissingContent what="no e-mail address found" />;
  }

  return (
    <Col xs={12} className="d-flex flex-column align-items-center">
      <PureButton link={`mailto:${emailEntry.value}`}>{emailEntry.value}</PureButton>
    </Col>
  );
}

ContactEmailContent.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  })),
};

ContactEmailContent.defaultProps = {
  attributes: [],
};

export default ContactEmailContent;
