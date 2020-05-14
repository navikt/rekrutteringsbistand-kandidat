import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

enum QueryParams {
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
    const stillingId = queryParams.get(QueryParams.StillingId);
    const kandidatlisteId = queryParams.get(QueryParams.KandidatlisteId);
    const fraKandidatliste = queryParams.get(QueryParams.FraKandidatliste) === 'true';

    /* TODO: Render riktig komponent basert på variabler.
     * Ingen params -> Vis kandidat
     * StillingID -> Vis kandidat med knapp "Lagre kandidat"
     * KandidatlisteId -> Vis kandidat med knapp "Lagre kandidat"
     * KandidatlisteId && fraKandidatliste ->
     *      Vis kandidat med statusvelger
     *      Forrige/neste gjelder kandidatlisten
     */
    return <div>Placeholder</div>;
};

export default Kandidatside;
