import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Systemtittel } from 'nav-frontend-typografi';
import OpprettKandidatlisteForm, { tomKandidatlisteInfo } from './OpprettKandidatlisteForm';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import { Nettstatus } from '../../api/Nettressurs';
import KandidatlisteAction, {
    Kandidatlisteinfo,
} from '../../kandidatliste/reducer/KandidatlisteAction';
import AppState from '../../AppState';

type Props = ConnectedProps & {
    onAvbrytClick: () => void;
};

type ConnectedProps = {
    opprettKandidatliste: (info: Kandidatlisteinfo) => void;
    resetStatusTilUnsaved: () => void;
    lagreStatus: Nettstatus;
};

const OpprettModal: FunctionComponent<Props> = ({
    opprettKandidatliste,
    resetStatusTilUnsaved,
    lagreStatus,
    onAvbrytClick,
}) => (
    <ModalMedKandidatScope
        open
        aria-label="Opprett kandidatliste"
        onClose={onAvbrytClick}
        className="modal--opprett-kandidatliste__veileder"
    >
        <Systemtittel className="blokk-s">Opprett kandidatliste</Systemtittel>
        <OpprettKandidatlisteForm
            onSave={opprettKandidatliste}
            resetStatusTilUnsaved={resetStatusTilUnsaved}
            kandidatlisteInfo={tomKandidatlisteInfo()}
            saving={lagreStatus === Nettstatus.SenderInn}
            onAvbrytClick={onAvbrytClick}
            knappTekst="Opprett"
        />
    </ModalMedKandidatScope>
);

const mapStateToProps = (state: AppState) => ({
    lagreStatus: state.kandidatliste.opprett.lagreStatus,
});

const mapDispatchToProps = (dispatch: Dispatch<KandidatlisteAction>) => ({
    opprettKandidatliste: (kandidatlisteInfo: Kandidatlisteinfo) => {
        dispatch({ type: KandidatlisteActionType.OpprettKandidatliste, kandidatlisteInfo });
    },
    resetStatusTilUnsaved: () => {
        dispatch({ type: KandidatlisteActionType.ResetLagreStatus });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettModal);
