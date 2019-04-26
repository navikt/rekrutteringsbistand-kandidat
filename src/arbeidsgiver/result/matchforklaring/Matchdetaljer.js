import React from 'react';
import { Systemtittel,Normaltekst } from 'nav-frontend-typografi';
import { MatchexplainProptypes } from './Proptypes';
import Matchforklaring from './Matchforklaring';
import './Matchdeltaljer.less';

const MatchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <path
            fill="none"
            stroke="#062140"
            strokeWidth="1.5"
            d="M20.783 9.859h6.608a2.75 2.75 0 0 1 2.75 2.75v6.608c0 .623 1.726 1.281 1.855 1.06a3.62 3.62 0 1 1 0 3.62c-.129-.221-1.855.437-1.855 1.06V33a2.75 2.75 0 0 1-2.75 2.75h-7.613l-.12-.042c-1.182-.413-1.182-1.47-.252-2.302a3.315 3.315 0 1 0-4.42 0c.93.832.93 1.889-.253 2.302l-.12.042H7A2.75 2.75 0 0 1 4.25 33v-7.613l.042-.12c.413-1.182 1.47-1.182 2.302-.253a3.315 3.315 0 1 0 0-4.42c-.832.93-1.889.93-2.302-.252l-.042-.12v-7.613A2.75 2.75 0 0 1 7 9.859h8.043c.623 0 1.281-1.726 1.06-1.855a3.62 3.62 0 1 1 3.62 0c-.221.129.437 1.855 1.06 1.855z"
        />
    </svg>
);

const Matchdetaljer = ({ matchforklaring }) => (
    <div>
        <div className="matchdetaljer-topLine-wrapper">
            <div className="matchdetaljer-topLine" />
            <div className="match-icon"><MatchIcon /></div>
        </div>
        <div className="match-explanation-container">
            <Systemtittel className="matchdetaljer-title">Kandidatmatch</Systemtittel>
            <Normaltekst className="text-center blokk-m">Se hvor godt denne kandidaten matcher ditt søk</Normaltekst>
            {matchforklaring && <Matchforklaring matchforklaring={matchforklaring} />}
        </div>
    </div>
);

Matchdetaljer.defaultProps = {
    matchforklaring: undefined
};

Matchdetaljer.propTypes = {
    matchforklaring: MatchexplainProptypes
};

export default Matchdetaljer;
