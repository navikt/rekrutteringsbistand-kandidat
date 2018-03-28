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
export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';

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
        utdanninger: [],
        kompetanser: []
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

        case SET_INITIAL_STATE:
            return {
                ...state,
                query: {
                    ...state.query,
                    ...action.query
                },
                isSearching: false

            };
        default:
            return { ...state };
    }
}

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* search(action) {
    try {
        const query = action.query;
        yield put({ type: SEARCH_BEGIN, query: query });
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

function* initialSearch(action) {
    try {
        if (Object.keys(action.query).length > 0) {
            yield put({ type: SET_INITIAL_STATE, query: action.query });
        }

        // yield call(search, action.query);
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
    yield takeLatest(INITIAL_SEARCH, initialSearch);
};
