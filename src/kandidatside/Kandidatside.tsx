import React, { FunctionComponent, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import { hentØktFraNyttKandidatsøk, NyttKandidatsøkØkt } from './søkekontekst';
import FraKandidatliste from './fraKandidatliste/FraKandidatliste';
import FraSøkUtenKontekst from './fraSøkUtenKontekst/FraSøkUtenKontekst';
import Sidefeil from '../common/sidefeil/Sidefeil';
import FraSøkMedKandidatliste from './fraSøkMedKandidatliste/FraSøkMedKandidatliste';
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
    const søkeøktRef = useRef<NyttKandidatsøkØkt>(hentØktFraNyttKandidatsøk());
    const søkeøkt = søkeøktRef.current || {};
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const routeParams = useParams<RouteParams>();
    const kandidatnr = routeParams.kandidatnr!;

    const kandidatlisteIdFraUrl = searchParams.get(KandidatQueryParam.KandidatlisteId);
    const kommerFraKandidatliste = searchParams.get(KandidatQueryParam.FraKandidatliste) === 'true';
    const kommerFraKandidatsøket =
        searchParams.get(KandidatQueryParam.FraNyttKandidatsøk) === 'true';
    const kommerFraAutomatiskMatching =
        searchParams.get(KandidatQueryParam.FraAutomatiskMatching) === 'true';

    if (kommerFraKandidatliste) {
        if (kandidatlisteIdFraUrl) {
            return (
                <FraKandidatliste kandidatnr={kandidatnr} kandidatlisteId={kandidatlisteIdFraUrl}>
                    <Outlet />
                </FraKandidatliste>
            );
        } else {
            return <Sidefeil feilmelding="Mangler kandidatlisteId i URL" />;
        }
    } else if (kommerFraKandidatsøket) {
        if (kandidatlisteIdFraUrl) {
            return (
                <FraSøkMedKandidatliste
                    kandidatnr={kandidatnr}
                    kandidatlisteId={kandidatlisteIdFraUrl}
                    søkeøkt={søkeøkt}
                    fraAutomatiskMatching={kommerFraAutomatiskMatching}
                >
                    <Outlet />
                </FraSøkMedKandidatliste>
            );
        } else {
            return (
                <FraSøkUtenKontekst kandidatnr={kandidatnr} søkeøkt={søkeøkt}>
                    <Outlet />
                </FraSøkUtenKontekst>
            );
        }
    } else {
        return <Sidefeil feilmelding="Klarte ikke å bestemme riktig kontekst" />;
    }
};

export default Kandidatside;
