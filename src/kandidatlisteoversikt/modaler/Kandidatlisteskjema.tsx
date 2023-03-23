import React, { ChangeEvent } from 'react';
import { SkjemaGruppe, Input, Textarea } from 'nav-frontend-skjema';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import Typeahead from '../../common/typeahead/Typeahead';
import {
    FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER,
    CLEAR_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER,
} from '../../common/typeahead/enhetsregisterReducer';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { capitalizeEmployerName, capitalizeLocation } from '../../kandidatsøk/utils';
import AppState from '../../AppState';
import { Dispatch } from 'redux';

export type Kandidatlisteinfo = {
    tittel: string;
    beskrivelse: string | null;
    organisasjonNavn: string | null;
    organisasjonReferanse: string | null;
};

type Suggestion = {
    name: string;
    orgnr: string;
    location: {
        address?: string;
        postalCode?: string;
        city?: string;
    };
};

type Props = {
    onSave: (info: Kandidatlisteinfo) => void;
    resetStatusTilUnsaved?: () => void;
    info: Kandidatlisteinfo;
    saving: boolean;
    onAvbrytClick: () => void;
    knappetekst: string;
    suggestions: Suggestion[];
    fetchTypeaheadSuggestions: (value: string) => void;
    clearTypeaheadSuggestions: () => void;
};

class OpprettKandidatlisteForm extends React.Component<Props> {
    textArea: HTMLTextAreaElement | null;
    input: HTMLInputElement | null;
    state: {
        visValideringsfeilInput: boolean;
        typeaheadValue: string;
        kandidatlisteInfo: Kandidatlisteinfo & {
            bedrift?: {
                name: string;
                orgnr: string;
            };
        };
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            kandidatlisteInfo: {
                ...props.info,
                bedrift:
                    props.info.organisasjonNavn && props.info.organisasjonReferanse
                        ? {
                              name: props.info.organisasjonNavn,
                              orgnr: props.info.organisasjonReferanse,
                          }
                        : undefined,
            },
            visValideringsfeilInput: false,
            typeaheadValue: props.info.organisasjonNavn
                ? capitalizeEmployerName(props.info.organisasjonNavn)
                : '',
        };
    }

    componentWillUnmount() {
        this.props.clearTypeaheadSuggestions();
    }

    onTittelChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        this.setState({
            kandidatlisteInfo: {
                ...this.state.kandidatlisteInfo,
                tittel: value,
            },
            visValideringsfeilInput: this.state.visValideringsfeilInput && value === '',
        });

        if (this.props.resetStatusTilUnsaved) {
            this.props.resetStatusTilUnsaved();
        }
    };

    onBeskrivelseChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;

        this.setState({
            kandidatlisteInfo: {
                ...this.state.kandidatlisteInfo,
                beskrivelse: value,
            },
        });

        if (this.props.resetStatusTilUnsaved) {
            this.props.resetStatusTilUnsaved();
        }
    };

    onBedriftChange = (value: string) => {
        if (value !== '') {
            this.props.fetchTypeaheadSuggestions(value);
            this.setState({
                typeaheadValue: value,
            });
        } else {
            this.props.clearTypeaheadSuggestions();
            this.setState({
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    bedrift: undefined,
                },
                typeaheadValue: value,
            });
        }
    };

    onBedriftSelect = ({ value }) => {
        const bedrift = this.props.suggestions.find((s) => s.orgnr === value);
        if (bedrift) {
            this.setState({
                typeaheadValue: bedrift ? capitalizeEmployerName(bedrift.name) : '',
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    bedrift,
                },
            });
        }
    };

    onBedriftSubmit = (e) => {
        e.preventDefault();
        this.setBedrift();
    };

    onTypeAheadBlur = () => {
        this.setBedrift();
    };

    setBedrift = () => {
        const bedrift = this.lookUpEmployer(this.state.typeaheadValue);
        if (bedrift) {
            this.setState({
                typeaheadValue: bedrift ? capitalizeEmployerName(bedrift.name) : '',
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    bedrift,
                },
            });
        }
    };

    getEmployerSuggestionLabel = (suggestion: Suggestion) => {
        let commaSeparate = [];

        if (suggestion.location) {
            if (suggestion.location.address) {
                commaSeparate = [...commaSeparate, suggestion.location.address];
            }
            if (suggestion.location.postalCode) {
                commaSeparate = [...commaSeparate, suggestion.location.postalCode];
            }
            if (suggestion.location.city) {
                commaSeparate = [...commaSeparate, capitalizeLocation(suggestion.location.city)];
            }
        }

        if (suggestion.orgnr) {
            const groupedOrgNumber = suggestion.orgnr.match(/.{1,3}/g).join(' ');
            commaSeparate = [...commaSeparate, `Virksomhetsnummer: ${groupedOrgNumber}`];
        }

        return (
            <div className="Employer__typeahead__item">
                <Normaltekst>{capitalizeEmployerName(suggestion.name)}</Normaltekst>
                <Undertekst>{commaSeparate.join(', ')}</Undertekst>
            </div>
        );
    };

    lookUpEmployer = (value) =>
        this.props.suggestions.find(
            (employer) =>
                employer.name.toLowerCase() === value.toLowerCase() ||
                employer.orgnr === value.replace(/\s/g, '')
        );

    validateAndSave = () => {
        if (this.validerTittel() && this.validerBeskrivelse()) {
            const { tittel, beskrivelse, bedrift } = this.state.kandidatlisteInfo;
            this.props.onSave({
                ...this.state.kandidatlisteInfo,
                tittel,
                beskrivelse,
                orgNr: bedrift ? bedrift.orgnr : undefined,
                orgNavn: bedrift ? bedrift.name : undefined,
            });
        } else if (!this.validerTittel()) {
            this.setState(
                {
                    visValideringsfeilInput: true,
                },
                () => this.input?.focus()
            );
        } else if (!this.validerBeskrivelse()) {
            this.textArea?.focus();
        }
    };

    validerTittel = () => this.state.kandidatlisteInfo.tittel !== '';

    validerBeskrivelse = () =>
        this.state.kandidatlisteInfo.beskrivelse !== undefined &&
        this.state.kandidatlisteInfo.beskrivelse.length <= 1000;

    render() {
        const { saving, knappetekst, suggestions } = this.props;
        const { bedrift } = this.state.kandidatlisteInfo;
        const location = bedrift ? bedrift.location : undefined;

        return (
            <SkjemaGruppe>
                <div className="OpprettKandidatlisteForm">
                    <div className="OpprettKandidatlisteForm__input">
                        <Input
                            className="skjemaelement--pink"
                            id="kandidatliste-navn-input"
                            label="Navn på kandidatliste *"
                            placeholder="For eksempel: Jobbmesse, Oslo, 21.05.2019"
                            value={this.state.kandidatlisteInfo.tittel}
                            onChange={this.onTittelChange}
                            feil={
                                this.state.visValideringsfeilInput
                                    ? 'Navn på kandidatliste mangler'
                                    : undefined
                            }
                            inputRef={(input) => {
                                this.input = input;
                            }}
                            autoComplete="off"
                        />
                    </div>
                    <div className="OpprettKandidatlisteForm__input OpprettKandidatlisteForm__typeahead">
                        <Typeahead
                            label="Arbeidsgiver (Bedriftens navn hentet fra Enhetsregisteret)"
                            placeholder="Skriv inn arbeidsgivers navn eller virksomhetsnummer"
                            onChange={this.onBedriftChange}
                            onSelect={this.onBedriftSelect}
                            onSubmit={this.onBedriftSubmit}
                            suggestions={suggestions.map((s) => ({
                                value: s.orgnr,
                                label: this.getEmployerSuggestionLabel(s),
                            }))}
                            value={this.state.typeaheadValue}
                            id="OpprettKandidatlisteForm__typeahead-bedrift"
                            onTypeAheadBlur={this.onTypeAheadBlur}
                            shouldHighlightInput={false}
                        />
                        {bedrift && location && (
                            <Undertekst className="OpprettKandidatlisteForm__bedrift">
                                {capitalizeEmployerName(bedrift.name)}, {location.address},{' '}
                                {location.postalCode} {capitalizeLocation(location.city)}
                            </Undertekst>
                        )}
                    </div>
                    <div className="OpprettKandidatlisteForm__input">
                        <Textarea
                            id="kandidatliste-beskrivelse-input"
                            textareaClass="OpprettKandidatlisteForm__input__textarea skjemaelement--pink"
                            label="Beskrivelse"
                            value={this.state.kandidatlisteInfo.beskrivelse ?? ''}
                            maxLength={1000}
                            feil={
                                this.state.kandidatlisteInfo.beskrivelse &&
                                this.state.kandidatlisteInfo.beskrivelse.length > 1000
                                    ? 'Beskrivelsen er for lang'
                                    : undefined
                            }
                            onChange={this.onBeskrivelseChange}
                            textareaRef={(textArea) => {
                                this.textArea = textArea;
                            }}
                        />
                    </div>
                    <Hovedknapp
                        id="kandidatliste-opprett-knapp"
                        onClick={this.validateAndSave}
                        spinner={saving}
                        disabled={saving}
                    >
                        {knappetekst}
                    </Hovedknapp>
                    <Flatknapp
                        className="knapp--avbryt"
                        onClick={this.props.onAvbrytClick}
                        disabled={saving}
                    >
                        Avbryt
                    </Flatknapp>
                </div>
            </SkjemaGruppe>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    suggestions: state.enhetsregister.suggestions,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchTypeaheadSuggestions: (value: string) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER, value }),
    clearTypeaheadSuggestions: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER }),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettKandidatlisteForm);
