import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import cvReducer, { cvSaga } from './cv/reducer/cvReducer';
import enhetsregisterReducer, {
    enhetsregisterSaga,
} from './komponenter/typeahead/enhetsregisterReducer';
import { historikkReducer, historikkSaga } from './historikk/historikkReducer';
import kandidatlisteReducer from './kandidatliste/reducer/kandidatlisteReducer';
import listeoversiktReducer from './kandidatlisteoversikt/reducer/listeoversiktReducer';
import valgtNavKontorReducer from './navKontor/navKontorReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import searchReducer from './kandidatsøk/reducer/searchReducer';
import kandidatlisteSaga from './kandidatliste/reducer/kandidatlisteSaga';
import listeoversiktSaga from './kandidatlisteoversikt/reducer/listeoversiktSaga';
import varslingReducer, { varslingSaga } from './varsling/varslingReducer';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    combineReducers({
        cv: cvReducer,
        enhetsregister: enhetsregisterReducer,
        historikk: historikkReducer,
        kandidatliste: kandidatlisteReducer,
        listeoversikt: listeoversiktReducer,
        navKontor: valgtNavKontorReducer,
        søk: searchReducer,
        varsling: varslingReducer,
    }),
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(cvSaga);
sagaMiddleware.run(historikkSaga);
sagaMiddleware.run(kandidatlisteSaga);
sagaMiddleware.run(enhetsregisterSaga);
sagaMiddleware.run(listeoversiktSaga);
sagaMiddleware.run(varslingSaga);

export default store;
