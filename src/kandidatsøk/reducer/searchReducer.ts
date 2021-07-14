import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    fetchFeatureToggles,
    fetchFerdigutfylteStillinger,
    fetchKandidaterES,
} from '../../api/api';
import { postFerdigutfylteStillingerKlikk } from '../../api/api';
import { esSearch, hentFlereKandidater } from './typedSearchReducer';
import { leggInfoFraStillingIStateOgSøk, leggUrlParametereIStateOgSøk } from './initialSearch';
import AppState from '../../AppState';
import { SearchApiError } from '../../api/fetchUtils';

export enum KandidatsøkActionType {
    SettKandidatnummer = 'SETT_KANDIDATNUMMER',
    LastFlereKandidater = 'LAST_FLERE_KANDIDATER',
    LukkAlleSokepanel = 'LUKK_ALLE_SOKEPANEL',
    Search = 'SEARCH',
    SearchBegin = 'SEARCH_BEGIN',
    SearchSuccess = 'SEARCH_SUCCESS',
    SearchFailure = 'SEARCH_FAILURE',
    SetState = 'SET_STATE',
    SøkMedInfoFraStilling = 'SØK_MED_INFO_FRA_STILLING',
    SøkMedUrlParametere = 'SØK_MED_URL_PARAMETERE',
    FetchFeatureTogglesBegin = 'FETCH_FEATURE_TOGGLES_BEGIN',
    FetchFeatureTogglesSuccess = 'FETCH_FEATURE_TOGGLES_SUCCESS',
    FetchFeatureTogglesFailure = 'FETCH_FEATURE_TOGGLES_FAILURE',
    FetchKompetanseSuggestions = 'FETCH_KOMPETANSE_SUGGESTIONS',
    SetKompetanseSuggestionsBegin = 'SET_KOMPETANSE_SUGGESTIONS_BEGIN',
    SetKompetanseSuggestionsSuccess = 'SET_KOMPETANSE_SUGGESTIONS_SUCCESS',
    RemoveKompetanseSuggestions = 'REMOVE_KOMPETANSE_SUGGESTIONS',
    SetAlertTypeFaaKandidater = 'SET_ALERT_TYPE_FAA_KANDIDATER',
    InvalidResponseStatus = 'INVALID_RESPONSE_STATUS',
    OppdaterAntallKandidater = 'OPPDATER_ANTALL_KANDIDATER',
    MarkerKandidater = 'MARKER_KANDIDATER',
    SetScrollPosition = 'SET_SCROLL_POSITION',
    HentFerdigutfylteStillinger = 'HENT_FERDIGUTFYLTE_STILLINGER',
    HentFerdigutfylteStillingerSuccess = 'HENT_FERDIGUTFYLTE_STILLINGER_SUCCESS',
    HentFerdigutfylteStillingerFailure = 'HENT_FERDIGUTFYLTE_STILLINGER_FAILURE',
    ToggleViktigeYrkerApen = 'TOGGLE_VIKTIGE_YRKER_APEN',
    FerdigutfyltestillingerKlikk = 'FERDIGUTFYLTESTILLINGER_KLIKK',
    FjernError = 'FJERN_ERROR',
}

type SettKandidatnummerAction = {
    type: KandidatsøkActionType.SettKandidatnummer;
};

type LastFlereKandidaterAction = {
    type: KandidatsøkActionType.LastFlereKandidater;
};

export type KandidatsøkAction = SettKandidatnummerAction | LastFlereKandidaterAction;

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

export const harEnParameter = (...arrays) =>
    arrays.some((array) => array !== undefined && array.length > 0);

export const saga = function* saga() {
    yield takeLatest(KandidatsøkActionType.Search, esSearch);
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
};
