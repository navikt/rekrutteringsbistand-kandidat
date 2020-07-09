import { SearchApiError } from './../../felles/api';
import { INVALID_RESPONSE_STATUS } from './../sok/searchReducer';
import { ListeoversiktActionType } from './listeoversiktReducer';
import { select, put, takeLatest } from 'redux-saga/effects';
import { fetchKandidatlister } from './../api';
import AppState from '../AppState';

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

function* sjekkError() {
    yield put({ type: INVALID_RESPONSE_STATUS });
}

function* listeoversiktSaga() {
    yield takeLatest(ListeoversiktActionType.HENT_KANDIDATLISTER, hentKandidatlister);
    yield takeLatest(ListeoversiktActionType.HENT_KANDIDATLISTER_FAILURE, sjekkError);
}

export default listeoversiktSaga;
