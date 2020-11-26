/* eslint-disable react/no-did-update-set-state */
import React, { Component, ChangeEvent } from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Input, Textarea } from 'nav-frontend-skjema';
import { Systemtittel, Normaltekst, Element, Feilmelding } from 'nav-frontend-typografi';
import fnrValidator from '@navikt/fnrvalidator';

import { HentStatus, Kandidatliste, Navn } from '../../kandidatlistetyper';
import { Kandidatresultat } from '../../../kandidatside/cv/reducer/cv-typer';
import { LAGRE_STATUS } from '../../../../felles/konstanter';
import { Nettstatus, Nettressurs } from '../../../../felles/common/remoteData';
import AppState from '../../../AppState';
import KandidatenFinnesIkke from './KandidatenFinnesIkke';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import NavnPåUsynligKandidat from './NavnPåUsynligKandidat';
import RegistrerFormidlingAvUsynligKandidat from './RegistrerFormidlingAvUsynligKandidat';
import './LeggTilKandidatModal.less';
import { sendEvent } from '../../../amplitude/amplitude';
import ModalMedKandidatScope from '../../../../ModalMedKandidatScope';

const MAKS_NOTATLENGDE = 2000;

export type KandidatOutboundDto = {
    kandidatnr: string;
    notat: string;
    sisteArbeidserfaring?: string;
};

export type FormidlingAvUsynligKandidatOutboundDto = {
    fnr: string;
    presentert: boolean;
    fåttJobb: boolean;
    navKontor: string;
    stillingsId: string;
};

type Props = {
    vis: boolean;
    stillingsId: string | null;
    onClose: () => void;
    fodselsnummer?: string;
    kandidatliste: Kandidatliste;
    setFodselsnummer: (fnr?: string) => void;
    hentKandidatMedFnr: (fnr: string) => void;
    leggTilKandidatMedFnr: (
        kandidater: Array<KandidatOutboundDto>,
        kandidatliste: {
            kandidatlisteId: string;
        }
    ) => void;
    notat: string;
    setNotat: (notat: string) => void;
    kandidat: Kandidatresultat;
    resetSøk: () => void;
    søkPåusynligKandidat: Nettressurs<Array<Navn>>;
    hentStatus: HentStatus;
    leggTilKandidatStatus: string;
    formidleUsynligKandidat: (
        kandidatlisteId: string,
        formidling: FormidlingAvUsynligKandidatOutboundDto
    ) => void;
    formidlingAvUsynligKandidat: Nettressurs<FormidlingAvUsynligKandidatOutboundDto>;
    navKontor: string;
};

class LeggTilKandidatModal extends React.Component<Props> {
    fnrinput?: HTMLInputElement | null;

    state: {
        visResultatFraCvSøk: boolean;
        showAlleredeLagtTilWarning: boolean;
        errorMessage?: Component;
        formidlingAvUsynligKandidat?: FormidlingAvUsynligKandidatOutboundDto;
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
        this.resetStateOgSøk();
    }

    componentDidUpdate(prevProps: Props) {
        const { hentStatus, søkPåusynligKandidat, fodselsnummer } = this.props;
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
                    errorMessage: <KandidatenFinnesIkke />,
                });
            }
        }

        if (
            prevProps.søkPåusynligKandidat.kind !== søkPåusynligKandidat.kind &&
            søkPåusynligKandidat.kind === Nettstatus.Suksess
        ) {
            this.setState({
                formidlingAvUsynligKandidat: {
                    fnr: fodselsnummer,
                    fåttJobb: false,
                    presentert: false,
                },
            });
        }
    }

    onChange = (input: ChangeEvent<HTMLInputElement>) => {
        const fnr = input.target.value;
        this.props.setFodselsnummer(fnr);

        if (fnr.length === 11) {
            const fnrErGyldig = fnrValidator.idnr(fnr).status === 'valid';

            if (fnrErGyldig) {
                this.props.hentKandidatMedFnr(fnr);
            } else {
                this.setState({
                    errorMessage: 'Fødselsnummeret er ikke gyldig',
                });
            }
        } else if (fnr.length > 11) {
            this.resetStateOgSøk();

            this.setState({
                visResultatFraCvSøk: false,
                errorMessage: 'Fødselsnummeret er for langt',
                showAlleredeLagtTilWarning: false,
            });
        } else {
            this.resetStateOgSøk();

            this.setState({
                visResultatFraCvSøk: false,
                errorMessage: undefined,
                showAlleredeLagtTilWarning: false,
            });
        }
    };

    resetStateOgSøk = () => {
        this.props.resetSøk();
        this.setState({
            formidlingAvUsynligKandidat: undefined,
        });
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

    kandidatenKanLeggesTil = () =>
        this.props.hentStatus === HentStatus.Success &&
        !this.kandidatenFinnesAllerede() &&
        this.props.notat.length <= MAKS_NOTATLENGDE;

    leggTilKandidat = () => {
        const { kandidat, kandidatliste, fodselsnummer, notat } = this.props;
        const kandidater: KandidatOutboundDto[] = [
            {
                kandidatnr: kandidat.arenaKandidatnr,
                notat,
                sisteArbeidserfaring: kandidat.mestRelevanteYrkeserfaring
                    ? kandidat.mestRelevanteYrkeserfaring.styrkKodeStillingstittel
                    : '',
            },
        ];

        if (this.kandidatenKanLeggesTil()) {
            this.props.leggTilKandidatMedFnr(kandidater, kandidatliste);
            sendEvent('legg_til_kandidat', 'klikk', {
                app: 'kandidat',
            });

            this.props.onClose();
        } else {
            if (!fodselsnummer) {
                this.setState({
                    visResultatFraCvSøk: false,
                    errorMessage: 'Fødselsnummer må fylles inn',
                });
                this.fnrinput?.focus();
            } else if (fodselsnummer.length < 11) {
                this.setState({
                    visResultatFraCvSøk: false,
                    errorMessage: 'Fødselsnummeret er for kort',
                });
                this.fnrinput?.focus();
            } else if (this.kandidatenFinnesAllerede()) {
                this.setState({ errorMessage: 'Kandidaten er allerede lagt til i listen' });
                this.fnrinput?.focus();
            }
        }
    };

    onNyUsynligKandidatChange = (
        formidlingAvUsynligKandidat: FormidlingAvUsynligKandidatOutboundDto
    ) => {
        this.setState({
            formidlingAvUsynligKandidat,
        });
    };

    registrerFormidlingAvUsynligKandidat = () => {
        if (this.state.formidlingAvUsynligKandidat && this.props.stillingsId) {
            this.props.formidleUsynligKandidat(this.props.kandidatliste.kandidatlisteId, {
                ...this.state.formidlingAvUsynligKandidat,
                stillingsId: this.props.stillingsId,
                navKontor: this.props.navKontor,
            });
        }
    };

    render() {
        const {
            vis = true,
            onClose,
            fodselsnummer,
            kandidat,
            leggTilKandidatStatus,
            notat,
        } = this.props;

        const harValgtUsynligKandidat = this.props.søkPåusynligKandidat.kind === Nettstatus.Suksess;
        const harValgtEtAlternativ =
            this.state.formidlingAvUsynligKandidat?.presentert ||
            this.state.formidlingAvUsynligKandidat?.fåttJobb;

        return (
            <ModalMedKandidatScope
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
                {this.props.søkPåusynligKandidat.kind === Nettstatus.Suksess && (
                    <NavnPåUsynligKandidat
                        fnr={fodselsnummer}
                        navn={this.props.søkPåusynligKandidat.data}
                    />
                )}
                {this.state.errorMessage && (
                    <Feilmelding
                        tag="div"
                        aria-live="polite"
                        className="skjemaelement__feilmelding"
                    >
                        {this.state.errorMessage}
                    </Feilmelding>
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
                            maxLength={MAKS_NOTATLENGDE}
                            onChange={this.onNotatChange}
                            feil={
                                notat && notat.length > MAKS_NOTATLENGDE
                                    ? 'Notatet er for langt'
                                    : undefined
                            }
                        />
                    </>
                )}
                {harValgtUsynligKandidat &&
                    fodselsnummer &&
                    this.props.stillingsId &&
                    this.props.kandidatliste.kanEditere &&
                    this.state.formidlingAvUsynligKandidat && (
                        <RegistrerFormidlingAvUsynligKandidat
                            formidling={this.state.formidlingAvUsynligKandidat}
                            onChange={this.onNyUsynligKandidatChange}
                        />
                    )}
                {this.props.stillingsId &&
                    !this.props.kandidatliste.kanEditere &&
                    harValgtUsynligKandidat && (
                        <>
                            <Element className="legg-til-kandidat__ikke-eier-feilmelding" tag="h2">
                                Registrer formidling på kandidater som ikke er synlige i
                                Rekrutteringsbistand
                            </Element>
                            <Normaltekst>
                                Du er ikke eier av stillingen og kan derfor ikke registrere
                                formidling.
                            </Normaltekst>
                        </>
                    )}
                {this.props.formidlingAvUsynligKandidat.kind === Nettstatus.Feil && (
                    <Feilmelding className="LeggTilKandidatModal__feil-ved-registrering">
                        {this.props.formidlingAvUsynligKandidat.error.status === 409
                            ? 'Kandidaten er allerede formidlet.'
                            : 'Det skjedde en feil ved registrering.'}
                    </Feilmelding>
                )}
                <div>
                    {harValgtUsynligKandidat && this.props.stillingsId ? (
                        <Hovedknapp
                            className="legg-til--knapp"
                            onClick={this.registrerFormidlingAvUsynligKandidat}
                            spinner={
                                this.props.formidlingAvUsynligKandidat.kind === Nettstatus.SenderInn
                            }
                            disabled={
                                this.props.formidlingAvUsynligKandidat.kind ===
                                    Nettstatus.SenderInn || !harValgtEtAlternativ
                            }
                        >
                            Legg til
                        </Hovedknapp>
                    ) : (
                        <Hovedknapp
                            className="legg-til--knapp"
                            onClick={this.leggTilKandidat}
                            spinner={leggTilKandidatStatus === LAGRE_STATUS.LOADING}
                            disabled={
                                leggTilKandidatStatus === LAGRE_STATUS.LOADING ||
                                !this.kandidatenKanLeggesTil()
                            }
                        >
                            Legg til
                        </Hovedknapp>
                    )}
                    <Flatknapp
                        className="avbryt--knapp"
                        onClick={onClose}
                        disabled={leggTilKandidatStatus === LAGRE_STATUS.LOADING}
                    >
                        Avbryt
                    </Flatknapp>
                </div>
            </ModalMedKandidatScope>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    fodselsnummer: state.kandidatliste.fodselsnummer,
    kandidat: state.kandidatliste.kandidat,
    søkPåusynligKandidat: state.kandidatliste.søkPåusynligKandidat,
    hentStatus: state.kandidatliste.hentStatus,
    leggTilKandidatStatus: state.kandidatliste.leggTilKandidater.lagreStatus,
    formidlingAvUsynligKandidat: state.kandidatliste.formidlingAvUsynligKandidat,
    notat: state.kandidatliste.notat,
    navKontor: state.navKontor.valgtNavKontor,
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
        kandidater: Array<KandidatOutboundDto>,
        kandidatliste: {
            kandidatlisteId: string;
        }
    ) => {
        dispatch({ type: KandidatlisteActionType.LEGG_TIL_KANDIDATER, kandidater, kandidatliste });
    },
    formidleUsynligKandidat: (
        kandidatlisteId: string,
        formidling: FormidlingAvUsynligKandidatOutboundDto
    ) => {
        dispatch({
            type: KandidatlisteActionType.FORMIDLE_USYNLIG_KANDIDAT,
            kandidatlisteId,
            formidling,
        });
    },
    setNotat: (notat: string) => {
        dispatch({ type: KandidatlisteActionType.SET_NOTAT, notat });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeggTilKandidatModal);
