import { call, put, select, takeLatest } from 'redux-saga/effects';
import { fetchKandidater, fetchKandidaterES, fetchFeatureToggles, fetchStillingFraListe, fetchDataFraListe, fetchGeografiKode, SearchApiError, fetchInnloggetVeileder } from '../api';
import { getUrlParameterByName, toUrlParams, getHashFromString, formatterStedsnavn } from '../../felles/sok/utils';
import FEATURE_TOGGLES, { KANDIDATLISTE_INITIAL_CHUNK_SIZE, KANDIDATLISTE_CHUNK_SIZE } from '../../felles/konstanter';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const LAST_FLERE_KANDIDATER = 'LAST_FLERE_KANDIDATER';

export const SET_STATE = 'SET_STATE';

export const INITIAL_SEARCH_BEGIN = 'INITIAL_SEARCH_BEGIN';

export const FETCH_FEATURE_TOGGLES_BEGIN = 'FETCH_FEATURE_TOGGLES_BEGIN';
const FETCH_FEATURE_TOGGLES_SUCCESS = 'FETCH_FEATURE_TOGGLES_SUCCESS';
const FETCH_FEATURE_TOGGLES_FAILURE = 'FETCH_FEATURE_TOGGLES_FAILURE';

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

export const SET_LISTEDATA = 'SET_LISTEDATA';

export const HENT_INNLOGGET_VEILEDER = 'HENT_INNLOGGET_VEILEDER';
export const HENT_INNLOGGET_VEILEDER_SUCCESS = 'HENT_INNLOGGET_VEILEDER_SUCCESS';
export const HENT_INNLOGGET_VEILEDER_FAILURE = 'HENT_INNLOGGET_VEILEDER_FAILURE';

export const FJERN_ERROR = 'FJERN_ERROR';

/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    searchResultat: {
        resultat: {
            kandidater: [],
            aggregeringer: [],
            totaltAntallTreff: 0
        },
        kompetanseSuggestions: []
    },
    antallVisteKandidater: KANDIDATLISTE_INITIAL_CHUNK_SIZE,
    searchQueryHash: '',
    isSearching: false,
    isInitialSearch: true,
    error: undefined,
    featureToggles: FEATURE_TOGGLES
        .reduce((dict, key) => (
            { ...dict, [key]: false }
        ), {}),
    isEmptyQuery: true,
    visAlertFaKandidater: '',
    valgtKandidatNr: '',
    scrolletFraToppen: 0,
    stillingsId: undefined,
    harHentetStilling: false,
    stillingsoverskrift: undefined,
    arbeidsgiver: undefined,
    annonseOpprettetAvNavn: undefined,
    annonseOpprettetAvIdent: undefined,
    innloggetVeileder: undefined
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_BEGIN:
            return {
                ...state,
                isSearching: true
            };
        case SEARCH_SUCCESS: {
            const { isPaginatedSok } = action;
            return {
                ...state,
                isSearching: false,
                searchQueryHash: action.searchQueryHash,
                isInitialSearch: false,
                error: undefined,
                isEmptyQuery: action.isEmptyQuery,
                searchResultat: {
                    ...state.searchResultat,
                    resultat: !isPaginatedSok ? action.response :
                        {
                            ...state.searchResultat.resultat,
                            kandidater: [...state.searchResultat.resultat.kandidater, ...action.response.kandidater]
                        }
                }
            };
        }
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                error: action.error
            };
        case MARKER_KANDIDATER:
            return {
                ...state,
                searchResultat: {
                    ...state.searchResultat,
                    resultat: {
                        ...state.searchResultat.resultat,
                        kandidater: action.kandidater
                    }
                }
            };
        case OPPDATER_ANTALL_KANDIDATER:
            return {
                ...state,
                antallVisteKandidater: action.antall
            };
        case SETT_KANDIDATNUMMER:
            return {
                ...state,
                valgtKandidatNr: action.kandidatnr
            };
        case SET_KOMPETANSE_SUGGESTIONS_BEGIN:
            return {
                ...state
            };
        case SET_KOMPETANSE_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                isSearching: false,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: action.response }
            };
        case REMOVE_KOMPETANSE_SUGGESTIONS:
            return {
                ...state,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: [] }
            };
        case FETCH_FEATURE_TOGGLES_SUCCESS:
            return {
                ...state,
                featureToggles: FEATURE_TOGGLES
                    .reduce((dict, key) => (
                        {
                            ...dict,
                            [key]: Object.keys(action.data)
                                .includes(key) && action.data[key]
                        }
                    ), {})
            };
        case FETCH_FEATURE_TOGGLES_FAILURE:
            return {
                ...state,
                featureToggles: FEATURE_TOGGLES
                    .reduce((dict, key) => (
                        { ...dict, [key]: false }
                    ), {}),
                error: action.error
            };
        case SET_ALERT_TYPE_FAA_KANDIDATER:
            return {
                ...state,
                visAlertFaKandidater: action.value
            };
        case INVALID_RESPONSE_STATUS:
            return {
                ...state,
                error: action.error
            };
        case SET_SCROLL_POSITION:
            return {
                ...state,
                scrolletFraToppen: action.scrolletFraToppen
            };
        case SET_STATE:
            return {
                ...state,
                harHentetStilling: action.query.harHentetStilling
            };
        case SET_LISTEDATA:
            return {
                ...state,
                stillingsoverskrift: action.listeData.tittel,
                arbeidsgiver: action.listeData.organisasjonNavn,
                annonseOpprettetAvNavn: action.listeData.opprettetAv.navn,
                annonseOpprettetAvIdent: action.listeData.opprettetAv.ident
            };
        case HENT_INNLOGGET_VEILEDER_SUCCESS:
            return {
                ...state,
                innloggetVeileder: action.data.navn
            };
        case HENT_INNLOGGET_VEILEDER_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case FJERN_ERROR:
            return {
                ...state,
                error: undefined
            };
        default:
            return state;
    }
}

export const fromUrlQuery = (url) => {
    const stateFromUrl = {};
    const stillinger = getUrlParameterByName('stillinger', url);
    const arbeidserfaringer = getUrlParameterByName('arbeidserfaringer', url);
    const kompetanser = getUrlParameterByName('kompetanser', url);
    const utdanninger = getUrlParameterByName('utdanninger', url);
    const geografiList = getUrlParameterByName('geografiList', url);
    const totalErfaring = getUrlParameterByName('totalErfaring', url);
    const utdanningsniva = getUrlParameterByName('utdanningsniva', url);
    const sprak = getUrlParameterByName('sprak', url);
    const forerkort = getUrlParameterByName('forerkort', url);
    const maaBoInnenforGeografi = getUrlParameterByName('maaBoInnenforGeografi', url);
    const harHentetStilling = getUrlParameterByName('harHentetStilling', url);

    if (stillinger) stateFromUrl.stillinger = stillinger.split('_');
    if (arbeidserfaringer) stateFromUrl.arbeidserfaringer = arbeidserfaringer.split('_');
    if (kompetanser) stateFromUrl.kompetanser = kompetanser.split('_');
    if (utdanninger) stateFromUrl.utdanninger = utdanninger.split('_');
    if (geografiList) stateFromUrl.geografiList = geografiList.split('_');
    if (totalErfaring) stateFromUrl.totalErfaring = totalErfaring.split('_');
    if (utdanningsniva) stateFromUrl.utdanningsniva = utdanningsniva.split('_');
    if (sprak) stateFromUrl.sprak = sprak.split('_');
    if (forerkort) stateFromUrl.forerkort = forerkort.split('_');
    if (maaBoInnenforGeografi === 'true') stateFromUrl.maaBoInnenforGeografi = true;
    if (harHentetStilling === 'true') stateFromUrl.harHentetStilling = true;
    return stateFromUrl;
};

export const toUrlQuery = (state) => {
    const urlQuery = {};
    if (state.stilling.stillinger && state.stilling.stillinger.length > 0) urlQuery.stillinger = state.stilling.stillinger.join('_');
    if (state.arbeidserfaring.arbeidserfaringer && state.arbeidserfaring.arbeidserfaringer.length > 0) urlQuery.arbeidserfaringer = state.arbeidserfaring.arbeidserfaringer.join('_');
    if (state.kompetanse.kompetanser && state.kompetanse.kompetanser.length > 0) urlQuery.kompetanser = state.kompetanse.kompetanser.join('_');
    if (state.utdanning.utdanninger && state.utdanning.utdanninger.length > 0) urlQuery.utdanninger = state.utdanning.utdanninger.join('_');
    if (state.geografi.geografiList && state.geografi.geografiList.length > 0) urlQuery.geografiList = state.geografi.geografiList.join('_');
    if (state.arbeidserfaring.totalErfaring && state.arbeidserfaring.totalErfaring.length > 0) urlQuery.totalErfaring = state.arbeidserfaring.totalErfaring.join('_');
    if (state.utdanning.utdanningsniva && state.utdanning.utdanningsniva.length > 0) urlQuery.utdanningsniva = state.utdanning.utdanningsniva.join('_');
    if (state.sprakReducer.sprak && state.sprakReducer.sprak.length > 0) urlQuery.sprak = state.sprakReducer.sprak.join('_');
    if (state.forerkort.forerkortList && state.forerkort.forerkortList.length > 0) urlQuery.forerkort = state.forerkort.forerkortList.join('_');
    if (state.geografi.maaBoInnenforGeografi) urlQuery.maaBoInnenforGeografi = state.geografi.maaBoInnenforGeografi;
    if (state.search.harHentetStilling) urlQuery.harHentetStilling = state.search.harHentetStilling;
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
        const newUrlQuery = urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : window.location.pathname;
        window.history.replaceState('', '', newUrlQuery);

        const fraIndex = action.fraIndex || 0;
        const antallResultater = action.antallResultater ? Math.max(action.antallResultater, state.search.antallVisteKandidater) : state.search.antallVisteKandidater;

        const forerkortListe = state.forerkort.forerkortList.includes('Førerkort: Kl. M (Moped)') ?
            [...state.forerkort.forerkortList, 'Mopedførerbevis'] : state.forerkort.forerkortList;

        const criteriaValues = {
            stillinger: state.stilling.stillinger,
            arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
            utdanninger: state.utdanning.utdanninger,
            kompetanser: state.kompetanse.kompetanser,
            geografiList: state.geografi.geografiList,
            geografiListKomplett: state.geografi.geografiListKomplett,
            lokasjoner: [...state.geografi.geografiListKomplett].map((sted) => `${sted.geografiKodeTekst}:${sted.geografiKode}`),
            totalErfaring: state.arbeidserfaring.totalErfaring,
            utdanningsniva: state.utdanning.utdanningsniva,
            sprak: state.sprakReducer.sprak,
            maaBoInnenforGeografi: state.geografi.maaBoInnenforGeografi,
            forerkort: forerkortListe
        };

        const searchQueryHash = getHashFromString(JSON.stringify(criteriaValues));
        const harNyeSokekriterier = searchQueryHash !== state.search.searchQueryHash;
        const isPaginatedSok = !harNyeSokekriterier && fraIndex > 0;

        const harCriteria = Object.values(criteriaValues).some((v) => Array.isArray(v) && v.length);
        const criteria = { ...criteriaValues, hasValues: Object.values(criteriaValues).some((v) => Array.isArray(v) && v.length), fraIndex, antallResultater };

        let response = yield call(harCriteria ? fetchKandidater : fetchKandidaterES, criteria);

        if (!harNyeSokekriterier) {
            const kandidater = state.search.searchResultat.resultat.kandidater;
            const kandidaterMedMarkering = response.kandidater.map((kFraResponse) => ({ ...kFraResponse, markert: kandidater.some((k) => k.arenaKandidatnr === kFraResponse.arenaKandidatnr && k.markert) }));
            response = { ...response, kandidater: kandidaterMedMarkering };
        }

        yield put({ type: SEARCH_SUCCESS, response, isEmptyQuery: !criteria.hasValues, isPaginatedSok, searchQueryHash, antallResultater });
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

            const response = yield call(fetchKandidaterES, { stillinger: state.stilling.stillinger });
            yield put({ type: SET_KOMPETANSE_SUGGESTIONS_SUCCESS, response: response.aggregeringer[1].felt });
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

function* initialSearch(action) {
    try {
        let urlQuery = fromUrlQuery(window.location.href);
        const state = yield select();
        if (action.stillingsId) {
            const listeData = yield call(fetchDataFraListe, action.stillingsId);
            yield put({ type: SET_LISTEDATA, listeData });
            if (action.stillingsId && Object.keys(urlQuery).length === 0 && !state.search.harHentetStilling) {
                const response = yield call(fetchStillingFraListe, action.stillingsId);
                urlQuery.stillinger = response.stilling;
                urlQuery.harHentetStilling = true;
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
                    geografiListKomplett: geografiKoder.map((sted) =>
                        ({ geografiKodeTekst: formatterStedsnavn(sted.tekst.toLowerCase()), geografiKode: sted.id }))
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

function* hentInnloggetVeileder() {
    try {
        const data = yield call(fetchInnloggetVeileder);
        yield put({ type: HENT_INNLOGGET_VEILEDER_SUCCESS, data });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_INNLOGGET_VEILEDER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const saga = function* saga() {
    yield takeLatest(SEARCH, esSearch);
    yield takeLatest(INITIAL_SEARCH_BEGIN, initialSearch);
    yield takeLatest(FETCH_KOMPETANSE_SUGGESTIONS, fetchKompetanseSuggestions);
    yield takeLatest(FETCH_FEATURE_TOGGLES_BEGIN, hentFeatureToggles);
    yield takeLatest(LAST_FLERE_KANDIDATER, hentFlereKandidater);
    yield takeLatest(HENT_INNLOGGET_VEILEDER, hentInnloggetVeileder);
};
