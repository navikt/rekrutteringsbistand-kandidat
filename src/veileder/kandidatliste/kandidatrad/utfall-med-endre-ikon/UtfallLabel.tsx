import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Utfall, utfallToDisplayName } from './UtfallMedEndreIkon';
import FargetPrikk from '../../farget-prikk/FargetPrikk';

interface Props {
    utfall: Utfall;
}

const UtfallLabel: FunctionComponent<Props> = ({ utfall }) => (
    <span className="UtfallMedEndreIkon__status">
        <FargetPrikk type={utfall} />
        <Normaltekst>{utfallToDisplayName(utfall)}</Normaltekst>
    </span>
);

export default UtfallLabel;
