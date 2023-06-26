import { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorMessage, Heading } from '@navikt/ds-react';

import { feil, Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { VarslingAction, VarslingActionType } from '../../varsling/varslingReducer';
import { endreKandidatliste } from '../../api/api';
import Kandidatlisteskjema, { KandidatlisteDto } from './Kandidatlisteskjema';
import Modal from '../../komponenter/modal/Modal';
import css from './Modal.module.css';

type Props = {
    kandidatliste: KandidatlisteSammendrag;
    onClose: (refreshKandidatlister?: boolean) => void;
};

const EndreModal: FunctionComponent<Props> = ({ kandidatliste, onClose }) => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState<Nettressurs<KandidatlisteDto>>({
        kind: Nettstatus.IkkeLastet,
    });

    const oppdaterKandidatliste = async (kandidatlisteDto: KandidatlisteDto) => {
        setStatus({ kind: Nettstatus.SenderInn });

        try {
            await endreKandidatliste(kandidatliste.kandidatlisteId, kandidatlisteDto);

            dispatch<VarslingAction>({
                type: VarslingActionType.VisVarsling,
                innhold: `Endret er lagret for kandidatliste «${kandidatlisteDto.tittel}»`,
            });

            setStatus({ kind: Nettstatus.Suksess, data: kandidatlisteDto });

            onClose(true);
        } catch (e) {
            setStatus(
                feil({
                    message: 'Klarte ikke å opprette kandidatliste',
                    status: e.status,
                })
            );
        }
    };

    return (
        <Modal open onClose={onClose} aria-label="Endre kandidatlisten" className={css.modal}>
            <Heading level="2" size="medium" className={css.tittel}>
                Endre kandidatlisten
            </Heading>
            <Kandidatlisteskjema
                kandidatliste={kandidatliste}
                onSave={oppdaterKandidatliste}
                onClose={onClose}
                saving={status.kind === Nettstatus.SenderInn}
                knappetekst="Lagre endringer"
            />
            {status.kind === Nettstatus.Feil && <ErrorMessage>{status.error.message}</ErrorMessage>}
        </Modal>
    );
};

export default EndreModal;
