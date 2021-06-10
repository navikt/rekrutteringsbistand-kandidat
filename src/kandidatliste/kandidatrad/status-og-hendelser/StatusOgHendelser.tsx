import React, { FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { statusToDisplayName } from '../statusSelect/StatusSelect';
import './StatusOgHendelser.less';
import { Utfall } from '../utfall-med-endre-ikon/UtfallMedEndreIkon';

type Props = {
    kandidat: KandidatIKandidatliste;
};

const StatusOgHendelser: FunctionComponent<Props> = ({ kandidat }) => {
    const etikettClassName = `status-og-hendelser__status status-og-hendelser__status--${kandidat.status.toLowerCase()}`;

    return (
        <div className="status-og-hendelser">
            <Etikett mini type="info" className={etikettClassName}>
                {statusToDisplayName(kandidat.status)}
            </Etikett>
            {kandidat.utfall === Utfall.Presentert && (
                <Etikett
                    mini
                    type="info"
                    className="status-og-hendelser__hendelse status-og-hendelser__hendelse--presentert"
                >
                    CV delt
                </Etikett>
            )}
            {kandidat.utfall === Utfall.FåttJobben && (
                <Etikett
                    mini
                    type="info"
                    className="status-og-hendelser__hendelse status-og-hendelser__hendelse--fatt-jobben"
                >
                    Fått jobben
                </Etikett>
            )}
        </div>
    );
};

export default StatusOgHendelser;
