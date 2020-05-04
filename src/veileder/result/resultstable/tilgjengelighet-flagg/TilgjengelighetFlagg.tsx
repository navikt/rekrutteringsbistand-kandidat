import React, { FunctionComponent } from 'react';
import { Tilgjengelighet } from '../../../sok/tilgjengelighet/midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';
import TilgjengelighetIkon from '../../../cv/midlertidig-utilgjengelig/tilgjengelighet-ikon/TilgjengelighetIkon';
import './TilgjengelighetFlagg.less';

interface Props {
    status: Tilgjengelighet;
}

const TilgjengelighetFlagg: FunctionComponent<Props> = ({ status }) => {
    let midlertidigUtilgjengeligFlagg;
    if (status === 'tilgjengelig') {
        midlertidigUtilgjengeligFlagg = null;
    } else if (status === 'tilgjengeliginnen1uke') {
        midlertidigUtilgjengeligFlagg = (
            <TilgjengelighetIkon
                tilgjengelighet={Tilgjengelighet.TilgjengeligInnen1Uke}
                className="tilgjengelighet-flagg--snart-tilgjengelig"
            />
        );
    } else if (status === 'midlertidigutilgjengelig') {
        midlertidigUtilgjengeligFlagg = (
            <TilgjengelighetIkon
                tilgjengelighet={Tilgjengelighet.MidlertidigUtilgjengelig}
                className="tilgjengelighet-flagg--utilgjengelig"
            />
        );
    } else {
        return null;
    }

    return midlertidigUtilgjengeligFlagg;
};

export default TilgjengelighetFlagg;
