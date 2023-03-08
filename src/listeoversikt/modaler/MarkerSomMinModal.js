import React from 'react';
import PropTypes from 'prop-types';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { lenkeTilStilling } from '../../app/paths';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import { Link } from 'react-router-dom';

const MarkerSomMinModal = ({ stillingsId, markerKandidatlisteSomMin, onAvbrytClick }) => (
    <ModalMedKandidatScope
        open
        onClose={onAvbrytClick}
        aria-label="Marker som min"
        className="modal--marker-kandidatliste-som-min"
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
                    <Link className="typo-element lenke" to={lenkeTilStilling(stillingsId)}>
                        Gå til stillingen
                    </Link>
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
    </ModalMedKandidatScope>
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
