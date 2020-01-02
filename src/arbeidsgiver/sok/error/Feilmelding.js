import React from 'react';
import PropTypes from 'prop-types';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'pam-frontend-knapper';

function refreshPage() {
    window.location.reload();
}

const Feilmelding = (props) => {
    const { overskrift, melding } = props;
    return (
        <div>
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
