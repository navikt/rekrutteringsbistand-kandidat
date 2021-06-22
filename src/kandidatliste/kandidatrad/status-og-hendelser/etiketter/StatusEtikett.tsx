import React, { FunctionComponent } from 'react';
import { Kandidatstatus } from '../../../kandidatlistetyper';
import Etikett from 'nav-frontend-etiketter';
import { statusToDisplayName } from '../../statusSelect/StatusSelect';
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

export default StatusEtikett;
