import React from 'react';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

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
import * as Sentry from '@sentry/react';
import { getMiljø } from '../felles/common/miljøUtils';
import { fjernPersonopplysninger } from '../felles/common/sentryUtils';
import { useSyncHistorikkMedContainer } from '../useSyncHistorikkMedContainer';

Sentry.init({
    dsn: 'https://bd029fab6cab426eb0415b89a7f07124@sentry.gc.nav.no/20',
    environment: getMiljø(),
    enabled: getMiljø() === 'dev-fss' || getMiljø() === 'prod-fss',
    beforeSend: fjernPersonopplysninger,
});

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

sagaMiddleware.run(saga);
sagaMiddleware.run(typeaheadSaga);
sagaMiddleware.run(cvSaga);
sagaMiddleware.run(midlertidigUtilgjengeligSaga);
sagaMiddleware.run(historikkSaga);
sagaMiddleware.run(kandidatlisteSaga);
sagaMiddleware.run(enhetsregisterSaga);
sagaMiddleware.run(listeoversiktSaga);

export const Main = () => {
    useSyncHistorikkMedContainer();
    return (
        <Sentry.ErrorBoundary>
            <Provider store={store}>
                <RekrutteringsbistandKandidat />
            </Provider>
        </Sentry.ErrorBoundary>
    );
};
