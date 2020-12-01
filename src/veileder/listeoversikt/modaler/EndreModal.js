import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import { LAGRE_STATUS } from '../../../felles/konstanter';
import OpprettKandidatlisteForm from './OpprettKandidatlisteForm';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../../ModalMedKandidatScope';

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
            saving={lagreStatus === LAGRE_STATUS.LOADING}
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
        dispatch({ type: KandidatlisteActionType.OPPDATER_KANDIDATLISTE, kandidatlisteInfo });
    },
    resetStatusTilUnsaved: () => {
        dispatch({ type: KandidatlisteActionType.RESET_LAGRE_STATUS });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreModal);
