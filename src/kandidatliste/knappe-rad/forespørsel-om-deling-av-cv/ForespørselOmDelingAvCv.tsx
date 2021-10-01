import React, { ChangeEvent, FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import { Datepicker } from 'nav-datovelger';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe, SkjemaGruppe } from 'nav-frontend-skjema';
import { useDispatch, useSelector } from 'react-redux';
import AlertStripe, { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import moment from 'moment';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

import { ForespørselOutboundDto } from './Forespørsel';
import { Kandidat } from '../../domene/Kandidat';
import { Nettstatus } from '../../../api/Nettressurs';
import AppState from '../../../AppState';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import Lenkeknapp from '../../../common/lenkeknapp/Lenkeknapp';
import ModalMedKandidatScope from '../../../common/ModalMedKandidatScope';
import useIkkeForespurteKandidater from './useIkkeForespurteKandidater';
import { VarslingAction, VarslingActionType } from '../../../common/varsling/varslingReducer';
import './ForespørselOmDelingAvCv.less';

enum Svarfrist {
    ToDager = 'TO_DAGER',
    TreDager = 'TRE_DAGER',
    SyvDager = 'SYV_DAGER',
    Egenvalgt = 'EGENVALGT',
}

const svarfristLabels: Record<Svarfrist, string> = {
    [Svarfrist.ToDager]: '2 dager',
    [Svarfrist.TreDager]: '3 dager',
    [Svarfrist.SyvDager]: '7 dager',
    [Svarfrist.Egenvalgt]: 'Velg dato',
};

type Props = {
    stillingsId: string;
    markerteKandidater: Kandidat[];
};

const ForespørselOmDelingAvCv: FunctionComponent<Props> = ({ stillingsId, markerteKandidater }) => {
    const dispatch = useDispatch();

    const { sendForespørselOmDelingAvCv } = useSelector((state: AppState) => state.kandidatliste);
    const [modalErÅpen, setModalErÅpen] = useState<boolean>(false);
    const [svarfrist, setSvarfrist] = useState<Svarfrist>(Svarfrist.ToDager);
    const [egenvalgtFrist, setEgenvalgtFrist] = useState<string | undefined>();
    const [egenvalgtFristFeilmelding, setEgenvalgtFristFeilmelding] = useState<
        string | undefined
    >();

    const markerteKandidaterSomIkkeErForespurt = useIkkeForespurteKandidater(markerteKandidater);
    const antallSpurtFraFør =
        markerteKandidater.length - markerteKandidaterSomIkkeErForespurt.length;

    const [kanIkkeDeleFeilmelding, setKanIkkeDeleFeilmelding] = useState<string | undefined>();
    const [kanIkkeDelePopover, setKanIkkeDelePopover] = useState<HTMLElement | undefined>(
        undefined
    );

    useEffect(() => {
        if (modalErÅpen) {
            const resetSendForespørsel = () => {
                dispatch<KandidatlisteAction>({
                    type: KandidatlisteActionType.ResetSendForespørselOmDelingAvCv,
                });
            };

            resetSendForespørsel();

            setSvarfrist(Svarfrist.ToDager);
            setEgenvalgtFrist(undefined);
            setEgenvalgtFristFeilmelding(undefined);
        }
    }, [modalErÅpen, dispatch]);

    useEffect(() => {
        const fjernMarkeringAvAlleKandidater = () => {
            dispatch<KandidatlisteAction>({
                type: KandidatlisteActionType.EndreMarkeringAvKandidater,
                kandidatnumre: [],
            });
        };

        const visVarsling = () => {
            dispatch<VarslingAction>({
                type: VarslingActionType.VisVarsling,
                innhold: 'Forespørselen ble sendt til kandidatene',
                alertType: 'suksess',
            });
        };

        if (sendForespørselOmDelingAvCv.kind === Nettstatus.Suksess) {
            lukkModal();
            visVarsling();
            fjernMarkeringAvAlleKandidater();
        }
    }, [sendForespørselOmDelingAvCv.kind, dispatch]);

    const onSvarfristChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSvarfrist(event.target.value as Svarfrist);
    };

    const onEgenvalgtFristChange = (dato?: string) => {
        if (!dato || dato === 'Invalid date') {
            setEgenvalgtFristFeilmelding('Feil datoformat, skriv inn dd.mm.åååå');
        } else if (moment(dato).isBefore(minDatoForEgenvalgtFrist)) {
            setEgenvalgtFristFeilmelding('Svarfristen må settes minst to dager frem i tid.');
        } else if (moment(dato).isAfter(maksDatoForEgenvalgtFrist)) {
            setEgenvalgtFristFeilmelding('Svarfristen må settes senest én måned frem i tid.');
        } else {
            setEgenvalgtFristFeilmelding(undefined);
        }

        setEgenvalgtFrist(dato);
    };

    const lukkKanIkkeDelePopover = () => {
        setKanIkkeDelePopover(undefined);
    };

    const åpneModal = () => {
        setModalErÅpen(true);
    };

    const lukkModal = () => {
        setModalErÅpen(false);
    };

    const onDelMedKandidatClick = (event: MouseEvent<HTMLElement>) => {
        if (kanIkkeDelePopover) {
            setKanIkkeDelePopover(undefined);
        } else {
            if (markerteKandidater.length === 0) {
                setKanIkkeDelePopover(event.currentTarget);
                setKanIkkeDeleFeilmelding(
                    'Du må huke av for kandidatene du ønsker å dele stillingen med.'
                );
            } else if (markerteKandidaterSomIkkeErForespurt.length === 0) {
                setKanIkkeDelePopover(event.currentTarget);
                setKanIkkeDeleFeilmelding(
                    'Du har allerede delt stillingen med alle de markerte kandidatene. Du kan ikke dele den på nytt.'
                );
            } else {
                åpneModal();
            }
        }
    };

    const onDelStillingMedKandidater = async () => {
        if (egenvalgtFristFeilmelding) {
            return;
        }

        const outboundDto: ForespørselOutboundDto = {
            aktorIder: markerteKandidaterSomIkkeErForespurt.map((kandidat) => kandidat.aktørid!),
            stillingsId,
            svarfrist: lagSvarfristPåSekundet(svarfrist, egenvalgtFrist),
        };

        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.SendForespørselOmDelingAvCv,
            forespørselOutboundDto: outboundDto,
        });
    };

    return (
        <div className="foresporsel-om-deling-av-cv">
            <Lenkeknapp
                tittel="Del stillingen med de markerte kandidatene"
                onClick={onDelMedKandidatClick}
                className="kandidatlisteknapper__knapp DelMedKandidat"
            >
                <i className="DelMedKandidat__icon" />
                Del med kandidat
            </Lenkeknapp>
            <ModalMedKandidatScope
                isOpen={modalErÅpen}
                contentLabel="Del stillingen med de markerte kandidatene"
                onRequestClose={lukkModal}
                className="foresporsel-om-deling-av-cv__modal"
            >
                <Systemtittel className="blokk-s">
                    Del med {markerteKandidaterSomIkkeErForespurt.length}{' '}
                    {markerteKandidaterSomIkkeErForespurt.length === 1 ? 'kandidat' : 'kandidater'}{' '}
                    i aktivitetsplanen
                </Systemtittel>
                {antallSpurtFraFør > 0 && (
                    <AlertStripeAdvarsel className="blokk-s">
                        Du har tidligere delt stillingen med {antallSpurtFraFør}{' '}
                        {antallSpurtFraFør === 1 ? 'kandidat. Denne kandidaten' : 'kandidater. De'}{' '}
                        vil ikke motta stillingen på nytt i aktivitetsplanen.
                    </AlertStripeAdvarsel>
                )}
                <Normaltekst className="blokk-s">
                    Det opprettes et stillingskort i Aktivitetsplanen. Kandidatene vil bli varslet
                    på SMS, og kan svare "ja" eller "nei" til at CV-en skal bli delt med
                    arbeidsgiver. Du vil se svaret i kandidatlisten.
                </Normaltekst>
                <AlertStripe type="info" form="inline" className="blokk-m">
                    <Element>
                        Stillingsannonsen vil bli delt med kandidaten. Det er viktig at
                        annonseteksten er informativ og lett å forstå.
                    </Element>
                </AlertStripe>
                <RadioGruppe
                    className="foresporsel-om-deling-av-cv__radiogruppe"
                    legend={
                        <>
                            <Element tag="span">Frist for svar</Element>
                            <Normaltekst tag="span"> (må fylles ut)</Normaltekst>
                        </>
                    }
                    description="Kandidatene kan ikke svare etter denne fristen"
                >
                    {Object.values(Svarfrist).map((value) => (
                        <Radio
                            key={value}
                            label={
                                <span id={`svarfrist-label_${value}`}>
                                    {`${svarfristLabels[value]} ${lagBeskrivelseAvSvarfrist(
                                        value
                                    )}`}
                                </span>
                            }
                            name="svarfrist"
                            value={value}
                            checked={svarfrist === value}
                            onChange={onSvarfristChange}
                        />
                    ))}
                </RadioGruppe>
                {svarfrist === Svarfrist.Egenvalgt && (
                    <SkjemaGruppe
                        className="foresporsel-om-deling-av-cv__velg-svarfrist"
                        legend={<Element>Velg frist for svar (Frist ut valgt dato)</Element>}
                        feil={egenvalgtFristFeilmelding}
                    >
                        <Datepicker
                            locale="nb"
                            inputProps={{
                                placeholder: 'dd.mm.åååå',
                                'aria-invalid': egenvalgtFristFeilmelding !== undefined,
                            }}
                            value={egenvalgtFrist}
                            limitations={{
                                minDate: minDatoForEgenvalgtFrist,
                                maxDate: maksDatoForEgenvalgtFrist,
                            }}
                            onChange={onEgenvalgtFristChange}
                            calendarSettings={{
                                showWeekNumbers: true,
                                position: 'fullscreen',
                            }}
                        />
                    </SkjemaGruppe>
                )}
                <div className="foresporsel-om-deling-av-cv__knapper">
                    <Hovedknapp
                        className="foresporsel-om-deling-av-cv__del-stilling-knapp"
                        mini
                        onClick={onDelStillingMedKandidater}
                        spinner={sendForespørselOmDelingAvCv.kind === Nettstatus.SenderInn}
                    >
                        Del stilling
                    </Hovedknapp>
                    <Knapp mini onClick={lukkModal}>
                        Avbryt
                    </Knapp>
                </div>
                {sendForespørselOmDelingAvCv.kind === Nettstatus.Feil && (
                    <AlertStripeFeil className="foresporsel-om-deling-av-cv__feilmelding">
                        <span>
                            Kunne ikke dele stillingsannonsen med kandidatene. Prøv igjen senere.
                        </span>
                        <span> Feilmelding: {sendForespørselOmDelingAvCv.error.message}</span>
                    </AlertStripeFeil>
                )}
            </ModalMedKandidatScope>
            <Popover
                ankerEl={kanIkkeDelePopover}
                onRequestClose={lukkKanIkkeDelePopover}
                orientering={PopoverOrientering.Under}
            >
                {kanIkkeDeleFeilmelding && (
                    <Normaltekst className="foresporsel-om-deling-av-cv__ingen-valgt-popover">
                        {kanIkkeDeleFeilmelding}
                    </Normaltekst>
                )}
            </Popover>
        </div>
    );
};

const lagBeskrivelseAvSvarfrist = (svarfrist: Svarfrist): string => {
    const idag = moment();

    if (svarfrist === Svarfrist.ToDager) {
        idag.add(2, 'days');
    } else if (svarfrist === Svarfrist.TreDager) {
        idag.add(3, 'days');
    } else if (svarfrist === Svarfrist.SyvDager) {
        idag.add(7, 'days');
    } else {
        return '';
    }

    const frist = idag.toDate().toLocaleString('nb-NO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return `(Frist ut ${frist})`;
};

const lagSvarfristPåSekundet = (svarfrist: Svarfrist, egenvalgtFrist?: string) => {
    switch (svarfrist) {
        case Svarfrist.ToDager:
            return moment().add(3, 'days').startOf('day').toDate();
        case Svarfrist.TreDager:
            return moment().add(4, 'days').startOf('day').toDate();
        case Svarfrist.SyvDager:
            return moment().add(8, 'days').startOf('day').toDate();
        case Svarfrist.Egenvalgt:
            return moment(egenvalgtFrist).startOf('day').add(1, 'day').toDate();
    }
};

const minDatoForEgenvalgtFrist = moment().add(2, 'days').format('YYYY-MM-DD');
const maksDatoForEgenvalgtFrist = moment().add(1, 'month').format('YYYY-MM-DD');

export default ForespørselOmDelingAvCv;
