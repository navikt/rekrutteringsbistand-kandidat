import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heading } from '@navikt/ds-react';

import Kandidatlisteskjema, { Kandidatlisteinfo } from './Kandidatlisteskjema';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import { Nettstatus } from '../../api/Nettressurs';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import AppState from '../../AppState';
import css from './Modal.module.css';

type Props = {
    kandidatliste: KandidatlisteSammendrag;
    onAvbrytClick: () => void;
};

const EndreModal: FunctionComponent<Props> = ({ kandidatliste, onAvbrytClick }) => {
    const dispatch = useDispatch();
    const { lagreStatus } = useSelector((state: AppState) => state.kandidatliste.opprett);

    const oppdaterKandidatliste = (info: Kandidatlisteinfo) => {
        dispatch({ type: KandidatlisteActionType.OppdaterKandidatliste, info });
    };
    const resetStatusTilUnsaved = () => {
        dispatch({ type: KandidatlisteActionType.ResetLagreStatus });
    };

    const kandidatlisteinfo = {
        ...kandidatliste,
        tittel: kandidatliste.tittel || '',
        beskrivelse: kandidatliste.beskrivelse || '',
    };

    return (
        <ModalMedKandidatScope
            open
            onClose={onAvbrytClick}
            aria-label="Endre kandidatlisten"
            className="modal--opprett-kandidatliste__veileder"
        >
            <Heading level="2" size="medium" className={css.tittel}>
                Endre kandidatlisten
            </Heading>
            <Kandidatlisteskjema
                info={kandidatlisteinfo}
                onSave={oppdaterKandidatliste}
                resetStatusTilUnsaved={resetStatusTilUnsaved}
                saving={lagreStatus === Nettstatus.SenderInn}
                onAvbrytClick={onAvbrytClick}
                knappetekst="Lagre endringer"
            />
        </ModalMedKandidatScope>
    );
};

export default EndreModal;
