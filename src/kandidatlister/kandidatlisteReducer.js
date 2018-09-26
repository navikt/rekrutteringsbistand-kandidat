import { put, takeLatest } from 'redux-saga/effects';
import { fetchKandidatlister, postKandidatliste, SearchApiError } from '../sok/api';
import { LAGRE_STATUS } from '../konstanter';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const OPPRETT_KANDIDATLISTE = 'OPPRETT_KANDIDATLISTE';
export const OPPRETT_KANDIDATLISTE_SUCCESS = 'OPPRETT_KANDIDATLISTE_SUCCESS';
export const OPPRETT_KANDIDATLISTE_FAILURE = 'OPPRETT_KANDIDATLISTE_FAILURE';

export const HENT_KANDIDATLISTER = 'HENT_KANDIDATLISTER';
export const HENT_KANDIDATLISTER_SUCCESS = 'HENT_KANDIDATLISTER_SUCCESS';
export const HENT_KANDIDATLISTER_FAILURE = 'HENT_KANDIDATLISTER_FAILURE';

export const RESET_LAGRE_STATUS = 'RESET_LAGRE_STATUS';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    lagreStatus: LAGRE_STATUS.UNSAVED,
    fetchingKandidatlister: false,
    kandidatlister: undefined
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case OPPRETT_KANDIDATLISTE:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.LOADING
            };
        case OPPRETT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.SUCCESS
            };
        case OPPRETT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.FAILURE
            };
        case RESET_LAGRE_STATUS:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.UNSAVED
            };
        case HENT_KANDIDATLISTER:
            return {
                ...state,
                fetchKandidatlister: true
            };
        case HENT_KANDIDATLISTER_SUCCESS:
            return {
                ...state,
                kandidatlister: action.kandidatlister,
                fetchKandidatlister: false
            };
        case HENT_KANDIDATLISTER_FAILURE:
            return {
                ...state,
                fetchKandidatlister: false
            };
        default:
            return state;
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* opprettKandidatliste(action) {
    try {
        yield postKandidatliste({ ...action.kandidatlisteInfo, stillingReferanse: 'test' });
        yield put({ type: OPPRETT_KANDIDATLISTE_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: OPPRETT_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

const midlertidig = (response) => (
    response._embedded.kandidatlister.map((kandidatliste) => (
        {
            ...kandidatliste,
            organisasjonNavn: kandidatliste.organisasjonNr,
            organisasjonNr: kandidatliste.organisasjonNavn
        }
    ))
);


function* hentKandidatlister(action) {
    try {
        const response = yield fetchKandidatlister('010005434');
        yield put({ type: HENT_KANDIDATLISTER_SUCCESS, kandidatlister: midlertidig(response) });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_KANDIDATLISTER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export function* kandidatlisteSaga() {
    yield takeLatest(OPPRETT_KANDIDATLISTE, opprettKandidatliste);
    yield takeLatest(HENT_KANDIDATLISTER, hentKandidatlister);
}

