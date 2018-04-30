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

export const SELECT_TYPE_AHEAD_VALUE_YRKE = 'SELECT_TYPE_AHEAD_VALUE_YRKE';
export const REMOVE_SELECTED_YRKE = 'REMOVE_SELECTED_YRKE';

export const SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING = 'SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING';
export const REMOVE_SELECTED_ARBEIDSERFARING = 'REMOVE_SELECTED_ARBEIDSERFARING';

export const SELECT_TYPE_AHEAD_VALUE_UTDANNING = 'SELECT_TYPE_AHEAD_VALUE_UTDANNING';
export const REMOVE_SELECTED_UTDANNING = 'REMOVE_SELECTED_UTDANNING';

export const SELECT_TYPE_AHEAD_VALUE_SPRAK = 'SELECT_TYPE_AHEAD_VALUE_SPRAK';
export const REMOVE_SELECTED_SPRAK = 'REMOVE_SELECTED_SPRAK';

export const SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT = 'SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT';
export const REMOVE_SELECTED_SERTIFIKAT = 'REMOVE_SELECTED_SERTIFIKAT';

export const SELECT_TYPE_AHEAD_VALUE_GEOGRAFI = 'SELECT_TYPE_AHEAD_VALUE_GEOGRAFI';
export const REMOVE_SELECTED_GEOGRAFI = 'REMOVE_SELECTED_GEOGRAFI';

export const SET_TYPE_AHEAD_VALUE = 'SET_TYPE_AHEAD_VALUE';


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
        yrkeserfaringer: [],
        arbeidserfaringer: [],
        arbeidserfaring: '',
        utdanning: '',
        utdanninger: [],
        kompetanse: '',
        kompetanser: [],
        sprak: '',
        sprakList: [],
        sertifikat: '',
        sertifikater: [],
        geografi: '',
        geografiList: [],
        styrkKode: '',
        nusKode: ''
    },
    isSearching: false,
    isInitialSearch: true,
    typeAheadSuggestionsyrkeserfaring: [],
    typeAheadSuggestionsarbeidserfaring: [],
    typeAheadSuggestionsutdanning: [],
    typeAheadSuggestionskompetanse: [],
    typeAheadSuggestionssprak: [],
    typeAheadSuggestionssertifikat: [],
    typeAheadSuggestionsgeografi: [],
    cachedTypeAheadSuggestionsYrke: [],
    cachedTypeAheadSuggestionsArbeidserfaring: [],
    cachedTypeAheadSuggestionsUtdanning: [],
    cachedTypeAheadSuggestionsKompetanse: [],
    cachedTypeAheadSuggestionsSprak: [],
    cachedTypeAheadSuggestionsSertifikat: [],
    cachedTypeAheadSuggestionsGeografi: [],
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
                isInitialSearch: false,
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
                isSearching: false,
                isInitialSearch: false

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
        case SELECT_TYPE_AHEAD_VALUE_YRKE:
            return {
                ...state,
                query: {
                    ...state.query,
                    yrkeserfaringer: state.query.yrkeserfaringer.includes(state.query.yrkeserfaring) ?
                        state.query.yrkeserfaringer :
                        [
                            ...state.query.yrkeserfaringer,
                            state.query.yrkeserfaring
                        ]
                },
                typeAheadSuggestionsyrkeserfaring: []
            };
        case REMOVE_SELECTED_YRKE:
            return {
                ...state,
                query: {
                    ...state.query,
                    yrkeserfaringer: state.query.yrkeserfaringer.filter((y) => y !== action.value)
                }
            };
        case SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING:
            return {
                ...state,
                query: {
                    ...state.query,
                    arbeidserfaringer: state.query.arbeidserfaringer.includes(state.query.arbeidserfaring) ?
                        state.query.arbeidserfaringer :
                        [
                            ...state.query.arbeidserfaringer,
                            state.query.arbeidserfaring
                        ]
                },
                typeAheadSuggestionsarbeidserfaring: []
            };
        case REMOVE_SELECTED_ARBEIDSERFARING:
            return {
                ...state,
                query: {
                    ...state.query,
                    arbeidserfaringer: state.query.arbeidserfaringer.filter((y) => y !== action.value)
                }
            };
        case SELECT_TYPE_AHEAD_VALUE_UTDANNING:
            return {
                ...state,
                query: {
                    ...state.query,
                    utdanninger: state.query.utdanninger.includes(state.query.utdanning) ?
                        state.query.utdanninger :
                        [
                            ...state.query.utdanninger,
                            state.query.utdanning
                        ]
                },
                typeAheadSuggestionsutdanning: []
            };
        case REMOVE_SELECTED_UTDANNING:
            return {
                ...state,
                query: {
                    ...state.query,
                    utdanninger: state.query.utdanninger.filter((u) => u !== action.value)
                }
            };
        case SELECT_TYPE_AHEAD_VALUE_SPRAK:
            return {
                ...state,
                query: {
                    ...state.query,
                    sprakList: state.query.sprakList.includes(state.query.sprak) ?
                        state.query.sprakList :
                        [
                            ...state.query.sprakList,
                            state.query.sprak
                        ]
                },
                typeAheadSuggestionssprak: []
            };
        case REMOVE_SELECTED_SPRAK:
            return {
                ...state,
                query: {
                    ...state.query,
                    sprakList: state.query.sprakList.filter((s) => s !== action.value)
                }
            };
        case SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT:
            return {
                ...state,
                query: {
                    ...state.query,
                    sertifikater: state.query.sertifikater.includes(state.query.sertifikat) ?
                        state.query.sertifikater :
                        [
                            ...state.query.sertifikater,
                            state.query.sertifikat
                        ]
                },
                typeAheadSuggestionssertifikat: []
            };
        case REMOVE_SELECTED_SERTIFIKAT:
            return {
                ...state,
                query: {
                    ...state.query,
                    sertifikater: state.query.sertifikater.filter((s) => s !== action.value)
                }
            };
        case SELECT_TYPE_AHEAD_VALUE_GEOGRAFI:
            return {
                ...state,
                query: {
                    ...state.query,
                    geografiList: state.query.geografiList.includes(state.query.geografi) ?
                        state.query.geografiList :
                        [
                            ...state.query.geografiList,
                            state.query.geografi
                        ]
                },
                typeAheadSuggestionsgeografi: []
            };
        case REMOVE_SELECTED_GEOGRAFI:
            return {
                ...state,
                query: {
                    ...state.query,
                    geografiList: state.query.geografiList.filter((g) => g !== action.value)
                }
            };
        case SET_TYPE_AHEAD_VALUE:
            return {
                ...state,
                query: {
                    ...state.query,
                    [action.name]: action.value
                }
            };
        default:
            return { ...state };
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* search() {
    try {
        const state = yield select();
        const query = state.query;

        yield put({ type: SEARCH_BEGIN, query });

        const response = yield call(fetchKandidater, query);

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
        if (Object.keys(action.query).length > 0) {
            yield put({ type: SET_INITIAL_STATE, query: action.query });
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
    } else if (name === 'arbeidserfaring') {
        typeAheadName = 'yrke';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsArbeidserfaring';
    } else if (name === 'utdanning') {
        typeAheadName = 'utd';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsUtdanning';
    } else if (name === 'kompetanse') {
        typeAheadName = 'komp';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsKompetanse';
    } else if (name === 'sprak') {
        typeAheadName = 'spr';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsSprak';
    } else if (name === 'sertifikat') {
        typeAheadName = 'sert';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsSertifikat';
    } else if (name === 'geografi') {
        typeAheadName = 'geo';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsGeografi';
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
