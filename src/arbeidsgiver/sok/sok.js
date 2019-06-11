import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Footer } from 'pam-frontend-footer';
import 'pam-frontend-footer/dist/style.css';
import ResultatVisning from '../result/ResultatVisning';
import { LOGIN_URL, CONTEXT_ROOT, USE_JANZZ } from '../common/fasitProperties';
import '../../felles/styles.less';
import './sok.less';
import searchReducer, { FETCH_FEATURE_TOGGLES_BEGIN, saga } from './searchReducer';
import stillingReducer from './stilling/stillingReducer';
import typeaheadReducer, { typeaheadSaga } from '../common/typeahead/typeaheadReducer';
import kompetanseReducer from './kompetanse/kompetanseReducer';
import samtykkeReducer, { samtykkeSaga } from '../samtykke/samtykkeReducer';
import arbeidserfaringReducer from './arbeidserfaring/arbeidserfaringReducer';
import utdanningReducer from './utdanning/utdanningReducer';
import geografiReducer from './geografi/geografiReducer';
import cvReducer, { cvSaga } from './cv/cvReducer';
import kandidatlisteDetaljerReducer, { kandidatlisteDetaljerSaga } from '../kandidatlisteDetaljer/kandidatlisteReducer.ts';
import kandidatlisterReducer, { kandidatlisterSaga } from '../kandidatlister/kandidatlisteReducer.ts';
import Feilside from './error/Feilside';
import arbeidsgivervelgerReducer, {
    HENT_ARBEIDSGIVERE_BEGIN,
    mineArbeidsgivereSaga
} from '../arbeidsgiver/arbeidsgiverReducer';
import { KandidatlisteHeader, KandidatsokHeader } from '../common/toppmeny/Toppmeny';
import Feedback from '../feedback/Feedback';
import sprakReducer from './sprak/sprakReducer';
import sertifikatReducer from './sertifikat/sertifikatReducer';
import VisKandidat from '../result/visKandidat/VisKandidat';
import Kandidatlister from '../kandidatlister/Kandidatlister';
import VelgArbeidsgiver from '../arbeidsgiver/VelgArbeidsgiver';
import KandidatlisteDetaljWrapper from '../kandidatlisteDetaljer/KandidatlisteDetaljWrapper.tsx';
import forerkortReducer from './forerkort/forerkortReducer';
import VisKandidatFraLister from '../kandidatlisteDetaljer/VisKandidatFraLister';
import SamtykkeSide from '../samtykke/SamtykkeSide';
import fritekstReducer from './fritekst/fritekstReducer';
import SesjonUtgaarModalWrapper from '../common/modal/SesjonUtgaarModalWrapper';

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
    sertifikatReducer,
    cvReducer,
    kandidatlisteDetaljer: kandidatlisteDetaljerReducer,
    kandidatlister: kandidatlisterReducer,
    mineArbeidsgivere: arbeidsgivervelgerReducer,
    samtykke: samtykkeReducer,
    fritekst: fritekstReducer
}), composeWithDevTools(applyMiddleware(sagaMiddleware)));

const Sok = ({
    arbeidsgivere,
    error,
    fetchArbeidsgivere,
    fetchFeatureTogglesOgInitialSearch,
    harSamtykket,
    isFetchingArbeidsgivere,
    valgtArbeidsgiverId
}) => {
    useEffect(() => {
        fetchFeatureTogglesOgInitialSearch();
        fetchArbeidsgivere();
    }, []);

    useEffect(() => {
        if (error && error.status === 401) {
            window.location.href = `${LOGIN_URL}&redirect=${window.location.href}`;
        }
    }, [error]);

    useEffect(() => {
        localStorage.setItem('innloggetBrukerKontekst', 'arbeidsgiver');
    }, []);

    if (harSamtykket !== undefined && !harSamtykket) {
        return <SamtykkeSide />;
    }

    if (error) {
        return <Feilside error={error} />;
    }

    if (isFetchingArbeidsgivere) {
        return (
            <div className="text-center">
                <NavFrontendSpinner type="L" />
            </div>
        );
    }

    if (arbeidsgivere.length > 1 && valgtArbeidsgiverId === undefined) {
        return <VelgArbeidsgiver />;
    }

    return (
        <SesjonUtgaarModalWrapper>
            <BrowserRouter>
                <div className="Application">
                    <div className="Application__main">
                        <Switch>
                            <Route path={`/${CONTEXT_ROOT}/lister`} component={KandidatlisteHeader} />
                            <Route component={KandidatsokHeader} />
                        </Switch>
                        <Switch>
                            <Route exact path={`/${CONTEXT_ROOT}`} component={ResultatVisning} />
                            <Route exact path={`/${CONTEXT_ROOT}/cv`} component={VisKandidat} />
                            <Route exact path={`/${CONTEXT_ROOT}/lister`} component={Kandidatlister} />
                            <Route exact path={`/${CONTEXT_ROOT}/lister/detaljer/:listeid`} component={KandidatlisteDetaljWrapper} />
                            <Route exact path={`/${CONTEXT_ROOT}/lister/detaljer/:listeid/cv/:kandidatnr`} component={VisKandidatFraLister} />
                            <Route exact path={`/${CONTEXT_ROOT}/feilside`} component={Feilside} />
                        </Switch>
                    </div>
                    {!USE_JANZZ && <Footer /> }
                </div>
            </BrowserRouter>
        </SesjonUtgaarModalWrapper>
    );
};

Sok.defaultProps = {
    error: undefined,
    valgtArbeidsgiverId: undefined,
    harSamtykket: undefined
};

Sok.propTypes = {
    error: PropTypes.shape({
        status: PropTypes.number
    }),
    harSamtykket: PropTypes.bool,
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
    error: state.mineArbeidsgivere.error,
    harSamtykket: state.samtykke.harSamtykket,
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId,
    isFetchingArbeidsgivere: state.mineArbeidsgivere.isFetchingArbeidsgivere
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureTogglesOgInitialSearch: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    fetchArbeidsgivere: () => dispatch({ type: HENT_ARBEIDSGIVERE_BEGIN })
});

const SokApp = connect(mapStateToProps, mapDispatchToProps)(Sok);

const App = () => (
    <div>
        <Provider store={store}>
            <div>
                <SokApp />
                <Feedback />
            </div>
        </Provider>
    </div>
);

sagaMiddleware.run(saga);
sagaMiddleware.run(typeaheadSaga);
sagaMiddleware.run(cvSaga);
sagaMiddleware.run(samtykkeSaga);
sagaMiddleware.run(kandidatlisteDetaljerSaga);
sagaMiddleware.run(kandidatlisterSaga);
sagaMiddleware.run(mineArbeidsgivereSaga);

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
