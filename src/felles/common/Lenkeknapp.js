import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Lenkeknapp.less';

export default function Lenkeknapp({ children, onClick, className, tittel }) {
    return (
        <button
            className={classNames('Lenkeknapp',
                'typo-normal',
                className)}
            onClick={onClick}
            title={tittel}
        >
            {children}
        </button>
    );
}

Lenkeknapp.defaultProps = {
    onClick: undefined,
    className: '',
    tittel: undefined
};

Lenkeknapp.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node, PropTypes.string
    ]).isRequired,
    className: PropTypes.string,
    tittel: PropTypes.string
};

