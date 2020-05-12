import { InitialQuery, mapStillingTilInitialQuery, mapUrlToInitialQuery } from './searchQuery';
import { call, put, select } from 'redux-saga/effects';
import { fetchGeografiKode, fetchStillingFraListe } from '../api';
import { SEARCH_FAILURE, SET_STATE } from './searchReducer';
import { SearchApiError } from '../../felles/api';
import { search } from './typedSearchReducer';
import { Geografi } from '../result/fant-få-kandidater/FantFåKandidater';
import { formatterStedsnavn } from '../../felles/sok/utils';

interface SøkMedInfoFraStillingAction {
    stillingsId: string;
}

export function* leggUrlParametereIStateOgSøk() {
    try {
        let initialQuery: InitialQuery = mapUrlToInitialQuery(window.location.href);
        const initialQueryMedGeografi = yield call(leggPåGeografiInfoHvisKommune, initialQuery);
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

export function* leggInfoFraStillingIStateOgSøk(action: SøkMedInfoFraStillingAction) {
    try {
        const stilling = yield call(fetchStillingFraListe, action.stillingsId);
        const initialQuery = mapStillingTilInitialQuery(stilling);
        const initialQueryMedGeografi = yield call(leggPåGeografiInfoHvisKommune, initialQuery);
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
