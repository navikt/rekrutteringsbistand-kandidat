import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    fetchFeatureToggles,
    fetchFerdigutfylteStillinger,
    fetchGeografiKode,
    fetchKandidater,
    fetchKandidaterES,
    fetchStillingFraListe,
} from '../api.ts';
import {
    formatterStedsnavn,
    getHashFromString,
    getUrlParameterByName,
    toUrlParams,
} from '../../felles/sok/utils';
import FEATURE_TOGGLES, {
    KANDIDATLISTE_CHUNK_SIZE,
    KANDIDATLISTE_INITIAL_CHUNK_SIZE,
} from '../../felles/konstanter';
import { SearchApiError } from '../../felles/api.ts';
import { postFerdigutfylteStillingerKlikk } from '../api';
import { initialSearchState } from './searchReducerTypes';

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

export const fromUrlQuery = (url) => {
    const stateFromUrl = {};
    const fritekst = getUrlParameterByName('fritekst', url);
    const stillinger = getUrlParameterByName('stillinger', url);
    const arbeidserfaringer = getUrlParameterByName('arbeidserfaringer', url);
    const kompetanser = getUrlParameterByName('kompetanser', url);
    const utdanninger = getUrlParameterByName('utdanninger', url);
    const geografiList = getUrlParameterByName('geografiList', url);
    const totalErfaring = getUrlParameterByName('totalErfaring', url);
    const utdanningsniva = getUrlParameterByName('utdanningsniva', url);
    const sprak = getUrlParameterByName('sprak', url);
    const forerkort = getUrlParameterByName('forerkort', url);
    const kvalifiseringsgruppeKoder = getUrlParameterByName('kvalifiseringsgruppeKoder', url);
    const maaBoInnenforGeografi = getUrlParameterByName('maaBoInnenforGeografi', url);
    const harHentetStilling = getUrlParameterByName('harHentetStilling', url);
    const navkontor = getUrlParameterByName('navkontor', url);
    const minekandidater = getUrlParameterByName('minekandidater', url);
    const hovedmal = getUrlParameterByName('hovedmal', url);
    const tilretteleggingsbehov = getUrlParameterByName('tilretteleggingsbehov', url);
    const kategorier = getUrlParameterByName('kategorier', url);
    const permittert = getUrlParameterByName('permittert');
    const oppstartstidspunkter = getUrlParameterByName('oppstartstidspunkter');
    const maksAlderArbeidserfaring = getUrlParameterByName('maksAlderArbeidserfaring');
    const midlertidigUtilgjengelig = getUrlParameterByName('midlertidigUtilgjengelig');

    if (fritekst) stateFromUrl.fritekst = fritekst;
    if (stillinger) stateFromUrl.stillinger = stillinger.split('_');
    if (arbeidserfaringer) stateFromUrl.arbeidserfaringer = arbeidserfaringer.split('_');
    if (kompetanser) stateFromUrl.kompetanser = kompetanser.split('_');
    if (utdanninger) stateFromUrl.utdanninger = utdanninger.split('_');
    if (geografiList) stateFromUrl.geografiList = geografiList.split('_');
    if (totalErfaring) stateFromUrl.totalErfaring = totalErfaring.split('_');
    if (utdanningsniva) stateFromUrl.utdanningsniva = utdanningsniva.split('_');
    if (sprak) stateFromUrl.sprak = sprak.split('_');
    if (forerkort) stateFromUrl.forerkort = forerkort.split('_');
    if (kvalifiseringsgruppeKoder)
        stateFromUrl.kvalifiseringsgruppeKoder = kvalifiseringsgruppeKoder.split('_');
    if (maaBoInnenforGeografi === 'true') stateFromUrl.maaBoInnenforGeografi = true;
    if (harHentetStilling === 'true') stateFromUrl.harHentetStilling = true;
    if (navkontor) stateFromUrl.navkontor = navkontor.split('_');
    if (minekandidater === 'true') stateFromUrl.minekandidater = true;
    if (hovedmal) stateFromUrl.hovedmal = hovedmal.split('_');
    if (tilretteleggingsbehov === 'true') stateFromUrl.tilretteleggingsbehov = true;
    if (kategorier) stateFromUrl.kategorier = kategorier.split('_');
    if (permittert) stateFromUrl.permittert = permittert === 'true';
    if (oppstartstidspunkter) stateFromUrl.oppstartstidspunkter = oppstartstidspunkter.split('-');
    if (midlertidigUtilgjengelig)
        stateFromUrl.midlertidigUtilgjengelig = midlertidigUtilgjengelig.split('_');
    if (maksAlderArbeidserfaring && !isNaN(parseInt(maksAlderArbeidserfaring)))
        stateFromUrl.maksAlderArbeidserfaring = parseInt(maksAlderArbeidserfaring);

    return stateFromUrl;
};

export const toUrlQuery = (state) => {
    const urlQuery = {};
    if (state.fritekst.fritekst) urlQuery.fritekst = state.fritekst.fritekst;
    if (state.stilling.stillinger && state.stilling.stillinger.length > 0)
        urlQuery.stillinger = state.stilling.stillinger.join('_');
    if (
        state.arbeidserfaring.arbeidserfaringer &&
        state.arbeidserfaring.arbeidserfaringer.length > 0
    )
        urlQuery.arbeidserfaringer = state.arbeidserfaring.arbeidserfaringer.join('_');
    if (state.kompetanse.kompetanser && state.kompetanse.kompetanser.length > 0)
        urlQuery.kompetanser = state.kompetanse.kompetanser.join('_');
    if (state.utdanning.utdanninger && state.utdanning.utdanninger.length > 0)
        urlQuery.utdanninger = state.utdanning.utdanninger.join('_');
    if (state.geografi.geografiList && state.geografi.geografiList.length > 0)
        urlQuery.geografiList = state.geografi.geografiList.join('_');
    if (state.arbeidserfaring.totalErfaring && state.arbeidserfaring.totalErfaring.length > 0)
        urlQuery.totalErfaring = state.arbeidserfaring.totalErfaring.join('_');
    if (state.utdanning.utdanningsniva && state.utdanning.utdanningsniva.length > 0)
        urlQuery.utdanningsniva = state.utdanning.utdanningsniva.join('_');
    if (state.sprakReducer.sprak && state.sprakReducer.sprak.length > 0)
        urlQuery.sprak = state.sprakReducer.sprak.join('_');
    if (state.forerkort.forerkortList && state.forerkort.forerkortList.length > 0)
        urlQuery.forerkort = state.forerkort.forerkortList.join('_');
    if (
        state.innsatsgruppe.kvalifiseringsgruppeKoder &&
        state.innsatsgruppe.kvalifiseringsgruppeKoder.length > 0
    )
        urlQuery.kvalifiseringsgruppeKoder = state.innsatsgruppe.kvalifiseringsgruppeKoder.join(
            '_'
        );
    if (state.geografi.maaBoInnenforGeografi)
        urlQuery.maaBoInnenforGeografi = state.geografi.maaBoInnenforGeografi;
    if (state.search.harHentetStilling) urlQuery.harHentetStilling = state.search.harHentetStilling;
    if (state.navkontorReducer.navkontor && state.navkontorReducer.navkontor.length > 0)
        urlQuery.navkontor = state.navkontorReducer.navkontor.join('_');
    if (state.navkontorReducer.minekandidater)
        urlQuery.minekandidater = state.navkontorReducer.minekandidater;
    if (state.hovedmal.totaltHovedmal && state.hovedmal.totaltHovedmal.length > 0)
        urlQuery.hovedmal = state.hovedmal.totaltHovedmal.join('_');
    if (state.tilretteleggingsbehov.harTilretteleggingsbehov)
        urlQuery.tilretteleggingsbehov = state.tilretteleggingsbehov.harTilretteleggingsbehov;
    if (state.tilretteleggingsbehov.kategorier && state.tilretteleggingsbehov.kategorier.length > 0)
        urlQuery.kategorier = state.tilretteleggingsbehov.kategorier.join('_');
    if (state.permittering.permittert !== state.permittering.ikkePermittert)
        urlQuery.permittert = state.permittering.permittert;
    if (
        state.tilgjengelighet &&
        state.tilgjengelighet.oppstartstidspunkter &&
        state.tilgjengelighet.oppstartstidspunkter.length > 0
    )
        urlQuery.oppstartstidspunkter = state.tilgjengelighet.oppstartstidspunkter.join('-');
    if (state.arbeidserfaring.maksAlderArbeidserfaring !== undefined)
        urlQuery.maksAlderArbeidserfaring = state.arbeidserfaring.maksAlderArbeidserfaring;

    if (
        state.tilgjengelighet &&
        state.tilgjengelighet.midlertidigUtilgjengelig &&
        state.tilgjengelighet.midlertidigUtilgjengelig.length > 0
    )
        urlQuery.midlertidigUtilgjengelig = state.tilgjengelighet.midlertidigUtilgjengelig.join(
            '_'
        );

    return toUrlParams(urlQuery);
};

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* search(action = '') {
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

const mapTilretteleggingsmuligheterTilBehov = (urlQuery, tag) => {
    const nyQuery = { ...urlQuery };

    nyQuery.tilretteleggingsbehov = tag.includes('INKLUDERING');
    if (!nyQuery.tilretteleggingsbehov) {
        return nyQuery;
    }

    nyQuery.kategorier = [];

    const tilretteleggingsmuligheterTilBehov = {
        INKLUDERING__ARBEIDSTID: 'arbeidstid',
        INKLUDERING__FYSISK: 'fysisk',
        INKLUDERING__ARBEIDSMILJØ: 'arbeidshverdagen',
        INKLUDERING__GRUNNLEGGENDE: 'utfordringerMedNorsk',
    };

    nyQuery.kategorier = tag
        .filter((t) => Object.keys(tilretteleggingsmuligheterTilBehov).includes(t))
        .map((t) => tilretteleggingsmuligheterTilBehov[t]);

    return nyQuery;
};

function* initialSearch(action) {
    try {
        let urlQuery = fromUrlQuery(window.location.href);
        const state = yield select();

        if (
            action.stillingsId &&
            Object.keys(urlQuery).length === 0 &&
            !state.search.harHentetStilling
        ) {
            const stilling = yield call(fetchStillingFraListe, action.stillingsId);

            urlQuery.stillinger = stilling.stilling;
            urlQuery.geografiList = stilling.kommune;
            urlQuery.harHentetStilling = true;

            if (stilling.tag.length > 0) {
                urlQuery = mapTilretteleggingsmuligheterTilBehov(urlQuery, stilling.tag);
            }
        }
        if (Object.keys(urlQuery).length > 0) {
            if (urlQuery.geografiList) {
                const geografiKoder = [];
                for (let i = 0; i < urlQuery.geografiList.length; i += 1) {
                    geografiKoder[i] = yield fetchGeografiKode(urlQuery.geografiList[i]);
                }
                urlQuery = {
                    ...urlQuery,
                    geografiListKomplett: geografiKoder.map((sted) => ({
                        geografiKodeTekst: formatterStedsnavn(sted.tekst.toLowerCase()),
                        geografiKode: sted.id,
                    })),
                };
            }
            yield put({ type: SET_STATE, query: urlQuery });
        }
        yield call(search);
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
