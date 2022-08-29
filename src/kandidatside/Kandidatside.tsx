import React, { FunctionComponent, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import KandidatsideFraSøk from './fra-søk/KandidatsideFraSøk';
import KandidatsideFraKandidatliste from './fra-kandidatliste/KandidatsideFraKandidatliste';
import { useSelector } from 'react-redux';
import { toUrlQuery } from '../kandidatsøk/reducer/searchQuery';
import { hentSøkekontekst, hentØktFraNyttKandidatsøk } from './søkekontekst';
import AppState from '../AppState';
import './Kandidatside.less';

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
    const nyttKandidatsøkØkt = useRef(hentØktFraNyttKandidatsøk());
    const { search } = useLocation();
    const params = useParams<RouteParams>();

    const søkeparametreFraGammeltSøk = useSelector((state: AppState) => toUrlQuery(state));
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

    const fraNyttKandidatsøk = queryParams.get(KandidatQueryParam.FraNyttKandidatsøk) === 'true';
    const stillingsId = queryParams.get(KandidatQueryParam.StillingId) ?? undefined;
    const kontekst = hentSøkekontekst(
        kandidatnr,
        stillingsId,
        kandidatlisteId,
        fraNyttKandidatsøk,
        fraAutomatiskMatching,
        søkeparametreFraGammeltSøk,
        nyttKandidatsøkØkt.current
    );

    return (
        <KandidatsideFraSøk kandidatnr={kandidatnr} kontekst={kontekst}>
            <Outlet />
        </KandidatsideFraSøk>
    );
};

export default Kandidatside;
