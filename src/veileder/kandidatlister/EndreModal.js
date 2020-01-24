import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel } from 'nav-frontend-typografi';
import { LAGRE_STATUS } from '../../felles/konstanter';
import OpprettKandidatlisteForm from './OpprettKandidatlisteForm';
import { KandidatlisteTypes } from './kandidatlisteReducer.ts';
import { KandidatlisteBeskrivelse } from './Kandidatlister';

const kandidatlisteInfoWrapper = kandidatliste => ({
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
    <NavFrontendModal
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
    </NavFrontendModal>
);

EndreModal.propTypes = {
    oppdaterKandidatliste: PropTypes.func.isRequired,
    resetStatusTilUnsaved: PropTypes.func.isRequired,
    lagreStatus: PropTypes.string.isRequired,
    onAvbrytClick: PropTypes.func.isRequired,
    kandidatliste: PropTypes.shape(KandidatlisteBeskrivelse).isRequired,
};

const mapStateToProps = state => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus,
});

const mapDispatchToProps = dispatch => ({
    oppdaterKandidatliste: kandidatlisteInfo => {
        dispatch({ type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE, kandidatlisteInfo });
    },
    resetStatusTilUnsaved: () => {
        dispatch({ type: KandidatlisteTypes.RESET_LAGRE_STATUS });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreModal);
