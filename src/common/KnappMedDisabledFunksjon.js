import React from 'react';
import PropTypes from 'prop-types';
import KnappBase from 'nav-frontend-knapper';

const KnappMedDisabledFunksjon = ({ disabled, onClick, onDisabledClick, type, children, spinner }) => (
    disabled ?
        <button className="knapp knapp--disabled knapp--disabled--clickable" type="submit" onClick={onDisabledClick}>{children}</button>
        :
        <KnappBase spinner={spinner} type={type} onClick={onClick}>{children}</KnappBase>
);

KnappMedDisabledFunksjon.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onDisabledClick: PropTypes.func.isRequired,
    type: PropTypes.string,
    children: PropTypes.string,
    spinner: PropTypes.bool
};

KnappMedDisabledFunksjon.defaultProps = {
    type: 'standard',
    children: '',
    spinner: false
};

export default KnappMedDisabledFunksjon;
