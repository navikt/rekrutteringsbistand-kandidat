import { call, put, select, takeLatest } from 'redux-saga/effects';
import { fetchKandidater, SearchApiError } from './api';
import { getUrlParameterByName, toUrlParams } from './utils';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';

export const FETCH_KOMPETANSE_SUGGESTIONS = 'FETCH_KOMPETANSE_SUGGESTIONS';
export const SET_KOMPETANSE_SUGGESTIONS_BEGIN = 'SET_KOMPETANSE_SUGGESTIONS_BEGIN';
export const SET_KOMPETANSE_SUGGESTIONS_SUCCESS = 'SET_KOMPETANSE_SUGGESTIONS_SUCCESS';

/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    elasticSearchResultat: {
        resultat: {
            cver: [],
            aggregeringer: [],
            totaltAntallTreff: 0
        },
        kompetanseSuggestions: []
    },
    isSearching: false,
    isInitialSearch: true,
    error: undefined
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
                elasticSearchResultat: { ...state.elasticSearchResultat, resultat: action.response }
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                isInitialSearch: false,
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
                elasticSearchResultat: { ...state.elasticSearchResultat, kompetanseSuggestions: action.response }
            };
        default:
            return { ...state };
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

    if (stillinger) stateFromUrl.stillinger = stillinger.split('_');
    if (arbeidserfaringer) stateFromUrl.arbeidserfaringer = arbeidserfaringer.split('_');
    if (kompetanser) stateFromUrl.kompetanser = kompetanser.split('_');
    if (utdanninger) stateFromUrl.utdanninger = utdanninger.split('_');
    if (geografiList) stateFromUrl.geografiList = geografiList.split('_');
    if (totalErfaring) stateFromUrl.totalErfaring = totalErfaring;
    if (utdanningsniva) stateFromUrl.utdanningsniva = utdanningsniva.split('_');
    return stateFromUrl;
};

export const toUrlQuery = (state) => {
    const urlQuery = {};
    if (state.stilling.stillinger && state.stilling.stillinger.length > 0) urlQuery.stillinger = state.stilling.stillinger.join('_');
    if (state.arbeidserfaring.arbeidserfaringer && state.arbeidserfaring.arbeidserfaringer.length > 0) urlQuery.arbeidserfaringer = state.arbeidserfaring.arbeidserfaringer.join('_');
    if (state.kompetanse.kompetanser && state.kompetanse.kompetanser.length > 0) urlQuery.kompetanser = state.kompetanse.kompetanser.join('_');
    if (state.utdanning.utdanninger && state.utdanning.utdanninger.length > 0) urlQuery.utdanninger = state.utdanning.utdanninger.join('_');
    if (state.geografi.geografiList && state.geografi.geografiList.length > 0) urlQuery.geografiList = state.geografi.geografiList.join('_');
    if (state.arbeidserfaring.totalErfaring) urlQuery.totalErfaring = state.arbeidserfaring.totalErfaring;
    if (state.utdanning.utdanningsniva && state.utdanning.utdanningsniva.length > 0) urlQuery.utdanningsniva = state.utdanning.utdanningsniva.join('_');
    return toUrlParams(urlQuery);
};


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* search() {
    try {
        yield put({ type: SEARCH_BEGIN });
        const state = yield select();

        // Update browser url to reflect current search query
        const urlQuery = toUrlQuery(state);
        const newUrlQuery = urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : window.location.pathname;
        window.history.replaceState('', '', newUrlQuery);

        const response = yield call(fetchKandidater, {
            stillinger: state.stilling.stillinger,
            arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
            utdanninger: state.utdanning.utdanninger,
            kompetanser: state.kompetanse.kompetanser,
            geografiList: state.geografi.geografiList,
            geografiListKomplett: state.geografi.geografiListKomplett,
            totalErfaring: state.arbeidserfaring.totalErfaring,
            utdanningsniva: state.utdanning.utdanningsniva
        });

        yield put({ type: SEARCH_SUCCESS, response });
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

        yield put({ type: SET_KOMPETANSE_SUGGESTIONS_BEGIN });

        if (state.stilling.stillinger.length === 0) {
            yield put({ type: SET_KOMPETANSE_SUGGESTIONS_SUCCESS, response: [] });
        } else {
            const response = yield call(fetchKandidater, { stillinger: state.stilling.stillinger });

            yield put({ type: SET_KOMPETANSE_SUGGESTIONS_SUCCESS, response: response.aggregeringer[1].felt });
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
            yield put({ type: SET_INITIAL_STATE, query: urlQuery });
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


export const saga = function* saga() {
    yield takeLatest(SEARCH, search);
    yield takeLatest(FETCH_KOMPETANSE_SUGGESTIONS, fetchKompetanseSuggestions);
    yield takeLatest(INITIAL_SEARCH, initialSearch);
};
