import React, { FunctionComponent } from 'react';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Kandidatstatus } from '../kandidatlistetyper';
import { statusToDisplayName } from '../kandidatrad/status-og-hendelser/etiketter/StatusEtikett';

const forklaringer: Record<Kandidatstatus, string> = {
    [Kandidatstatus.Vurderes]: 'Kandidater som er lagt i en kandidatliste får status vurderes',
    [Kandidatstatus.Kontaktet]: 'Kandidaten er kontaktet, og det ventes på svar',
    [Kandidatstatus.Aktuell]: 'Kandidaten er vurdert som aktuell for stillingen',
    [Kandidatstatus.Uaktuell]: 'Kandidaten er vurdert som ikke aktuell for stillingen',
    [Kandidatstatus.Uinteressert]: 'Kandidaten er ikke interessert i stillingen',
};

const StatusHjelpetekst: FunctionComponent = () => (
    <Hjelpetekst>
        <strong>Forklaring til status</strong>
        <ul className="statusliste">
            {Object.entries(forklaringer).map(([status, forklaring]: [Kandidatstatus, string]) => (
                <li key={status}>
                    {statusToDisplayName(status)} &ndash; {forklaring}
                </li>
            ))}
        </ul>
        Statusene er kun synlig internt og vil ikke bli delt med arbeidsgiver.
    </Hjelpetekst>
);

export default StatusHjelpetekst;
