import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchTypeaheadSuggestionsRest } from '../../api/api';
import { BRANCHNAVN } from '../konstanter';
import { forerkortSuggestions } from '../../kandidatsøk/søkefiltre/forerkort/forerkort';
import { SearchApiError } from '../../api/fetchUtils';

export enum TypeaheadActionType {
    FetchTypeAheadSuggestions = 'FETCH_TYPE_AHEAD_SUGGESTIONS',
    FetchTypeAheadSuggestionsSuccess = 'FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS',
    FetchTypeAheadSuggestionsFailure = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE',
    SetKomplettGeografi = 'SET_KOMPLETT_GEOGRAFI',
    ClearTypeAheadSuggestions = 'CLEAR_TYPE_AHEAD_SUGGESTIONS',
}

type FetchTypeAheadSuggestionsAction = {
    type: TypeaheadActionType.FetchTypeAheadSuggestions;
    branch: string; // TODO: Bruk 'BRANCHNAVN' enum
    value: string;
};

type FetchTypeAheadSuggestionsSuccessAction = {
    type: TypeaheadActionType.FetchTypeAheadSuggestionsSuccess;
    query: string;
    branch: string; // TODO: Bruk 'BRANCHNAVN' enum
    suggestions: string[];
};

type FetchTypeAheadSuggestionsFailureAction = {
    type: TypeaheadActionType.FetchTypeAheadSuggestionsFailure;
    error: SearchApiError;
};

type SetKomplettGeografiAction = {
    type: TypeaheadActionType.SetKomplettGeografi;
    value: string[];
};

type ClearTypeAheadSuggestionsAction = {
    type: TypeaheadActionType.ClearTypeAheadSuggestions;
    branch: string;
};

export type TypeaheadAction =
    | FetchTypeAheadSuggestionsAction
    | FetchTypeAheadSuggestionsSuccessAction
    | FetchTypeAheadSuggestionsFailureAction
    | SetKomplettGeografiAction
    | ClearTypeAheadSuggestionsAction;

const initialTypeaheadState = () => ({
    value: '',
    suggestions: [],
});

const initialState = {
    kompetanse: initialTypeaheadState(),
    stilling: initialTypeaheadState(),
    arbeidserfaring: initialTypeaheadState(),
    utdanning: initialTypeaheadState(),
    geografi: initialTypeaheadState(),
    geografiKomplett: initialTypeaheadState(),
    sprak: initialTypeaheadState(),
    forerkort: initialTypeaheadState(),
    navkontor: initialTypeaheadState(),
};

export default function typeaheadReducer(state = initialState, action: TypeaheadAction) {
    switch (action.type) {
        case TypeaheadActionType.FetchTypeAheadSuggestions:
            return {
                ...state,
                [action.branch]: {
                    ...state[action.branch],
                    value: action.value,
                },
            };
        case TypeaheadActionType.FetchTypeAheadSuggestionsSuccess:
            if (action.query === state[action.branch].value) {
                return {
                    ...state,
                    [action.branch]: {
                        ...state[action.branch],
                        suggestions: action.suggestions,
                    },
                };
            }
            return state;
        case TypeaheadActionType.SetKomplettGeografi:
            return {
                ...state,
                geografiKomplett: {
                    ...state.geografiKomplett,
                    suggestions: action.value,
                },
            };
        case TypeaheadActionType.ClearTypeAheadSuggestions:
            if (action.branch === BRANCHNAVN.GEOGRAFI) {
                return {
                    ...state,
                    geografi: {
                        ...state.geografi,
                        suggestions: [],
                    },
                    geografiKomplett: {
                        ...state.geografiKomplett,
                        suggestions: [],
                    },
                };
            }
            return {
                ...state,
                [action.branch]: {
                    ...state[action.branch],
                    suggestions: [],
                },
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
    else if (type === BRANCHNAVN.NAVKONTOR) return 'navkontor';
    return '';
};

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* fetchTypeaheadGeografiES(value, branch) {
    const typeAheadBranch = getTypeAheadBranch(branch);
    try {
        const response = yield call(fetchTypeaheadSuggestionsRest, { [typeAheadBranch]: value });
        const totalSuggestions = response.suggestions.map((r) => JSON.parse(r));
        const totalSuggestionsUtenBydelerOgLand = totalSuggestions.filter(
            (s) =>
                !s.geografiKodeTekst.toLowerCase().includes('bydel') &&
                s.geografiKode.substring(0, 2).toUpperCase() === 'NO'
        );
        const suggestions = totalSuggestionsUtenBydelerOgLand.map((r) => r.geografiKodeTekst);
        yield put({
            type: TypeaheadActionType.SetKomplettGeografi,
            value: totalSuggestionsUtenBydelerOgLand,
        });

        yield put({
            type: TypeaheadActionType.FetchTypeAheadSuggestionsSuccess,
            suggestions,
            branch,
            query: value,
        });
    } catch (e) {
        yield put({
            type: TypeaheadActionType.FetchTypeAheadSuggestionsFailure,
            error: new SearchApiError({ message: e.message }),
        });
    }
}

function* fetchTypeaheadGeografi(value, branch) {
    yield fetchTypeaheadGeografiES(value, branch);
}

function* fetchTypeAheadSuggestions(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 2;
    const { branch, value } = action;
    if (branch === BRANCHNAVN.FORERKORT) {
        yield put({
            type: TypeaheadActionType.FetchTypeAheadSuggestionsSuccess,
            suggestions: forerkortSuggestions(value),
            branch,
            query: value,
        });
    } else {
        const typeAheadBranch = getTypeAheadBranch(branch);

        if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
            try {
                if (branch === BRANCHNAVN.GEOGRAFI) {
                    yield fetchTypeaheadGeografi(value, branch);
                } else {
                    const response = yield call(fetchTypeaheadSuggestionsRest, {
                        [typeAheadBranch]: value,
                    });
                    yield put({
                        type: TypeaheadActionType.FetchTypeAheadSuggestionsSuccess,
                        suggestions: response.suggestions,
                        branch,
                        query: value,
                    });
                }
            } catch (e) {
                if (e instanceof SearchApiError) {
                    yield put({
                        type: TypeaheadActionType.FetchTypeAheadSuggestionsFailure,
                        error: e,
                    });
                } else {
                    throw e;
                }
            }
        }
    }
}

export const typeaheadSaga = function* saga() {
    yield takeLatest(TypeaheadActionType.FetchTypeAheadSuggestions, fetchTypeAheadSuggestions);
};
