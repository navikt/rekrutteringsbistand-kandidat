import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SkjemaGruppe, Input, Textarea } from 'nav-frontend-skjema';
import KnappMedDisabledFunksjon from '../common/KnappMedDisabledFunksjon';

const FELTER = {
    NAVN: 'NAVN',
    BESKRIVELSE: 'BESKRIVELSE',
    OPPDRAGSGIVER: 'OPPDRAGSGIVER'
};

export default class OpprettKandidatlisteForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatlisteInfo: props.kandidatlisteInfo
        };
    }

    formValidates = () => (
        this.state.kandidatlisteInfo.navn !== ''
    );

    validateAndSave = () => {
        if (this.formValidates()) {
            this.props.onSave(this.state.kandidatlisteInfo);
        }
    };

    updateField = (field, value) => {
        if (field === FELTER.NAVN) {
            this.setState({
                ...this.state,
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    navn: value
                }
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
        const { backLink, onDisabledClick } = this.props;
        return (
            <SkjemaGruppe>
                <div className="OpprettKandidatlisteForm__input">
                    <Input
                        label="Navn på kandidatliste *"
                        placeholder="For eksempel barnehagelærer, Oslo"
                        value={this.state.kandidatlisteInfo.navn}
                        onChange={(event) => {
                            this.updateField(FELTER.NAVN, event.target.value);
                        }}
                    />
                </div>
                <div className="OpprettKandidatlisteForm__input">
                    <Textarea
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
                <KnappMedDisabledFunksjon type="hoved" onClick={this.validateAndSave} onDisabledClick={onDisabledClick} disabled={!this.formValidates()}>Lagre</KnappMedDisabledFunksjon>
                <div className="OpprettKandidatlisteForm__avbryt-lenke-wrapper">
                    <Link to={backLink} className="lenke">Avbryt</Link>
                </div>
            </SkjemaGruppe>
        );
    }
}

OpprettKandidatlisteForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    onDisabledClick: PropTypes.func.isRequired,
    backLink: PropTypes.string.isRequired,
    kandidatlisteInfo: PropTypes.shape({
        navn: PropTypes.string,
        beskrivelse: PropTypes.string,
        oppdragsgiver: PropTypes.string,
        stillingsId: PropTypes.string
    }).isRequired
};
