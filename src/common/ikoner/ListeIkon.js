import React from 'react';
import PropTypes from 'prop-types';

const ListeIkon = ({ fargeKode, className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
        <g stroke={fargeKode} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill="none">
            <path d="M20.5 23.5h-17v-23h11l6 6zM14.5.5v6h6M12.5 10.5h4M12.5 14.5h4M12.5 18.5h4M10.5 8.5l-2.5 2.5-1.5-1.5M10.5 12.5l-2.5 2.5-1.5-1.5M10.5 16.5l-2.5 2.5-1.5-1.5" />
        </g>
    </svg>
);

ListeIkon.defaultProps = {
    fargeKode: 'black',
    className: undefined
};

ListeIkon.propTypes = {
    fargeKode: PropTypes.string,
    className: PropTypes.string
};

export default ListeIkon;
