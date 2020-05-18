import React, { FunctionComponent } from 'react';
import { useLocation, useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import VisKandidat from './VisKandidat';
import VisKandidatFraLister from './VisKandidatFraLister';
import CvSide from './cv/CvSide';
import Historikkside from './historikk/Historikkside';
import { useSelector } from 'react-redux';
import AppState from '../AppState';

export enum KandidatQueryParam {
    KandidatlisteId = 'kandidatlisteId',
    StillingId = 'stillingId',
    FraKandidatliste = 'fraKandidatliste',
}

type RouteParams = {
    kandidatNr: string;
};

const Router = ({ visHistorikk }) => {
    const { search } = useLocation();
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route path="/kandidater/kandidat/:kandidatNr/cv">
                <CvSide />
            </Route>
            {visHistorikk && (
                <Route path="/kandidater/kandidat/:kandidatNr/historikk">
                    <Historikkside />
                </Route>
            )}
            <Redirect to={`${path}/cv${search}`} />
        </Switch>
    );
};

const Kandidatside: FunctionComponent = () => {
    const { search } = useLocation();
    const { params } = useRouteMatch<RouteParams>();
    const visHistorikk = useSelector(
        (state: AppState) => state.search.featureToggles['vis-historikk']
    );

    const kandidatNr = params.kandidatNr;

    const queryParams = new URLSearchParams(search);
    const stillingId = queryParams.get(KandidatQueryParam.StillingId);
    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId);
    const fraKandidatliste = queryParams.get(KandidatQueryParam.FraKandidatliste) === 'true';

    return fraKandidatliste && kandidatlisteId ? (
        <VisKandidatFraLister kandidatNr={kandidatNr} kandidatlisteId={kandidatlisteId}>
            <Router visHistorikk={visHistorikk} />
        </VisKandidatFraLister>
    ) : (
        <VisKandidat
            kandidatNr={kandidatNr}
            stillingsId={stillingId}
            kandidatlisteId={kandidatlisteId}
        >
            <Router visHistorikk={visHistorikk} />
        </VisKandidat>
    );
};

export default Kandidatside;
