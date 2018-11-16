import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import cvPropTypes from '../../felles/PropTypes';
import { FETCH_CV } from '../sok/cv/cvReducer';
import { getUrlParameterByName } from '../../felles/sok/utils';
import VisKandidatPersonalia from '../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../felles/result/visKandidat/VisKandidatJobbprofil';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import { SLETT_KANDIDATER } from './kandidatlisteReducer';
import { SLETTE_STATUS } from '../../felles/konstanter';

import './VisKandidatFraLister.less';
import '../../felles/common/ikoner/ikoner.less';
import SlettKandidaterModal from '../common/SlettKandidaterModal';
import { CONTEXT_ROOT } from '../common/fasitProperties';

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
        this.props.hentCvForKandidat(this.props.kandidatnummer, this.props.cv.profilId);
    }

    static getDerivedStateFromProps(props, state) {
        if (state.sletterKandidat) {
            const visSlettKandidatModal = (
                props.sletteStatus !== SLETTE_STATUS.SUCCESS
            );

            const visSlettKandidatFeilmelding = (
                props.sletteStatus === SLETTE_STATUS.FAILURE
            );

            return {
                ...state,
                visSlettKandidatModal,
                visSlettKandidatFeilmelding,
                sletterKandidater: false
            };
        }

        return null;
    }

    visSlettKandidatFeilmelding = () => {
        this.setState({ visSlettKandidatFeilmelding: true });
    };

    slettKandidat = () => {
        const { kandidatlisteId } = this.props;
        const kandidat = [{ kandidatnr: this.props.kandidatnummer }];
        this.props.slettKandidater(kandidatlisteId, kandidat);
        this.setState({ sletterKandidat: true });
    };

    visSlettKandidatModal = () => {
        this.setState({ visSlettKandidatModal: true });
    };

    lukkSlettModal = () => {
        this.setState({
            visSlettKandidatModal: false,
            visSlettKandidatFeilmelding: false,
            sletterKandidat: false
        });
    };

    render() {
        const { cv, kandidatlisteId, isFetchingCv } = this.props;

        const Knapper = () => (
            <div className="viskandidat__knapperad">
                <Lenkeknapp onClick={this.visSlettKandidatModal} className="Delete">
                    <i className="Delete__icon" />
                    Slett
                </Lenkeknapp>
            </div>
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
                <VisKandidatPersonalia cv={cv} kandidatListe={kandidatlisteId} contextRoot={CONTEXT_ROOT} />
                <div className="viskandidat-container">
                    <Knapper />
                    <VisKandidatJobbprofil cv={cv} />
                    <VisKandidatCv cv={cv} />
                </div>
                <SlettKandidaterModal
                    isOpen={this.state.visSlettKandidatModal}
                    visFeilmelding={this.state.visSlettKandidatFeilmelding}
                    sletterKandidater={this.props.sletteStatus === SLETTE_STATUS.LOADING}
                    valgteKandidater={[cv]}
                    lukkModal={this.lukkSlettModal}
                    onDeleteClick={this.slettKandidat}
                />
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
    hentCvForKandidat: (arenaKandidatnr, profilId) => dispatch({ type: FETCH_CV, arenaKandidatnr, profilId }),
    slettKandidater: (kandidatlisteId, kandidater) => dispatch({ type: SLETT_KANDIDATER, kandidatlisteId, kandidater })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
