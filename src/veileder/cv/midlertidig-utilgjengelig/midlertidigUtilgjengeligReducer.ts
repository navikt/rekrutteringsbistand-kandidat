import { call, put, takeLatest } from 'redux-saga/effects';
import {
    RemoteData,
    ApiError,
    NotAsked,
    Success,
    Failure,
    Loading,
} from '../../../felles/common/remoteData';
import { CvActionType, CvAction, FetchCvSuccessAction } from '../reducer/cvReducer';
import {
    fetchMidlertidigUtilgjengelig,
    postMidlertidigUtilgjengelig,
    putMidlertidigUtilgjengelig,
} from '../../api';
import { SearchApiError } from '../../../felles/api';

export type FetchMidlertidigUtilgjengeligAction = {
    type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG';
    aktørId: string;
};

export type FetchMidlertidigUtilgjengeligSuccessAction = {
    type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS';
    response: MidlertidigUtilgjengeligResponse;
    kandidatnr: string;
};

export type FetchMidlertidigUtilgjengeligFailureAction = {
    type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE';
    error: ApiError;
    kandidatnr: string;
};

export type LagreMidlertidigUtilgjengeligAction = {
    type: 'LAGRE_MIDLERTIDIG_UTILGJENGELIG';
    kandidatnr: string;
    aktørId: string;
    tilDato: string;
};

export type LagreMidlertidigUtilgjengeligSuccessAction = {
    type: 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS';
    response: MidlertidigUtilgjengeligResponse;
};

export type LagreMidlertidigUtilgjengeligFailureAction = {
    type: 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE';
    error: ApiError;
};

export type ForlengMidlertidigUtilgjengeligAction = {
    type: 'FORLENG_MIDLERTIDIG_UTILGJENGELIG';
    kandidatnr: string;
    aktørId: string;
    tilDato: string;
};
export type ForlengMidlertidigUtilgjengeligSuksessAction = {
    type: 'FORLENG_MIDLERTIDIG_UTILGJENGELIG_SUKSESS';
    response: MidlertidigUtilgjengeligResponse;
};
export type ForlengMidlertidigUtilgjengeligFailureAction = {
    type: 'FORLENG_MIDLERTIDIG_UTILGJENGELIG_FAILURE';
    error: ApiError;
};

export type MidlertidigUtilgjengeligAction =
    | FetchMidlertidigUtilgjengeligAction
    | FetchMidlertidigUtilgjengeligSuccessAction
    | FetchMidlertidigUtilgjengeligFailureAction
    | LagreMidlertidigUtilgjengeligAction
    | LagreMidlertidigUtilgjengeligSuccessAction
    | LagreMidlertidigUtilgjengeligFailureAction
    | ForlengMidlertidigUtilgjengeligAction
    | ForlengMidlertidigUtilgjengeligSuksessAction
    | ForlengMidlertidigUtilgjengeligFailureAction;

export type MidlertidigUtilgjengeligResponse = {
    aktørId: string;
    fraDato: Date;
    tilDato: Date;
    registrertAvIdent: string;
    registrertAvNavn: string;
    sistEndretAvIdent: string | null;
    sistEndretAvNavn: string | null;
};

export type MidlertidigUtilgjengeligState = {
    [kandidatNr: string]: RemoteData<MidlertidigUtilgjengeligResponse>;
};

const midlertidigUtilgjengeligReducer = (
    state: MidlertidigUtilgjengeligState = {},
    action: MidlertidigUtilgjengeligAction | CvAction
) => {
    switch (action.type) {
        case CvActionType.FETCH_CV: {
            return {
                ...state,
                [action.arenaKandidatnr]: NotAsked(),
            };
        }
        case CvActionType.FETCH_CV_SUCCESS:
            return {
                ...state,
                [action.response.kandidatnummer]: Loading(),
            };
        case 'FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS':
            return {
                ...state,
                [action.kandidatnr]: Success(action.response),
            };
        case 'FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE':
            return {
                ...state,
                [action.kandidatnr]: Failure(action.error),
            };
        // case MidlertidigUtilgjengeligActionType.LAGRE_MIDLERTIDIG_UTILGJENGELIG:
        // case MidlertidigUtilgjengeligActionType.FORLENG_MIDLERTIDIG_UTILGJENGELIG:
        //     return {
        //         ...state,
        //         midlertidigUtilgjengelig: {
        //             ...state.midlertidigUtilgjengelig,
        //             [action.kandidatnr]: Nettstatus.
        //         },
        //     }
        default:
            return state;
    }
};

function* fetchMidlertidigUtilgjengeligMedAktørId(action: FetchCvSuccessAction) {
    try {
        const response = yield call(fetchMidlertidigUtilgjengelig, action.response.aktorId);
        yield put<MidlertidigUtilgjengeligAction>({
            type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS',
            response,
            kandidatnr: action.response.kandidatnummer,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<MidlertidigUtilgjengeligAction>({
                type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
                error: e,
                kandidatnr: action.response.kandidatnummer,
            });
        } else {
            throw e;
        }
    }
}

function* lagreMidlertidigUtilgjengelig(action: LagreMidlertidigUtilgjengeligAction) {
    try {
        const response = yield call(postMidlertidigUtilgjengelig, action.aktørId, action.tilDato);
        yield put<MidlertidigUtilgjengeligAction>({
            type: 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS',
            response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE', error: e });
        } else {
            throw e;
        }
    }
}

function* forlengMidlertidigUtilgjengelig(action: ForlengMidlertidigUtilgjengeligAction) {
    try {
        const response = yield call(putMidlertidigUtilgjengelig, action.aktørId, action.tilDato);
        yield put({ type: 'FORLENG_MIDLERTIDIG_UTILGJENGELIG_SUCCESS', response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: 'FORLENG_MIDLERTIDIG_UTILGJENGELIG_FAILURE', error: e });
        } else {
            throw e;
        }
    }
}

export const midlertidigUtilgjengeligSaga = function* () {
    yield takeLatest(CvActionType.FETCH_CV_SUCCESS, fetchMidlertidigUtilgjengeligMedAktørId);
    yield takeLatest('LAGRE_MIDLERTIDIG_UTILGJENGELIG', lagreMidlertidigUtilgjengelig);
    yield takeLatest('FORLENG_MIDLERTIDIG_UTILGJENGELIG', forlengMidlertidigUtilgjengelig);
};

export default midlertidigUtilgjengeligReducer;
