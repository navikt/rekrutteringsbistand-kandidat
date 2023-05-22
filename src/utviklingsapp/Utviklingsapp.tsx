import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { Link } from 'react-router-dom';

import { AppMedStore } from '../index';
import CustomRouter from './CustomRouter';
import { mock } from '../mock/mock-data';
import { meg } from '../mock/data/kandidat/veileder.mock';
import css from './Utviklingsapp.module.css';
import { Heading } from '@navikt/ds-react';
import { KandidatsøkØkt } from '../kandidatside/søkekontekst';

const history = createBrowserHistory();

const Utviklingsapp: FunctionComponent = () => {
    const [navKontor, setNavKontor] = useState<string | null>(null);

    const enKandidatliste = mock.kandidat.kandidatlister[0];
    const enAnnenKandidatliste = mock.kandidat.kandidatlister[1];
    const enKandidat = enKandidatliste.kandidater[0];
    const enAnnenKandidat = enKandidatliste.kandidater[1];

    const stateFraKandidatsøk: KandidatsøkØkt = {
        totaltAntallKandidater: 50,
        searchParams: 'innsatsgruppe=BATT&side=2',
        sidestørrelse: 25,
        kandidaterPåSiden: enKandidatliste.kandidater.map((k) => k.kandidatnr),
        query: {
            from: 0,
        },
    };
    console.log('State:', stateFraKandidatsøk);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setNavKontor(meg.navKontor);

            sessionStorage.setItem('kandidatsøk', JSON.stringify(stateFraKandidatsøk));
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    });

    return (
        <CustomRouter history={history}>
            <header className={css.banner}>
                <Heading level="1" size="small">
                    Utviklingsapp
                </Heading>

                <nav className={css.lenker}>
                    <Utviklingslenke to="/kandidater/lister">Kandidatlister</Utviklingslenke>
                    <Utviklingslenke
                        to={`/kandidater/kandidat/${enKandidat.kandidatnr}/cv?fraKandidatsok=true`}
                    >
                        Kandidatside fra vanlig søk
                    </Utviklingslenke>
                    <Utviklingslenke
                        to={`/kandidater/kandidat/${enKandidat.kandidatnr}/cv?fraKandidatsok=true&kandidatlisteId=${enAnnenKandidatliste.kandidatlisteId}`}
                    >
                        Kandidatside fra finn kandidater
                    </Utviklingslenke>
                    <Utviklingslenke
                        to={`/kandidater/kandidat/${enKandidat.kandidatnr}/cv?fraKandidatliste=true&kandidatlisteId=${enKandidatliste.kandidatlisteId}`}
                    >
                        Kandidatside fra liste
                    </Utviklingslenke>
                </nav>
            </header>
            <AppMedStore history={history} navKontor={navKontor} />
        </CustomRouter>
    );
};

const Utviklingslenke = ({
    to,
    state,
    children,
}: {
    to: string;
    state?: object;
    children: ReactNode;
}) => (
    <Link state={state} to={to}>
        {children}
    </Link>
);

export default Utviklingsapp;
