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

const Kandidatside: FunctionComponent = ({ children }) => {
    const { search } = useLocation();
    const { params } = useRouteMatch<RouteParams>();

    const kandidatNr = params.kandidatNr;

    const queryParams = new URLSearchParams(search);
    const stillingId = queryParams.get(KandidatQueryParam.StillingId);
    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId);
    const fraKandidatliste = queryParams.get(KandidatQueryParam.FraKandidatliste) === 'true';

    return fraKandidatliste && kandidatlisteId ? (
        <VisKandidatFraLister kandidatNr={kandidatNr} kandidatlisteId={kandidatlisteId}>
            {children}
        </VisKandidatFraLister>
    ) : (
        <VisKandidat
            kandidatNr={kandidatNr}
            stillingsId={stillingId}
            kandidatlisteId={kandidatlisteId}
        >
            {children}
        </VisKandidat>
    );
};

export default Kandidatside;
