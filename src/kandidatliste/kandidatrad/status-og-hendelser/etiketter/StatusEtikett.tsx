import { FunctionComponent } from 'react';
import { Kandidatstatus } from '../../../domene/Kandidat';
import Etikett from './Etikett';
import css from './StatusEtikett.module.css';

type Props = {
    status: Kandidatstatus;
};

const StatusEtikett: FunctionComponent<Props> = ({ status }) => {
    const etikettClassName = css[status.toLowerCase()];

    return (
        <Etikett label="Status" className={etikettClassName}>
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
        case Kandidatstatus.TilIntervju:
            return 'Til intervju';
        case Kandidatstatus.Uaktuell:
            return 'Ikke aktuell';
        case Kandidatstatus.Uinteressert:
            return 'Ikke interessert';
    }
};

export default StatusEtikett;
