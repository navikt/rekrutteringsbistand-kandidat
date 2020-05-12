import { InitialQuery, mapStillingTilInitialQuery, mapUrlToInitialQuery } from './searchQuery';
import { call, put, select } from 'redux-saga/effects';
import { fetchGeografiKode, fetchStillingFraListe } from '../api';
import { SEARCH_FAILURE, SET_STATE } from './searchReducer';
import { SearchApiError } from '../../felles/api';
import { search } from './typedSearchReducer';
import { Geografi } from '../result/fant-få-kandidater/FantFåKandidater';
import { formatterStedsnavn } from '../../felles/sok/utils';
import AppState from '../AppState';

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
        const state: AppState = yield select();

        // TODO Denne koden kjøres på componentDidMount i ResultatVisning.
        // Denne funksjonen setter staten til å tilsvare det som ligger som URL-query.
        // Hvis det ikke ligger noe i URL-query, så setter vi _ikke_ staten.
        // I teorien skulle det vært OK å resette search-delen av staten hvis URL-query var tom,
        // men appen er avhengig av at tom URL-query => ingen oppdatering av staten.
        // Mer spesifikt: Hvis vi tømmer staten på tom URL-query, så vil brukeren miste søket
        // når h*n navigerer mellom søket og andre sider, f.eks. CV.
        //
        // Dette skaper problemer når vi skal introdusere søk basert på kandidatlisteId.
        // KandidatlisteId vil alltid finnes, hvis man har kommet til søket via en liste.
        // Derfor vil initialQuery ikke være tom, selv om URL-query _er_ tom.
        // Da vil staten tømmes for alt utenom kandidatlisteId tømmes, og brukeren mister søket.

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

interface SøkMedInfoFraStillingAction {
    stillingsId: string;
}

export function* søkMedInfoFraStilling(action: SøkMedInfoFraStillingAction) {
    try {
        const stilling = yield call(fetchStillingFraListe, action.stillingsId);
        const initialQuery = mapStillingTilInitialQuery(stilling);
        const initialQueryMedGeografi = yield leggPåGeografiInfoHvisKommune(initialQuery);
        yield put({ type: SET_STATE, query: initialQueryMedGeografi });
        yield call(search);
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

const leggPåGeografiInfoHvisKommune = async (initialQuery: InitialQuery): Promise<InitialQuery> => {
    const nyInitialQuery = { ...initialQuery };
    if (nyInitialQuery.geografiList) {
        nyInitialQuery.geografiListKomplett = await fetchGeografiListKomplett(
            nyInitialQuery.geografiList
        );
    }
    return nyInitialQuery;
};

export function* søkMedUrlParametere() {
    try {
        let initialQuery: InitialQuery = mapUrlToInitialQuery(window.location.href);
        yield put({ type: SET_STATE, query: initialQuery });
        yield call(search);
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}
