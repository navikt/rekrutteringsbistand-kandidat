import React from 'react';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';
import cvPropTypes from '../../../felles/PropTypes';
import { FETCH_CV } from '../../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../../felles/result/visKandidat/VisKandidatJobbprofil';
import LagreKandidaterModal from '../LagreKandidaterModal';
import HjelpetekstFading from '../../../felles/common/HjelpetekstFading';
import sortByDato from '../../../felles/common/SortByDato';
import { getUrlParameterByName } from '../../../felles/sok/utils';
import { LEGG_TIL_KANDIDATER } from '../../kandidatlister/kandidatlisteReducer';
import { LAGRE_STATUS } from '../../../felles/konstanter';
import Matchdetaljer from '../matchforklaring/Matchdetaljer';
import { MatchexplainProptypesGrouped } from '../matchforklaring/Proptypes';
import { CONTEXT_ROOT } from '../../common/fasitProperties';
import { SETT_KANDIDATNUMMER } from '../../sok/searchReducer';

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lagreKandidaterModalVises: false,
            suksessmeldingLagreKandidatVises: false
        };
        this.kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        this.kandidater = this.props.kandidater;
    }

    componentDidMount() {
        this.props.hentCvForKandidat(this.kandidatnummer);
        this.props.settValgtKandidat(this.kandidatnummer);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.lukkeLagreKandidaterModal();
            this.visAlertstripeLagreKandidater();
        }

        const currentUrlKandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        if (this.kandidatnummer !== currentUrlKandidatnummer && currentUrlKandidatnummer !== undefined) {
            this.kandidatnummer = currentUrlKandidatnummer;
            this.props.settValgtKandidat(this.kandidatnummer);
            this.props.hentCvForKandidat(this.kandidatnummer);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.suksessmeldingCallbackId);
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

    visAlertstripeLagreKandidater = () => {
        clearTimeout(this.suksessmeldingCallbackId);
        this.setState({
            suksessmeldingLagreKandidatVises: true
        });
        this.suksessmeldingCallbackId = setTimeout(() => {
            this.setState({
                suksessmeldingLagreKandidatVises: false
            });
        }, 5000);
    };

    returnerForrigeKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.kandidater[gjeldendeIndex - 1].arenaKandidatnr;
    };

    returnerNesteKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === (this.props.kandidater.length - 1)) {
            return undefined;
        }
        return this.kandidater[gjeldendeIndex + 1].arenaKandidatnr;
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
                <HjelpetekstFading
                    synlig={this.state.suksessmeldingLagreKandidatVises}
                    type="suksess"
                    tekst="Kandidaten er lagt til"
                />
                {this.state.lagreKandidaterModalVises &&
                <LagreKandidaterModal
                    onRequestClose={this.lukkeLagreKandidaterModal}
                    onLagre={this.onLagreKandidatlister}
                />}
                <VisKandidatPersonalia cv={cv} contextRoot={CONTEXT_ROOT} forrigeKandidat={this.returnerForrigeKandidatnummerIListen(this.kandidatnummer)} nesteKandidat={this.returnerNesteKandidatnummerIListen(this.kandidatnummer)} />
                <div className="container--lagre-knapp">
                    <Knapp className="knapp--mini" onClick={this.aapneLagreKandidaterModal}>
                        Lagre kandidaten
                    </Knapp>
                </div>
                <VisKandidatJobbprofil cv={cv} />
                <VisKandidatCv cv={cv} />

                {this.props.matchforklaring && (
                    <div className="match-explanation-container">
                        <Matchdetaljer matchforklaring={this.props.matchforklaring} />
                    </div>
                )}
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
    matchforklaring: MatchexplainProptypesGrouped,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    settValgtKandidat: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv,
    matchforklaring: state.cvReducer.matchforklaring,
    kandidater: state.search.searchResultat.resultat.kandidater,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr }),
    leggTilKandidaterIKandidatliste: (kandidater, kandidatlisteIder) => {
        dispatch({ type: LEGG_TIL_KANDIDATER, kandidater, kandidatlisteIder });
    },
    settValgtKandidat: (kandidatnummer) => dispatch({ type: SETT_KANDIDATNUMMER, kandidatnr: kandidatnummer })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
