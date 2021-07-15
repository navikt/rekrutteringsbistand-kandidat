import React, { FunctionComponent } from 'react';
import { Tilgjengelighet } from '../../cv/reducer/cv-typer';
import SnartTilgjengeligFlagg from './SnartTilgjengeligFlagg';
import UtilgjengeligFlagg from './UtilgjengeligFlagg';

interface Props {
    tilgjengelighet: Tilgjengelighet;
    className: string;
}

const TilgjengelighetIkon: FunctionComponent<Props> = ({ tilgjengelighet, className }) => {
    switch (tilgjengelighet) {
        case Tilgjengelighet.TilgjengeligInnen1Uke:
            return <SnartTilgjengeligFlagg className={className} />;
        case Tilgjengelighet.MidlertidigUtilgjengelig:
            return <UtilgjengeligFlagg className={className} />;
        case Tilgjengelighet.Tilgjengelig:
        default:
            return null;
    }
};

export default TilgjengelighetIkon;
