import { put, takeLatest } from 'redux-saga/effects';
import {
    fetchVilkarstekst, postGodtaGjeldendeVilkar,
    SearchApiError
} from '../sok/api.ts';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const HENT_VILKARSTEKST = 'HENT_VILKARSTEKST';
export const HENT_VILKARSTEKST_SUCCESS = 'HENT_VILKARSTEKST_SUCCESS';
export const HENT_VILKARSTEKST_FAILURE = 'HENT_VILKARSTEKST_FAILURE';

export const GODTA_VILKAR = 'GODTA_VILKAR';
export const GODTA_VILKAR_SUCCESS = 'GODTA_VILKAR_SUCCESS';
export const GODTA_VILKAR_FAILURE = 'GODTA_VILKAR_FAILURE';

export const SETT_MANGLER_SAMTYKKE = 'SETT_MANGLER_SAMTYKKE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    isFetchingVilkarstekst: false,
    isSavingVilkar: false,
    vilkarstekst: undefined,
    harSamtykket: undefined
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case HENT_VILKARSTEKST:
            return {
                ...state,
                isFetchingVilkarstekst: true
            };
        case HENT_VILKARSTEKST_SUCCESS:
            return {
                ...state,
                vilkarstekst: action.vilkarstekst,
                isFetchingVilkarstekst: false
            };
        case HENT_VILKARSTEKST_FAILURE:
            return {
                ...state,
                isFetchingVilkarstekst: false
            };
        case GODTA_VILKAR:
            return {
                ...state,
                isSavingVilkar: true
            };
        case GODTA_VILKAR_SUCCESS:
            return {
                ...state,
                isSavingVilkar: false,
                harSamtykket: true
            };
        case GODTA_VILKAR_FAILURE:
            return {
                ...state,
                isSavingVilkar: false
            };
        case SETT_MANGLER_SAMTYKKE:
            return {
                ...state,
                harSamtykket: false
            };
        default:
            return state;
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* hentVilkarstekst() {
    try {
        const vilkarstekst = yield fetchVilkarstekst();
        yield put({ type: HENT_VILKARSTEKST_SUCCESS, vilkarstekst });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_VILKARSTEKST_FAILURE });
        } else {
            throw e;
        }
    }
}


function* godtaGjeldendeVilkar() {
    try {
        yield postGodtaGjeldendeVilkar();
        yield put({ type: GODTA_VILKAR_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: GODTA_VILKAR_FAILURE });
        } else {
            throw e;
        }
    }
}

function* sjekkError() {
    yield put({ type: INVALID_RESPONSE_STATUS });
}

export function* samtykkeSaga() {
    yield takeLatest(HENT_VILKARSTEKST, hentVilkarstekst);
    yield takeLatest(GODTA_VILKAR, godtaGjeldendeVilkar);
    yield takeLatest([
        HENT_VILKARSTEKST_FAILURE, GODTA_VILKAR_FAILURE
    ],
    sjekkError);
}

