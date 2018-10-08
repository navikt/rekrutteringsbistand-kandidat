import React from 'react';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';
import cvPropTypes from '../../PropTypes';
import { FETCH_CV } from '../../sok/cv/cvReducer';
import VisKandidatPersonalia from './VisKandidatPersonalia';
import VisKandidatCv from './VisKandidatCv';
import VisKandidatJobbprofil from './VisKandidatJobbprofil';
import LagreKandidaterModal from '../LagreKandidaterModal';
import sortByDato from '../../common/SortByDato';
import { getUrlParameterByName } from '../../sok/utils';
import { LEGG_TIL_KANDIDATER } from '../../kandidatlister/kandidatlisteReducer';
import { LAGRE_STATUS } from '../../konstanter';

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lagreKandidaterModalVises: false
        };
        this.kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
    }
    componentDidMount() {
        this.props.hentCvForKandidat(this.kandidatnummer);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.lukkeLagreKandidaterModal();
        }
    }

    onLagreKandidatlister = (kandidatlisteIder) => {
        let mestRelevanteYrkeserfaring;
        if (this.props.kandidater.find((k) => k.arenaKandidatnr === this.kandidatnummer)) {
            mestRelevanteYrkeserfaring = this.props.kandidater.find((k) => k.arenaKandidatnr === this.kandidatnummer);
            mestRelevanteYrkeserfaring = mestRelevanteYrkeserfaring ? mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
        } else {
            mestRelevanteYrkeserfaring = this.props.cv.yrkeserfaring ? sortByDato(this.props.cv.yrkeserfaring).pop() : undefined;
            mestRelevanteYrkeserfaring = mestRelevanteYrkeserfaring ? mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
        }
        this.props.leggTilKandidaterIKandidatliste([{
            kandidatnr: this.kandidatnummer,
            sisteArbeidserfaring: mestRelevanteYrkeserfaring
        }], kandidatlisteIder);
    };

    aapneLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: true
        });
    };
    lukkeLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: false
        });
    };

    render() {
        const { cv, isFetchingCv } = this.props;

        if (isFetchingCv) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div>
                {this.state.lagreKandidaterModalVises &&
                <LagreKandidaterModal
                    onRequestClose={this.lukkeLagreKandidaterModal}
                    onLagre={this.onLagreKandidatlister}
                />}
                <VisKandidatPersonalia cv={cv} />
                {this.props.visKandidatlister &&
                <div className="container--lagre-knapp">
                    <Knapp className="knapp--mini" onClick={this.aapneLagreKandidaterModal}>
                        Lagre kandidaten
                    </Knapp>
                </div>}
                <VisKandidatJobbprofil cv={cv} />
                <VisKandidatCv cv={cv} />
            </div>
        );
    }
}

VisKandidat.defaultProps = {
    matchforklaring: undefined
};

VisKandidat.propTypes = {
    cv: cvPropTypes.isRequired,
    isFetchingCv: PropTypes.bool.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    leggTilKandidaterIKandidatliste: PropTypes.func.isRequired,
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    visKandidatlister: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv,
    matchforklaring: state.cvReducer.matchforklaring,
    kandidater: state.search.searchResultat.resultat.kandidater,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    visKandidatlister: state.search.featureToggles['vis-kandidatlister']
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr }),
    leggTilKandidaterIKandidatliste: (kandidater, kandidatlisteIder) => {
        dispatch({ type: LEGG_TIL_KANDIDATER, kandidater, kandidatlisteIder });
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
