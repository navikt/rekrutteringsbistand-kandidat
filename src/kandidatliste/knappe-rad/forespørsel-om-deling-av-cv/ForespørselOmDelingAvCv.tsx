import React, { ChangeEvent, FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import AlertStripe, { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

import { ForespørselOutboundDto } from './Forespørsel';
import { Kandidat } from '../../domene/Kandidat';
import { Nettstatus } from '../../../api/Nettressurs';
import AppState from '../../../AppState';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../../common/modal/ModalMedKandidatScope';
import useIkkeForespurteKandidater from './useIkkeForespurteKandidater';
import { VarslingAction, VarslingActionType } from '../../../common/varsling/varslingReducer';
import VelgSvarfrist, { lagSvarfristPåSekundet, Svarfrist } from './VelgSvarfrist';
import { BeaconSignalsIcon } from '@navikt/aksel-icons';
import { BeaconSignalsFillIcon } from '@navikt/aksel-icons';
import './ForespørselOmDelingAvCv.less';
import knapperadCss from '../KnappeRad.module.css';
import classNames from 'classnames';
import LenkeknappNy from '../../../common/lenkeknapp/LenkeknappNy';

type Props = {
    stillingsId: string;
    markerteKandidater: Kandidat[];
};

const ForespørselOmDelingAvCv: FunctionComponent<Props> = ({ stillingsId, markerteKandidater }) => {
    const dispatch = useDispatch();

    const { valgtNavKontor } = useSelector((state: AppState) => state.navKontor);
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
        setEgenvalgtFrist(dato);
    };

    const onEgenvalgtFristFeilmeldingChange = (feilmelding?: string) => {
        setEgenvalgtFristFeilmelding(feilmelding);
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
            if (valgtNavKontor === null) {
                setKanIkkeDelePopover(event.currentTarget);
                setKanIkkeDeleFeilmelding(
                    'Du må representere et NAV-kontor før du kan dele stillingen med kandidaten.'
                );
            } else if (markerteKandidater.length === 0) {
                setKanIkkeDelePopover(event.currentTarget);
                setKanIkkeDeleFeilmelding(
                    'Du må huke av for kandidatene du ønsker å dele stillingen med.'
                );
            } else if (markerteKandidaterSomIkkeErForespurt.length === 0) {
                setKanIkkeDelePopover(event.currentTarget);
                setKanIkkeDeleFeilmelding(
                    'Du har allerede delt stillingen med alle de markerte kandidatene. Hvis en kandidat har svart "nei" eller svarfristen er utløpt, kan du dele stillingen på nytt via "blyanten" til kandidaten.'
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
            navKontor: valgtNavKontor!,
        };

        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.SendForespørselOmDelingAvCv,
            forespørselOutboundDto: outboundDto,
        });
    };

    const forespørselIcon = (
        <>
            <BeaconSignalsIcon
                className={classNames(
                    knapperadCss.knapperadIkonIkkeFylt,
                    knapperadCss.knapperadIkon
                )}
                fontSize="1.5rem"
            />
            <BeaconSignalsFillIcon
                className={classNames(knapperadCss.knapperadIkonFylt, knapperadCss.knapperadIkon)}
                fontSize="1.5rem"
            />
        </>
    );

    return (
        <div className="foresporsel-om-deling-av-cv">
            <LenkeknappNy
                tittel="Del stillingen med de markerte kandidatene"
                onClick={onDelMedKandidatClick}
                className={classNames(knapperadCss.knapp, knapperadCss.knapperadKnapp)}
                icon={forespørselIcon}
            >
                <span className={knapperadCss.knapptekst}>Del med kandidat</span>
            </LenkeknappNy>
            <ModalMedKandidatScope
                open={modalErÅpen}
                aria-label="Del stillingen med de markerte kandidatene"
                className="foresporsel-om-deling-av-cv__modal"
                onClose={lukkModal}
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
                <VelgSvarfrist
                    svarfrist={svarfrist}
                    onSvarfristChange={onSvarfristChange}
                    egenvalgtFrist={egenvalgtFrist}
                    egenvalgtFristFeilmelding={egenvalgtFristFeilmelding}
                    onEgenvalgtFristChange={onEgenvalgtFristChange}
                    onEgenvalgtFristFeilmeldingChange={onEgenvalgtFristFeilmeldingChange}
                />
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

export default ForespørselOmDelingAvCv;
