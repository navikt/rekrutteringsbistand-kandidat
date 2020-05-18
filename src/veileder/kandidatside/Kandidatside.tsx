import React, { FunctionComponent } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import VisKandidat from './VisKandidat';
import VisKandidatFraLister from './VisKandidatFraLister';

export enum KandidatQueryParam {
    KandidatlisteId = 'kandidatlisteId',
    StillingId = 'stillingId',
    FraKandidatliste = 'fraKandidatliste',
}

type RouteParams = {
    kandidatNr: string;
};

const Kandidatside: FunctionComponent = () => {
    const location = useLocation();
    const match = useRouteMatch<RouteParams>();

    const queryParams = new URLSearchParams(location.search);

    const kandidatNr = match.params.kandidatNr;
    const stillingId = queryParams.get(KandidatQueryParam.StillingId);
    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId);
    const fraKandidatliste = queryParams.get(KandidatQueryParam.FraKandidatliste) === 'true';

    return fraKandidatliste && kandidatlisteId ? (
        <VisKandidatFraLister kandidatNr={kandidatNr} kandidatlisteId={kandidatlisteId} />
    ) : (
        <VisKandidat
            kandidatNr={kandidatNr}
            stillingsId={stillingId}
            kandidatlisteId={kandidatlisteId}
        />
    );
};

export default Kandidatside;
