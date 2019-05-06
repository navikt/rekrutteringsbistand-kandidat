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
        <Normaltekst>Kandidatmatch bruker synonymer og nært eller fjernt slektskap mellom kompetanser for å matche dine
            søkekriterier mot kandidater. Slik finner vi også kandidater som har beskrevet samme kompetanse på en litt
            annen måte. Du kan altså finne kandidater du tidligere gikk glipp av. <br/><br/>
            Du kan fortsatt oppleve noen mangelfulle søkeresultat, og vi jobber kontinuerlig med å forbedre teknologien.
            <br/><br/>
            Når du avslutter kandidatmatch kan du fortelle oss hva du mener. Vi setter stor pris på din tilbakemelding.
        </Normaltekst>
        <Hovedknapp
            onClick={onRequestClose}
        >
            Lukk
        </Hovedknapp>
    </NavFrontendModal>
);

export default AboutKandidatmatchModal;
