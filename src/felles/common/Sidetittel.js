import React from 'react';
import PropTypes from 'prop-types';

const Sidetittel = ({ children, className, id }) => (
    <h1
        id={id}
        className={`h1 display-1 ${className}`}
        style={{ fontFamily: 'Source Sans Pro, Arial, sans-serif' }}
    >
        {children}
    </h1>
);

Sidetittel.propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    id: PropTypes.string
};

Sidetittel.defaultProps = {
    className: '',
    id: 'sidetittel'
};

export default Sidetittel;
