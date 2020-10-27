import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Utfall, utfallToDisplayName } from './UtfallMedEndreIkon';

interface Props {
    utfall: Utfall;
}

// TODO Kan fjernes siden vi har dratt ut FargetPrikk til egen komponent
const UtfallLabel: FunctionComponent<Props> = ({ utfall }) => (
    <span className="UtfallMedEndreIkon__status">
        <span
            className={`UtfallMedEndreIkon__sirkel UtfallMedEndreIkon__sirkel--${utfall.toLowerCase()}`}
        />
        <Normaltekst>{utfallToDisplayName(utfall)}</Normaltekst>
    </span>
);

export default UtfallLabel;
