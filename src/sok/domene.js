import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchKandidater,
    fetchTypeaheadSuggestions
} from './api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';

export const FETCH_TYPE_AHEAD_SUGGESTIONS = 'FETCH_TYPE_AHEAD_SUGGESTIONS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS = 'FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE';

export const SELECT_TYPE_AHEAD_VALUE = 'SELECT_TYPE_AHEAD_VALUE';
export const SET_TYPE_AHEAD_VALUE = 'SET_TYPE_AHEAD_VALUE';

export const FETCH_INITIAL_AGGREGATIONS_SUCCESS = 'FETCH_INITIAL_AGGREGATIONS_SUCCESS';
export const FETCH_AGGREGATIONS_SUCCESS = 'FETCH_AGGREGATIONS_SUCCESS';

export const CHECK_YRKESERFARING = 'CHECK_YRKESERFARING';
export const UNCHECK_YRKESERFARING = 'UNCHECK_YRKESERFARING';
export const CHECK_UTDANNING = 'CHECK_UTDANNING';
export const UNCHECK_UTDANNING = 'UNCHECK_UTDANNING';

/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    elasticSearchResultat: {
        resultat: {
            cver: [],
            aggregeringer: []
        },
        total: 0
    },
    query: {
        yrkeserfaring: '',
        utdanning: '',
        kompetanse: '',
        fritekst: '',
        styrkKode: '',
        nusKode: '',
        styrkKoder: [],
        nusKoder: []
    },
    isSearching: false,
    typeAheadSuggestionsyrkeserfaring: [],
    typeAheadSuggestionsutdanning: [],
    typeAheadSuggestionskompetanse: [],
    cachedTypeAheadSuggestionsYrke: [],
    cachedTypeAheadSuggestionsUtdanning: [],
    cachedTypeAheadSuggestionsKompetanse: [],
    aggregations: [],
    error: undefined
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_BEGIN:
            return {
                ...state,
                query: action.query,
                isSearching: true
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                isSearching: false,
                error: undefined,
                elasticSearchResultat: { ...state.elasticSearchResultat, resultat: action.response, total: action.response.cver.length }
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                error: action.error
            };

        case SET_INITIAL_STATE:
            return {
                ...state,
                query: {
                    ...state.query,
                    ...action.query
                },
                isSearching: false

            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                [action.typeAheadSuggestionsLabel]: action.suggestions
            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE:
            return {
                ...state,
                [action.cachedTypeAheadSuggestionsLabel]: action.cachedSuggestions
            };
        case SELECT_TYPE_AHEAD_VALUE:
            return {
                ...state,
                [action.typeAheadSuggestionsLabel]: []
            };
        case SET_TYPE_AHEAD_VALUE:
            return {
                ...state,
                query: {
                    ...state.query,
                    [action.name]: action.value
                }
            };
        case FETCH_INITIAL_AGGREGATIONS_SUCCESS:
            return {
                ...state,
                aggregations: action.response
            };
        case FETCH_AGGREGATIONS_SUCCESS:
            return {
                ...state
            };
        case CHECK_UTDANNING:
            return {
                ...state,
                query: {
                    ...state.query,
                    nusKoder: [
                        ...state.query.nusKoder,
                        action.value
                    ]
                }
            };
        case UNCHECK_UTDANNING:
            return {
                ...state,
                query: {
                    ...state.query,
                    nusKoder: state.query.nusKoder.filter((nusKode) => nusKode !== action.value)
                }
            };
        case CHECK_YRKESERFARING:
            return {
                ...state,
                query: {
                    ...state.query,
                    styrkKoder: [
                        ...state.query.styrkKoder,
                        action.value
                    ]
                }
            };
        case UNCHECK_YRKESERFARING:
            return {
                ...state,
                query: {
                    ...state.query,
                    styrkKoder: state.query.styrkKoder.filter((styrkKode) => styrkKode !== action.value)
                }
            };
        default:
            return { ...state };
    }
}

/** *********************************************************
 * SELECTORS
 ********************************************************* */
export const toSearchQuery = (state, fritekstSok) => {
    const { query } = state;
    let searchQuery = { ...query };

    // Samme query er brukt for fritekst-søket og strukturert søk.
    // Når fritekst-søk brukes må de andre kriteriene i query være tomme,
    // og motsatt. Dette kan skrives om når det er bestemt hvordan søket skal se ut.
    if (fritekstSok) {
        searchQuery = {
            ...query,
            yrkeserfaring: '',
            utdanning: '',
            kompetanse: ''
        };
    } else {
        searchQuery = {
            ...query,
            fritekst: ''
        };
    }

    return searchQuery;
};

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* search(action) {
    try {
        const state = yield select();
        const query = state.query;

        yield put({ type: SEARCH_BEGIN, query });

        const response = yield call(fetchKandidater, toSearchQuery(state, action.fritekstSok));

        yield put({ type: SEARCH_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* initialSearch(action) {
    try {
        const response = yield call(fetchKandidater);
        yield put({ type: FETCH_INITIAL_AGGREGATIONS_SUCCESS, response: response.aggregeringer });

        if (Object.keys(action.query).length > 0) {
            yield put({ type: SET_INITIAL_STATE, query: action.query });
        }
        yield call(search, false);
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* fetchTypeAheadSuggestions(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const state = yield select();
    const name = action.name;
    const value = state.query[name];

    let typeAheadName;
    let cachedSuggestionsLabel;
    if (name === 'yrkeserfaring') {
        typeAheadName = 'yrke';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsYrke';
    } else if (name === 'utdanning') {
        typeAheadName = 'utd';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsUtdanning';
    } else if (name === 'kompetanse') {
        typeAheadName = 'komp';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsKompetanse';
    }

    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        if (state[cachedSuggestionsLabel].length === 0) {
            const cachedTypeAheadMatch = value.substring(0, TYPE_AHEAD_MIN_INPUT_LENGTH);
            try {
                const response = yield call(fetchTypeaheadSuggestions, { [typeAheadName]: cachedTypeAheadMatch });

                // The result from Elastic Search is a list of key-value pair
                // Put the values into a list
                const result = [];
                if (response._embedded) {
                    response._embedded.stringList.map((r) =>
                        result.push(r.content)
                    );
                }

                const suggestions = result.filter((cachedSuggestion) => (
                    cachedSuggestion.toLowerCase()
                        .startsWith((cachedTypeAheadMatch.toLowerCase()))
                ));

                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: result, cachedTypeAheadSuggestionsLabel: cachedSuggestionsLabel });
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, typeAheadSuggestionsLabel: `typeAheadSuggestions${name}` });
            } catch (e) {
                if (e instanceof SearchApiError) {
                    yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: e });
                } else {
                    throw e;
                }
            }
        } else {
            const suggestions = state[cachedSuggestionsLabel].filter((cachedSuggestion) => (
                cachedSuggestion.toLowerCase()
                    .startsWith(value.toLowerCase())
            ));
            yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, typeAheadSuggestionsLabel: `typeAheadSuggestions${name}` });
        }
    } else {
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: [], cachedTypeAheadSuggestionsLabel: cachedSuggestionsLabel });
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: [], typeAheadSuggestionsLabel: `typeAheadSuggestions${name}` });
    }
}

export const saga = function* saga() {
    yield takeLatest(SEARCH, search);
    yield takeLatest(INITIAL_SEARCH, initialSearch);
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS, fetchTypeAheadSuggestions);
};
