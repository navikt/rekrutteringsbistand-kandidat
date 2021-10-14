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

    if (forespørsler.kind !== Nettstatus.Suksess) {
        return null;
    }

    const { gjeldendeForespørsel, gamleForespørsler } = forespørsler.data;
    const førsteForespørsel =
        gamleForespørsler.length > 0 ? gamleForespørsler[0] : gjeldendeForespørsel;

    const hendelser: ReactNode[] = [];

    hendelser.push(
        <ForespørselErSendt erFørsteForespørsel forespørselOmDelingAvCv={førsteForespørsel} />
    );

    gamleForespørsler.forEach((gammelForespørsel) => {
        if (gammelForespørsel.tilstand === TilstandPåForespørsel.HarSvart) {
            hendelser.push(<SvarFraKandidat kanEndre svar={gammelForespørsel.svar} />);
        } else {
            hendelser.push(
                <IngenSvarFraKandidat
                    tilstand={gammelForespørsel.tilstand}
                    svarfrist={gammelForespørsel.svarfrist}
                />
            );
        }

        hendelser.push(
            <ForespørselErSendt
                erFørsteForespørsel={false}
                forespørselOmDelingAvCv={gammelForespørsel}
            />
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
};

export default ForespørslerOgSvar;
