import React, { FunctionComponent } from 'react';
import { Modal } from '@navikt/ds-react';
import { Router } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom';
import Navspa from '@navikt/navspa';
import './index.css';

import Utviklingsapp from './utviklingsapp/Utviklingsapp';
import { Provider } from 'react-redux';
import store from './state/reduxStore';
import { History } from 'history';
import FeilMedApp from './komponenter/FeilMedApp';
import { getMiljø, Miljø } from './utils/miljøUtils';
import { fjernPersonopplysninger } from './utils/sentryUtils';
import App from './app/App';

const skalEksporteres =
    import.meta.env.VITE_EXPORT === true || import.meta.env.MODE === 'production';

const appElement =
    document.getElementById('rekrutteringsbistand-container') ||
    document.getElementById('utviklingsapp');
if (appElement) {
    Modal.setAppElement(appElement);
}

Sentry.init({
    dsn: 'https://bd029fab6cab426eb0415b89a7f07124@sentry.gc.nav.no/20',
    environment: getMiljø(),
    release: import.meta.env.VITE_SENTRY_RELEASE || 'unknown',
    enabled: getMiljø() === Miljø.DevGcp || getMiljø() === Miljø.ProdGcp,
    beforeSend: fjernPersonopplysninger,
    autoSessionTracking: false,
});

type AppProps = {
    navKontor: string | null;
    history: History;
};

export const AppMedRouter: FunctionComponent<AppProps> = (props) => (
    <div id="rekrutteringsbistand-kandidat">
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
    if (import.meta.env.VITE_MOCK) {
        await import('./mock/mock-api');
    }

    ReactDOM.render(<Utviklingsapp />, document.getElementById('utviklingsapp'));
};

if (skalEksporteres) {
    Navspa.eksporter('rekrutteringsbistand-kandidat', AppMedRouter);
} else {
    renderUtviklingsapp();
}
