import React, { FunctionComponent, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import KandidatsideFraSøk from './fra-søk/KandidatsideFraSøk';
import KandidatsideFraKandidatliste from './fra-kandidatliste/KandidatsideFraKandidatliste';
import { hentSøkekontekst, hentØktFraNyttKandidatsøk } from './søkekontekst';
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

    const kandidatnr = params.kandidatnr!;
    const queryParams = new URLSearchParams(search);

    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId) ?? undefined;
    const fraKandidatliste = queryParams.get(KandidatQueryParam.FraKandidatliste) === 'true';
    const fraAutomatiskMatching =
        queryParams.get(KandidatQueryParam.FraAutomatiskMatching) === 'true';

    console.log(
        'Kommer fra kandidatliste og har kandidatlisteId: ',
        fraKandidatliste && kandidatlisteId
    );

    if (fraKandidatliste && kandidatlisteId) {
        return (
            <KandidatsideFraKandidatliste kandidatnr={kandidatnr} kandidatlisteId={kandidatlisteId}>
                <Outlet />
            </KandidatsideFraKandidatliste>
        );
    }

    const stillingsId = queryParams.get(KandidatQueryParam.StillingId) ?? undefined;

    console.log('Skal hente søkekontekst');

    const kontekst = hentSøkekontekst(
        kandidatnr,
        stillingsId,
        kandidatlisteId,
        fraAutomatiskMatching,
        nyttKandidatsøkØkt.current
    );

    console.log('Søkekontekst', kontekst);

    return (
        <KandidatsideFraSøk kandidatnr={kandidatnr} kontekst={kontekst}>
            <Outlet />
        </KandidatsideFraSøk>
    );
};

export default Kandidatside;
