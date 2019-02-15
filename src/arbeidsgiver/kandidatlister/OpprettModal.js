import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel } from 'nav-frontend-typografi';
import '../result/matchforklaring/Matchforklaring.less';
import { LAGRE_STATUS } from '../../felles/konstanter';
import OpprettKandidatlisteForm, { tomKandidatlisteInfo } from './OpprettKandidatlisteForm';
import './EndreModal.less';
import { OPPRETT_KANDIDATLISTE, RESET_LAGRE_STATUS } from './kandidatlisteReducer';


const OpprettModal = ({ opprettKandidatliste, resetStatusTilUnsaved, lagreStatus, onAvbrytClick }) => (
    <NavFrontendModal
        isOpen
        contentLabel="modal endre kandidatliste"
        onRequestClose={onAvbrytClick}
        className="modal--endre-kandidatliste"
        closeButton
    >
        <Systemtittel className="blokk-s">Opprett kandidatliste</Systemtittel>
        <OpprettKandidatlisteForm
            onSave={opprettKandidatliste}
            onChange={resetStatusTilUnsaved}
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
    opprettKandidatliste: (kandidatlisteInfo) => { dispatch({ type: OPPRETT_KANDIDATLISTE, kandidatlisteInfo }); },
    resetStatusTilUnsaved: () => { dispatch({ type: RESET_LAGRE_STATUS }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettModal);

