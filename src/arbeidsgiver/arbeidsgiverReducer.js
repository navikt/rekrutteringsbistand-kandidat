import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchArbeidsgivere, SearchApiError } from '../sok/api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */
export const HENT_ARBEIDSGIVERE_BEGIN = 'HENT_ARBEIDSGIVERE_BEGIN';
export const HENT_ARBEIDSGIVERE_SUCCESS = 'HENT_ARBEIDSGIVERE_SUCCESS';
export const HENT_ARBEIDSGIVERE_FAILURE = 'HENT_ARBEIDSGIVERE_FAILURE';
export const VELG_ARBEIDSGIVER = 'VELG_ARBEIDSGIVER';
export const RESET_ARBEIDSGIVER = 'RESET_ARBEIDSGIVER';


/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    valgtArbeidsgiverId: sessionStorage.getItem('orgnr') ? sessionStorage.getItem('orgnr') : undefined,
    arbeidsgivere: [],
    isFetchingArbeidsgivere: true
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case HENT_ARBEIDSGIVERE_SUCCESS:
            return {
                ...state,
                arbeidsgivere: action.response,
                valgtArbeidsgiverId: action.response.length === 1 ? action.response[0].orgnr : state.valgtArbeidsgiverId,
                isFetchingArbeidsgivere: false
            };
        case VELG_ARBEIDSGIVER:
            return {
                ...state,
                valgtArbeidsgiverId: action.data
            };
        case RESET_ARBEIDSGIVER:
            return {
                ...state,
                valgtArbeidsgiverId: undefined
            };
        case HENT_ARBEIDSGIVERE_BEGIN:
            return {
                ...state,
                isFetchingArbeidsgivere: true
            };
        case HENT_ARBEIDSGIVERE_FAILURE:
            return {
                ...state,
                isFetchingArbeidsgivere: false
            };
        default:
            return state;
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */
function* hentArbeidsgivere() {
    try {
        const response = yield call(fetchArbeidsgivere);
        yield put({ type: HENT_ARBEIDSGIVERE_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_ARBEIDSGIVERE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const mineArbeidsgivereSaga = function* mineArbeidsgivereSaga() {
    yield takeLatest(HENT_ARBEIDSGIVERE_BEGIN, hentArbeidsgivere);
};
