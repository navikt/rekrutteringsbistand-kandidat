/* eslint-disable react/no-did-update-set-state */
import React, { Component, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst, Element } from 'nav-frontend-typografi';
import { Input, Textarea, SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Kandidatresultat } from '../../../kandidatside/cv/reducer/cv-typer';
import { LAGRE_STATUS } from '../../../../felles/konstanter';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import { HentStatus, Kandidatliste, LagretKandidat, Navn } from '../../kandidatlistetyper';
import './LeggTilKandidatModal.less';
import { Nettstatus, Nettressurs } from '../../../../felles/common/remoteData';
import { capitalizeFirstLetter } from '../../../../felles/sok/utils';
import AppState from '../../../AppState';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';

const NOTATLENGDE = 2000;

type Props = {
    vis: boolean;
    stillingsId?: string;
    onClose: () => void;
    fodselsnummer?: string;
    kandidatliste: Kandidatliste;
    setFodselsnummer: (fnr?: string) => void;
    hentKandidatMedFnr: (fnr: string) => void;
    leggTilKandidatMedFnr: (
        kandidater: Array<LagretKandidat>,
        kandidatliste: {
            kandidatlisteId: string;
        }
    ) => void;
    notat: string;
    setNotat: (notat: string) => void;
    kandidat: Kandidatresultat;
    resetSøk: () => void;
    usynligKandidat: Nettressurs<Array<Navn>>;
    hentStatus: HentStatus;
    leggTilKandidatStatus: string;
};

class LeggTilKandidatModal extends React.Component<Props> {
    fnrinput: any;
    textArea: any;

    state: {
        visResultatFraCvSøk: boolean;
        showAlleredeLagtTilWarning: boolean;
        errorMessage?: Component;
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            visResultatFraCvSøk: false,
            showAlleredeLagtTilWarning: false,
            errorMessage: undefined,
        };
    }

    componentDidMount() {
        this.props.setFodselsnummer(undefined);
        this.props.setNotat('');
        this.props.resetSøk();
    }

    componentDidUpdate(prevProps: Props) {
        const { hentStatus } = this.props;
        if (prevProps.hentStatus !== hentStatus) {
            if (hentStatus === HentStatus.Success) {
                this.setState({
                    visResultatFraCvSøk: true,
                    errorMessage: undefined,
                    showAlleredeLagtTilWarning: this.kandidatenFinnesAllerede(),
                });
            } else if (hentStatus === HentStatus.FinnesIkke) {
                this.setState({
                    visResultatFraCvSøk: false,
                    errorMessage: this.kandidatenFinnesIkke(),
                });
            }
        }
    }

    onChange = (input: ChangeEvent<HTMLInputElement>) => {
        const fnr = input.target.value;
        this.props.setFodselsnummer(fnr);

        if (fnr.length === 11) {
            this.props.hentKandidatMedFnr(fnr);
        } else if (fnr.length > 11) {
            this.props.resetSøk();

            this.setState({
                visResultatFraCvSøk: false,
                errorMessage: 'Fødselsnummeret er for langt',
                showAlleredeLagtTilWarning: false,
            });
        } else {
            this.props.resetSøk();

            this.setState({
                visResultatFraCvSøk: false,
                errorMessage: undefined,
                showAlleredeLagtTilWarning: false,
            });
        }
    };

    onNotatChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.props.setNotat(event.target.value);
    };

    kandidatenFinnesAllerede = () => {
        const kandidat = this.props.kandidatliste.kandidater.filter(
            (k) => this.props.kandidat.arenaKandidatnr === k.kandidatnr
        );
        return kandidat.length > 0;
    };

    leggTilKandidat = () => {
        const { kandidat, kandidatliste, hentStatus, fodselsnummer, notat } = this.props;
        const kandidater: LagretKandidat[] = [
            {
                kandidatnr: kandidat.arenaKandidatnr,
                notat,
                sisteArbeidserfaring: kandidat.mestRelevanteYrkeserfaring
                    ? kandidat.mestRelevanteYrkeserfaring.styrkKodeStillingstittel
                    : '',
            },
        ];

        if (
            hentStatus === HentStatus.Success &&
            !this.kandidatenFinnesAllerede() &&
            notat.length <= NOTATLENGDE
        ) {
            this.props.leggTilKandidatMedFnr(kandidater, kandidatliste);
            this.props.onClose();
        } else {
            if (!fodselsnummer) {
                this.setState({
                    visResultatFraCvSøk: false,
                    errorMessage: 'Fødselsnummer må fylles inn',
                });
                this.fnrinput.focus();
            } else if (fodselsnummer.length < 11) {
                this.setState({
                    visResultatFraCvSøk: false,
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
            <div className="blokk-xxs">
                Du kan ikke legge til kandidaten, fordi personen ikke er synlig i
                Rekrutteringsbistand.
            </div>
            <div>Mulige årsaker:</div>
            <ul className="leggTilKandidatModal--feilmelding__ul">
                <li>Fødselsnummeret er feil</li>
                <li>Kandidaten har ikke jobbprofil</li>
                <li>Kandidaten har ikke CV</li>
                <li>Kandidaten har ikke lest hjemmel i ny CV-løsning</li>
                <li>Kandidaten er egen ansatt, og du har ikke tilgang</li>
                <li>Kandidaten har "Nei nav.no" i Formidlingsinformasjon i Arena</li>
                <li>Kandidaten har personforhold "Fritatt for kandidatsøk" i Arena</li>
                <li>Kandidaten er sperret "Egen ansatt"</li>
            </ul>
        </div>
    );

    render() {
        const {
            vis = true,
            onClose,
            fodselsnummer,
            kandidat,
            leggTilKandidatStatus,
            notat,
        } = this.props;

        let usynligKandidat: Array<Navn> | undefined;
        if (this.props.usynligKandidat.kind === Nettstatus.Suksess) {
            usynligKandidat = this.props.usynligKandidat.data;
        }

        return (
            <NavFrontendModal
                contentLabel="Modal legg til kandidat"
                isOpen={vis}
                onRequestClose={onClose}
                className="LeggTilKandidatModal"
            >
                <Systemtittel className="tittel">Legg til kandidat</Systemtittel>
                <AlertStripeAdvarsel>
                    Før du legger en kandidat på kandidatlisten, kontakt han eller henne for å
                    undersøke om stillingen er aktuell.
                </AlertStripeAdvarsel>
                <Input
                    className="skjemaelement--pink legg-til-kandidat__fodselsnummer"
                    onChange={this.onChange}
                    feil={!!this.state.errorMessage}
                    bredde="S"
                    label="Fødselsnummer på kandidaten (11 siffer)"
                    inputRef={(input) => {
                        this.fnrinput = input;
                    }}
                />
                {this.state.visResultatFraCvSøk && (
                    <Normaltekst className="fodselsnummer">{`${kandidat.fornavn} ${kandidat.etternavn} (${fodselsnummer})`}</Normaltekst>
                )}
                {usynligKandidat &&
                    usynligKandidat.map((navn) => (
                        <Normaltekst
                            key={JSON.stringify(navn)}
                            className="fodselsnummer"
                        >{`${capitalizeFirstLetter(navn.fornavn)}${
                            navn.mellomnavn ? ' ' + capitalizeFirstLetter(navn.mellomnavn) : ''
                        } ${capitalizeFirstLetter(
                            navn.etternavn
                        )} (${fodselsnummer})`}</Normaltekst>
                    ))}
                {this.state.errorMessage && (
                    <SkjemaelementFeilmelding>{this.state.errorMessage}</SkjemaelementFeilmelding>
                )}
                {this.state.showAlleredeLagtTilWarning && (
                    <div className="legg-til-kandidat__advarsel">
                        <i className="advarsel__icon" />
                        <div className="legg-til-kandidat__advarsel-tekst">
                            <Element>Kandidaten er allerede lagt til i listen</Element>
                            <Normaltekst>
                                Finner du ikke kandidaten i kandidatlisten? Husk å sjekk om
                                kandidaten er slettet ved å huke av "Vis kun slettede".
                            </Normaltekst>
                        </div>
                    </div>
                )}
                {this.state.visResultatFraCvSøk && (
                    <>
                        <div className="legg-til-kandidat__notatoverskrift" />
                        <Textarea
                            id="legg-til-kandidat-notat-input"
                            label="Notat om kandidaten"
                            textareaClass="legg-til-kandidat__notat skjemaelement--pink"
                            description="Du skal ikke skrive sensitive opplysninger her. Notatet er synlig for alle veiledere."
                            placeholder="Skriv inn en kort tekst om hvorfor kandidaten passer til stillingen"
                            value={notat || ''}
                            maxLength={NOTATLENGDE}
                            feil={
                                notat && notat.length > NOTATLENGDE
                                    ? 'Notatet er for langt'
                                    : undefined
                            }
                            onChange={this.onNotatChange}
                            textareaRef={(textArea) => {
                                this.textArea = textArea;
                            }}
                        />
                    </>
                )}

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

const mapStateToProps = (state: AppState) => ({
    fodselsnummer: state.kandidatliste.fodselsnummer,
    kandidat: state.kandidatliste.kandidat,
    usynligKandidat: state.kandidatliste.usynligKandidat,
    hentStatus: state.kandidatliste.hentStatus,
    leggTilKandidatStatus: state.kandidatliste.leggTilKandidater.lagreStatus,
    notat: state.kandidatliste.notat,
});

const mapDispatchToProps = (dispatch: (action: KandidatlisteAction) => void) => ({
    setFodselsnummer: (fodselsnummer: string) => {
        dispatch({ type: KandidatlisteActionType.SET_FODSELSNUMMER, fodselsnummer });
    },
    hentKandidatMedFnr: (fodselsnummer: string) => {
        dispatch({ type: KandidatlisteActionType.HENT_KANDIDAT_MED_FNR, fodselsnummer });
    },
    resetSøk: () => {
        dispatch({ type: KandidatlisteActionType.LEGG_TIL_KANDIDAT_SØK_RESET });
    },
    leggTilKandidatMedFnr: (
        kandidater: Array<LagretKandidat>,
        kandidatliste: {
            kandidatlisteId: string;
        }
    ) => {
        dispatch({ type: KandidatlisteActionType.LEGG_TIL_KANDIDATER, kandidater, kandidatliste });
    },
    setNotat: (notat: string) => {
        dispatch({ type: KandidatlisteActionType.SET_NOTAT, notat });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeggTilKandidatModal);
