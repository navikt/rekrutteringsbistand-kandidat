import { call, put, select, takeLatest } from 'redux-saga/effects';
import { fetchTypeaheadSuggestions, SearchApiError } from '../../sok/api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_TYPE_AHEAD_SUGGESTIONS = 'FETCH_TYPE_AHEAD_SUGGESTIONS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS = 'FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE';

// TODO: Fjern cached. Toggle: janzz-enabled
export const FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE';

export const SET_KOMPLETT_GEOGRAFI = 'SET_KOMPLETT_GEOGRAFI';

export const CLEAR_TYPE_AHEAD_SUGGESTIONS = 'CLEAR_TYPE_AHEAD_SUGGESTIONS';


/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    suggestionskompetanse: [],
    suggestionsstilling: [],
    suggestionsarbeidserfaring: [],
    suggestionsutdanning: [],
    suggestionsgeografi: [],
    suggestionssprak: [],

    // TODO: Fjern cached. Toggle: janzz-enabled
    cachedSuggestionsKompetanse: [],
    cachedSuggestionsStilling: [],
    cachedSuggestionsArbeidserfaring: [],
    cachedSuggestionsUtdanning: [],
    cachedSuggestionsGeografi: [],
    cachedSuggestionsSprak: [],
    suggestionsGeografiKomplett: []
};

export default function typeaheadReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                [action.suggestionsLabel]: action.suggestions
            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE:
            return {
                ...state,
                [action.cachedSuggestionsLabel]: action.cachedSuggestions
            };
        case SET_KOMPLETT_GEOGRAFI:
            return {
                ...state,
                suggestionsGeografiKomplett: action.value
            };
        case CLEAR_TYPE_AHEAD_SUGGESTIONS:
            return {
                ...state,
                [action.name]: []
            };
        default:
            return state;
    }
}

const getTypeAheadNameAndLabel = (type) => {
    if (type === 'stilling') {
        return {
            typeAheadName: 'sti',
            cachedSuggestionsLabel: 'cachedSuggestionsStilling'
        };
    } else if (type === 'arbeidserfaring') {
        return {
            typeAheadName: 'yrke',
            cachedSuggestionsLabel: 'cachedSuggestionsArbeidserfaring'
        };
    } else if (type === 'utdanning') {
        return {
            typeAheadName: 'utd',
            cachedSuggestionsLabel: 'cachedSuggestionsUtdanning'
        };
    } else if (type === 'kompetanse') {
        return {
            typeAheadName: 'komp',
            cachedSuggestionsLabel: 'cachedSuggestionsKompetanse'
        };
    } else if (type === 'geografi') {
        return {
            typeAheadName: 'geo',
            cachedSuggestionsLabel: 'cachedSuggestionsGeografi'
        };
    } else if (type === 'sprak') {
        return {
            typeAheadName: 'sprak',
            cachedSuggestionsLabel: 'cachedSuggestionsSprak'
        };
    }
    return {
        typeAheadName: '',
        cachedSuggestionsLabel: ''
    };
};

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* fetchTypeAheadSuggestionsES(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const state = yield select();
    const name = action.name;
    const value = action.value;

    const nameAndLabel = getTypeAheadNameAndLabel(name);

    const typeAheadName = nameAndLabel.typeAheadName;
    const cachedSuggestionsLabel = nameAndLabel.cachedSuggestionsLabel;

    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        if (state.typeahead[cachedSuggestionsLabel].length === 0) {
            const cachedMatch = value.substring(0, TYPE_AHEAD_MIN_INPUT_LENGTH);
            try {
                const response = yield call(fetchTypeaheadSuggestions, { [typeAheadName]: cachedMatch });

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
                        .startsWith((cachedMatch.toLowerCase()))
                ));

                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: result, cachedSuggestionsLabel });
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, suggestionsLabel: `suggestions${name}` });
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
            yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, suggestionsLabel: `suggestions${name}` });
        }
    } else {
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: [], cachedSuggestionsLabel });
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: [], suggestionsLabel: `suggestions${name}` });
    }
}

function* fetchTypeAheadSuggestionsJanzz(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const name = action.name;
    const value = action.value;

    const typeAheadName = getTypeAheadNameAndLabel(name).typeAheadName;

    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        try {
            const response = yield call(fetchTypeaheadSuggestions, { [typeAheadName]: value });

            let suggestions;
            if (response._embedded) {
                const responseList = response._embedded.stringList;

                if (name === 'geografi') {
                    const totalResult = responseList.map((r) => (
                        JSON.parse(r.content)
                    ));
                    suggestions = totalResult.map((s) => s.geografiKodeTekst);
                    yield put({ type: SET_KOMPLETT_GEOGRAFI, value: totalResult });
                } else {
                    suggestions = responseList.map((r) => (
                        r.content
                    ));
                }

                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, suggestionsLabel: `suggestions${name}` });
            }
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function* fetchTypeAheadSuggestions(action) {
    const state = yield select();

    // TODO: Fjern else og fetchTypeAheadSuggestionsES. Toggle: janzz-enabled
    if (state.search.featureToggles['janzz-enabled']) {
        yield fetchTypeAheadSuggestionsJanzz(action);
    } else {
        yield fetchTypeAheadSuggestionsES(action);
    }
}

export const typeaheadSaga = function* saga() {
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS, fetchTypeAheadSuggestions);
};
