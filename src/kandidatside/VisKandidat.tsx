/* eslint-disable react/no-did-update-set-state */
import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { CvAction, CvActionType, HentCvStatus } from './cv/reducer/cvReducer';
import { Kandidatliste } from '../kandidatliste/kandidatlistetyper';
import { LAGRE_STATUS } from '../common/konstanter';
import {
    lenkeTilCv,
    lenkeTilFinnKandidaterMedStilling,
    lenkeTilFinnKandidaterUtenStilling,
    lenkeTilKandidatliste,
    lenkeTilKandidatsøk,
} from '../app/paths';
import { MidlertidigUtilgjengeligResponse } from './midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { Nettressurs, Nettstatus } from '../api/remoteData';
import { sendEvent } from '../amplitude/amplitude';
import { toUrlQuery } from '../kandidatsøk/reducer/searchQuery';
import AppState from '../AppState';
import Cv, { Kandidatresultat } from './cv/reducer/cv-typer';
import ForrigeNeste from './header/forrige-neste/ForrigeNeste';
import HjelpetekstFading from '../common/HjelpetekstFading';
import IkkeFunnet from './ikke-funnet/IkkeFunnet';
import Kandidatheader from './header/Kandidatheader';
import KandidatlisteAction from '../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from './meny/Kandidatmeny';
import LagreKandidaterModal from '../kandidatsøk/modaler/LagreKandidaterModal';
import LagreKandidaterTilStillingModal from '../kandidatsøk/modaler/LagreKandidaterTilStillingModal';
import MidlertidigUtilgjengelig from './midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import './VisKandidat.less';
import { KandidatsøkAction, KandidatsøkActionType } from '../kandidatsøk/reducer/searchReducer';
import { Dispatch } from 'redux';

type Props = ConnectedProps & {
    kandidatnr: string;
    stillingsId: string | null;
    kandidatlisteId: string | null;
    children: ReactNode;
};

type ConnectedProps = {
    cv: Cv;
    hentCvForKandidat: (kandidatnr: string) => void;
    kandidater: Kandidatresultat[];
    antallKandidater: number;
    lastFlereKandidater: () => void;
    settValgtKandidat: (kandidatnr: string) => void;
    hentStatus: string;
    hentKandidatlisteMedKandidatlisteId: (kandidatlisteId: string) => void;
    hentKandidatlisteMedStillingsId: (stillingsId: string) => void;
    kandidatliste?: Kandidatliste;
    midlertidigUtilgjengelig: Nettressurs<MidlertidigUtilgjengeligResponse>;
    kandidatsøkFilterParams: string;
    lagreKandidatIKandidatlisteStatus: string;
    lagreKandidatIKandidatliste: (
        kandidatliste: Kandidatliste,
        fnr: string,
        kandidatnr: string
    ) => void;
};

type State = {
    gjeldendeKandidat?: number;
    gjeldendeKandidatIndex: number;
    forrigeKandidat?: string;
    nesteKandidat?: string;
    lagreKandidaterModalVises: boolean;
    lagreKandidaterModalTilStillingVises: boolean;
    visKandidatLagret: boolean;
};

class VisKandidat extends React.Component<Props, State> {
    kandidatnummer: string;
    suksessmeldingCallbackId?: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);
        const { kandidatnr } = props;

        this.state = {
            gjeldendeKandidat: this.gjeldendeKandidatIListen(kandidatnr),
            gjeldendeKandidatIndex: this.gjeldendeKandidatIndexIListen(kandidatnr),
            forrigeKandidat: this.forrigeKandidatnummerIListen(kandidatnr),
            nesteKandidat: this.nesteKandidatnummerIListen(kandidatnr),
            lagreKandidaterModalVises: false,
            lagreKandidaterModalTilStillingVises: false,
            visKandidatLagret: false,
        };

        this.kandidatnummer = kandidatnr;
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

    componentDidUpdate(prevProps: Props, prevState: State) {
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

        // TODO: Implementer som en useEffect som reagerer på nytt kandidatnr?
        if (this.kandidatnummer !== this.props.kandidatnr && this.props.kandidatnr !== undefined) {
            this.kandidatnummer = this.props.kandidatnr;
            settValgtKandidat(this.kandidatnummer);
            hentCvForKandidat(this.kandidatnummer);

            this.setState({
                gjeldendeKandidat: this.gjeldendeKandidatIListen(this.kandidatnummer),
                gjeldendeKandidatIndex: this.gjeldendeKandidatIListen(this.kandidatnummer) ?? -1,
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
        if (this.suksessmeldingCallbackId) {
            clearTimeout(this.suksessmeldingCallbackId);
        }
    }

    onLagreKandidatClick = (kandidatlisteId: string | null, stillingsId: string | null) => () => {
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
        if (this.suksessmeldingCallbackId) {
            clearTimeout(this.suksessmeldingCallbackId);
        }

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

    gjeldendeKandidatIListen = (kandidatnummer: string) => {
        const gjeldendeIndex = this.props.kandidater.findIndex(
            (element) => element.arenaKandidatnr === kandidatnummer
        );

        if (gjeldendeIndex === -1) {
            return undefined;
        }

        return gjeldendeIndex + 1;
    };

    gjeldendeKandidatIndexIListen = (kandidatnr: string) => {
        const { kandidater } = this.props;
        return kandidater.findIndex((element) => element.arenaKandidatnr === kandidatnr);
    };

    forrigeKandidatnummerIListen = (kandidatnr: string) => {
        const { kandidater } = this.props;
        const gjeldendeIndex = kandidater.findIndex(
            (element) => element.arenaKandidatnr === kandidatnr
        );
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return kandidater[gjeldendeIndex - 1].arenaKandidatnr;
    };

    nesteKandidatnummerIListen = (kandidatnr: string) => {
        const { kandidater } = this.props;

        const gjeldendeIndex = kandidater.findIndex(
            (element) => element.arenaKandidatnr === kandidatnr
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
            kandidatnr,
        } = this.props;

        const {
            visKandidatLagret,
            gjeldendeKandidatIndex,
            forrigeKandidat,
            nesteKandidat,
            lagreKandidaterModalVises,
            lagreKandidaterModalTilStillingVises,
        } = this.state;

        let tilbakeLink = lenkeTilKandidatsøk(this.props.kandidatsøkFilterParams);
        let forrigeKandidatLink = forrigeKandidat ? lenkeTilCv(forrigeKandidat) : undefined;
        let nesteKandidatLink = nesteKandidat ? lenkeTilCv(nesteKandidat) : undefined;

        if (kandidatlisteId) {
            tilbakeLink = lenkeTilFinnKandidaterUtenStilling(
                kandidatlisteId,
                this.props.kandidatsøkFilterParams
            );

            forrigeKandidatLink = forrigeKandidat
                ? lenkeTilCv(forrigeKandidat, kandidatlisteId)
                : undefined;

            nesteKandidatLink = nesteKandidat
                ? lenkeTilCv(nesteKandidat, kandidatlisteId)
                : undefined;
        } else if (stillingsId) {
            tilbakeLink = lenkeTilFinnKandidaterMedStilling(
                stillingsId,
                this.props.kandidatsøkFilterParams
            );

            forrigeKandidatLink = forrigeKandidat
                ? lenkeTilCv(forrigeKandidat, undefined, stillingsId)
                : undefined;

            nesteKandidatLink = nesteKandidat
                ? lenkeTilCv(nesteKandidat, undefined, stillingsId)
                : undefined;
        }

        const kandidatLiggerAlleredeIKandidatlisten =
            kandidatliste &&
            (stillingsId || kandidatlisteId) &&
            kandidatliste.kandidater.findIndex((kandidat) => kandidat.kandidatnr === kandidatnr) !==
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
                                        to={lenkeTilKandidatliste(kandidatliste!.kandidatlisteId)}
                                        className="lenke"
                                    >
                                        kandidatlisten
                                    </Link>
                                </>
                            ) : (
                                <Hovedknapp
                                    className="vis-kandidat__lagreknapp"
                                    onClick={this.onLagreKandidatClick(
                                        kandidatlisteId,
                                        stillingsId
                                    )}
                                >
                                    Lagre kandidat i kandidatliste
                                </Hovedknapp>
                            )}
                        </Kandidatmeny>
                        {this.props.children}
                        <div className="vis-kandidat__forrige-neste-wrapper">
                            <ForrigeNeste
                                lenkeClass="vis-kandidat__forrige-neste-lenke"
                                forrigeKandidat={forrigeKandidatLink}
                                nesteKandidat={nesteKandidatLink}
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
                {lagreKandidaterModalTilStillingVises && kandidatliste && (
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

const mapStateToProps = (state: AppState) => ({
    cv: state.cv.cv,
    kandidater: state.søk.searchResultat.resultat.kandidater,
    antallKandidater: state.søk.searchResultat.resultat.totaltAntallTreff,
    hentStatus: state.cv.hentStatus,
    kandidatliste:
        state.kandidatliste.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.kandidatliste.data
            : undefined,
    lagreKandidatIKandidatlisteStatus: state.kandidatliste.lagreKandidatIKandidatlisteStatus,
    midlertidigUtilgjengelig: state.midlertidigUtilgjengelig[state.cv.cv.kandidatnummer],
    kandidatsøkFilterParams: toUrlQuery(state),
});

const mapDispatchToProps = (
    dispatch: Dispatch<CvAction | KandidatsøkAction | KandidatlisteAction>
) => ({
    hentCvForKandidat: (arenaKandidatnr: string) =>
        dispatch({ type: CvActionType.FETCH_CV, arenaKandidatnr }),
    lastFlereKandidater: () => dispatch({ type: KandidatsøkActionType.LastFlereKandidater }),
    settValgtKandidat: (kandidatnr: string) =>
        dispatch({ type: KandidatsøkActionType.SettKandidatnummer, kandidatnr }),
    lagreKandidatIKandidatliste: (kandidatliste: Kandidatliste, fnr: string, kandidatnr: string) =>
        dispatch({
            type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE,
            kandidatliste,
            fodselsnummer: fnr,
            kandidatnr,
        }),
    hentKandidatlisteMedKandidatlisteId: (kandidatlisteId: string) =>
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
            kandidatlisteId,
        }),
    hentKandidatlisteMedStillingsId: (stillingsId: string) =>
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID,
            stillingsId,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
