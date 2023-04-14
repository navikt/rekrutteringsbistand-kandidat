import React from 'react';
import { Alert, BodyLong, Button } from '@navikt/ds-react';
import css from './Feilmelding.module.css';

function refreshPage() {
    window.location.reload();
}

const Feilmelding = () => (
    <Alert variant="warning">
        <div className={css.alertBody}>
            <BodyLong>Det oppstod en feil. Forsøk å laste siden på nytt.</BodyLong>
            <Button onClick={refreshPage}>Last siden på nytt</Button>
        </div>
    </Alert>
);

export default Feilmelding;
