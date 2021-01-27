import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import Navspa from '@navikt/navspa';

import { AppProps, Main } from './veileder/App';
import Utviklingsapp from './utviklingsapp/Utviklingsapp';

// Alle klassenavn blir prefikset med ".rek-kandidat" i craco-configen, så også koden
// som brukes under utvikling må wrappes i et element med dette klassenavnet.
export const cssScopeForApp = 'rek-kandidat';

const AppMedCssScope: FunctionComponent<AppProps> = (props) => (
    <div className={cssScopeForApp}>
        <Main {...props} />
    </div>
);

if (process.env.REACT_APP_EXPORT) {
    Navspa.eksporter('rekrutteringsbistand-kandidat', AppMedCssScope);
} else {
    ReactDOM.render(<Utviklingsapp />, document.getElementById('utviklingsapp'));
}
