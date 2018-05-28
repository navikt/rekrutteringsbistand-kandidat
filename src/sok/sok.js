import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import ResultatVisning from './ResultatVisning';
import Kandidatsok from './Kandidatsok';
import ManglerRolleAltinn from './components/ManglerRolleAltinn';
import { LOGIN_URL } from '../common/fasitProperties';
import './../styles.less';
import './sok.less';
import searchReducer, { saga } from './domene';
import { getUrlParameterByName, toUrlParams } from './utils';
import Forside from './components/Forside';
import Tomside from './components/Tomside';

export const getInitialStateFromUrl = (url) => {
    const stateFromUrl = {};
    const stillinger = getUrlParameterByName('stillinger', url);
    const arbeidserfaringer = getUrlParameterByName('arbeidserfaringer', url);
    const kompetanser = getUrlParameterByName('kompetanser', url);
    const utdanninger = getUrlParameterByName('utdanninger', url);
    const geografiList = getUrlParameterByName('geografiList', url);
    const totalErfaring = getUrlParameterByName('totalErfaring', url);
    const utdanningsniva = getUrlParameterByName('utdanningsniva', url);
    const styrkKode = getUrlParameterByName('styrkKode', url);
    const nusKode = getUrlParameterByName('nusKode', url);

    if (stillinger) stateFromUrl.stillinger = stillinger.split('_');
    if (arbeidserfaringer) stateFromUrl.arbeidserfaringer = arbeidserfaringer.split('_');
    if (kompetanser) stateFromUrl.kompetanser = kompetanser.split('_');
    if (utdanninger) stateFromUrl.utdanninger = utdanninger.split('_');
    if (geografiList) stateFromUrl.geografiList = geografiList.split('_');
    if (totalErfaring) stateFromUrl.totalErfaring = totalErfaring;
    if (utdanningsniva) stateFromUrl.utdanningsniva = utdanningsniva.split('_');
    if (styrkKode) stateFromUrl.styrkKode = styrkKode;
    if (nusKode) stateFromUrl.nusKode = nusKode;
    return stateFromUrl;
};

export const createUrlParamsFromState = (state) => {
    const { query } = state;
    const urlQuery = {};
    if (query.stillinger && query.stillinger.length > 0) urlQuery.stillinger = query.stillinger.join('_');
    if (query.arbeidserfaringer && query.arbeidserfaringer.length > 0) urlQuery.arbeidserfaringer = query.arbeidserfaringer.join('_');
    if (query.kompetanser && query.kompetanser.length > 0) urlQuery.kompetanser = query.kompetanser.join('_');
    if (query.utdanninger && query.utdanninger.length > 0) urlQuery.utdanninger = query.utdanninger.join('_');
    if (query.geografiList && query.geografiList.length > 0) urlQuery.geografiList = query.geografiList.join('_');
    if (query.totalErfaring) urlQuery.totalErfaring = query.totalErfaring;
    if (query.utdanningsniva && query.utdanningsniva.length > 0) urlQuery.utdanningsniva = query.utdanningsniva.join('_');
    if (query.styrkKode) urlQuery.styrkKode = query.styrkKode;
    if (query.nusKode) urlQuery.nusKode = query.nusKode;
    return toUrlParams(urlQuery);
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(searchReducer, composeWithDevTools(
    applyMiddleware(sagaMiddleware)));


store.subscribe(() => {
    if (store.getState().isSearching) {
        const urlParams = createUrlParamsFromState(store.getState());
        if (urlParams && urlParams.length > 0) {
            window.history.replaceState('', '', `?${urlParams}`);
        } else {
            window.history.replaceState('', '', window.location.pathname);
        }
    }
});

/*
Begin class Sok
 */
class Sok extends React.Component {
    // Have to wait for the error-message to be set in Redux, and redirect if the error is 401
    componentWillUpdate(nextProps) {
        const { error } = nextProps;
        if (error && error.status === 401) {
            this.redirectToLogin();
        } else if (error && error.status === 403) {
            window.location.href = '/pam-kandidatsok/altinn';
        }
    }

    // Redirect to login with Id-Porten
    redirectToLogin = () => {
        window.location.href = `${LOGIN_URL}?redirect=${window.location.href}`;
    };

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/pam-kandidatsok" render={() => <Forside />} />
                    <Route exact path="/pam-kandidatsok/sok" render={() => <Kandidatsok urlParams={getInitialStateFromUrl(window.location.href)} />} />
                    <Route exact path="/pam-kandidatsok/resultat" render={() => <ResultatVisning urlParams={getInitialStateFromUrl(window.location.href)} />} />
                    <Route exact path="/pam-kandidatsok/altinn" render={() => <ManglerRolleAltinn />} />
                    <Route exact path="/pam-kandidatsok/annonse" render={() => <Tomside />} />
                    <Route exact path="/pam-kandidatsok/soknader" render={() => <Tomside />} />
                    <Route exact path="/pam-kandidatsok/fastesok" render={() => <Tomside />} />
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => ({
    error: state.error
});
/*
End class Sok
 */

const SokApp = connect(mapStateToProps)(Sok);

const App = () => (
    <div>
        <Provider store={store}>
            <SokApp />
        </Provider>
    </div>
);

sagaMiddleware.run(saga);

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

