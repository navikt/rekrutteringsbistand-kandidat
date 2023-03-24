import React from 'react';
import { lenkeTilStilling } from '../../app/paths';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import { Link } from 'react-router-dom';
import { BodyLong, Button, Heading } from '@navikt/ds-react';
import css from './Modal.module.css';

type Props = {
    stillingsId: string;
    markerKandidatlisteSomMin: () => void;
    onAvbrytClick: () => void;
};

const MarkerSomMinModal = ({ stillingsId, markerKandidatlisteSomMin, onAvbrytClick }: Props) => (
    <ModalMedKandidatScope
        open
        onClose={onAvbrytClick}
        aria-label="Marker som min"
        className={css.modal}
    >
        <Heading level="2" size="medium" spacing>
            Marker som min
        </Heading>
        {stillingsId ? (
            <>
                <BodyLong spacing>
                    Kandidatlisten er knyttet til en stilling. Hvis du markerer stillingen som din,
                    blir du eier av stillingen og listen. Du vil ha mulighet til å redigere
                    stillingen, endre status, dele kandidater med arbeidsgiver og sende sms til
                    kandidatene.
                </BodyLong>
                <BodyLong spacing>
                    For å markere stillingen og kandidatlisten som din må du{' '}
                    <Link className="navds-link" to={lenkeTilStilling(stillingsId)}>
                        gå til stillingen.
                    </Link>
                </BodyLong>
            </>
        ) : (
            <>
                <BodyLong spacing>
                    Hvis du markerer kandidatlisten som din, blir du eier av listen og du vil da ha
                    mulighet til å endre status.
                </BodyLong>
                <div className={css.knapper}>
                    <Button onClick={markerKandidatlisteSomMin}>Marker som min</Button>
                    <Button variant="secondary" onClick={onAvbrytClick}>
                        Avbryt
                    </Button>
                </div>
            </>
        )}
    </ModalMedKandidatScope>
);

export default MarkerSomMinModal;
