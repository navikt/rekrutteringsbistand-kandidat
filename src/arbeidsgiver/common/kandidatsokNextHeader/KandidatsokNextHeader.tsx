import * as React from 'react';
import { useState } from 'react';
import { Knapp, Flatknapp } from 'pam-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Media from 'react-media';
import KandidatsokNextFeedbackModal from './KandidatsokNextFeedbackModal';
import AboutKandidatmatchModal from './AboutKandidatmatchModal';
import { MatchIcon } from '../../result/matchforklaring/Matchdetaljer';
import './KandidatsokNextHeader.less';

const ModalEnum = {
    ABOUT_OPEN: 'ABOUT_OPEN',
    FEEDBACK_OPEN: 'FEEDBACK_OPEN',
    CLOSED: 'CLOSED'
};

const KandidatsokNextHeader = () => {
    const [modalOpen, setModalOpen] = useState(ModalEnum.CLOSED);
    return (
        <div className="KandidatsokNextHeader">
            <KandidatsokNextFeedbackModal open={modalOpen === ModalEnum.FEEDBACK_OPEN} onRequestClose={() => setModalOpen(ModalEnum.CLOSED)} />
            <AboutKandidatmatchModal open={modalOpen === ModalEnum.ABOUT_OPEN} onRequestClose={() => setModalOpen(ModalEnum.CLOSED)} />
            <div className="KandidatsokNextHeader-left">
                <Media query={{'min-width': 768}}>
                    <div className="match-icon header-icon-wrapper"><MatchIcon /></div>
                </Media>
                <div>
                    <h1>Kandidatmatch</h1>
                    <Normaltekst>
                        Finn kandidater med ny og spennende teknologi.
                    </Normaltekst>
                    <Flatknapp
                        onClick={() => setModalOpen(ModalEnum.ABOUT_OPEN)}
                        className="les-mer-knapp Knapp--mini"
                    >
                        Les mer om kandidatmatch
                    </Flatknapp>
                </div>
            </div>
            <div className="KandidatsokNextHeader-right">
                <Knapp mini onClick={() => setModalOpen(ModalEnum.FEEDBACK_OPEN)}>
                    Avslutt kandidatmatch
                </Knapp>
            </div>
        </div>
    );
};

export default KandidatsokNextHeader;
