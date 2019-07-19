import * as React from 'react';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { MatchIcon } from './matchforklaring/Matchdetaljer';
import './LenkeTilKandidatsokNext.less';

const LenkeTilKandidatsokNext = () => (
    <article className="LenkeTilKandidatsokNext">
        <span className="LenkeTilKandidatsokNext-ikon match-icon"><MatchIcon /></span>
        <div>
            <Systemtittel>Kandidatmatch</Systemtittel>
            <Normaltekst className="blokk-xs">Vil du prøve en ny måte å finne kandidater? Vi har utviklet
                et nytt søk med en helt ny teknologi.</Normaltekst>
            <a href="/kandidater-next" className="Knapp Knapp--hoved">Prøv kandidatmatch</a>
        </div>
    </article>
);

export default LenkeTilKandidatsokNext;
