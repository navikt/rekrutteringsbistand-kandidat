import { Table } from '@navikt/ds-react';
import React, { FunctionComponent } from 'react';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import Rad from './Rad';

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
        <Table.Body>
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
        </Table.Body>
    );
};

export default TabellBody;
