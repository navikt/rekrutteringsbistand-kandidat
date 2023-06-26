import { FunctionComponent } from 'react';
import moment from 'moment';
import { TilstandPåForespørsel } from '../../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse, { Hendelsesstatus } from '../Hendelse';
import { formaterDatoUtenÅrstall } from '../../../../../utils/dateUtils';

type Props = {
    tilstand: TilstandPåForespørsel;
    svarfrist: string;
};

const IngenSvarFraKandidat: FunctionComponent<Props> = ({ svarfrist, tilstand, children }) => {
    const dagerTilSvarfristDesimal = moment(svarfrist).diff(moment(), 'days', true);
    const forespørselErUtløpt =
        dagerTilSvarfristDesimal < 0 || tilstand === TilstandPåForespørsel.Avbrutt;

    return (
        <Hendelse
            status={forespørselErUtløpt ? Hendelsesstatus.Blå : Hendelsesstatus.Hvit}
            tittel="Svar fra kandidat om deling av CV"
            beskrivelse={formaterSvarfrist(dagerTilSvarfristDesimal, svarfrist, tilstand)}
        >
            {children}
        </Hendelse>
    );
};

const formaterSvarfrist = (
    dagerTilSvarfristDesimal: number,
    svarfrist: string,
    tilstand: TilstandPåForespørsel
) => {
    const dagerTilSvarfrist = Math.floor(dagerTilSvarfristDesimal);

    if (dagerTilSvarfristDesimal < 0) {
        if (dagerTilSvarfrist === -1) {
            return 'Svarfristen utløp i går';
        } else {
            return dagerTilSvarfrist < -3
                ? `Svarfristen utløp ${formaterDatoUtenÅrstall(svarfrist)}`
                : `Svarfristen utløp for ${dagerTilSvarfrist * -1} dager siden`;
        }
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
