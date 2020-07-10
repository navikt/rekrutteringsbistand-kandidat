import { Nettstatus } from '../../../felles/common/remoteData';
import { SearchApiError } from '../../../felles/api';
import { INVALID_RESPONSE_STATUS } from '../../sok/searchReducer';
import { select, put, takeLatest, call } from 'redux-saga/effects';
import { fetchKandidatlister, deleteKandidatliste, endreEierskapPaKandidatliste } from '../../api';
import AppState from '../../AppState';
import {
    ListeoversiktActionType,
    SlettKandidatlisteAction,
    SlettKandidatlisteFerdigAction,
} from './ListeoversiktAction';

function* hentKandidatlister() {
    const state: AppState = yield select();
    try {
        const kandidatlister = yield fetchKandidatlister(state.listeoversikt.søkekriterier);
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

function* markerKandidatlisteSomMin(action) {
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
    yield put({ type: INVALID_RESPONSE_STATUS });
}

function* sjekkFerdigActionForError(action: SlettKandidatlisteFerdigAction) {
    if (action.result.kind === Nettstatus.Feil) {
        yield put({ type: INVALID_RESPONSE_STATUS, error: action.result.error });
    }
}

function* listeoversiktSaga() {
    yield takeLatest(ListeoversiktActionType.HENT_KANDIDATLISTER, hentKandidatlister);
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
