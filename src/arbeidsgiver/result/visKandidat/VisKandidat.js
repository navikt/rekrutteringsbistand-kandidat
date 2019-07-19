/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { connect } from 'react-redux';
import { Knapp } from 'pam-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import cvPropTypes from '../../../felles/PropTypes';
import { FETCH_CV, HENT_CV_STATUS } from '../../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../../felles/result/visKandidat/VisKandidatJobbprofil';
import LagreKandidaterModal from '../LagreKandidaterModal';
import HjelpetekstFading from '../../../felles/common/HjelpetekstFading.tsx';
import sortByDato from '../../../felles/common/SortByDato';
import { getUrlParameterByName } from '../../../felles/sok/utils';
import { KandidatlisteTypes } from '../../kandidatlister/kandidatlisteReducer.ts';
import { LAGRE_STATUS } from '../../../felles/konstanter';
import Matchdetaljer from '../matchforklaring/Matchdetaljer';
import { MatchexplainProptypes } from '../matchforklaring/Proptypes';
import { CONTEXT_ROOT, USE_JANZZ } from '../../common/fasitProperties';
import { LAST_FLERE_KANDIDATER, SETT_KANDIDATNUMMER } from '../../sok/searchReducer';
import VisKandidatForrigeNeste from '../../../felles/result/visKandidat/VisKandidatForrigeNeste';
import './VisKandidat.less';

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lagreKandidaterModalVises: false,
            suksessmeldingLagreKandidatVises: false,
            gjeldendeKandidat: this.gjeldendeKandidatIListen(getUrlParameterByName('kandidatNr', window.location.href)),
            forrigeKandidat: this.forrigeKandidatnummerIListen(getUrlParameterByName('kandidatNr', window.location.href)),
            nesteKandidat: this.nesteKandidatnummerIListen(getUrlParameterByName('kandidatNr', window.location.href)),
            nesteProfil: this.nesteProfilIListen(getUrlParameterByName('kandidatNr', window.location.href)),
            forrigeProfil: this.forrigeProfilIListen(getUrlParameterByName('kandidatNr', window.location.href))

        };

        this.kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        this.profilId = getUrlParameterByName('profilId', window.location.href);
        this.sisteSokId = getUrlParameterByName('sisteSokId', window.location.href);
    }

    componentDidMount() {
        if (USE_JANZZ) {
            document.title = 'Kandidatmatch - Arbeidsplassen - Cv';
        }
        this.props.hentCvForKandidat(this.kandidatnummer, this.profilId, this.sisteSokId);
        this.props.settValgtKandidat(this.kandidatnummer);

        if (this.state.gjeldendeKandidat === this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.lukkeLagreKandidaterModal();
            this.visAlertstripeLagreKandidater();
        }

        if (prevProps.kandidater.length < this.props.kandidater.length) {
            this.setState({ nesteKandidat: this.nesteKandidatnummerIListen(this.kandidatnummer) });
            this.setState({ nesteProfil: this.nesteProfilIListen(this.kandidatnummer) });
        }

        const currentUrlKandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        const currentUrlSisteSokId = getUrlParameterByName('sisteSokId', window.location.href);
        const currentUrlProfilId = getUrlParameterByName('profilId', window.location.href);

        if (this.kandidatnummer !== currentUrlKandidatnummer && currentUrlKandidatnummer !== undefined) {
            this.kandidatnummer = currentUrlKandidatnummer;
            this.props.settValgtKandidat(this.kandidatnummer);
            this.props.hentCvForKandidat(this.kandidatnummer, currentUrlProfilId, currentUrlSisteSokId);
            this.setState({ gjeldendeKandidat: this.gjeldendeKandidatIListen(this.kandidatnummer) });
        }

        if (this.state.gjeldendeKandidat !== prevState.gjeldendeKandidat) {
            this.setState({ forrigeKandidat: this.forrigeKandidatnummerIListen(this.kandidatnummer) });
            this.setState({ forrigeProfil: this.forrigeProfilIListen(this.kandidatnummer) });
            if (this.state.gjeldendeKandidat === this.props.kandidater.length && this.props.kandidater.length < this.props.antallKandidater && !USE_JANZZ) {
                this.props.lastFlereKandidater();
            } else {
                this.setState({ nesteKandidat: this.nesteKandidatnummerIListen(this.kandidatnummer) });
                this.setState({ nesteProfil: this.nesteProfilIListen(this.kandidatnummer) });
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

    gjeldendeKandidatIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex + 1;
    };

    forrigeKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.props.kandidater[gjeldendeIndex - 1].arenaKandidatnr;
    };

    forrigeProfilIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.props.kandidater[gjeldendeIndex - 1].profilId;
    };

    nesteKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === (this.props.kandidater.length - 1)) {
            return undefined;
        }
        return this.props.kandidater[gjeldendeIndex + 1].arenaKandidatnr;
    };

    nesteProfilIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === (this.props.kandidater.length - 1)) {
            return undefined;
        }
        return this.props.kandidater[gjeldendeIndex + 1].profilId;
    };

    render() {
        const { cv, antallKandidater, hentStatus, kandidater } = this.props;

        const profilUrlForrigePostfix = USE_JANZZ && this.sisteSokId && this.state.forrigeProfil ? `&profilId=${this.state.forrigeProfil}&sisteSokId=${this.sisteSokId}` : '';
        const profilUrlNestePostfix = USE_JANZZ && this.sisteSokId && this.state.nesteProfil ? `&profilId=${this.state.nesteProfil}&sisteSokId=${this.sisteSokId}` : '';
        const forrigeKandidatLink =
            this.state.forrigeKandidat
                ? `/${CONTEXT_ROOT}/cv?kandidatNr=${this.state.forrigeKandidat}${profilUrlForrigePostfix}`
                : undefined;
        const nesteKandidatLink =
            this.state.nesteKandidat
                ? `/${CONTEXT_ROOT}/cv?kandidatNr=${this.state.nesteKandidat}${profilUrlNestePostfix}`
                : undefined;

        if (hentStatus === HENT_CV_STATUS.LOADING) {
            return (
                <div className="fullscreen-spinner">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div>
                <HjelpetekstFading
                    synlig={this.state.suksessmeldingLagreKandidatVises}
                    type="suksess"
                    innhold="Kandidaten er lagt til"
                />
                {this.state.lagreKandidaterModalVises &&
                <LagreKandidaterModal
                    onRequestClose={this.lukkeLagreKandidaterModal}
                    onLagre={this.onLagreKandidatlister}
                />}
                <VisKandidatPersonalia
                    cv={cv}
                    appContext={'arbeidsgiver'}
                    tilbakeLink={`/${CONTEXT_ROOT}`}
                    gjeldendeKandidat={this.state.gjeldendeKandidat}
                    forrigeKandidat={forrigeKandidatLink}
                    nesteKandidat={nesteKandidatLink}
                    antallKandidater={USE_JANZZ ? kandidater.length : antallKandidater}
                    fantCv={hentStatus === HENT_CV_STATUS.SUCCESS}
                />
                {hentStatus === HENT_CV_STATUS.FINNES_IKKE ? (
                    <div className="cvIkkeFunnet">
                        <div className="content">
                            <Element tag="h2" className="blokk-s">Kandidaten kan ikke vises</Element>
                            <div>
                                <Normaltekst>Mulige årsaker:</Normaltekst>
                                <ul>
                                    <li className="blokk-xxs"><Normaltekst>Kandidaten har skiftet status</Normaltekst></li>
                                    <li><Normaltekst>Tekniske problemer</Normaltekst></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="container--lagre-knapp">
                            <Knapp className="knapp--mini" onClick={this.aapneLagreKandidaterModal}>
                                Lagre kandidaten
                            </Knapp>
                        </div>
                        {this.props.matchforklaring && (
                            <Matchdetaljer matchforklaring={this.props.matchforklaring} />
                        )}
                        <VisKandidatJobbprofil cv={cv} />
                        <VisKandidatCv cv={cv} />
                        <div className="navigering-forrige-neste_wrapper">
                            <VisKandidatForrigeNeste
                                lenkeClass="VisKandidat__ForrigeNeste"
                                gjeldendeKandidat={this.state.gjeldendeKandidat}
                                forrigeKandidat={forrigeKandidatLink}
                                nesteKandidat={nesteKandidatLink}
                                antallKandidater={USE_JANZZ ? kandidater.length : antallKandidater}
                            />
                        </div>
                    </div>
                )}
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
    hentStatus: PropTypes.string.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    leggTilKandidaterIKandidatliste: PropTypes.func.isRequired,
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    antallKandidater: PropTypes.number,
    lastFlereKandidater: PropTypes.func.isRequired,
    matchforklaring: MatchexplainProptypes,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    settValgtKandidat: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    cv: state.cvReducer.cv,
    hentStatus: state.cvReducer.hentStatus,
    matchforklaring: state.cvReducer.matchforklaring,
    kandidater: state.search.searchResultat.resultat.kandidater,
    antallKandidater: state.search.searchResultat.resultat.totaltAntallTreff,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr, profilId, sisteSokId) => dispatch({ type: FETCH_CV, arenaKandidatnr, profilId, sisteSokId }),
    leggTilKandidaterIKandidatliste: (kandidater, kandidatlisteIder) => dispatch({ type: KandidatlisteTypes.LEGG_TIL_KANDIDATER, kandidater, kandidatlisteIder }),
    lastFlereKandidater: () => dispatch({ type: LAST_FLERE_KANDIDATER }),
    settValgtKandidat: (kandidatnummer) => dispatch({ type: SETT_KANDIDATNUMMER, kandidatnr: kandidatnummer })
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
