/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst, Element } from 'nav-frontend-typografi';
import { Input, Textarea } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'pam-frontend-knapper';
import { KandidatlisteTypes, HENT_STATUS } from '../kandidatlisteReducer.ts';
import { Kandidatliste } from '../PropTypes';
import { LAGRE_STATUS } from '../../../felles/konstanter';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

const NOTATLENGDE = 2000;
class LeggTilKandidatModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFodselsnummer: false,
            showAlleredeLagtTilWarning: false,
            errorMessage: undefined,
        };
    }

    componentDidMount() {
        this.props.setFodselsnummer(undefined);
        this.props.setNotat('');
        this.props.resetHentKandidatMedFnr();
    }

    componentDidUpdate(prevProps) {
        const { hentStatus } = this.props;
        if (prevProps.hentStatus !== hentStatus) {
            if (hentStatus === HENT_STATUS.SUCCESS) {
                this.setState({
                    showFodselsnummer: true,
                    errorMessage: undefined,
                    showAlleredeLagtTilWarning: this.kandidatenFinnesAllerede(),
                });
            } else if (hentStatus === HENT_STATUS.FINNES_IKKE) {
                this.setState({
                    showFodselsnummer: false,
                    errorMessage: this.kandidatenFinnesIkke(),
                });
            }
        }
    }

    onChange = input => {
        const fnr = input.target.value;
        this.props.setFodselsnummer(fnr);
        if (fnr.length === 11) {
            this.props.hentKandidatMedFnr(fnr);
        } else if (fnr.length > 11) {
            this.props.resetHentKandidatMedFnr();
            this.setState({
                showFodselsnummer: false,
                errorMessage: 'Fødselsnummeret er for langt',
                showAlleredeLagtTilWarning: false,
            });
        } else {
            this.props.resetHentKandidatMedFnr();
            this.setState({
                showFodselsnummer: false,
                errorMessage: undefined,
                showAlleredeLagtTilWarning: false,
            });
        }
    };

    onNotatChange = event => {
        this.props.setNotat(event.target.value);
    };

    kandidatenFinnesAllerede = () => {
        const kandidat = this.props.kandidatliste.kandidater.filter(
            k => this.props.kandidat.arenaKandidatnr === k.kandidatnr
        );
        return kandidat.length > 0;
    };

    leggTilKandidat = () => {
        const { kandidat, kandidatliste, hentStatus, fodselsnummer, notat } = this.props;
        const kandidater = [
            {
                kandidatnr: kandidat.arenaKandidatnr,
                notat,
                sisteArbeidserfaring: kandidat.mestRelevanteYrkeserfaring
                    ? kandidat.mestRelevanteYrkeserfaring.styrkKodeStillingstittel
                    : '',
            },
        ];
        if (
            hentStatus === HENT_STATUS.SUCCESS &&
            !this.kandidatenFinnesAllerede() &&
            notat.length <= NOTATLENGDE
        ) {
            this.props.leggTilKandidatMedFnr(kandidater, kandidatliste);
            this.props.onClose();
        } else {
            if (!fodselsnummer) {
                this.setState({
                    showFodselsnummer: false,
                    errorMessage: 'Fødselsnummer må fylles inn',
                });
                this.fnrinput.focus();
            } else if (fodselsnummer.length < 11) {
                this.setState({
                    showFodselsnummer: false,
                    errorMessage: 'Fødselsnummeret er for kort',
                });
                this.fnrinput.focus();
            } else if (this.kandidatenFinnesAllerede()) {
                this.setState({ errorMessage: 'Kandidaten er allerede lagt til i listen' });
                this.fnrinput.focus();
            }
        }
    };

    kandidatenFinnesIkke = () => (
        <div className="skjemaelement__feilmelding">
            <div className="blokk-xxs">Du kan ikke legge til kandidaten.</div>
            <div>Mulige årsaker:</div>
            <ul className="leggTilKandidatModal--feilmelding__ul">
                <li>Fødselsnummeret er feil</li>
                <li>Kandidaten har ikke jobbprofil</li>
                <li>Kandidaten har ikke CV</li>
                <li>Kandidaten har ikke lest hjemmel i ny CV-løsning</li>
                <li>Kandidaten er egen ansatt, og du har ikke tilgang</li>
                <li>{'Kandidaten har "Nei nav.no" i Formidlingsinformasjon i Arena'}</li>
                <li>{'Kandidaten har personforhold "Fritatt for kandidatsøk" i Arena'}</li>
                <li>{'Kandidaten er sperret "Egen ansatt"'}</li>
            </ul>
        </div>
    );

    render() {
        const { vis, onClose, fodselsnummer, kandidat, leggTilKandidatStatus, notat } = this.props;
        return (
            <NavFrontendModal
                contentLabel="Modal legg til kandidat"
                isOpen={vis}
                onRequestClose={onClose}
                className="LeggTilKandidatModal"
                appElement={document.getElementById('app')}
            >
                <Systemtittel className="tittel">Legg til kandidat</Systemtittel>
                <AlertStripeAdvarsel>
                    Avklar kandidaten før du legger han eller henne på kandidatlisten.
                </AlertStripeAdvarsel>
                <Input
                    className="skjemaelement--pink legg-til-kandidat__fodselsnummer"
                    onChange={this.onChange}
                    feil={this.state.errorMessage && { feilmelding: this.state.errorMessage }}
                    bredde="S"
                    label="Fødselsnummer på kandidaten (11 siffer)"
                    inputRef={input => {
                        this.fnrinput = input;
                    }}
                />
                {this.state.showFodselsnummer && (
                    <Normaltekst className="fodselsnummer">{`${kandidat.fornavn} ${kandidat.etternavn} (${fodselsnummer})`}</Normaltekst>
                )}
                {this.state.showAlleredeLagtTilWarning && (
                    <div className="legg-til-kandidat__advarsel">
                        <Element>
                            <i className="advarsel__icon" />
                            Kandidaten er allerede lagt til i listen
                        </Element>
                    </div>
                )}
                <Element className="legg-til-kandidat__notatoverskrift">
                    Notat om kandidaten
                </Element>

                <Textarea
                    id="legg-til-kandidat-notat-input"
                    textareaClass="legg-til-kandidat__notat skjemaelement--pink"
                    label="Du skal ikke skrive sensitive opplysninger her. Notatet er synlig for alle veiledere."
                    placeholder="Skriv inn en kort tekst om hvorfor kandidaten passer til stillingen"
                    value={notat || ''}
                    maxLength={NOTATLENGDE}
                    feil={
                        notat && notat.length > NOTATLENGDE
                            ? { feilmelding: 'Notatet er for langt' }
                            : undefined
                    }
                    onChange={this.onNotatChange}
                    textareaRef={textArea => {
                        this.textArea = textArea;
                    }}
                />

                <div>
                    <Hovedknapp
                        className="legg-til--knapp"
                        onClick={this.leggTilKandidat}
                        spinner={leggTilKandidatStatus === LAGRE_STATUS.LOADING}
                        disabled={leggTilKandidatStatus === LAGRE_STATUS.LOADING}
                    >
                        Legg til
                    </Hovedknapp>
                    <Flatknapp
                        className="avbryt--knapp"
                        onClick={onClose}
                        disabled={leggTilKandidatStatus === LAGRE_STATUS.LOADING}
                    >
                        Avbryt
                    </Flatknapp>
                </div>
            </NavFrontendModal>
        );
    }
}
LeggTilKandidatModal.defaultProps = {
    vis: true,
    fodselsnummer: undefined,
    kandidatliste: undefined,
};

LeggTilKandidatModal.propTypes = {
    vis: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    fodselsnummer: PropTypes.string,
    kandidatliste: PropTypes.shape(Kandidatliste),
    setFodselsnummer: PropTypes.func.isRequired,
    hentKandidatMedFnr: PropTypes.func.isRequired,
    resetHentKandidatMedFnr: PropTypes.func.isRequired,
    leggTilKandidatMedFnr: PropTypes.func.isRequired,
    kandidat: PropTypes.shape({
        arenaKandidatnr: PropTypes.string,
        fornavn: PropTypes.string,
        etternavn: PropTypes.string,
        mestRelevanteYrkeserfaring: PropTypes.shape({
            styrkKodeStillingstittel: PropTypes.string,
            yrkeserfaringManeder: PropTypes.number,
        }),
    }).isRequired,
    hentStatus: PropTypes.string.isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    fodselsnummer: state.kandidatlister.fodselsnummer,
    kandidat: state.kandidatlister.kandidat,
    hentStatus: state.kandidatlister.hentStatus,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    notat: state.kandidatlister.notat,
});

const mapDispatchToProps = dispatch => ({
    setFodselsnummer: fodselsnummer => {
        dispatch({ type: KandidatlisteTypes.SET_FODSELSNUMMER, fodselsnummer });
    },
    hentKandidatMedFnr: fodselsnummer => {
        dispatch({ type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR, fodselsnummer });
    },
    resetHentKandidatMedFnr: () => {
        dispatch({ type: KandidatlisteTypes.HENT_KANDIDAT_MED_FNR_RESET });
    },
    leggTilKandidatMedFnr: (kandidater, kandidatliste) => {
        dispatch({ type: KandidatlisteTypes.LEGG_TIL_KANDIDATER, kandidater, kandidatliste });
    },
    setNotat: notat => {
        dispatch({ type: KandidatlisteTypes.SET_NOTAT, notat });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeggTilKandidatModal);
