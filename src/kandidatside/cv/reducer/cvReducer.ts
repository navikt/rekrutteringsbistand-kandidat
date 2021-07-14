import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchCv } from '../../../api/api';
import { KandidatsøkActionType } from '../../../kandidatsøk/reducer/searchActions';
import Cv from './cv-typer';
import { SearchApiError } from '../../../api/fetchUtils';

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
};

export type CvAction =
    | FetchCvAction
    | FetchCvBeginAction
    | FetchCvSuccessAction
    | FetchCvNotFoundAction
    | FetchCvFailureAction;

export enum HentCvStatus {
    IkkeHentet = 'IKKE_HENTET',
    Loading = 'LOADING',
    Success = 'SUCCESS',
    FinnesIkke = 'FINNES_IKKE',
}

export type CvState = {
    cv: Cv;
    hentStatus: HentCvStatus;
};

const initialState: any = {
    cv: {
        aktorId: '',
        kandidatnummer: '',

        utdanning: [],
        yrkeserfaring: [],
        kurs: [],
        sertifikater: [],
        sprak: [],
    },
    hentStatus: HentCvStatus.IkkeHentet,
};

export default function cvReducer(state: CvState = initialState, action: CvAction) {
    switch (action.type) {
        case CvActionType.FetchCv:
            return {
                ...state,
                hentStatus: HentCvStatus.Loading,
            };
        case CvActionType.FetchCvSuccess:
            return {
                ...state,
                cv: action.response,
                hentStatus: HentCvStatus.Success,
            };
        case CvActionType.FetchCvNotFound:
            return {
                ...state,
                hentStatus: HentCvStatus.FinnesIkke,
            };
        default:
            return state;
    }
}

function* fetchCvForKandidat(action: FetchCvAction) {
    try {
        const response = yield call(fetchCv, { kandidatnr: action.arenaKandidatnr });
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

function* dispatchGenerellErrorAction(action: any) {
    yield put({ type: KandidatsøkActionType.InvalidResponseStatus, error: action.error });
}

export const cvSaga = function* cvSaga() {
    yield takeLatest(CvActionType.FetchCv, fetchCvForKandidat);
    yield takeLatest(CvActionType.FetchCvFailure, dispatchGenerellErrorAction);
};
