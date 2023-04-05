import React, { ChangeEvent } from 'react';
import { inneholderSærnorskeBokstaver, erGyldigEpost } from './epostValidering';
import ModalMedKandidatScope from '../../../common/modal/ModalMedKandidatScope';
import { Nettstatus } from '../../../api/Nettressurs';
import {
    Alert,
    BodyLong,
    BodyShort,
    Button,
    Heading,
    Label,
    Link,
    Textarea,
    TextField,
} from '@navikt/ds-react';
import css from './PresenterKandidaterModal.module.css';
import classNames from 'classnames';

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
                className={css.presenterKandidaterModal}
            >
                <div className={css.wrapper}>
                    {antallSomSkalDeles === 1 ? (
                        <Heading level="2" size="medium">
                            Del 1 kandidat med arbeidsgiver
                        </Heading>
                    ) : (
                        <Heading
                            level="2"
                            size="medium"
                        >{`Del ${antallSomSkalDeles} kandidater med arbeidsgiver`}</Heading>
                    )}
                    {alleKandidaterMåGodkjenneForespørselOmDelingAvCvForÅPresentere &&
                        antallKandidaterSomIkkeKanDeles > 0 && (
                            <Alert variant="warning" size="small" className={css.maaGodkjenne}>
                                <BodyLong size="small" spacing>
                                    {antallKandidaterSomIkkeKanDeles} av kandidatene har ikke svart
                                    eller svart nei på om CV-en kan deles. Du kan derfor ikke dele
                                    disse.
                                </BodyLong>
                                <BodyLong size="small" spacing>
                                    Har du hatt dialog med kandidaten, og fått bekreftet at NAV kan
                                    dele CV-en? Da må du registrere dette i aktivitetsplanen. Har du
                                    ikke delt stillingen med kandidaten må du gjøre det først.{' '}
                                    <Link href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-markedsarbeid/SitePages/Del-stillinger-med-kandidater-i-Aktivitetsplanen.aspx#har-du-ringt-kandidaten-istedenfor-%C3%A5-dele-i-aktivitetsplanen">
                                        Se rutiner
                                    </Link>
                                    .
                                </BodyLong>
                            </Alert>
                        )}
                    {!alleKandidaterMåGodkjenneForespørselOmDelingAvCvForÅPresentere && (
                        <Alert variant="warning" size="small" className={css.maaGodkjenne}>
                            <BodyLong size="small" spacing>
                                Husk at du må kontakte kandidatene og undersøke om stillingen er
                                aktuell før du deler med arbeidsgiver.
                            </BodyLong>
                        </Alert>
                    )}
                    <BodyShort size="small" spacing>
                        * er obligatoriske felter du må fylle ut
                    </BodyShort>
                    <BodyLong size="small">
                        Arbeidsgiveren du deler listen med vil motta en e-post med navn på stilling
                        og lenke for å logge inn. Etter innlogging kan arbeidsgiveren se
                        kandidatlisten.
                    </BodyLong>
                    <div className={css.mailadresser}>
                        {this.state.mailadresser.map((mailadresseFelt) => (
                            <TextField
                                className={classNames(css.mailadresse, {
                                    [css.mailadresseshow]: mailadresseFelt.show,
                                })}
                                size="small"
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
                                error={
                                    mailadresseFelt.errorTekst
                                        ? mailadresseFelt.errorTekst
                                        : undefined
                                }
                            />
                        ))}
                        <Button
                            variant="tertiary-neutral"
                            onClick={this.leggTilMailadressefelt}
                            className={css.leggTilMailadressefelt}
                        >
                            + Legg til flere
                        </Button>
                    </div>
                    <div>
                        <Textarea
                            label="Melding til arbeidsgiver"
                            value={this.state.beskjed}
                            onChange={this.onBeskjedChange}
                        />
                    </div>
                    <div className={css.knapper}>
                        <Button
                            variant="primary"
                            disabled={deleStatus === Nettstatus.LasterInn}
                            loading={deleStatus === Nettstatus.LasterInn}
                            onClick={this.validerOgLagre}
                        >
                            Del
                        </Button>
                        <Button variant="secondary" onClick={this.props.onClose}>
                            Avbryt
                        </Button>
                    </div>
                    {deleStatus === Nettstatus.Feil && (
                        <Label size="small" className={css.feilmelding}>
                            Kunne ikke dele med arbeidsgiver akkurat nå
                        </Label>
                    )}
                </div>
            </ModalMedKandidatScope>
        );
    }
}

export default PresenterKandidaterModal;
