import React from 'react';
import PropTypes from 'prop-types';

const Sidetittel = ({ children, className }) => (
    <h1 className={`h1 display-1 ${className}`} style={{ fontFamily: 'Source Sans Pro' }}>{children}</h1>
);

Sidetittel.propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string
};

Sidetittel.defaultProps = {
    className: ''
};

export default Sidetittel;
