import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchTypeaheadJanzzGeografiSuggestions, fetchTypeaheadSuggestionsRest, SearchApiError } from '../../sok/api';
import { BRANCHNAVN } from '../../konstanter';
import alleForerkort from '../../sok/forerkort/forerkort';
import { USE_JANZZ } from '../../common/fasitProperties';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_TYPE_AHEAD_SUGGESTIONS = 'FETCH_TYPE_AHEAD_SUGGESTIONS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS = 'FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE';

export const SET_KOMPLETT_GEOGRAFI = 'SET_KOMPLETT_GEOGRAFI';

export const CLEAR_TYPE_AHEAD_SUGGESTIONS = 'CLEAR_TYPE_AHEAD_SUGGESTIONS';


/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialTypeaheadState = () => ({
    value: '',
    suggestions: []
});

const initialState = {
    kompetanse: initialTypeaheadState(),
    stilling: initialTypeaheadState(),
    arbeidserfaring: initialTypeaheadState(),
    utdanning: initialTypeaheadState(),
    geografi: initialTypeaheadState(),
    geografiKomplett: initialTypeaheadState(),
    sprak: initialTypeaheadState(),
    forerkort: initialTypeaheadState()
};

export default function typeaheadReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TYPE_AHEAD_SUGGESTIONS:
            return {
                ...state,
                [action.branch]: {
                    ...(state[action.branch]),
                    value: action.value
                }
            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS:
            if (action.query === state[action.branch].value) {
                return {
                    ...state,
                    [action.branch]: {
                        ...(state[action.branch]),
                        suggestions: action.suggestions
                    }
                };
            }
            return state;
        case SET_KOMPLETT_GEOGRAFI:
            return {
                ...state,
                geografiKomplett: {
                    ...(state.geografiKomplett),
                    suggestions: action.value
                }
            };
        case CLEAR_TYPE_AHEAD_SUGGESTIONS:
            if (action.branch === BRANCHNAVN.GEOGRAFI) {
                return {
                    ...state,
                    geografi: {
                        ...(state.geografi),
                        suggestions: []
                    },
                    geografiKomplett: {
                        ...(state.geografiKomplett),
                        suggestions: []
                    }
                };
            }
            return {
                ...state,
                [action.branch]: {
                    ...(state[action.branch]),
                    suggestions: []
                }
            };
        default:
            return state;
    }
}

const getTypeAheadBranch = (type) => {
    if (type === BRANCHNAVN.STILLING) return 'sti';
    else if (type === BRANCHNAVN.ARBEIDSERFARING) return 'yrke';
    else if (type === BRANCHNAVN.UTDANNING) return 'utd';
    else if (type === BRANCHNAVN.KOMPETANSE) return 'komp';
    else if (type === BRANCHNAVN.GEOGRAFI) return 'geo';
    else if (type === BRANCHNAVN.SPRAK) return 'sprak';
    else if (type === BRANCHNAVN.FORERKORT) return 'forerkort';
    return '';
};

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* fetchTypeaheadGeografiES(value, branch) {
    const typeAheadBranch = getTypeAheadBranch(branch);
    try {
        const response = yield call(fetchTypeaheadSuggestionsRest, { [typeAheadBranch]: value });
        const totalSuggestions = response.map((r) => (
            JSON.parse(r)
        ));
        const suggestions = response.map((r) => {
            const content = JSON.parse(r);
            return content.geografiKodeTekst;
        });
        yield put({ type: SET_KOMPLETT_GEOGRAFI, value: totalSuggestions });

        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, branch, query: value });
    } catch (e) {
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: new SearchApiError({ message: e.message }) });
    }
}

function* fetchTypeaheadGeografiJanzz(value, branch) {
    try {
        const response = yield call(fetchTypeaheadJanzzGeografiSuggestions, { lokasjon: value });

        if (response._embedded) {
            const totalResult = response._embedded.lokasjonList.map((sted) => (
                { geografiKode: sted.code, geografiKodeTekst: sted.label }
            ));

            const result = response._embedded.lokasjonList.map((sted) => (
                sted.label
            ));

            yield put({ type: SET_KOMPLETT_GEOGRAFI, value: totalResult });
            yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: result, branch, query: value });
        } else {
            yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: new SearchApiError({ message: 'Forventet at response hadde embedded felt' }) });
        }
    } catch (e) {
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: new SearchApiError({ message: e.message }) });
    }
}

function* fetchTypeaheadGeografi(value, branch) {
    if (USE_JANZZ) {
        yield fetchTypeaheadGeografiJanzz(value, branch);
    } else {
        yield fetchTypeaheadGeografiES(value, branch);
    }
}

function* fetchTypeAheadSuggestions(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const branch = action.branch;
    const value = action.value;
    if (branch === BRANCHNAVN.FORERKORT) {
        let result;
        if (!value) {
            result = alleForerkort;
        } else {
            result = alleForerkort.filter((fk) => fk.toLowerCase().includes(value.toLowerCase()));
        }
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: result, branch, query: value });
    } else {
        const typeAheadBranch = getTypeAheadBranch(branch);

        if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
            try {
                if (branch === BRANCHNAVN.GEOGRAFI) {
                    yield fetchTypeaheadGeografi(value, branch);
                } else {
                    const response = yield call(fetchTypeaheadSuggestionsRest, { [typeAheadBranch]: value });
                    yield put({
                        type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS,
                        suggestions: response,
                        branch,
                        query: value
                    });
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
}

export const typeaheadSaga = function* saga() {
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS, fetchTypeAheadSuggestions);
};
