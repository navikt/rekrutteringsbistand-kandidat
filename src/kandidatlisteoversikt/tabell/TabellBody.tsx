import { Table } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import TabellRad from './TabellRad';

type Props = {
    kandidatlister: KandidatlisteSammendrag[];
    onRedigerClick: (kandidatliste: KandidatlisteSammendrag) => void;
    onMarkerSomMinClick: (kandidatliste: KandidatlisteSammendrag) => void;
    onSlettClick: (kandidatliste: KandidatlisteSammendrag) => void;
};

const TabellBody: FunctionComponent<Props> = ({
    kandidatlister,
    onRedigerClick,
    onMarkerSomMinClick,
    onSlettClick,
}) => {
    return (
        <Table.Body>
            {kandidatlister.map((kandidatliste) => (
                <TabellRad
                    key={kandidatliste.kandidatlisteId}
                    kandidatlisteSammendrag={kandidatliste}
                    onRedigerClick={() => onRedigerClick(kandidatliste)}
                    onMarkerSomMinClick={() => onMarkerSomMinClick(kandidatliste)}
                    onSlettClick={() => onSlettClick(kandidatliste)}
                />
            ))}
        </Table.Body>
    );
};

export default TabellBody;
