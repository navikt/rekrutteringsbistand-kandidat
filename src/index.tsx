import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import Navspa from '@navikt/navspa';

import Utviklingsapp from './utviklingsapp/Utviklingsapp';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import store from './reduxStore';
import { Router } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { History } from 'history';
import FeilMedApp from './FeilMedApp';
import { getMiljø, Miljø } from './utils/miljøUtils';
import { fjernPersonopplysninger } from './utils/sentryUtils';
import App from './app/App';
import './index.less';

const appElement =
    document.getElementById('rekrutteringsbistand-container') ||
    document.getElementById('utviklingsapp');
if (appElement) {
    Modal.setAppElement(appElement);
}

Sentry.init({
    dsn: 'https://bd029fab6cab426eb0415b89a7f07124@sentry.gc.nav.no/20',
    environment: getMiljø(),
    release: process.env.REACT_APP_SENTRY_RELEASE || 'unknown',
    enabled: getMiljø() === Miljø.DevGcp || getMiljø() === Miljø.ProdGcp,
    beforeSend: fjernPersonopplysninger,
    autoSessionTracking: false,
});

// Alle klassenavn blir prefikset med ".rek-kandidat" i craco-configen, så også koden
// som brukes under utvikling må wrappes i et element med dette klassenavnet.
export const cssScopeForApp = 'rek-kandidat';

type AppProps = {
    navKontor: string | null;
    history: History;
};

export const AppMedRouter: FunctionComponent<AppProps> = (props) => (
    <div id="rekrutteringsbistand-kandidat" className={cssScopeForApp}>
        <Sentry.ErrorBoundary fallback={(error) => <FeilMedApp {...error} />}>
            <Router navigator={props.history} location={props.history.location}>
                <AppMedStore {...props} />
            </Router>
        </Sentry.ErrorBoundary>
    </div>
);

export const AppMedStore: FunctionComponent<AppProps> = ({ navKontor }) => (
    <Provider store={store}>
        <App navKontor={navKontor} />
    </Provider>
);

const renderUtviklingsapp = async () => {
    if (process.env.REACT_APP_MOCK) {
        await import('./mock/mock-api');
    }

    ReactDOM.render(<Utviklingsapp />, document.getElementById('utviklingsapp'));
};

if (process.env.REACT_APP_EXPORT) {
    Navspa.eksporter('rekrutteringsbistand-kandidat', AppMedRouter);
} else {
    renderUtviklingsapp();
}
