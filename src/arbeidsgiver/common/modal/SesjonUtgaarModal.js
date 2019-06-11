import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'pam-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';

const SesjonUtgaarModal = ({
    tittelTekst,
    innholdTekst,
    primaerKnappTekst,
    sekundaerKnappTekst,
    onPrimaerKnappClick,
    onSekundaerKnappClick,
    isOpen,
    sekundaerKnapp
}) => (
    <NavFrontendModal
        className="SesjonUgaarModal"
        closeButton={false}
        shouldCloseOnOverlayClick={false}
        isOpen={isOpen}
        shouldFocusAfterRender
        onRequestClose={() => {}}
    >
        <Systemtittel>{tittelTekst}</Systemtittel>
        <div className="innhold">
            <Normaltekst>
                {innholdTekst}
            </Normaltekst>
        </div>
        <div className="knapperad">
            <Hovedknapp onClick={onPrimaerKnappClick}>{primaerKnappTekst}</Hovedknapp>
            {sekundaerKnapp && <Flatknapp onClick={onSekundaerKnappClick}>{sekundaerKnappTekst}</Flatknapp>}
        </div>
    </NavFrontendModal>
);

SesjonUtgaarModal.defaultProps = {
    sekundaerKnapp: false,
    onSekundaerKnappClick: () => {},
    sekundaerKnappTekst: ''
};

SesjonUtgaarModal.propTypes = {
    tittelTekst: PropTypes.string.isRequired,
    innholdTekst: PropTypes.string.isRequired,
    primaerKnappTekst: PropTypes.string.isRequired,
    onPrimaerKnappClick: PropTypes.func.isRequired,
    sekundaerKnappTekst: PropTypes.string,
    onSekundaerKnappClick: PropTypes.func,
    sekundaerKnapp: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired
};

export default SesjonUtgaarModal;
