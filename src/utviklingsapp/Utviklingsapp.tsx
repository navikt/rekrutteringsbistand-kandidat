import React, { FunctionComponent, useEffect, useState } from 'react';
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
                <Systemtittel>Utviklingsapp for rekrutteringsbistand-stilling</Systemtittel>
                <div className="lenke">
                    <a href="http://localhost:3002/stillinger/">stilling</a>
                </div>
                <div className="lenke">
                    <a href="http://localhost:3002/stillinger/minestillinger">mine stillinger</a>
                </div>
            </header>
            <main>
                <Main />
            </main>
        </div>
    );
};

export default Utviklingsapp;
