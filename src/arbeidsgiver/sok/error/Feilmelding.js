import React from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'pam-frontend-knapper';

function refreshPage() {
    window.location.reload();
}

const Feilmelding = () => (
    <AlertStripeFeil className="blokk-xs alertstripe--solid Feilmelding__alertstripe">
        <div>
            <strong>Det oppstod en feil.</strong>
            {' Forsøk å laste siden på nytt.'}
        </div>
        <Hovedknapp mini onClick={refreshPage}>Last siden på nytt</Hovedknapp>
    </AlertStripeFeil>
);

export default Feilmelding;
