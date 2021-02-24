import React, { FunctionComponent, useEffect, useState } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { Link, Router } from 'react-router-dom';

import { cssScopeForApp } from '../index';
import { Main } from '../App';
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
                        <Link to="/kandidater">Kandidatsøk</Link>
                    </div>
                    <div className="utviklingsapp__lenke">
                        <Link to="/kandidater/lister">Kandidatlister</Link>
                    </div>
                </header>
                <main>
                    <Main history={history} navKontor={navKontor} />
                </main>
            </Router>
        </div>
    );
};

export default Utviklingsapp;
