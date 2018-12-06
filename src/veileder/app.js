import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import ResultatVisning from './result/ResultatVisning';
import ManglerRolle from './sok/error/ManglerRolle';
import '../felles/styles.less';
import './sok/sok.less';
import searchReducer, { FETCH_FEATURE_TOGGLES_BEGIN, HENT_INNLOGGET_VEILEDER, saga } from './sok/searchReducer';
import stillingReducer from './sok/stilling/stillingReducer';
import typeaheadReducer, { typeaheadSaga } from './common/typeahead/typeaheadReducer';
import kompetanseReducer from './sok/kompetanse/kompetanseReducer';
import arbeidserfaringReducer from './sok/arbeidserfaring/arbeidserfaringReducer';
import utdanningReducer from './sok/utdanning/utdanningReducer';
import geografiReducer from './sok/geografi/geografiReducer';
import cvReducer, { cvSaga } from './sok/cv/cvReducer';
import kandidatlisteReducer, { kandidatlisteSaga } from './kandidatlister/kandidatlisteReducer';
import Feilside from './sok/error/Feilside';
import feedbackReducer from './feedback/feedbackReducer';
import { KandidatsokHeader, KandidatlisteHeader } from './common/toppmeny/Toppmeny';
import sprakReducer from './sok/sprak/sprakReducer';
import Listedetaljer from './kandidatlister/Listedetaljer';
import { LOGIN_URL } from './common/fasitProperties';
import forerkortReducer from './sok/forerkort/forerkortReducer';
import VisKandidat from './result/visKandidat/VisKandidat';
import VisKandidatFraLister from './kandidatlister/VisKandidatFraLister';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(combineReducers({
    search: searchReducer,
    typeahead: typeaheadReducer,
    stilling: stillingReducer,
    kompetanse: kompetanseReducer,
    arbeidserfaring: arbeidserfaringReducer,
    utdanning: utdanningReducer,
    forerkort: forerkortReducer,
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
        this.props.fetchFeatureToggles();
        this.props.hentInnloggetVeileder();
    }

    // Have to wait for the error-message to be set in Redux, and redirect to Id-porten
    // if the error is 401 and to a new page if error is 403
    componentWillUpdate(nextProps) {
        const { error } = nextProps;
        if (error && error.status === 401) {
            window.location.href = `${LOGIN_URL}?redirect=${window.location.href}`;
        }
    }

    render() {
        const { error, innloggetVeileder } = this.props;
        if (error && error.status === 403) {
            return <ManglerRolle />;
        } else if (error) {
            return <Feilside />;
        } else if (!innloggetVeileder) {
            return null;
        }
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/kandidater/lister" render={() => <KandidatlisteHeader innloggetVeileder={innloggetVeileder} />} />
                        <Route render={() => <KandidatsokHeader innloggetVeileder={innloggetVeileder} />} />
                    </Switch>
                    <Switch>
                        <Route exact path="/kandidater" component={ResultatVisning} />
                        <Route exact path="/kandidater/stilling/:stillingsId" component={ResultatVisning} />
                        <Route exact path="/kandidater/cv" component={VisKandidat} />
                        <Route exact path="/kandidater/stilling/:stillingsId/cv" component={VisKandidat} />
                        <Route exact path="/kandidater/lister/stilling/:id/detaljer" component={Listedetaljer} />
                        <Route exact path="/kandidater/lister/detaljer/:listeid/cv/:kandidatNr" component={VisKandidatFraLister} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

Sok.defaultProps = {
    error: undefined,
    innloggetVeileder: undefined
};

Sok.propTypes = {
    error: PropTypes.shape({
        status: PropTypes.number
    }),
    innloggetVeileder: PropTypes.string,
    fetchFeatureToggles: PropTypes.func.isRequired,
    hentInnloggetVeileder: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    error: state.search.error,
    innloggetVeileder: state.search.innloggetVeileder
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureToggles: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    hentInnloggetVeileder: () => dispatch({ type: HENT_INNLOGGET_VEILEDER })
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

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

