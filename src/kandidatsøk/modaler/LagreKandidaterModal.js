/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Systemtittel, Undertekst } from 'nav-frontend-typografi';
import { Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Kandidatliste } from '../../kandidatliste/PropTypes';
import { formaterDato } from '../../utils/dateUtils';
import { capitalizeEmployerName } from '../utils';
import HjelpetekstFading from '../../common/varsling/HjelpetekstFading.tsx';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Søkeknapp } from 'nav-frontend-ikonknapper';
import { ListeoversiktActionType } from '../../listeoversikt/reducer/ListeoversiktAction';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import { Nettstatus } from '../../api/Nettressurs';
import './LagreKandidaterModal.less';

const PAGINERING_BATCH_SIZE = 5;

class LagreKandidaterModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatlister: [],
            annonsenummer: '',
            hentetListe: undefined,
            showHentetListe: false,
            hentListeFeilmelding: undefined,
            ingenMarkerteListerFeilmelding: undefined,
            visKandidaterLagret: false,
            visAlertstripeOnSuccess: false,
        };
    }

    componentDidMount() {
        this.props.hentEgneKandidatlister(0, PAGINERING_BATCH_SIZE);
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.hentListerStatus !== this.props.hentListerStatus &&
            this.props.hentListerStatus === Nettstatus.Suksess
        ) {
            this.setState({
                kandidatlister: [
                    ...this.state.kandidatlister,
                    ...this.props.egneKandidatlister.map((liste) => ({
                        ...liste,
                        alleredeLagtTil: false,
                    })),
                ],
            });
        }
        if (
            prevProps.hentListeMedAnnonsenummerStatus !==
                this.props.hentListeMedAnnonsenummerStatus ||
            prevProps.hentListeMedAnnonsenummerStatusMessage !==
                this.props.hentListeMedAnnonsenummerStatusMessage
        ) {
            if (this.props.hentListeMedAnnonsenummerStatus === Nettstatus.Suksess) {
                this.setState({
                    showHentetListe: true,
                    hentListeFeilmelding: undefined,
                    hentetListe: this.props.kandidatlisteMedAnnonsenummer,
                });
            } else if (this.props.hentListeMedAnnonsenummerStatus === Nettstatus.FinnesIkke) {
                this.props.hentListeMedAnnonsenummerStatusMessage &&
                this.props.hentListeMedAnnonsenummerStatusMessage.includes(
                    'Kandidatliste for stilling'
                )
                    ? this.setState({
                          hentetListe: undefined,
                          showHentetListe: false,
                          hentListeFeilmelding:
                              'Stillingen har ingen kandidatliste. Gå til stillingen og opprett kandidatliste.',
                      })
                    : this.setState({
                          hentetListe: undefined,
                          showHentetListe: false,
                          hentListeFeilmelding: 'Stillingen finnes ikke',
                      });
                this.input.focus();
            } else if (this.props.hentListeMedAnnonsenummerStatus === Nettstatus.Feil) {
                this.setState({
                    hentetListe: undefined,
                    showHentetListe: false,
                    hentListeFeilmelding: 'En feil oppstod',
                });
                this.input.focus();
            }
        }
        if (
            this.state.visAlertstripeOnSuccess &&
            this.props.leggTilKandidaterStatus === Nettstatus.Suksess
        ) {
            this.visAlertstripeLagreKandidater();
        }
    }

    componentWillUnmount() {
        if (this.suksessmeldingCallbackId) {
            clearTimeout(this.suksessmeldingCallbackId);
        }
        this.props.resetKandidatlisterSokekriterier();
    }

    onVisFlereListerClick = () => {
        const pagenumber = this.props.kandidatlisterSokeKriterier.pagenumber;
        this.props.hentEgneKandidatlister(pagenumber + 1, PAGINERING_BATCH_SIZE);
    };

    visAlertstripeLagreKandidater = () => {
        clearTimeout(this.suksessmeldingCallbackId);
        this.setState({
            visKandidaterLagret: true,
            visAlertstripeOnSuccess: false,
        });
        this.suksessmeldingCallbackId = setTimeout(() => {
            this.setState({
                visKandidaterLagret: false,
            });
        }, 5000);
    };

    onAnnonsenummerChange = (event) => {
        const annonsenummer = event.target.value;

        const regex = /^\d*$/;
        const inneholderKunSifferEllerTomString = regex.test(annonsenummer);

        if (inneholderKunSifferEllerTomString) {
            this.setState({ annonsenummer });
        }
    };

    onKeyDown = (e) => {
        switch (e.keyCode) {
            case 13: // Enter
                e.preventDefault();
                this.hentListeMedAnnonsenummer();
                break;
            default:
                break;
        }
    };

    hentListeMedAnnonsenummer = () => {
        if (!this.state.annonsenummer) {
            this.setState({
                hentetListe: undefined,
                showHentetListe: false,
                hentListeFeilmelding: undefined,
            });
        } else {
            this.props.hentKandidatlisteMedAnnonsenummer(this.state.annonsenummer);
        }
    };

    onLagreKandidat = (kandidatliste) => {
        const kandidatlister = this.state.kandidatlister.map((liste) =>
            liste.kandidatlisteId === kandidatliste.kandidatlisteId
                ? { ...liste, alleredeLagtTil: true }
                : liste
        );
        this.setState({
            kandidatlister,
            visAlertstripeOnSuccess: true,
        });
        this.props.onLagre(kandidatliste);
    };

    onLagreHentetKandidat = (kandidatliste) => () => {
        this.onLagreKandidat(kandidatliste);
        this.setState({
            hentetListe: { ...kandidatliste, alleredeLagtTil: true },
        });
    };

    render() {
        const {
            vis,
            onRequestClose,
            hentListerStatus,
            antallKandidatlister,
            leggTilKandidaterStatus,
            lagretKandidatliste,
            antallLagredeKandidater,
        } = this.props;
        const {
            kandidatlister,
            hentetListe,
            showHentetListe,
            hentListeFeilmelding,
            visKandidaterLagret,
        } = this.state;

        const ListerTableHeader = () => (
            <Row className="lister--rader">
                <Element className="opprettet__col rader--text">Opprettet</Element>
                <Element className="stillingstittel__col rader--text">
                    Tittel på kandidatliste
                </Element>
                <Element className="arbeidsgiver__col rader--text">Arbeidsgiver</Element>
                <Element className="leggTil__col rader--text">Lagre kandidater</Element>
            </Row>
        );

        const ListerTableRow = ({ liste, onClick, id, className }) => {
            return (
                <Row className={className}>
                    <Undertekst className="opprettet--dato__col rader--text rader--text__dato">
                        {formaterDato(liste.opprettetTidspunkt)}
                    </Undertekst>
                    <Normaltekst className="stillingstittel__col rader--text">
                        {liste.tittel}
                    </Normaltekst>
                    <Normaltekst className="arbeidsgiver__col rader--text">
                        {capitalizeEmployerName(liste.organisasjonNavn || '')}
                    </Normaltekst>
                    <div className="leggTil__col rowItem">
                        {liste.alleredeLagtTil && leggTilKandidaterStatus !== Nettstatus.Feil ? (
                            <div
                                className="ikon__lagtTil"
                                aria-label={`Lagre i liste: ${liste.tittel}`}
                            />
                        ) : (
                            <Knapp
                                id={id}
                                onClick={onClick}
                                aria-label={`Lagre i liste: ${liste.tittel}`}
                                kompakt
                            >
                                +
                            </Knapp>
                        )}
                    </div>
                </Row>
            );
        };

        const ListerTableRows = () =>
            kandidatlister.map((liste) => (
                <ListerTableRow
                    liste={liste}
                    id={`marker-liste-${liste.kandidatlisteId}-checkbox`}
                    className="lister--rader"
                    onClick={() => this.onLagreKandidat(liste)}
                    key={liste.kandidatlisteId}
                />
            ));

        return (
            <ModalMedKandidatScope
                open={vis}
                onClose={onRequestClose}
                aria-label="Lagre kandidater"
                className="LagreKandidaterModal"
            >
                <div>
                    {lagretKandidatliste && (
                        <HjelpetekstFading
                            synlig={visKandidaterLagret}
                            type="suksess"
                            innhold={`${
                                antallLagredeKandidater > 1
                                    ? `${antallLagredeKandidater} kandidater`
                                    : 'Kandidaten'
                            } er lagret i kandidatlisten «${lagretKandidatliste.tittel}»`}
                            id="hjelpetekstfading"
                            className="LagreKandidaterModal__hjelpetekst"
                        />
                    )}
                    <div className="LagreKandidaterModal--wrapper">
                        <Systemtittel className="tittel">Lagre kandidater</Systemtittel>
                        <Row className="lister--rader">
                            <Element>Mine kandidatlister</Element>
                        </Row>
                        {antallKandidatlister === undefined &&
                            hentListerStatus === Nettstatus.LasterInn && (
                                <div className="text-center">
                                    <NavFrontendSpinner type="L" />
                                </div>
                            )}
                        {antallKandidatlister > 0 ? (
                            <div>
                                <ListerTableHeader />
                                <ListerTableRows />
                                {hentListerStatus === Nettstatus.LasterInn && (
                                    <div className="text-center">
                                        <NavFrontendSpinner type="L" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Normaltekst className="lister--rader">
                                Du har ingen kandidatlister
                            </Normaltekst>
                        )}
                        {kandidatlister.length < antallKandidatlister && (
                            <Knapp
                                className="knapp-små-bokstaver"
                                onClick={this.onVisFlereListerClick}
                            >
                                Se flere lister
                            </Knapp>
                        )}
                        <Normaltekst className="annonsenummer__search--label">
                            Fant du ikke kandidatlisten som er koblet til en stilling? Søk etter
                            annonsenummer
                        </Normaltekst>
                        <div className="annonsenummer__search">
                            <input
                                id={'sok-etter-stilling-input'}
                                value={this.state.annonsenummer}
                                onChange={this.onAnnonsenummerChange}
                                onKeyDown={this.onKeyDown}
                                ref={(input) => {
                                    this.input = input;
                                }}
                                className={`skjemaelement__input skjemaelement--pink${
                                    hentListeFeilmelding ? ' skjemaelement__input--harFeil' : ''
                                }`}
                                placeholder="Annonsenummer"
                            />
                            <Søkeknapp
                                aria-label="søk"
                                className="LagreKandidaterTilStillingModal__søkeknapp"
                                id="sok-etter-stilling-knapp"
                                onClick={this.hentListeMedAnnonsenummer}
                                type="flat"
                            />
                            {hentListeFeilmelding && (
                                <Normaltekst className="skjemaelement__feilmelding">
                                    {hentListeFeilmelding}
                                </Normaltekst>
                            )}
                        </div>
                        {showHentetListe && (
                            <ListerTableRow
                                liste={hentetListe}
                                id="marker-liste-hentet-med-annonsenummer-checkbox"
                                className="lister--rader hentet-stilling__row"
                                onClick={this.onLagreHentetKandidat(hentetListe)}
                            />
                        )}
                        <div>
                            <Hovedknapp className="lagre--knapp" onClick={onRequestClose}>
                                Lukk
                            </Hovedknapp>
                        </div>
                    </div>
                </div>
            </ModalMedKandidatScope>
        );
    }
}

LagreKandidaterModal.defaultProps = {
    antallKandidatlister: undefined,
    egneKandidatlister: undefined,
    kandidatlisteMedAnnonsenummer: undefined,
    lagreStatus: undefined,
};

LagreKandidaterModal.propTypes = {
    vis: PropTypes.bool.isRequired,
    onLagre: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    hentListerStatus: PropTypes.string.isRequired,
    hentEgneKandidatlister: PropTypes.func.isRequired,
    antallKandidatlister: PropTypes.number,
    kandidatlisterSokeKriterier: PropTypes.shape({
        query: PropTypes.string,
        type: PropTypes.string,
        kunEgne: PropTypes.bool,
        pagenumber: PropTypes.number,
        pagesize: PropTypes.number,
    }).isRequired,
    hentKandidatlisteMedAnnonsenummer: PropTypes.func.isRequired,
    egneKandidatlister: PropTypes.arrayOf(PropTypes.shape(Kandidatliste)),
    hentListeMedAnnonsenummerStatus: PropTypes.string.isRequired,
    hentListeMedAnnonsenummerStatusMessage: PropTypes.string.isRequired,
    kandidatlisteMedAnnonsenummer: PropTypes.shape(Kandidatliste),
    leggTilKandidaterStatus: PropTypes.string.isRequired,
    antallLagredeKandidater: PropTypes.number.isRequired,
    lagretKandidatliste: PropTypes.shape({
        kandidatlisteId: PropTypes.string,
        tittel: PropTypes.string,
    }),
    resetKandidatlisterSokekriterier: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    egneKandidatlister: state.listeoversikt.kandidatlister.liste,
    antallKandidatlister: state.listeoversikt.kandidatlister.antall,
    kandidatlisterSokeKriterier: state.listeoversikt.søkekriterier,
    hentListerStatus: state.listeoversikt.hentListerStatus,

    hentListeMedAnnonsenummerStatus: state.kandidatliste.hentListeMedAnnonsenummerStatus,
    hentListeMedAnnonsenummerStatusMessage:
        state.kandidatliste.hentListeMedAnnonsenummerStatusMessage,
    kandidatlisteMedAnnonsenummer: state.kandidatliste.kandidatlisteMedAnnonsenummer,
    leggTilKandidaterStatus: state.kandidatliste.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatliste.leggTilKandidater.antallLagredeKandidater,
    lagretKandidatliste: state.kandidatliste.leggTilKandidater.lagretListe,
});

const mapDispatchToProps = (dispatch) => ({
    hentEgneKandidatlister: (pagenumber, pagesize) => {
        dispatch({
            type: ListeoversiktActionType.HentKandidatlister,
            query: '',
            listetype: '',
            kunEgne: true,
            pagenumber,
            pagesize,
        });
    },
    hentKandidatlisteMedAnnonsenummer: (annonsenummer) => {
        dispatch({
            type: KandidatlisteActionType.HentKandidatlisteMedAnnonsenummer,
            annonsenummer,
        });
    },
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: ListeoversiktActionType.ResetKandidatlisterSokekriterier });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LagreKandidaterModal);
