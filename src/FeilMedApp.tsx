import React, { FunctionComponent } from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

const FeilMedApp: FunctionComponent<{
    error: Error;
    eventId: string | null;
}> = ({ error, eventId }) => (
    <AlertStripeFeil>
        <Undertittel>Det har skjedd en feil</Undertittel>
        <Normaltekst>ID: {eventId}</Normaltekst>
        <br />
        <Normaltekst>Feilmelding: {error.message}</Normaltekst>
    </AlertStripeFeil>
);

export default FeilMedApp;
