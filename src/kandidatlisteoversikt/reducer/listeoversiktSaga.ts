import { Nettstatus } from '../../api/Nettressurs';
import { KandidatsøkActionType } from '../../kandidatsøk/reducer/searchReducer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { deleteKandidatliste, fetchKandidatlister } from '../../api/api';
import AppState from '../../AppState';
import {
    ListeoversiktActionType,
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

        yield put({ type: ListeoversiktActionType.HentKandidatlisterSuccess, kandidatlister });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: ListeoversiktActionType.HentKandidatlisterFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* slettKandidatliste(action: SlettKandidatlisteAction) {
    const response = yield call(deleteKandidatliste, action.kandidatliste.kandidatlisteId);
    yield put({
        type: ListeoversiktActionType.SlettKandidatlisteFerdig,
        result: response,
        kandidatlisteTittel: action.kandidatliste.tittel,
    });
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
        [ListeoversiktActionType.HentKandidatlister, ListeoversiktActionType.SetSortering],
        hentKandidatlister
    );
    yield takeLatest([ListeoversiktActionType.HentKandidatlisterFailure], sjekkError);
    yield takeLatest([ListeoversiktActionType.SlettKandidatlisteFerdig], sjekkFerdigActionForError);
    yield takeLatest(ListeoversiktActionType.SlettKandidatliste, slettKandidatliste);
}

export default listeoversiktSaga;
