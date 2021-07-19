import React, { FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import { Kandidatutfall } from '../../../domene/Kandidat';
import './UtfallEtikett.less';

type Props = {
    utfall: Kandidatutfall;
};

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

const tilVisning = (utfall: Kandidatutfall) => {
    if (utfall === Kandidatutfall.Presentert) {
        return 'CV delt';
    } else {
        return 'Fått jobben';
    }
};

export default UtfallEtikett;
