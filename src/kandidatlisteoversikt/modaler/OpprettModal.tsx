import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heading } from '@navikt/ds-react';

import { Nettstatus } from '../../api/Nettressurs';
import AppState from '../../AppState';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import Kandidatlisteskjema, { Kandidatlisteinfo } from './Kandidatlisteskjema';
import css from './Modal.module.css';

type Props = {
    onAvbrytClick: () => void;
};

const OpprettModal: FunctionComponent<Props> = ({ onAvbrytClick }) => {
    const dispatch = useDispatch();
    const { lagreStatus } = useSelector((state: AppState) => state.kandidatliste.opprett);

    const opprettKandidatliste = (info: Kandidatlisteinfo) => {
        dispatch({ type: KandidatlisteActionType.OpprettKandidatliste, info });
    };

    const resetStatusTilUnsaved = () => {
        dispatch({ type: KandidatlisteActionType.ResetLagreStatus });
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
            onClose={onAvbrytClick}
            className="modal--opprett-kandidatliste__veileder"
        >
            <Heading level="2" size="medium" className={css.tittel}>
                Opprett kandidatliste
            </Heading>
            <Kandidatlisteskjema
                info={intiellKandidatinfo}
                onSave={opprettKandidatliste}
                resetStatusTilUnsaved={resetStatusTilUnsaved}
                saving={lagreStatus === Nettstatus.SenderInn}
                onAvbrytClick={onAvbrytClick}
                knappetekst="Opprett"
            />
        </ModalMedKandidatScope>
    );
};

export default OpprettModal;
