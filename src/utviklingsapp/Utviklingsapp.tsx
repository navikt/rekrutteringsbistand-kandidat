import React, { FunctionComponent } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { Link, Router } from 'react-router-dom';

import { cssScopeForApp } from '../index';
import { Main } from '../veileder/App';
import history from './history';
import './Utviklingsapp.less';

const Utviklingsapp: FunctionComponent = () => {
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
                    <Main history={history} />
                </main>
            </Router>
        </div>
    );
};

export default Utviklingsapp;
