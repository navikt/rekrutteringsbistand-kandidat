import React, { FunctionComponent, useEffect, useState } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { Link, Router } from 'react-router-dom';

import { AppContainer, cssScopeForApp } from '../index';
import history from './history';
import './Utviklingsapp.less';

const Utviklingsapp: FunctionComponent = () => {
    const [navKontor, setNavKontor] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setNavKontor('0239');
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    });

    return (
        <div className={cssScopeForApp}>
            <Router history={history}>
                <header className="utviklingsapp">
                    <Systemtittel>Utviklingsapp for rekrutteringsbistand-kandidat</Systemtittel>
                    <div className="utviklingsapp__lenke">
                        <Link
                            to={{
                                pathname: '/kandidater',
                                state: {
                                    fraMeny: true,
                                },
                            }}
                        >
                            Kandidatsøk
                        </Link>
                    </div>
                    <div className="utviklingsapp__lenke">
                        <Link to="/kandidater/lister">Kandidatlister</Link>
                    </div>
                    <div className="utviklingsapp__lenke">
                        <Link to="/kandidater/stilling/1ea746af-66be-4cf8-a051-9e815f77b1d1">
                            Finn kandidater
                        </Link>
                    </div>
                    <div className="utviklingsapp__lenke">
                        <Link to="/prototype">Prototype</Link>
                    </div>
                </header>
                <main>
                    <AppContainer history={history} navKontor={navKontor} />
                </main>
            </Router>
        </div>
    );
};

export default Utviklingsapp;
