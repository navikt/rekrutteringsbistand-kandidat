import * as React from 'react';
import { PropTypes } from 'prop-types';
import './LeggtilKnapp.less';

const LeggtilKnapp = ({ children, className, onClick }) => (
    <button
        className={`${className} LeggtilKnapp`}
        onClick={onClick}
    >
        <div className="LeggtilKnapp__text">
            {children}
        </div>
    </button>
);

LeggtilKnapp.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]).isRequired
};

export default LeggtilKnapp;

