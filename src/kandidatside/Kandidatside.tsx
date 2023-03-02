import React, { FunctionComponent, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import KandidatsideFraSøk from './fra-søk/KandidatsideFraSøk';
import KandidatsideFraKandidatliste from './fra-kandidatliste/KandidatsideFraKandidatliste';
import { hentSøkekontekst, hentØktFraNyttKandidatsøk } from './søkekontekst';
import './Kandidatside.less';
import { useSelector } from 'react-redux';
import AppState from '../AppState';

export enum KandidatQueryParam {
    KandidatlisteId = 'kandidatlisteId',
    StillingId = 'stillingId',
    FraKandidatliste = 'fraKandidatliste',
    FraAutomatiskMatching = 'fraKandidatmatch',
    FraNyttKandidatsøk = 'fraNyttKandidatsok',
}

type RouteParams = {
    kandidatnr: string;
};

const Kandidatside: FunctionComponent = () => {
    const kandidatlisteState = useSelector((state: AppState) => state.kandidatliste);

    const nyttKandidatsøkØkt = useRef(hentØktFraNyttKandidatsøk());
    const { search } = useLocation();
    const params = useParams<RouteParams>();

    const kandidatnr = params.kandidatnr!;
    const queryParams = new URLSearchParams(search);

    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId) ?? undefined;
    const fraKandidatliste = queryParams.get(KandidatQueryParam.FraKandidatliste) === 'true';
    const fraAutomatiskMatching =
        queryParams.get(KandidatQueryParam.FraAutomatiskMatching) === 'true';

    if (fraKandidatliste && kandidatlisteId) {
        return (
            <KandidatsideFraKandidatliste kandidatnr={kandidatnr} kandidatlisteId={kandidatlisteId}>
                <Outlet />
            </KandidatsideFraKandidatliste>
        );
    }

    const stillingsId = queryParams.get(KandidatQueryParam.StillingId) ?? undefined;

    const kontekst = hentSøkekontekst(
        kandidatnr,
        stillingsId,
        kandidatlisteId,
        fraAutomatiskMatching,
        kandidatlisteState.kandidatliste,
        nyttKandidatsøkØkt.current
    );

    return (
        <KandidatsideFraSøk kandidatnr={kandidatnr} kontekst={kontekst}>
            <Outlet />
        </KandidatsideFraSøk>
    );
};

export default Kandidatside;
