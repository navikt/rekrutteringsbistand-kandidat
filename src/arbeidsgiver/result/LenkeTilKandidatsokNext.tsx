import * as React from 'react';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import './LenkeTilKandidatsokNext.less';
import { MatchIcon } from './matchforklaring/Matchdetaljer';

const LenkeTilKandidatsokNext = () => (
    <LenkepanelBase href="/kandidater-next" border={false} className="LenkeTilKandidatsokNext">
        <div className="LenkeTilKandidatsokNext-wrapper">
            <div className="match-icon LenkeTilKandidatsokNext-ikon"><MatchIcon /></div>
            <div className="LenkeTilKandidatsokNext-tekst">
                <h2 className="LenkeTilKandidatsokNext-header">Kandidatmatch</h2>
                <p className="LenkeTilKandidatsokNext-body">Vil du prøve en ny måte å finne kandidater? Vi har utviklet et nytt søk med en helt ny teknologi.</p>
            </div>
        </div>
    </LenkepanelBase>
);

export default LenkeTilKandidatsokNext;
