import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { Main } from './veileder/App';
import eksporterApp from './eksporterApp';
import Utviklingsapp from './utviklingsapp/Utviklingsapp';

const skalEksporteres = process.env.REACT_APP_EXPORT || process.env.NODE_ENV === 'production';

// Alle klassenavn blir prefikset med ".rek-kandidat" i craco-configen, så også koden
// som brukes under utvikling må wrappes i et element med dette klassenavnet.
export const cssScopeForApp = 'rek-kandidat';

const AppMedCssScope: FunctionComponent = (props: any) => (
    <div className={cssScopeForApp}>
        <Main {...props} />
    </div>
);

if (skalEksporteres) {
    eksporterApp('rekrutteringsbistand-kandidat', AppMedCssScope);
} else {
    ReactDOM.render(<Utviklingsapp />, document.getElementById('utviklingsapp'));
}
