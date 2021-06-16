import React, { FunctionComponent } from 'react';
import { KandidatIKandidatliste } from '../../../kandidatlistetyper';
import { Undertittel } from 'nav-frontend-typografi';
import Hendelse from '../endre-status-og-hendelser/Hendelse';
import RegistrerEllerFjernDelingAvCv from '../endre-status-og-hendelser/RegistrerEllerFjernDelingAvCv';
import RegistrerEllerFjernFåttJobben from '../endre-status-og-hendelser/RegistrerEllerFjernFåttJobben';

type Props = {
    kandidat: KandidatIKandidatliste;
    kandidatlisteId;
};

const SeHendelser: FunctionComponent<Props> = ({ kandidat, kandidatlisteId }) => {
    const cvDeltBeskrivelse = `Lagt til i listen av ${kandidat.lagtTilAv.navn} (${
        kandidat.lagtTilAv.ident
    }) ${new Date(kandidat.lagtTilTidspunkt).toLocaleString('no-NB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })}`;

    return (
        <div className="endre-status-og-hendelser">
            <div className="endre-status-og-hendelser__hendelser">
                <Undertittel>Hendelser</Undertittel>
                <ol className="endre-status-og-hendelser__hendelsesliste">
                    <Hendelse checked tittel="Ny kandidat" beskrivelse={cvDeltBeskrivelse} />
                    <RegistrerEllerFjernDelingAvCv
                        utfall={kandidat.utfall}
                        kandidatnummer={kandidat.kandidatnr}
                        kandidatlisteId={kandidatlisteId}
                    />
                    <RegistrerEllerFjernFåttJobben
                        navn={`${kandidat.fornavn} ${kandidat.etternavn}`}
                        utfall={kandidat.utfall}
                        kandidatnummer={kandidat.kandidatnr}
                        kandidatlisteId={kandidatlisteId}
                    />
                </ol>
            </div>
        </div>
    );
};

export default SeHendelser;
