/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import cvPropTypes from '../../../felles/PropTypes';
import { CvActionType, HentCvStatus } from '../../cv/reducer/cvReducer.ts';
import CvHeader from '../../cv/header/CvHeader';
import VisKandidatCv from '../../cv/VisKandidatCv';
import VisKandidatJobbprofil from '../../cv/VisKandidatJobbprofil';
import { getUrlParameterByName } from '../../../felles/sok/utils';
import { LAST_FLERE_KANDIDATER, SETT_KANDIDATNUMMER } from '../../sok/searchReducer';
import './VisKandidat.less';
import VisKandidatForrigeNeste from '../../cv/VisKandidatForrigeNeste';
import LagreKandidaterModal from '../../../veileder/result/LagreKandidaterModal';
import LagreKandidaterTilStillingModal from '../LagreKandidaterTilStillingModal';
import HjelpetekstFading from '../../../felles/common/HjelpetekstFading.tsx';
import { LAGRE_STATUS } from '../../../felles/konstanter';
import { Nettstatus } from '../../../felles/common/remoteData.ts';
import { LAST_NED_CV_URL } from '../../common/fasitProperties';
import VisKandidatTilretteleggingsbehov from './VisKandidatTilretteleggingsbehov.tsx';
import KandidatlisteActionType from '../../kandidatlister/reducer/KandidatlisteActionType';
import CVMeny from '../../cv/cv-meny/CVMeny';
import MidlertidigUtilgjengelig from '../../cv/midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import { logEvent } from '../../amplitude/amplitude';
import { Link } from 'react-router-dom';
import { KandidatQueryParam } from '../../kandidat/Kandidatside';

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
            visLenkeTilKandidatliste: false,
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
            if (kandidatlisteId !== undefined) {
                hentKandidatlisteMedKandidatlisteId(kandidatlisteId);
            } else if (stillingsId !== undefined) {
                hentKandidatlisteMedStillingsId(stillingsId);
            }
        }

        if (this.state.gjeldendeKandidat === this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }

        logEvent('cv', 'visning');
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

        const currentUrlKandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        if (
            this.kandidatnummer !== currentUrlKandidatnummer &&
            currentUrlKandidatnummer !== undefined
        ) {
            this.kandidatnummer = currentUrlKandidatnummer;
            settValgtKandidat(this.kandidatnummer);
            hentCvForKandidat(this.kandidatnummer);
            this.setState({
                gjeldendeKandidat: this.gjeldendeKandidatIListen(this.kandidatnummer),
                gjeldendeKandidatIndex: this.gjeldendeKandidatIListen(this.kandidatnummer) - 1,
            });
        }

        if (gjeldendeKandidat !== prevState.gjeldendeKandidat) {
            window.scrollTo(0, 0);
            logEvent('cv', 'visning');
            this.setState({
                forrigeKandidat: this.forrigeKandidatnummerIListen(this.kandidatnummer),
                visLenkeTilKandidatliste: false,
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
            lagreKandidaterModalVises: kandidatlisteId === undefined && stillingsId === undefined,
            lagreKandidaterModalTilStillingVises:
                kandidatlisteId !== undefined || stillingsId !== undefined,
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
        lagreKandidatIKandidatliste(kandidatliste, cv.fodselsnummer);

        if (this.props.kandidatlisteId || this.props.stillingsId) {
            this.visAlertstripeLagreKandidater();
            this.visLenkeTilKandidatliste();
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

    visLenkeTilKandidatliste = () => {
        this.setState({ visLenkeTilKandidatliste: true });
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
        let forrigeKandidatLink = forrigeKandidat
            ? `/kandidater/kandidat/${forrigeKandidat}/cv`
            : undefined;
        let nesteKandidatLink = nesteKandidat
            ? `/kandidater/kandidat/${nesteKandidat}/cv`
            : undefined;

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

        if (hentStatus === HentCvStatus.Loading) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }

        return (
            <div>
                <CvHeader
                    cv={cv}
                    tilbakeLink={tilbakeLink}
                    antallKandidater={antallKandidater}
                    gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                    nesteKandidat={nesteKandidatLink}
                    forrigeKandidat={forrigeKandidatLink}
                    fantCv={hentStatus === HentCvStatus.Success}
                />
                {hentStatus === HentCvStatus.FinnesIkke ? (
                    <div className="cvIkkeFunnet">
                        <div className="content">
                            <Element tag="h2" className="blokk-s">
                                Kandidaten kan ikke vises
                            </Element>
                            <div>
                                <Normaltekst>Mulige årsaker:</Normaltekst>
                                <ul>
                                    <li className="blokk-xxs">
                                        <Normaltekst>Kandidaten har skiftet status</Normaltekst>
                                    </li>
                                    <li>
                                        <Normaltekst>Tekniske problemer</Normaltekst>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <CVMeny fødselsnummer={cv.fodselsnummer}>
                            <MidlertidigUtilgjengelig
                                midlertidigUtilgjengelig={midlertidigUtilgjengelig}
                                kandidatnr={cv.kandidatnummer}
                            />
                            {this.state.visLenkeTilKandidatliste ? (
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
                        </CVMeny>
                        <div className="VisKandidat-knapperad">
                            <div className="content">
                                <div className="lenker">
                                    {this.props.visLastNedCvLenke && (
                                        <a
                                            className="LastNed lenke"
                                            href={`${LAST_NED_CV_URL}/${cv.aktorId}`}
                                            target="_blank"
                                            onClick={() => logEvent('cv_last_ned', 'klikk')}
                                            rel="noopener noreferrer"
                                        >
                                            <span>Last ned CV</span>
                                            <i className="LastNed__icon" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <VisKandidatJobbprofil cv={cv} />
                        <VisKandidatCv cv={cv} />
                        {cv.tilretteleggingsbehov && (
                            <VisKandidatTilretteleggingsbehov fnr={cv.fodselsnummer} />
                        )}
                        <div className="navigering-forrige-neste_wrapper">
                            <VisKandidatForrigeNeste
                                lenkeClass={'header--personalia__lenke--veileder'}
                                forrigeKandidat={forrigeKandidatLink}
                                nesteKandidat={nesteKandidatLink}
                                gjeldendeKandidat={gjeldendeKandidat}
                                antallKandidater={antallKandidater}
                                gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                            />
                        </div>
                    </div>
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
    visLastNedCvLenke: PropTypes.bool.isRequired,
    lagreKandidatIKandidatlisteStatus: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    cv: state.cv.cv,
    kandidater: state.search.searchResultat.resultat.kandidater,
    antallKandidater: state.search.searchResultat.resultat.totaltAntallTreff,
    hentStatus: state.cv.hentStatus,
    kandidatliste:
        state.kandidatlister.detaljer.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatlister.detaljer.kandidatliste.data
            : undefined,
    lagreKandidatIKandidatlisteStatus: state.kandidatlister.lagreKandidatIKandidatlisteStatus,
    visLastNedCvLenke: state.search.featureToggles['vis-last-ned-cv-lenke'],
    midlertidigUtilgjengelig: state.midlertidigUtilgjengelig[state.cv.cv.kandidatnummer],
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) =>
        dispatch({ type: CvActionType.FETCH_CV, arenaKandidatnr }),
    lastFlereKandidater: () => dispatch({ type: LAST_FLERE_KANDIDATER }),
    settValgtKandidat: (kandidatnummer) =>
        dispatch({ type: SETT_KANDIDATNUMMER, kandidatnr: kandidatnummer }),
    lagreKandidatIKandidatliste: (kandidatliste, fodselsnummer) =>
        dispatch({
            type: KandidatlisteActionType.LAGRE_KANDIDAT_I_KANDIDATLISTE,
            kandidatliste,
            fodselsnummer,
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
