import { applyMiddleware, combineReducers, createStore } from 'redux';
import typeaheadReducer, { typeaheadSaga } from './common/typeahead/typeaheadReducer';
import createSagaMiddleware from 'redux-saga';
import cvReducer, { cvSaga } from './kandidatside/cv/reducer/cvReducer';
import enhetsregisterReducer, {
    enhetsregisterSaga,
} from './common/typeahead/enhetsregisterReducer';
import { historikkReducer, historikkSaga } from './kandidatside/historikk/historikkReducer';
import kandidatlisteReducer from './kandidatliste/reducer/kandidatlisteReducer';
import listeoversiktReducer from './listeoversikt/reducer/listeoversiktReducer';
import valgtNavKontorReducer from './navKontor/navKontorReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import searchReducer from './kandidatsøk/reducer/searchReducer';
import kandidatlisteSaga from './kandidatliste/reducer/kandidatlisteSaga';
import listeoversiktSaga from './listeoversikt/reducer/listeoversiktSaga';
import varslingReducer, { varslingSaga } from './common/varsling/varslingReducer';
import kandidatmatchReducer from './automatisk-matching/kandidatmatchReducer';

const sagaMiddleware = createSagaMiddleware();

const søkefiltreReducer = combineReducers({
    typeahead: typeaheadReducer,
});

const store = createStore(
    combineReducers({
        cv: cvReducer,
        enhetsregister: enhetsregisterReducer,
        historikk: historikkReducer,
        kandidatliste: kandidatlisteReducer,
        listeoversikt: listeoversiktReducer,
        navKontor: valgtNavKontorReducer,
        søk: searchReducer,
        søkefilter: søkefiltreReducer,
        varsling: varslingReducer,
        kandidatmatch: kandidatmatchReducer,
    }),
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(typeaheadSaga);
sagaMiddleware.run(cvSaga);
sagaMiddleware.run(historikkSaga);
sagaMiddleware.run(kandidatlisteSaga);
sagaMiddleware.run(enhetsregisterSaga);
sagaMiddleware.run(listeoversiktSaga);
sagaMiddleware.run(varslingSaga);

export default store;
