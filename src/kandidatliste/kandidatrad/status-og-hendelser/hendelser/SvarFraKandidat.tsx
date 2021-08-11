import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { Nettressurs, Nettstatus } from '../../../../api/Nettressurs';
import { datoformatNorskLang } from '../../../../utils/dateUtils';
import {
    ForespørselOmDelingAvCv,
    SvarPåDelingAvCv,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import Hendelse from './Hendelse';

type Props = {
    forespørselOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv>;
};

const SvarFraKandidat: FunctionComponent<Props> = ({ forespørselOmDelingAvCv }) => {
    if (forespørselOmDelingAvCv.kind === Nettstatus.FinnesIkke) {
        return (
            <Hendelse
                checked={false}
                tittel="Svar fra kandidat om deling av CV"
                beskrivelse="Hentes automatisk fra aktivitetsplan"
            />
        );
    }

    if (forespørselOmDelingAvCv.kind === Nettstatus.Suksess) {
        if (forespørselOmDelingAvCv.data.svar === SvarPåDelingAvCv.IkkeSvart) {
            const svarfrist = forespørselOmDelingAvCv.data.svarfrist;
            const dagerTilSvarfristDesimal = moment(svarfrist).diff(moment(), 'days', true);
            const dagerTilSvarfrist = Math.floor(dagerTilSvarfristDesimal);

            if (dagerTilSvarfristDesimal < 0) {
                const beskrivelse =
                    dagerTilSvarfrist === -1
                        ? 'Svarfristen utløp i går'
                        : `Svarfristen utløp for ${dagerTilSvarfrist * -1} dager siden`;

                return (
                    <Hendelse
                        checked={false}
                        tittel="Svar fra kandidat om deling av CV"
                        beskrivelse={beskrivelse}
                    />
                );
            } else {
                const beskrivelse =
                    dagerTilSvarfrist === 0
                        ? 'Svarfristen utløper i dag'
                        : `Svarfristen utløper om ${dagerTilSvarfrist} dag${
                              dagerTilSvarfrist > 1 ? 'er' : ''
                          }`;

                return (
                    <Hendelse
                        checked={false}
                        tittel="Svar fra kandidat om deling av CV"
                        beskrivelse={beskrivelse}
                    />
                );
            }
        } else {
            const formatertTidspunkt = datoformatNorskLang(
                forespørselOmDelingAvCv.data.svarTidspunkt
            );

            return forespørselOmDelingAvCv.data.svar === SvarPåDelingAvCv.Ja ? (
                <Hendelse
                    checked={true}
                    tittel="Svar fra kandidat: Ja, del CV-en min"
                    beskrivelse={`${formatertTidspunkt} hentet fra aktivitetsplanen`}
                />
            ) : (
                <Hendelse
                    // negativ
                    checked={true}
                    tittel="Svar fra kandidat: Nei, ikke del CV-en min"
                    beskrivelse={`${formatertTidspunkt} hentet fra aktivitetsplanen`}
                />
            );
        }
    }

    return null;
};

export default SvarFraKandidat;
