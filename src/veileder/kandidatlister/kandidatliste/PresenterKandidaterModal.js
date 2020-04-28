import React from 'react';
import PropTypes from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Input, Textarea } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'pam-frontend-knapper';

const initalState = () => ({
    beskjed: '',
    mailadresser: [
        {
            id: 0,
            value: '',
            errorTekst: undefined,
            show: true,
        },
    ],
});

export default class PresenterKandidaterModal extends React.Component {
    constructor() {
        super();
        this.state = initalState();
    }

    onMailadresseChange = (id) => (e) => {
        this.setState({
            mailadresser: this.state.mailadresser.map((mailadresseFelt) => {
                if (mailadresseFelt.id === id) {
                    return {
                        ...mailadresseFelt,
                        value: e.target.value,
                        errorTekst: undefined,
                    };
                }
                return mailadresseFelt;
            }),
        });
    };

    onBeskjedChange = (e) => {
        this.setState({
            beskjed: e.target.value,
        });
    };

    showInputFelt = (id) => {
        this.setState({
            mailadresser: this.state.mailadresser.map((mailadresseFelt) => {
                if (mailadresseFelt.id === id) {
                    return {
                        ...mailadresseFelt,
                        show: true,
                    };
                }
                return mailadresseFelt;
            }),
        });
    };

    leggTilMailadressefelt = () => {
        const id = this.state.mailadresser.length;
        this.setState({
            mailadresser: this.state.mailadresser.concat({
                id,
                value: '',
                errorTekst: undefined,
                show: false,
            }),
        });
        setTimeout(() => {
            this.showInputFelt(id);
        }, 10);
    };

    validerOgLagre = () => {
        const validerteMailadresser = this.state.mailadresser.map((mailadresseFelt) => {
            if (mailadresseFelt.id === 0 && !mailadresseFelt.value.trim()) {
                return {
                    ...mailadresseFelt,
                    errorTekst: 'Feltet er påkrevd',
                };
            } else if (mailadresseFelt.value.trim() && !mailadresseFelt.value.includes('@')) {
                return {
                    ...mailadresseFelt,
                    errorTekst: 'Mailadresse må inneholde @',
                };
            } else if (
                mailadresseFelt.value.trim() &&
                mailadresseFelt.value.split('@').length > 2
            ) {
                return {
                    ...mailadresseFelt,
                    errorTekst:
                        'Du kan kun skrive én e-postadresse. Bruk "+ Legg til flere" for å dele listen med flere',
                };
            }
            return mailadresseFelt;
        });

        if (
            validerteMailadresser.filter((mailadresseFelt) => mailadresseFelt.errorTekst).length !==
            0
        ) {
            this.setState({
                mailadresser: validerteMailadresser,
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
        const { vis, antallKandidater } = this.props;
        return (
            <NavFrontendModal
                contentLabel="modal del kandidater"
                isOpen={vis}
                onRequestClose={this.props.onClose}
                className="PresenterKandidaterModal"
                appElement={document.getElementById('app')}
            >
                <div className="wrapper">
                    {antallKandidater === 1 ? (
                        <Systemtittel>Del 1 kandidat med arbeidsgiver</Systemtittel>
                    ) : (
                        <Systemtittel>{`Del ${antallKandidater} kandidater med arbeidsgiver`}</Systemtittel>
                    )}
                    <Normaltekst>* er obligatoriske felter du må fylle ut</Normaltekst>
                    <Normaltekst className="forklaringstekst">
                        Arbeidsgiveren du deler listen med vil motta en e-post med navn på stilling
                        og lenke for å logge inn. Etter innlogging kan arbeidsgiveren se
                        kandidatlisten.
                    </Normaltekst>
                    <div className="mailadresser">
                        {this.state.mailadresser.map((mailadresseFelt) => (
                            <Input
                                className={`skjemaelement--pink${
                                    mailadresseFelt.show ? ' show' : ''
                                }`}
                                key={`mailadressefelt_${mailadresseFelt.id}`}
                                label={
                                    mailadresseFelt.id === 0
                                        ? 'E-postadresse til arbeidsgiver*'
                                        : ''
                                }
                                placeholder={
                                    mailadresseFelt.id === 0
                                        ? 'For eksempel: kari.nordmann@firma.no'
                                        : undefined
                                }
                                value={mailadresseFelt.value}
                                onChange={this.onMailadresseChange(mailadresseFelt.id)}
                                feil={
                                    mailadresseFelt.errorTekst && {
                                        feilmelding: mailadresseFelt.errorTekst,
                                    }
                                }
                            />
                        ))}
                        <Flatknapp mini onClick={this.leggTilMailadressefelt}>
                            + Legg til flere
                        </Flatknapp>
                    </div>
                    <div className="skjemaelement--pink">
                        <Textarea
                            label="Melding til arbeidsgiver"
                            textareaClass="beskjed"
                            value={this.state.beskjed}
                            onChange={this.onBeskjedChange}
                        />
                    </div>
                    <div>
                        <Hovedknapp onClick={this.validerOgLagre}>Del</Hovedknapp>
                        <Flatknapp className="avbryt--knapp" onClick={this.props.onClose}>
                            Avbryt
                        </Flatknapp>
                    </div>
                </div>
            </NavFrontendModal>
        );
    }
}
PresenterKandidaterModal.defaultProps = {
    vis: true,
};

PresenterKandidaterModal.propTypes = {
    vis: PropTypes.bool,
    antallKandidater: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};
