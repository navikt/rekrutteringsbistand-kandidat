import { Nettressurs, senderInn } from '../../api/Nettressurs';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiError, feil, ikkeLastet, lasterInn, suksess } from '../../api/Nettressurs';
import { CvAction, CvActionType, FetchCvSuccessAction } from '../cv/reducer/cvReducer';
import {
    deleteMidlertidigUtilgjengelig,
    fetchMidlertidigUtilgjengelig,
    postMidlertidigUtilgjengelig,
    putMidlertidigUtilgjengelig,
} from '../../api/api';
import { SearchApiError } from '../../api/fetchUtils';

export enum MidlertidigUtilgjengeligActionType {
    FetchMidlertidigUtilgjengelig = 'FETCH_MIDLERTIDIG_UTILGJENGELIG',
    FetchMidlertidigUtilgjengeligSuccess = 'FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS',
    FetchMidlertidigUtilgjengeligFailure = 'FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
    LagreMidlertidigUtilgjengelig = 'LAGRE_MIDLERTIDIG_UTILGJENGELIG',
    LagreMidlertidigUtilgjengeligSuccess = 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS',
    LagreMidlertidigUtilgjengeligFailure = 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
    EndreMidlertidigUtilgjengelig = 'ENDRE_MIDLERTIDIG_UTILGJENGELIG',
    EndreMidlertidigUtilgjengeligSuksess = 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_SUKSESS',
    EndreMidlertidigUtilgjengeligFailure = 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
    SlettMidlertidigUtilgjengelig = 'SLETT_MIDLERTIDIG_UTILGJENGELIG',
    SlettMidlertidigUtilgjengeligSuksess = 'SLETT_MIDLERTIDIG_UTILGJENGELIG_SUKSESS',
    SlettMidlertidigUtilgjengeligFailure = 'SLETT_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
}

export type FetchMidlertidigUtilgjengeligAction = {
    type: MidlertidigUtilgjengeligActionType.FetchMidlertidigUtilgjengelig;
    aktørId: string;
    kandidatnr: string;
};

export type FetchMidlertidigUtilgjengeligSuccessAction = {
    type: MidlertidigUtilgjengeligActionType.FetchMidlertidigUtilgjengeligSuccess;
    response: MidlertidigUtilgjengeligResponse;
    kandidatnr: string;
};

export type FetchMidlertidigUtilgjengeligFailureAction = {
    type: MidlertidigUtilgjengeligActionType.FetchMidlertidigUtilgjengeligFailure;
    error: ApiError;
    kandidatnr: string;
};

export type LagreMidlertidigUtilgjengeligAction = {
    type: MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengelig;
    kandidatnr: string;
    aktørId: string;
    tilDato: string;
};

export type LagreMidlertidigUtilgjengeligSuccessAction = {
    type: MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengeligSuccess;
    kandidatnr: string;
    response: MidlertidigUtilgjengeligResponse;
    endretTidspunkt: number;
};

export type LagreMidlertidigUtilgjengeligFailureAction = {
    type: MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengeligFailure;
    kandidatnr: string;
    error: ApiError;
};

export type EndreMidlertidigUtilgjengeligAction = {
    type: MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengelig;
    kandidatnr: string;
    aktørId: string;
    tilDato: string;
};
export type EndreMidlertidigUtilgjengeligSuksessAction = {
    type: MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengeligSuksess;
    kandidatnr: string;
    response: MidlertidigUtilgjengeligResponse;
    endretTidspunkt: number;
};
export type EndreMidlertidigUtilgjengeligFailureAction = {
    type: MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengeligFailure;
    kandidatnr: string;
    error: ApiError;
};

export type SlettMidlertidigUtilgjengeligAction = {
    type: MidlertidigUtilgjengeligActionType.SlettMidlertidigUtilgjengelig;
    kandidatnr: string;
    aktørId: string;
};
export type SlettMidlertidigUtilgjengeligSuksessAction = {
    type: MidlertidigUtilgjengeligActionType.SlettMidlertidigUtilgjengeligSuksess;
    kandidatnr: string;
    endretTidspunkt: number;
};
export type SlettMidlertidigUtilgjengeligFailureAction = {
    type: MidlertidigUtilgjengeligActionType.SlettMidlertidigUtilgjengeligFailure;
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
    midlertidigUtilgjengelig: MidlertidigUtilgjengeligData | null;
};

export type MidlertidigUtilgjengeligData = {
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
        case CvActionType.FetchCv: {
            return {
                ...state,
                [action.arenaKandidatnr]: ikkeLastet(),
            };
        }
        case MidlertidigUtilgjengeligActionType.FetchMidlertidigUtilgjengelig:
            return {
                ...state,
                [action.kandidatnr]: lasterInn(),
            };
        case MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengelig:
        case MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengelig: {
            return {
                ...state,
                [action.kandidatnr]: senderInn(),
            };
        }
        case MidlertidigUtilgjengeligActionType.SlettMidlertidigUtilgjengeligSuksess:
            return {
                ...state,
                [action.kandidatnr]: suksess({
                    midlertidigUtilgjengelig: null,
                }),
                endretTidspunkt: action.endretTidspunkt,
            };
        case MidlertidigUtilgjengeligActionType.FetchMidlertidigUtilgjengeligSuccess:
            return {
                ...state,
                [action.kandidatnr]: suksess(action.response),
            };
        case MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengeligSuccess:
        case MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengeligSuksess:
            return {
                ...state,
                [action.kandidatnr]: suksess(action.response),
                endretTidspunkt: action.endretTidspunkt,
            };
        case MidlertidigUtilgjengeligActionType.FetchMidlertidigUtilgjengeligFailure:
            return {
                ...state,
                [action.kandidatnr]: feil(action.error),
            };
        case MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengeligFailure:
        case MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengeligFailure:
        case MidlertidigUtilgjengeligActionType.SlettMidlertidigUtilgjengeligFailure:
            return {
                ...state,
                [action.kandidatnr]: feil(action.error),
            };
        default:
            return state;
    }
};

function* hentMidlertidigUtilgjengeligMedCvResponse(action: FetchCvSuccessAction) {
    yield hentMidlertidigUtilgjengelig(action.response.aktorId, action.response.kandidatnummer);
}

function* hentMidlertidigUtilgjengeligMedAktørId(action: FetchMidlertidigUtilgjengeligAction) {
    yield hentMidlertidigUtilgjengelig(action.aktørId, action.kandidatnr);
}

function* hentMidlertidigUtilgjengelig(aktørId: string, kandidatnr: string) {
    try {
        const response = yield call(fetchMidlertidigUtilgjengelig, aktørId);
        yield put<MidlertidigUtilgjengeligAction>({
            type: MidlertidigUtilgjengeligActionType.FetchMidlertidigUtilgjengeligSuccess,
            response,
            kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<MidlertidigUtilgjengeligAction>({
                type: MidlertidigUtilgjengeligActionType.FetchMidlertidigUtilgjengeligFailure,
                error: e,
                kandidatnr,
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
            type: MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengeligSuccess,
            kandidatnr: action.kandidatnr,
            response,
            endretTidspunkt: Date.now(),
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<MidlertidigUtilgjengeligAction>({
                type: MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengeligFailure,
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
            type: MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengeligSuksess,
            kandidatnr: action.kandidatnr,
            response,
            endretTidspunkt: Date.now(),
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<MidlertidigUtilgjengeligAction>({
                type: MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengeligFailure,
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
            type: MidlertidigUtilgjengeligActionType.SlettMidlertidigUtilgjengeligSuksess,
            kandidatnr: action.kandidatnr,
            endretTidspunkt: Date.now(),
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<MidlertidigUtilgjengeligAction>({
                type: MidlertidigUtilgjengeligActionType.SlettMidlertidigUtilgjengeligFailure,
                kandidatnr: action.kandidatnr,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

export const midlertidigUtilgjengeligSaga = function* () {
    yield takeLatest(CvActionType.FetchCvSuccess, hentMidlertidigUtilgjengeligMedCvResponse);
    yield takeLatest(
        MidlertidigUtilgjengeligActionType.FetchMidlertidigUtilgjengelig,
        hentMidlertidigUtilgjengeligMedAktørId
    );
    yield takeLatest(
        MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengelig,
        lagreMidlertidigUtilgjengelig
    );
    yield takeLatest(
        MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengelig,
        endreMidlertidigUtilgjengelig
    );
    yield takeLatest(
        MidlertidigUtilgjengeligActionType.SlettMidlertidigUtilgjengelig,
        slettMidlertidigUtilgjengelig
    );
};

export default midlertidigUtilgjengeligReducer;
