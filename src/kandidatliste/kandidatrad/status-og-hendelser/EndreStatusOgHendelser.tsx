import React, { FunctionComponent } from 'react';
import { Kandidatstatus } from '../../kandidatlistetyper';
import { Utfall } from '../utfall-med-endre-ikon/UtfallMedEndreIkon';

type Props = {
    status: Kandidatstatus;
    utfall: Utfall;
};

const EndreStatusOgHendelser: FunctionComponent<Props> = (props) => {
    return <div>Endre status og hendelser</div>;
};

export default EndreStatusOgHendelser;
