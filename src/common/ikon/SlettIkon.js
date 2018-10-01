import React from 'react';
import PropTypes from 'prop-types';

const SlettIkon = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
        <g stroke="#0067C5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill="none">
            <path d="M3.516 3.5h16v20h-16zM7.516.5h8v3h-8zM1.016 3.5h22M7.516 7v12M11.516 7v12M15.516 7v12" />
        </g>
    </svg>
);

SlettIkon.defaultProps = {
    className: undefined
};

SlettIkon.propTypes = {
    className: PropTypes.string
};

export default SlettIkon;
