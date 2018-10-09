import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { MatchexplainProptypesGrouped } from './Proptypes';
import Matchforklaring from './Matchforklaring';

const Matchdetaljer = ({ matchforklaring }) => (
    <div>
        <Innholdstittel className="text-center blokk-xs">Matchdetaljer</Innholdstittel>
        {matchforklaring && <Matchforklaring matchforklaring={matchforklaring} />}
    </div>
);

Matchdetaljer.defaultProps = {
    matchforklaring: undefined
};

Matchdetaljer.propTypes = {
    matchforklaring: MatchexplainProptypesGrouped
};

export default Matchdetaljer;
