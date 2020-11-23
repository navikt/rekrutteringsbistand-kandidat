import * as React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { FunctionComponent } from 'react';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';

interface Props {
    slettKandidatliste: () => void;
    onAvbrytClick: () => void;
}

const SlettKandidatlisteModal: FunctionComponent<Props> = ({
    slettKandidatliste,
    onAvbrytClick,
}) => (
    <NavFrontendModal
        isOpen
        contentLabel="modal opprett kandidatliste"
        onRequestClose={onAvbrytClick}
        className="modal--marker-kandidatliste-som-min"
        closeButton
    >
        <Systemtittel className="blokk-s">Slett kandidatliste</Systemtittel>
        <div>
            <Normaltekst className="blokk-m">
                Er du sikker på at du vil slette kandidatlisten med alt innhold? Du kan ikke angre
                handlingen.
            </Normaltekst>
            <div>
                <Hovedknapp onClick={slettKandidatliste}>Slett</Hovedknapp>
                <Flatknapp className="marker-som-min__avbryt" onClick={onAvbrytClick}>
                    Avbryt
                </Flatknapp>
            </div>
        </div>
    </NavFrontendModal>
);

export default SlettKandidatlisteModal;
