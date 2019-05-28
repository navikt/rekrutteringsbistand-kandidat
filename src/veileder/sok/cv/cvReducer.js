import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchCv } from '../../api.ts';
import { INVALID_RESPONSE_STATUS } from '../searchReducer';
import { SearchApiError } from '../../../felles/api.ts';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_CV = 'FETCH_CV';
export const FETCH_CV_BEGIN = 'FETCH_CV_BEGIN';
export const FETCH_CV_SUCCESS = 'FETCH_CV_SUCCESS';
export const FETCH_CV_NOT_FOUND = 'FETCH_CV_NOT_FOUND';
export const FETCH_CV_FAILURE = 'FETCH_CV_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

export const HENT_CV_STATUS = {
    IKKE_HENTET: 'IKKE_HENTET',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    FINNES_IKKE: 'FINNES_IKKE'
};

const initialState = {
    cv: {
        utdanning: [],
        yrkeserfaring: [],
        kurs: [],
        sertifikater: [],
        sprak: []
    },
    hentStatus: HENT_CV_STATUS.IKKE_HENTET
};

export default function cvReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CV_BEGIN:
            return {
                ...state,
                hentStatus: HENT_CV_STATUS.LOADING
            };
        case FETCH_CV_SUCCESS:
            return {
                ...state,
                cv: action.response,
                hentStatus: HENT_CV_STATUS.SUCCESS
            };
        case FETCH_CV_NOT_FOUND:
            return {
                ...state,
                hentStatus: HENT_CV_STATUS.FINNES_IKKE
            };
        default:
            return state;
    }
}

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* fetchCvForKandidat(action) {
    try {
        yield put({ type: FETCH_CV_BEGIN });
        const response = yield call(fetchCv, { kandidatnr: action.arenaKandidatnr });

        yield put({ type: FETCH_CV_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({ type: FETCH_CV_NOT_FOUND });
            } else {
                yield put({ type: FETCH_CV_FAILURE, error: e });
            }
        } else {
            throw e;
        }
    }
}

function* dispatchGenerellErrorAction(action) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

export const cvSaga = function* cvSaga() {
    yield takeLatest(FETCH_CV, fetchCvForKandidat);
    yield takeLatest(FETCH_CV_FAILURE, dispatchGenerellErrorAction);
};
