import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchTypeaheadSuggestionsRest } from '../../api/api';
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
    branch: TypeaheadBranch;
    value: string;
};

type FetchTypeAheadSuggestionsSuccessAction = {
    type: TypeaheadActionType.FetchTypeAheadSuggestionsSuccess;
    query: string;
    branch: TypeaheadBranch;
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
    branch: TypeaheadBranch;
};

export type TypeaheadAction =
    | FetchTypeAheadSuggestionsAction
    | FetchTypeAheadSuggestionsSuccessAction
    | FetchTypeAheadSuggestionsFailureAction
    | SetKomplettGeografiAction
    | ClearTypeAheadSuggestionsAction;

export enum TypeaheadBranch {
    Kompetanse = 'kompetanse',
    Stilling = 'stilling',
    Arbeidserfaring = 'arbeidserfaring',
    Utdanning = 'utdanning',
    Geografi = 'geografi',
    Sprak = 'sprak',
    Forerkort = 'forerkort',
    Sertifikat = 'sertifikat',
    Navkontor = 'navkontor',
}

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
            if (action.branch === TypeaheadBranch.Geografi) {
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

const getTypeAheadBranch = (type: TypeaheadBranch) => {
    if (type === TypeaheadBranch.Stilling) return 'sti';
    else if (type === TypeaheadBranch.Arbeidserfaring) return 'yrke';
    else if (type === TypeaheadBranch.Utdanning) return 'utd';
    else if (type === TypeaheadBranch.Kompetanse) return 'komp';
    else if (type === TypeaheadBranch.Geografi) return 'geo';
    else if (type === TypeaheadBranch.Sprak) return 'sprak';
    else if (type === TypeaheadBranch.Forerkort) return 'forerkort';
    else if (type === TypeaheadBranch.Navkontor) return 'navkontor';
    return '';
};

function* fetchTypeaheadGeografiES(value: string, branch: TypeaheadBranch) {
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

function* fetchTypeaheadGeografi(value: string, branch: TypeaheadBranch) {
    yield fetchTypeaheadGeografiES(value, branch);
}

function* fetchTypeAheadSuggestions(action: FetchTypeAheadSuggestionsAction) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 2;
    const { branch, value } = action;
    if (branch === TypeaheadBranch.Forerkort) {
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
                if (branch === TypeaheadBranch.Geografi) {
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
