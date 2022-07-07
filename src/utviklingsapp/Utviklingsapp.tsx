import React, { FunctionComponent, useEffect, useState } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { BrowserRouter, Link } from 'react-router-dom';

import { AppContainer, cssScopeForApp } from '../index';
import history from './history';
import './Utviklingsapp.less';
import { meg } from '../mock/data/veiledere.mock';

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
            <BrowserRouter>
                <header className="utviklingsapp">
                    <Systemtittel>Utviklingsapp for rekrutteringsbistand-kandidat</Systemtittel>
                    <div className="utviklingsapp__lenke">
                        <Link
                            state={{
                                fraMeny: true,
                            }}
                            to={{
                                pathname: '/kandidater',
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
                        <Link to="/prototype/ecaac27c-de33-4fb2-a0ed-c22436bfe611">Prototype</Link>
                    </div>
                    <div className="utviklingsapp__lenke">
                        <Link to="/prototype/stilling/ecaac27c-de33-4fb2-a0ed-c22436bfe611">
                            Prototype stilling
                        </Link>
                    </div>
                </header>
                <main>
                    <AppContainer history={history} navKontor={navKontor} />
                </main>
            </BrowserRouter>
        </div>
    );
};

export default Utviklingsapp;
