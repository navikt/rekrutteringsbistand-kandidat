import React, { FunctionComponent } from 'react';
import { Tilgjengelighet } from '../../../sok/tilgjengelighet/midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';
import TilgjengelighetIkon from '../../../cv/midlertidig-utilgjengelig/tilgjengelighet-ikon/TilgjengelighetIkon';

interface Props {
    status: Tilgjengelighet;
}

const Flagg: FunctionComponent<Props> = ({ status }) => {
    if (status === Tilgjengelighet.Tilgjengelig) {
        return null;
    } else if (status === Tilgjengelighet.TilgjengeligInnen1Uke) {
        return (
            <TilgjengelighetIkon
                tilgjengelighet={Tilgjengelighet.TilgjengeligInnen1Uke}
                className="tilgjengelighet-flagg--snart-tilgjengelig"
            />
        );
    } else if (status === Tilgjengelighet.MidlertidigUtilgjengelig) {
        return (
            <TilgjengelighetIkon
                tilgjengelighet={Tilgjengelighet.MidlertidigUtilgjengelig}
                className="tilgjengelighet-flagg--utilgjengelig"
            />
        );
    } else {
        return null;
    }
};

export default Flagg;
