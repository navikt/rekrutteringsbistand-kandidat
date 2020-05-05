import React, { FunctionComponent } from 'react';
import moment from 'moment';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { antallDagerMellom, dagensDato } from '../../../cv/midlertidig-utilgjengelig/validering';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { MidlertidigUtilgjengeligResponse } from '../../../cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { Nettressurs, Nettstatus } from '../../../../felles/common/remoteData';
import { Tilgjengelighet } from '../../../sok/tilgjengelighet/midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';

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
        const antallDager = antallDagerMellom(dagensDato(), midlertidigUtilgjengelig.tilDato);
        const dato = moment(midlertidigUtilgjengelig.tilDato).format('DD.MM.YY');

        return (
            <>
                <Element>{hentPopovertittel(status)}</Element>
                <Normaltekst>
                    Tilgjengelig om: <b>{antallDager} dager</b> ({dato})
                </Normaltekst>
            </>
        );
    }

    // TODO: Vis feilmelding
    return null;
};

export default MerInformasjon;
