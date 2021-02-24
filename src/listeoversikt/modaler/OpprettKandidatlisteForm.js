import React from 'react';
import PropTypes from 'prop-types';
import { SkjemaGruppe, Input, Textarea } from 'nav-frontend-skjema';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import Typeahead from '../../common/typeahead/Typeahead';
import {
    FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER,
    CLEAR_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER,
} from '../../common/typeahead/enhetsregisterReducer';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';

export const tomKandidatlisteInfo = () => ({
    tittel: '',
    beskrivelse: '',
    bedrift: undefined,
});

class OpprettKandidatlisteForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatlisteInfo: {
                ...props.kandidatlisteInfo,
                bedrift:
                    props.kandidatlisteInfo.organisasjonNavn &&
                    props.kandidatlisteInfo.organisasjonReferanse
                        ? {
                              name: props.kandidatlisteInfo.organisasjonNavn,
                              orgnr: props.kandidatlisteInfo.organisasjonReferanse,
                          }
                        : undefined,
            },
            visValideringsfeilInput: false,
            typeaheadValue: props.kandidatlisteInfo.organisasjonNavn
                ? this.capitalizeEmployerName(props.kandidatlisteInfo.organisasjonNavn)
                : '',
        };
    }

    componentWillUnmount() {
        this.props.clearTypeaheadSuggestions();
    }

    onTittelChange = (event) => {
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

    onBeskrivelseChange = (event) => {
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

    onBedriftChange = (value) => {
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
                typeaheadValue: bedrift ? this.capitalizeEmployerName(bedrift.name) : '',
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
                typeaheadValue: bedrift ? this.capitalizeEmployerName(bedrift.name) : '',
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    bedrift,
                },
            });
        }
    };

    getEmployerSuggestionLabel = (suggestion) => {
        let commaSeparate = [];
        if (suggestion.location) {
            if (suggestion.location.address) {
                commaSeparate = [...commaSeparate, suggestion.location.address];
            }
            if (suggestion.location.postalCode) {
                commaSeparate = [...commaSeparate, suggestion.location.postalCode];
            }
            if (suggestion.location.city) {
                commaSeparate = [
                    ...commaSeparate,
                    this.capitalizeLocation(suggestion.location.city),
                ];
            }
        }
        if (suggestion.orgnr) {
            const groupedOrgNumber = suggestion.orgnr.match(/.{1,3}/g).join(' ');
            commaSeparate = [...commaSeparate, `Virksomhetsnummer: ${groupedOrgNumber}`];
        }
        return (
            <div className="Employer__typeahead__item">
                <Normaltekst>{this.capitalizeEmployerName(suggestion.name)}</Normaltekst>
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

    capitalizeEmployerName = (text) => {
        const separators = [' ', '-', '(', '/'];

        const ignore = ['i', 'og', 'for', 'på', 'avd', 'av'];

        const keep = ['as', 'ab', 'asa', 'ba', 'sa'];

        if (text) {
            let capitalized = text.toLowerCase();

            for (let i = 0, len = separators.length; i < len; i += 1) {
                const fragments = capitalized.split(separators[i]);
                for (let j = 0, x = fragments.length; j < x; j += 1) {
                    if (keep.includes(fragments[j])) {
                        fragments[j] = fragments[j].toUpperCase();
                    } else if (!ignore.includes(fragments[j])) {
                        if (fragments[j][0] !== undefined) {
                            fragments[j] = fragments[j][0].toUpperCase() + fragments[j].substr(1);
                        }
                    }
                }
                capitalized = fragments.join(separators[i]);
            }

            return capitalized;
        }
        return text;
    };

    capitalizeLocation = (text) => {
        const separators = [
            ' ', // NORDRE LAND skal bli Nordre Land
            '-', // AUST-AGDER skal bli Aust-Agder
            '(', // BØ (TELEMARK) skal bli Bø (Telemark)
        ];

        const ignore = [
            'i',
            'og', // MØRE OG ROMSDAL skal bli Møre og Romsdal
        ];

        if (text) {
            try {
                let capitalized = text.toLowerCase();

                for (let i = 0, len = separators.length; i < len; i += 1) {
                    const fragments = capitalized.split(separators[i]);
                    for (let j = 0, x = fragments.length; j < x; j += 1) {
                        if (fragments[j] && !ignore.includes(fragments[j])) {
                            fragments[j] = fragments[j][0].toUpperCase() + fragments[j].substr(1);
                        }
                    }
                    capitalized = fragments.join(separators[i]);
                }

                return capitalized;
            } catch (e) {
                return text;
            }
        }
        return text;
    };

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
                () => this.input.focus()
            );
        } else if (!this.validerBeskrivelse()) {
            this.textArea.focus();
        }
    };

    validerTittel = () => this.state.kandidatlisteInfo.tittel !== '';

    validerBeskrivelse = () =>
        this.state.kandidatlisteInfo.beskrivelse !== undefined &&
        this.state.kandidatlisteInfo.beskrivelse.length <= 1000;

    render() {
        const { saving, knappTekst, suggestions } = this.props;
        const { bedrift } = this.state.kandidatlisteInfo;
        const location = bedrift ? bedrift.location : undefined;
        return (
            <SkjemaGruppe>
                <div className="OpprettKandidatlisteForm">
                    <div className="OpprettKandidatlisteForm__input">
                        <Normaltekst>* felter som må fylles ut</Normaltekst>
                    </div>
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
                                {this.capitalizeEmployerName(bedrift.name)}, {location.address},{' '}
                                {location.postalCode} {this.capitalizeLocation(location.city)}
                            </Undertekst>
                        )}
                    </div>
                    <div className="OpprettKandidatlisteForm__input">
                        <Textarea
                            id="kandidatliste-beskrivelse-input"
                            textareaClass="OpprettKandidatlisteForm__input__textarea skjemaelement--pink"
                            label="Beskrivelse"
                            value={this.state.kandidatlisteInfo.beskrivelse}
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
                        {knappTekst}
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

OpprettKandidatlisteForm.defaultProps = {
    saving: false,
    resetStatusTilUnsaved: undefined,
    knappTekst: 'Lagre',
    bedrift: undefined,
};

OpprettKandidatlisteForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    resetStatusTilUnsaved: PropTypes.func,
    kandidatlisteInfo: PropTypes.shape({
        tittel: PropTypes.string,
        beskrivelse: PropTypes.string,
        organisasjonNavn: PropTypes.string,
        organisasjonReferanse: PropTypes.string,
    }).isRequired,
    saving: PropTypes.bool,
    onAvbrytClick: PropTypes.func.isRequired,
    knappTekst: PropTypes.string,
    suggestions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
        })
    ).isRequired,
    fetchTypeaheadSuggestions: PropTypes.func.isRequired,
    clearTypeaheadSuggestions: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    suggestions: state.enhetsregister.suggestions,
});

const mapDispatchToProps = (dispatch) => ({
    fetchTypeaheadSuggestions: (value) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER, value }),
    clearTypeaheadSuggestions: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER }),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettKandidatlisteForm);
