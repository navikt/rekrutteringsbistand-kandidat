import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Input, Textarea } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { erGyldigEpost } from '../../../felles/epostValidering';
import ModalMedKandidatScope from '../../../ModalMedKandidatScope';
import './PresenterKandidaterModal.less';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

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
            } else if (!erGyldigEpost(mailadresseFelt.value.trim())) {
                return {
                    ...mailadresseFelt,
                    errorTekst: 'Mailadressen er ugyldig',
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
            <ModalMedKandidatScope
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
                    <AlertStripeAdvarsel>
                        Husk at du må kontakte kandidatene og undersøke om stillingen er aktuell før
                        du deler med arbeidsgiver.
                    </AlertStripeAdvarsel>
                    <Normaltekst>* er obligatoriske felter du må fylle ut</Normaltekst>
                    <Normaltekst className="forklaringstekst">
                        Arbeidsgiveren du deler listen med vil motta en e-post med navn på stilling
                        og lenke for å logge inn. Etter innlogging kan arbeidsgiveren se
                        kandidatlisten.
                    </Normaltekst>
                    <div className="mailadresser">
                        {this.state.mailadresser.map((mailadresseFelt) => (
                            <Input
                                className={`${mailadresseFelt.show ? ' show' : ''}`}
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
                                    mailadresseFelt.errorTekst
                                        ? mailadresseFelt.errorTekst
                                        : undefined
                                }
                            />
                        ))}
                        <Flatknapp mini onClick={this.leggTilMailadressefelt}>
                            + Legg til flere
                        </Flatknapp>
                    </div>
                    <div>
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
            </ModalMedKandidatScope>
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
