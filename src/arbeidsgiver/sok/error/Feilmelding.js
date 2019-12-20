import React from 'react';
import PropTypes from 'prop-types';
import { AlertStripeFeil, AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'pam-frontend-knapper';

function refreshPage() {
    window.location.reload();
}

const Feilmelding = (props) => {
    const { overskrift, melding } = props;
    return (
        <div>
            <AlertStripeAdvarsel className="blokk-xs alertstripe--solid Feilmelding__alertstripe">
                <div>
                    <strong>Nedetid for arbeidsgivertjenestene 1. januar</strong><br />
                    Onsdag 1. januar kl. 17:00 til 23:00 kan du ikke benytte arbeidsgivertjenestene
                    på arbeidsplassen.no. Det er på grunn av nedetid i Altinn relatert til
                    Kommune- og fylkessammenslåingen.
                </div>
            </AlertStripeAdvarsel>
            <AlertStripeFeil className="blokk-xs alertstripe--solid Feilmelding__alertstripe">
                <div>
                    <strong>{overskrift}</strong><br />
                    {melding}
                </div>
                <Hovedknapp mini onClick={refreshPage}>Last siden på nytt</Hovedknapp>
            </AlertStripeFeil>
        </div>
    );
};

Feilmelding.defaultProps = {
    overskrift: 'Det oppstod en feil.',
    melding: ' Forsøk å laste siden på nytt.'
};

Feilmelding.propTypes = {
    overskrift: PropTypes.string,
    melding: PropTypes.string
};

export default Feilmelding;
