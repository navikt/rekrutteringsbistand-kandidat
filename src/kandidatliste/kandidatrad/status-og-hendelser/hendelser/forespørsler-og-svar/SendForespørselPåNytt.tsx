import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { resendForespørselOmDelingAvCv } from '../../../../../api/forespørselOmDelingAvCvApi';
import {
    ForespørselOmDelingAvCv,
    ResendForespørselOutboundDto,
} from '../../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import VelgSvarfrist, {
    lagSvarfristPåSekundet,
    Svarfrist,
} from '../../../../knappe-rad/forespørsel-om-deling-av-cv/VelgSvarfrist';
import Hendelse, { Hendelsesstatus } from '../Hendelse';
import KandidatlisteActionType from '../../../../reducer/KandidatlisteActionType';
import { useDispatch, useSelector } from 'react-redux';
import { Feilmelding } from 'nav-frontend-typografi';
import { SearchApiError } from '../../../../../api/fetchUtils';
import { sendEvent } from '../../../../../amplitude/amplitude';
import AppState from '../../../../../AppState';
import { Button } from '@navikt/ds-react';
import css from './SendForespørselPåNytt.module.css';

type Props = {
    gamleForespørsler: ForespørselOmDelingAvCv[];
    gjeldendeForespørsel: ForespørselOmDelingAvCv;
    onLukk: () => void;
};

const SendForespørselPåNytt: FunctionComponent<Props> = ({
    gamleForespørsler,
    gjeldendeForespørsel,
    onLukk,
}) => {
    const dispatch = useDispatch();

    const { valgtNavKontor } = useSelector((state: AppState) => state.navKontor);
    const [svarfrist, setSvarfrist] = useState<Svarfrist>(Svarfrist.ToDager);
    const [egenvalgtFrist, setEgenvalgtFrist] = useState<Date | undefined>();
    const [egenvalgtFristFeilmelding, setEgenvalgtFristFeilmelding] = useState<
        string | undefined
    >();
    const [senderForespørselPåNytt, setSenderForespørselPåNytt] = useState(false);
    const [feilmelding, setFeilmelding] = useState<string | null>(null);

    const onDelPåNyttClick = async () => {
        if (egenvalgtFristFeilmelding) {
            return;
        }

        if (valgtNavKontor !== null) {
            const { stillingsId, aktørId } = gjeldendeForespørsel;
            const outboundDto: ResendForespørselOutboundDto = {
                stillingsId,
                svarfrist: lagSvarfristPåSekundet(svarfrist, egenvalgtFrist),
                navKontor: valgtNavKontor!,
            };

            setSenderForespørselPåNytt(true);

            try {
                const response = await resendForespørselOmDelingAvCv(aktørId, outboundDto);

                if (førsteGangKandidatenFårTilsendtForespørselPåNytt(gamleForespørsler)) {
                    sendEvent('forespørsel_deling_av_cv', 'resending', {
                        stillingsId: gjeldendeForespørsel.stillingsId,
                        antallKandidater: 1,
                        utfallOpprinneligForespørsel: gjeldendeForespørsel.tilstand,
                    });
                }

                dispatch({
                    type: KandidatlisteActionType.ResendForespørselOmDelingAvCvSuccess,
                    forespørslerOmDelingAvCv: response,
                });
                onLukk();
            } catch (e) {
                if (e instanceof SearchApiError) {
                    setFeilmelding(e.message);
                } else {
                    setFeilmelding(
                        'Klarte ikke å dele med kandidaten på nytt. Vennligst prøv igjen senere.'
                    );
                }
            } finally {
                setSenderForespørselPåNytt(false);
            }
        } else {
            setFeilmelding('Du må representere et NAV-kontor for å dele stillingen på nytt.');
        }
    };

    const onSvarfristChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSvarfrist(event.target.value as Svarfrist);
    };

    const onEgenvalgtFristChange = (dato?: Date) => {
        setEgenvalgtFrist(dato);
    };

    const onEgenvalgtFristFeilmeldingChange = (feilmelding?: string) => {
        setEgenvalgtFristFeilmelding(feilmelding);
    };

    return (
        <Hendelse
            renderChildrenBelowContent
            status={Hendelsesstatus.Hvit}
            tittel="Del stillingen med kandidaten på nytt"
            beskrivelse="Kandidaten kan tidligere ha mottatt stillingen. Du bør kontakte kandidaten før du deler på nytt."
        >
            <VelgSvarfrist
                tittel="Ny frist for svar"
                svarfrist={svarfrist}
                egenvalgtFrist={egenvalgtFrist}
                onSvarfristChange={onSvarfristChange}
                onEgenvalgtFristChange={onEgenvalgtFristChange}
                onEgenvalgtFristFeilmeldingChange={onEgenvalgtFristFeilmeldingChange}
                egenvalgtFristFeilmelding={egenvalgtFristFeilmelding}
            />
            <div className={css.delPåNyttKnapper}>
                <Button
                    variant="primary"
                    size="small"
                    onClick={onDelPåNyttClick}
                    loading={senderForespørselPåNytt}
                >
                    Del på nytt
                </Button>
                <Button onClick={onLukk} variant="secondary" size="small">
                    Avbryt
                </Button>
            </div>
            {feilmelding && (
                <Feilmelding className={css.delPåNyttFeilmelding}>
                    Feilmelding: {feilmelding}
                </Feilmelding>
            )}
        </Hendelse>
    );
};

const førsteGangKandidatenFårTilsendtForespørselPåNytt = (
    gamleForespørsler: ForespørselOmDelingAvCv[]
) => gamleForespørsler.length === 0;

export default SendForespørselPåNytt;
