import * as React from 'react';
import { useState } from 'react';
import { Hovedknapp } from 'pam-frontend-knapper';
import './KandidatsokNextHeader.less';
import KandidatsokNextFeedbackModal from './KandidatsokNextFeedbackModal';

const KandidatsokNextHeader = () => {
    const [ modalOpen, setModalOpen ] = useState(false);
    return (
        <div className="KandidatsokNextHeader">
            <KandidatsokNextFeedbackModal open={modalOpen} onRequestClose={() => setModalOpen(false)} />
            <div className="KandidatsokNextHeader-left">
                <h2>Kandidatmatch</h2>
                <p>
                    Du tester nå vår eksperimentelle søkemotor for å finne kandidater.
                    Den har kunstig intelligens som matcher ditt søk mot kandidater.
                    Den er fortsatt til umoden, men for hvert søk hjelper du til med forbedre den.
                    Tusen takk for din hjelp!
                </p>
            </div>
            <div className="KandidatsokNextHeader-right">
                <Hovedknapp mini onClick={() => setModalOpen(true)}>
                    Lukk kandidatmatch
                </Hovedknapp>
            </div>
        </div>
    );
};

export default KandidatsokNextHeader;
