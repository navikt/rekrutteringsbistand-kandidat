import React from 'react';
import './KandidatsokNextHeader.less';

const KandidatsokNextHeader = () => (
    <div className="KandidatsokNextHeader">
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
            <a href="/kandidater">Lukk&nbsp;kandidatmatch</a>
        </div>
    </div>
);

export default KandidatsokNextHeader;
