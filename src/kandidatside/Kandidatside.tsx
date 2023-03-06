import React, { FunctionComponent, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import FraSøkUtenKontekst from './fraSøkUtenKontekst/FraSøkUtenKontekst';
import { hentSøkekontekst, hentØktFraNyttKandidatsøk } from './søkekontekst';
import AppState from '../AppState';
import FraKandidatliste from './fraKandidatliste/FraKandidatliste';
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
    const kandidatlisteState = useSelector((state: AppState) => state.kandidatliste);

    const nyttKandidatsøkØkt = useRef(hentØktFraNyttKandidatsøk());
    const { search } = useLocation();
    const params = useParams<RouteParams>();

    const kandidatnr = params.kandidatnr!;
    const queryParams = new URLSearchParams(search);

    const fraKandidatliste = queryParams.get(KandidatQueryParam.FraKandidatliste) === 'true';
    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId) ?? undefined;

    if (fraKandidatliste && kandidatlisteId) {
        return (
            <FraKandidatliste kandidatnr={kandidatnr} kandidatlisteId={kandidatlisteId}>
                <Outlet />
            </FraKandidatliste>
        );
    }

    const fraAutomatiskMatching =
        queryParams.get(KandidatQueryParam.FraAutomatiskMatching) === 'true';
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
        <FraSøkUtenKontekst kandidatnr={kandidatnr} kontekst={kontekst}>
            <Outlet />
        </FraSøkUtenKontekst>
    );
};

export default Kandidatside;
