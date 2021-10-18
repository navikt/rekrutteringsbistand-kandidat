import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { TilstandPåForespørsel } from '../../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse, { Hendelsesstatus } from '../Hendelse';

type Props = {
    tilstand: TilstandPåForespørsel;
    svarfrist: string;
};

const IngenSvarFraKandidat: FunctionComponent<Props> = ({ svarfrist, tilstand, children }) => {
    // TODO: Fjern de tre ekstra timene når vi får riktig tidssone fra backend
    const dagerTilSvarfristDesimal = moment(svarfrist).add(3, 'hours').diff(moment(), 'days', true);
    const forespørselErUtløpt =
        dagerTilSvarfristDesimal < 0 || tilstand === TilstandPåForespørsel.Avbrutt;

    return (
        <Hendelse
            status={forespørselErUtløpt ? Hendelsesstatus.Blå : Hendelsesstatus.Hvit}
            tittel="Svar fra kandidat om deling av CV"
            beskrivelse={formaterSvarfrist(dagerTilSvarfristDesimal, tilstand)}
        >
            {children}
        </Hendelse>
    );
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

export default IngenSvarFraKandidat;
