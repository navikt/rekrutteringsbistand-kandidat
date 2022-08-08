import React, { FunctionComponent } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import KandidatsideFraSøk from './fra-søk/KandidatsideFraSøk';
import KandidatsideFraKandidatliste from './fra-kandidatliste/KandidatsideFraKandidatliste';
import './Kandidatside.less';

export enum KandidatQueryParam {
    KandidatlisteId = 'kandidatlisteId',
    StillingId = 'stillingId',
    FraKandidatliste = 'fraKandidatliste',
    FraKandidatmatch = 'fraKandidatmatch',
}

type RouteParams = {
    kandidatnr: string;
};

const Kandidatside: FunctionComponent = () => {
    const { search } = useLocation();
    const params = useParams<RouteParams>();

    const kandidatnr = params.kandidatnr!;

    const queryParams = new URLSearchParams(search);
    const stillingId = queryParams.get(KandidatQueryParam.StillingId) ?? undefined;
    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId) ?? undefined;
    const fraKandidatliste = queryParams.get(KandidatQueryParam.FraKandidatliste) === 'true';
    const fraKandidatmatch = queryParams.get(KandidatQueryParam.FraKandidatmatch) === 'true';

    return fraKandidatliste && kandidatlisteId ? (
        <KandidatsideFraKandidatliste kandidatnr={kandidatnr} kandidatlisteId={kandidatlisteId}>
            <Outlet />
        </KandidatsideFraKandidatliste>
    ) : (
        <KandidatsideFraSøk
            kandidatnr={kandidatnr}
            stillingsId={stillingId}
            kandidatlisteId={kandidatlisteId}
            fraKandidatmatch={fraKandidatmatch}
        >
            <Outlet />
        </KandidatsideFraSøk>
    );
};

export default Kandidatside;
