/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Lenke from 'nav-frontend-lenker';
import { Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import cvPropTypes from '../../../felles/PropTypes';
import { FETCH_CV, HENT_CV_STATUS } from '../../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../../felles/result/visKandidat/VisKandidatJobbprofil';
import { getUrlParameterByName } from '../../../felles/sok/utils';
import { SETT_KANDIDATNUMMER, LAST_FLERE_KANDIDATER } from '../../sok/searchReducer';
import './VisKandidat.less';
import VisKandidatForrigeNeste from '../../../felles/result/visKandidat/VisKandidatForrigeNeste';
import LagreKandidaterModal from '../../../veileder/result/LagreKandidaterModal';
import LagreKandidaterTilStillingModal from '../LagreKandidaterTilStillingModal';
import { LAGRE_KANDIDAT_I_KANDIDATLISTE, HENT_KANDIDATLISTE_MED_STILLINGS_ID } from '../../kandidatlister/kandidatlisteReducer';
import HjelpetekstFading from '../../../felles/common/HjelpetekstFading';
import { LAGRE_STATUS } from '../../../felles/konstanter';

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gjeldendeKandidat: this.gjeldendeKandidatIListen(getUrlParameterByName('kandidatNr', window.location.href)),
            forrigeKandidat: this.forrigeKandidatnummerIListen(getUrlParameterByName('kandidatNr', window.location.href)),
            nesteKandidat: this.nesteKandidatnummerIListen(getUrlParameterByName('kandidatNr', window.location.href)),
            lagreKandidaterModalVises: false,
            lagreKandidaterModalTilStillingVises: false,
            visKandidatLagret: false
        };

        this.kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
    }

    componentDidMount() {
        this.props.hentCvForKandidat(this.kandidatnummer);
        this.props.settValgtKandidat(this.kandidatnummer);
        this.hentKandidatListe();

        if (this.state.gjeldendeKandidat === this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            kandidater,
            antallKandidater,
            settValgtKandidat,
            hentCvForKandidat,
            lastFlereKandidater
        } = this.props;

        const { gjeldendeKandidat } = this.state;

        if (prevProps.kandidater.length < kandidater.length) {
            this.setState({ nesteKandidat: this.nesteKandidatnummerIListen(this.kandidatnummer) });
        }

        const currentUrlKandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        if (this.kandidatnummer !== currentUrlKandidatnummer && currentUrlKandidatnummer !== undefined) {
            this.kandidatnummer = currentUrlKandidatnummer;
            settValgtKandidat(this.kandidatnummer);
            hentCvForKandidat(this.kandidatnummer);
            this.setState({ gjeldendeKandidat: this.gjeldendeKandidatIListen(this.kandidatnummer) });
        }

        if (gjeldendeKandidat !== prevState.gjeldendeKandidat) {
            this.setState({ forrigeKandidat: this.forrigeKandidatnummerIListen(this.kandidatnummer) });
            if (gjeldendeKandidat === kandidater.length && kandidater.length < antallKandidater) {
                lastFlereKandidater();
            } else {
                this.setState({ nesteKandidat: this.nesteKandidatnummerIListen(this.kandidatnummer) });
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(this.suksessmeldingCallbackId);
    }

    onLagreKandidatClick = (stillingsId) => () => {
        this.setState({
            lagreKandidaterModalVises: stillingsId === undefined,
            lagreKandidaterModalTilStillingVises: stillingsId !== undefined
        });
    }

    onCloseLagreKandidaterModal = () => {
        this.setState({
            lagreKandidaterModalVises: false,
            lagreKandidaterModalTilStillingVises: false
        });
    }

    onLagreKandidatliste = (kandidatliste) => {
        const { cv, lagreKandidatIKandidatliste, match } = this.props;
        lagreKandidatIKandidatliste(kandidatliste, cv.fodselsnummer);

        const stillingsId = match.params.stillingsId;
        if (stillingsId) {
            this.visAlertstripeLagreKandidater();
        }
    }

    hentKandidatListe = () => {
        const { kandidatliste, match, hentKandidatliste } = this.props;
        if (kandidatliste === undefined) {
            const stillingsnummer = match.params.stillingsId;
            if (stillingsnummer !== undefined) {
                hentKandidatliste(stillingsnummer);
            }
        }
    }

    visAlertstripeLagreKandidater = () => {
        clearTimeout(this.suksessmeldingCallbackId);
        this.setState({
            lagreKandidaterModalTilStillingVises: false,
            visKandidatLagret: true
        });
        this.suksessmeldingCallbackId = setTimeout(() => {
            this.setState({
                visKandidatLagret: false
            });
        }, 5000);
    };

    gjeldendeKandidatIListen = (kandidatnummer) => {
        const { kandidater } = this.props;
        const gjeldendeIndex = kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex + 1;
    };

    forrigeKandidatnummerIListen = (kandidatnummer) => {
        const { kandidater } = this.props;
        const gjeldendeIndex = kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return kandidater[gjeldendeIndex - 1].arenaKandidatnr;
    };

    nesteKandidatnummerIListen = (kandidatnummer) => {
        const { kandidater } = this.props;
        const gjeldendeIndex = kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === (kandidater.length - 1)) {
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
            kandidatliste
        } = this.props;

        const {
            visKandidatLagret,
            gjeldendeKandidat,
            forrigeKandidat,
            nesteKandidat,
            lagreKandidaterModalVises,
            lagreKandidaterModalTilStillingVises
        } = this.state;

        const stillingsId = match.params.stillingsId;
        let forrigeKandidatLink;
        let nesteKandidatLink;

        if (stillingsId) {
            forrigeKandidatLink = forrigeKandidat ? `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${forrigeKandidat}` : undefined;
            nesteKandidatLink = nesteKandidat ? `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${nesteKandidat}` : undefined;
        } else {
            forrigeKandidatLink = forrigeKandidat ? `/kandidater/cv?kandidatNr=${forrigeKandidat}` : undefined;
            nesteKandidatLink = nesteKandidat ? `/kandidater/cv?kandidatNr=${nesteKandidat}` : undefined;
        }

        if (hentStatus === HENT_CV_STATUS.LOADING) {
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
                    appContext={'veileder'}
                    contextRoot={'kandidater'}
                    stillingsId={stillingsId}
                    gjeldendeKandidat={gjeldendeKandidat}
                    forrigeKandidat={forrigeKandidatLink}
                    nesteKandidat={nesteKandidatLink}
                    antallKandidater={antallKandidater}
                    fantCv={hentStatus === HENT_CV_STATUS.SUCCESS}
                />
                {hentStatus === HENT_CV_STATUS.FINNES_IKKE ? (
                    <div className="cvIkkeFunnet">
                        <div className="content">
                            <Element tag="h3" className="blokk-s">Kandidaten kan ikke vises</Element>
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
                        <div className="VisKandidat-knapperad">
                            <div className="content">
                                <Lenke className="frittstaende-lenke ForlateSiden" href={`https://app.adeo.no/veilarbpersonflatefs/${cv.fodselsnummer}`} target="_blank">
                                    <span className="lenke">Se aktivitetsplan</span>
                                    <i className="ForlateSiden__icon" />
                                </Lenke>
                                <Knapp
                                    onClick={this.onLagreKandidatClick(stillingsId)}
                                    mini
                                >
                                    Lagre kandidat i kandidatliste
                                </Knapp>
                            </div>
                        </div>
                        <VisKandidatJobbprofil cv={cv} />
                        <VisKandidatCv cv={cv} />
                        <div className="navigering-forrige-neste_wrapper">
                            <VisKandidatForrigeNeste
                                lenkeClass={'header--personalia__lenke--veileder'}
                                forrigeKandidat={forrigeKandidatLink}
                                nesteKandidat={nesteKandidatLink}
                                gjeldendeKandidat={gjeldendeKandidat}
                                antallKandidater={antallKandidater}
                            />
                        </div>
                    </div>
                )}
                {lagreKandidaterModalVises &&
                    <LagreKandidaterModal
                        vis={lagreKandidaterModalVises}
                        onRequestClose={this.onCloseLagreKandidaterModal}
                        onLagre={this.onLagreKandidatliste}
                    />
                }
                {lagreKandidaterModalTilStillingVises &&
                    <LagreKandidaterTilStillingModal
                        vis={lagreKandidaterModalTilStillingVises}
                        onRequestClose={this.onCloseLagreKandidaterModal}
                        onLagre={this.onLagreKandidatliste}
                        antallMarkerteKandidater={1}
                        kandidatliste={kandidatliste}
                        stillingsoverskrift={kandidatliste.tittel}
                    />
                }
                <HjelpetekstFading
                    synlig={visKandidatLagret && lagreKandidatIKandidatlisteStatus === LAGRE_STATUS.SUCCESS}
                    type="suksess"
                    tekst={`${'Kandidaten'} er lagret i kandidatlisten «${kandidatliste ? kandidatliste.tittel : ''}»`}
                    id="hjelpetekstfading"
                />
            </div>
        );
    }
}

VisKandidat.defaultProps = {
    match: {
        params: {
            stillingsId: undefined
        }
    },
    antallKandidater: undefined,
    kandidat: {
        arenaKandidatnr: undefined,
        mestRelevanteYrkeserfaring: {}
    },
    kandidatliste: undefined
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
            stillingsId: PropTypes.string
        })
    }),
    hentKandidatliste: PropTypes.func.isRequired,
    kandidatliste: PropTypes.shape({
        kandidatlisteId: PropTypes.string,
        tittel: PropTypes.string
    }),
    lagreKandidatIKandidatliste: PropTypes.func.isRequired,
    lagreKandidatIKandidatlisteStatus: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    cv: state.cvReducer.cv,
    kandidater: state.search.searchResultat.resultat.kandidater,
    antallKandidater: state.search.searchResultat.resultat.totaltAntallTreff,
    hentStatus: state.cvReducer.hentStatus,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste,
    lagreKandidatIKandidatlisteStatus: state.kandidatlister.lagreKandidatIKandidatlisteStatus
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr }),
    lastFlereKandidater: () => dispatch({ type: LAST_FLERE_KANDIDATER }),
    settValgtKandidat: (kandidatnummer) => dispatch({ type: SETT_KANDIDATNUMMER, kandidatnr: kandidatnummer }),
    lagreKandidatIKandidatliste: (kandidatliste, fodselsnummer) => dispatch({ type: LAGRE_KANDIDAT_I_KANDIDATLISTE, kandidatliste, fodselsnummer }),
    hentKandidatliste: (stillingsId) => dispatch({ type: HENT_KANDIDATLISTE_MED_STILLINGS_ID, stillingsnummer: stillingsId })
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
