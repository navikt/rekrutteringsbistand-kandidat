import { put, takeLatest } from 'redux-saga/effects';
import { postKandidatliste, SearchApiError } from '../sok/api';
import { LAGRE_STATUS } from '../konstanter';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const OPPRETT_KANDIDATLISTE = 'OPPRETT_KANDIDATLISTE';
export const OPPRETT_KANDIDATLISTE_SUCCESS = 'OPPRETT_KANDIDATLISTE_SUCCESS';
export const OPPRETT_KANDIDATLISTE_FAILURE = 'OPPRETT_KANDIDATLISTE_FAILURE';

export const RESET_LAGRE_STATUS = 'RESET_LAGRE_STATUS';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    lagreStatus: LAGRE_STATUS.UNSAVED
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case OPPRETT_KANDIDATLISTE:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.LOADING
            };
        case OPPRETT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.SUCCESS
            };
        case OPPRETT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.FAILURE
            };
        case RESET_LAGRE_STATUS:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.UNSAVED
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
        yield postKandidatliste({ ...action.kandidatlisteInfo, stillingReferanse: 'test' });
        yield put({ type: OPPRETT_KANDIDATLISTE_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: OPPRETT_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export function* kandidatlisteSaga() {
    yield takeLatest(OPPRETT_KANDIDATLISTE, opprettKandidatliste);
}

