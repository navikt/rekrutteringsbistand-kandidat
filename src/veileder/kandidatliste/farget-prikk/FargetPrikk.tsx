import React, { FunctionComponent } from 'react';
import { Kandidatstatus } from '../kandidatlistetyper';
import { Utfall } from '../kandidatrad/utfall-med-endre-ikon/UtfallMedEndreIkon';
import './FargetPrikk.less';

interface Props {
    type: Utfall | Kandidatstatus;
}

const FargetPrikk: FunctionComponent<Props> = ({ type }) => (
    <span className={`FargetPrikk FargetPrikk--${type.toLowerCase()}`} />
);

export default FargetPrikk;
