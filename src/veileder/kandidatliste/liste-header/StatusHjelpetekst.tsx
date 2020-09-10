import React, { FunctionComponent } from 'react';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Status, statusToDisplayName } from '../kandidatrad/statusSelect/StatusSelect';

const forklaringer: Record<Status, string> = {
    [Status.Vurderes]: 'Kandidater som er lagt i en kandidatliste får status vurderes',
    [Status.Kontaktet]: 'Kandidaten er kontaktet, og det ventes på svar',
    [Status.Aktuell]: 'Kandidaten er vurdert som aktuell for stillingen',
    [Status.Uaktuell]: 'Kandidaten er vurdert som ikke aktuell for stillingen',
    [Status.Uinteressert]: 'Kandidaten er ikke interessert i stillingen',
};

const StatusHjelpetekst: FunctionComponent = () => (
    <Hjelpetekst>
        <strong>Forklaring til status</strong>
        <ul className="statusliste">
            {Object.entries(forklaringer).map(([status, forklaring]) => (
                <li key={status}>
                    {statusToDisplayName(status as Status)} &ndash; {forklaring}
                </li>
            ))}
        </ul>
        Statusene er kun synlig internt og vil ikke bli delt med arbeidsgiver.
    </Hjelpetekst>
);

export default StatusHjelpetekst;
