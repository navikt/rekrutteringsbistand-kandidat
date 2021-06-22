import React, { FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';
import './UtfallEtikett.less';

type Props = {
    utfall: Utfall;
};

const UtfallEtikett: FunctionComponent<Props> = ({ utfall }) => (
    <Etikett mini type="info" className={`utfall-etikett utfall-etikett--${utfall.toLowerCase()}`}>
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
