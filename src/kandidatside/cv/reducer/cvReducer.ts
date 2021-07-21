import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiError, Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import { fetchCv } from '../../../api/api';
import { SearchApiError } from '../../../api/fetchUtils';
import Cv from './cv-typer';

export enum CvActionType {
    FetchCv = 'FETCH_CV',
    FetchCvBegin = 'FETCH_CV_BEGIN',
    FetchCvSuccess = 'FETCH_CV_SUCCESS',
    FetchCvNotFound = 'FETCH_CV_NOT_FOUND',
    FetchCvFailure = 'FETCH_CV_FAILURE',
}

export type FetchCvAction = {
    type: CvActionType.FetchCv;
    arenaKandidatnr: string;
};

export type FetchCvBeginAction = {
    type: CvActionType.FetchCvBegin;
};

export type FetchCvSuccessAction = {
    type: CvActionType.FetchCvSuccess;
    response: Cv;
};

export type FetchCvNotFoundAction = {
    type: CvActionType.FetchCvNotFound;
};

export type FetchCvFailureAction = {
    type: CvActionType.FetchCvFailure;
    error: ApiError;
};

export type CvAction =
    | FetchCvAction
    | FetchCvBeginAction
    | FetchCvSuccessAction
    | FetchCvNotFoundAction
    | FetchCvFailureAction;

export type CvState = {
    cv: Nettressurs<Cv>;
};

const initialState: CvState = {
    cv: {
        kind: Nettstatus.IkkeLastet,
    },
};

const cvReducer = (state: CvState = initialState, action: CvAction): CvState => {
    switch (action.type) {
        case CvActionType.FetchCv:
            return {
                ...state,
                cv: {
                    kind: Nettstatus.LasterInn,
                },
            };
        case CvActionType.FetchCvSuccess:
            return {
                ...state,
                cv: {
                    kind: Nettstatus.Suksess,
                    data: action.response,
                },
            };
        case CvActionType.FetchCvNotFound:
            return {
                ...state,
                cv: {
                    kind: Nettstatus.FinnesIkke,
                },
            };
        case CvActionType.FetchCvFailure:
            return {
                ...state,
                cv: {
                    kind: Nettstatus.Feil,
                    error: action.error,
                },
            };
        default:
            return state;
    }
};

function* fetchCvForKandidat(action: FetchCvAction) {
    try {
        const response = yield call(fetchCv, action.arenaKandidatnr);

        yield put({ type: CvActionType.FetchCvSuccess, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({ type: CvActionType.FetchCvNotFound });
            } else {
                yield put({ type: CvActionType.FetchCvFailure, error: e });
            }
        } else {
            throw e;
        }
    }
}

export const cvSaga = function* cvSaga() {
    yield takeLatest(CvActionType.FetchCv, fetchCvForKandidat);
};

export default cvReducer;
