import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Kandidatsok from './Kandidatsok';
import ShowCv from './ShowCv';
import { LOGIN_URL } from '../common/fasitProperties';
import './../styles.less';
import './sok.less';
import searchReducer, { saga } from './domene';
import { getUrlParameterByName, toUrlParams } from './utils';

export const getInitialStateFromUrl = (url) => {
    const stateFromUrl = {};
    const yrkeserfaringer = getUrlParameterByName('yrkeserfaringer', url);
    const kompetanser = getUrlParameterByName('kompetanser', url);
    const utdanning = getUrlParameterByName('utdanning', url);
    const styrkKode = getUrlParameterByName('styrkKode', url);
    const nusKode = getUrlParameterByName('nusKode', url);

    if (yrkeserfaringer) stateFromUrl.yrkeserfaringer = yrkeserfaringer.split('_');
    if (kompetanser) stateFromUrl.kompetanser = kompetanser.split('_');
    if (utdanning) stateFromUrl.utdanning = utdanning;
    if (styrkKode) stateFromUrl.styrkKode = styrkKode;
    if (nusKode) stateFromUrl.nusKode = nusKode;
    return stateFromUrl;
};

export const createUrlParamsFromState = (state) => {
    const { query } = state;
    const urlQuery = {};
    if (query.yrkeserfaringer && query.yrkeserfaringer.length > 0) urlQuery.yrkeserfaringer = query.yrkeserfaringer.join('_');
    if (query.kompetanser && query.kompetanser.length > 0) urlQuery.kompetanser = query.kompetanser.join('_');
    if (query.utdanning) urlQuery.utdanning = query.utdanning;
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
                    <Route exact path="/pam-kandidatsok/showcv/:id" render={(props) => <ShowCv {...props} />} />
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

