
import { call, put, takeLatest } from 'redux-saga/effects';
import { SearchApiError, fetchArbeidsgivereEnhetsregister, fetchArbeidsgivereEnhetsregisterOrgnr } from '../../api';
// import { fetchTypeaheadSuggestionsRest, SearchApiError } from '../../api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER = 'FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER_SUCCESS = 'FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER_SUCCESS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER_FAILURE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE_ENHETSREGISTER_FAILURE';

export const CLEAR_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER = 'CLEAR_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER';


/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    suggestions: []
};

export default function enhentsregisterReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER_SUCCESS:
            return {
                ...state,
                suggestions: action.suggestions
            };
        case CLEAR_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER:
            return {
                ...state,
                suggestions: []
            };
        default:
            return state;
    }
}

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

/* eslint-disable no-underscore-dangle */
function* fetchTypeAheadSuggestions(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 2;
    const { value } = action;

    if (value.length > TYPE_AHEAD_MIN_INPUT_LENGTH) {
        try {
            let searchResponse;
            if (value.match(/^\s*[0-9][0-9\s]*$/) !== null) {
                searchResponse = yield call(fetchArbeidsgivereEnhetsregisterOrgnr, value);
            } else {
                searchResponse = yield call(fetchArbeidsgivereEnhetsregister, value);
            }
            const response = ({
                suggestions: [
                    ...searchResponse.hits.hits.map((employer) => ({
                        name: employer._source.navn,
                        orgnr: employer._source.organisasjonsnummer,
                        location: (employer._source.adresse ? {
                            address: employer._source.adresse.adresse,
                            postalCode: employer._source.adresse.postnummer,
                            city: employer._source.adresse.poststed
                        } : undefined)
                    }))
                ]
            });
            yield put({
                type: FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER_SUCCESS,
                suggestions: response.suggestions,
                query: value
            });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

export const enhetsregisterSaga = function* saga() {
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS_ENHETSREGISTER, fetchTypeAheadSuggestions);
};
