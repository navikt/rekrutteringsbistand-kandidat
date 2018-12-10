/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst, Element, Undertekst } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Row } from 'nav-frontend-grid';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { HENT_EGNE_KANDIDATLISTER, HENT_KANDIDATLISTE_MED_STILLINGSNUMMER, HENT_STATUS } from '../kandidatlister/kandidatlisteReducer';
import { Kandidatliste } from '../kandidatlister/PropTypes';

class LagreKandidaterModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            antallListerSomVises: 5,
            kandidatlister: [],
            stillingsnummer: undefined,
            hentetListe: undefined,
            showHentetListe: false,
            hentListeFeilmelding: undefined,
            ingenMarkerteListerFeilmelding: undefined
        };
    }

    componentDidMount() {
        this.props.hentEgneKandidatlister();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.hentListerStatus !== this.props.hentListerStatus && this.props.hentListerStatus === HENT_STATUS.SUCCESS) {
            this.setState({ kandidatlister: this.props.egneKandidatlister.map((liste) => ({
                ...liste,
                markert: false
            })) });
        }
        if (prevProps.hentListeMedStillingsnummerStatus !== this.props.hentListeMedStillingsnummerStatus) {
            if (this.props.hentListeMedStillingsnummerStatus === HENT_STATUS.SUCCESS) {
                this.setState({
                    showHentetListe: true,
                    hentListeFeilmelding: undefined,
                    hentetListe: this.props.kandidatlisteMedStillingsnr
                });
            } else if (this.props.hentListeMedStillingsnummerStatus === HENT_STATUS.FINNES_IKKE) {
                this.setState({ hentetListe: undefined, showHentetListe: false, hentListeFeilmelding: 'Stillingen finnes ikke' });
                this.input.focus();
            } else if (this.props.hentListeMedStillingsnummerStatus === HENT_STATUS.FAILURE) {
                this.setState({ hentetListe: undefined, showHentetListe: false, hentListeFeilmelding: 'En feil oppstod' });
                this.input.focus();
            }
        }
        if (prevState.kandidatlister !== this.state.kandidatlister || prevState.hentetListe !== this.state.hentetListe) {
            this.setState({ ingenMarkerteListerFeilmelding: undefined });
        }
    }

    onKeyDown = (e) => {
        switch (e.keyCode) {
            case 13: // Enter
                e.preventDefault();
                this.hentListeMedStillingsnr();
                break;
            default:
                break;
        }
    };

    markerListe = (listeId) => {
        this.setState({ kandidatlister: this.state.kandidatlister.map((liste) => {
            if (liste.kandidatlisteId === listeId) {
                return this.inverterMarkering(liste);
            }
            return liste;
        }) });
    };

    inverterMarkering = (liste) => ({
        ...liste,
        markert: !liste.markert
    });

    visFlereLister = () => {
        this.setState({ antallListerSomVises: this.state.antallListerSomVises + 5 });
    };

    oppdaterStillingsnummer = (input) => {
        this.setState({ stillingsnummer: input.target.value });
    };

    hentListeMedStillingsnr = () => {
        if (!this.state.stillingsnummer) {
            this.setState({ hentetListe: undefined, showHentetListe: false, hentListeFeilmelding: undefined });
        } else {
            this.props.hentKandidatlisteMedStillingsnr(this.state.stillingsnummer);
        }
    };

    lagreKandidater = () => {
        const markerteLister = this.state.kandidatlister.filter((liste) => liste.markert).map((liste) => (liste.kandidatlisteId));
        if (this.state.hentetListe && this.state.hentetListe.markert) {
            markerteLister.push(this.state.hentetListe.kandidatlisteId);
        }
        if (markerteLister.length === 0) {
            this.setState({ ingenMarkerteListerFeilmelding: 'Vennligst velg én eller flere stillinger, eller søk etter en stilling' });
        } else {
            this.props.onLagre(markerteLister);
        }
    };

    render() {
        const { vis, onRequestClose, hentListerStatus } = this.props;
        const { kandidatlister, hentetListe, showHentetListe, antallListerSomVises, hentListeFeilmelding, ingenMarkerteListerFeilmelding } = this.state;

        const ListerTableHeader = () => (
            <Row className="lister--rader">
                <Element className="opprettet__col rader--text">Opprettet</Element>
                <Element className="stillingstittel__col rader--text">Stillingstittel</Element>
                <Element className="arbeidsgiver__col rader--text">Arbeidsgiver</Element>
            </Row>
        );

        const ListerTableRow = (props) => {
            const { liste, onChange, id, className } = props; // eslint-disable-line react/prop-types

            return (
                <Row className={className}>
                    <Checkbox
                        id={id}
                        aria-label={`Marker liste ${liste.tittel}`}
                        label="&#8203;" // <- tegnet for tom streng
                        className="opprettet--checkbox__col text-hide"
                        checked={liste.markert}
                        onChange={onChange}
                    />
                    <Undertekst className="opprettet--dato__col rader--text rader--text__dato">{`${new Date(liste.opprettetTidspunkt).toLocaleDateString('nb-NO')}`}</Undertekst>
                    <Normaltekst className="stillingstittel__col rader--text">{`${liste.tittel}`}</Normaltekst>
                    <Normaltekst className="arbeidsgiver__col rader--text">{`${liste.organisasjonNavn}`}</Normaltekst>
                </Row>
            );
        };

        const ListerTableRows = () => (
            kandidatlister.slice(0, antallListerSomVises).map((liste) => (
                <ListerTableRow
                    liste={liste}
                    onChange={() => { this.markerListe(liste.kandidatlisteId); }}
                    id={`marker-liste-${liste.kandidatlisteId}-checkbox`}
                    className="lister--rader"
                    key={liste.kandidatlisteId}
                />
            ))
        );

        return (
            <Modal
                isOpen={vis}
                onRequestClose={onRequestClose}
                contentLabel="LagreKandidaterModal."
                className="LagreKandidaterModal"
                appElement={document.getElementById('app')}
            >
                <div className="LagreKandidaterModal--wrapper">
                    <Systemtittel className="tittel">Lagre kandidater i en kandidatliste</Systemtittel>
                    <Normaltekst className="text">Hver stilling har en kandidatliste. Du kan legge kandidatene i en eller flere lister.</Normaltekst>
                    <Row className="lister--rader">
                        <Element>Mine stillinger/lister</Element>
                    </Row>
                    {hentListerStatus === HENT_STATUS.LOADING ? // eslint-disable-line no-nested-ternary
                        <div className="text-center">
                            <NavFrontendSpinner type="L" />
                        </div>
                        : kandidatlister.length > 0 ?
                            <div>
                                <SkjemaGruppe feil={ingenMarkerteListerFeilmelding && { feilmelding: ingenMarkerteListerFeilmelding }}>
                                    <ListerTableHeader />
                                    <ListerTableRows />
                                </SkjemaGruppe>
                            </div>
                            : <Normaltekst className="lister--rader">Du har ingen stillinger/lister</Normaltekst>
                    }
                    {antallListerSomVises < kandidatlister.length &&
                        <Flatknapp mini onClick={this.visFlereLister}>Se flere stillinger/lister</Flatknapp>
                    }
                    <Normaltekst className="stillingsnummer__search--label">Fant du ikke stillingen? Søk etter stillingsnummer</Normaltekst>
                    <div className="stillingsnummer__search">
                        <input
                            id={'sok-etter-stilling-input'}
                            value={this.state.value}
                            onChange={this.oppdaterStillingsnummer}
                            onKeyDown={this.onKeyDown}
                            ref={(input) => { this.input = input; }}
                            className={hentListeFeilmelding ? 'skjemaelement__input skjemaelement__input--harFeil' : 'skjemaelement__input'}
                        />
                        <Knapp
                            aria-label="søk"
                            className="search-button"
                            id="sok-etter-stilling-knapp"
                            onClick={this.hentListeMedStillingsnr}
                        >
                            <i className="search-button__icon" />
                        </Knapp>
                        {hentListeFeilmelding &&
                            <Normaltekst className="skjemaelement__feilmelding">{hentListeFeilmelding}</Normaltekst>
                        }
                    </div>
                    {showHentetListe &&
                        <ListerTableRow
                            liste={hentetListe}
                            onChange={() => { this.setState({ hentetListe: this.inverterMarkering(hentetListe) }); }}
                            id="marker-liste-hentet-med-stillingsnr-checkbox"
                            className="lister--rader hentet-stilling__row"
                        />
                    }
                    <div>
                        <Hovedknapp className="lagre--knapp" onClick={this.lagreKandidater}>Lagre</Hovedknapp>
                        <Flatknapp className="avbryt--knapp" onClick={onRequestClose}>Avbryt</Flatknapp>
                    </div>
                </div>
            </Modal>
        );
    }
}

LagreKandidaterModal.defaultProps = {
    egneKandidatlister: [],
    kandidatlisteMedStillingsnr: undefined
};

LagreKandidaterModal.propTypes = {
    vis: PropTypes.bool.isRequired,
    onLagre: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    hentListerStatus: PropTypes.string.isRequired,
    hentEgneKandidatlister: PropTypes.func.isRequired,
    hentKandidatlisteMedStillingsnr: PropTypes.func.isRequired,
    egneKandidatlister: PropTypes.arrayOf(PropTypes.shape(Kandidatliste)),
    hentListeMedStillingsnummerStatus: PropTypes.string.isRequired,
    kandidatlisteMedStillingsnr: PropTypes.shape(Kandidatliste)
};

const mapStateToProps = (state) => ({
    egneKandidatlister: state.kandidatlister.egneKandidatlister.liste,
    hentListerStatus: state.kandidatlister.hentListerStatus,
    hentListeMedStillingsnummerStatus: state.kandidatlister.hentListeMedStillingsnummerStatus,
    kandidatlisteMedStillingsnr: state.kandidatlister.kandidatlisteMedStillingsnr
});

const mapDispatchToProps = (dispatch) => ({
    hentEgneKandidatlister: () => { dispatch({ type: HENT_EGNE_KANDIDATLISTER }); },
    hentKandidatlisteMedStillingsnr: (stillingsnummer) => { dispatch({ type: HENT_KANDIDATLISTE_MED_STILLINGSNUMMER, stillingsnummer }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(LagreKandidaterModal);
