import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import ResultatVisning from '../result/ResultatVisning';
import ManglerRolleAltinn from './error/ManglerRolleAltinn';
import { BACKEND_OPPE, LOGIN_URL, CONTEXT_ROOT } from '../common/fasitProperties';
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
import arbeidsgivervelgerReducer, {
    HENT_ARBEIDSGIVERE_BEGIN,
    mineArbeidsgivereSaga
} from '../arbeidsgiver/arbeidsgiverReducer';
import Toppmeny from '../common/toppmeny/Toppmeny';
import Feedback from '../feedback/Feedback';
import sprakReducer from './sprak/sprakReducer';
import NedeSide from './error/NedeSide';
import VisKandidat from '../result/visKandidat/VisKandidat';
import Kandidatlister from '../kandidatlister/Kandidatlister';
import OpprettKandidatliste from '../kandidatlister/OpprettKandidatliste';
import VelgArbeidsgiver from '../arbeidsgiver/VelgArbeidsgiver';
import KandidatlisteDetalj from '../kandidatlister/KandidatlisteDetalj';
import forerkortReducer from './forerkort/forerkortReducer';
import VisKandidatFraLister from '../kandidatlister/VisKandidatFraLister';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(combineReducers({
    search: searchReducer,
    typeahead: typeaheadReducer,
    stilling: stillingReducer,
    kompetanse: kompetanseReducer,
    arbeidserfaring: arbeidserfaringReducer,
    utdanning: utdanningReducer,
    geografi: geografiReducer,
    forerkort: forerkortReducer,
    sprakReducer,
    cvReducer,
    kandidatlister: kandidatlisteReducer,
    mineArbeidsgivere: arbeidsgivervelgerReducer
}), composeWithDevTools(applyMiddleware(sagaMiddleware)));


/*
Begin class Sok
 */
class Sok extends React.Component {

    refreshTokenCallbackId;

    componentDidMount() {
        this.props.fetchFeatureTogglesOgInitialSearch();
        this.props.fetchArbeidsgivere();
    }

    componentWillReceiveProps() {
        console.log("sok props");
    }

    // Have to wait for the error-message to be set in Redux, and redirect to Id-porten
    // if the error is 401 and to a new page if error is 403
    componentWillUpdate(nextProps) {
        console.log("cookie");
        const { error } = nextProps;

        const cookie = document.cookie;
        if (!cookie) {
            this.clearLoginState();
            return this.redirectToLogin();
        }
        const token = cookie.split(';').filter((v) => v.indexOf('-idtoken') !== -1).pop().split('-idtoken=').pop();
        
        const currentExpiration = sessionStorage.getItem('token_expire');
        const isExpired = currentExpiration && currentExpiration < Date.now();
        console.log("token", token);
        console.log("currentExpiration", currentExpiration);
        if (token && !currentExpiration) {
            sessionStorage.setItem('token_expire', Date.now() + 10000);
            this.refreshToken(10000);
        } else if (token && isExpired) {
            this.refreshToken(0);
        } else if (error && error.status === 401) {
            // do something
        } else if (error && error.status === 403) {
            window.location.href = `/${CONTEXT_ROOT}/altinn`;
        }
    }
    clearLoginState = () => {
        sessionStorage.removeItem('token_expire');
    }

    refreshToken = (omAntallMs) => {
        console.log("redirecting in " + omAntallMs);
        this.refreshTokenCallbackId = setTimeout(() => {
            this.clearLoginState();
            this.redirectToLogin();
        }, omAntallMs);
    }

    // Redirect to login with Id-Porten
    redirectToLogin = () => {
        console.log("==> LOGIN!");
        window.location.href = `${LOGIN_URL}&redirect=${window.location.href}`;
    };

    render() {
        if (this.props.error) {
            return <Feilside />;
        } else if (this.props.isFetchingArbeidsgivere) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        } else if (this.props.arbeidsgivere.length > 1 && this.props.valgtArbeidsgiverId === undefined) {
            return <VelgArbeidsgiver />;
        }
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path={`/${CONTEXT_ROOT}`} component={ResultatVisning} />
                    <Route exact path={`/${CONTEXT_ROOT}/cv`} component={VisKandidat} />
                    <Route exact path={`/${CONTEXT_ROOT}/lister`} component={Kandidatlister} />
                    <Route exact path={`/${CONTEXT_ROOT}/lister/detaljer/:listeid`} component={KandidatlisteDetalj} />
                    <Route exact path={`/${CONTEXT_ROOT}/lister/detaljer/:listeid/cv`} component={VisKandidatFraLister} />
                    <Route exact path={`/${CONTEXT_ROOT}/lister/opprett`} component={OpprettKandidatliste} />
                    <Route exact path={`/${CONTEXT_ROOT}/altinn`} component={ManglerRolleAltinn} />
                    <Route exact path={`/${CONTEXT_ROOT}/feilside`} component={Feilside} />
                </Switch>
            </BrowserRouter>
        );
    }
}

Sok.defaultProps = {
    error: undefined,
    valgtArbeidsgiverId: undefined
};

Sok.propTypes = {
    error: PropTypes.shape({
        status: PropTypes.number
    }),
    fetchFeatureTogglesOgInitialSearch: PropTypes.func.isRequired,
    arbeidsgivere: PropTypes.arrayOf(PropTypes.shape({
        orgnr: PropTypes.string,
        orgnavn: PropTypes.string
    })).isRequired,
    valgtArbeidsgiverId: PropTypes.string,
    fetchArbeidsgivere: PropTypes.func.isRequired,
    isFetchingArbeidsgivere: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    error: state.search.error,
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId,
    isFetchingArbeidsgivere: state.mineArbeidsgivere.isFetchingArbeidsgivere
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureTogglesOgInitialSearch: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    fetchArbeidsgivere: () => dispatch({ type: HENT_ARBEIDSGIVERE_BEGIN })
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
                <Feedback />
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
sagaMiddleware.run(mineArbeidsgivereSaga);

const Root = () => (
    BACKEND_OPPE ? <App /> : <MidlertidigNede />
);

ReactDOM.render(
    <Root />,
    document.getElementById('app')
);

