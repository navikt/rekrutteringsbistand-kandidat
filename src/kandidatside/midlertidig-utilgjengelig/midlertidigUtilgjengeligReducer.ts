import { Nettressurs, Nettstatus, senderInn } from '../../api/remoteData';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiError, feil, ikkeLastet, lasterInn, suksess } from '../../api/remoteData';
import { CvAction, CvActionType, FetchCvSuccessAction } from '../cv/reducer/cvReducer';
import {
    deleteMidlertidigUtilgjengelig,
    fetchMidlertidigUtilgjengelig,
    postMidlertidigUtilgjengelig,
    putMidlertidigUtilgjengelig,
} from '../../api/api';
import { SearchApiError } from '../../api/fetchUtils';

export type FetchMidlertidigUtilgjengeligAction = {
    type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG';
    aktørId: string;
    kandidatnr: string;
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
    endretTidspunkt: number;
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
    endretTidspunkt: number;
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
    endretTidspunkt: number;
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
        case 'FETCH_MIDLERTIDIG_UTILGJENGELIG':
            return {
                ...state,
                [action.kandidatnr]: lasterInn(),
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
                [action.kandidatnr]: senderInn(data),
            };
        }
        case 'SLETT_MIDLERTIDIG_UTILGJENGELIG_SUKSESS':
            return {
                ...state,
                [action.kandidatnr]: suksess({
                    midlertidigUtilgjengelig: null,
                }),
                endretTidspunkt: action.endretTidspunkt,
            };
        case 'FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS':
            return {
                ...state,
                [action.kandidatnr]: suksess(action.response),
            };
        case 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS':
        case 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_SUKSESS':
            return {
                ...state,
                [action.kandidatnr]: suksess(action.response),
                endretTidspunkt: action.endretTidspunkt,
            };
        case 'FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE':
            return {
                ...state,
                [action.kandidatnr]: feil(action.error),
            };
        case 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE':
        case 'ENDRE_MIDLERTIDIG_UTILGJENGELIG_FAILURE':
        case 'SLETT_MIDLERTIDIG_UTILGJENGELIG_FAILURE':
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
            type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG_SUCCESS',
            response,
            kandidatnr,
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<MidlertidigUtilgjengeligAction>({
                type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG_FAILURE',
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
            type: 'LAGRE_MIDLERTIDIG_UTILGJENGELIG_SUCCESS',
            kandidatnr: action.kandidatnr,
            response,
            endretTidspunkt: Date.now(),
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
            endretTidspunkt: Date.now(),
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
            endretTidspunkt: Date.now(),
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
    yield takeLatest(CvActionType.FetchCvSuccess, hentMidlertidigUtilgjengeligMedCvResponse);
    yield takeLatest('FETCH_MIDLERTIDIG_UTILGJENGELIG', hentMidlertidigUtilgjengeligMedAktørId);
    yield takeLatest('LAGRE_MIDLERTIDIG_UTILGJENGELIG', lagreMidlertidigUtilgjengelig);
    yield takeLatest('ENDRE_MIDLERTIDIG_UTILGJENGELIG', endreMidlertidigUtilgjengelig);
    yield takeLatest('SLETT_MIDLERTIDIG_UTILGJENGELIG', slettMidlertidigUtilgjengelig);
};

export default midlertidigUtilgjengeligReducer;
