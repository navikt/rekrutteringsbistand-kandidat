import React from 'react';
import PropTypes from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { lenkeTilStilling } from '../../application/paths';

const MarkerSomMinModal = ({ stillingsId, markerKandidatlisteSomMin, onAvbrytClick }) => (
    <NavFrontendModal
        isOpen
        contentLabel="modal opprett kandidatliste"
        onRequestClose={onAvbrytClick}
        className="modal--marker-kandidatliste-som-min"
        closeButton
        appElement={document.getElementById('app')}
    >
        <Systemtittel className="blokk-s">Marker som min</Systemtittel>
        {stillingsId ? (
            <div>
                <Normaltekst className="blokk-s">
                    Kandidatlisten er knyttet til en stilling. Hvis du markerer stillingen som
                    din, blir du eier av stillingen og listen. Du vil ha mulighet til å redigere
                    stillingen, endre status, dele kandidater med arbeidsgiver og sende e-post til
                    kandidatene.
                </Normaltekst>
                <Normaltekst className="blokk-m">
                    For å markere stillingen og kandidatlisten som din må du gå til stillingen.
                </Normaltekst>
                <div>
                    <a className="typo-element lenke" href={lenkeTilStilling(stillingsId)}>
                        Gå til stillingen
                    </a>
                    <Flatknapp
                        className="marker-som-min__avbryt knapp-små-bokstaver"
                        onClick={onAvbrytClick}
                    >
                        Avbryt
                    </Flatknapp>
                </div>
            </div>
        ) : (
            <div>
                <Normaltekst className="blokk-m">
                    Hvis du markerer kandidatlisten som din, blir du eier av listen. Du vil da ha
                    mulighet til å endre status, dele kandidater med arbeidsgiver og sende e-post
                    til kandidatene.
                </Normaltekst>
                <div>
                    <Hovedknapp className="knapp-små-bokstaver" onClick={markerKandidatlisteSomMin}>
                        Marker som min
                    </Hovedknapp>
                    <Flatknapp
                        className="marker-som-min__avbryt knapp-små-bokstaver"
                        onClick={onAvbrytClick}
                    >
                        Avbryt
                    </Flatknapp>
                </div>
            </div>
        )}
    </NavFrontendModal>
);

MarkerSomMinModal.defaultProps = {
    stillingsId: undefined,
};

MarkerSomMinModal.propTypes = {
    stillingsId: PropTypes.string,
    markerKandidatlisteSomMin: PropTypes.func.isRequired,
    onAvbrytClick: PropTypes.func.isRequired,
};

export default MarkerSomMinModal;
