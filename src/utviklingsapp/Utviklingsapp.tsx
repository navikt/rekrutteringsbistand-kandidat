import React, { FunctionComponent, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Systemtittel } from 'nav-frontend-typografi';
import { cssScopeForApp } from '../index';
import './Utviklingsapp.less';
import { Main } from '../veileder/App';

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
            <header className="utviklingsapp">
                <Systemtittel>Utviklingsapp for rekrutteringsbistand-kandidat</Systemtittel>
                <div className="lenke">
                    <a href="http://localhost:3003/kandidater/kandidat/">kandidatsøk</a>
                </div>
                <div className="lenke">
                    <a href="http://localhost:3003/kandidater/lister">kandidatliste</a>
                </div>
            </header>
            <main>
                <BrowserRouter>
                    <Main />
                </BrowserRouter>
            </main>
        </div>
    );
};

export default Utviklingsapp;
