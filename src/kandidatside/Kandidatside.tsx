import React, { FunctionComponent } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import KandidatsideFraSøk, { Søkekontekst } from './fra-søk/KandidatsideFraSøk';
import KandidatsideFraKandidatliste from './fra-kandidatliste/KandidatsideFraKandidatliste';
import './Kandidatside.less';
import { useSelector } from 'react-redux';
import { toUrlQuery } from '../kandidatsøk/reducer/searchQuery';
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

type StateFraNyttKandidatsøk =
    | {
          search?: string;
          markerteKandidater: string[];
      }
    | undefined;

const Kandidatside: FunctionComponent = () => {
    const { search, state } = useLocation();
    const params = useParams<RouteParams>();

    const søkeparametreFraGammeltSøk = useSelector((state: AppState) => toUrlQuery(state));
    const stateFraNyttSøk = state as StateFraNyttKandidatsøk;

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
    const kontekst = finnSøkekontekst(
        stillingsId,
        kandidatlisteId,
        fraNyttKandidatsøk,
        fraAutomatiskMatching,
        søkeparametreFraGammeltSøk,
        stateFraNyttSøk
    );

    return (
        <KandidatsideFraSøk kandidatnr={kandidatnr} kontekst={kontekst}>
            <Outlet />
        </KandidatsideFraSøk>
    );
};

const finnSøkekontekst = (
    stillingsIdFraUrl: string | undefined,
    kandidatlisteIdFraUrl: string | undefined,
    fraNyttKandidatsøk: boolean,
    fraAutomatiskMatching: boolean,
    søkeparametreFraGammeltSøk: string,
    stateFraNyttSøk?: StateFraNyttKandidatsøk
): Søkekontekst => {
    if (fraAutomatiskMatching && stillingsIdFraUrl) {
        return {
            kontekst: 'fraAutomatiskMatching',
            stillingsId: stillingsIdFraUrl,
        };
    }
    if (fraNyttKandidatsøk) {
        if (kandidatlisteIdFraUrl) {
            return {
                kontekst: 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk',
                kandidatlisteId: kandidatlisteIdFraUrl,
                søk: stateFraNyttSøk?.search,
                markerteKandidater: stateFraNyttSøk?.markerteKandidater,
            };
        } else {
            return {
                kontekst: 'fraNyttKandidatsøk',
                søk: stateFraNyttSøk?.search,
                markerteKandidater: stateFraNyttSøk?.markerteKandidater,
            };
        }
    } else {
        if (stillingsIdFraUrl) {
            return {
                kontekst: 'finnKandidaterTilKandidatlisteMedStilling',
                stillingsId: stillingsIdFraUrl,
                søk: søkeparametreFraGammeltSøk,
            };
        } else if (kandidatlisteIdFraUrl) {
            return {
                kontekst: 'finnKandidaterTilKandidatlisteUtenStilling',
                kandidatlisteId: kandidatlisteIdFraUrl,
                søk: søkeparametreFraGammeltSøk,
            };
        } else {
            return { kontekst: 'fraKandidatsøk', søk: søkeparametreFraGammeltSøk };
        }
    }
};

export default Kandidatside;
