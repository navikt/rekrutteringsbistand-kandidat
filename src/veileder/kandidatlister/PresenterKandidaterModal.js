import React from 'react';
import PropTypes from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Input, Textarea } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';

const initalState = () => ({
    beskjed: '',
    mailadresser: [{
        id: 0,
        value: '',
        errorTekst: undefined,
        show: true
    }]
});

export default class PresenterKandidaterModal extends React.Component {
    constructor() {
        super();
        this.state = initalState();
    }

    onMailadresseChange = (id) => (
        (e) => {
            this.setState({
                mailadresser: this.state.mailadresser.map((mailadresseFelt) => {
                    if (mailadresseFelt.id === id) {
                        return {
                            ...mailadresseFelt,
                            value: e.target.value,
                            errorTekst: undefined
                        };
                    }
                    return mailadresseFelt;
                })
            });
        }
    );

    onBeskjedChange = (e) => {
        this.setState({
            beskjed: e.target.value
        });
    };

    showInputFelt = (id) => {
        this.setState({
            mailadresser: this.state.mailadresser.map((mailadresseFelt) => {
                if (mailadresseFelt.id === id) {
                    return {
                        ...mailadresseFelt,
                        show: true
                    };
                }
                return mailadresseFelt;
            })
        });
    };

    leggTilMailadressefelt = () => {
        const id = this.state.mailadresser.length;
        this.setState({
            mailadresser: this.state.mailadresser.concat({
                id,
                value: '',
                errorTekst: undefined,
                show: false
            })
        });
        setTimeout(() => { this.showInputFelt(id); }, 10);
    };

    validerOgLagre = () => {
        const validerteMailadresser = this.state.mailadresser.map((mailadresseFelt) => {
            if (mailadresseFelt.id === 0 && !mailadresseFelt.value.trim()) {
                return {
                    ...mailadresseFelt,
                    errorTekst: 'Feltet er påkrevd'
                };
            } else if (mailadresseFelt.value.trim() && !mailadresseFelt.value.includes('@')) {
                return {
                    ...mailadresseFelt,
                    errorTekst: 'Mailadresse må inneholde @'
                };
            }
            return mailadresseFelt;
        });

        if (validerteMailadresser.filter((mailadresseFelt) => mailadresseFelt.errorTekst).length !== 0) {
            this.setState({
                mailadresser: validerteMailadresser
            });
        } else {
            this.props.onSubmit(
                this.state.beskjed,
                this.state.mailadresser
                    .map((mailadresseFelt) => mailadresseFelt.value)
                    .filter((mailadresse) => mailadresse.trim())
            );
        }
    };

    render() {
        const { vis } = this.props;
        return (
            <NavFrontendModal
                contentLabel="modal del kandidater"
                isOpen={vis}
                onRequestClose={this.props.onClose}
                className="PresenterKandidaterModal"
                appElement={document.getElementById('app')}
            >
                <div className="wrapper">
                    <Systemtittel>Del kandidater med arbeidsgiver</Systemtittel>
                    <Normaltekst className="forklaringstekst">
                        De du ønsker å dele listen med vil motta en e-post
                        med beskjed om at de kan logge inn for å se kandidatene.
                    </Normaltekst>
                    <div className="mailadresser">
                        { this.state.mailadresser.map((mailadresseFelt) => (
                            <Input
                                className={mailadresseFelt.show ? 'show' : undefined}
                                key={`mailadressefelt_${mailadresseFelt.id}`}
                                label={mailadresseFelt.id === 0 ? 'Mailadresse til arbeidsgiver*' : ''}
                                placeholder={mailadresseFelt.id === 0 ? 'For eksempel: kari.nordmann@firma.no' : undefined}
                                value={mailadresseFelt.value}
                                onChange={this.onMailadresseChange(mailadresseFelt.id)}
                                feil={mailadresseFelt.errorTekst && { feilmelding: mailadresseFelt.errorTekst }}
                            />
                        ))}
                        <Flatknapp mini onClick={this.leggTilMailadressefelt}>+ Legg til flere</Flatknapp>
                    </div>
                    <Textarea
                        label="Melding til arbeidsgiver"
                        textareaClass="beskjed"
                        value={this.state.beskjed}
                        onChange={this.onBeskjedChange}
                    />
                    <div>
                        <Hovedknapp onClick={this.validerOgLagre}>Del</Hovedknapp>
                        <Flatknapp onClick={this.props.onClose}>Avbryt</Flatknapp>
                    </div>
                </div>
            </NavFrontendModal>
        );
    }
}
PresenterKandidaterModal.defaultProps = {
    vis: true
};

PresenterKandidaterModal.propTypes = {
    vis: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
