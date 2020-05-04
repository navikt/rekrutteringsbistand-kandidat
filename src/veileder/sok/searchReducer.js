import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    fetchFeatureToggles,
    fetchFerdigutfylteStillinger,
    fetchKandidater,
    fetchKandidaterES,
} from '../api.ts';
import { getHashFromString } from '../../felles/sok/utils';
import { KANDIDATLISTE_CHUNK_SIZE } from '../../felles/konstanter';
import { SearchApiError } from '../../felles/api.ts';
import { postFerdigutfylteStillingerKlikk } from '../api';
import { toUrlQuery } from './searchQuery';
import { initialSearch } from './typedSearchReducer';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const LUKK_ALLE_SOKEPANEL = 'LUKK_ALLE_SOKEPANEL';

export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const LAST_FLERE_KANDIDATER = 'LAST_FLERE_KANDIDATER';

export const SET_STATE = 'SET_STATE';

export const INITIAL_SEARCH_BEGIN = 'INITIAL_SEARCH_BEGIN';

export const FETCH_FEATURE_TOGGLES_BEGIN = 'FETCH_FEATURE_TOGGLES_BEGIN';
export const FETCH_FEATURE_TOGGLES_SUCCESS = 'FETCH_FEATURE_TOGGLES_SUCCESS';
export const FETCH_FEATURE_TOGGLES_FAILURE = 'FETCH_FEATURE_TOGGLES_FAILURE';

export const FETCH_KOMPETANSE_SUGGESTIONS = 'FETCH_KOMPETANSE_SUGGESTIONS';
export const SET_KOMPETANSE_SUGGESTIONS_BEGIN = 'SET_KOMPETANSE_SUGGESTIONS_BEGIN';
export const SET_KOMPETANSE_SUGGESTIONS_SUCCESS = 'SET_KOMPETANSE_SUGGESTIONS_SUCCESS';
export const REMOVE_KOMPETANSE_SUGGESTIONS = 'REMOVE_KOMPETANSE_SUGGESTIONS';

export const SET_ALERT_TYPE_FAA_KANDIDATER = 'SET_ALERT_TYPE_FAA_KANDIDATER';

export const INVALID_RESPONSE_STATUS = 'INVALID_RESPONSE_STATUS';

export const OPPDATER_ANTALL_KANDIDATER = 'OPPDATER_ANTALL_KANDIDATER';

export const SETT_KANDIDATNUMMER = 'SETT_KANDIDATNUMMER';

export const MARKER_KANDIDATER = 'MARKER_KANDIDATER';

export const SET_SCROLL_POSITION = 'SET_SCROLL_POSITION';

export const HENT_FERDIGUTFYLTE_STILLINGER = 'HENT_FERDIGUTFYLTE_STILLINGER';
export const HENT_FERDIGUTFYLTE_STILLINGER_SUCCESS = 'HENT_FERDIGUTFYLTE_STILLINGER_SUCCESS';
export const HENT_FERDIGUTFYLTE_STILLINGER_FAILURE = 'HENT_FERDIGUTFYLTE_STILLINGER_FAILURE';

export const TOGGLE_VIKTIGE_YRKER_APEN = 'TOGGLE_VIKTIGE_YRKER_APEN';
export const FERDIGUTFYLTESTILLINGER_KLIKK = 'FERDIGUTFYLTESTILLINGER_KLIKK';

export const FJERN_ERROR = 'FJERN_ERROR';

export function* search(action = '') {
    try {
        yield put({ type: SEARCH_BEGIN });
        const state = yield select();

        // Update browser url to reflect current search query
        const urlQuery = toUrlQuery(state);
        const newUrlQuery =
            urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : window.location.pathname;
        if (!window.location.pathname.includes('/cv')) {
            window.history.replaceState('', '', newUrlQuery);
        }

        const fraIndex = action.fraIndex || 0;
        const antallResultater = action.antallResultater
            ? Math.max(action.antallResultater, state.search.antallVisteKandidater)
            : state.search.antallVisteKandidater;

        const forerkortListe = state.forerkort.forerkortList.includes('Førerkort: Kl. M (Moped)')
            ? [...state.forerkort.forerkortList, 'Mopedførerbevis']
            : state.forerkort.forerkortList;

        const criteriaValues = {
            fritekst: state.fritekst.fritekst,
            stillinger: state.stilling.stillinger,
            arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
            utdanninger: state.utdanning.utdanninger,
            kompetanser: state.kompetanse.kompetanser,
            geografiList: state.geografi.geografiList,
            geografiListKomplett: state.geografi.geografiListKomplett,
            lokasjoner: [...state.geografi.geografiListKomplett].map(
                (sted) => `${sted.geografiKodeTekst}:${sted.geografiKode}`
            ),
            totalErfaring: state.arbeidserfaring.totalErfaring,
            utdanningsniva: state.utdanning.utdanningsniva,
            sprak: state.sprakReducer.sprak,
            kvalifiseringsgruppeKoder: state.innsatsgruppe.kvalifiseringsgruppeKoder,
            maaBoInnenforGeografi: state.geografi.maaBoInnenforGeografi,
            forerkort: forerkortListe,
            navkontor: state.navkontorReducer.navkontor,
            minekandidater: state.navkontorReducer.minekandidater,
            hovedmal: state.hovedmal.totaltHovedmal,
            tilretteleggingsbehov: state.tilretteleggingsbehov.harTilretteleggingsbehov,
            kategorier: state.tilretteleggingsbehov.kategorier,
            oppstartKoder: state.tilgjengelighet.oppstartstidspunkter,
            maksAlderYrkeserfaring: state.arbeidserfaring.maksAlderArbeidserfaring,
            midlertidigUtilgjengelig: state.tilgjengelighet.midlertidigUtilgjengelig,
        };

        if (state.permittering.permittert !== state.permittering.ikkePermittert) {
            criteriaValues.permittert = JSON.stringify(state.permittering.permittert);
        }

        const searchQueryHash = getHashFromString(JSON.stringify(criteriaValues));
        const harNyeSokekriterier = searchQueryHash !== state.search.searchQueryHash;
        const isPaginatedSok = !harNyeSokekriterier && fraIndex > 0;

        const harCriteria = Object.values(criteriaValues).some((v) => Array.isArray(v) && v.length);
        const criteria = {
            ...criteriaValues,
            hasValues: Object.values(criteriaValues).some((v) => Array.isArray(v) && v.length),
            fraIndex,
            antallResultater,
        };

        let response = yield call(harCriteria ? fetchKandidater : fetchKandidaterES, criteria);

        if (!harNyeSokekriterier) {
            const kandidater = state.search.searchResultat.resultat.kandidater;
            const kandidaterMedMarkering = response.kandidater.map((kFraResponse) => ({
                ...kFraResponse,
                markert: kandidater.some(
                    (k) => k.arenaKandidatnr === kFraResponse.arenaKandidatnr && k.markert
                ),
            }));
            response = { ...response, kandidater: kandidaterMedMarkering };
        }

        yield put({
            type: SEARCH_SUCCESS,
            response,
            isEmptyQuery: !criteria.hasValues,
            isPaginatedSok,
            searchQueryHash,
            antallResultater,
        });
        yield put({ type: SET_ALERT_TYPE_FAA_KANDIDATER, value: action.alertType || '' });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* esSearch(action = '') {
    yield search(action);
}

function* hentFlereKandidater(action) {
    const state = yield select();
    const fraIndex = state.search.searchResultat.resultat.kandidater.length;
    yield esSearch({ ...action, fraIndex, antallResultater: KANDIDATLISTE_CHUNK_SIZE });
}

function* fetchKompetanseSuggestions() {
    try {
        const state = yield select();

        if (state.stilling.stillinger.length !== 0) {
            yield put({ type: SET_KOMPETANSE_SUGGESTIONS_BEGIN });

            const response = yield call(fetchKandidaterES, {
                stillinger: state.stilling.stillinger,
            });
            const aggregeringerKompetanse = response.aggregeringer.find(
                (a) => a.navn === 'kompetanse'
            );
            yield put({
                type: SET_KOMPETANSE_SUGGESTIONS_SUCCESS,
                response: aggregeringerKompetanse ? aggregeringerKompetanse.felt : [],
            });
        } else {
            yield put({ type: REMOVE_KOMPETANSE_SUGGESTIONS });
        }
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentFeatureToggles() {
    try {
        const data = yield call(fetchFeatureToggles);
        yield put({ type: FETCH_FEATURE_TOGGLES_SUCCESS, data });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: FETCH_FEATURE_TOGGLES_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentFerdigutfylteStillinger() {
    try {
        const data = yield call(fetchFerdigutfylteStillinger);
        yield put({ type: HENT_FERDIGUTFYLTE_STILLINGER_SUCCESS, data });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_FERDIGUTFYLTE_STILLINGER_FAILURE, error: e });
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
    yield takeLatest(SEARCH, esSearch);
    yield takeLatest(INITIAL_SEARCH_BEGIN, initialSearch);
    yield takeLatest(FETCH_KOMPETANSE_SUGGESTIONS, fetchKompetanseSuggestions);
    yield takeLatest(FETCH_FEATURE_TOGGLES_BEGIN, hentFeatureToggles);
    yield takeLatest(LAST_FLERE_KANDIDATER, hentFlereKandidater);
    yield takeLatest(HENT_FERDIGUTFYLTE_STILLINGER, hentFerdigutfylteStillinger);
    yield takeLatest(FERDIGUTFYLTESTILLINGER_KLIKK, registrerFerdigutfylteStillingerKlikk);
};
