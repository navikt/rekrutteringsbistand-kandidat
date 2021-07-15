import React, { FunctionComponent } from 'react';
import moment from 'moment';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Nettressurs, Nettstatus } from '../../../api/remoteData';
import { MidlertidigUtilgjengeligResponse } from '../../../kandidatside/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import {
    antallDagerMellom,
    dagensDato,
} from '../../../kandidatside/midlertidig-utilgjengelig/validering';
import { Tilgjengelighet } from '../../../kandidatside/cv/reducer/cv-typer';

interface Props {
    status: Tilgjengelighet;
    merInformasjon?: Nettressurs<MidlertidigUtilgjengeligResponse>;
}

const hentPopovertittel = (tilgjengelighet: Tilgjengelighet) => {
    switch (tilgjengelighet) {
        case Tilgjengelighet.TilgjengeligInnen1Uke:
            return 'Tilgjengelig innen 1 uke';
        case Tilgjengelighet.MidlertidigUtilgjengelig:
            return 'Midlertidig utilgjengelig';
    }
};

const MerInformasjon: FunctionComponent<Props> = ({ status, merInformasjon }) => {
    if (!merInformasjon) {
        return null;
    }

    if (merInformasjon.kind === Nettstatus.LasterInn) {
        return <NavFrontendSpinner />;
    } else if (
        merInformasjon.kind === Nettstatus.Suksess &&
        merInformasjon.data.midlertidigUtilgjengelig !== null
    ) {
        const { midlertidigUtilgjengelig } = merInformasjon.data;
        const tilgjengeligDato = moment(midlertidigUtilgjengelig.tilDato).add(1, 'days');
        const antallDager = antallDagerMellom(dagensDato(), tilgjengeligDato);

        return (
            <>
                <Element>{hentPopovertittel(status)}</Element>
                <Normaltekst>
                    Tilgjengelig om: <b>{antallDager} dager</b> (
                    {tilgjengeligDato.format('DD.MM.YY')})
                </Normaltekst>
            </>
        );
    }

    // TODO: Vis feilmelding
    return null;
};

export default MerInformasjon;
