import { Nettstatus } from '../../api/remoteData';
import { KandidatsøkActionType } from '../../kandidatsøk/reducer/searchActions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    deleteKandidatliste,
    endreEierskapPaKandidatliste,
    fetchKandidatlister,
} from '../../api/api';
import AppState from '../../AppState';
import {
    ListeoversiktActionType,
    MarkerKandidatlisteSomMinAction,
    SlettKandidatlisteAction,
    SlettKandidatlisteFerdigAction,
} from './ListeoversiktAction';
import { SearchApiError } from '../../api/fetchUtils';

function* hentKandidatlister() {
    const state: AppState = yield select();
    try {
        let mergedQuery = {
            ...state.listeoversikt.søkekriterier,
            ...state.listeoversikt.sortering,
        };
        const kandidatlister = yield fetchKandidatlister(mergedQuery);
        yield put({ type: ListeoversiktActionType.HENT_KANDIDATLISTER_SUCCESS, kandidatlister });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: ListeoversiktActionType.HENT_KANDIDATLISTER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* slettKandidatliste(action: SlettKandidatlisteAction) {
    const response = yield call(deleteKandidatliste, action.kandidatliste.kandidatlisteId);
    yield put({
        type: ListeoversiktActionType.SLETT_KANDIDATLISTE_FERDIG,
        result: response,
        kandidatlisteTittel: action.kandidatliste.tittel,
    });
}

function* markerKandidatlisteSomMin(action: MarkerKandidatlisteSomMinAction) {
    try {
        yield endreEierskapPaKandidatliste(action.kandidatlisteId);
        yield put({ type: ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE,
                error: e,
            });
        } else {
            throw e;
        }
    }
}

function* sjekkError() {
    yield put({ type: KandidatsøkActionType.InvalidResponseStatus });
}

function* sjekkFerdigActionForError(action: SlettKandidatlisteFerdigAction) {
    if (action.result.kind === Nettstatus.Feil) {
        yield put({
            type: KandidatsøkActionType.InvalidResponseStatus,
            error: action.result.error,
        });
    }
}

function* listeoversiktSaga() {
    yield takeLatest(
        [ListeoversiktActionType.HENT_KANDIDATLISTER, ListeoversiktActionType.SET_SORTERING],
        hentKandidatlister
    );
    yield takeLatest(
        [
            ListeoversiktActionType.HENT_KANDIDATLISTER_FAILURE,
            ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN_FAILURE,
        ],
        sjekkError
    );
    yield takeLatest(
        [ListeoversiktActionType.SLETT_KANDIDATLISTE_FERDIG],
        sjekkFerdigActionForError
    );
    yield takeLatest(
        ListeoversiktActionType.MARKER_KANDIDATLISTE_SOM_MIN,
        markerKandidatlisteSomMin
    );
    yield takeLatest(ListeoversiktActionType.SLETT_KANDIDATLISTE, slettKandidatliste);
}

export default listeoversiktSaga;
