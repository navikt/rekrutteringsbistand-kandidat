import { call, put, select, takeLatest } from 'redux-saga/effects';
import { fetchTypeaheadJanzzGeografiSuggestions, fetchTypeaheadSuggestions, SearchApiError } from '../../sok/api';

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

const initialTypeaheadState = () => ({
    value: '',
    suggestions: [],
    cachedValue: '',
    cachedSuggestions: []
});

const initialState = {
    // TODO: Fjern cached. Toggle: janzz-enabled
    kompetanse: initialTypeaheadState(),
    stilling: initialTypeaheadState(),
    arbeidserfaring: initialTypeaheadState(),
    utdanning: initialTypeaheadState(),
    geografi: initialTypeaheadState(),
    geografiKomplett: initialTypeaheadState(),
    sprak: initialTypeaheadState()
};

export default function typeaheadReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TYPE_AHEAD_SUGGESTIONS:
            return {
                ...state,
                [action.name]: {
                    ...(state[action.name]),
                    value: action.value
                }
            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS:
            if (action.query === state[action.suggestionsLabel].value) {
                return {
                    ...state,
                    [action.suggestionsLabel]: {
                        ...(state[action.suggestionsLabel]),
                        suggestions: action.suggestions
                    }
                };
            }
            return state;
        case FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE:
            return {
                ...state,
                [action.name]: {
                    ...(state[action.name]),
                    cachedSuggestions: action.cachedSuggestions,
                    cachedValue: action.query
                }
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

const getTypeAheadName = (type) => {
    if (type === 'stilling') {
        return {
            typeAheadName: 'sti'
        };
    } else if (type === 'arbeidserfaring') {
        return {
            typeAheadName: 'yrke'
        };
    } else if (type === 'utdanning') {
        return {
            typeAheadName: 'utd'
        };
    } else if (type === 'kompetanse') {
        return {
            typeAheadName: 'komp'
        };
    } else if (type === 'geografi') {
        return {
            typeAheadName: 'geo'
        };
    } else if (type === 'sprak') {
        return {
            typeAheadName: 'sprak'
        };
    }
    return {
        typeAheadName: ''
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


    const typeAheadName = getTypeAheadName(name);

    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        if (state.typeahead[name].cachedSuggestions.length === 0 || state.typeahead[name].cachedValue.value !== value) {
            const cachedMatch = value.substring(0, TYPE_AHEAD_MIN_INPUT_LENGTH);
            try {
                const response = yield call(fetchTypeaheadSuggestions, { [typeAheadName.typeAheadName]: value });

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

                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: suggestions, name, query: value });
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, suggestionsLabel: name, query: value });
            } catch (e) {
                if (e instanceof SearchApiError) {
                    yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: e });
                } else {
                    throw e;
                }
            }
        } else {
            const suggestions = state.typeahead[name].suggestions.filter((cachedSuggestion) => (
                cachedSuggestion.toLowerCase()
                    .startsWith(value.toLowerCase())
            ));
            yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, query: value });
        }
    } else {
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: [], name, query: value });
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: [], suggestionsLabel: name, query: value });
    }
}

function* fetchTypeAheadSuggestionsJanzz(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const name = action.name;
    const value = action.value;

    const typeAheadName = getTypeAheadName(name).typeAheadName;

    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        try {
            const response = name === 'geografi' ? yield call(fetchTypeaheadJanzzGeografiSuggestions, { lokasjon: value }) : yield call(fetchTypeaheadSuggestions, { [typeAheadName]: value });

            const result = [];
            const totalResult = [];
            if (response._embedded) {
                if (name === 'geografi') {
                    response._embedded.lokasjonList.map((sted) => {
                        totalResult.push({ geografiKode: sted.code, geografiKodeTekst: sted.label });
                        return result.push(sted.label);
                    });


                    yield put({ type: SET_KOMPLETT_GEOGRAFI, value: totalResult });
                } else {
                    response._embedded.stringList.map((r) =>
                        result.push(r.content)
                    );
                }

                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: result, suggestionsLabel: name, query: value });
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
