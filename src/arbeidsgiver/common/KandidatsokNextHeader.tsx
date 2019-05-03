import * as React from 'react';
import { useState } from 'react';
import { Knapp } from 'pam-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import './KandidatsokNextHeader.less';
import KandidatsokNextFeedbackModal from './KandidatsokNextFeedbackModal';
import { MatchIcon } from '../result/matchforklaring/Matchdetaljer';
import Media from 'react-media';

const KandidatsokNextHeader = () => {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <div className="KandidatsokNextHeader">
            <KandidatsokNextFeedbackModal open={modalOpen} onRequestClose={() => setModalOpen(false)} />
            <div className="KandidatsokNextHeader-left">
                <Media query={{"min-width": 767}}>
                    <div className="match-icon header-icon-wrapper"><MatchIcon /></div>
                </Media>
                <div>
                    <h2>Kandidatmatch</h2>
                    <Normaltekst>
                        Du tester nå vår eksperimentelle søkemotor for å finne kandidater.
                        Den har kunstig intelligens som matcher ditt søk mot kandidater.
                        Den er fortsatt til umoden, men for hvert søk hjelper du til med forbedre den.
                        Tusen takk for din hjelp!
                    </Normaltekst>
                </div>
            </div>
            <div className="KandidatsokNextHeader-right">
                <Knapp mini onClick={() => setModalOpen(true)}>
                    Avslutt kandidatmatch
                </Knapp>
            </div>
        </div>
    );
};

export default KandidatsokNextHeader;
