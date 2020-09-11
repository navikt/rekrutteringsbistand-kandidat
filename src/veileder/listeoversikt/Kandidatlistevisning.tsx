import React, { FunctionComponent } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Systemtittel } from 'nav-frontend-typografi';

import { KandidatlisterRad } from './KandidatlisterRad/KandidatlisterRad';
import { Kandidatliste } from '../kandidatliste/kandidatlistetyper';

type Props = {
    fetching: string;
    kandidatlister: Kandidatliste[];
    endreKandidatliste: (kandidatliste: Kandidatliste) => void;
    markerKandidatlisteSomMin: (kandidatliste: Kandidatliste) => void;
    slettKandidatliste: (kandidatliste: Kandidatliste) => void;
};

const Kandidatlistevisning: FunctionComponent<Props> = ({
    fetching,
    kandidatlister,
    endreKandidatliste,
    markerKandidatlisteSomMin,
    slettKandidatliste,
}) => {
    if (fetching !== 'SUCCESS') {
        return (
            <div className="hent-kandidatlister--spinner">
                <NavFrontendSpinner type="L" />
            </div>
        );
    } else if (kandidatlister.length === 0) {
        return (
            <div className="liste-rad__tom">
                <Systemtittel>Fant ingen kandidatlister som matcher søket ditt.</Systemtittel>
            </div>
        );
    }

    return (
        <>
            {kandidatlister.map((kandidatliste) => (
                <KandidatlisterRad
                    kandidatliste={kandidatliste}
                    endreKandidatliste={endreKandidatliste}
                    markerKandidatlisteSomMin={markerKandidatlisteSomMin}
                    slettKandidatliste={() => {
                        slettKandidatliste(kandidatliste);
                    }}
                    key={kandidatliste.kandidatlisteId}
                />
            ))}
        </>
    );
};

export default Kandidatlistevisning;
