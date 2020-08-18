import React from 'react';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import ReactDOM from 'react-dom';

import { alderReducer } from './sok/alder/alderReducer';
import { historikkReducer, historikkSaga } from './kandidatside/historikk/historikkReducer';
import { searchReducer } from './sok/typedSearchReducer';
import { saga } from './sok/searchReducer';
import arbeidserfaringReducer from './sok/arbeidserfaring/arbeidserfaringReducer';
import listeoversiktSaga from './listeoversikt/reducer/listeoversiktSaga';
import cvReducer, { cvSaga } from './kandidatside/cv/reducer/cvReducer';
import enhetsregisterReducer, {
    enhetsregisterSaga,
} from './common/typeahead/enhetsregisterReducer';
import forerkortReducer from './sok/forerkort/forerkortReducer';
import fritekstReducer from './sok/fritekst/fritekstReducer';
import geografiReducer from './sok/geografi/geografiReducer';
import hovedmalReducer from './sok/hovedmal/hovedmalReducer';
import innsatsgruppeReducer from './sok/innsatsgruppe/innsatsgruppeReducer';
import kandidatlisteReducer from './kandidatliste/reducer/kandidatlisteReducer';
import kandidatlisteSaga from './kandidatliste/reducer/kandidatlisteSaga';
import kompetanseReducer from './sok/kompetanse/kompetanseReducer';
import midlertidigUtilgjengeligReducer, {
    midlertidigUtilgjengeligSaga,
} from './kandidatside/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import navkontorReducer from './sok/navkontor/navkontorReducer';
import permitteringReducer from './sok/permittering/permitteringReducer';
import RekrutteringsbistandKandidat from './RekrutteringsbistandKandidat';
import sprakReducer from './sok/sprak/sprakReducer';
import stillingReducer from './sok/stilling/stillingReducer';
import tilgjengelighetReducer from './sok/tilgjengelighet/tilgjengelighetReducer';
import tilretteleggingsbehovReducer from './sok/tilretteleggingsbehov/tilretteleggingsbehovReducer';
import typeaheadReducer, { typeaheadSaga } from './common/typeahead/typeaheadReducer';
import utdanningReducer from './sok/utdanning/utdanningReducer';
import valgtNavKontorReducer from './navKontor/navKontorReducer';
import listeoversiktReducer from './listeoversikt/reducer/listeoversiktReducer';
import '../felles/styles.less';
import './sok/sok.less';

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
    typeahead: typeaheadReducer,
    utdanning: utdanningReducer,
});

const sagaMiddleware = createSagaMiddleware();
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

export const reduxStore = store;

const App = () => (
    <Provider store={store}>
        <RekrutteringsbistandKandidat />
    </Provider>
);

sagaMiddleware.run(saga);
sagaMiddleware.run(typeaheadSaga);
sagaMiddleware.run(cvSaga);
sagaMiddleware.run(midlertidigUtilgjengeligSaga);
sagaMiddleware.run(historikkSaga);
sagaMiddleware.run(kandidatlisteSaga);
sagaMiddleware.run(enhetsregisterSaga);
sagaMiddleware.run(listeoversiktSaga);

ReactDOM.render(<App />, document.getElementById('app'));