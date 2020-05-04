import React, { FunctionComponent } from 'react';
import { Tilgjengelighet } from '../../../sok/tilgjengelighet/midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';
import TilgjengelighetIkon from '../../../cv/midlertidig-utilgjengelig/tilgjengelighet-ikon/TilgjengelighetIkon';
import './TilgjengelighetFlagg.less';

interface Props {
    status: Tilgjengelighet;
}

const TilgjengelighetFlagg: FunctionComponent<Props> = ({ status }) => {
    let midlertidigUtilgjengeligFlagg;
    if (status === Tilgjengelighet.Tilgjengelig) {
        midlertidigUtilgjengeligFlagg = null;
    } else if (status === Tilgjengelighet.TilgjengeligInnen1Uke) {
        midlertidigUtilgjengeligFlagg = (
            <TilgjengelighetIkon
                tilgjengelighet={Tilgjengelighet.TilgjengeligInnen1Uke}
                className="tilgjengelighet-flagg--snart-tilgjengelig"
            />
        );
    } else if (status === Tilgjengelighet.MidlertidigUtilgjengelig) {
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
