import * as React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Hovedknapp } from 'pam-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import './KandidatsokNextHeader.less';

interface ParentProps {
    open : boolean,
    onRequestClose: () => void
}

NavFrontendModal.setAppElement('#app');

const AboutKandidatmatchModal = ({ open, onRequestClose } : ParentProps) => (
   <NavFrontendModal
        isOpen={open}
        contentLabel="Om kandidatmatch"
        onRequestClose={onRequestClose}
        className="KandidatsokNextModal"
   >
        <Undertittel>Kandidatmatch</Undertittel>
        <Normaltekst>Kandidatmatch bruker synonymer og slektskap mellom kompetanser for å matche kandidatsøket ditt.
            Systemet sjekker også hvor nært slektskapet er mellom kompetanser. Slik kan du finne kandidater som har
            beskrevet kompetansen sin på en litt annen måte. Dette kan være kandidater som du tidligere gikk glipp av.
            Ved å legge inn flere kompetanser kan du finjustere matchen.
        </Normaltekst>
        <Normaltekst>
            Vi jobber med å utvikle tjenesten. Du kan derfor oppleve at noen søkeresultater er mangelfulle.
        </Normaltekst>
        <Normaltekst>
            Etter at du har avsluttet Kandidatmatch setter vi pris på tilbakemelding om hvordan du opplevde tjenesten.
        </Normaltekst>
        <Hovedknapp
            onClick={onRequestClose}
        >
            Lukk
        </Hovedknapp>
    </NavFrontendModal>
);

export default AboutKandidatmatchModal;
