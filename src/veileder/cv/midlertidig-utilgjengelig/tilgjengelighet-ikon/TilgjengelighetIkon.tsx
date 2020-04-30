import React, { FunctionComponent } from 'react';
import SnartTilgjengeligFlagg from './SnartTilgjengeligFlagg';
import UtilgjengeligFlagg from './UtilgjengeligFlagg';

export enum Tilgjengelighet {
    TILGJENGELIG = 'TILGJENGELIG',
    UTILGJENGELIG = 'UTILGJENGELIG',
    SNART_TILGJENGELIG = 'SNART_TILGJENGELIG',
}

interface Props {
    tilgjengelighet: Tilgjengelighet;
    className: string;
}

const TilgjengelighetIkon: FunctionComponent<Props> = ({ tilgjengelighet, className }) => {
    switch (tilgjengelighet) {
        case Tilgjengelighet.SNART_TILGJENGELIG:
            return <SnartTilgjengeligFlagg className={className} />;
        case Tilgjengelighet.UTILGJENGELIG:
            return <UtilgjengeligFlagg className={className} />;
        case Tilgjengelighet.TILGJENGELIG:
        default:
            return null;
    }
};

export default TilgjengelighetIkon;
