import React from 'react';
import PropTypes from 'prop-types';
import KnappBase from 'nav-frontend-knapper';

const KnappMedDisabledFunksjon = ({ disabled, onClick, onDisabledClick, type, children, spinner, mini }) => {
    if (disabled) {
        const disabledClasses = 'knapp knapp--disabled knapp--disabled--clickable';
        return <button className={mini ? `${disabledClasses} knapp--mini` : disabledClasses} type="submit" onClick={onDisabledClick}>{children}</button>;
    }
    return <KnappBase mini={mini} spinner={spinner} type={type} onClick={onClick}>{children}</KnappBase>;
};

KnappMedDisabledFunksjon.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onDisabledClick: PropTypes.func,
    type: PropTypes.string,
    children: PropTypes.string,
    spinner: PropTypes.bool,
    mini: PropTypes.bool
};

KnappMedDisabledFunksjon.defaultProps = {
    type: 'standard',
    children: '',
    spinner: false,
    mini: false,
    onDisabledClick: undefined
};

export default KnappMedDisabledFunksjon;
