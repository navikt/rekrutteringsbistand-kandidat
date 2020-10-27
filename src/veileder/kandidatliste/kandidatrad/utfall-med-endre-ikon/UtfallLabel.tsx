import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Utfall, utfallToDisplayName } from './UtfallMedEndreIkon';
import FargetPrikk from '../../farget-prikk/FargetPrikk';

interface Props {
    utfall: Utfall;
    prikkOrientering?: Orientering;
}

export enum Orientering {
    Foran,
    Bak,
}

const UtfallLabel: FunctionComponent<Props> = ({
    utfall,
    prikkOrientering = Orientering.Foran,
}) => (
    <span className="utfall-med-endre-ikon__status">
        {prikkOrientering === Orientering.Foran && <FargetPrikk type={utfall} />}
        <Normaltekst>{utfallToDisplayName(utfall)}</Normaltekst>
        {prikkOrientering === Orientering.Bak && <FargetPrikk type={utfall} />}
    </span>
);

export default UtfallLabel;
