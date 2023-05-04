import React, { FunctionComponent, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Tabs } from '@navikt/ds-react';

import { hentØktFraNyttKandidatsøk, NyttKandidatsøkØkt } from './søkekontekst';
import { PersonEnvelopeIcon, Chat2Icon } from '@navikt/aksel-icons';
import FraKandidatliste from './fraKandidatliste/FraKandidatliste';
import FraSøkUtenKontekst from './fraSøkUtenKontekst/FraSøkUtenKontekst';
import Sidefeil from '../komponenter/sidefeil/Sidefeil';
import FraSøkMedKandidatliste from './fraSøkMedKandidatliste/FraSøkMedKandidatliste';

export enum KandidatQueryParam {
    KandidatlisteId = 'kandidatlisteId',
    StillingId = 'stillingId',
    FraKandidatliste = 'fraKandidatliste',
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

    if (kommerFraKandidatliste) {
        if (kandidatlisteIdFraUrl) {
            return (
                <FraKandidatliste
                    tabs={<Faner />}
                    kandidatnr={kandidatnr}
                    kandidatlisteId={kandidatlisteIdFraUrl}
                >
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
                    tabs={<Faner />}
                    kandidatnr={kandidatnr}
                    kandidatlisteId={kandidatlisteIdFraUrl}
                    søkeøkt={søkeøkt}
                >
                    <Outlet />
                </FraSøkMedKandidatliste>
            );
        } else {
            return (
                <FraSøkUtenKontekst tabs={<Faner />} kandidatnr={kandidatnr} søkeøkt={søkeøkt}>
                    <Outlet />
                </FraSøkUtenKontekst>
            );
        }
    } else {
        return <Sidefeil feilmelding="Klarte ikke å bestemme riktig kontekst" />;
    }
};

const Faner = () => (
    <Tabs.List>
        <Tabs.Tab icon={<PersonEnvelopeIcon />} value="cv" label="CV og Jobbprofil" />
        <Tabs.Tab icon={<Chat2Icon />} value="historikk" label="Historikk" />
    </Tabs.List>
);

export default Kandidatside;
