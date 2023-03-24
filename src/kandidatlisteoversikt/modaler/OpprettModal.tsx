import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorMessage, Heading } from '@navikt/ds-react';

import { feil, Nettressurs, Nettstatus, suksess } from '../../api/Nettressurs';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import Kandidatlisteskjema, { KandidatlisteDto } from './Kandidatlisteskjema';
import { postKandidatliste } from '../../api/api';
import { VarslingAction, VarslingActionType } from '../../common/varsling/varslingReducer';
import css from './Modal.module.css';

type Props = {
    onClose: () => void;
};

const OpprettModal: FunctionComponent<Props> = ({ onClose }) => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState<Nettressurs<KandidatlisteDto>>({
        kind: Nettstatus.IkkeLastet,
    });

    const opprettKandidatliste = async (kandidatlisteDto: KandidatlisteDto) => {
        setStatus({ kind: Nettstatus.SenderInn });

        try {
            await postKandidatliste(kandidatlisteDto);

            dispatch<VarslingAction>({
                type: VarslingActionType.VisVarsling,
                innhold: `Opprettet kandidatliste «${kandidatlisteDto.tittel}»`,
            });

            setStatus(suksess(kandidatlisteDto));
            onClose();
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
        <ModalMedKandidatScope
            open
            aria-label="Opprett kandidatliste"
            onClose={onClose}
            className={css.modal}
        >
            <Heading level="2" size="medium" className={css.tittel}>
                Opprett kandidatliste
            </Heading>
            <Kandidatlisteskjema
                onSave={opprettKandidatliste}
                saving={status.kind === Nettstatus.SenderInn}
                onClose={onClose}
                knappetekst="Opprett"
            />
            {status.kind === Nettstatus.Feil && <ErrorMessage>{status.error.message}</ErrorMessage>}
        </ModalMedKandidatScope>
    );
};

export default OpprettModal;
