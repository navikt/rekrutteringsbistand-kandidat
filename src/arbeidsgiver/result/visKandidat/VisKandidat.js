/* eslint-disable react/no-did-update-set-state */
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
import { LAST_FLERE_KANDIDATER, SETT_KANDIDATNUMMER } from '../../sok/searchReducer';
import VisKandidatForrigeNeste from '../../../felles/result/visKandidat/VisKandidatForrigeNeste';

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lagreKandidaterModalVises: false,
            suksessmeldingLagreKandidatVises: false,
            kandidatIndex: this.returnerKandidatIndex(getUrlParameterByName('kandidatNr', window.location.href)),
            forrigeKandidat: this.returnerForrigeKandidatnummerIListen(getUrlParameterByName('kandidatNr', window.location.href)),
            nesteKandidat: this.returnerNesteKandidatnummerIListen(getUrlParameterByName('kandidatNr', window.location.href))
        };

        this.kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        this.profilId = getUrlParameterByName('profilId', window.location.href);
        this.sisteSokId = getUrlParameterByName('sisteSokId', window.location.href);
    }

    componentDidMount() {
        this.props.hentCvForKandidat(this.kandidatnummer, this.profilId, this.sisteSokId);
        this.props.settValgtKandidat(this.kandidatnummer);

        if (this.state.kandidatIndex === this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.lukkeLagreKandidaterModal();
            this.visAlertstripeLagreKandidater();
        }

        if (prevProps.kandidater.length < this.props.kandidater.length) {
            this.setState({ nesteKandidat: this.returnerNesteKandidatnummerIListen(this.kandidatnummer) });
        }

        const currentUrlKandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        if (this.kandidatnummer !== currentUrlKandidatnummer && currentUrlKandidatnummer !== undefined) {
            this.kandidatnummer = currentUrlKandidatnummer;
            this.props.settValgtKandidat(this.kandidatnummer);
            this.props.hentCvForKandidat(this.kandidatnummer);
            this.setState({ kandidatIndex: this.returnerKandidatIndex(this.kandidatnummer) });
        }

        if (this.state.kandidatIndex !== prevState.kandidatIndex) {
            this.setState({ forrigeKandidat: this.returnerForrigeKandidatnummerIListen(this.kandidatnummer) });
            if (this.state.kandidatIndex === this.props.kandidater.length && this.props.kandidater.length < this.props.antallKandidater) {
                this.props.lastFlereKandidater();
            } else {
                this.setState({ nesteKandidat: this.returnerNesteKandidatnummerIListen(this.kandidatnummer) });
            }
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

    returnerKandidatIndex = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex + 1;
    };

    returnerForrigeKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.props.kandidater[gjeldendeIndex - 1].arenaKandidatnr;
    };

    returnerNesteKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === (this.props.kandidater.length - 1)) {
            return undefined;
        }
        return this.props.kandidater[gjeldendeIndex + 1].arenaKandidatnr;
    };

    render() {
        const { cv, isFetchingCv, antallKandidater } = this.props;
        const forrigeKandidatLink = this.state.forrigeKandidat ? `/${CONTEXT_ROOT}/cv?kandidatNr=${this.state.forrigeKandidat}` : undefined;
        const nesteKandidatLink = this.state.nesteKandidat ? `/${CONTEXT_ROOT}/cv?kandidatNr=${this.state.nesteKandidat}` : undefined;

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
                <VisKandidatPersonalia
                    cv={cv}
                    appContext={'arbeidsgiver'}
                    contextRoot={CONTEXT_ROOT}
                    kandidatIndex={this.state.kandidatIndex}
                    forrigeKandidat={forrigeKandidatLink}
                    nesteKandidat={nesteKandidatLink}
                    antallKandidater={antallKandidater}
                />
                <div className="container--lagre-knapp">
                    <Knapp className="knapp--mini" onClick={this.aapneLagreKandidaterModal}>
                        Lagre kandidaten
                    </Knapp>
                </div>
                {this.props.matchforklaring && (
                    <div className="match-explanation-container">
                        <Matchdetaljer matchforklaring={this.props.matchforklaring} />
                    </div>
                )}
                <VisKandidatJobbprofil cv={cv} />
                <VisKandidatCv cv={cv} />
                <div className="navigering-forrige-neste_wrapper">
                    <VisKandidatForrigeNeste
                        lenkeClass={'header--personalia__lenke--veileder'}
                        kandidatIndex={this.state.kandidatIndex}
                        forrigeKandidat={forrigeKandidatLink}
                        nesteKandidat={nesteKandidatLink}
                        antallKandidater={antallKandidater}
                    />
                </div>
            </div>
        );
    }
}

VisKandidat.defaultProps = {
    matchforklaring: undefined,
    antallKandidater: undefined
};

VisKandidat.propTypes = {
    cv: cvPropTypes.isRequired,
    isFetchingCv: PropTypes.bool.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    leggTilKandidaterIKandidatliste: PropTypes.func.isRequired,
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    antallKandidater: PropTypes.number,
    lastFlereKandidater: PropTypes.func.isRequired,
    matchforklaring: MatchexplainProptypesGrouped,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    settValgtKandidat: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv,
    matchforklaring: state.cvReducer.matchforklaring,
    kandidater: state.search.searchResultat.resultat.kandidater,
    antallKandidater: state.search.searchResultat.resultat.totaltAntallTreff,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr, profilId, sisteSokId) => dispatch({ type: FETCH_CV, arenaKandidatnr, profilId, sisteSokId }),
    leggTilKandidaterIKandidatliste: (kandidater, kandidatlisteIder) => dispatch({ type: LEGG_TIL_KANDIDATER, kandidater, kandidatlisteIder }),
    lastFlereKandidater: () => dispatch({ type: LAST_FLERE_KANDIDATER }),
    settValgtKandidat: (kandidatnummer) => dispatch({ type: SETT_KANDIDATNUMMER, kandidatnr: kandidatnummer })
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
