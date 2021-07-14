import { applyMiddleware, combineReducers, createStore } from 'redux';
import { alderReducer } from './kandidatsøk/søkefiltre/alder/alderReducer';
import arbeidserfaringReducer from './kandidatsøk/søkefiltre/arbeidserfaring/arbeidserfaringReducer';
import forerkortReducer from './kandidatsøk/søkefiltre/forerkort/forerkortReducer';
import fritekstReducer from './kandidatsøk/søkefiltre/fritekst/fritekstReducer';
import geografiReducer from './kandidatsøk/søkefiltre/geografi/geografiReducer';
import hovedmalReducer from './kandidatsøk/søkefiltre/hovedmal/hovedmalReducer';
import innsatsgruppeReducer from './kandidatsøk/søkefiltre/innsatsgruppe/innsatsgruppeReducer';
import kompetanseReducer from './kandidatsøk/søkefiltre/kompetanse/kompetanseReducer';
import navkontorReducer from './kandidatsøk/søkefiltre/navkontor/navkontorReducer';
import permitteringReducer from './kandidatsøk/søkefiltre/permittering/permitteringReducer';
import sprakReducer from './kandidatsøk/søkefiltre/sprak/sprakReducer';
import stillingReducer from './kandidatsøk/søkefiltre/stilling/stillingReducer';
import tilgjengelighetReducer from './kandidatsøk/søkefiltre/tilgjengelighet/tilgjengelighetReducer';
import tilretteleggingsbehovReducer from './kandidatsøk/søkefiltre/tilretteleggingsbehov/tilretteleggingsbehovReducer';
import typeaheadReducer, { typeaheadSaga } from './common/typeahead/typeaheadReducer';
import utdanningReducer from './kandidatsøk/søkefiltre/utdanning/utdanningReducer';
import createSagaMiddleware from 'redux-saga';
import cvReducer, { cvSaga } from './kandidatside/cv/reducer/cvReducer';
import enhetsregisterReducer, {
    enhetsregisterSaga,
} from './common/typeahead/enhetsregisterReducer';
import { historikkReducer, historikkSaga } from './kandidatside/historikk/historikkReducer';
import kandidatlisteReducer from './kandidatliste/reducer/kandidatlisteReducer';
import listeoversiktReducer from './listeoversikt/reducer/listeoversiktReducer';
import midlertidigUtilgjengeligReducer, {
    midlertidigUtilgjengeligSaga,
} from './kandidatside/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import valgtNavKontorReducer from './navKontor/navKontorReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { searchSaga } from './kandidatsøk/reducer/searchSaga';
import searchReducer from './kandidatsøk/reducer/searchReducer';
import kandidatlisteSaga from './kandidatliste/reducer/kandidatlisteSaga';
import listeoversiktSaga from './listeoversikt/reducer/listeoversiktSaga';
import prioriterteMålgrupperReducer from './kandidatsøk/søkefiltre/prioritertemålgrupper/prioriterteMålgrupperReducer';

const sagaMiddleware = createSagaMiddleware();

const søkefiltreReducer = combineReducers({
    alder: alderReducer,
    arbeidserfaring: arbeidserfaringReducer,
    forerkort: forerkortReducer,
    fritekst: fritekstReducer,
    geografi: geografiReducer,
    hovedmal: hovedmalReducer,
    innsatsgruppe: innsatsgruppeReducer,
    kompetanse: kompetanseReducer,
    navkontor: navkontorReducer,
    permittering: permitteringReducer,
    sprakReducer,
    stilling: stillingReducer,
    tilgjengelighet: tilgjengelighetReducer,
    tilretteleggingsbehov: tilretteleggingsbehovReducer,
    prioriterteMålgrupper: prioriterteMålgrupperReducer,
    typeahead: typeaheadReducer,
    utdanning: utdanningReducer,
});

const store = createStore(
    combineReducers({
        cv: cvReducer,
        enhetsregister: enhetsregisterReducer,
        historikk: historikkReducer,
        kandidatliste: kandidatlisteReducer,
        listeoversikt: listeoversiktReducer,
        midlertidigUtilgjengelig: midlertidigUtilgjengeligReducer,
        navKontor: valgtNavKontorReducer,
        søk: searchReducer,
        søkefilter: søkefiltreReducer,
    }),
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(searchSaga);
sagaMiddleware.run(typeaheadSaga);
sagaMiddleware.run(cvSaga);
sagaMiddleware.run(midlertidigUtilgjengeligSaga);
sagaMiddleware.run(historikkSaga);
sagaMiddleware.run(kandidatlisteSaga);
sagaMiddleware.run(enhetsregisterSaga);
sagaMiddleware.run(listeoversiktSaga);

export default store;
