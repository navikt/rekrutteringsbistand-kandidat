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

export const getInitialStateFromUrl = (url) => {
    const stateFromUrl = {};
    const yrkeserfaringer = getUrlParameterByName('yrkeserfaringer', url);
    const arbeidserfaringer = getUrlParameterByName('arbeidserfaringer', url);
    const kompetanser = getUrlParameterByName('kompetanser', url);
    const utdanninger = getUrlParameterByName('utdanninger', url);
    const sprakList = getUrlParameterByName('sprakList', url);
    const sertifikater = getUrlParameterByName('sertifikater', url);
    const geografiList = getUrlParameterByName('geografiList', url);
    const styrkKode = getUrlParameterByName('styrkKode', url);
    const nusKode = getUrlParameterByName('nusKode', url);

    if (yrkeserfaringer) stateFromUrl.yrkeserfaringer = yrkeserfaringer.split('_');
    if (arbeidserfaringer) stateFromUrl.arbeidserfaringer = arbeidserfaringer.split('_');
    if (kompetanser) stateFromUrl.kompetanser = kompetanser.split('_');
    if (utdanninger) stateFromUrl.utdanninger = utdanninger.split('_');
    if (sprakList) stateFromUrl.sprakList = sprakList.split('_');
    if (sertifikater) stateFromUrl.sertifikater = sertifikater.split('_');
    if (geografiList) stateFromUrl.geografiList = geografiList.split('_');
    if (styrkKode) stateFromUrl.styrkKode = styrkKode;
    if (nusKode) stateFromUrl.nusKode = nusKode;
    return stateFromUrl;
};

export const createUrlParamsFromState = (state) => {
    const { query } = state;
    const urlQuery = {};
    if (query.yrkeserfaringer && query.yrkeserfaringer.length > 0) urlQuery.yrkeserfaringer = query.yrkeserfaringer.join('_');
    if (query.arbeidserfaringer && query.arbeidserfaringer.length > 0) urlQuery.arbeidserfaringer = query.arbeidserfaringer.join('_');
    if (query.kompetanser && query.kompetanser.length > 0) urlQuery.kompetanser = query.kompetanser.join('_');
    if (query.utdanninger && query.utdanninger.length > 0) urlQuery.utdanninger = query.utdanninger.join('_');
    if (query.sprakList && query.sprakList.length > 0) urlQuery.sprakList = query.sprakList.join('_');
    if (query.sertifikater && query.sertifikater.length > 0) urlQuery.sertifikater = query.sertifikater.join('_');
    if (query.geografiList && query.geografiList.length > 0) urlQuery.geografiList = query.geografiList.join('_');
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
                    <Route exact path="/pam-kandidatsok" render={() => <Kandidatsok urlParams={getInitialStateFromUrl(window.location.href)} />} />
                    <Route exact path="/pam-kandidatsok/resultat" render={() => <ResultatVisning urlParams={getInitialStateFromUrl(window.location.href)} />} />
                    <Route exact path="/pam-kandidatsok/altinn" render={() => <ManglerRolleAltinn />} />
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

