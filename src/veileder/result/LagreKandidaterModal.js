/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import { Element, Normaltekst, Systemtittel, Undertekst } from 'nav-frontend-typografi';
import { Knapp as PamKnapp } from 'pam-frontend-knapper';
import { Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Kandidatliste } from '../kandidatlister/PropTypes';
import { formatterDato } from '../../felles/common/dateUtils';
import { capitalizeEmployerName } from '../../felles/sok/utils';
import { LAGRE_STATUS } from '../../felles/konstanter';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading.tsx';
import KandidatlisteActionType from '../kandidatlister/reducer/KandidatlisteActionType';
import { HentStatus } from '../kandidatlister/kandidatlistetyper';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';

const PAGINERING_BATCH_SIZE = 5;

class LagreKandidaterModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatlister: [],
            annonsenummer: undefined,
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
            this.props.hentListerStatus === HentStatus.Success
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
            prevProps.hentListeMedAnnonsenummerStatus !== this.props.hentListeMedAnnonsenummerStatus
        ) {
            if (this.props.hentListeMedAnnonsenummerStatus === HentStatus.Success) {
                this.setState({
                    showHentetListe: true,
                    hentListeFeilmelding: undefined,
                    hentetListe: this.props.kandidatlisteMedAnnonsenummer,
                });
            } else if (this.props.hentListeMedAnnonsenummerStatus === HentStatus.FinnesIkke) {
                this.setState({
                    hentetListe: undefined,
                    showHentetListe: false,
                    hentListeFeilmelding: 'Stillingen finnes ikke',
                });
                this.input.focus();
            } else if (this.props.hentListeMedAnnonsenummerStatus === HentStatus.Failure) {
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
            this.props.leggTilKandidaterStatus === LAGRE_STATUS.SUCCESS
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

    onAnnonsenummerChange = (input) => {
        this.setState({
            annonsenummer: input.target.value,
        });
    };

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

    onLagreKandidat = (kandidatliste) => () => {
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
        this.onLagreKandidat(kandidatliste)();
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

        const ListerTableRow = ({ liste, onClick, id, className }) => (
            <Row className={className}>
                <Undertekst className="opprettet--dato__col rader--text rader--text__dato">
                    {formatterDato(new Date(liste.opprettetTidspunkt))}
                </Undertekst>
                <Normaltekst className="stillingstittel__col rader--text">
                    {liste.tittel}
                </Normaltekst>
                <Normaltekst className="arbeidsgiver__col rader--text">
                    {capitalizeEmployerName(liste.organisasjonNavn || '')}
                </Normaltekst>
                <div className="leggTil__col rowItem">
                    {liste.alleredeLagtTil && leggTilKandidaterStatus !== LAGRE_STATUS.FAILURE ? (
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

        const ListerTableRows = () =>
            kandidatlister.map((liste) => (
                <ListerTableRow
                    liste={liste}
                    id={`marker-liste-${liste.kandidatlisteId}-checkbox`}
                    className="lister--rader"
                    onClick={this.onLagreKandidat(liste)}
                    key={liste.kandidatlisteId}
                />
            ));

        return (
            <Modal
                isOpen={vis}
                onRequestClose={onRequestClose}
                contentLabel="LagreKandidaterModal."
                className="LagreKandidaterModal"
                appElement={document.getElementById('app')}
            >
                <div>
                    <HjelpetekstFading
                        synlig={visKandidaterLagret}
                        type="suksess"
                        innhold={`${
                            antallLagredeKandidater > 1
                                ? `${antallLagredeKandidater} kandidater`
                                : 'Kandidaten'
                        } er lagret i
                            ${
                                lagretKandidatliste.length > 1
                                    ? `${lagretKandidatliste.length} lister`
                                    : `kandidatlisten «${lagretKandidatliste.tittel}»`
                            }`}
                        id="hjelpetekstfading"
                        className="LagreKandidaterModal__hjelpetekst"
                    />
                    <div className="LagreKandidaterModal--wrapper">
                        <Systemtittel className="tittel">Lagre kandidater</Systemtittel>
                        <Row className="lister--rader">
                            <Element>Mine kandidatlister</Element>
                        </Row>
                        {antallKandidatlister === undefined &&
                            hentListerStatus === HentStatus.Loading && (
                                <div className="text-center">
                                    <NavFrontendSpinner type="L" />
                                </div>
                            )}
                        {antallKandidatlister > 0 ? (
                            <div>
                                <ListerTableHeader />
                                <ListerTableRows />
                                {hentListerStatus === HentStatus.Loading && (
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
                            <Flatknapp onClick={this.onVisFlereListerClick}>
                                Se flere lister
                            </Flatknapp>
                        )}
                        <Normaltekst className="annonsenummer__search--label">
                            Fant du ikke kandidatlisten som er koblet til en stilling? Søk etter
                            annonsenummer
                        </Normaltekst>
                        <div className="annonsenummer__search">
                            <input
                                id={'sok-etter-stilling-input'}
                                value={this.state.value}
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
                            <PamKnapp
                                aria-label="søk"
                                className="search-button"
                                id="sok-etter-stilling-knapp"
                                onClick={this.hentListeMedAnnonsenummer}
                            >
                                <i className="search-button__icon" />
                            </PamKnapp>
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
            </Modal>
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
    kandidatlisteMedAnnonsenummer: PropTypes.shape(Kandidatliste),
    leggTilKandidaterStatus: PropTypes.string.isRequired,
    antallLagredeKandidater: PropTypes.number.isRequired,
    lagretKandidatliste: PropTypes.shape({
        kandidatlisteId: PropTypes.string,
        tittel: PropTypes.string,
    }).isRequired,
    resetKandidatlisterSokekriterier: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    egneKandidatlister: state.kandidatlister.kandidatlister.liste,
    antallKandidatlister: state.kandidatlister.kandidatlister.antall,
    kandidatlisterSokeKriterier: state.kandidatlister.kandidatlisterSokeKriterier,
    hentListerStatus: state.kandidatlister.hentListerStatus,
    hentListeMedAnnonsenummerStatus: state.kandidatlister.hentListeMedAnnonsenummerStatus,
    kandidatlisteMedAnnonsenummer: state.kandidatlister.kandidatlisteMedAnnonsenummer,
    leggTilKandidaterStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatlister.leggTilKandidater.antallLagredeKandidater,
    lagretKandidatliste: state.kandidatlister.leggTilKandidater.lagretListe,
});

const mapDispatchToProps = (dispatch) => ({
    hentEgneKandidatlister: (pagenumber, pagesize) => {
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTER,
            query: '',
            listetype: '',
            kunEgne: true,
            pagenumber,
            pagesize,
        });
    },
    hentKandidatlisteMedAnnonsenummer: (annonsenummer) => {
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_ANNONSENUMMER,
            annonsenummer,
        });
    },
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: KandidatlisteActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LagreKandidaterModal);
