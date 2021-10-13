import React, { FunctionComponent, ReactNode, useState } from 'react';
import { Nettressurs, Nettstatus } from '../../../../../api/Nettressurs';
import {
    ForespørslerForKandidatForStilling,
    kanResendeForespørsel,
    TilstandPåForespørsel,
} from '../../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse, { Hendelsesstatus } from '../Hendelse';
import DelPåNyttKnapp from './DelPåNyttKnapp';
import ForespørselErSendt from './ForespørselErSendt';
import IngenSvarFraKandidat from './IngenSvarFraKandidat';
import SendForespørselPåNytt from './SendForespørselPåNytt';
import SvarFraKandidat from './SvarFraKandidat';

type Props = {
    kanEndre: boolean;
    forespørsler: Nettressurs<ForespørslerForKandidatForStilling>;
};

const ForespørslerOgSvar: FunctionComponent<Props> = ({ kanEndre, forespørsler }) => {
    const [visStegForÅDelePåNytt, setVisStegForÅDelePåNytt] = useState(false);

    const onDelPåNyttClick = () => {
        setVisStegForÅDelePåNytt(true);
    };

    const onDelPåNyttLukk = () => {
        setVisStegForÅDelePåNytt(false);
    };

    if (forespørsler.kind === Nettstatus.FinnesIkke) {
        return (
            <Hendelse
                status={Hendelsesstatus.Hvit}
                tittel="Stillingen er delt med kandidaten"
                beskrivelse="Deles fra kandidatlisten"
            />
        );
    }

    if (forespørsler.kind === Nettstatus.Suksess) {
        const { gjeldendeForespørsel, gamleForespørsler } = forespørsler.data;

        const hendelser: ReactNode[] = [];

        hendelser.push(
            <ForespørselErSendt
                erFørsteForespørsel
                forespørselOmDelingAvCv={gjeldendeForespørsel}
            />
        );

        console.log('EEH:', forespørsler.data);

        gamleForespørsler.forEach((gammelForespørsel) => {
            hendelser.push(
                <>
                    <div>svar på gammel forespørsel</div>
                    <div>forespørsel er sendt på nytt</div>
                </>
            );
        });

        if (gjeldendeForespørsel.tilstand === TilstandPåForespørsel.HarSvart) {
            hendelser.push(
                <SvarFraKandidat kanEndre={kanEndre} svar={gjeldendeForespørsel.svar}>
                    {kanEndre && kanResendeForespørsel(gjeldendeForespørsel) && (
                        <DelPåNyttKnapp onDelPåNyttClick={onDelPåNyttClick} />
                    )}
                </SvarFraKandidat>
            );
        } else {
            hendelser.push(
                <IngenSvarFraKandidat
                    tilstand={gjeldendeForespørsel.tilstand}
                    svarfrist={gjeldendeForespørsel.svarfrist}
                >
                    {kanEndre && kanResendeForespørsel(gjeldendeForespørsel) && (
                        <DelPåNyttKnapp onDelPåNyttClick={onDelPåNyttClick} />
                    )}
                </IngenSvarFraKandidat>
            );
        }

        if (visStegForÅDelePåNytt) {
            hendelser.push(
                <SendForespørselPåNytt
                    gjeldendeForespørsel={gjeldendeForespørsel}
                    onLukk={onDelPåNyttLukk}
                />
            );
        }

        return <>{hendelser}</>;
    }

    return null;
};

export default ForespørslerOgSvar;
