import FEATURE_TOGGLES, { KANDIDATLISTE_CHUNK_SIZE, KANDIDATLISTE_INITIAL_CHUNK_SIZE } from '../../felles/konstanter';
import {
    FETCH_FEATURE_TOGGLES_FAILURE,
    FETCH_FEATURE_TOGGLES_SUCCESS,
    FJERN_ERROR,
    HENT_FERDIGUTFYLTE_STILLINGER_FAILURE,
    HENT_FERDIGUTFYLTE_STILLINGER_SUCCESS,
    INITIAL_SEARCH_BEGIN,
    INVALID_RESPONSE_STATUS,
    MARKER_KANDIDATER,
    OPPDATER_ANTALL_KANDIDATER,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH_BEGIN,
    SEARCH_FAILURE,
    SEARCH_SUCCESS,
    SET_ALERT_TYPE_FAA_KANDIDATER,
    SET_KOMPETANSE_SUGGESTIONS_BEGIN,
    SET_KOMPETANSE_SUGGESTIONS_SUCCESS,
    SET_SCROLL_POSITION,
    SET_STATE,
    SETT_KANDIDATNUMMER,
    TOGGLE_VIKTIGE_YRKER_APEN,
} from './searchReducer';
import {
    InitialQuery,
    mapStillingTilInitialQuery,
    mapUrlToInitialQuery,
    toUrlQuery,
} from './searchQuery';
import { fetchGeografiKode, fetchKandidater, fetchKandidaterES, fetchStillingFraListe } from '../api';
import { formatterStedsnavn, getHashFromString } from '../../felles/sok/utils';
import { SearchApiError } from '../../felles/api';
import { call, put, select } from 'redux-saga/effects';
import { Geografi } from '../result/fant-få-kandidater/FantFåKandidater';
import AppState from '../AppState';
import { mapTilSøkekriterier } from './søkekriterier';

interface Søkeresultat {
    resultat: {
        kandidater: any[];
        aggregeringer: any[];
        totaltAntallTreff: number;
    };
    kompetanseSuggestions: any[];
}

export interface SearchState {
    searchResultat: Søkeresultat;
    maksAntallTreff: number;
    antallVisteKandidater: number;
    searchQueryHash: string;
    isSearching: boolean;
    isInitialSearch: boolean;
    error?: any;
    harHentetFeatureToggles: boolean;
    featureToggles: { [key: string]: boolean };
    ferdigutfylteStillinger?: any;
    isEmptyQuery: boolean;
    visAlertFaKandidater: string; // TODO Dette er av typen ALERTTYPE
    valgtKandidatNr: string;
    scrolletFraToppen: number;
    stillingsId?: string;
    harHentetStilling: boolean;
    stillingsoverskrift?: string;
    arbeidsgiver?: any;
    annonseOpprettetAvNavn?: string;
    annonseOpprettetAvIdent?: string;
    viktigeYrkerApen?: boolean;
}

export const initialSearchState: SearchState = {
    searchResultat: {
        resultat: {
            kandidater: [],
            aggregeringer: [],
            totaltAntallTreff: 0,
        },
        kompetanseSuggestions: [],
    },
    maksAntallTreff: 0,
    antallVisteKandidater: KANDIDATLISTE_INITIAL_CHUNK_SIZE,
    searchQueryHash: '',
    isSearching: false,
    isInitialSearch: true,
    harHentetFeatureToggles: false,
    featureToggles: FEATURE_TOGGLES.reduce((dict, key) => ({ ...dict, [key]: false }), {}),
    isEmptyQuery: true,
    visAlertFaKandidater: '',
    valgtKandidatNr: '',
    scrolletFraToppen: 0,
    harHentetStilling: false,
};

export const searchReducer = (
    state: SearchState = initialSearchState,
    action: any
): SearchState => {
    switch (action.type) {
        case INITIAL_SEARCH_BEGIN:
            return {
                ...state,
                maksAntallTreff: 0,
            };
        case SEARCH_BEGIN:
            return {
                ...state,
                isSearching: true,
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
                    resultat: !isPaginatedSok
                        ? action.response
                        : {
                              ...state.searchResultat.resultat,
                              kandidater: [
                                  ...state.searchResultat.resultat.kandidater,
                                  ...action.response.kandidater,
                              ],
                          },
                },
                maksAntallTreff: Math.max(state.maksAntallTreff, action.response.totaltAntallTreff),
            };
        }
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                error: action.error,
            };
        case MARKER_KANDIDATER:
            return {
                ...state,
                searchResultat: {
                    ...state.searchResultat,
                    resultat: {
                        ...state.searchResultat.resultat,
                        kandidater: action.kandidater,
                    },
                },
            };
        case OPPDATER_ANTALL_KANDIDATER:
            return {
                ...state,
                antallVisteKandidater: action.antall,
            };
        case SETT_KANDIDATNUMMER:
            return {
                ...state,
                valgtKandidatNr: action.kandidatnr,
            };
        case SET_KOMPETANSE_SUGGESTIONS_BEGIN:
            return {
                ...state,
            };
        case SET_KOMPETANSE_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                isSearching: false,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: action.response },
            };
        case REMOVE_KOMPETANSE_SUGGESTIONS:
            return {
                ...state,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: [] },
            };
        case FETCH_FEATURE_TOGGLES_SUCCESS:
            return {
                ...state,
                harHentetFeatureToggles: true,
                featureToggles: FEATURE_TOGGLES.reduce(
                    (dict, key) => ({
                        ...dict,
                        [key]: Object.keys(action.data).includes(key) && action.data[key],
                    }),
                    {}
                ),
            };
        case FETCH_FEATURE_TOGGLES_FAILURE:
            return {
                ...state,
                harHentetFeatureToggles: true,
                featureToggles: FEATURE_TOGGLES.reduce(
                    (dict, key) => ({ ...dict, [key]: false }),
                    {}
                ),
                error: action.error,
            };
        case SET_ALERT_TYPE_FAA_KANDIDATER:
            return {
                ...state,
                visAlertFaKandidater: action.value,
            };
        case INVALID_RESPONSE_STATUS:
            return {
                ...state,
                error: action.error,
            };
        case SET_SCROLL_POSITION:
            return {
                ...state,
                scrolletFraToppen: action.scrolletFraToppen,
            };
        case SET_STATE:
            return {
                ...state,
                harHentetStilling: action.query.harHentetStilling || false,
            };
        case FJERN_ERROR:
            return {
                ...state,
                error: undefined,
            };
        case HENT_FERDIGUTFYLTE_STILLINGER_SUCCESS:
            return {
                ...state,
                ferdigutfylteStillinger: action.data,
            };
        case HENT_FERDIGUTFYLTE_STILLINGER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case TOGGLE_VIKTIGE_YRKER_APEN:
            return {
                ...state,
                viktigeYrkerApen: !state.viktigeYrkerApen,
            };
        default:
            return state;
    }
};

const fetchGeografiListKomplett = async (geografiList: string[]): Promise<Geografi[]> => {
    const geografiKoder: any[] = [];

    // TODO Bytt til Promise.all, da skjer det ikke sekvensielt
    for (let i = 0; i < geografiList.length; i += 1) {
        geografiKoder[i] = await fetchGeografiKode(geografiList[i]);
    }
    return geografiKoder.map((sted) => ({
        geografiKodeTekst: formatterStedsnavn(sted.tekst.toLowerCase()),
        geografiKode: sted.id,
    }));
};

export function* initialSearch(action) {
    try {
        let initialQuery: InitialQuery = mapUrlToInitialQuery(window.location.href);
        const state = yield select();

        if (
            action.stillingsId &&
            Object.keys(initialQuery).length === 0 &&
            !state.search.harHentetStilling
        ) {
            const stilling = yield call(fetchStillingFraListe, action.stillingsId);
            initialQuery = mapStillingTilInitialQuery(stilling);
        }
        if (Object.keys(initialQuery).length > 0) {
            if (initialQuery.geografiList) {
                initialQuery.geografiListKomplett = yield fetchGeografiListKomplett(
                    initialQuery.geografiList
                );
            }
            yield put({ type: SET_STATE, query: initialQuery });
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

export const oppdaterUrlTilÅReflektereSøkekriterier = (state: AppState): void => {
    const urlQuery = toUrlQuery(state);
    const newUrlQuery = urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : window.location.pathname;
    if (!window.location.pathname.includes('/cv')) {
        window.history.replaceState('', '', newUrlQuery);
    }
};


export function* search(action: any = '') {
    try {
        yield put({ type: SEARCH_BEGIN });
        const state = yield select();

        oppdaterUrlTilÅReflektereSøkekriterier(state);

        const [søkekriterier, searchQueryHash] = mapTilSøkekriterier(state, action);
        const harNyeSokekriterier = searchQueryHash !== state.search.searchQueryHash;
        const isPaginatedSok = !harNyeSokekriterier && søkekriterier.fraIndex > 0;

        let response = yield call(søkekriterier.hasValues ? fetchKandidater : fetchKandidaterES, søkekriterier);

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
            isEmptyQuery: !søkekriterier.hasValues,
            isPaginatedSok,
            searchQueryHash,
            antallResultater: søkekriterier.antallResultater,
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

export function* esSearch(action = '') {
    yield search(action);
}

export function* hentFlereKandidater(action) {
    const state = yield select();
    const fraIndex = state.search.searchResultat.resultat.kandidater.length;
    yield esSearch({ ...action, fraIndex, antallResultater: KANDIDATLISTE_CHUNK_SIZE });
}
