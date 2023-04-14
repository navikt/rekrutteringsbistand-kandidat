import React, { ChangeEvent, FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import { Alert, BodyShort, Button, Heading, Label, Popover } from '@navikt/ds-react';
import { BeaconSignalsIcon } from '@navikt/aksel-icons';
import { useDispatch, useSelector } from 'react-redux';

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
import css from './ForespørselOmDelingAvCv.module.css';

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
    const [egenvalgtFrist, setEgenvalgtFrist] = useState<Date | undefined>();
    const [egenvalgtFristFeilmelding, setEgenvalgtFristFeilmelding] = useState<
        string | undefined
    >();

    const markerteKandidaterSomIkkeErForespurt = useIkkeForespurteKandidater(markerteKandidater);
    const antallSpurtFraFør =
        markerteKandidater.length - markerteKandidaterSomIkkeErForespurt.length;

    const [kanIkkeDeleFeilmelding, setKanIkkeDeleFeilmelding] = useState<string | undefined>();
    const [kanIkkeDelePopover, setKanIkkeDelePopover] = useState<Element | null>(null);

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
                alertType: 'success',
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

    const onEgenvalgtFristChange = (dato?: Date) => {
        setEgenvalgtFrist(dato);
    };

    const onEgenvalgtFristFeilmeldingChange = (feilmelding?: string) => {
        setEgenvalgtFristFeilmelding(feilmelding);
    };

    const lukkKanIkkeDelePopover = () => {
        setKanIkkeDelePopover(null);
    };

    const åpneModal = () => {
        setModalErÅpen(true);
    };

    const lukkModal = () => {
        setModalErÅpen(false);
    };

    const onDelMedKandidatClick = (event: MouseEvent<HTMLElement>) => {
        if (kanIkkeDelePopover) {
            setKanIkkeDelePopover(null);
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
        if ((egenvalgtFristFeilmelding || !egenvalgtFrist) && svarfrist === Svarfrist.Egenvalgt) {
            onEgenvalgtFristFeilmeldingChange('Mangler gyldig dato');
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

    return (
        <div>
            <Button
                variant="tertiary"
                onClick={onDelMedKandidatClick}
                icon={<BeaconSignalsIcon aria-label="Del stillingen med de markerte kandidatene" />}
            >
                Del med kandidat
            </Button>
            <ModalMedKandidatScope
                open={modalErÅpen}
                aria-label="Del stillingen med de markerte kandidatene2"
                className={css.foresporselOmDelingAvCvModal}
                onClose={lukkModal}
            >
                <Heading size="medium" level="2" spacing>
                    Del med {markerteKandidaterSomIkkeErForespurt.length}{' '}
                    {markerteKandidaterSomIkkeErForespurt.length === 1 ? 'kandidat' : 'kandidater'}{' '}
                    i aktivitetsplanen
                </Heading>
                {antallSpurtFraFør > 0 && (
                    <Alert variant="warning" size="small" className={css.tidigereDelt}>
                        Du har tidligere delt stillingen med {antallSpurtFraFør}{' '}
                        {antallSpurtFraFør === 1 ? 'kandidat. Denne kandidaten' : 'kandidater. De'}{' '}
                        vil ikke motta stillingen på nytt i aktivitetsplanen.
                    </Alert>
                )}
                <BodyShort size="small" spacing>
                    Det opprettes et stillingskort i Aktivitetsplanen. Kandidatene vil bli varslet
                    på SMS, og kan svare "ja" eller "nei" til at CV-en skal bli delt med
                    arbeidsgiver. Du vil se svaret i kandidatlisten.
                </BodyShort>
                <Alert variant="info" className={css.deltAdvarsel}>
                    <Label size="small">
                        Stillingsannonsen vil bli delt med kandidaten. Det er viktig at
                        annonseteksten er informativ og lett å forstå.
                    </Label>
                </Alert>
                <VelgSvarfrist
                    svarfrist={svarfrist}
                    onSvarfristChange={onSvarfristChange}
                    egenvalgtFrist={egenvalgtFrist}
                    egenvalgtFristFeilmelding={egenvalgtFristFeilmelding}
                    onEgenvalgtFristChange={onEgenvalgtFristChange}
                    onEgenvalgtFristFeilmeldingChange={onEgenvalgtFristFeilmeldingChange}
                />
                <div className={css.knapper}>
                    <Button
                        onClick={onDelStillingMedKandidater}
                        variant="primary"
                        loading={sendForespørselOmDelingAvCv.kind === Nettstatus.SenderInn}
                    >
                        Del stilling
                    </Button>
                    <Button variant="secondary" onClick={lukkModal}>
                        Avbryt
                    </Button>
                </div>
                {sendForespørselOmDelingAvCv.kind === Nettstatus.Feil && (
                    <Alert variant="error" size="small" className={css.deltFeilmelding}>
                        <span>
                            Kunne ikke dele stillingsannonsen med kandidatene. Prøv igjen senere.
                        </span>
                        <span>Feilmelding: {sendForespørselOmDelingAvCv.error.message}</span>
                    </Alert>
                )}
            </ModalMedKandidatScope>
            <Popover
                open
                anchorEl={kanIkkeDelePopover}
                onClose={lukkKanIkkeDelePopover}
                placement="bottom"
                className={css.ingenValgtPopover}
            >
                <Popover.Content>
                    {kanIkkeDeleFeilmelding && (
                        <BodyShort as="div" size="small">
                            {kanIkkeDeleFeilmelding}
                        </BodyShort>
                    )}
                </Popover.Content>
            </Popover>
        </div>
    );
};

export default ForespørselOmDelingAvCv;
