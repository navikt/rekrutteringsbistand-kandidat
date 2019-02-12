import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel } from 'nav-frontend-typografi';
import '../result/matchforklaring/Matchforklaring.less';
import { LAGRE_STATUS } from '../../felles/konstanter';
import OpprettKandidatlisteForm from './OpprettKandidatlisteForm';
import './EndreModal.less';
import { OPPDATER_KANDIDATLISTE, RESET_LAGRE_STATUS } from './kandidatlisteReducer';
import { KandidatlisteBeskrivelse } from './Kandidatlister';

const kandidatlisteInfoWrapper = (kandidatliste) => ({
    ...kandidatliste,
    tittel: kandidatliste.tittel || '',
    beskrivelse: kandidatliste.beskrivelse || '',
    oppdragsgiver: kandidatliste.oppdragsgiver || ''

});

const EndreModal = ({ lagreKandidatliste, resetStatusTilUnsaved, lagreStatus, kandidatliste, onAvbrytClick }) => (
    <NavFrontendModal
        isOpen
        contentLabel="modal endre kandidatliste"
        onRequestClose={onAvbrytClick}
        className="modal--endre-kandidatliste"
        closeButton
    >
        <Systemtittel className="blokk-s">Endre kandidatlisten</Systemtittel>
        <OpprettKandidatlisteForm
            onSave={lagreKandidatliste}
            onChange={resetStatusTilUnsaved}
            kandidatlisteInfo={kandidatlisteInfoWrapper(kandidatliste)}
            saving={lagreStatus === LAGRE_STATUS.LOADING}
            onAvbrytClick={onAvbrytClick}
            knappTekst="Lagre"
        />
    </NavFrontendModal>
);

EndreModal.propTypes = {
    lagreKandidatliste: PropTypes.func.isRequired,
    resetStatusTilUnsaved: PropTypes.func.isRequired,
    lagreStatus: PropTypes.string.isRequired,
    onAvbrytClick: PropTypes.func.isRequired,
    kandidatliste: PropTypes.shape(KandidatlisteBeskrivelse).isRequired
};

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus
});

const mapDispatchToProps = (dispatch) => ({
    lagreKandidatliste: (kandidatlisteInfo) => { dispatch({ type: OPPDATER_KANDIDATLISTE, kandidatlisteInfo }); },
    resetStatusTilUnsaved: () => { dispatch({ type: RESET_LAGRE_STATUS }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreModal);

