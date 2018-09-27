import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SkjemaGruppe, Input, Textarea } from 'nav-frontend-skjema';
import KnappMedDisabledFunksjon from '../common/KnappMedDisabledFunksjon';

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

    onUnvalidatedSave = () => {
        this.props.onDisabledClick();
        this.setState({
            visValideringsfeilInput: true
        });
    };

    validateAndSave = () => {
        if (this.formValidates()) {
            this.props.onSave(this.state.kandidatlisteInfo);
        }
    };

    formValidates = () => (
        this.state.kandidatlisteInfo.tittel !== ''
    );

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
        const { backLink, saving } = this.props;
        return (
            <SkjemaGruppe>
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
                <KnappMedDisabledFunksjon
                    type="hoved"
                    onClick={this.validateAndSave}
                    onDisabledClick={this.onUnvalidatedSave}
                    disabled={!this.formValidates()}
                    spinner={saving}
                >
                    Lagre
                </KnappMedDisabledFunksjon>
                <div className="OpprettKandidatlisteForm__avbryt-lenke-wrapper">
                    <Link to={backLink} className="lenke">Avbryt</Link>
                </div>
            </SkjemaGruppe>
        );
    }
}

OpprettKandidatlisteForm.defaultProps = {
    saving: false,
    onChange: undefined
};

OpprettKandidatlisteForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onDisabledClick: PropTypes.func.isRequired,
    backLink: PropTypes.string.isRequired,
    kandidatlisteInfo: PropTypes.shape({
        tittel: PropTypes.string,
        beskrivelse: PropTypes.string,
        oppdragsgiver: PropTypes.string,
        stillingsId: PropTypes.string
    }).isRequired,
    saving: PropTypes.bool
};
