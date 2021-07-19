import React, { FunctionComponent } from 'react';
import { Kandidat } from '../../../domene/Kandidat';
import { Undertittel } from 'nav-frontend-typografi';
import Hendelse from '../endre-status-og-hendelser/Hendelse';
import DelingAvCvForKandidat from '../endre-status-og-hendelser/DelingAvCvForKandidat';
import { datoformatNorskLang } from '../../../../utils/dateUtils';
import FåttJobbenForKandidat from '../endre-status-og-hendelser/FåttJobbenForKandidat';

type Props = {
    kandidat: Kandidat;
    kandidatlisteId: string;
};

const SeHendelser: FunctionComponent<Props> = ({ kandidat, kandidatlisteId }) => {
    const cvDeltBeskrivelse = `Lagt til i listen av ${kandidat.lagtTilAv.navn} (${
        kandidat.lagtTilAv.ident
    }) ${datoformatNorskLang(kandidat.lagtTilTidspunkt)}`;

    return (
        <>
            <Undertittel>Hendelser</Undertittel>
            <ol className="endre-status-og-hendelser__hendelsesliste">
                <Hendelse checked tittel="Ny kandidat" beskrivelse={cvDeltBeskrivelse} />
                <DelingAvCvForKandidat
                    kandidat={kandidat}
                    kandidatlisteId={kandidatlisteId}
                    kanEndre={false}
                />
                <FåttJobbenForKandidat
                    kandidat={kandidat}
                    kandidatlisteId={kandidatlisteId}
                    kanEndre={false}
                />
            </ol>
        </>
    );
};

export default SeHendelser;
