import { put, takeLatest } from 'redux-saga/effects';
import { fetchKandidatliste, postDelteKandidater, putStatusKandidat, SearchApiError } from '../api';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const HENT_KANDIDATLISTE = 'HENT_KANDIDATLISTE';
export const HENT_KANDIDATLISTE_SUCCESS = 'HENT_KANDIDATLISTE_SUCCESS';
export const HENT_KANDIDATLISTE_FAILURE = 'HENT_KANDIDATLISTE_FAILURE';
export const CLEAR_KANDIDATLISTE = 'CLEAR_KANDIDATLISTE';

export const PRESENTER_KANDIDATER = 'PRESENTER_KANDIDATER';
export const PRESENTER_KANDIDATER_SUCCESS = 'PRESENTER_KANDIDATER_SUCCESS';
export const PRESENTER_KANDIDATER_FAILURE = 'PRESENTER_KANDIDATER_FAILURE';
export const RESET_DELE_STATUS = 'RESET_DELE_STATUS';

export const SLETT_KANDIDATER = 'SLETT_KANDIDATER';
export const SLETT_KANDIDATER_SUCCESS = 'SLETT_KANDIDATER_SUCCESS';
export const SLETT_KANDIDATER_FAILURE = 'SLETT_KANDIDATER_FAILURE';
export const SLETT_KANDIDATER_RESET_STATUS = 'SLETT_KANDIDATER_RESET_STATUS';

export const LEGG_TIL_KANDIDATER = 'LEGG_TIL_KANDIDATER';
export const LEGG_TIL_KANDIDATER_SUCCESS = 'LEGG_TIL_KANDIDATER_SUCCESS';
export const LEGG_TIL_KANDIDATER_FAILURE = 'LEGG_TIL_KANDIDATER_FAILURE';

export const OPPDATER_KANDIDATLISTE = 'OPPDATER_KANDIDATLISTE_BEGIN';
export const OPPDATER_KANDIDATLISTE_SUCCESS = 'OPPDATER_KANDIDATLISTE_SUCCESS';
export const OPPDATER_KANDIDATLISTE_FAILURE = 'OPPDATER_KANDIDATLISTE_FAILURE';

export const ENDRE_STATUS_KANDIDAT = 'ENDRE_STATUS_KANDIDAT';
export const ENDRE_STATUS_KANDIDAT_SUCCESS = 'ENDRE_STATUS_KANDIDAT_SUCCESS';
export const ENDRE_STATUS_KANDIDAT_FAILURE = 'ENDRE_STATUS_KANDIDAT_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

export const DELE_STATUS = {
    IKKE_SPURT: 'IKKE_SPURT',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS'
};

const initialState = {
    detaljer: {
        fetching: false,
        kandidatliste: undefined,
        deleStatus: DELE_STATUS.IKKE_SPURT
    }
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case HENT_KANDIDATLISTE:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    fetching: true
                }
            };
        case HENT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: action.kandidatliste,
                    fetching: false
                }
            };
        case HENT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    fetching: false
                }
            };
        case ENDRE_STATUS_KANDIDAT_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: action.kandidatliste
                }
            };
        case PRESENTER_KANDIDATER:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: DELE_STATUS.LOADING
                }
            };
        case PRESENTER_KANDIDATER_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: DELE_STATUS.SUCCESS
                }
            };
        case PRESENTER_KANDIDATER_FAILURE:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: DELE_STATUS.IKKE_SPURT
                }
            };
        case RESET_DELE_STATUS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    deleStatus: DELE_STATUS.IKKE_SPURT
                }
            };
        default:
            return state;
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* hentKandidatListe(action) {
    const { stillingsnummer } = action;
    try {
        const kandidatliste = yield fetchKandidatliste(stillingsnummer);
        yield put({ type: HENT_KANDIDATLISTE_SUCCESS, kandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* presenterKandidater(action) {
    try {
        const { beskjed, mailadresser, kandidatlisteId, kandidatnummerListe } = action;
        yield postDelteKandidater(beskjed, mailadresser, kandidatlisteId, kandidatnummerListe);
        yield put({ type: PRESENTER_KANDIDATER_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: PRESENTER_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* endreKandidatstatus(action) {
    const { status, kandidatlisteId, kandidatnr } = action;
    try {
        const response = yield putStatusKandidat(status, kandidatlisteId, kandidatnr);
        yield put({ type: ENDRE_STATUS_KANDIDAT_SUCCESS, kandidatliste: response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: ENDRE_STATUS_KANDIDAT_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* sjekkError(action) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

export function* kandidatlisteSaga() {
    yield takeLatest(HENT_KANDIDATLISTE, hentKandidatListe);
    yield takeLatest(PRESENTER_KANDIDATER, presenterKandidater);
    yield takeLatest(ENDRE_STATUS_KANDIDAT, endreKandidatstatus);
    yield takeLatest([
        HENT_KANDIDATLISTE_FAILURE,
        SLETT_KANDIDATER_FAILURE,
        ENDRE_STATUS_KANDIDAT_FAILURE,
        PRESENTER_KANDIDATER_FAILURE
    ],
    sjekkError);
}

