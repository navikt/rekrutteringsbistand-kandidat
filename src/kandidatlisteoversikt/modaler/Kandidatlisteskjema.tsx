import React, { ChangeEvent } from 'react';
import { SkjemaGruppe, Input, Textarea } from 'nav-frontend-skjema';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Typeahead from '../../common/typeahead/Typeahead';
import {
    FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER,
    CLEAR_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER,
} from '../../common/typeahead/enhetsregisterReducer';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { capitalizeEmployerName, capitalizeLocation } from '../../kandidatsøk/utils';
import AppState from '../../AppState';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { BodyShort, Detail } from '@navikt/ds-react';

export type KandidatlisteDto = {
    tittel: string;
    beskrivelse?: string;
    orgNr?: string;
    orgNavn?: string;
};

type Suggestion = {
    name: string;
    orgnr: string;
    location?: {
        address?: string;
        postalCode?: string;
        city?: string;
    };
};

type Props = {
    onSave: (info: KandidatlisteDto) => void;
    onClose: () => void;
    kandidatliste?: KandidatlisteSammendrag;
    saving: boolean;
    knappetekst: string;
    suggestions: Suggestion[];
    fetchTypeaheadSuggestions: (value: string) => void;
    clearTypeaheadSuggestions: () => void;
};

class OpprettKandidatlisteForm extends React.Component<Props> {
    textArea: HTMLTextAreaElement | null;
    input: HTMLInputElement | null;
    state: {
        tittel: string;
        beskrivelse?: string;
        suggestion?: Suggestion;
        typeaheadValue: string;
        visValideringsfeilInput: boolean;
    };

    constructor(props: Props) {
        super(props);

        let suggestion: Suggestion | undefined = undefined;

        if (props.kandidatliste) {
            const { organisasjonNavn, organisasjonReferanse } = props.kandidatliste;

            if (organisasjonNavn && organisasjonReferanse) {
                suggestion = {
                    name: organisasjonNavn,
                    orgnr: organisasjonReferanse,
                };
            }
        }

        this.state = {
            suggestion,
            tittel: props.kandidatliste?.tittel || '',
            beskrivelse: props.kandidatliste?.beskrivelse,
            visValideringsfeilInput: false,
            typeaheadValue: suggestion?.name ? capitalizeEmployerName(suggestion?.name) : '',
        };
    }

    componentWillUnmount() {
        this.props.clearTypeaheadSuggestions();
    }

    onTittelChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        this.setState({
            tittel: value,
            visValideringsfeilInput: this.state.visValideringsfeilInput && value === '',
        });
    };

    onBeskrivelseChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;

        this.setState({
            beskrivelse: value,
        });
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
                suggestion: undefined,
                typeaheadValue: value,
            });
        }
    };

    onBedriftSelect = ({ value }) => {
        const suggestion = this.props.suggestions.find((s) => s.orgnr === value);
        if (suggestion) {
            this.setState({
                suggestion,
                typeaheadValue: suggestion ? capitalizeEmployerName(suggestion.name) : '',
            });
        }
    };

    onSuggestionSubmit = (e: Event) => {
        e.preventDefault();
        this.setSuggestion();
    };

    onTypeAheadBlur = () => {
        this.setSuggestion();
    };

    setSuggestion = () => {
        const suggestion = this.lookUpEmployer(this.state.typeaheadValue);
        if (suggestion) {
            this.setState({
                typeaheadValue: suggestion ? capitalizeEmployerName(suggestion.name) : '',
                suggestion,
            });
        }
    };

    getEmployerSuggestionLabel = (suggestion: Suggestion) => {
        let commaSeparate: string[] = [];

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
            const groupedOrgNumber = suggestion.orgnr.match(/.{1,3}/g)?.join(' ');
            commaSeparate = [...commaSeparate, `Virksomhetsnummer: ${groupedOrgNumber}`];
        }

        return (
            <div className="Employer__typeahead__item">
                <BodyShort>{capitalizeEmployerName(suggestion.name)}</BodyShort>
                <Detail>{commaSeparate.join(', ')}</Detail>
            </div>
        );
    };

    lookUpEmployer = (value: string) =>
        this.props.suggestions.find(
            (employer) =>
                employer.name.toLowerCase() === value.toLowerCase() ||
                employer.orgnr === value.replace(/\s/g, '')
        );

    validateAndSave = () => {
        if (this.validerTittel() && this.validerBeskrivelse()) {
            const dto: KandidatlisteDto = {
                tittel: this.state.tittel,
                beskrivelse: this.state.beskrivelse,
                orgNavn: this.state.suggestion?.name,
                orgNr: this.state.suggestion?.orgnr,
            };

            this.props.onSave(dto);
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

    validerTittel = () => this.state.tittel !== '';

    validerBeskrivelse = () =>
        this.state.beskrivelse === undefined || this.state.beskrivelse.length <= 1000;

    render() {
        const { saving, knappetekst, suggestions } = this.props;
        const { suggestion } = this.state;
        const location = suggestion ? suggestion.location : undefined;

        return (
            <SkjemaGruppe>
                <div className="OpprettKandidatlisteForm">
                    <div className="OpprettKandidatlisteForm__input">
                        <Input
                            className="skjemaelement--pink"
                            id="kandidatliste-navn-input"
                            label="Navn på kandidatliste *"
                            placeholder="For eksempel: Jobbmesse, Oslo, 21.05.2019"
                            value={this.state.tittel}
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
                            onSubmit={this.onSuggestionSubmit}
                            suggestions={suggestions.map((s) => ({
                                value: s.orgnr,
                                label: this.getEmployerSuggestionLabel(s),
                            }))}
                            value={this.state.typeaheadValue}
                            id="OpprettKandidatlisteForm__typeahead-bedrift"
                            onTypeAheadBlur={this.onTypeAheadBlur}
                            shouldHighlightInput={false}
                        />
                        {suggestion && location && (
                            <Detail className="OpprettKandidatlisteForm__bedrift">
                                {capitalizeEmployerName(suggestion.name)}, {location.address},{' '}
                                {location.postalCode}{' '}
                                {location.city ? capitalizeLocation(location.city) : ''}
                            </Detail>
                        )}
                    </div>
                    <div className="OpprettKandidatlisteForm__input">
                        <Textarea
                            textareaClass="OpprettKandidatlisteForm__input__textarea skjemaelement--pink"
                            label="Beskrivelse"
                            value={this.state.beskrivelse ?? ''}
                            maxLength={1000}
                            onChange={this.onBeskrivelseChange}
                            feil={
                                this.validerBeskrivelse() ? undefined : 'Beskrivelsen er for lang'
                            }
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
                        onClick={this.props.onClose}
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
