import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SkjemaGruppe, Input, Textarea } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';

const FELTER = {
    TITTEL: 'TITTEL',
    BESKRIVELSE: 'BESKRIVELSE',
    OPPDRAGSGIVER: 'OPPDRAGSGIVER'
};

export default class OpprettKandidatlisteForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatlisteInfo: props.kandidatlisteInfo,
            visValideringsfeilInput: false
        };
    }

    validateAndSave = () => {
        if (this.formValidates()) {
            this.props.onSave(this.state.kandidatlisteInfo);
        } else {
            this.setState({
                visValideringsfeilInput: true
            });
        }
    };

    formValidates = () => {
        const validTittel = this.state.kandidatlisteInfo.tittel !== '';
        const validBeskrivelse = (
            this.state.kandidatlisteInfo.beskrivelse !== undefined
            && this.state.kandidatlisteInfo.beskrivelse.length <= 255);
        return validTittel && validBeskrivelse;
    };

    updateField = (field, value) => {
        if (this.props.onChange) {
            this.props.onChange();
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
        } else if (field === FELTER.OPPDRAGSGIVER) {
            this.setState({
                ...this.state,
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    oppdragsgiver: value
                }
            });
        }
    };

    render() {
        const { backLink, saving, knappTekst } = this.props;
        return (
            <SkjemaGruppe>
                <div className="OpprettKandidatlisteForm">
                    <div className="OpprettKandidatlisteForm__input">
                        <Normaltekst>* er obligatoriske felter du må fylle ut</Normaltekst>
                    </div>
                    <div className="OpprettKandidatlisteForm__input">
                        <Input
                            label="Navn på kandidatliste *"
                            placeholder="For eksempel barnehagelærer, Oslo"
                            value={this.state.kandidatlisteInfo.tittel}
                            onChange={(event) => {
                                this.updateField(FELTER.TITTEL, event.target.value);
                            }}
                            feil={this.state.visValideringsfeilInput ? { feilmelding: 'Navn må være utfylt' } : undefined}
                        />
                    </div>
                    <div className="OpprettKandidatlisteForm__input">
                        <Textarea

                            textareaClass="OpprettKandidatlisteForm__input__textarea"
                            label="Beskrivelse"
                            placeholder="Skrive noen ord om stillingen du søker kandidater til"
                            value={this.state.kandidatlisteInfo.beskrivelse}
                            maxLength={255}
                            feil={this.state.kandidatlisteInfo.beskrivelse && this.state.kandidatlisteInfo.beskrivelse.length > 255 ? { feilmelding: '' } : undefined}
                            onChange={(event) => {
                                this.updateField(FELTER.BESKRIVELSE, event.target.value);
                            }}
                        />
                    </div>
                    <div className="OpprettKandidatlisteForm__input">
                        <Input
                            label="Oppdragsgiver"
                            placeholder="For eksempel NAV"
                            value={this.state.kandidatlisteInfo.oppdragsgiver}
                            onChange={(event) => {
                                this.updateField(FELTER.OPPDRAGSGIVER, event.target.value);
                            }}
                        />
                    </div>
                    <Hovedknapp onClick={this.validateAndSave} spinner={saving}>
                        {knappTekst}
                    </Hovedknapp>
                    {this.props.onAvbrytClick !== undefined ?
                        <Flatknapp className="knapp--avbryt" onClick={this.props.onAvbrytClick}>Avbryt</Flatknapp> :
                        (<div className="OpprettKandidatlisteForm__avbryt-lenke-wrapper">
                            <Link to={backLink} className="lenke">Avbryt</Link>
                        </div>)}
                </div>
            </SkjemaGruppe>
        );
    }
}

OpprettKandidatlisteForm.defaultProps = {
    saving: false,
    onChange: undefined,
    onAvbrytClick: undefined,
    backLink: undefined,
    knappTekst: 'Lagre'
};

OpprettKandidatlisteForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    backLink: PropTypes.string,
    kandidatlisteInfo: PropTypes.shape({
        tittel: PropTypes.string,
        beskrivelse: PropTypes.string,
        oppdragsgiver: PropTypes.string,
        stillingsId: PropTypes.string
    }).isRequired,
    saving: PropTypes.bool,
    onAvbrytClick: PropTypes.func,
    knappTekst: PropTypes.string
};
