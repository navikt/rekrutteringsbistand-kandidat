import * as React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'pam-frontend-knapper';
import { FunctionComponent } from 'react';

interface Props {
    slettKandidatliste: () => void,
    onAvbrytClick: () => void,
}

const SlettKandidatlisteModal: FunctionComponent<Props> = ({ slettKandidatliste, onAvbrytClick }) => (
    <NavFrontendModal
        isOpen
        contentLabel="modal opprett kandidatliste"
        onRequestClose={onAvbrytClick}
        className="modal--marker-kandidatliste-som-min"
        closeButton
        // appElement={document.getElementById('app')}
    >
        <Systemtittel className="blokk-s">Slett kandidatliste</Systemtittel>
        <div>
            <Normaltekst className="blokk-m">
                Er du sikker på at du vil slette kandidatlisten og alt innholdet i listen?
                Denne handlingen kan ikke angres.
            </Normaltekst>
            <div>
                <Hovedknapp onClick={slettKandidatliste}>Slett</Hovedknapp>
                <Flatknapp className="marker-som-min__avbryt" onClick={onAvbrytClick}>Avbryt</Flatknapp>
            </div>
        </div>
    </NavFrontendModal>
);

NavFrontendModal.setAppElement('#app');

export default SlettKandidatlisteModal;
