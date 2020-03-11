import * as React from 'react';
import PropTypes from 'prop-types';

const SlettIkon = ({ className, fargeKode }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24">
        <g
            stroke={fargeKode}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            fill="none"
        >
            <path d="M3.516 3.5h16v20h-16zM7.516.5h8v3h-8zM1.016 3.5h22M7.516 7v12M11.516 7v12M15.516 7v12" />
        </g>
    </svg>
);

SlettIkon.defaultProps = {
    className: undefined,
    fargeKode: '#0067C5',
};

SlettIkon.propTypes = {
    className: PropTypes.string,
    fargeKode: PropTypes.string,
};

export default SlettIkon;
