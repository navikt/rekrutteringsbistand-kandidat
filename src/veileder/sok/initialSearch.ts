import { InitialQuery, mapStillingTilInitialQuery, mapUrlToInitialQuery } from './searchQuery';
import { call, put } from 'redux-saga/effects';
import { fetchGeografiKode, fetchStillingFraListe } from '../api/api';
import { SEARCH_FAILURE, SET_STATE } from './searchReducer';
import { search } from './typedSearchReducer';
import { Geografi } from '../result/fant-få-kandidater/FantFåKandidater';
import { formatterStedsnavn } from './utils';
import { SearchApiError } from '../api/fetchUtils';

interface SøkMedInfoFraStillingAction {
    stillingsId: string;
    kandidatlisteId?: string;
}
interface SøkMedUrlParametreAction {
    href: string;
    kandidatlisteId?: string;
}

export function* leggUrlParametereIStateOgSøk(action: SøkMedUrlParametreAction) {
    try {
        let initialQuery: InitialQuery = mapUrlToInitialQuery(action.href, action.kandidatlisteId);
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
        const initialQueryMedKandidatlisteId = {
            ...initialQuery,
            kandidatlisteId: action.kandidatlisteId,
        };
        const initialQueryMedGeografi = yield call(
            leggPåGeografiInfoHvisKommune,
            initialQueryMedKandidatlisteId
        );
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
