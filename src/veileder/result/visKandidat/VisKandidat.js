/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Knapp } from 'pam-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import cvPropTypes from '../../../felles/PropTypes';
import { HentCvStatus, CvActionType } from '../../cv/reducer/cvReducer.ts';
import VisKandidatPersonalia from '../../cv/VisKandidatPersonalia';
import VisKandidatCv from '../../cv/VisKandidatCv';
import VisKandidatJobbprofil from '../../cv/VisKandidatJobbprofil';
import { getUrlParameterByName } from '../../../felles/sok/utils';
import { SETT_KANDIDATNUMMER, LAST_FLERE_KANDIDATER } from '../../sok/searchReducer';
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

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gjeldendeKandidat: this.gjeldendeKandidatIListen(
                getUrlParameterByName('kandidatNr', window.location.href)
            ),
            gjeldendeKandidatIndex: this.gjeldendeKandidatIndexIListen(
                getUrlParameterByName('kandidatNr', window.location.href)
            ),
            forrigeKandidat: this.forrigeKandidatnummerIListen(
                getUrlParameterByName('kandidatNr', window.location.href)
            ),
            nesteKandidat: this.nesteKandidatnummerIListen(
                getUrlParameterByName('kandidatNr', window.location.href)
            ),
            lagreKandidaterModalVises: false,
            lagreKandidaterModalTilStillingVises: false,
            visKandidatLagret: false,
            visLenkeTilKandidatliste: false,
        };

        this.kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        this.props.hentCvForKandidat(this.kandidatnummer);
        this.props.settValgtKandidat(this.kandidatnummer);

        const {
            kandidatliste,
            match,
            hentKandidatlisteMedKandidatlisteId,
            hentKandidatlisteMedStillingsId,
        } = this.props;
        const kandidatlisteId = match.params.kandidatlisteId;
        const stillingsId = match.params.stillingsId;

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
        const { cv, lagreKandidatIKandidatliste, match } = this.props;
        lagreKandidatIKandidatliste(kandidatliste, cv.fodselsnummer);

        const kandidatlisteId = match.params.kandidatlisteId;
        const stillingsId = match.params.stillingsId;
        if (kandidatlisteId || stillingsId) {
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
            match,
            hentStatus,
            antallKandidater,
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

        const kandidatlisteId = match.params.kandidatlisteId;
        const stillingsId = match.params.stillingsId;
        let tilbakeLink;
        let forrigeKandidatLink;
        let nesteKandidatLink;

        if (kandidatlisteId) {
            tilbakeLink = `/kandidater/kandidatliste/${kandidatlisteId}`;
            forrigeKandidatLink = forrigeKandidat
                ? `/kandidater/kandidatliste/${kandidatlisteId}/cv?kandidatNr=${forrigeKandidat}`
                : undefined;
            nesteKandidatLink = nesteKandidat
                ? `/kandidater/kandidatliste/${kandidatlisteId}/cv?kandidatNr=${nesteKandidat}`
                : undefined;
        } else if (stillingsId) {
            tilbakeLink = `/kandidater/stilling/${stillingsId}`;
            forrigeKandidatLink = forrigeKandidat
                ? `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${forrigeKandidat}`
                : undefined;
            nesteKandidatLink = nesteKandidat
                ? `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${nesteKandidat}`
                : undefined;
        } else {
            tilbakeLink = '/kandidater';
            forrigeKandidatLink = forrigeKandidat
                ? `/kandidater/cv?kandidatNr=${forrigeKandidat}`
                : undefined;
            nesteKandidatLink = nesteKandidat
                ? `/kandidater/cv?kandidatNr=${nesteKandidat}`
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
                <VisKandidatPersonalia
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
                                <div>
                                    Kandidaten er lagret i{' '}
                                    <Link
                                        to={'/kandidater/lister/detaljer/' + kandidatlisteId}
                                        className="lenke"
                                    >
                                        kandidatlisten
                                    </Link>
                                </div>
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
                                            className="frittstaende-lenke LastNed link"
                                            href={`${LAST_NED_CV_URL}/${cv.aktorId}`}
                                            target="_blank"
                                            onClick={() => logEvent('cv_last_ned', 'klikk')}
                                            rel="noopener noreferrer"
                                        >
                                            <span className="link">Last ned CV</span>
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
    match: {
        params: {
            kandidatlisteId: undefined,
            stillingsId: undefined,
        },
    },
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
    match: PropTypes.shape({
        params: PropTypes.shape({
            kandidatlisteId: PropTypes.string,
            stillingsId: PropTypes.string,
        }),
    }),
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
