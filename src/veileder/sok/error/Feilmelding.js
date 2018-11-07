import React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';

function refreshPage() {
    window.location.href = '/kandidater';
}

const Feilmelding = () => (
    <AlertStripeAdvarsel type="advarsel" className="blokk-xs">
        <div className="blokk-xs">
            <strong>Det oppstod en feil.</strong> Forsøk å laste siden på nytt.
        </div>
        <Hovedknapp mini onClick={refreshPage}>Last siden på nytt</Hovedknapp>
    </AlertStripeAdvarsel>
);

export default Feilmelding;
