import { call, put, select, takeLatest } from 'redux-saga/effects';
import { fetchKandidater, fetchFeatureToggles, SearchApiError } from './api';
import { getUrlParameterByName, toUrlParams } from './utils';
import FEATURE_TOGGLES from '../konstanter';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const SET_STATE = 'SET_STATE';

export const FETCH_FEATURE_TOGGLES_BEGIN = 'FETCH_FEATURE_TOGGLES_BEGIN';
const FETCH_FEATURE_TOGGLES_SUCCESS = 'FETCH_FEATURE_TOGGLES_SUCCESS';
const FETCH_FEATURE_TOGGLES_FAILURE = 'FETCH_FEATURE_TOGGLES_FAILURE';

export const FETCH_KOMPETANSE_SUGGESTIONS = 'FETCH_KOMPETANSE_SUGGESTIONS';
export const SET_KOMPETANSE_SUGGESTIONS_BEGIN = 'SET_KOMPETANSE_SUGGESTIONS_BEGIN';
export const SET_KOMPETANSE_SUGGESTIONS_SUCCESS = 'SET_KOMPETANSE_SUGGESTIONS_SUCCESS';
export const REMOVE_KOMPETANSE_SUGGESTIONS = 'REMOVE_KOMPETANSE_SUGGESTIONS';

export const SET_ALERT_TYPE_FAA_KANDIDATER = 'SET_ALERT_TYPE_FAA_KANDIDATER';


const erUavhengigFraJanzzEllerJanzzErEnabled = (toggles, key) => {
    if (!toggles['janzz-enabled']) {
        return !key.includes('skjul-');
    }
    return true;
};

/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    searchResultat: {
        resultat: {
            kandidater: [],
            aggregeringer: [],
            totaltAntallTreff: 0
        },
        kompetanseSuggestions: []
    },
    isSearching: false,
    isInitialSearch: true,
    error: undefined,
    featureToggles: FEATURE_TOGGLES
        .reduce((dict, key) => (
            { ...dict, [key]: false }
        ), {}),
    isEmptyQuery: true,
    visAlertFaKandidater: ''
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_BEGIN:
            return {
                ...state,
                isSearching: true
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                isSearching: false,
                isInitialSearch: false,
                error: undefined,
                isEmptyQuery: action.isEmptyQuery,
                searchResultat: { ...state.searchResultat, resultat: action.response }
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                error: action.error
            };
        case SET_KOMPETANSE_SUGGESTIONS_BEGIN:
            return {
                ...state,
                isSearching: true
            };
        case SET_KOMPETANSE_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                isSearching: false,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: action.response }
            };
        case REMOVE_KOMPETANSE_SUGGESTIONS:
            return {
                ...state,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: [] }
            };
        case FETCH_FEATURE_TOGGLES_SUCCESS:
            return {
                ...state,
                featureToggles: FEATURE_TOGGLES
                    .reduce((dict, key) => (
                        {
                            ...dict,
                            [key]: Object.keys(action.data)
                                .includes(key) && action.data[key] && erUavhengigFraJanzzEllerJanzzErEnabled(action.data, key)
                        }
                    ), {})
            };
        case FETCH_FEATURE_TOGGLES_FAILURE:
            return {
                ...state,
                featureToggles: FEATURE_TOGGLES
                    .reduce((dict, key) => (
                        { ...dict, [key]: false }
                    ), {}),
                error: action.error
            };
        case SET_ALERT_TYPE_FAA_KANDIDATER:
            return {
                ...state,
                visAlertFaKandidater: action.value
            };
        default:
            return state;
    }
}

export const fromUrlQuery = (url) => {
    const stateFromUrl = {};
    const stillinger = getUrlParameterByName('stillinger', url);
    const arbeidserfaringer = getUrlParameterByName('arbeidserfaringer', url);
    const kompetanser = getUrlParameterByName('kompetanser', url);
    const utdanninger = getUrlParameterByName('utdanninger', url);
    const geografiList = getUrlParameterByName('geografiList', url);
    const totalErfaring = getUrlParameterByName('totalErfaring', url);
    const utdanningsniva = getUrlParameterByName('utdanningsniva', url);
    const sprak = getUrlParameterByName('sprak', url);

    if (stillinger) stateFromUrl.stillinger = stillinger.split('_');
    if (arbeidserfaringer) stateFromUrl.arbeidserfaringer = arbeidserfaringer.split('_');
    if (kompetanser) stateFromUrl.kompetanser = kompetanser.split('_');
    if (utdanninger) stateFromUrl.utdanninger = utdanninger.split('_');
    if (geografiList) stateFromUrl.geografiList = geografiList.split('_');
    if (totalErfaring) stateFromUrl.totalErfaring = totalErfaring.split('_');
    if (utdanningsniva) stateFromUrl.utdanningsniva = utdanningsniva.split('_');
    if (sprak) stateFromUrl.sprak = sprak.split('_');
    return stateFromUrl;
};

export const toUrlQuery = (state) => {
    const urlQuery = {};
    if (state.stilling.stillinger && state.stilling.stillinger.length > 0) urlQuery.stillinger = state.stilling.stillinger.join('_');
    if (state.arbeidserfaring.arbeidserfaringer && state.arbeidserfaring.arbeidserfaringer.length > 0) urlQuery.arbeidserfaringer = state.arbeidserfaring.arbeidserfaringer.join('_');
    if (state.kompetanse.kompetanser && state.kompetanse.kompetanser.length > 0) urlQuery.kompetanser = state.kompetanse.kompetanser.join('_');
    if (state.utdanning.utdanninger && state.utdanning.utdanninger.length > 0) urlQuery.utdanninger = state.utdanning.utdanninger.join('_');
    if (state.geografi.geografiList && state.geografi.geografiList.length > 0) urlQuery.geografiList = state.geografi.geografiList.join('_');
    if (state.arbeidserfaring.totalErfaring && state.arbeidserfaring.totalErfaring.length > 0) urlQuery.totalErfaring = state.arbeidserfaring.totalErfaring.join('_');
    if (state.utdanning.utdanningsniva && state.utdanning.utdanningsniva.length > 0) urlQuery.utdanningsniva = state.utdanning.utdanningsniva.join('_');
    if (state.sprakReducer.sprak && state.sprakReducer.sprak.length > 0) urlQuery.sprak = state.sprakReducer.sprak.join('_');
    return toUrlParams(urlQuery);
};


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* search(action = '') {
    try {
        yield put({ type: SEARCH_BEGIN });
        const state = yield select();

        // Update browser url to reflect current search query
        const urlQuery = toUrlQuery(state);
        const newUrlQuery = urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : window.location.pathname;
        window.history.replaceState('', '', newUrlQuery);

        const lokasjonListe = state.search.featureToggles['janzz-enabled'] ? [...state.geografi.geografiListKomplett].map((sted) => (`${sted.geografiKodeTekst}:${sted.geografiKode}`)) : [];
        const response = yield call(fetchKandidater, {
            stillinger: state.stilling.stillinger,
            arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
            utdanninger: state.utdanning.utdanninger,
            kompetanser: state.kompetanse.kompetanser,
            geografiList: state.geografi.geografiList,
            geografiListKomplett: state.geografi.geografiListKomplett,
            lokasjoner: lokasjonListe,
            totalErfaring: state.arbeidserfaring.totalErfaring,
            utdanningsniva: state.utdanning.utdanningsniva,
            sprak: state.sprakReducer.sprak
        });


        const searchCriteria = [
            state.stilling.stillinger,
            state.arbeidserfaring.arbeidserfaringer,
            state.utdanning.utdanninger,
            state.kompetanse.kompetanser,
            state.geografi.geografiList,
            state.geografi.geografiListKomplett,
            state.arbeidserfaring.totalErfaring,
            state.utdanning.utdanningsniva,
            state.sprakReducer.sprak
        ];

        const activeSearchCriteria = searchCriteria.filter((i) => i.length !== 0);
        const isEmptyQuery = activeSearchCriteria.length === 0;


        yield put({ type: SEARCH_SUCCESS, response, isEmptyQuery });
        yield put({ type: SET_ALERT_TYPE_FAA_KANDIDATER, value: action.alertType || '' });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* fetchKompetanseSuggestions() {
    try {
        const state = yield select();

        if (state.stilling.stillinger.length !== 0) {
            yield put({ type: SET_KOMPETANSE_SUGGESTIONS_BEGIN });

            const response = yield call(fetchKandidater, { stillinger: state.stilling.stillinger });
            yield put({ type: SET_KOMPETANSE_SUGGESTIONS_SUCCESS, response: response.aggregeringer[1].felt });
        } else {
            yield put({ type: REMOVE_KOMPETANSE_SUGGESTIONS });
        }
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* initialSearch() {
    try {
        const urlQuery = fromUrlQuery(window.location.href);
        if (Object.keys(urlQuery).length > 0) {
            // TODO: Fjern samtidig som feature toggle janzz-enabled:
            const state = yield select();
            if (state.search.featureToggles['janzz-enabled'] && urlQuery.stillinger && urlQuery.stillinger.length > 1) {
                urlQuery.stillinger = [urlQuery.stillinger[0]];
            }

            yield put({ type: SET_STATE, query: urlQuery });
        }
        yield call(search);
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentFeatureToggles() {
    try {
        const data = yield call(fetchFeatureToggles);
        yield put({ type: FETCH_FEATURE_TOGGLES_SUCCESS, data });
        yield call(initialSearch);
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: FETCH_FEATURE_TOGGLES_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}


export const saga = function* saga() {
    yield takeLatest(SEARCH, search);
    yield takeLatest(FETCH_KOMPETANSE_SUGGESTIONS, fetchKompetanseSuggestions);
    yield takeLatest(FETCH_FEATURE_TOGGLES_BEGIN, hentFeatureToggles);
};
