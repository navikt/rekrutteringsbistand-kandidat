import React, { FunctionComponent } from 'react';
import { Notat } from '../../domene/Kandidatressurser';
import NotatInfo from './NotatInfo';
import ModalMedKandidatScope from '../../../common/modal/ModalMedKandidatScope';
import { BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react';
import notatlisteCss from './Notatliste.module.css';
import css from './Modal.module.css';

type SlettemodalProps = {
    notat: Notat;
    onSlettNotat: (notatId: string) => void;
    onCloseSletteModal: () => void;
};

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
            <Heading spacing level="2" size="medium" className="slett-notat-modal__overskrift">
                Slett notat
            </Heading>
            <BodyShort spacing>Er du sikker på at du ønsker å slette notatet?</BodyShort>
            <div className={notatlisteCss.topprad}>
                <NotatInfo notat={notat} />
            </div>
            <BodyLong>{notat.tekst}</BodyLong>
            <div className={css.knapper}>
                <Button onClick={onBekreft}>Slett</Button>
                <Button variant="secondary" onClick={onCloseSletteModal}>
                    Avbryt
                </Button>
            </div>
        </ModalMedKandidatScope>
    );
};

export default Slettemodal;
