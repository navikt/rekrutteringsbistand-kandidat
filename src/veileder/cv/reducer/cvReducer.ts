import {
    RemoteData,
    NotAsked,
    Loading,
    ApiError,
    Success,
    Failure,
} from './../../../felles/common/remoteData';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchCv, fetchMidlertidigUtilgjengelig, postMidlertidigUtilgjengelig } from '../../api';
import { INVALID_RESPONSE_STATUS } from '../../sok/searchReducer';
import { SearchApiError } from '../../../felles/api';

export enum CvActionType {
    FETCH_CV = 'FETCH_CV',
    FETCH_CV_BEGIN = 'FETCH_CV_BEGIN',
    FETCH_CV_SUCCESS = 'FETCH_CV_SUCCESS',
    FETCH_CV_NOT_FOUND = 'FETCH_CV_NOT_FOUND',
    FETCH_CV_FAILURE = 'FETCH_CV_FAILURE',
    FETCH_MIDLERTIDIG_UTILGJENGELIG = 'FETCH_MIDLERTIDIG_UTILGJENGELIG',
    FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS = 'FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS',
    FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE = 'FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
    LAGRE_MIDLERTIDIG_UTILGJENGELIG = 'LAGRE_MIDLERTIDIG_UTILGJENGELIG',
    LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS = 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS',
    LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE = 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
}

export type FetchCvAction = {
    type: CvActionType.FETCH_CV;
    arenaKandidatnr: string;
    profilId?: string; // Er denne depracated? Brukes ikke i API.
};

export type FetchCvBeginAction = {
    type: CvActionType.FETCH_CV_BEGIN;
};

export type FetchCvSuccessAction = {
    type: CvActionType.FETCH_CV_SUCCESS;
    response: Cv;
};

export type FetchCvNotFoundAction = {
    type: CvActionType.FETCH_CV_NOT_FOUND;
};

export type FetchCvFailureAction = {
    type: CvActionType.FETCH_CV_FAILURE;
};

export type FetchMidlertidigUtilgjengeligAction = {
    type: CvActionType.FETCH_MIDLERTIDIG_UTILGJENGELIG;
    aktørId: string;
};

export type FetchMidlertidigUtilgjengeligSuccessAction = {
    type: CvActionType.FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS;
    response: MidlertidigUtilgjengelig;
    kandidatnummer: string;
};

export type FetchMidlertidigUtilgjengeligFailureAction = {
    type: CvActionType.FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE;
    error: ApiError;
    kandidatnummer: string;
};

export type LagreMidlertidigUtilgjengeligAction = {
    type: CvActionType.LAGRE_MIDLERTIDIG_UTILGJENGELIG;
    aktørId: string;
    tilDato: string;
};

export type LagreMidlertidigUtilgjengeligSuccessAction = {
    type: CvActionType.LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS;
    response: MidlertidigUtilgjengelig;
};

export type LagreMidlertidigUtilgjengeligFailureAction = {
    type: CvActionType.LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE;
    error: ApiError;
};

export type CvAction =
    | FetchCvAction
    | FetchCvBeginAction
    | FetchCvSuccessAction
    | FetchCvNotFoundAction
    | FetchCvFailureAction
    | FetchMidlertidigUtilgjengeligAction
    | FetchMidlertidigUtilgjengeligSuccessAction
    | FetchMidlertidigUtilgjengeligFailureAction
    | LagreMidlertidigUtilgjengeligAction
    | LagreMidlertidigUtilgjengeligSuccessAction
    | LagreMidlertidigUtilgjengeligFailureAction;

export enum HentCvStatus {
    IkkeHentet = 'IKKE_HENTET',
    Loading = 'LOADING',
    Success = 'SUCCESS',
    FinnesIkke = 'FINNES_IKKE',
}

export type Cv = {
    aktorId: string;
    kandidatnummer: string;

    utdanning: any[];
    yrkeserfaring: any[];
    kurs: any[];
    sertifikater: any[];
    sprak: any[];

    // TODO: Typesette resten av CV.
};

export type MidlertidigUtilgjengelig = {
    aktørId: string;
    fraDato: Date;
    tilDato: Date;
    registrertAvIdent: string;
    registrertAvNavn: string;
    sistEndretAvIdent: string;
    sistEndretAvNavn: string;
};

export type CvState = {
    cv: Cv;
    hentStatus: HentCvStatus;
    midlertidigUtilgjengelig: {
        [kandidatNr: string]: RemoteData<MidlertidigUtilgjengelig>;
    };
};

const initialState: CvState = {
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
    midlertidigUtilgjengelig: {},
};

export default function cvReducer(state: CvState = initialState, action: CvAction) {
    switch (action.type) {
        case CvActionType.FETCH_CV:
            return {
                ...state,
                hentStatus: HentCvStatus.Loading,
                midlertidigUtilgjengelig: {
                    ...state.midlertidigUtilgjengelig,
                    [action.arenaKandidatnr]: NotAsked(),
                },
            };
        case CvActionType.FETCH_CV_SUCCESS:
            return {
                ...state,
                cv: action.response,
                hentStatus: HentCvStatus.Success,
                midlertidigUtilgjengelig: {
                    ...state.midlertidigUtilgjengelig,
                    [action.response.kandidatnummer]: Loading(),
                },
            };
        case CvActionType.FETCH_CV_NOT_FOUND:
            return {
                ...state,
                hentStatus: HentCvStatus.FinnesIkke,
            };
        case CvActionType.FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS:
            return {
                ...state,
                midlertidigUtilgjengelig: {
                    ...state.midlertidigUtilgjengelig,
                    [action.kandidatnummer]: Success(action.response),
                },
            };
        case CvActionType.FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE:
            return {
                ...state,
                midlertidigUtilgjengelig: {
                    ...state.midlertidigUtilgjengelig,
                    [action.kandidatnummer]: Failure(action.error),
                },
            };
        default:
            return state;
    }
}

function* fetchCvForKandidat(action: FetchCvAction) {
    try {
        const response = yield call(fetchCv, { kandidatnr: action.arenaKandidatnr });
        yield put({ type: CvActionType.FETCH_CV_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({ type: CvActionType.FETCH_CV_NOT_FOUND });
            } else {
                yield put({ type: CvActionType.FETCH_CV_FAILURE, error: e });
            }
        } else {
            throw e;
        }
    }
}

function* fetchMidlertidigUtilgjengeligMedAktørId(action: FetchCvSuccessAction) {
    try {
        const response = yield call(fetchMidlertidigUtilgjengelig, action.response.aktorId);
        yield put({
            type: CvActionType.FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS,
            response,
            kandidatnummer: action.response.kandidatnummer,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: CvActionType.FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE,
                error: e,
                kandidatnummer: action.response.kandidatnummer,
            });
        } else {
            throw e;
        }
    }
}

function* lagreMidlertidigUtilgjengelig(action: LagreMidlertidigUtilgjengeligAction) {
    try {
        const response = yield call(postMidlertidigUtilgjengelig, action.aktørId, action.tilDato);
        yield put({ type: CvActionType.LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: CvActionType.LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* dispatchGenerellErrorAction(action: any) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

export const cvSaga = function* cvSaga() {
    yield takeLatest(CvActionType.FETCH_CV, fetchCvForKandidat);
    yield takeLatest(CvActionType.FETCH_CV_FAILURE, dispatchGenerellErrorAction);
    yield takeLatest(CvActionType.FETCH_CV_SUCCESS, fetchMidlertidigUtilgjengeligMedAktørId);
    yield takeLatest(CvActionType.LAGRE_MIDLERTIDIG_UTILGJENGELIG, lagreMidlertidigUtilgjengelig);
};
