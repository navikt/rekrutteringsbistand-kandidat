import React, { FunctionComponent } from 'react';
import { Notat } from '../../domene/Kandidatressurser';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import NotatInfo from './NotatInfo';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import ModalMedKandidatScope from '../../../common/modal/ModalMedKandidatScope';

interface SlettemodalProps {
    notat: Notat;
    onSlettNotat: (notatId: string) => void;
    onCloseSletteModal: () => void;
}

const Slettemodal: FunctionComponent<SlettemodalProps> = ({
    notat,
    onSlettNotat,
    onCloseSletteModal,
}) => {
    const onBekreft = () => {
        onSlettNotat(notat.notatId);
    };

    return (
        <ModalMedKandidatScope
            open
            aria-label="Rediger notat"
            onClose={onCloseSletteModal}
            className="slett-notat-modal"
        >
            <Systemtittel className="slett-notat-modal__overskrift">Slett notat</Systemtittel>
            <Normaltekst className="slett-notat-modal__tekst">
                Er du sikker på at du ønsker å slette notatet?
            </Normaltekst>
            <div className="notater__topprad">
                <NotatInfo notat={notat} />
            </div>
            <Normaltekst className="slett-notat-modal__tekst">{notat.tekst}</Normaltekst>
            <Hovedknapp onClick={onBekreft}>Slett</Hovedknapp>
            <Flatknapp className="slett-notat-modal__avbryt--knapp" onClick={onCloseSletteModal}>
                Avbryt
            </Flatknapp>
        </ModalMedKandidatScope>
    );
};

export default Slettemodal;
