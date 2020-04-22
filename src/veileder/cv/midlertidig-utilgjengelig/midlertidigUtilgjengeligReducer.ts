import {
    FinnesIkke,
    Nettressurs,
    Nettstatus,
    SenderInn,
} from './../../../felles/common/remoteData';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiError, Feil, IkkeLastet, LasterInn, Suksess } from '../../../felles/common/remoteData';
import { CvAction, CvActionType, FetchCvSuccessAction } from '../reducer/cvReducer';
import {
    deleteMidlertidigUtilgjengelig,
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
    kandidatnr: string;
    response: MidlertidigUtilgjengeligResponse;
};

export type LagreMidlertidigUtilgjengeligFailureAction = {
    type: 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE';
    kandidatnr: string;
    error: ApiError;
};

export type EndreMidlertidigUtilgjengeligAction = {
    type: 'ENDRE_MIDLERTIDIG_UTILGJENGELIG';
    kandidatnr: string;
    aktørId: string;
    tilDato: string;
};
export type EndreMidlertidigUtilgjengeligSuksessAction = {
    type: 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_SUKSESS';
    kandidatnr: string;
    response: MidlertidigUtilgjengeligResponse;
};
export type EndreMidlertidigUtilgjengeligFailureAction = {
    type: 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE';
    kandidatnr: string;
    error: ApiError;
};

export type SlettMidlertidigUtilgjengeligAction = {
    type: 'SLETT_MIDLERTIDIG_UTILGJENGELIG';
    kandidatnr: string;
    aktørId: string;
};
export type SlettMidlertidigUtilgjengeligSuksessAction = {
    type: 'SLETT_MIDLERTIDIG_UTILGJENGELIG_SUKSESS';
    kandidatnr: string;
};
export type SlettMidlertidigUtilgjengeligFailureAction = {
    type: 'SLETT_MIDLERTIDIG_UTILGJENGELIG_FAILURE';
    kandidatnr: string;
    error: ApiError;
};

export type MidlertidigUtilgjengeligAction =
    | FetchMidlertidigUtilgjengeligAction
    | FetchMidlertidigUtilgjengeligSuccessAction
    | FetchMidlertidigUtilgjengeligFailureAction
    | LagreMidlertidigUtilgjengeligAction
    | LagreMidlertidigUtilgjengeligSuccessAction
    | LagreMidlertidigUtilgjengeligFailureAction
    | EndreMidlertidigUtilgjengeligAction
    | EndreMidlertidigUtilgjengeligSuksessAction
    | EndreMidlertidigUtilgjengeligFailureAction
    | SlettMidlertidigUtilgjengeligAction
    | SlettMidlertidigUtilgjengeligSuksessAction
    | SlettMidlertidigUtilgjengeligFailureAction;

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
    [kandidatNr: string]: Nettressurs<MidlertidigUtilgjengeligResponse>;
};

const midlertidigUtilgjengeligReducer = (
    state: MidlertidigUtilgjengeligState = {},
    action: MidlertidigUtilgjengeligAction | CvAction
) => {
    switch (action.type) {
        case CvActionType.FETCH_CV: {
            return {
                ...state,
                [action.arenaKandidatnr]: IkkeLastet(),
            };
        }
        case CvActionType.FETCH_CV_SUCCESS:
            return {
                ...state,
                [action.response.kandidatnummer]: LasterInn(),
            };
        case 'LAGRE_MIDLERTIDIG_UTILGJENGELIG':
        case 'ENDRE_MIDLERTIDIG_UTILGJENGELIG': {
            const kandidat = state[action.kandidatnr];
            let data: MidlertidigUtilgjengeligResponse | undefined = undefined;

            if (kandidat && kandidat.kind === Nettstatus.Suksess) {
                data = kandidat.data;
            }

            return {
                ...state,
                [action.kandidatnr]: SenderInn(data),
            };
        }
        case 'SLETT_MIDLERTIDIG_UTILGJENGELIG_SUKSESS':
            return {
                ...state,
                [action.kandidatnr]: FinnesIkke(),
            };
        case 'FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS':
        case 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS':
        case 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_SUKSESS':
            return {
                ...state,
                [action.kandidatnr]: Suksess(action.response),
            };
        case 'FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE':
            return {
                ...state,
                [action.kandidatnr]:
                    action.error.status === 404 ? FinnesIkke() : Feil(action.error),
            };
        case 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE':
        case 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE':
        case 'SLETT_MIDLERTIDIG_UTILGJENGELIG_FAILURE':
            return {
                ...state,
                [action.kandidatnr]: Feil(action.error),
            };
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
            kandidatnr: action.kandidatnr,
            response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<MidlertidigUtilgjengeligAction>({
                type: 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
                kandidatnr: action.kandidatnr,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* endreMidlertidigUtilgjengelig(action: EndreMidlertidigUtilgjengeligAction) {
    try {
        const response = yield call(putMidlertidigUtilgjengelig, action.aktørId, action.tilDato);

        yield put<MidlertidigUtilgjengeligAction>({
            type: 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_SUKSESS',
            kandidatnr: action.kandidatnr,
            response,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<MidlertidigUtilgjengeligAction>({
                type: 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
                kandidatnr: action.kandidatnr,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* slettMidlertidigUtilgjengelig(action: SlettMidlertidigUtilgjengeligAction) {
    try {
        yield call(deleteMidlertidigUtilgjengelig, action.aktørId);
        yield put<MidlertidigUtilgjengeligAction>({
            type: 'SLETT_MIDLERTIDIG_UTILGJENGELIG_SUKSESS',
            kandidatnr: action.kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<MidlertidigUtilgjengeligAction>({
                type: 'SLETT_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
                kandidatnr: action.kandidatnr,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

export const midlertidigUtilgjengeligSaga = function* () {
    yield takeLatest(CvActionType.FETCH_CV_SUCCESS, fetchMidlertidigUtilgjengeligMedAktørId);
    yield takeLatest('LAGRE_MIDLERTIDIG_UTILGJENGELIG', lagreMidlertidigUtilgjengelig);
    yield takeLatest('ENDRE_MIDLERTIDIG_UTILGJENGELIG', endreMidlertidigUtilgjengelig);
    yield takeLatest('SLETT_MIDLERTIDIG_UTILGJENGELIG', slettMidlertidigUtilgjengelig);
};

export default midlertidigUtilgjengeligReducer;
