import { call, put, select, takeLatest } from 'redux-saga/effects';
import FEATURE_TOGGLES, {
    KANDIDATLISTE_CHUNK_SIZE,
    KANDIDATLISTE_INITIAL_CHUNK_SIZE,
} from '../../common/konstanter';
import { KandidatsøkActionType } from './searchReducer';
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

interface SetStateAction {
    type: KandidatsøkActionType.SetState;
    query: any;
}

interface LukkAlleSøkepanelAction {
    type: KandidatsøkActionType.LukkAlleSokepanel;
}

interface SearchAction {
    type: KandidatsøkActionType.Search;
    alertType: string;
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
};

export const searchReducer = (state: SearchState = defaultState, action: any): SearchState => {
    switch (action.type) {
        case KandidatsøkActionType.SøkMedInfoFraStilling:
            return {
                ...state,
                maksAntallTreff: 0,
            };
        case KandidatsøkActionType.SearchBegin:
            return {
                ...state,
                isSearching: true,
            };
        case KandidatsøkActionType.SearchSuccess: {
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
        case KandidatsøkActionType.SearchFailure:
            return {
                ...state,
                isSearching: false,
                error: action.error,
            };
        case KandidatsøkActionType.MarkerKandidater:
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
        case KandidatsøkActionType.OppdaterAntallKandidater:
            return {
                ...state,
                antallVisteKandidater: action.antall,
            };
        case KandidatsøkActionType.SettKandidatnummer:
            return {
                ...state,
                valgtKandidatNr: action.kandidatnr,
            };
        case KandidatsøkActionType.SetKompetanseSuggestionsBegin:
            return {
                ...state,
            };
        case KandidatsøkActionType.SetKompetanseSuggestionsSuccess:
            return {
                ...state,
                isSearching: false,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: action.response },
            };
        case KandidatsøkActionType.RemoveKompetanseSuggestions:
            return {
                ...state,
                searchResultat: { ...state.searchResultat, kompetanseSuggestions: [] },
            };
        case KandidatsøkActionType.FetchFeatureTogglesSuccess:
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
        case KandidatsøkActionType.FetchFeatureTogglesFailure:
            return {
                ...state,
                harHentetFeatureToggles: true,
                featureToggles: FEATURE_TOGGLES.reduce(
                    (dict, key) => ({ ...dict, [key]: false }),
                    {}
                ),
                error: action.error,
            };
        case KandidatsøkActionType.SetAlertTypeFaaKandidater:
            return {
                ...state,
                visAlertFaKandidater: action.value,
            };
        case KandidatsøkActionType.InvalidResponseStatus:
            return {
                ...state,
                error: action.error,
            };
        case KandidatsøkActionType.SetScrollPosition:
            return {
                ...state,
                scrolletFraToppen: action.scrolletFraToppen,
            };
        case KandidatsøkActionType.SetState:
            return {
                ...state,
                kandidatlisteId: action.query.kandidatlisteId,
            };
        case KandidatsøkActionType.FjernError:
            return {
                ...state,
                error: undefined,
            };
        case KandidatsøkActionType.HentFerdigutfylteStillingerSuccess:
            return {
                ...state,
                ferdigutfylteStillinger: action.data,
            };
        case KandidatsøkActionType.HentFerdigutfylteStillingerFailure:
            return {
                ...state,
                error: action.error,
            };
        case KandidatsøkActionType.ToggleViktigeYrkerApen:
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

export function* esSearch(action: SearchAction) {
    yield search(action);
}

export function* hentFlereKandidater(action) {
    const state: AppState = yield select();
    const fraIndex = state.søk.searchResultat.resultat.kandidater.length;
    yield esSearch({ ...action, fraIndex, antallResultater: KANDIDATLISTE_CHUNK_SIZE });
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

export const searchSaga = function* saga() {
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
