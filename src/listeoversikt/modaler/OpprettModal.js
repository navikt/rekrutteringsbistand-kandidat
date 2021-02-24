import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import { LAGRE_STATUS } from '../../common/konstanter';
import OpprettKandidatlisteForm, { tomKandidatlisteInfo } from './OpprettKandidatlisteForm';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../common/ModalMedKandidatScope';

const OpprettModal = ({
    opprettKandidatliste,
    resetStatusTilUnsaved,
    lagreStatus,
    onAvbrytClick,
}) => (
    <ModalMedKandidatScope
        isOpen
        contentLabel="modal opprett kandidatliste"
        onRequestClose={onAvbrytClick}
        className="modal--opprett-kandidatliste__veileder"
        closeButton
        appElement={document.getElementById('app')}
    >
        <Systemtittel className="blokk-s">Opprett kandidatliste</Systemtittel>
        <OpprettKandidatlisteForm
            onSave={opprettKandidatliste}
            resetStatusTilUnsaved={resetStatusTilUnsaved}
            kandidatlisteInfo={tomKandidatlisteInfo()}
            saving={lagreStatus === LAGRE_STATUS.LOADING}
            onAvbrytClick={onAvbrytClick}
            knappTekst="Opprett"
        />
    </ModalMedKandidatScope>
);

OpprettModal.propTypes = {
    opprettKandidatliste: PropTypes.func,
    resetStatusTilUnsaved: PropTypes.func,
    lagreStatus: PropTypes.string,
    onAvbrytClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatliste.opprett.lagreStatus,
});

const mapDispatchToProps = (dispatch) => ({
    opprettKandidatliste: (kandidatlisteInfo) => {
        dispatch({ type: KandidatlisteActionType.OPPRETT_KANDIDATLISTE, kandidatlisteInfo });
    },
    resetStatusTilUnsaved: () => {
        dispatch({ type: KandidatlisteActionType.RESET_LAGRE_STATUS });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettModal);
