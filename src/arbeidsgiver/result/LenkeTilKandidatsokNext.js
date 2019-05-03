import React from 'react';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { MatchIcon } from '../result/matchforklaring/Matchdetaljer';
import './LenkeTilKandidatsokNext.less';

const LenkeTilKandidatsokNext = () => (
    <LenkepanelBase href="/kandidater-next" border={false} className="LenkeTilKandidatsokNext">
        <div className="match-icon header-icon-wrapper"><MatchIcon /></div>
        <div>
            <Undertittel className="LenkeTilKandidatsokNext-header">Kandidatmatch</Undertittel>
            <Normaltekst className="LenkeTilKandidatsokNext-body">Vil du prøve en ny måte å finne kandidater? Vi har utviklet et
            nytt søk med en helt ny teknologi.</Normaltekst>
        </div>
    </LenkepanelBase>
);

export default LenkeTilKandidatsokNext;
