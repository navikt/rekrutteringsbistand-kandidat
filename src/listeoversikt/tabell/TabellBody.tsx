import { Table } from '@navikt/ds-react';
import React, { FunctionComponent } from 'react';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import TabellRad from './TabellRad';

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
                <TabellRad
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
