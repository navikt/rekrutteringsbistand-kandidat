import * as React from 'react';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { FunctionComponent } from 'react';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';

interface Props {
    slettKandidatliste: () => void;
    onAvbrytClick: () => void;
}

const SlettKandidatlisteModal: FunctionComponent<Props> = ({
    slettKandidatliste,
    onAvbrytClick,
}) => (
    <ModalMedKandidatScope
        open
        onClose={onAvbrytClick}
        aria-label="Slett kandidatliste"
        className="modal--marker-kandidatliste-som-min"
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
    </ModalMedKandidatScope>
);

export default SlettKandidatlisteModal;
