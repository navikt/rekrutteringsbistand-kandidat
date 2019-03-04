import React from 'react';
import PropTypes from 'prop-types';
import { SkjemaGruppe, Input, Textarea } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';

const FELTER = {
    TITTEL: 'TITTEL',
    BESKRIVELSE: 'BESKRIVELSE'
};

export const tomKandidatlisteInfo = () => ({
    tittel: '',
    beskrivelse: ''
});

export default class OpprettKandidatlisteForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatlisteInfo: props.kandidatlisteInfo,
            visValideringsfeilInput: false
        };
    }

    validateAndSave = () => {
        if (this.validerTittel() && this.validerBeskrivelse()) {
            this.props.onSave(this.state.kandidatlisteInfo);
        } else if (!this.validerTittel()) {
            this.setState({
                visValideringsfeilInput: true
            }, () => this.input.focus());
        } else if (!this.validerBeskrivelse()) {
            this.textArea.focus();
        }
    };

    validerTittel = () => this.state.kandidatlisteInfo.tittel !== '';

    validerBeskrivelse = () => this.state.kandidatlisteInfo.beskrivelse !== undefined && this.state.kandidatlisteInfo.beskrivelse.length <= 255;

    updateField = (field) => (event) => {
        const { value } = event.target;
        if (this.props.resetStatusTilUnsaved) {
            this.props.resetStatusTilUnsaved();
        }
        if (field === FELTER.TITTEL) {
            this.setState({
                ...this.state,
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    tittel: value
                },
                visValideringsfeilInput: this.state.visValideringsfeilInput && value === ''
            });
        } else if (field === FELTER.BESKRIVELSE) {
            this.setState({
                ...this.state,
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    beskrivelse: value
                }
            });
        }
    };

    render() {
        const { saving, knappTekst } = this.props;
        return (
            <SkjemaGruppe>
                <div className="OpprettKandidatlisteForm">
                    <div className="OpprettKandidatlisteForm__input">
                        <Normaltekst>* felter som må fylles ut</Normaltekst>
                    </div>
                    <div className="OpprettKandidatlisteForm__input">
                        <Input
                            id="kandidatliste-navn-input"
                            label="Navn på kandidatliste *"
                            placeholder="For eksempel: Jobbmesse, Oslo, 21.05.2019"
                            value={this.state.kandidatlisteInfo.tittel}
                            onChange={this.updateField(FELTER.TITTEL)}
                            feil={this.state.visValideringsfeilInput ? { feilmelding: 'Navn på kandidatliste mangler' } : undefined}
                            inputRef={(input) => { this.input = input; }}
                            autoComplete="off"
                        />
                    </div>
                    <div className="OpprettKandidatlisteForm__input">
                        <Textarea
                            id="kandidatliste-beskrivelse-input"
                            textareaClass="OpprettKandidatlisteForm__input__textarea"
                            label="Beskrivelse"
                            value={this.state.kandidatlisteInfo.beskrivelse}
                            maxLength={255}
                            feil={this.state.kandidatlisteInfo.beskrivelse && this.state.kandidatlisteInfo.beskrivelse.length > 255 ? { feilmelding: '' } : undefined}
                            onChange={this.updateField(FELTER.BESKRIVELSE)}
                            textareaRef={(textArea) => { this.textArea = textArea; }}
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
    knappTekst: 'Lagre'
};

OpprettKandidatlisteForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    resetStatusTilUnsaved: PropTypes.func,
    kandidatlisteInfo: PropTypes.shape({
        tittel: PropTypes.string,
        beskrivelse: PropTypes.string
    }).isRequired,
    saving: PropTypes.bool,
    onAvbrytClick: PropTypes.func.isRequired,
    knappTekst: PropTypes.string
};
