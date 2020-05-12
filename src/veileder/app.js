import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import '../felles/styles.less';
import './sok/sok.less';
import {
    FETCH_FEATURE_TOGGLES_BEGIN,
    FJERN_ERROR,
    LUKK_ALLE_SOKEPANEL,
    saga,
    SET_STATE,
} from './sok/searchReducer';
import stillingReducer from './sok/stilling/stillingReducer';
import typeaheadReducer, { typeaheadSaga } from './common/typeahead/typeaheadReducer';
import kompetanseReducer from './sok/kompetanse/kompetanseReducer';
import arbeidserfaringReducer from './sok/arbeidserfaring/arbeidserfaringReducer';
import utdanningReducer from './sok/utdanning/utdanningReducer';
import geografiReducer from './sok/geografi/geografiReducer';
import cvReducer, { cvSaga } from './cv/reducer/cvReducer.ts';
import midlertidigUtilgjengeligReducer, {
    midlertidigUtilgjengeligSaga,
} from './cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer.ts';
import kandidatlisteReducer from './kandidatlister/reducer/kandidatlisteReducer.ts';
import feedbackReducer from './feedback/feedbackReducer';
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
import permitteringReducer from './sok/permittering/permitteringReducer.ts';
import fritekstReducer from './sok/fritekst/fritekstReducer';
import Kandidatlister from './kandidatlister/Kandidatlister';
import enhetsregisterReducer, {
    enhetsregisterSaga,
} from './common/typeahead/enhetsregisterReducer';
import navkontorReducer from './sok/navkontor/navkontorReducer';
import hovedmalReducer from './sok/hovedmal/hovedmalReducer';
import { Normaltekst } from 'nav-frontend-typografi';
import Dekoratør from './dekoratør/Dekoratør';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import kandidatlisteSaga from './kandidatlister/reducer/kandidatlisteSaga';
import tilgjengelighetReducer from './sok/tilgjengelighet/tilgjengelighetReducer';
import { searchReducer } from './sok/typedSearchReducer';
import { logEvent } from './amplitude/amplitude';
import { TilToppenKnapp } from './common/tilToppenKnapp/TilToppenKnapp';
import KandidatsøkFraKandidatliste from './result/KandidatsøkFraKandidatliste';
import DefaultKandidatsøk from './result/DefaultKandidatsøk';
import KandidatsøkFraStilling from './result/KandidatsøkFraStilling';

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
        permittering: permitteringReducer,
        tilgjengelighet: tilgjengelighetReducer,
        cv: cvReducer,
        midlertidigUtilgjengelig: midlertidigUtilgjengeligReducer,
        kandidatlister: kandidatlisteReducer,
        feedback: feedbackReducer,
        enhetsregister: enhetsregisterReducer,
        navkontorReducer,
        hovedmal: hovedmalReducer,
        navKontor: navkontorReducer,
    }),
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

export const reduxStore = store;

class Sok extends React.Component {
    componentDidMount() {
        this.props.fetchFeatureToggles();
        logEvent('app', 'åpne', {
            skjermbredde: window.screen.width,
        });
    }

    render() {
        const { error, fjernError } = this.props;

        const header = (
            <>
                <Dekoratør />
                <Navigeringsmeny />
            </>
        );

        if (error) {
            return (
                <BrowserRouter>
                    <div>
                        {header}
                        <ErrorSide error={error} fjernError={fjernError} />
                    </div>
                </BrowserRouter>
            );
        }
        return (
            <BrowserRouter>
                <Normaltekst tag="div" className="Application">
                    <div className="Application__main">
                        {header}
                        <Switch>
                            <Route exact path="/kandidater" component={DefaultKandidatsøk} />
                            <Route
                                exact
                                path="/kandidater/kandidatliste/:kandidatlisteId"
                                component={KandidatsøkFraKandidatliste}
                            />
                            <Route
                                exact
                                path="/kandidater/stilling/:stillingsId"
                                component={KandidatsøkFraStilling}
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
                <TilToppenKnapp />
            </BrowserRouter>
        );
    }
}

Sok.defaultProps = {
    error: undefined,
};

Sok.propTypes = {
    error: PropTypes.shape({
        status: PropTypes.number,
    }),
    fetchFeatureToggles: PropTypes.func.isRequired,
    fjernError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    error: state.search.error,
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureToggles: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    fjernError: () => dispatch({ type: FJERN_ERROR }),
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
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
sagaMiddleware.run(midlertidigUtilgjengeligSaga);
sagaMiddleware.run(kandidatlisteSaga);
sagaMiddleware.run(enhetsregisterSaga);

ReactDOM.render(<App />, document.getElementById('app'));
