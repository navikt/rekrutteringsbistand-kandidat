import FEATURE_TOGGLES, {
    KANDIDATLISTE_CHUNK_SIZE,
    KANDIDATLISTE_INITIAL_CHUNK_SIZE,
} from '../../felles/konstanter';
import {
    FETCH_FEATURE_TOGGLES_FAILURE,
    FETCH_FEATURE_TOGGLES_SUCCESS,
    FJERN_ERROR,
    HENT_FERDIGUTFYLTE_STILLINGER_FAILURE,
    HENT_FERDIGUTFYLTE_STILLINGER_SUCCESS,
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
    SØK_MED_INFO_FRA_STILLING,
    TOGGLE_VIKTIGE_YRKER_APEN,
} from './searchReducer';
import { toUrlQuery } from './searchQuery';
import { fetchKandidater, fetchKandidaterES } from '../api';
import { SearchApiError } from '../../felles/api';
import { call, put, select } from 'redux-saga/effects';
import AppState from '../AppState';
import { mapTilSøkekriterierBackend } from './søkekriterierBackend';

interface SetStateAction {
    type: 'SET_STATE';
    query: any;
}

interface LukkAlleSøkepanelAction {
    type: 'LUKK_ALLE_SOKEPANEL';
}

interface SearchAction {
    type: 'SEARCH';
}

export type FellesSøkekriterieActions = SetStateAction | LukkAlleSøkepanelAction | SearchAction;

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
    harHentetStilling: boolean;
    stillingsoverskrift?: string;
    arbeidsgiver?: any;
    annonseOpprettetAvNavn?: string;
    annonseOpprettetAvIdent?: string;
    viktigeYrkerApen?: boolean;
    kandidatlisteId?: string;
}

const defaultState: SearchState = {
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

export const searchReducer = (state: SearchState = defaultState, action: any): SearchState => {
    switch (action.type) {
        case SØK_MED_INFO_FRA_STILLING:
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
                kandidatlisteId: action.query.kandidatlisteId,
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
    const state: AppState = yield select();
    const fraIndex = state.søk.searchResultat.resultat.kandidater.length;
    yield esSearch({ ...action, fraIndex, antallResultater: KANDIDATLISTE_CHUNK_SIZE });
}
