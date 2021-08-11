import React, { FunctionComponent } from 'react';
import { datoformatNorskLang } from '../../../../utils/dateUtils';
import { Kandidat } from '../../../domene/Kandidat';
import Hendelse from './Hendelse';

type Props = {
    kandidat: Kandidat;
};

const NyKandidat: FunctionComponent<Props> = ({ kandidat }) => {
    const beskrivelse = `Lagt til i listen av ${kandidat.lagtTilAv.navn} (${
        kandidat.lagtTilAv.ident
    }) ${datoformatNorskLang(kandidat.lagtTilTidspunkt)}`;

    return <Hendelse checked tittel="Ny kandidat" beskrivelse={beskrivelse} />;
};

export default NyKandidat;
