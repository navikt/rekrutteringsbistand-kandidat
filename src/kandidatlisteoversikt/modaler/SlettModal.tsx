import * as React from 'react';
import { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { BodyLong, Button, ErrorMessage, Heading } from '@navikt/ds-react';

import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { deleteKandidatliste } from '../../api/api';
import { Nettstatus } from '../../api/Nettressurs';
import { VarslingAction, VarslingActionType } from '../../common/varsling/varslingReducer';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import css from './Modal.module.css';

type Props = {
    kandidatliste: KandidatlisteSammendrag;
    onClose: (refreshKandidatlister?: boolean) => void;
};

const SlettModal: FunctionComponent<Props> = ({ kandidatliste, onClose }) => {
    const dispatch = useDispatch();
    const [status, setStatus] = React.useState<Nettstatus>(Nettstatus.IkkeLastet);

    const handleSlettClick = async () => {
        setStatus(Nettstatus.LasterInn);

        try {
            await deleteKandidatliste(kandidatliste.kandidatlisteId);

            dispatch<VarslingAction>({
                type: VarslingActionType.VisVarsling,
                innhold: `Slettet kandidatlisten «${kandidatliste.tittel}»`,
            });

            onClose(true);
        } catch (e) {
            setStatus(Nettstatus.Feil);
        }
    };

    return (
        <ModalMedKandidatScope
            open
            onClose={onClose}
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
                <Button onClick={handleSlettClick} loading={status === Nettstatus.LasterInn}>
                    Slett
                </Button>
                <Button onClick={() => onClose()} variant="secondary">
                    Avbryt
                </Button>
            </div>
            {status === Nettstatus.Feil && (
                <ErrorMessage className={css.feilmelding}>
                    Klarte ikke å slette kandidatlisten
                </ErrorMessage>
            )}
        </ModalMedKandidatScope>
    );
};

export default SlettModal;
