import React from 'react';
import { Systemtittel,Normaltekst } from 'nav-frontend-typografi';
import { MatchexplainProptypes } from './Proptypes';
import Matchforklaring from './Matchforklaring';
import './Matchdeltaljer.less';

const MatchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <g fill="none" fillRule="evenodd">
            <path stroke="#062140" d="M8.641 28.265c2.166 1.137 4.074 2.541 5.723 4.21 1.646 1.668 3.033 3.598 4.159 5.79 1.126-2.192 2.513-4.122 4.159-5.79 1.65-1.67 3.559-3.074 5.725-4.211-2.182-1.152-4.105-2.57-5.768-4.253a22.83 22.83 0 0 1-4.12-5.739c-1.125 2.19-2.51 4.117-4.155 5.782-1.65 1.67-3.557 3.074-5.723 4.211zM21.767 8c1.269.7 2.396 1.55 3.38 2.545.98.993 1.817 2.131 2.51 3.413a14.931 14.931 0 0 1 2.51-3.413A14.73 14.73 0 0 1 33.549 8a14.949 14.949 0 0 1-3.407-2.572 14.623 14.623 0 0 1-2.487-3.38 14.93 14.93 0 0 1-2.508 3.408A14.729 14.729 0 0 1 21.767 8zM11.998 15.757H9h2.998v-3 3zm0 0v3-3H15h-3.002zM29.998 20.757H27h2.998v-3 3zm0 0v3-3H33h-3.002z" />
            <path fill="#062140" d="M14 8.757h1v1h-1zM9 21.757h1v1H9zM5 12.757h1v1H5zM34 14.757h1v1h-1zM34 25.757h1v1h-1zM24 17.757h1v1h-1z" />
        </g>
    </svg>
);

const Matchdetaljer = ({ matchforklaring }) => (
    <div>
        <div className="match-icon matchdetalijer-icon"><MatchIcon /></div>
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
