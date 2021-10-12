import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { Nettressurs, Nettstatus } from '../../../../api/Nettressurs';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';
import {
    ForespørselOmDelingAvCv,
    IdentType,
    kanResendeForespørsel,
    TilstandPåForespørsel,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse, { Hendelsesstatus } from './Hendelse';
import { AddCircle } from '@navikt/ds-icons';
import { Flatknapp } from 'nav-frontend-knapper';

type Props = {
    kanEndre: boolean;
    forespørselOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv>;
    onDelPåNyttClick?: () => void;
};

const SvarFraKandidat: FunctionComponent<Props> = (props) => {
    const { forespørselOmDelingAvCv } = props;

    if (forespørselOmDelingAvCv.kind === Nettstatus.FinnesIkke) {
        return (
            <Hendelse
                status={Hendelsesstatus.Hvit}
                tittel="Svar fra kandidat om deling av CV"
                beskrivelse="Hentes automatisk fra aktivitetsplanen"
            />
        );
    }

    if (forespørselOmDelingAvCv.kind === Nettstatus.Suksess) {
        if (forespørselOmDelingAvCv.data.tilstand === TilstandPåForespørsel.HarSvart) {
            const formatertTidspunkt = formaterDatoNaturlig(
                forespørselOmDelingAvCv.data.svar.svarTidspunkt
            );

            const beskrivelse = `${formatertTidspunkt} fra aktivitetsplanen, registrert av ${
                forespørselOmDelingAvCv.data.svar.svartAv.identType === IdentType.NavIdent
                    ? forespørselOmDelingAvCv.data.svar.svartAv.ident
                    : 'bruker'
            }`;

            return forespørselOmDelingAvCv.data.svar.harSvartJa ? (
                <Hendelse
                    status={Hendelsesstatus.Grønn}
                    tittel="Svar fra kandidat: Ja, del CV-en min"
                    beskrivelse={beskrivelse}
                >
                    <DelPåNyttKnapp {...props} />
                </Hendelse>
            ) : (
                <Hendelse
                    status={Hendelsesstatus.Oransje}
                    tittel="Svar fra kandidat: Nei, ikke del CV-en min"
                    beskrivelse={beskrivelse}
                >
                    <DelPåNyttKnapp {...props} />
                </Hendelse>
            );
        } else {
            const { svarfrist, tilstand } = forespørselOmDelingAvCv.data;
            const dagerTilSvarfristDesimal = moment(svarfrist).diff(moment(), 'days', true);
            const forespørselErUtløpt =
                dagerTilSvarfristDesimal < 0 || tilstand === TilstandPåForespørsel.Avbrutt;

            return (
                <Hendelse
                    status={forespørselErUtløpt ? Hendelsesstatus.Blå : Hendelsesstatus.Hvit}
                    tittel="Svar fra kandidat om deling av CV"
                    beskrivelse={formaterSvarfrist(dagerTilSvarfristDesimal, tilstand)}
                >
                    <DelPåNyttKnapp {...props} />
                </Hendelse>
            );
        }
    }

    return null;
};

const DelPåNyttKnapp: FunctionComponent<Props> = ({
    kanEndre,
    forespørselOmDelingAvCv,
    onDelPåNyttClick,
}) => {
    const visKnapp =
        kanEndre &&
        forespørselOmDelingAvCv.kind === Nettstatus.Suksess &&
        kanResendeForespørsel(forespørselOmDelingAvCv.data);

    if (visKnapp) {
        return (
            <Flatknapp
                onClick={onDelPåNyttClick}
                className="endre-status-og-hendelser__del-på-nytt"
                kompakt
                mini
            >
                <AddCircle />
                Del på nytt
            </Flatknapp>
        );
    }

    return null;
};

const formaterSvarfrist = (dagerTilSvarfristDesimal: number, tilstand: TilstandPåForespørsel) => {
    const dagerTilSvarfrist = Math.floor(dagerTilSvarfristDesimal);

    if (dagerTilSvarfristDesimal < 0) {
        return dagerTilSvarfrist === -1
            ? 'Svarfristen utløp i går'
            : `Svarfristen utløp for ${dagerTilSvarfrist * -1} dager siden`;
    } else {
        if (tilstand === TilstandPåForespørsel.Avbrutt) {
            return 'Svarfristen er utløpt';
        }

        return dagerTilSvarfrist === 0
            ? 'Svarfristen utløper i dag'
            : `Svarfristen utløper om ${dagerTilSvarfrist} dag${dagerTilSvarfrist > 1 ? 'er' : ''}`;
    }
};

export default SvarFraKandidat;
