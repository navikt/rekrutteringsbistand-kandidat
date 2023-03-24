import * as React from 'react';
import { FunctionComponent } from 'react';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import { BodyLong, Button, Heading } from '@navikt/ds-react';
import css from './Modal.module.css';

interface Props {
    slettKandidatliste: () => void;
    onAvbrytClick: () => void;
}

const SlettModal: FunctionComponent<Props> = ({ slettKandidatliste, onAvbrytClick }) => (
    <ModalMedKandidatScope
        open
        onClose={onAvbrytClick}
        aria-label="Slett kandidatliste"
        className={css.modal}
    >
        <Heading level="2" size="medium" spacing>
            Slett kandidatliste
        </Heading>
        <BodyLong spacing>
            Er du sikker på at du vil slette kandidatlisten med alt innhold? Du kan ikke angre
            handlingen.
        </BodyLong>
        <div className={css.knapper}>
            <Button onClick={slettKandidatliste}>Slett</Button>
            <Button onClick={onAvbrytClick} variant="secondary">
                Avbryt
            </Button>
        </div>
    </ModalMedKandidatScope>
);

export default SlettModal;
