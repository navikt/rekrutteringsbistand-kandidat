import React, { FunctionComponent } from 'react';
import { Kandidatstatus } from '../../../kandidatlistetyper';
import Etikett from 'nav-frontend-etiketter';
import './StatusEtikett.less';

type Props = {
    status: Kandidatstatus;
};

const StatusEtikett: FunctionComponent<Props> = ({ status }) => {
    const etikettClassName = `status-etikett status-etikett--${status.toLowerCase()}`;

    return (
        <Etikett mini type="info" className={etikettClassName}>
            {statusToDisplayName(status)}
        </Etikett>
    );
};

export const statusToDisplayName = (status: Kandidatstatus) => {
    switch (status) {
        case Kandidatstatus.Vurderes:
            return 'Vurderes';
        case Kandidatstatus.Kontaktet:
            return 'Kontaktet';
        case Kandidatstatus.Aktuell:
            return 'Aktuell';
        case Kandidatstatus.Uaktuell:
            return 'Ikke aktuell';
        case Kandidatstatus.Uinteressert:
            return 'Ikke interessert';
    }
};

export default StatusEtikett;
