import { call, put, select, takeLatest } from 'redux-saga/effects';
import { fetchTypeaheadSuggestions, SearchApiError } from '../../sok/api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_TYPE_AHEAD_SUGGESTIONS = 'FETCH_TYPE_AHEAD_SUGGESTIONS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS = 'FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE';

export const SET_KOMPLETT_GEOGRAFI = 'SET_KOMPLETT_GEOGRAFI';

export const CLEAR_TYPE_AHEAD_SUGGESTIONS = 'CLEAR_TYPE_AHEAD_SUGGESTIONS';


/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    typeAheadSuggestionskompetanse: [],
    typeAheadSuggestionsstilling: [],
    typeAheadSuggestionsarbeidserfaring: [],
    typeAheadSuggestionsutdanning: [],
    typeAheadSuggestionsgeografi: [],
    cachedTypeAheadSuggestionsKompetanse: [],
    cachedTypeAheadSuggestionsStilling: [],
    cachedTypeAheadSuggestionsArbeidserfaring: [],
    cachedTypeAheadSuggestionsUtdanning: [],
    cachedTypeAheadSuggestionsGeografi: [],
    typeAheadSuggestionsGeografiKomplett: []
};

export default function typeaheadReducer(state = initialState, action) {
    switch (action.type) {
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
        case SET_KOMPLETT_GEOGRAFI:
            return {
                ...state,
                typeAheadSuggestionsGeografiKomplett: action.value
            };
        case CLEAR_TYPE_AHEAD_SUGGESTIONS:
            return {
                ...state,
                [action.name]: []
            };
        default:
            return {
                ...state
            };
    }
}

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* fetchTypeAheadSuggestions(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const state = yield select();
    const name = action.name;
    const value = action.value;

    let typeAheadName;
    let cachedSuggestionsLabel;
    if (name === 'stilling') {
        typeAheadName = 'sti';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsStilling';
    } else if (name === 'arbeidserfaring') {
        typeAheadName = 'yrke';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsArbeidserfaring';
    } else if (name === 'utdanning') {
        typeAheadName = 'utd';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsUtdanning';
    } else if (name === 'kompetanse') {
        typeAheadName = 'komp';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsKompetanse';
    } else if (name === 'geografi') {
        typeAheadName = 'geo';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsGeografi';
    }

    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        if (state.typeahead[cachedSuggestionsLabel].length === 0) {
            const cachedTypeAheadMatch = value.substring(0, TYPE_AHEAD_MIN_INPUT_LENGTH);
            try {
                const response = yield call(fetchTypeaheadSuggestions, { [typeAheadName]: cachedTypeAheadMatch });

                // The result from Elastic Search is a list of key-value pair
                // Put the values into a list
                const result = [];
                const totalResult = [];
                if (response._embedded) {
                    if (name === 'geografi') {
                        response._embedded.stringList.map((r) => {
                            const content = JSON.parse(r.content);
                            totalResult.push(content);
                            return result.push(content.geografiKodeTekst);
                        });
                        yield put({ type: SET_KOMPLETT_GEOGRAFI, value: totalResult });
                    } else {
                        response._embedded.stringList.map((r) =>
                            result.push(r.content)
                        );
                    }
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
            const suggestions = state.typeahead[cachedSuggestionsLabel].filter((cachedSuggestion) => (
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

export const typeaheadSaga = function* saga() {
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS, fetchTypeAheadSuggestions);
};
