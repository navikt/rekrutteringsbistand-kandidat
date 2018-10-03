import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import cvPropTypes from '../PropTypes';
import { FETCH_CV } from '../sok/cv/cvReducer';
import { getUrlParameterByName } from '../sok/utils';
import VisKandidatPersonalia from '../result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../result/visKandidat/VisKandidatJobbprofil';
import SlettIkon from '../common/ikoner/SlettIkon';
import { SLETT_KANDIDATER } from './kandidatlisteReducer';
import { SLETTE_STATUS } from '../konstanter';

import './VisKandidatFraLister.less';

class VisKandidatFraLister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sletterKandidat: false,
            visSlettKandidatModal: false,
            visSlettKandidatFeilmelding: false
        };
    }

    componentDidMount() {
        this.props.hentCvForKandidat(this.props.kandidatnummer);
    }

    // static getDerivedStateFromProps(props, state) {
    //     if (state.sletterKandidat) {
    //         const visSlettKandidatModal = (
    //             state.sletterKandidat &&
    //             props.sletteStatus !== SLETTE_STATUS.SUCCESS
    //         );

    //         const visSlettKandidatFeilmelding = (
    //             state.sletterKandidat &&
    //             props.sletteStatus === SLETTE_STATUS.FAILURE
    //         );

    //         return {
    //             ...state,
    //             visSlettKandidatModal,
    //             visSlettKandidatFeilmelding,
    //             sletterKandidater: false
    //         };
    //     }

    //     return null;
    // }

    visSlettKandidatFeilmelding = () => {
        this.setState({ visSlettKandidatFeilmelding: true });
    }

    slettKandidat = () => {
        const { kandidatlisteId } = this.props;
        const kandidat = [{ kandidatnr: this.props.kandidatnummer }];
        this.props.slettKandidater(kandidatlisteId, kandidat);
        this.setState({ sletterKandidat: true });
    }

    visSlettKandidatModal = () => {
        this.setState({ visSlettKandidatModal: true });
    }

    lukkSlettModal = () => {
        this.setState({ visSlettKandidatModal: false, visSlettKandidatFeilmelding: false });
    }

    render() {
        const { cv, kandidatlisteId, isFetchingCv } = this.props;

        const Knapper = () => (
            <div className="viskandidat__knapperad">
                {/* <div
                    role="button"
                    tabIndex="0"
                    className="knapp--ikon"
                    onKeyPress={() => {}}
                    onClick={() => {}}
                >
                    <PrinterIkon />
                    <Normaltekst>Skriv ut</Normaltekst>
                </div> */}
                <div
                    role="button"
                    tabIndex="0"
                    className="knapp--ikon"
                    onKeyPress={this.visSlettKandidatModal}
                    onClick={this.visSlettKandidatModal}
                >
                    <SlettIkon fargeKode="#000" />
                    <Normaltekst>Slett</Normaltekst>
                </div>
            </div>
        );

        const SlettKandidaterModal = () => (
            <Modal
                className="KandidatlisteDetalj__modal"
                isOpen={this.state.visSlettKandidatModal}
                onRequestClose={this.lukkSlettModal}
                closeButton
                contentLabel="Slett kandidat"
            >
                {this.state.visSlettKandidatFeilmelding && (
                    <AlertStripeAdvarsel className="feilmleding">Noe gikk galt under sletting av kandidater</AlertStripeAdvarsel>
                )}
                <Sidetittel>Slett kandidat</Sidetittel>
                <br />
                <Normaltekst>Er du sikker på at du vil slette {this.props.kandidatnummer} fra listen?</Normaltekst>
                <div className="knapperad">
                    <Hovedknapp onClick={this.slettKandidat}>Slett</Hovedknapp>
                    <Flatknapp onClick={this.lukkSlettModal}>Avbryt</Flatknapp>
                </div>
            </Modal>
        );

        if (this.props.sletteStatus === SLETTE_STATUS.SUCCESS) {
            return <Redirect to={`/pam-kandidatsok/lister/detaljer/${kandidatlisteId}`} push />;
        }
        if (isFetchingCv) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div>
                <VisKandidatPersonalia cv={cv} kandidatListe={kandidatlisteId} />
                <div className="viskandidat-container">
                    <Knapper />
                    <VisKandidatJobbprofil cv={cv} />
                    <VisKandidatCv cv={cv} />
                </div>
                <SlettKandidaterModal />
            </div>
        );
    }
}

VisKandidatFraLister.defaultProps = {
    matchforklaring: undefined
};

VisKandidatFraLister.propTypes = {
    kandidatnummer: PropTypes.string.isRequired,
    cv: cvPropTypes.isRequired,
    isFetchingCv: PropTypes.bool.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    slettKandidater: PropTypes.func.isRequired,
    sletteStatus: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => ({
    kandidatnummer: getUrlParameterByName('kandidatNr', window.location.href),
    kandidatlisteId: props.match.params.listeid,
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv,
    sletteStatus: state.kandidatlister.detaljer.sletteStatus,
    matchforklaring: state.cvReducer.matchforklaring
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr }),
    slettKandidater: (kandidatlisteId, kandidater) => dispatch({ type: SLETT_KANDIDATER, kandidatlisteId, kandidater })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
