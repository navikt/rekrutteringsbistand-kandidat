import { put, takeLatest, select } from 'redux-saga/effects';
import { fetchKandidatliste } from '../api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const HENT_KANDIDATLISTE = 'HENT_KANDIDATLISTE';
export const HENT_KANDIDATLISTE_SUCCESS = 'HENT_KANDIDATLISTE_SUCCESS';
export const HENT_KANDIDATLISTE_FAILURE = 'HENT_KANDIDATLISTE_FAILURE';
export const CLEAR_KANDIDATLISTE = 'CLEAR_KANDIDATLISTE';

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

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    detaljer: {
        fetching: false,
        kandidatliste: undefined
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
                    ...state.kandidatlister,
                    fetching: false
                }
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
        const state = yield select();
        const orgNr = state.mineArbeidsgivere.valgtArbeidsgiverId;
        yield postKandidatliste(action.kandidatlisteInfo, orgNr);
        yield put({ type: OPPRETT_KANDIDATLISTE_SUCCESS, tittel: action.kandidatlisteInfo.tittel });
        yield put({ type: HENT_KANDIDATLISTER });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: OPPRETT_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

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

function* slettKandidater(action) {
    try {
        const { kandidater, kandidatlisteId } = action;
        const slettKandidatnr = kandidater.map((k) => k.kandidatnr);
        const response = yield deleteKandidater(kandidatlisteId, slettKandidatnr);
        yield put({ type: SLETT_KANDIDATER_SUCCESS, nyKandidatliste: response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SLETT_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* slettKandidatListe(action) {
    try {
        const kandidatlisteId = action.kandidatlisteId;
        yield deleteKandidatliste(kandidatlisteId);
        yield put({ type: SLETT_KANDIDATLISTE_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SLETT_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentKandidatlister() {
    try {
        const state = yield select();
        const orgNr = state.mineArbeidsgivere.valgtArbeidsgiverId;
        const response = yield fetchKandidatlister(orgNr);
        const sortertKandidatliste = sortKandidatlisteByDato(response.liste);
        yield put({ type: HENT_KANDIDATLISTER_SUCCESS, kandidatlister: sortertKandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_KANDIDATLISTER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* leggTilKandidater(action) {
    try {
        for (let i = 0; i < action.kandidatlisteIder.length; i += 1) {
            yield postKandidaterTilKandidatliste(action.kandidatlisteIder[i], action.kandidater);
        }
        yield put({ type: LEGG_TIL_KANDIDATER_SUCCESS, antallLagredeKandidater: action.kandidater.length });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: LEGG_TIL_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* oppdaterKandidatliste(action) {
    try {
        yield putKandidatliste(action.kandidatlisteInfo);
        yield put({ type: OPPDATER_KANDIDATLISTE_SUCCESS, tittel: action.kandidatlisteInfo.tittel });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: OPPDATER_KANDIDATLISTE_FAILURE, error: e });
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
    yield takeLatest(SLETT_KANDIDATER, slettKandidater);
    yield takeLatest(LEGG_TIL_KANDIDATER, leggTilKandidater);
    yield takeLatest(OPPDATER_KANDIDATLISTE, oppdaterKandidatliste);
    yield takeLatest([
        HENT_KANDIDATLISTE_FAILURE,
        SLETT_KANDIDATER_FAILURE
    ],
    sjekkError);
}

