import { Kandidatstatus, Kandidatutfall, Utfallsendring } from '../kandidatliste/domene/Kandidat';
import { ApiError, feil, ikkeLastet, lasterInn, Nettressurs, suksess } from '../api/Nettressurs';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchKandidatlisterForKandidat } from '../api/api';
import { SearchApiError } from '../api/fetchUtils';

export interface KandidatlisteForKandidat {
    kandidatnr: string;
    fornavn: string;
    etternavn: string;
    lagtTilTidspunkt: string;
    lagtTilAvIdent: string;
    lagtTilAvEpost: string;
    lagtTilAvNavn: string;
    status: Kandidatstatus;
    utfall: Kandidatutfall;
    uuid: string;
    tittel: string;
    organisasjonReferanse?: string;
    organisasjonNavn?: string;
    stillingId?: string;
    slettet?: boolean;
    antallStillinger?: number;
    utfallsendringer: Utfallsendring[];
}

type KandidatlisterForKandidatResponse = KandidatlisteForKandidat[];
export type HistorikkState = {
    kandidatlisterForKandidat: Nettressurs<KandidatlisterForKandidatResponse>;
};

export enum KandidatlisterForKandidatActionType {
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

type FetchKandidatlisterForKandidatSuccessAction = {
    type: KandidatlisterForKandidatActionType.FetchSuccess;
    response: KandidatlisterForKandidatResponse;
};

type FetchKandidatlisterForKandidatFailureAction = {
    type: KandidatlisterForKandidatActionType.FetchFailure;
    error: ApiError;
};

type HistorikkAction =
    | FetchKandidatlisterForKandidatAction
    | FetchKandidatlisterForKandidatSuccessAction
    | FetchKandidatlisterForKandidatFailureAction;

const initialState: HistorikkState = { kandidatlisterForKandidat: ikkeLastet() };

export const historikkReducer = (
    state: HistorikkState = initialState,
    action: HistorikkAction
): HistorikkState => {
    switch (action.type) {
        case KandidatlisterForKandidatActionType.Fetch:
            return {
                ...state,
                kandidatlisterForKandidat: lasterInn(),
            };
        case KandidatlisterForKandidatActionType.FetchSuccess:
            return {
                ...state,
                kandidatlisterForKandidat: suksess(action.response),
            };
        case KandidatlisterForKandidatActionType.FetchFailure:
            return {
                ...state,
                kandidatlisterForKandidat: feil(action.error),
            };
        default:
            return state;
    }
};

function* hentKandidatlisterForKandidat(action: FetchKandidatlisterForKandidatAction) {
    try {
        const response = yield call(
            fetchKandidatlisterForKandidat,
            action.kandidatnr,
            action.inkluderSlettede,
            action.filtrerPåStilling
        );
        yield put<HistorikkAction>({
            type: KandidatlisterForKandidatActionType.FetchSuccess,
            response,
        });
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
