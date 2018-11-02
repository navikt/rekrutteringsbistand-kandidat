import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import ResultatVisning from '../result/ResultatVisning';
import ManglerRolle from './error/ManglerRolle';
import './../../felles/styles.less';
import './sok.less';
import searchReducer, { FETCH_FEATURE_TOGGLES_BEGIN, saga } from './searchReducer';
import stillingReducer from './stilling/stillingReducer';
import typeaheadReducer, { typeaheadSaga } from '../common/typeahead/typeaheadReducer';
import kompetanseReducer from './kompetanse/kompetanseReducer';
import arbeidserfaringReducer from './arbeidserfaring/arbeidserfaringReducer';
import utdanningReducer from './utdanning/utdanningReducer';
import geografiReducer from './geografi/geografiReducer';
import cvReducer, { cvSaga } from './cv/cvReducer';
import Feilside from './error/Feilside';
import feedbackReducer from '../feedback/feedbackReducer';
import Toppmeny from '../common/toppmeny/Toppmeny';
import sprakReducer from './sprak/sprakReducer';
import FeilsideIkkeInnlogget from './error/FeilsideIkkeInnlogget';
import { LOGIN_URL } from '../common/fasitProperties';

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
            if (LOGIN_URL && LOGIN_URL.includes('local/cookie')) {
                window.location.href = `${LOGIN_URL}?redirect=${window.location.href}`;
            } else { window.location.href = '/pam-kandidatsok-veileder/ikke-innlogget'; }
        } else if (error && error.status === 403) {
            window.location.href = '/pam-kandidatsok-veileder/mangler-tilgang';
        } else if (error) {
            window.location.href = '/pam-kandidatsok-veileder/feilside';
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/pam-kandidatsok-veileder" component={ResultatVisning} />
                    <Route exact path="/pam-kandidatsok-veileder/ikke-innlogget" component={FeilsideIkkeInnlogget} />
                    <Route exact path="/pam-kandidatsok-veileder/mangler-tilgang" component={ManglerRolle} />
                    <Route exact path="/pam-kandidatsok-veileder/feilside" component={Feilside} />
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

sagaMiddleware.run(saga);
sagaMiddleware.run(typeaheadSaga);
sagaMiddleware.run(cvSaga);

const Root = () => (
    <App />
);

ReactDOM.render(
    <Root />,
    document.getElementById('app')
);

