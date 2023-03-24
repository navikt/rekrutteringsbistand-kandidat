import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { BodyLong, Button, ErrorMessage, Heading } from '@navikt/ds-react';

import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { lenkeTilStilling } from '../../app/paths';
import { markerKandidatlisteUtenStillingSomMin } from '../../api/api';
import { Nettstatus } from '../../api/Nettressurs';
import { VarslingAction, VarslingActionType } from '../../common/varsling/varslingReducer';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import css from './Modal.module.css';

type Props = {
    kandidatliste: KandidatlisteSammendrag;
    stillingsId: string | null;
    onClose: () => void;
};

const MarkerSomMinModal = ({ stillingsId, kandidatliste, onClose }: Props) => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState<Nettstatus>(Nettstatus.IkkeLastet);

    const handleMarkerClick = async () => {
        setStatus(Nettstatus.LasterInn);

        try {
            await markerKandidatlisteUtenStillingSomMin(kandidatliste.kandidatlisteId);

            dispatch<VarslingAction>({
                type: VarslingActionType.VisVarsling,
                innhold: `Markerte kandidatlisten «${kandidatliste.tittel}» som min`,
            });

            onClose();
        } catch (e) {
            setStatus(Nettstatus.Feil);
        }
    };

    return (
        <ModalMedKandidatScope
            open
            onClose={onClose}
            aria-label="Marker som min"
            className={css.modal}
        >
            <Heading level="2" size="medium" spacing>
                Marker som min
            </Heading>
            {stillingsId ? (
                <>
                    <BodyLong spacing>
                        Kandidatlisten er knyttet til en stilling. Hvis du markerer stillingen som
                        din, blir du eier av stillingen og listen. Du vil ha mulighet til å redigere
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
                        Hvis du markerer kandidatlisten som din, blir du eier av listen og du vil da
                        ha mulighet til å endre status.
                    </BodyLong>
                    <div className={css.knapper}>
                        <Button
                            onClick={handleMarkerClick}
                            loading={status === Nettstatus.LasterInn}
                        >
                            Marker som min
                        </Button>
                        <Button variant="secondary" onClick={onClose}>
                            Avbryt
                        </Button>
                    </div>
                    {status === Nettstatus.Feil && (
                        <ErrorMessage className={css.feilmelding}>
                            Klarte ikke å markere kandidatlisten som din
                        </ErrorMessage>
                    )}
                </>
            )}
        </ModalMedKandidatScope>
    );
};

export default MarkerSomMinModal;
