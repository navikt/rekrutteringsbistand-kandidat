import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { Systemtittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';

import { AppMedStore, cssScopeForApp } from '../index';
import CustomRouter from './CustomRouter';
import { mock } from '../mock/mock-data';
import { Stilling } from '../automatisk-matching/kandidatmatchReducer';
import { meg } from '../mock/data/veileder';
import './Utviklingsapp.less';

const history = createBrowserHistory();

const Utviklingsapp: FunctionComponent = () => {
    const [navKontor, setNavKontor] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setNavKontor(meg.navKontor);
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    });

    const enKandidatliste = mock.kandidatlister[0];
    const enKandidat = enKandidatliste.kandidater[0];
    const enAnnenKandidat = enKandidatliste.kandidater[1];
    const enStilling = mock.stilling._source as unknown as Stilling;
    const enAnnenStilling = mock.annenStilling._source as unknown as Stilling;

    return (
        <div className={cssScopeForApp}>
            <CustomRouter history={history}>
                <header className="utviklingsapp">
                    <Systemtittel>Utviklingsapp for rekrutteringsbistand-kandidat</Systemtittel>

                    <Utviklingslenke to="/kandidater/lister">Kandidatlister</Utviklingslenke>
                    <Utviklingslenke
                        to={`/kandidater/kandidat/${enKandidat.kandidatnr}/cv?fraNyttKandidatsok=true`}
                        state={{
                            kandidater: [enKandidat.kandidatnr, enAnnenKandidat.kandidatnr],
                        }}
                    >
                        Kandidatside
                    </Utviklingslenke>
                    <Utviklingslenke
                        to={`/kandidater/kandidat/${enKandidat.kandidatnr}/cv?kandidatlisteId=${enKandidatliste.kandidatlisteId}&fraKandidatliste=true`}
                        state={{
                            kandidater: [enKandidat.kandidatnr, enAnnenKandidat.kandidatnr],
                        }}
                    >
                        Kandidatside fra liste
                    </Utviklingslenke>
                    <Utviklingslenke to={`/prototype/stilling/${enStilling.stilling.uuid}`}>
                        Kandidatmatch
                    </Utviklingslenke>

                    <Utviklingslenke
                        state={{
                            aktørIder: ['PAM010nudgb5v', 'PAM013tc53ryp'],
                        }}
                        to={`/prototype/stilling/${enAnnenStilling.stilling.uuid}`}
                    >
                        Kandidatmatch (med aktørIder)
                    </Utviklingslenke>
                </header>
                <AppMedStore history={history} navKontor={navKontor} />
            </CustomRouter>
        </div>
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
    <div className="utviklingsapp__lenke">
        <Link state={state} to={to}>
            {children}
        </Link>
    </div>
);

export default Utviklingsapp;
