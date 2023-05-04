import AppState from '../../state/AppState';
import { ErrorActionType } from '../../state/errorReducer';
import { put, select, takeLatest } from 'redux-saga/effects';
import { fetchKandidatlister } from '../../api/api';
import { ListeoversiktActionType } from './ListeoversiktAction';
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

function* sjekkError() {
    yield put({ type: ErrorActionType.VisError });
}

function* listeoversiktSaga() {
    yield takeLatest(
        [ListeoversiktActionType.HentKandidatlister, ListeoversiktActionType.SetSortering],
        hentKandidatlister
    );
    yield takeLatest([ListeoversiktActionType.HentKandidatlisterFailure], sjekkError);
}

export default listeoversiktSaga;
