import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import ModalMedKandidatScope from '../../ModalMedKandidatScope';

const LagreKandidaterTilStillingModal = (props) => {
    const {
        vis,
        onLagre,
        onRequestClose,
        antallMarkerteKandidater,
        kandidatliste,
        isSaving,
    } = props;

    const lagreKandidater = () => {
        onLagre(kandidatliste);
    };

    const lagreTekst = () => {
        if (kandidatliste.stillingId) {
            return `Ønsker du å lagre kandidaten${
                antallMarkerteKandidater > 1 ? 'e' : ''
            } i kandidatlisten til stillingen «${kandidatliste.tittel}»?`;
        }
        return `Ønsker du å lagre kandidaten${
            antallMarkerteKandidater > 1 ? 'e' : ''
        } i kandidatlisten «${kandidatliste.tittel}»?`;
    };

    return (
        <ModalMedKandidatScope
            isOpen={vis}
            onRequestClose={onRequestClose}
            contentLabel="LagreKandidaterModal."
            className="LagreKandidaterTilStillingModal"
            appElement={document.getElementById('app')}
        >
            <div className="LagreKandidaterTilStillingModal--wrapper">
                <Systemtittel className="tittel">
                    {`Lagre kandidat${antallMarkerteKandidater > 1 ? 'er' : ''}`}
                </Systemtittel>
                <Normaltekst>{lagreTekst()}</Normaltekst>
                <div>
                    <Hovedknapp
                        className="lagre--knapp"
                        onClick={lagreKandidater}
                        spinner={isSaving}
                        disabled={isSaving}
                    >
                        Lagre
                    </Hovedknapp>
                    <Flatknapp
                        className="avbryt--knapp"
                        onClick={onRequestClose}
                        disabled={isSaving}
                    >
                        Avbryt
                    </Flatknapp>
                </div>
            </div>
        </ModalMedKandidatScope>
    );
};

LagreKandidaterTilStillingModal.propTypes = {
    vis: PropTypes.bool.isRequired,
    onLagre: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    antallMarkerteKandidater: PropTypes.number.isRequired,
    kandidatliste: PropTypes.shape({
        kandidatlisteId: PropTypes.string,
        stillingId: PropTypes.string,
        tittel: PropTypes.string,
    }).isRequired,
    isSaving: PropTypes.bool.isRequired,
};

export default LagreKandidaterTilStillingModal;
