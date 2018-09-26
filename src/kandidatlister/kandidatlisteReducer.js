import { put, takeLatest } from 'redux-saga/effects';
import { postKandidatliste, SearchApiError } from '../sok/api';
import { LAGRE_STATUS } from '../konstanter';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const OPPRETT_KANDIDATLISTE = 'OPPRETT_KANDIDATLISTE';
export const OPPRETT_KANDIDATLISTE_SUCCESS = 'OPPRETT_KANDIDATLISTE_SUCCESS';
export const OPPRETT_KANDIDATLISTE_FAILURE = 'OPPRETT_KANDIDATLISTE_FAILURE';

export const RESET_LAGRE_STATUS = 'RESET_LAGRE_STATUS';

export const HENT_KANDIDATLISTE = 'HENT_KANDIDATLISTE';
export const HENT_KANDIDATLISTE_SUCCESS = 'HENT_KANDIDATLISTE_SUCCESS';
export const HENT_KANDIDATLISTE_FAILURE = 'HENT_KANDIDATLISTE_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    lagreStatus: LAGRE_STATUS.UNSAVED,
    kandidater: []
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
        case HENT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                kandidater: action.kandidater
            };
        case HENT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                kandidater: []
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

function* hentKandidatListe() {
    // const { listeId } = action;
    try {
        yield put({ type: HENT_KANDIDATLISTE_SUCCESS,
            kandidater: [
                { lagtTilAv: 'meg', kandidatnr: '1234', arbeidsErfaring: 'Mye rart' },
                { lagtTilAv: 'deg', kandidatnr: '1235', arbeidsErfaring: 'Kokk' }
            ]
        });
    } catch (e) {
        yield put({ type: HENT_KANDIDATLISTE_FAILURE });
    }
}

export function* kandidatlisteSaga() {
    yield takeLatest(OPPRETT_KANDIDATLISTE, opprettKandidatliste);
    yield takeLatest(HENT_KANDIDATLISTE, hentKandidatListe);
}

