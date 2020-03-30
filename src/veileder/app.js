import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import ResultatVisning from './result/ResultatVisning';
import '../felles/styles.less';
import './sok/sok.less';
import searchReducer, {
    FETCH_FEATURE_TOGGLES_BEGIN,
    FJERN_ERROR,
    HENT_INNLOGGET_VEILEDER,
    saga,
} from './sok/searchReducer';
import stillingReducer from './sok/stilling/stillingReducer';
import typeaheadReducer, { typeaheadSaga } from './common/typeahead/typeaheadReducer';
import kompetanseReducer from './sok/kompetanse/kompetanseReducer';
import arbeidserfaringReducer from './sok/arbeidserfaring/arbeidserfaringReducer';
import utdanningReducer from './sok/utdanning/utdanningReducer';
import geografiReducer from './sok/geografi/geografiReducer';
import cvReducer, { cvSaga } from './sok/cv/cvReducer';
import kandidatlisteReducer from './kandidatlister/reducer/kandidatlisteReducer.ts';
import feedbackReducer from './feedback/feedbackReducer';
import Toppmeny from './common/toppmeny/Toppmeny';
import sprakReducer from './sok/sprak/sprakReducer';
import KandidatlisteMedStilling from './kandidatlister/KandidatlisteMedStilling';
import KandidatlisteUtenStilling from './kandidatlister/KandidatlisteUtenStilling';
import forerkortReducer from './sok/forerkort/forerkortReducer';
import VisKandidat from './result/visKandidat/VisKandidat';
import ErrorSide from './sok/error/ErrorSide';
import NotFound from './sok/error/NotFound';
import VisKandidatFraLister from './kandidatlister/VisKandidatFraLister';
import innsatsgruppeReducer from './sok/innsatsgruppe/innsatsgruppeReducer';
import tilretteleggingsbehovReducer from './sok/tilretteleggingsbehov/tilretteleggingsbehovReducer';
import fritekstReducer from './sok/fritekst/fritekstReducer';
import Kandidatlister from './kandidatlister/Kandidatlister';
import enhetsregisterReducer, {
    enhetsregisterSaga,
} from './common/typeahead/enhetsregisterReducer';
import navkontorReducer from './sok/navkontor/navkontorReducer';
import hovedmalReducer from './sok/hovedmal/hovedmalReducer';
import { Normaltekst } from 'nav-frontend-typografi';
import { VeilederTabId } from 'pam-frontend-header';
import kandidatlisteSaga from './kandidatlister/reducer/kandidatlisteSaga';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    combineReducers({
        search: searchReducer,
        typeahead: typeaheadReducer,
        fritekst: fritekstReducer,
        stilling: stillingReducer,
        kompetanse: kompetanseReducer,
        arbeidserfaring: arbeidserfaringReducer,
        utdanning: utdanningReducer,
        forerkort: forerkortReducer,
        geografi: geografiReducer,
        sprakReducer,
        innsatsgruppe: innsatsgruppeReducer,
        tilretteleggingsbehov: tilretteleggingsbehovReducer,
        cvReducer,
        kandidatlister: kandidatlisteReducer,
        feedback: feedbackReducer,
        enhetsregister: enhetsregisterReducer,
        navkontorReducer,
        hovedmal: hovedmalReducer,
    }),
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

const HeaderSwitch = ({ innloggetVeileder }) => (
    <Switch>
        <Route
            path="/kandidater/lister"
            render={() => (
                <Toppmeny
                    innloggetVeileder={innloggetVeileder}
                    activeTabID={VeilederTabId.KANDIDATLISTER}
                />
            )}
        />
        <Route
            render={() => (
                <Toppmeny
                    innloggetVeileder={innloggetVeileder}
                    activeTabID={VeilederTabId.KANDIDATSOK}
                />
            )}
        />
    </Switch>
);

HeaderSwitch.defaultProps = {
    innloggetVeileder: '',
};

HeaderSwitch.propTypes = {
    innloggetVeileder: PropTypes.string,
};

class Sok extends React.Component {
    componentDidMount() {
        this.props.fetchFeatureToggles();
        this.props.hentInnloggetVeileder();
    }

    render() {
        const { error, innloggetVeileder, fjernError } = this.props;

        if (error) {
            return (
                <BrowserRouter>
                    <div>
                        <HeaderSwitch innloggetVeileder={innloggetVeileder} />
                        <ErrorSide error={error} fjernError={fjernError} />
                    </div>
                </BrowserRouter>
            );
        }
        return (
            <BrowserRouter>
                <Normaltekst tag="div" className="Application">
                    <div className="Application__main">
                        <HeaderSwitch innloggetVeileder={innloggetVeileder} />
                        <Switch>
                            <Route exact path="/kandidater" component={ResultatVisning} />
                            <Route
                                exact
                                path="/kandidater/kandidatliste/:kandidatlisteId"
                                component={ResultatVisning}
                            />
                            <Route
                                exact
                                path="/kandidater/stilling/:stillingsId"
                                component={ResultatVisning}
                            />
                            <Route exact path="/kandidater/cv" component={VisKandidat} />
                            <Route
                                exact
                                path="/kandidater/kandidatliste/:kandidatlisteId/cv"
                                component={VisKandidat}
                            />
                            <Route
                                exact
                                path="/kandidater/stilling/:stillingsId/cv"
                                component={VisKandidat}
                            />
                            <Route exact path="/kandidater/lister" component={Kandidatlister} />
                            <Route
                                exact
                                path="/kandidater/lister/stilling/:id/detaljer"
                                component={KandidatlisteMedStilling}
                            />
                            <Route
                                exact
                                path="/kandidater/lister/detaljer/:listeid"
                                component={KandidatlisteUtenStilling}
                            />
                            <Route
                                exact
                                path="/kandidater/lister/detaljer/:listeid/cv/:kandidatNr"
                                component={VisKandidatFraLister}
                            />
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </Normaltekst>
            </BrowserRouter>
        );
    }
}

Sok.defaultProps = {
    error: undefined,
    innloggetVeileder: undefined,
};

Sok.propTypes = {
    error: PropTypes.shape({
        status: PropTypes.number,
    }),
    innloggetVeileder: PropTypes.string,
    fetchFeatureToggles: PropTypes.func.isRequired,
    hentInnloggetVeileder: PropTypes.func.isRequired,
    fjernError: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    error: state.search.error,
    innloggetVeileder: state.search.innloggetVeileder,
});

const mapDispatchToProps = dispatch => ({
    fetchFeatureToggles: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    hentInnloggetVeileder: () => dispatch({ type: HENT_INNLOGGET_VEILEDER }),
    fjernError: () => dispatch({ type: FJERN_ERROR }),
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
                <SokApp />
            </div>
        </Provider>
    </div>
);

sagaMiddleware.run(saga);
sagaMiddleware.run(typeaheadSaga);
sagaMiddleware.run(cvSaga);
sagaMiddleware.run(kandidatlisteSaga);
sagaMiddleware.run(enhetsregisterSaga);

ReactDOM.render(<App />, document.getElementById('app'));
