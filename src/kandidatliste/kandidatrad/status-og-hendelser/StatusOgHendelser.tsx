import React, { FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { statusToDisplayName } from '../statusSelect/StatusSelect';
import './StatusOgHendelser.less';

type Props = {
    kandidat: KandidatIKandidatliste;
};

const StatusOgHendelser: FunctionComponent<Props> = ({ kandidat }) => {
    let etikettClassName = 'status-og-hendelser__status';
    etikettClassName += ` status-og-hendelser__status--${kandidat.status.toLowerCase()}`;

    return (
        <div className="status-og-hendelser">
            <Etikett mini type="info" className={etikettClassName}>
                {statusToDisplayName(kandidat.status)}
            </Etikett>
        </div>
    );
};

export default StatusOgHendelser;
