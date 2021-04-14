import React, { ErrorInfo, FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import Navspa from '@navikt/navspa';

import Utviklingsapp from './utviklingsapp/Utviklingsapp';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import store from './reduxStore';
import { Router } from 'react-router-dom';
import { History } from 'history';
import { getMiljø } from './utils/miljøUtils';
import App from './app/App';
import { BrowserClient, Hub } from '@sentry/react';
import './index.less';

const appElement =
    document.getElementById('rekrutteringsbistand-container') ||
    document.getElementById('utviklingsapp');
if (appElement) {
    Modal.setAppElement(appElement);
}

const initSentryClient = () => {
    const client = new BrowserClient({
        dsn: 'https://bd029fab6cab426eb0415b89a7f07124@sentry.gc.nav.no/20',
        environment: getMiljø(),
        release: process.env.REACT_APP_SENTRY_RELEASE || 'unknown',
        enabled: getMiljø() === 'dev-fss' || getMiljø() === 'prod-fss',
        autoSessionTracking: false,
        debug: true,
    });

    return new Hub(client);
};

class SentryErrorBoundary extends React.Component<{ hub: Hub }> {
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.hub.run((currentHub: Hub) => {
            currentHub.withScope((scope) => {
                scope.setExtras(errorInfo as any);
                const eventId = currentHub.captureException(error);
                this.setState({ eventId });
            });
        });
    }

    render = () => this.props.children;
}

export const hub = initSentryClient();

// Alle klassenavn blir prefikset med ".rek-kandidat" i craco-configen, så også koden
// som brukes under utvikling må wrappes i et element med dette klassenavnet.
export const cssScopeForApp = 'rek-kandidat';

type AppProps = {
    history: History;
    navKontor: string | null;
};

export const AppContainer: FunctionComponent<AppProps> = ({ history, navKontor }) => (
    <div id="rekrutteringsbistand-kandidat" className={cssScopeForApp}>
        <SentryErrorBoundary hub={hub}>
            <Provider store={store}>
                <Router history={history}>
                    <App navKontor={navKontor} />
                </Router>
            </Provider>
        </SentryErrorBoundary>
    </div>
);

if (process.env.REACT_APP_EXPORT) {
    Navspa.eksporter('rekrutteringsbistand-kandidat', AppContainer);
} else {
    ReactDOM.render(<Utviklingsapp />, document.getElementById('utviklingsapp'));
}
