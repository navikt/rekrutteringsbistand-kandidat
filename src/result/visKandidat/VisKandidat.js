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

    onLagreKandidatlister = (kandidatlisteIder) => {
        let mestRelevanteYrkeserfaring;
        if (this.props.kandidater.find((k) => k.arenaKandidatnr === this.kandidatnummer) !== undefined) {
            mestRelevanteYrkeserfaring = this.props.kandidater.find((k) => k.arenaKandidatnr === this.kandidatnummer);
        } else {
            mestRelevanteYrkeserfaring = this.props.cv.yrkeserfaring ? sortByDato(this.props.cv.yrkeserfaring).pop() : undefined;
        }
        this.props.leggTilKandidaterIKandidatliste([{
            kandidatnr: this.kandidatnummer,
            sisteArbeidserfaring: mestRelevanteYrkeserfaring !== undefined ? mestRelevanteYrkeserfaring.styrkKodeStillingstittel : ''
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
                <div className="container--lagre-knapp">
                    <Knapp className="knapp--mini" onClick={this.aapneLagreKandidaterModal}>
                        Lagre kandidaten
                    </Knapp>
                </div>
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
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired

};

const mapStateToProps = (state) => ({
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv,
    matchforklaring: state.cvReducer.matchforklaring,
    kandidater: state.search.searchResultat.resultat.kandidater
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr }),
    leggTilKandidaterIKandidatliste: (kandidater, kandidatlisteIder) => {
        dispatch({ type: LEGG_TIL_KANDIDATER, kandidater, kandidatlisteIder });
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
