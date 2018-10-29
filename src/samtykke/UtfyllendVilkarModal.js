import React from 'react';
import PropTypes from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import Vilkar from './Vilkar';
import AvgiSamtykkeRad from './AvgiSamtykkeRad';

export default function UtfyllendeVilkarModal({ onLukk, samtykkeTekst, feil, avgiSamtykkeRadProps }) {
    return (
        <NavFrontendModal
            isOpen
            contentLabel={'Samtykke til behandling av dine personopplysninger'}
            onRequestClose={onLukk}
            className="modal-vilkar"
            closeButton
        >
            <section className="modal-header" />
            <div className="container panel panel--padding">
                <Vilkar samtykkeTekst={samtykkeTekst} />
                <AvgiSamtykkeRad visesIModal onLukk={onLukk} feil={feil} {...avgiSamtykkeRadProps} />
            </div>
        </NavFrontendModal>
    );
}

UtfyllendeVilkarModal.defaultProps = {
    feil: undefined
};

UtfyllendeVilkarModal.propTypes = {
    onLukk: PropTypes.func.isRequired,
    samtykkeTekst: PropTypes.string.isRequired,
    avgiSamtykkeRadProps: PropTypes.shape({
        handleClick: PropTypes.func,
        isAdding: PropTypes.bool,
        onSamtykkeChange: PropTypes.func,
        isSamtykkeChecked: PropTypes.bool
    }).isRequired,
    feil: PropTypes.shape({ feilmelding: PropTypes.string })
};
