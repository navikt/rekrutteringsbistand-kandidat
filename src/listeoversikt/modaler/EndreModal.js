import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import OpprettKandidatlisteForm from './OpprettKandidatlisteForm';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../common/ModalMedKandidatScope';
import { Nettstatus } from '../../api/remoteData';

const kandidatlisteInfoWrapper = (kandidatliste) => ({
    ...kandidatliste,
    tittel: kandidatliste.tittel || '',
    beskrivelse: kandidatliste.beskrivelse || '',
    oppdragsgiver: kandidatliste.oppdragsgiver || '',
});

const EndreModal = ({
    oppdaterKandidatliste,
    resetStatusTilUnsaved,
    lagreStatus,
    kandidatliste,
    onAvbrytClick,
}) => (
    <ModalMedKandidatScope
        isOpen
        contentLabel="modal endre kandidatliste"
        onRequestClose={onAvbrytClick}
        className="modal--opprett-kandidatliste__veileder"
        closeButton
        appElement={document.getElementById('app')}
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

EndreModal.propTypes = {
    oppdaterKandidatliste: PropTypes.func,
    resetStatusTilUnsaved: PropTypes.func,
    lagreStatus: PropTypes.string,
    onAvbrytClick: PropTypes.func.isRequired,
    kandidatliste: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatliste.opprett.lagreStatus,
});

const mapDispatchToProps = (dispatch) => ({
    oppdaterKandidatliste: (kandidatlisteInfo) => {
        dispatch({ type: KandidatlisteActionType.OppdaterKandidatliste, kandidatlisteInfo });
    },
    resetStatusTilUnsaved: () => {
        dispatch({ type: KandidatlisteActionType.ResetLagreStatus });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreModal);
