import React, { FunctionComponent } from 'react';
import FlaggIkonStroke from './FlaggIkonStroke';
import FlaggIkonFill from './FlaggIkonFill';

export enum Tilgjengelighet {
    TILGJENGELIG = 'TILGJENGELIG',
    UTILGJENGELIG = 'UTILGJENGELIG',
    SNART_TILGJENGELIG = 'SNART_TILGJENGELIG',
}

interface Props {
    tilgjengelighet: Tilgjengelighet;
    className: string;
}
const TilgjengelighetIkon: FunctionComponent<Props> = props => {
    const { tilgjengelighet, className } = props;
    switch (props.tilgjengelighet) {
        case Tilgjengelighet.SNART_TILGJENGELIG:
            return <FlaggIkonStroke className={className} />;
        case Tilgjengelighet.UTILGJENGELIG:
            return <FlaggIkonFill className={className} />;
        case Tilgjengelighet.TILGJENGELIG:
        default:
            return null;
    }
};

export default TilgjengelighetIkon;
