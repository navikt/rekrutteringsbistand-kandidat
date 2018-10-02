import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel } from 'nav-frontend-typografi';
import '../result/modal/Modal.less';
import { LAGRE_STATUS } from '../konstanter';
import OpprettKandidatlisteForm from './OpprettKandidatlisteForm';
import './EndreModal.less';
import { OPPDATER_KANDIDATLISTE, RESET_LAGRE_STATUS } from './kandidatlisteReducer';
import { KandidatlisteBeskrivelse } from './Kandidatlister';

class EndreModal extends React.Component {
    componentWillMount() {
        // The modal gives an error if the Modal is trying to set the app element to document.body
        // before it exists. Have to add this to set the document.body element.
        NavFrontendModal.setAppElement('main');
    }

    render() {
        const { lagreKandidatliste, resetStatusTilUnsaved, lagreStatus, kandidatliste, onAvbrytClick } = this.props;
        return (
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
                    backLink="/pam-kandidatsok/lister"
                    kandidatlisteInfo={kandidatliste}
                    saving={lagreStatus === LAGRE_STATUS.LOADING}
                    onAvbrytClick={onAvbrytClick}
                />
            </NavFrontendModal>
        );
    }
}

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

