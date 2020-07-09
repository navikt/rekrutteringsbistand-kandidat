import React, { FunctionComponent } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Notat } from '../../../kandidatlistetyper';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import NotatInfo from './NotatInfo';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';

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
        <NavFrontendModal
            isOpen
            contentLabel={'Rediger notat'}
            onRequestClose={onCloseSletteModal}
            className="slett-notat-modal"
            // appElement={document.getElementById('app')}
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
        </NavFrontendModal>
    );
};

export default Slettemodal;
