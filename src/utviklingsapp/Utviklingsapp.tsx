import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { Systemtittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';

import { AppMedStore, cssScopeForApp } from '../index';
import CustomRouter from './CustomRouter';
import { meg } from '../mock/data/veiledere.mock';
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

    return (
        <div className={cssScopeForApp}>
            <CustomRouter history={history}>
                <header className="utviklingsapp">
                    <Systemtittel>Utviklingsapp for rekrutteringsbistand-kandidat</Systemtittel>

                    <Utviklingslenke to="/kandidater/lister">Kandidatlister</Utviklingslenke>
                    <Utviklingslenke
                        to="/kandidater/kandidat/AB123456/cv?fraNyttKandidatsok=true"
                        state={{
                            kandidater: ['AB123456', 'BC123456'],
                        }}
                    >
                        Kandidatside (CV/Historikk)
                    </Utviklingslenke>
                    <Utviklingslenke to="/prototype/stilling/1ea746af-66be-4cf8-a051-9e815f77b1d1">
                        Kandidatmatch
                    </Utviklingslenke>

                    <Utviklingslenke
                        state={{
                            aktørIder: ['PAM010nudgb5v', 'PAM013tc53ryp'],
                        }}
                        to="/prototype/stilling/2ea746af-66be-4cf8-a051-9e815f77b1d1"
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
