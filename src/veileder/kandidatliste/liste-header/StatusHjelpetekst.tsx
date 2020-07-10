import React, { FunctionComponent } from 'react';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';

const Spørsmalstegn: FunctionComponent = () => (
    <span className="Sporsmalstegn">
        <span className="Sporsmalstegn__icon" />
    </span>
);

const StatusHjelpetekst: FunctionComponent = () => (
    <HjelpetekstMidt
        id="sd"
        anchor={Spørsmalstegn}
        className="bred-hjelpetekst statusforklaring-stor"
    >
        <strong>Forklaring til status</strong>
        <ul className="statusliste">
            <li>Vurderes &ndash; Kandidater som er lagt i en kandidatliste får status vurderes</li>
            <li>Kontaktet &ndash; Kandidaten er kontaktet, og det ventes på svar</li>
            <li>Aktuell &ndash; Kandidaten er vurdert som aktuell for stillingen</li>
            <li>Ikke aktuell &ndash; Kandidaten er vurdert som ikke aktuell for stillingen</li>
            <li>Ikke interessert &ndash; Kandidaten er ikke interessert i stillingen</li>
        </ul>
        Statusene er kun synlig internt og vil ikke bli delt med arbeidsgiver.
    </HjelpetekstMidt>
);

export default StatusHjelpetekst;
