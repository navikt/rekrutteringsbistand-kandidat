import {put, select, takeLatest} from 'redux-saga/effects';
import {
    fetchVilkarstekst, postGodtaGjeldendeVilkar, postKandidatliste,
    SearchApiError,
} from '../sok/api';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';
import {
    HENT_KANDIDATLISTER, OPPRETT_KANDIDATLISTE_FAILURE,
    OPPRETT_KANDIDATLISTE_SUCCESS
} from "../kandidatlister/kandidatlisteReducer";

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const HENT_VILKARSTEKST = 'HENT_VILKARSTEKST';
export const HENT_VILKARSTEKST_SUCCESS = 'HENT_VILKARSTEKST_SUCCESS';
export const HENT_VILKARSTEKST_FAILURE = 'HENT_VILKARSTEKST_FAILURE';

export const GODTA_VILKAR = 'GODTA_VILKAR';
export const GODTA_VILKAR_SUCCESS = 'GODTA_VILKAR_SUCCESS';
export const GODTA_VILKAR_FAILURE = 'GODTA_VILKAR_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    fetchingVilkarstekst: false,
    godtarGjeldendeVilkar: false,
    vilkarstekst: undefined,
    vilkarGodtatt: false
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case HENT_VILKARSTEKST:
            return {
                ...state,
                fetchingVilkarstekst: true
            };
        case HENT_VILKARSTEKST_SUCCESS:
            return {
                ...state,
                vilkarstekst: action.vilkarstekst,
                fetchingVilkarstekst: false
            };
        case HENT_VILKARSTEKST_FAILURE:
            return {
                ...state,
                fetchingVilkarstekst: false
            };
        case GODTA_VILKAR:
            return {
                ...state,
                vilkarGodtatt: false
            };
        case GODTA_VILKAR_SUCCESS:
            return {
                ...state,
                vilkarGodtatt: true
            };
        case GODTA_VILKAR_FAILURE:
            return {
                ...state,
                vilkarGodtatt: false
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
            yield put({ type: HENT_VILKARSTEKST_FAILURE, error: e });
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
            yield put({ type: GODTA_VILKAR_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* sjekkError(action) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

export function* samtykkeSaga() {
    yield takeLatest(HENT_VILKARSTEKST, hentVilkarstekst);
    yield takeLatest(GODTA_VILKAR, godtaGjeldendeVilkar);
    yield takeLatest([
        HENT_VILKARSTEKST_FAILURE, GODTA_VILKAR_FAILURE
    ],
    sjekkError);
}

