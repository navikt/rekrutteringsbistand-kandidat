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
    LUKK_ALLE_SOKEPANEL,
    saga,
} from './sok/searchReducer';
import stillingReducer from './sok/stilling/stillingReducer';
import typeaheadReducer, { typeaheadSaga } from './common/typeahead/typeaheadReducer';
import kompetanseReducer from './sok/kompetanse/kompetanseReducer';
import arbeidserfaringReducer from './sok/arbeidserfaring/arbeidserfaringReducer';
import utdanningReducer from './sok/utdanning/utdanningReducer';
import geografiReducer from './sok/geografi/geografiReducer';
import cvReducer, { cvSaga } from './cv/reducer/cvReducer.ts';
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
import permitteringReducer from './sok/permittering/permitteringReducer.ts';
import fritekstReducer from './sok/fritekst/fritekstReducer';
import Kandidatlister from './kandidatlister/Kandidatlister';
import enhetsregisterReducer, {
    enhetsregisterSaga,
} from './common/typeahead/enhetsregisterReducer';
import navkontorReducer from './sok/navkontor/navkontorReducer';
import hovedmalReducer from './sok/hovedmal/hovedmalReducer';
import { Normaltekst } from 'nav-frontend-typografi';
import { VeilederTabId } from 'pam-frontend-header';
import Dekoratør from './dekoratør/Dekoratør';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import kandidatlisteSaga from './kandidatlister/reducer/kandidatlisteSaga';
import { SET_SCROLL_POSITION, SET_STATE, INITIAL_SEARCH_BEGIN } from './sok/searchReducer';
import oppstartstidspunktReducer from './sok/oppstardstidspunkt/oppstartstidspunktReducer';

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
        oppstartstidspunkter: oppstartstidspunktReducer,
        cvReducer,
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

export const hentQueryUtenKriterier = (harHentetStilling) => ({
    fritekst: '',
    stillinger: [],
    arbeidserfaringer: [],
    utdanninger: [],
    kompetanser: [],
    geografiList: [],
    geografiListKomplett: [],
    totalErfaring: [],
    utdanningsniva: [],
    sprak: [],
    kvalifiseringsgruppeKoder: [],
    maaBoInnenforGeografi: false,
    harHentetStilling: harHentetStilling,
});

class Sok extends React.Component {
    componentDidMount() {
        this.props.fetchFeatureToggles();
        this.props.hentInnloggetVeileder();
    }

    navigeringKlikk = () => {
        this.props.setScrollPosition(0);
        this.props.lukkAlleSokepanel();
        this.props.resetQuery(hentQueryUtenKriterier(false));
        this.props.initialSearch();
    };

    render() {
        const { error, innloggetVeileder, fjernError, nyDekoratør } = this.props;

        const header = nyDekoratør ? (
            <>
                <Dekoratør />
                <div onClick={this.navigeringKlikk}>
                    <Navigeringsmeny />
                </div>
            </>
        ) : (
            <div onClick={this.navigeringKlikk}>
                <HeaderSwitch innloggetVeileder={innloggetVeileder} />
            </div>
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
    nyDekoratør: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    error: state.search.error,
    innloggetVeileder: state.search.innloggetVeileder,
    nyDekoratør: state.search.featureToggles['ny-dekorator'],
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureToggles: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    hentInnloggetVeileder: () => dispatch({ type: HENT_INNLOGGET_VEILEDER }),
    fjernError: () => dispatch({ type: FJERN_ERROR }),
    setScrollPosition: (scrollPosisjon) =>
        dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon }),
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    initialSearch: () => {
        dispatch({ type: INITIAL_SEARCH_BEGIN });
    },
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
