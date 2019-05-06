import * as React from 'react';
import { useState } from 'react';
import { Knapp } from 'pam-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Media from 'react-media';
import KandidatsokNextFeedbackModal from './KandidatsokNextFeedbackModal';
import AboutKandidatmatchModal from './AboutKandidatmatchModal';
import Lenkeknapp from '../../../felles/common/Lenkeknapp';
import { MatchIcon } from '../../result/matchforklaring/Matchdetaljer';
import './KandidatsokNextHeader.less';

const KandidatsokNextHeader = () => {
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    return (
        <div className="KandidatsokNextHeader">
            <KandidatsokNextFeedbackModal open={feedbackModalOpen} onRequestClose={() => setFeedbackModalOpen(false)} />
            <AboutKandidatmatchModal open={aboutModalOpen} onRequestClose={() => setAboutModalOpen(false)} />
            <div className="KandidatsokNextHeader-left">
                <Media query={{'min-width': 768}}>
                    <div className="match-icon header-icon-wrapper"><MatchIcon /></div>
                </Media>
                <div>
                    <h2>Kandidatmatch</h2>
                    <Normaltekst>
                        Du bruker nå ny og spennende teknologi til å finne kandidater.
                    </Normaltekst>
                    <Lenkeknapp
                        onClick={() => setAboutModalOpen(true)}
                        className="les-mer-knapp"
                    >
                        Les mer om kandidatmatch
                    </Lenkeknapp>
                </div>
            </div>
            <div className="KandidatsokNextHeader-right">
                <Knapp mini onClick={() => setFeedbackModalOpen(true)}>
                    Avslutt kandidatmatch
                </Knapp>
            </div>
        </div>
    );
};

export default KandidatsokNextHeader;
