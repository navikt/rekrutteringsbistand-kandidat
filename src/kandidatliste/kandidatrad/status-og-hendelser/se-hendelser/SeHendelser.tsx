import React, { FunctionComponent } from 'react';
import { KandidatIKandidatliste } from '../../../kandidatlistetyper';
import { Undertittel } from 'nav-frontend-typografi';
import Hendelse from '../endre-status-og-hendelser/Hendelse';
import DelingAvCvForKandidat from '../endre-status-og-hendelser/DelingAvCvForKandidat';
import FåttJobben from '../endre-status-og-hendelser/FåttJobben';
import { datoformatNorskLang } from '../../../../utils/dateUtils';

type Props = {
    kandidat: KandidatIKandidatliste;
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
                    utfall={kandidat.utfall}
                    kandidatnummer={kandidat.kandidatnr}
                    kandidatlisteId={kandidatlisteId}
                />
                <FåttJobben
                    navn={`${kandidat.fornavn} ${kandidat.etternavn}`}
                    utfall={kandidat.utfall}
                    kandidatnummer={kandidat.kandidatnr}
                    kandidatlisteId={kandidatlisteId}
                />
            </ol>
        </>
    );
};

export default SeHendelser;
