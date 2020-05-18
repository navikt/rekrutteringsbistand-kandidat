import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import VisKandidat from './VisKandidat';
import VisKandidatFraLister from './VisKandidatFraLister';
import { fetchKandidatlisterForKandidat } from '../api';

export enum KandidatQueryParam {
    KandidatlisteId = 'kandidatlisteId',
    StillingId = 'stillingId',
    FraKandidatliste = 'fraKandidatliste',
}

type RouteParams = {
    kandidatNr: string;
};

type Props = RouteComponentProps<RouteParams>;

const Kandidatside: FunctionComponent<Props> = ({ match, location }) => {
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
