import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel } from 'nav-frontend-typografi';
import { LAGRE_STATUS } from '../../felles/konstanter';
import OpprettKandidatlisteForm, { tomKandidatlisteInfo } from './OpprettKandidatlisteForm';
import { KandidatlisteTypes } from './kandidatlisteReducer.ts';

const OpprettModal = ({ opprettKandidatliste, resetStatusTilUnsaved, lagreStatus, onAvbrytClick }) => (
    <NavFrontendModal
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
    </NavFrontendModal>
);

OpprettModal.propTypes = {
    opprettKandidatliste: PropTypes.func.isRequired,
    resetStatusTilUnsaved: PropTypes.func.isRequired,
    lagreStatus: PropTypes.string.isRequired,
    onAvbrytClick: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus
});

const mapDispatchToProps = (dispatch) => ({
    opprettKandidatliste: (kandidatlisteInfo) => { dispatch({ type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE, kandidatlisteInfo }); },
    resetStatusTilUnsaved: () => { dispatch({ type: KandidatlisteTypes.RESET_LAGRE_STATUS }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettModal);

