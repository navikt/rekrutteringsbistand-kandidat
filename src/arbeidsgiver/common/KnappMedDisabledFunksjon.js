import React from 'react';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'pam-frontend-knapper';

const KnappMedDisabledFunksjon = ({
    disabled,
    onClick,
    onDisabledClick,
    type,
    children,
    spinner,
    mini,
}) => {
    if (disabled) {
        return (
            <Hovedknapp disabled mini type="submit" onClick={onDisabledClick}>
                {children}
            </Hovedknapp>
        );
    }
    return (
        <Hovedknapp mini={mini} spinner={spinner} type={type} onClick={onClick}>
            {children}
        </Hovedknapp>
    );
};

KnappMedDisabledFunksjon.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onDisabledClick: PropTypes.func,
    type: PropTypes.string,
    children: PropTypes.string,
    spinner: PropTypes.bool,
    mini: PropTypes.bool,
};

KnappMedDisabledFunksjon.defaultProps = {
    type: 'standard',
    children: '',
    spinner: false,
    mini: false,
    onDisabledClick: undefined,
};

export default KnappMedDisabledFunksjon;
