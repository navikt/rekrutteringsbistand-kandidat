import React, { FunctionComponent } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Systemtittel } from 'nav-frontend-typografi';

import { KandidatlisterRad } from '../KandidatlisterRad/KandidatlisterRad';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { Nettstatus } from '../../api/Nettressurs';

type Props = {
    fetching: Nettstatus;
    kandidatlister: KandidatlisteSammendrag[];
    endreKandidatliste: (kandidatliste: KandidatlisteSammendrag) => void;
    markerKandidatlisteSomMin: (kandidatliste: KandidatlisteSammendrag) => void;
    slettKandidatliste: (kandidatliste: KandidatlisteSammendrag) => void;
};

const TabellBody: FunctionComponent<Props> = ({
    fetching,
    kandidatlister,
    endreKandidatliste,
    markerKandidatlisteSomMin,
    slettKandidatliste,
}) => {
    if (fetching !== Nettstatus.Suksess) {
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
                    kandidatlisteSammendrag={kandidatliste}
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

export default TabellBody;
