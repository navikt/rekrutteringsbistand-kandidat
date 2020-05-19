import { Utfall } from '../../kandidatlister/kandidatliste/kandidatrad/KandidatRad';
import { Status } from '../../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { ApiError, Feil, LasterInn, Nettressurs, Suksess } from '../../../felles/common/remoteData';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchKandidatlisterForKandidat, fetchMidlertidigUtilgjengelig } from '../../api';
import { SearchApiError } from '../../../felles/api';
import { MidlertidigUtilgjengeligAction } from '../midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { CvActionType } from '../cv/reducer/cvReducer';

export interface KandidatlisteForKandidat {
    kandidatnr: string;
    fornavn: string;
    etternavn: string;
    lagtTilTidspunkt: string;
    lagtTilAvIdent: string;
    lagtTilAvEpost: string;
    lagtTilAvNavn: string;
    status: Status;
    utfall: Utfall;
    uuid: string;
    tittel: string;
    organisasjonReferanse?: string;
    organisasjonNavn?: string;
    stillingId?: string;
    slettet?: boolean;
}

type KandidatlisterForKandidatResponse = KandidatlisteForKandidat[];
export type HistorikkState = {
    kandidatlisterForKandidat: Nettressurs<KandidatlisterForKandidatResponse>;
};

enum KandidatlisterForKandidatActionType {
    Fetch = 'FETCH_KANDIDATLISTER_FOR_KANDIDAT',
    FetchSuccess = 'FETCH_KANDIDATLISTER_FOR_KANDIDAT_SUCCESS',
    FetchFailure = 'FETCH_KANDIDATLISTER_FOR_KANDIDAT_FAILURE',
}

export type FetchKandidatlisterForKandidatAction = {
    type: KandidatlisterForKandidatActionType.Fetch;
    kandidatnr: string;
    inkluderSlettede?: boolean;
    filtrerPåStilling?: string;
};

export type FetchMidlertidigUtilgjengeligSuccessAction = {
    type: KandidatlisterForKandidatActionType.FetchSuccess;
    response: KandidatlisterForKandidatResponse;
};

export type FetchMidlertidigUtilgjengeligFailureAction = {
    type: KandidatlisterForKandidatActionType.FetchFailure;
    error: ApiError;
};

type HistorikkAction =
    | FetchKandidatlisterForKandidatAction
    | FetchMidlertidigUtilgjengeligSuccessAction
    | FetchMidlertidigUtilgjengeligFailureAction;

export const historikkReducer = (
    state: HistorikkState,
    action: HistorikkAction
): HistorikkState => {
    switch (action.type) {
        case KandidatlisterForKandidatActionType.Fetch:
            return {
                ...state,
                kandidatlisterForKandidat: LasterInn(),
            };
        case KandidatlisterForKandidatActionType.FetchSuccess:
            return {
                ...state,
                kandidatlisterForKandidat: Suksess(action.response),
            };
        case KandidatlisterForKandidatActionType.FetchFailure:
            return {
                ...state,
                kandidatlisterForKandidat: Feil(action.error),
            };
        default:
            return state;
    }
};

function* hentKandidatlisterForKandidat(
    kandidatnr: string,
    inkluderSlettede?: boolean,
    filtrerPåStilling?: string
) {
    try {
        const response = yield call(
            fetchKandidatlisterForKandidat,
            kandidatnr,
            inkluderSlettede,
            filtrerPåStilling
        );
        yield put<HistorikkAction>({
             type: KandidatlisterForKandidatActionType.FetchSuccess,
             response
        })
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put<HistorikkAction>({
                type: KandidatlisterForKandidatActionType.FetchFailure,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

export const historikkSaga = function* () {
     yield takeLatest(KandidatlisterForKandidatActionType.Fetch, hentKandidatlisterForKandidat);
};
