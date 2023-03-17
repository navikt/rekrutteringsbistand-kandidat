import React, { ChangeEvent } from 'react';
import { Feilmelding, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Input, Textarea } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { inneholderSærnorskeBokstaver, erGyldigEpost } from './epostValidering';
import ModalMedKandidatScope from '../../../common/modal/ModalMedKandidatScope';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Nettstatus } from '../../../api/Nettressurs';
import { Link } from '@navikt/ds-react';
import './PresenterKandidaterModal.less';

type Props = {
    vis?: boolean; // Default true
    deleStatus: Nettstatus;
    onSubmit: (beskjed: string, mailadresser: string[]) => void;
    onClose: () => void;
    antallMarkerteKandidater: number;
    antallKandidaterSomHarSvartJa: number;
    alleKandidaterMåGodkjenneForespørselOmDelingAvCvForÅPresentere: boolean;
};

type State = {
    beskjed: string;
    mailadresser: Array<{
        id: number;
        value: string;
        errorTekst?: string;
        show: boolean;
    }>;
};

class PresenterKandidaterModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            beskjed: '',
            mailadresser: [
                {
                    id: 0,
                    value: '',
                    errorTekst: undefined,
                    show: true,
                },
            ],
        };
    }

    onMailadresseChange = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
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

    onBeskjedChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            beskjed: e.target.value,
        });
    };

    showInputFelt = (id: number) => {
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
        // TODO: Verifiser at NAV-kontor er valgt, send med i onSubmit
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
            } else if (inneholderSærnorskeBokstaver(mailadresseFelt.value.trim())) {
                return {
                    ...mailadresseFelt,
                    errorTekst: 'Særnorske bokstaver i e-postadresse støttes ikke',
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
            const ikkeTommeMailadresser = this.state.mailadresser
                .map((mailadresseFelt) => mailadresseFelt.value)
                .filter((mailadresse) => mailadresse.trim());

            this.props.onSubmit(this.state.beskjed, ikkeTommeMailadresser);
        }
    };

    render() {
        const {
            vis = true,
            deleStatus,
            antallMarkerteKandidater,
            antallKandidaterSomHarSvartJa,
            alleKandidaterMåGodkjenneForespørselOmDelingAvCvForÅPresentere,
        } = this.props;

        const antallSomSkalDeles = alleKandidaterMåGodkjenneForespørselOmDelingAvCvForÅPresentere
            ? antallKandidaterSomHarSvartJa
            : antallMarkerteKandidater;

        const antallKandidaterSomIkkeKanDeles =
            antallMarkerteKandidater - antallKandidaterSomHarSvartJa;

        return (
            <ModalMedKandidatScope
                open={vis}
                onClose={this.props.onClose}
                aria-label="Del kandidater med arbeidsgiver"
                className="PresenterKandidaterModal"
            >
                <div className="wrapper">
                    {antallSomSkalDeles === 1 ? (
                        <Systemtittel>Del 1 kandidat med arbeidsgiver</Systemtittel>
                    ) : (
                        <Systemtittel>{`Del ${antallSomSkalDeles} kandidater med arbeidsgiver`}</Systemtittel>
                    )}
                    {alleKandidaterMåGodkjenneForespørselOmDelingAvCvForÅPresentere &&
                        antallKandidaterSomIkkeKanDeles > 0 && (
                            <AlertStripeAdvarsel>
                                <Normaltekst className="blokk-xs">
                                    {antallKandidaterSomIkkeKanDeles} av kandidatene har ikke svart
                                    eller svart nei på om CV-en kan deles. Du kan derfor ikke dele
                                    disse.
                                </Normaltekst>
                                <Normaltekst>
                                    Har du hatt dialog med kandidaten, og fått bekreftet at NAV kan
                                    dele CV-en? Da må du registrere dette i aktivitetsplanen. Har du
                                    ikke delt stillingen med kandidaten må du gjøre det først.{' '}
                                    <Link href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-markedsarbeid/SitePages/Del-stillinger-med-kandidater-i-Aktivitetsplanen.aspx#har-du-ringt-kandidaten-istedenfor-%C3%A5-dele-i-aktivitetsplanen">
                                        Se rutiner
                                    </Link>
                                    .
                                </Normaltekst>
                            </AlertStripeAdvarsel>
                        )}
                    {!alleKandidaterMåGodkjenneForespørselOmDelingAvCvForÅPresentere && (
                        <AlertStripeAdvarsel>
                            <Normaltekst>
                                Husk at du må kontakte kandidatene og undersøke om stillingen er
                                aktuell før du deler med arbeidsgiver.
                            </Normaltekst>
                        </AlertStripeAdvarsel>
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
                        <Hovedknapp
                            disabled={deleStatus === Nettstatus.LasterInn}
                            spinner={deleStatus === Nettstatus.LasterInn}
                            onClick={this.validerOgLagre}
                        >
                            Del
                        </Hovedknapp>
                        <Flatknapp className="avbryt--knapp" onClick={this.props.onClose}>
                            Avbryt
                        </Flatknapp>
                    </div>
                    {deleStatus === Nettstatus.Feil && (
                        <Feilmelding>Kunne ikke dele med arbeidsgiver akkurat nå</Feilmelding>
                    )}
                </div>
            </ModalMedKandidatScope>
        );
    }
}

export default PresenterKandidaterModal;
