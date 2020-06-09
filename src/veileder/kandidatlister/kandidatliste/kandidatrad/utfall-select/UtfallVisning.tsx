import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Utfall } from './UtfallSelect';

interface Props {
    utfall: Utfall;
}

// todo classnames
const UtfallVisning: FunctionComponent<Props> = ({ utfall }) => (
    <span className="StatusSelect__status">
        <span className={`StatusSelect__sirkel StatusSelect__sirkel--${utfall.toLowerCase()}`} />
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
            return 'Fått jobben';
    }
};

export default UtfallVisning;
