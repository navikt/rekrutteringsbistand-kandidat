/* eslint-disable react/no-did-update-set-state */
import React, { Component, ChangeEvent } from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Input, Textarea } from 'nav-frontend-skjema';
import { Systemtittel, Normaltekst, Element, Feilmelding } from 'nav-frontend-typografi';
import fnrValidator from '@navikt/fnrvalidator';

import { CvSøkeresultat, Fødselsnummersøk } from '../../../kandidatside/cv/reducer/cv-typer';
import { Nettstatus, Nettressurs, NettressursMedForklaring } from '../../../api/Nettressurs';
import AppState from '../../../AppState';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import NavnPåUsynligKandidat from './NavnPåUsynligKandidat';
import RegistrerFormidlingAvUsynligKandidat from './RegistrerFormidlingAvUsynligKandidat';
import { sendEvent } from '../../../amplitude/amplitude';
import ModalMedKandidatScope from '../../../common/ModalMedKandidatScope';
import { Kandidatliste } from '../../domene/Kandidatliste';
import { UsynligKandidat } from '../../domene/Kandidat';
import './LeggTilKandidatModal.less';
import KandidatenFinnesIkke from './kandidaten-finnes-ikke/KandidatenFinnesIkke';
import { Synlighetsevaluering } from './kandidaten-finnes-ikke/Synlighetsevaluering';

const MAKS_NOTATLENGDE = 2000;

export type KandidatOutboundDto = {
    kandidatnr: string;
    notat?: string;
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
    kandidat: CvSøkeresultat;
    resetSøk: () => void;
    søkPåusynligKandidat: Nettressurs<UsynligKandidat[]>;
    fødselsnummersøk: NettressursMedForklaring<Fødselsnummersøk, Synlighetsevaluering>;
    leggTilKandidatStatus: Nettstatus;
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
        const { fødselsnummersøk, søkPåusynligKandidat, fodselsnummer } = this.props;

        if (prevProps.fødselsnummersøk.kind !== fødselsnummersøk.kind) {
            if (fødselsnummersøk.kind === Nettstatus.Suksess) {
                this.setState({
                    visResultatFraCvSøk: true,
                    errorMessage: undefined,
                    showAlleredeLagtTilWarning: this.kandidatenFinnesAllerede(),
                });
            } else if (fødselsnummersøk.kind === Nettstatus.FinnesIkkeMedForklaring) {
                this.setState({
                    visResultatFraCvSøk: false,
                    errorMessage: (
                        <KandidatenFinnesIkke synlighetsevaluering={fødselsnummersøk.forklaring} />
                    ),
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
        console.log('Kandidater', this.props.kandidatliste.kandidater);

        const kandidat = this.props.kandidatliste.kandidater.filter(
            (k) => this.props.kandidat.arenaKandidatnr === k.kandidatnr
        );
        return kandidat.length > 0;
    };

    kandidatenKanLeggesTil = () =>
        this.props.fødselsnummersøk.kind === Nettstatus.Suksess &&
        !this.kandidatenFinnesAllerede() &&
        this.props.notat.length <= MAKS_NOTATLENGDE;

    leggTilKandidat = () => {
        const { kandidat, kandidatliste, fodselsnummer, notat } = this.props;
        const kandidater: KandidatOutboundDto[] = [
            {
                kandidatnr: kandidat.arenaKandidatnr,
                notat,
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
                    Før du legger en kandidat på kandidatlisten må du undersøke om personen
                    oppfyller kravene som er nevnt i stillingen.
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
                            spinner={leggTilKandidatStatus === Nettstatus.SenderInn}
                            disabled={
                                leggTilKandidatStatus === Nettstatus.SenderInn ||
                                !this.kandidatenKanLeggesTil()
                            }
                        >
                            Legg til
                        </Hovedknapp>
                    )}
                    <Flatknapp
                        className="avbryt--knapp"
                        onClick={onClose}
                        disabled={leggTilKandidatStatus === Nettstatus.SenderInn}
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
    fødselsnummersøk: state.kandidatliste.fødselsnummersøk,
    leggTilKandidatStatus: state.kandidatliste.leggTilKandidater.lagreStatus,
    formidlingAvUsynligKandidat: state.kandidatliste.formidlingAvUsynligKandidat,
    notat: state.kandidatliste.notat,
    navKontor: state.navKontor.valgtNavKontor,
});

const mapDispatchToProps = (dispatch: Dispatch<KandidatlisteAction>) => ({
    setFodselsnummer: (fodselsnummer: string) => {
        dispatch({ type: KandidatlisteActionType.SetFodselsnummer, fodselsnummer });
    },
    hentKandidatMedFnr: (fodselsnummer: string) => {
        dispatch({ type: KandidatlisteActionType.HentKandidatMedFnr, fodselsnummer });
    },
    resetSøk: () => {
        dispatch({ type: KandidatlisteActionType.LeggTilKandidatSøkReset });
    },
    leggTilKandidatMedFnr: (
        kandidater: Array<KandidatOutboundDto>,
        kandidatliste: {
            kandidatlisteId: string;
        }
    ) => {
        dispatch({ type: KandidatlisteActionType.LeggTilKandidater, kandidater, kandidatliste });
    },
    formidleUsynligKandidat: (
        kandidatlisteId: string,
        formidling: FormidlingAvUsynligKandidatOutboundDto
    ) => {
        dispatch({
            type: KandidatlisteActionType.FormidleUsynligKandidat,
            kandidatlisteId,
            formidling,
        });
    },
    setNotat: (notat: string) => {
        dispatch({ type: KandidatlisteActionType.SetNotat, notat });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeggTilKandidatModal);
