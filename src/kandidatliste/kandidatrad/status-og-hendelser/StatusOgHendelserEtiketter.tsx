import React, { FunctionComponent } from 'react';
import { Kandidatstatus } from '../../kandidatlistetyper';
import { Utfall } from '../utfall-med-endre-ikon/UtfallMedEndreIkon';

type Props = {
    status: Kandidatstatus;
    utfall: Utfall;
};

const StatusOgHendelserEtiketter: FunctionComponent<Props> = () => {
    return <></>;
};

export default StatusOgHendelserEtiketter;
