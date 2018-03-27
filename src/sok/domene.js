import { all, call, put, takeLatest } from 'redux-saga/effects';
import { SearchApiError, fetchKandidater, fetchKandidatInfo } from './api';
import { leggMerInfoTilKandidaterOgSorter } from './utils';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    kandidatResultat: {
        kandidater: [],
        total: 0
    },
    query: {
        yrke: '',
        utdanninger: '',
        kompetanser: 0
    },
    isSearching: false,
    error: undefined
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_BEGIN:
            return {
                ...state,
                query: action.query,
                isSearching: true
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                isSearching: false,
                error: undefined,
                kandidatResultat: { ...state.kandidatResultat, kandidater: action.response, total: action.response.length }
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                error: action.error
            };
        default:
            return state;
    }
}

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* search(action) {
    try {
        yield put({ type: SEARCH_BEGIN });
        const query = action.query;
        const kandidater = yield call(fetchKandidater, query);
        const result = yield all(
            kandidater.map((r) => call(fetchKandidatInfo, r.id))
        );
        const kandidaterMedAlleFelter = leggMerInfoTilKandidaterOgSorter(kandidater, result);

        yield put({ type: SEARCH_SUCCESS, response: kandidaterMedAlleFelter });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}


export const saga = function* () {
    yield takeLatest(SEARCH, search);
};
