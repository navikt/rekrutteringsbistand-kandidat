import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { Systemtittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';

import { AppMedStore } from '../index';
import CustomRouter from './CustomRouter';
import { mock } from '../mock/mock-data';
import { meg } from '../mock/data/kandidat/veileder.mock';
import css from './Utviklingsapp.module.css';

const history = createBrowserHistory();

const Utviklingsapp: FunctionComponent = () => {
    const [navKontor, setNavKontor] = useState<string | null>(null);

    const enKandidatliste = mock.kandidat.kandidatlister[0];
    const enAnnenKandidatliste = mock.kandidat.kandidatlister[1];
    const enKandidat = enKandidatliste.kandidater[0];
    const enAnnenKandidat = enKandidatliste.kandidater[1];

    const stateFraKandidatsøk = {
        kandidater: enKandidatliste.kandidater.map((k) => k.kandidatnr),
    };

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
                <Systemtittel>Utviklingsapp</Systemtittel>

                <nav className={css.lenker}>
                    <Utviklingslenke to="/kandidater/lister">Kandidatlister</Utviklingslenke>
                    <Utviklingslenke
                        to={`/kandidater/kandidat/${enKandidat.kandidatnr}/cv?fraNyttKandidatsok=true`}
                    >
                        Kandidatside fra vanlig søk
                    </Utviklingslenke>
                    <Utviklingslenke
                        to={`/kandidater/kandidat/${enKandidat.kandidatnr}/cv?fraNyttKandidatsok=true&kandidatlisteId=${enAnnenKandidatliste.kandidatlisteId}`}
                        state={{
                            kandidater: [enKandidat.kandidatnr, enAnnenKandidat.kandidatnr],
                        }}
                    >
                        Kandidatside fra finn kandidater
                    </Utviklingslenke>
                    <Utviklingslenke
                        to={`/kandidater/kandidat/${enKandidat.kandidatnr}/cv?fraKandidatliste=true&kandidatlisteId=${enKandidatliste.kandidatlisteId}`}
                        state={{
                            kandidater: [enKandidat.kandidatnr, enAnnenKandidat.kandidatnr],
                        }}
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
