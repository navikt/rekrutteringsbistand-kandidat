import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Systemtittel } from 'nav-frontend-typografi';

import OpprettKandidatlisteForm from './OpprettKandidatlisteForm';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import { Nettstatus } from '../../api/Nettressurs';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import KandidatlisteAction, {
    Kandidatlisteinfo,
} from '../../kandidatliste/reducer/KandidatlisteAction';
import AppState from '../../AppState';

const kandidatlisteInfoWrapper = (kandidatliste: KandidatlisteSammendrag) => ({
    ...kandidatliste,
    tittel: kandidatliste.tittel || '',
    beskrivelse: kandidatliste.beskrivelse || '',
});

type Props = {
    oppdaterKandidatliste: (info: Kandidatlisteinfo) => void;
    resetStatusTilUnsaved: () => void;
    lagreStatus: Nettstatus;
    onAvbrytClick: () => void;
    kandidatliste: KandidatlisteSammendrag;
};

const EndreModal: FunctionComponent<Props> = ({
    oppdaterKandidatliste,
    resetStatusTilUnsaved,
    lagreStatus,
    kandidatliste,
    onAvbrytClick,
}) => (
    <ModalMedKandidatScope
        open
        onClose={onAvbrytClick}
        aria-label="Endre kandidatlisten"
        className="modal--opprett-kandidatliste__veileder"
    >
        <Systemtittel className="blokk-s">Endre kandidatlisten</Systemtittel>
        <OpprettKandidatlisteForm
            onSave={oppdaterKandidatliste}
            resetStatusTilUnsaved={resetStatusTilUnsaved}
            kandidatlisteInfo={kandidatlisteInfoWrapper(kandidatliste)}
            saving={lagreStatus === Nettstatus.SenderInn}
            onAvbrytClick={onAvbrytClick}
            knappTekst="Lagre endringer"
        />
    </ModalMedKandidatScope>
);

const mapStateToProps = (state: AppState) => ({
    lagreStatus: state.kandidatliste.opprett.lagreStatus,
});

const mapDispatchToProps = (dispatch: Dispatch<KandidatlisteAction>) => ({
    oppdaterKandidatliste: (kandidatlisteInfo: Kandidatlisteinfo) => {
        dispatch({ type: KandidatlisteActionType.OppdaterKandidatliste, kandidatlisteInfo });
    },
    resetStatusTilUnsaved: () => {
        dispatch({ type: KandidatlisteActionType.ResetLagreStatus });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreModal);
