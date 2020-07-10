/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';

import { CvActionType, HentCvStatus } from './cv/reducer/cvReducer.ts';
import { KandidatQueryParam } from './Kandidatside';
import { LAGRE_STATUS } from '../../felles/konstanter';
import { LAST_FLERE_KANDIDATER, SETT_KANDIDATNUMMER } from '../sok/searchReducer';
import { sendEvent } from '../amplitude/amplitude';
import { Nettstatus } from '../../felles/common/remoteData.ts';
import cvPropTypes from '../../felles/PropTypes';
import ForrigeNeste from './header/forrige-neste/ForrigeNeste.tsx';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading.tsx';
import IkkeFunnet from './ikke-funnet/IkkeFunnet';
import Kandidatheader from './header/Kandidatheader';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from './meny/Kandidatmeny';
import LagreKandidaterModal from '../result/LagreKandidaterModal';
import LagreKandidaterTilStillingModal from '../result/LagreKandidaterTilStillingModal';
import MidlertidigUtilgjengelig from './midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import './VisKandidat.less';
import { lenkeTilCv } from '../application/paths';

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        const { kandidatNr } = props;

        this.state = {
            gjeldendeKandidat: this.gjeldendeKandidatIListen(kandidatNr),
            gjeldendeKandidatIndex: this.gjeldendeKandidatIndexIListen(kandidatNr),
            forrigeKandidat: this.forrigeKandidatnummerIListen(kandidatNr),
            nesteKandidat: this.nesteKandidatnummerIListen(kandidatNr),
            lagreKandidaterModalVises: false,
            lagreKandidaterModalTilStillingVises: false,
            visKandidatLagret: false,
        };

        this.kandidatnummer = kandidatNr;
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        this.props.hentCvForKandidat(this.kandidatnummer);
        this.props.settValgtKandidat(this.kandidatnummer);

        const {
            kandidatliste,
            kandidatlisteId,
            stillingsId,
            hentKandidatlisteMedKandidatlisteId,
            hentKandidatlisteMedStillingsId,
        } = this.props;

        if (kandidatliste === undefined) {
            if (kandidatlisteId) {
                hentKandidatlisteMedKandidatlisteId(kandidatlisteId);
            } else if (stillingsId) {
                hentKandidatlisteMedStillingsId(stillingsId);
            }
        }

        if (this.state.gjeldendeKandidat === this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }

        sendEvent('cv', 'visning');
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            kandidater,
            antallKandidater,
            settValgtKandidat,
            hentCvForKandidat,
            lastFlereKandidater,
        } = this.props;

        const { gjeldendeKandidat } = this.state;

        if (prevProps.kandidater.length < kandidater.length) {
            this.setState({ nesteKandidat: this.nesteKandidatnummerIListen(this.kandidatnummer) });
        }

        if (this.kandidatnummer !== this.props.kandidatNr && this.props.kandidatNr !== undefined) {
            this.kandidatnummer = this.props.kandidatNr;
            settValgtKandidat(this.kandidatnummer);
            hentCvForKandidat(this.kandidatnummer);
            this.setState({
                gjeldendeKandidat: this.gjeldendeKandidatIListen(this.kandidatnummer),
                gjeldendeKandidatIndex: this.gjeldendeKandidatIListen(this.kandidatnummer) - 1,
            });
        }

        if (gjeldendeKandidat !== prevState.gjeldendeKandidat) {
            window.scrollTo(0, 0);
            sendEvent('cv', 'visning');
            this.setState({
                forrigeKandidat: this.forrigeKandidatnummerIListen(this.kandidatnummer),
            });
            if (gjeldendeKandidat === kandidater.length && kandidater.length < antallKandidater) {
                lastFlereKandidater();
            } else {
                this.setState({
                    nesteKandidat: this.nesteKandidatnummerIListen(this.kandidatnummer),
                });
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(this.suksessmeldingCallbackId);
    }

    onLagreKandidatClick = (kandidatlisteId, stillingsId) => () => {
        this.setState({
            lagreKandidaterModalVises: kandidatlisteId === null && stillingsId === null,
            lagreKandidaterModalTilStillingVises: kandidatlisteId !== null || stillingsId !== null,
        });
    };

    onCloseLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: false,
            lagreKandidaterModalTilStillingVises: false,
        });
    };

    onLagreKandidatliste = (kandidatliste) => {
        const { cv, lagreKandidatIKandidatliste } = this.props;
        lagreKandidatIKandidatliste(kandidatliste, cv.fodselsnummer, cv.kandidatnummer);
        sendEvent('cv', 'lagre_kandidat_i_kandidatliste');

        if (this.props.kandidatlisteId || this.props.stillingsId) {
            this.visAlertstripeLagreKandidater();
        }
    };

    visAlertstripeLagreKandidater = () => {
        clearTimeout(this.suksessmeldingCallbackId);
        this.setState({
            lagreKandidaterModalTilStillingVises: false,
            visKandidatLagret: true,
        });
        this.suksessmeldingCallbackId = setTimeout(() => {
            this.setState({
                visKandidatLagret: false,
            });
        }, 5000);
    };

    gjeldendeKandidatIListen = (kandidatnummer) => {
        const { kandidater } = this.props;
        const gjeldendeIndex = kandidater.findIndex(
            (element) => element.arenaKandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex + 1;
    };

    gjeldendeKandidatIndexIListen = (kandidatnummer) => {
        const { kandidater } = this.props;
        return kandidater.findIndex((element) => element.arenaKandidatnr === kandidatnummer);
    };

    forrigeKandidatnummerIListen = (kandidatnummer) => {
        const { kandidater } = this.props;
        const gjeldendeIndex = kandidater.findIndex(
            (element) => element.arenaKandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return kandidater[gjeldendeIndex - 1].arenaKandidatnr;
    };

    nesteKandidatnummerIListen = (kandidatnummer) => {
        const { kandidater } = this.props;
        const gjeldendeIndex = kandidater.findIndex(
            (element) => element.arenaKandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === kandidater.length - 1) {
            return undefined;
        }
        return kandidater[gjeldendeIndex + 1].arenaKandidatnr;
    };

    render() {
        const {
            cv,
            hentStatus,
            antallKandidater,
            kandidatlisteId,
            stillingsId,
            lagreKandidatIKandidatlisteStatus,
            kandidatliste,
            midlertidigUtilgjengelig,
            kandidatNr,
        } = this.props;

        const {
            visKandidatLagret,
            gjeldendeKandidat,
            gjeldendeKandidatIndex,
            forrigeKandidat,
            nesteKandidat,
            lagreKandidaterModalVises,
            lagreKandidaterModalTilStillingVises,
        } = this.state;

        let tilbakeLink = '/kandidater';
        let forrigeKandidatLink = forrigeKandidat ? lenkeTilCv(forrigeKandidat) : undefined;
        let nesteKandidatLink = nesteKandidat ? lenkeTilCv(nesteKandidat) : undefined;

        if (kandidatlisteId) {
            tilbakeLink = `/kandidater/kandidatliste/${kandidatlisteId}`;
            forrigeKandidatLink = forrigeKandidat
                ? (forrigeKandidatLink += `?${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`)
                : undefined;

            nesteKandidatLink = nesteKandidat
                ? (nesteKandidatLink += `?${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`)
                : undefined;
        } else if (stillingsId) {
            tilbakeLink = `/kandidater/stilling/${stillingsId}`;

            forrigeKandidatLink = forrigeKandidat
                ? (forrigeKandidatLink += `?${KandidatQueryParam.StillingId}=${stillingsId}`)
                : undefined;

            nesteKandidatLink = nesteKandidat
                ? (nesteKandidatLink += `?${KandidatQueryParam.StillingId}=${stillingsId}`)
                : undefined;
        }

        const kandidatLiggerAlleredeIKandidatlisten =
            kandidatliste &&
            (stillingsId || kandidatlisteId) &&
            kandidatliste.kandidater.findIndex((kandidat) => kandidat.kandidatnr === kandidatNr) !==
                -1;

        if (hentStatus === HentCvStatus.Loading || hentStatus === HentCvStatus.IkkeHentet) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }

        return (
            <div>
                <Kandidatheader
                    cv={cv}
                    tilbakeLink={tilbakeLink}
                    antallKandidater={antallKandidater}
                    gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                    nesteKandidat={nesteKandidatLink}
                    forrigeKandidat={forrigeKandidatLink}
                    fantCv={hentStatus === HentCvStatus.Success}
                />
                {hentStatus === HentCvStatus.FinnesIkke ? (
                    <IkkeFunnet />
                ) : (
                    <>
                        <Kandidatmeny fødselsnummer={cv.fodselsnummer}>
                            <MidlertidigUtilgjengelig
                                midlertidigUtilgjengelig={midlertidigUtilgjengelig}
                                kandidatnr={cv.kandidatnummer}
                            />
                            {kandidatLiggerAlleredeIKandidatlisten ? (
                                <>
                                    Kandidaten er lagret i&nbsp;
                                    <Link
                                        to={
                                            '/kandidater/lister/detaljer/' +
                                            kandidatliste.kandidatlisteId
                                        }
                                        className="lenke"
                                    >
                                        kandidatlisten
                                    </Link>
                                </>
                            ) : (
                                <Knapp
                                    mini
                                    type="flat"
                                    onClick={this.onLagreKandidatClick(
                                        kandidatlisteId,
                                        stillingsId
                                    )}
                                >
                                    Lagre kandidat i kandidatliste
                                </Knapp>
                            )}
                        </Kandidatmeny>
                        {this.props.children}
                        <div className="vis-kandidat__forrige-neste-wrapper">
                            <ForrigeNeste
                                lenkeClass="vis-kandidat__forrige-neste-lenke"
                                forrigeKandidat={forrigeKandidatLink}
                                nesteKandidat={nesteKandidatLink}
                                gjeldendeKandidat={gjeldendeKandidat}
                                antallKandidater={antallKandidater}
                                gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                            />
                        </div>
                    </>
                )}
                {lagreKandidaterModalVises && (
                    <LagreKandidaterModal
                        vis={lagreKandidaterModalVises}
                        onRequestClose={this.onCloseLagreKandidaterModal}
                        onLagre={this.onLagreKandidatliste}
                    />
                )}
                {lagreKandidaterModalTilStillingVises && (
                    <LagreKandidaterTilStillingModal
                        vis={lagreKandidaterModalTilStillingVises}
                        onRequestClose={this.onCloseLagreKandidaterModal}
                        onLagre={this.onLagreKandidatliste}
                        antallMarkerteKandidater={1}
                        kandidatliste={kandidatliste}
                        isSaving={lagreKandidatIKandidatlisteStatus === LAGRE_STATUS.LOADING}
                    />
                )}
                <HjelpetekstFading
                    synlig={
                        visKandidatLagret &&
                        lagreKandidatIKandidatlisteStatus === LAGRE_STATUS.SUCCESS
                    }
                    type="suksess"
                    innhold={`${'Kandidaten'} er lagret i kandidatlisten «${
                        kandidatliste ? kandidatliste.tittel : ''
                    }»`}
                    id="hjelpetekstfading"
                />
            </div>
        );
    }
}

VisKandidat.defaultProps = {
    kandidatlisteId: undefined,
    stillingsId: undefined,
    antallKandidater: undefined,
    kandidat: {
        arenaKandidatnr: undefined,
        mestRelevanteYrkeserfaring: {},
    },
    kandidatliste: undefined,
};

VisKandidat.propTypes = {
    cv: cvPropTypes.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    antallKandidater: PropTypes.number,
    lastFlereKandidater: PropTypes.func.isRequired,
    settValgtKandidat: PropTypes.func.isRequired,
    hentStatus: PropTypes.string.isRequired,
    kandidatlisteId: PropTypes.string,
    stillingsId: PropTypes.string,
    hentKandidatlisteMedKandidatlisteId: PropTypes.func.isRequired,
    hentKandidatlisteMedStillingsId: PropTypes.func.isRequired,
    kandidatliste: PropTypes.shape({
        kandidatlisteId: PropTypes.string,
        tittel: PropTypes.string,
    }),
    lagreKandidatIKandidatliste: PropTypes.func.isRequired,
    lagreKandidatIKandidatlisteStatus: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    cv: state.cv.cv,
    kandidater: state.søk.searchResultat.resultat.kandidater,
    antallKandidater: state.søk.searchResultat.resultat.totaltAntallTreff,
    hentStatus: state.cv.hentStatus,
    kandidatliste:
        state.kandidatliste.detaljer.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.detaljer.kandidatliste.data
            : undefined,
    lagreKandidatIKandidatlisteStatus: state.kandidatliste.lagreKandidatIKandidatlisteStatus,
    midlertidigUtilgjengelig: state.midlertidigUtilgjengelig[state.cv.cv.kandidatnummer],
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) =>
        dispatch({ type: CvActionType.FETCH_CV, arenaKandidatnr }),
    lastFlereKandidater: () => dispatch({ type: LAST_FLERE_KANDIDATER }),
    settValgtKandidat: (kandidatnummer) =>
        dispatch({ type: SETT_KANDIDATNUMMER, kandidatnr: kandidatnummer }),
    lagreKandidatIKandidatliste: (kandidatliste, fodselsnummer, kandidatnr) =>
        dispatch({
            type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE,
            kandidatliste,
            fodselsnummer,
            kandidatnr,
        }),
    hentKandidatlisteMedKandidatlisteId: (kandidatlisteId) =>
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
            kandidatlisteId,
        }),
    hentKandidatlisteMedStillingsId: (stillingsId) =>
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID,
            stillingsId,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
