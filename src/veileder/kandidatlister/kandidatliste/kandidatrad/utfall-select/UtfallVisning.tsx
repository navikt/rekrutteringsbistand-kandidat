import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Utfall } from './UtfallSelect';

interface Props {
    utfall: Utfall;
}

const UtfallVisning: FunctionComponent<Props> = ({ utfall }) => (
    <span className="UtfallSelect__status">
        <span className={`UtfallSelect__sirkel UtfallSelect__sirkel--${utfall.toLowerCase()}`} />
        <Normaltekst>{utfallToDisplayName(utfall)}</Normaltekst>
    </span>
);

export const utfallToDisplayName = (utfall: Utfall) => {
    switch (utfall) {
        case Utfall.Presentert:
            return 'Presentert';
        case Utfall.IkkePresentert:
            return 'Ikke presentert';
        case Utfall.FåttJobben:
            return 'Fått jobb';
    }
};

export default UtfallVisning;
