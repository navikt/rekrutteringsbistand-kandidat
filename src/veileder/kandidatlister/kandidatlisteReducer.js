import { put, takeLatest } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchKandidatliste,
    postDelteKandidater,
    putStatusKandidat,
    fetchKandidatMedFnr,
    postKandidaterTilKandidatliste,
    fetchNotater,
    postNotat,
    putKandidatliste,
    putNotat,
    deleteNotat
} from '../api';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';
import { LAGRE_STATUS } from '../../felles/konstanter';

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

export const SET_FODSELSNUMMER = 'SET_FODSELSNUMMER';

export const HENT_KANDIDAT_MED_FNR = 'HENT_KANDIDAT_MED_FNR';
export const HENT_KANDIDAT_MED_FNR_SUCCESS = 'HENT_KANDIDAT_MED_FNR_SUCCESS';
export const HENT_KANDIDAT_MED_FNR_NOT_FOUND = 'HENT_KANDIDAT_MED_FNR_NOT_FOUND';
export const HENT_KANDIDAT_MED_FNR_FAILURE = 'HENT_KANDIDAT_MED_FNR_FAILURE';
export const HENT_KANDIDAT_MED_FNR_RESET = 'HENT_KANDIDAT_MED_FNR_RESET';

export const HENT_NOTATER = 'HENT_NOTATER';
export const HENT_NOTATER_SUCCESS = 'HENT_NOTATER_SUCCESS';
export const HENT_NOTATER_FAILURE = 'HENT_NOTATER_FAILURE';

export const OPPRETT_NOTAT = 'OPPRETT_NOTAT';
export const OPPRETT_NOTAT_SUCCESS = 'OPPRETT_NOTAT_SUCCESS';
export const OPPRETT_NOTAT_FAILURE = 'OPPRETT_NOTAT_FAILURE';

export const ENDRE_NOTAT = 'ENDRE_NOTAT';
export const ENDRE_NOTAT_SUCCESS = 'ENDRE_NOTAT_SUCCESS';
export const ENDRE_NOTAT_FAILURE = 'ENDRE_NOTAT_FAILURE';

export const SLETT_NOTAT = 'SLETT_NOTAT';
export const SLETT_NOTAT_SUCCESS = 'SLETT_NOTAT_SUCCESS';
export const SLETT_NOTAT_FAILURE = 'SLETT_NOTAT_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

export const DELE_STATUS = {
    IKKE_SPURT: 'IKKE_SPURT',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS'
};

export const HENT_STATUS = {
    IKKE_HENTET: 'IKKE_HENTET',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    FINNES_IKKE: 'FINNES_IKKE',
    FAILURE: 'FAILURE'
};

const initialState = {
    lagreStatus: LAGRE_STATUS.UNSAVED,
    detaljer: {
        fetching: false,
        kandidatliste: undefined,
        deleStatus: DELE_STATUS.IKKE_SPURT
    },
    fodselsnummer: undefined,
    hentStatus: HENT_STATUS.IKKE_HENTET,
    kandidat: {
        arenaKandidatnr: undefined,
        fornavn: undefined,
        etternavn: undefined,
        mestRelevanteYrkeserfaring: {
            styrkKodeStillingstittel: undefined,
            yrkeserfaringManeder: undefined
        }
    },
    leggTilKandidater: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        antallLagredeKandidater: 0
    },
    notater: undefined
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
                    kandidatliste: action.kandidatliste,
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
        case SET_FODSELSNUMMER: {
            return {
                ...state,
                fodselsnummer: action.fodselsnummer
            };
        }
        case HENT_KANDIDAT_MED_FNR: {
            return {
                ...state,
                hentStatus: HENT_STATUS.LOADING
            };
        }
        case HENT_KANDIDAT_MED_FNR_SUCCESS: {
            return {
                ...state,
                hentStatus: HENT_STATUS.SUCCESS,
                kandidat: action.kandidat
            };
        }
        case HENT_KANDIDAT_MED_FNR_NOT_FOUND: {
            return {
                ...state,
                hentStatus: HENT_STATUS.FINNES_IKKE
            };
        }
        case HENT_KANDIDAT_MED_FNR_FAILURE: {
            return {
                ...state,
                hentStatus: HENT_STATUS.FAILURE
            };
        }
        case HENT_KANDIDAT_MED_FNR_RESET: {
            return {
                ...state,
                hentStatus: HENT_STATUS.IKKE_HENTET,
                kandidat: initialState.kandidat
            };
        }
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
                    lagreStatus: LAGRE_STATUS.SUCCESS,
                    antallLagredeKandidater: action.antallLagredeKandidater
                },
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: action.kandidatliste
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
        case HENT_NOTATER:
            return {
                ...state,
                notater: undefined
            };
        case HENT_NOTATER_SUCCESS:
            return {
                ...state,
                notater: {
                    kandidatnr: action.kandidatnr,
                    notater: action.notater
                }
            };
        case OPPRETT_NOTAT_SUCCESS:
            return {
                ...state,
                notater: {
                    kandidatnr: action.kandidatnr,
                    notater: action.notater
                }
            };
        case ENDRE_NOTAT_SUCCESS:
            return {
                ...state,
                notater: {
                    kandidatnr: action.kandidatnr,
                    notater: action.notater
                }
            };
        case SLETT_NOTAT_SUCCESS:
            return {
                ...state,
                notater: {
                    kandidatnr: action.kandidatnr,
                    notater: action.notater
                }
            };
        default:
            return state;
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* opprettKandidatlisteForStilling(stillingsnummer, opprinneligError) {
    try {
        yield putKandidatliste(stillingsnummer);
        const kandidatliste = yield fetchKandidatliste(stillingsnummer);
        yield put({ type: HENT_KANDIDATLISTE_SUCCESS, kandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_KANDIDATLISTE_FAILURE, error: opprinneligError });
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
            if (e.status === 404) {
                yield opprettKandidatlisteForStilling(stillingsnummer, e);
            } else {
                yield put({ type: HENT_KANDIDATLISTE_FAILURE, error: e });
            }
        } else {
            throw e;
        }
    }
}

function* presenterKandidater(action) {
    try {
        const { beskjed, mailadresser, kandidatlisteId, kandidatnummerListe } = action;
        const response = yield postDelteKandidater(beskjed, mailadresser, kandidatlisteId, kandidatnummerListe);
        yield put({ type: PRESENTER_KANDIDATER_SUCCESS, kandidatliste: response });
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

function* hentKandidatMedFnr(action) {
    try {
        const response = yield fetchKandidatMedFnr(action.fodselsnummer);
        yield put({ type: HENT_KANDIDAT_MED_FNR_SUCCESS, kandidat: response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({ type: HENT_KANDIDAT_MED_FNR_NOT_FOUND });
            } else {
                yield put({ type: HENT_KANDIDAT_MED_FNR_FAILURE, error: e });
            }
        } else {
            throw e;
        }
    }
}

function* leggTilKandidater(action) {
    try {
        let response;
        for (let i = 0; i < action.kandidatlisteIder.length; i += 1) {
            response = yield postKandidaterTilKandidatliste(action.kandidatlisteIder[i], action.kandidater);
        }
        yield put({ type: LEGG_TIL_KANDIDATER_SUCCESS, kandidatliste: response, antallLagredeKandidater: action.kandidater.length });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: LEGG_TIL_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentNotater(action) {
    try {
        const response = yield fetchNotater(action.kandidatlisteId, action.kandidatnr);
        yield put({ type: HENT_NOTATER_SUCCESS, notater: response.liste, kandidatnr: action.kandidatnr });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_NOTATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* opprettNotat(action) {
    try {
        const response = yield postNotat(action.kandidatlisteId, action.kandidatnr, action.tekst);
        yield put({ type: OPPRETT_NOTAT_SUCCESS, notater: response.liste, kandidatnr: action.kandidatnr });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: OPPRETT_NOTAT_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* endreNotat(action) {
    try {
        const response = yield putNotat(action.kandidatlisteId, action.kandidatnr, action.notatId, action.tekst);
        yield put({ type: ENDRE_NOTAT_SUCCESS, notater: response.liste, kandidatnr: action.kandidatnr });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: ENDRE_NOTAT_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* slettNotat(action) {
    try {
        const response = yield deleteNotat(action.kandidatlisteId, action.kandidatnr, action.notatId);
        yield put({ type: SLETT_NOTAT_SUCCESS, notater: response.liste, kandidatnr: action.kandidatnr });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SLETT_NOTAT_FAILURE, error: e });
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
    yield takeLatest(HENT_KANDIDAT_MED_FNR, hentKandidatMedFnr);
    yield takeLatest(LEGG_TIL_KANDIDATER, leggTilKandidater);
    yield takeLatest(HENT_NOTATER, hentNotater);
    yield takeLatest(OPPRETT_NOTAT, opprettNotat);
    yield takeLatest(ENDRE_NOTAT, endreNotat);
    yield takeLatest(SLETT_NOTAT, slettNotat);
    yield takeLatest([
        HENT_KANDIDATLISTE_FAILURE,
        SLETT_KANDIDATER_FAILURE,
        ENDRE_STATUS_KANDIDAT_FAILURE,
        PRESENTER_KANDIDATER_FAILURE,
        HENT_KANDIDAT_MED_FNR_FAILURE,
        LEGG_TIL_KANDIDATER_FAILURE,
        OPPRETT_NOTAT_FAILURE,
        ENDRE_NOTAT_FAILURE,
        SLETT_NOTAT_FAILURE
    ],
    sjekkError);
}

