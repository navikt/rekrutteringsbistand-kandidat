import React, { FunctionComponent } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import KandidatsideFraSøk from './fra-søk/KandidatsideFraSøk';
import KandidatsideFraKandidatliste from './fra-kandidatliste/KandidatsideFraKandidatliste';
import './Kandidatside.less';

export enum KandidatQueryParam {
    KandidatlisteId = 'kandidatlisteId',
    StillingId = 'stillingId',
    FraKandidatliste = 'fraKandidatliste',
}

type RouteParams = {
    kandidatnr: string;
};

const Kandidatside: FunctionComponent = ({ children }) => {
    const { search } = useLocation();
    const { params } = useRouteMatch<RouteParams>();

    const kandidatnr = params.kandidatnr;

    const queryParams = new URLSearchParams(search);
    const stillingId = queryParams.get(KandidatQueryParam.StillingId) ?? undefined;
    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId) ?? undefined;
    const fraKandidatliste = queryParams.get(KandidatQueryParam.FraKandidatliste) === 'true';

    return fraKandidatliste && kandidatlisteId ? (
        <KandidatsideFraKandidatliste kandidatnr={kandidatnr} kandidatlisteId={kandidatlisteId}>
            {children}
        </KandidatsideFraKandidatliste>
    ) : (
        <KandidatsideFraSøk
            kandidatnr={kandidatnr}
            stillingsId={stillingId}
            kandidatlisteId={kandidatlisteId}
        >
            {children}
        </KandidatsideFraSøk>
    );
};

export default Kandidatside;
