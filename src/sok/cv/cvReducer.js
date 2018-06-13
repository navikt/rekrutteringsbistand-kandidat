import { call, put, takeLatest } from 'redux-saga/effects';
import { SearchApiError, fetchCv } from '../api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_CV = 'FETCH_CV';
export const FETCH_CV_BEGIN = 'FETCH_CV_BEGIN';
export const FETCH_CV_SUCCESS = 'FETCH_CV_SUCCESS';
export const FETCH_CV_FAILURE = 'FETCH_CV_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    cv: {
        utdanning: [],
        yrkeserfaring: [],
        kurs: [],
        sertifikat: [],
        sprak: []
    },
    isFetchingCv: false
};

export default function cvReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CV_BEGIN:
            return {
                ...state,
                isFetchingCv: true
            };
        case FETCH_CV_SUCCESS:
            return {
                ...state,
                isFetchingCv: false,
                cv: action.response
            };
        case FETCH_CV_FAILURE:
            return {
                ...state,
                isFetchingCv: false,
                error: action.error
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
            yield put({ type: FETCH_CV_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const cvSaga = function* cvSaga() {
    yield takeLatest(FETCH_CV, fetchCvForKandidat);
};
