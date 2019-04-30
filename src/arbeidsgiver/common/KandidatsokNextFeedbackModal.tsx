import * as React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Hovedknapp, Flatknapp } from 'pam-frontend-knapper';

interface ParentProps {
    open : boolean,
    onRequestClose: () => void
}

function redirectTilKandidatsok() {
    window.location.href = '/kandidater';
}

const KandidatsokNextFeedbackModal = ({ open, onRequestClose } : ParentProps) => (
    <NavFrontendModal contentLabel="te" isOpen={open} onRequestClose={onRequestClose} className="KandidatsokNextFeedbackModal">
        <h2>Hva syns du om kandidatmatch?</h2>
        <p>
            For at kandidatmatch skal bli best mulig, trenger vi din tilbakemelding.
            Hvis du ønsker å hjelpe oss trykk på “Gi tilbakemelding”
            og vi sender deg til en ny fane med et kort tilbakemeldingsskjema du kan fylle ut.
        </p>
        { // TODO: Endre til riktig lenke til hotjar-skjema
        }
        <a href="https://hotjar.com" target="_blank">
            <Hovedknapp mini onClick={redirectTilKandidatsok}>Gi tilbakemelding</Hovedknapp>
        </a>
        <a href="/kandidater">
            <Flatknapp mini>Hopp over tilbakemelding</Flatknapp>
        </a>
    </NavFrontendModal>
);

export default KandidatsokNextFeedbackModal;
