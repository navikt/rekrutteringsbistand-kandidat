import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { Nettressurs, Nettstatus } from '../../../../api/Nettressurs';
import { datoformatNorskLang } from '../../../../utils/dateUtils';
import {
    ForespørselOmDelingAvCv,
    SvarPåDelingAvCv,
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
        if (forespørselOmDelingAvCv.data.svar === SvarPåDelingAvCv.IkkeSvart) {
            const svarfrist = forespørselOmDelingAvCv.data.svarfrist;
            const dagerTilSvarfristDesimal = moment(svarfrist).diff(moment(), 'days', true);

            return (
                <Hendelse
                    status={Hendelsesstatus.Hvit}
                    tittel="Svar fra kandidat om deling av CV"
                    beskrivelse={formaterSvarfrist(dagerTilSvarfristDesimal)}
                />
            );
        } else {
            const formatertTidspunkt = datoformatNorskLang(
                forespørselOmDelingAvCv.data.svarTidspunkt
            );

            return forespørselOmDelingAvCv.data.svar === SvarPåDelingAvCv.Ja ? (
                <Hendelse
                    status={Hendelsesstatus.Grønn}
                    tittel="Svar fra kandidat: Ja, del CV-en min"
                    beskrivelse={`${formatertTidspunkt} hentet fra aktivitetsplanen`}
                />
            ) : (
                <Hendelse
                    status={Hendelsesstatus.Oransje}
                    tittel="Svar fra kandidat: Nei, ikke del CV-en min"
                    beskrivelse={`${formatertTidspunkt} hentet fra aktivitetsplanen`}
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
