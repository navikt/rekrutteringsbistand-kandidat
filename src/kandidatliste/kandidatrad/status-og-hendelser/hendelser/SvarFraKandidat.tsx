import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { Nettressurs, Nettstatus } from '../../../../api/Nettressurs';
import { datoformatNorskLang } from '../../../../utils/dateUtils';
import {
    ForespørselOmDelingAvCv,
    IdentType,
    TilstandPåForespørsel,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse, { Hendelsesstatus } from './Hendelse';

type Props = {
    forespørselOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv>;
};

const SvarFraKandidat: FunctionComponent<Props> = ({ forespørselOmDelingAvCv }) => {
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
            const formatertTidspunkt = datoformatNorskLang(
                forespørselOmDelingAvCv.data.svar.svarTidspunkt
            );

            const { identType } = forespørselOmDelingAvCv.data.svar.svartAv;
            const besvartAvTekst = `Svar fra ${
                identType === IdentType.NavIdent ? 'veileder på vegne av kandidat' : 'kandidat'
            }`;

            return forespørselOmDelingAvCv.data.svar.svar ? (
                <Hendelse
                    status={Hendelsesstatus.Grønn}
                    tittel={besvartAvTekst}
                    beskrivelse={`${formatertTidspunkt} hentet fra aktivitetsplanen`}
                />
            ) : (
                <Hendelse
                    status={Hendelsesstatus.Oransje}
                    tittel={besvartAvTekst}
                    beskrivelse={`${formatertTidspunkt} hentet fra aktivitetsplanen`}
                />
            );
        } else {
            const svarfrist = forespørselOmDelingAvCv.data.svarfrist;
            const dagerTilSvarfristDesimal = moment(svarfrist).diff(moment(), 'days', true);
            return (
                <Hendelse
                    status={
                        dagerTilSvarfristDesimal < 0 ? Hendelsesstatus.Blå : Hendelsesstatus.Hvit
                    }
                    tittel="Svar fra kandidat om deling av CV"
                    beskrivelse={formaterSvarfrist(dagerTilSvarfristDesimal)}
                />
            );
        }
    }

    return null;
};

const formaterSvarfrist = (dagerTilSvarfristDesimal: number) => {
    const dagerTilSvarfrist = Math.floor(dagerTilSvarfristDesimal);

    if (dagerTilSvarfristDesimal < 0) {
        return dagerTilSvarfrist === -1
            ? 'Svarfristen utløp i går'
            : `Svarfristen utløp for ${dagerTilSvarfrist * -1} dager siden`;
    } else {
        return dagerTilSvarfrist === 0
            ? 'Svarfristen utløper i dag'
            : `Svarfristen utløper om ${dagerTilSvarfrist} dag${dagerTilSvarfrist > 1 ? 'er' : ''}`;
    }
};

export default SvarFraKandidat;
