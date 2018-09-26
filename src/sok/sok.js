import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import ResultatVisning from '../result/ResultatVisning';
import ManglerRolleAltinn from './error/ManglerRolleAltinn';
import { BACKEND_OPPE, LOGIN_URL } from '../common/fasitProperties';
import './../styles.less';
import './sok.less';
import searchReducer, { FETCH_FEATURE_TOGGLES_BEGIN, saga } from './searchReducer';
import stillingReducer from './stilling/stillingReducer';
import typeaheadReducer, { typeaheadSaga } from '../common/typeahead/typeaheadReducer';
import kompetanseReducer from './kompetanse/kompetanseReducer';
import arbeidserfaringReducer from './arbeidserfaring/arbeidserfaringReducer';
import utdanningReducer from './utdanning/utdanningReducer';
import geografiReducer from './geografi/geografiReducer';
import cvReducer, { cvSaga } from './cv/cvReducer';
import kandidatlisteReducer, { kandidatlisteSaga } from '../kandidatlister/kandidatlisteReducer';
import Feilside from './error/Feilside';
import feedbackReducer from '../feedback/feedbackReducer';
import Toppmeny from '../common/toppmeny/Toppmeny';
import sprakReducer from './sprak/sprakReducer';
import NedeSide from './error/NedeSide';
import Kandidatlister from '../kandidatlister/Kandidatlister';
import OpprettKandidatliste from '../kandidatlister/OpprettKandidatliste';
import KandidatlisteDetalj from '../kandidatlister/KandidatlisteDetalj';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(combineReducers({
    search: searchReducer,
    typeahead: typeaheadReducer,
    stilling: stillingReducer,
    kompetanse: kompetanseReducer,
    arbeidserfaring: arbeidserfaringReducer,
    utdanning: utdanningReducer,
    geografi: geografiReducer,
    sprakReducer,
    cvReducer,
    kandidatlister: kandidatlisteReducer,
    feedback: feedbackReducer
}), composeWithDevTools(applyMiddleware(sagaMiddleware)));


/*
Begin class Sok
 */
class Sok extends React.Component {
    componentDidMount() {
        this.props.fetchFeatureTogglesOgInitialSearch();
    }

    // Have to wait for the error-message to be set in Redux, and redirect to Id-porten
    // if the error is 401 and to a new page if error is 403
    componentWillUpdate(nextProps) {
        const { error } = nextProps;
        if (error && error.status === 401) {
            this.redirectToLogin();
        } else if (error && error.status === 403) {
            window.location.href = '/pam-kandidatsok/altinn';
        } else if (error) {
            window.location.href = '/pam-kandidatsok/feilside';
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
                    <Route exact path="/pam-kandidatsok" component={ResultatVisning} />
                    <Route exact path="/pam-kandidatsok/lister" component={Kandidatlister} />
                    <Route exact path="/pam-kandidatsok/lister/vis" component={KandidatlisteDetalj} />
                    <Route exact path="/pam-kandidatsok/lister/opprett" component={OpprettKandidatliste} />
                    <Route exact path="/pam-kandidatsok/altinn" component={ManglerRolleAltinn} />
                    <Route exact path="/pam-kandidatsok/feilside" component={Feilside} />
                </Switch>
            </BrowserRouter>
        );
    }
}

Sok.defaultProps = {
    error: undefined
};

Sok.propTypes = {
    error: PropTypes.shape({
        status: PropTypes.number
    }),
    fetchFeatureTogglesOgInitialSearch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    error: state.search.error
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureTogglesOgInitialSearch: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN })
});
/*
End class Sok
 */

const SokApp = connect(mapStateToProps, mapDispatchToProps)(Sok);

// eslint-disable-next-line no-unused-vars
const App = () => (
    <div>
        <Provider store={store}>
            <div>
                <Toppmeny />
                <SokApp />
            </div>
        </Provider>
    </div>
);

const MidlertidigNede = () => (
    <div>
        <Toppmeny loggUtSynlig={false} />
        <NedeSide />
    </div>
);

sagaMiddleware.run(saga);
sagaMiddleware.run(typeaheadSaga);
sagaMiddleware.run(cvSaga);
sagaMiddleware.run(kandidatlisteSaga);

const Root = () => (
    BACKEND_OPPE ? <App /> : <MidlertidigNede />
);

ReactDOM.render(
    <Root />,
    document.getElementById('app')
);

