import { InitialQuery, mapStillingTilInitialQuery, mapUrlToInitialQuery } from './searchQuery';
import { call, put, select } from 'redux-saga/effects';
import { fetchGeografiKode, fetchStillingFraListe } from '../api';
import { SEARCH_FAILURE, SET_STATE } from './searchReducer';
import { SearchApiError } from '../../felles/api';
import { search } from './typedSearchReducer';
import { Geografi } from '../result/fant-få-kandidater/FantFåKandidater';
import { formatterStedsnavn } from '../../felles/sok/utils';
import { init } from 'amplitude-js';
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
