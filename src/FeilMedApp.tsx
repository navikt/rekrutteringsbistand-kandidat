import React, { FunctionComponent } from 'react';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';

const FeilMedApp: FunctionComponent<{
    error: Error;
    eventId: string | null;
}> = ({ error, eventId }) => (
    <Alert variant="error">
        <Heading level="2" size="medium">
            Det har skjedd en feil
        </Heading>
        <BodyShort>ID: {eventId}</BodyShort>
        <br />
        <BodyShort>Feilmelding: {error.message}</BodyShort>
    </Alert>
);

export default FeilMedApp;
