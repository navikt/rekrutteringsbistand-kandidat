import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorMessage, Heading } from '@navikt/ds-react';

import {
    feil,
    ikkeLastet,
    Nettressurs,
    Nettstatus,
    senderInn,
    suksess,
} from '../../api/Nettressurs';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import Kandidatlisteskjema, { Kandidatlisteinfo } from './Kandidatlisteskjema';
import { postKandidatliste } from '../../api/api';
import { VarslingAction, VarslingActionType } from '../../common/varsling/varslingReducer';
import css from './Modal.module.css';

type Props = {
    onClose: () => void;
};

const OpprettModal: FunctionComponent<Props> = ({ onClose }) => {
    const dispatch = useDispatch();

    const [status, setStatus] = useState<Nettressurs<Kandidatlisteinfo>>(ikkeLastet());

    const opprettKandidatliste = async (info: Kandidatlisteinfo) => {
        setStatus(senderInn());

        try {
            await postKandidatliste(info);

            dispatch<VarslingAction>({
                type: VarslingActionType.VisVarsling,
                innhold: `Opprettet kandidatliste «${info.tittel}»`,
            });

            setStatus(suksess(info));
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

    const intiellKandidatinfo: Kandidatlisteinfo = {
        tittel: '',
        beskrivelse: '',
        organisasjonNavn: null,
        organisasjonReferanse: null,
    };

    return (
        <ModalMedKandidatScope
            open
            aria-label="Opprett kandidatliste"
            onClose={onClose}
            className="modal--opprett-kandidatliste__veileder"
        >
            <Heading level="2" size="medium" className={css.tittel}>
                Opprett kandidatliste
            </Heading>
            <Kandidatlisteskjema
                info={intiellKandidatinfo}
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
