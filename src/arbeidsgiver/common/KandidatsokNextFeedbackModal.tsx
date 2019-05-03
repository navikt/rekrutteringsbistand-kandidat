import * as React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Hovedknapp, Flatknapp } from 'pam-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

interface ParentProps {
    open : boolean,
    onRequestClose: () => void
}

function redirectTilKandidatsok() {
    setTimeout(() => {
        window.location.href = '/kandidater'
    }, 0)
}

const KandidatsokNextFeedbackModal = ({ open, onRequestClose } : ParentProps) => (
    <NavFrontendModal contentLabel="te" isOpen={open} onRequestClose={onRequestClose} className="KandidatsokNextFeedbackModal">
        <Undertittel>Hva synes du om kandidatmatch?</Undertittel>
        <Normaltekst>
            For at kandidatmatch skal bli best mulig, trenger vi din tilbakemelding.
            Hvis du ønsker å hjelpe oss trykk på “Gi tilbakemelding”
            og vi sender deg til en ny fane med et kort tilbakemeldingsskjema du kan fylle ut.
        </Normaltekst>
        <a href="https://surveys.hotjar.com/s?siteId=118350&surveyId=133020"
           target="_blank"
           rel="noopener noreferrer"
           className="link external-link"
           onClick={redirectTilKandidatsok}
        >
            Gi tilbakemelding
        </a>
        <a href="/kandidater" className="link">
            Hopp over tilbakemelding
        </a>
    </NavFrontendModal>
);

export default KandidatsokNextFeedbackModal;
