import React, { FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import './UtfallEtikett.less';

type Props = {
    utfall: Utfall;
};

export enum Utfall {
    IkkePresentert = 'IKKE_PRESENTERT',
    Presentert = 'PRESENTERT',
    FåttJobben = 'FATT_JOBBEN',
}

const UtfallEtikett: FunctionComponent<Props> = ({ utfall }) => (
    <Etikett
        mini
        type="info"
        aria-label="Utfall"
        className={`utfall-etikett utfall-etikett--${utfall.toLowerCase()}`}
    >
        {tilVisning(utfall)}
    </Etikett>
);

const tilVisning = (utfall: Utfall) => {
    if (utfall === Utfall.Presentert) {
        return 'CV delt';
    } else {
        return 'Fått jobben';
    }
};

export default UtfallEtikett;
