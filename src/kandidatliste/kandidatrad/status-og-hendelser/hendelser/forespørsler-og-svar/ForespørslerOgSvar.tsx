import { FunctionComponent, ReactNode, useState } from 'react';
import { Nettressurs, Nettstatus } from '../../../../../api/Nettressurs';
import {
    ForespørslerForKandidatForStilling,
    kanResendeForespørsel,
    TilstandPåForespørsel,
} from '../../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import BleIkkeDelt from './BleIkkeDelt';
import DelPåNyttKnapp from './DelPåNyttKnapp';
import ForespørselErSendt from './ForespørselErSendt';
import IkkeDeltMedKandidat from './IkkeDeltMedKandidat';
import IngenSvarFraKandidat from './IngenSvarFraKandidat';
import SendForespørselPåNytt from './SendForespørselPåNytt';
import SvarFraKandidat from './SvarFraKandidat';

type Props = {
    forespørsler: Nettressurs<ForespørslerForKandidatForStilling>;
};

const ForespørslerOgSvar: FunctionComponent<Props> = ({ forespørsler }) => {
    const [visStegForÅDelePåNytt, setVisStegForÅDelePåNytt] = useState(false);

    const onDelPåNyttClick = () => {
        setVisStegForÅDelePåNytt(true);
    };

    const onDelPåNyttLukk = () => {
        setVisStegForÅDelePåNytt(false);
    };

    if (forespørsler.kind === Nettstatus.FinnesIkke) {
        return <IkkeDeltMedKandidat />;
    }

    if (forespørsler.kind !== Nettstatus.Suksess) {
        return null;
    }

    const { gjeldendeForespørsel, gamleForespørsler } = forespørsler.data;
    const alleForespørsler = [...gamleForespørsler, gjeldendeForespørsel];

    const hendelser: ReactNode[] = [];

    alleForespørsler.forEach((forespørsel, index) => {
        const erGjeldendeForespørsel = forespørsel === gjeldendeForespørsel;
        const visKnappForÅDelePåNytt =
            !visStegForÅDelePåNytt && erGjeldendeForespørsel && kanResendeForespørsel(forespørsel);

        if (forespørsel.tilstand === TilstandPåForespørsel.KanIkkeOpprette) {
            hendelser.push(
                <BleIkkeDelt
                    key={forespørsel.deltTidspunkt + '-ikke-sendt'}
                    forespørsel={forespørsel}
                >
                    {visKnappForÅDelePåNytt && (
                        <DelPåNyttKnapp onDelPåNyttClick={onDelPåNyttClick} />
                    )}
                </BleIkkeDelt>
            );

            return;
        }

        hendelser.push(
            <ForespørselErSendt
                key={forespørsel.deltTidspunkt + '-sendt'}
                erFørsteForespørsel={index === 0}
                forespørselOmDelingAvCv={forespørsel}
            />
        );

        if (forespørsel.tilstand === TilstandPåForespørsel.HarSvart) {
            hendelser.push(
                <SvarFraKandidat key={forespørsel.deltTidspunkt} svar={forespørsel.svar}>
                    {visKnappForÅDelePåNytt && (
                        <DelPåNyttKnapp onDelPåNyttClick={onDelPåNyttClick} />
                    )}
                </SvarFraKandidat>
            );
        } else {
            hendelser.push(
                <IngenSvarFraKandidat
                    key={forespørsel.deltTidspunkt + '-ingen-svar'}
                    tilstand={forespørsel.tilstand}
                    svarfrist={forespørsel.svarfrist}
                >
                    {visKnappForÅDelePåNytt && (
                        <DelPåNyttKnapp onDelPåNyttClick={onDelPåNyttClick} />
                    )}
                </IngenSvarFraKandidat>
            );
        }
    });

    if (visStegForÅDelePåNytt) {
        hendelser.push(
            <SendForespørselPåNytt
                key="del-på-nytt"
                gamleForespørsler={gamleForespørsler}
                gjeldendeForespørsel={gjeldendeForespørsel}
                onLukk={onDelPåNyttLukk}
            />
        );
    }

    return <>{hendelser}</>;
};

export default ForespørslerOgSvar;
