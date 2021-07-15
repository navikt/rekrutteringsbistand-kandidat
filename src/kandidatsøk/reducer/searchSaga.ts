import { call, put, select, takeLatest } from 'redux-saga/effects';
import { KANDIDATLISTE_CHUNK_SIZE } from '../../common/konstanter';
import { KandidatsøkActionType, SearchAction } from './searchActions';
import { toUrlQuery } from './searchQuery';
import {
    fetchFeatureToggles,
    fetchFerdigutfylteStillinger,
    fetchKandidater,
    fetchKandidaterES,
    postFerdigutfylteStillingerKlikk,
} from '../../api/api';
import AppState from '../../AppState';
import { mapTilSøkekriterierBackend } from './søkekriterierBackend';
import { SearchApiError } from '../../api/fetchUtils';
import { leggInfoFraStillingIStateOgSøk, leggUrlParametereIStateOgSøk } from './initialSearch';

export function* searchSaga() {
    yield takeLatest(KandidatsøkActionType.Search, search);
    yield takeLatest(
        KandidatsøkActionType.SøkMedInfoFraStilling as any,
        leggInfoFraStillingIStateOgSøk
    );
    yield takeLatest(
        KandidatsøkActionType.SøkMedUrlParametere as any,
        leggUrlParametereIStateOgSøk
    );
    yield takeLatest(KandidatsøkActionType.FetchKompetanseSuggestions, fetchKompetanseSuggestions);
    yield takeLatest(KandidatsøkActionType.FetchFeatureTogglesBegin, hentFeatureToggles);
    yield takeLatest(KandidatsøkActionType.LastFlereKandidater, hentFlereKandidater);
    yield takeLatest(
        KandidatsøkActionType.HentFerdigutfylteStillinger,
        hentFerdigutfylteStillinger
    );
    yield takeLatest(
        KandidatsøkActionType.FerdigutfyltestillingerKlikk,
        registrerFerdigutfylteStillingerKlikk
    );
}

export function* search(action?: SearchAction) {
    try {
        yield put({ type: KandidatsøkActionType.SearchBegin });
        const state: AppState = yield select();

        oppdaterUrlTilÅReflektereSøkekriterier(state);

        const [søkekriterier, searchQueryHash] = mapTilSøkekriterierBackend(state, action);
        const harNyeSokekriterier = searchQueryHash !== state.søk.searchQueryHash;
        const isPaginatedSok = !harNyeSokekriterier && søkekriterier.fraIndex > 0;

        let response = yield call(
            søkekriterier.hasValues ? fetchKandidater : fetchKandidaterES,
            søkekriterier
        );

        if (!harNyeSokekriterier) {
            const kandidater = state.søk.searchResultat.resultat.kandidater;
            const kandidaterMedMarkering = response.kandidater.map((kFraResponse) => ({
                ...kFraResponse,
                markert: kandidater.some(
                    (k) => k.arenaKandidatnr === kFraResponse.arenaKandidatnr && k.markert
                ),
            }));
            response = { ...response, kandidater: kandidaterMedMarkering };
        }

        yield put({
            type: KandidatsøkActionType.SearchSuccess,
            response,
            isEmptyQuery: !søkekriterier.hasValues,
            isPaginatedSok,
            searchQueryHash,
            antallResultater: søkekriterier.antallResultater,
        });
        yield put({
            type: KandidatsøkActionType.SetAlertTypeFaaKandidater,
            value: action?.alertType || '',
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatsøkActionType.SearchFailure, error: e });
        } else {
            throw e;
        }
    }
}

export const oppdaterUrlTilÅReflektereSøkekriterier = (state: AppState): void => {
    const urlQuery = toUrlQuery(state);
    const newUrlQuery = urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : window.location.pathname;
    if (!window.location.pathname.includes('/cv')) {
        window.history.replaceState('', '', newUrlQuery);
    }
};

export function* hentFlereKandidater(action) {
    const state: AppState = yield select();
    const fraIndex = state.søk.searchResultat.resultat.kandidater.length;
    yield search({ ...action, fraIndex, antallResultater: KANDIDATLISTE_CHUNK_SIZE });
}

function* fetchKompetanseSuggestions() {
    try {
        const state: AppState = yield select();

        if (
            state.søkefilter.stilling.stillinger &&
            state.søkefilter.stilling.stillinger.length !== 0
        ) {
            yield put({ type: KandidatsøkActionType.SetKompetanseSuggestionsBegin });

            const response = yield call(fetchKandidaterES, {
                stillinger: state.søkefilter.stilling.stillinger,
            });
            const aggregeringerKompetanse = response.aggregeringer.find(
                (a) => a.navn === 'kompetanse'
            );
            yield put({
                type: KandidatsøkActionType.SetKompetanseSuggestionsSuccess,
                response: aggregeringerKompetanse ? aggregeringerKompetanse.felt : [],
            });
        } else {
            yield put({ type: KandidatsøkActionType.RemoveKompetanseSuggestions });
        }
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatsøkActionType.SearchFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* hentFeatureToggles() {
    try {
        const data = yield call(fetchFeatureToggles);
        yield put({ type: KandidatsøkActionType.FetchFeatureTogglesSuccess, data });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatsøkActionType.FetchFeatureTogglesFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* hentFerdigutfylteStillinger() {
    try {
        const data = yield call(fetchFerdigutfylteStillinger);
        yield put({ type: KandidatsøkActionType.HentFerdigutfylteStillingerSuccess, data });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatsøkActionType.HentFerdigutfylteStillingerFailure, error: e });
        } else {
            throw e;
        }
    }
}

function* registrerFerdigutfylteStillingerKlikk(action) {
    try {
        yield call(postFerdigutfylteStillingerKlikk, action.ferdigutfylteStillingerKlikk);
    } catch (e) {
        throw e;
    }
}
