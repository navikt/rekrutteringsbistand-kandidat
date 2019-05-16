import React from 'react';
import PropTypes from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp } from 'pam-frontend-knapper';

const KopierEpostModal = ({ vis, onClose }) => (
    <NavFrontendModal
        contentLabel="E-postadressene er kopiert"
        isOpen={vis}
        onRequestClose={onClose}
        className="SendEpostModal"
        appElement={document.getElementById('app')}
    >
        <i className="eposter-kopiert__icon" />
        <Systemtittel>E-postadressene til kandidatene er kopiert</Systemtittel>
        <Normaltekst className="tekst">Lim inn adressene i mailprogrammet, og bruk blindkopi (Bcc) feltet. De som mottar e-posten vil da kun se sin egen adresse.</Normaltekst>
        <Hovedknapp className="lukk--knapp" onClick={onClose}>Lukk</Hovedknapp>
    </NavFrontendModal>
);

KopierEpostModal.defaultProps = {
    vis: true
};

KopierEpostModal.propTypes = {
    vis: PropTypes.bool,
    onClose: PropTypes.func.isRequired
};

export default KopierEpostModal;
