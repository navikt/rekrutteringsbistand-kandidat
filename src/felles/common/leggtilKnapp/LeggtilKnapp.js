import * as React from 'react';
import { PropTypes } from 'prop-types';
import './LeggtilKnapp.less';

const LeggtilKnapp = ({ children, className, onClick, id }) => (
    <button className={`${className} LeggtilKnapp`} onClick={onClick} id={id}>
        <div className="LeggtilKnapp__text">{children}</div>
    </button>
);

LeggtilKnapp.defaultProps = {
    id: undefined,
};

LeggtilKnapp.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    id: PropTypes.string,
};

export default LeggtilKnapp;
