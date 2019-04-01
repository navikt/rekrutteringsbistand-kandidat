import React from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';

function refreshPage() {
    window.location.reload();
}

const Feilmelding = () => (
    <AlertStripeFeil type="advarsel" className="blokk-xs">
        <div className="blokk-xs">
            <strong>Det oppstod en feil.</strong> Forsøk å laste siden på nytt.
        </div>
        <Hovedknapp mini onClick={refreshPage}>Last siden på nytt</Hovedknapp>
    </AlertStripeFeil>
);

export default Feilmelding;
