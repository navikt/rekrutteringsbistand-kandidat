import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { fornavnOgEtternavnFraKandidat } from '../sok/utils';

const SlettKandidaterModal = ({ isOpen, sletterKandidater, lukkModal, valgteKandidater, visFeilmelding, onDeleteClick }) => (
    <Modal
        className="KandidatlisteDetalj__modal"
        isOpen={isOpen}
        onRequestClose={() => {
            if (!sletterKandidater) {
                lukkModal();
            }
        }}
        closeButton
        contentLabel={valgteKandidater.length === 1 ? 'Slett kandidat' : 'Slett kandidatene'}
    >
        {visFeilmelding && (
            <AlertStripeAdvarsel className="feilmleding">Noe gikk galt under sletting av
                kandidater</AlertStripeAdvarsel>
        )}
        <Sidetittel
            className="overskrift"
        >{valgteKandidater.length === 1 ? 'Slett kandidat' : 'Slett kandidatene'}</Sidetittel>
        <Normaltekst>{valgteKandidater.length === 1
            ? `Er du sikker på at du ønsker å slette ${fornavnOgEtternavnFraKandidat(valgteKandidater.pop())} fra listen?`
            : 'Er du sikker på at du ønsker å slette kandidatene fra listen?'
        }
        </Normaltekst>
        <div className="knapperad">
            <Hovedknapp onClick={onDeleteClick}>Slett</Hovedknapp>
            <Flatknapp onClick={lukkModal} disabled={sletterKandidater}>Avbryt</Flatknapp>
        </div>
    </Modal>
);

SlettKandidaterModal.defaultProps = {
    valgteKandidater: []
};

SlettKandidaterModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    sletterKandidater: PropTypes.bool.isRequired,
    lukkModal: PropTypes.func.isRequired,
    valgteKandidater: PropTypes.arrayOf(PropTypes.any).isRequired,
    visFeilmelding: PropTypes.bool.isRequired,
    onDeleteClick: PropTypes.func.isRequired
};

export default SlettKandidaterModal;
