import { put, takeLatest, select } from 'redux-saga/effects';
import {
    fetchKandidatlister,
    postKandidatliste,
    SearchApiError,
    deleteKandidater,
    fetchKandidatliste,
    putKandidatliste,
    postKandidaterTilKandidatliste
} from '../sok/api';
import { LAGRE_STATUS, SLETTE_STATUS } from '../konstanter';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';

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
    lagreStatus: LAGRE_STATUS.UNSAVED,
    detaljer: {
        sletteStatus: SLETTE_STATUS.FINISHED,
        kandidatliste: undefined
    },
    opprett: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        opprettetKandidatlisteTittel: undefined
    },
    leggTilKandidater: {
        lagreStatus: LAGRE_STATUS.UNSAVED
    },
    fetchingKandidatlister: false,
    kandidatlister: undefined
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case OPPDATER_KANDIDATLISTE:
        case OPPRETT_KANDIDATLISTE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.LOADING,
                    opprettetKandidatlisteTittel: undefined
                }
            };
        case OPPRETT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.SUCCESS,
                    opprettetKandidatlisteTittel: action.tittel
                }
            };
        case OPPDATER_KANDIDATLISTE_FAILURE:
        case OPPRETT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.FAILURE,
                    opprettetKandidatlisteTittel: undefined
                }
            };
        case OPPDATER_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.SUCCESS
                }
            };
        case RESET_LAGRE_STATUS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.UNSAVED
                }
            };
        case HENT_KANDIDATLISTER:
            return {
                ...state,
                fetchingKandidatlister: true
            };
        case HENT_KANDIDATLISTER_SUCCESS:
            return {
                ...state,
                kandidatlister: action.kandidatlister,
                fetchingKandidatlister: false
            };
        case HENT_KANDIDATLISTER_FAILURE:
            return {
                ...state,
                fetchingKandidatlister: false
            };
        case HENT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: action.kandidatliste
                }
            };
        case HENT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                detaljer: {
                    ...state.kandidatlister,
                    sletteStatus: SLETTE_STATUS.FAILURE
                }
            };
        case CLEAR_KANDIDATLISTE:
            return {
                ...state,
                detaljer: {
                    ...initialState.detaljer
                }
            };
        case SLETT_KANDIDATER: {
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    sletteStatus: SLETTE_STATUS.LOADING
                }
            };
        }
        case SLETT_KANDIDATER_SUCCESS: {
            const { nyKandidatliste } = action;
            return {
                ...state,
                detaljer: {
                    kandidatliste: nyKandidatliste,
                    sletteStatus: SLETTE_STATUS.SUCCESS
                }
            };
        }
        case SLETT_KANDIDATER_FAILURE:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    sletteStatus: SLETTE_STATUS.FAILURE
                }
            };
        case SLETT_KANDIDATER_RESET_STATUS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    sletteStatus: SLETTE_STATUS.FINISHED
                }
            };
        case LEGG_TIL_KANDIDATER:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.LOADING
                }
            };
        case LEGG_TIL_KANDIDATER_SUCCESS:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.SUCCESS
                }
            };
        case LEGG_TIL_KANDIDATER_FAILURE:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.FAILURE
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
    const { kandidatlisteId } = action;
    try {
        const kandidatliste = yield fetchKandidatliste(kandidatlisteId);
        yield put({ type: HENT_KANDIDATLISTE_SUCCESS, kandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_KANDIDATLISTE_FAILURE });
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
            yield put({ type: SLETT_KANDIDATER_FAILURE });
        }
    }
}


function* hentKandidatlister() {
    try {
        const state = yield select();
        const orgNr = state.mineArbeidsgivere.valgtArbeidsgiverId;
        const response = yield fetchKandidatlister(orgNr);
        yield put({ type: HENT_KANDIDATLISTER_SUCCESS, kandidatlister: response.liste });
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
        yield put({ type: LEGG_TIL_KANDIDATER_SUCCESS });
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
    yield takeLatest(OPPRETT_KANDIDATLISTE, opprettKandidatliste);
    yield takeLatest(HENT_KANDIDATLISTE, hentKandidatListe);
    yield takeLatest(SLETT_KANDIDATER, slettKandidater);
    yield takeLatest(LEGG_TIL_KANDIDATER, leggTilKandidater);
    yield takeLatest(HENT_KANDIDATLISTER, hentKandidatlister);
    yield takeLatest(OPPDATER_KANDIDATLISTE, oppdaterKandidatliste);
    yield takeLatest([
        OPPRETT_KANDIDATLISTE_FAILURE,
        HENT_KANDIDATLISTER_FAILURE
    ],
    sjekkError);
}

