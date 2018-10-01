import { put, takeLatest, select } from 'redux-saga/effects';
import { fetchKandidatlister, postKandidatliste, SearchApiError } from '../sok/api';
import { LAGRE_STATUS } from '../konstanter';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const OPPRETT_KANDIDATLISTE = 'OPPRETT_KANDIDATLISTE';
export const OPPRETT_KANDIDATLISTE_SUCCESS = 'OPPRETT_KANDIDATLISTE_SUCCESS';
export const OPPRETT_KANDIDATLISTE_FAILURE = 'OPPRETT_KANDIDATLISTE_FAILURE';

export const HENT_KANDIDATLISTER = 'HENT_KANDIDATLISTER';
export const HENT_KANDIDATLISTER_SUCCESS = 'HENT_KANDIDATLISTER_SUCCESS';
export const HENT_KANDIDATLISTER_FAILURE = 'HENT_KANDIDATLISTER_FAILURE';

export const RESET_LAGRE_STATUS = 'RESET_LAGRE_STATUS';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    opprett: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        opprettetKandidatlisteTittel: undefined
    },
    fetchingKandidatlister: false,
    kandidatlister: undefined
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case OPPRETT_KANDIDATLISTE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.LOADING,
                    opprettetKandidatlisteTittel: undefined
                }
            };
        case OPPRETT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.SUCCESS,
                    opprettetKandidatlisteTittel: action.tittel
                }
            };
        case OPPRETT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.FAILURE,
                    opprettetKandidatlisteTittel: undefined
                }
            };
        case RESET_LAGRE_STATUS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.UNSAVED
                }
            };
        case HENT_KANDIDATLISTER:
            return {
                ...state,
                fetchKandidatlister: true
            };
        case HENT_KANDIDATLISTER_SUCCESS:
            return {
                ...state,
                kandidatlister: action.kandidatlister,
                fetchKandidatlister: false
            };
        case HENT_KANDIDATLISTER_FAILURE:
            return {
                ...state,
                fetchKandidatlister: false
            };
        default:
            return state;
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* opprettKandidatliste(action) {
    try {
        const state = yield select();
        const orgNr = state.mineArbeidsgivere.valgtArbeidsgiverId;
        yield postKandidatliste(action.kandidatlisteInfo, orgNr);
        yield put({ type: OPPRETT_KANDIDATLISTE_SUCCESS, tittel: action.kandidatlisteInfo.tittel });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: OPPRETT_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentKandidatlister(action) {
    try {
        const state = yield select();
        const orgNr = state.mineArbeidsgivere.valgtArbeidsgiverId;
        const response = yield fetchKandidatlister(orgNr);
        yield put({ type: HENT_KANDIDATLISTER_SUCCESS, kandidatlister: response.liste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_KANDIDATLISTER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* sjekkError(action) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

export function* kandidatlisteSaga() {
    yield takeLatest(OPPRETT_KANDIDATLISTE, opprettKandidatliste);
    yield takeLatest(HENT_KANDIDATLISTER, hentKandidatlister);
    yield takeLatest([
        OPPRETT_KANDIDATLISTE_FAILURE,
        HENT_KANDIDATLISTER_FAILURE
    ],
    sjekkError);
}

