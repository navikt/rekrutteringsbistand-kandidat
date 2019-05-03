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
                        Du bruker nå et nytt søk for å finne kandidater. For å gi deg aktuelle kandidater matcher vi
                        synonymer med det du legger inn av relevante opplysninger. Desto flere kompetanser du legger inn jo
                        mer treffsikker blir søket. Det nye søket gir stort sett gode treff på yrker og kompetanser, mens
                        andre søkeresultater kan foreløpig oppleves som litt mangelfulle. Vi jobber med å forbedre
                        kandidatmatchen, og vil derfor gjerne ha din hjelp.
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
