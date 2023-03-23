import React, { FunctionComponent } from 'react';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import Rad from './rad/Rad';

type Props = {
    kandidatlister: KandidatlisteSammendrag[];
    endreKandidatliste: (kandidatliste: KandidatlisteSammendrag) => void;
    markerKandidatlisteSomMin: (kandidatliste: KandidatlisteSammendrag) => void;
    slettKandidatliste: (kandidatliste: KandidatlisteSammendrag) => void;
};

const TabellBody: FunctionComponent<Props> = ({
    kandidatlister,
    endreKandidatliste,
    markerKandidatlisteSomMin,
    slettKandidatliste,
}) => {
    return (
        <>
            {kandidatlister.map((kandidatliste) => (
                <Rad
                    key={kandidatliste.kandidatlisteId}
                    kandidatlisteSammendrag={kandidatliste}
                    endreKandidatliste={endreKandidatliste}
                    markerKandidatlisteSomMin={markerKandidatlisteSomMin}
                    slettKandidatliste={() => {
                        slettKandidatliste(kandidatliste);
                    }}
                />
            ))}
        </>
    );
};

export default TabellBody;
