import { put, takeLatest, call } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchKandidatlisteMedStillingsId,
    fetchKandidatlisteMedKandidatlisteId,
    postDelteKandidater,
    putStatusKandidat,
    fetchKandidatMedFnr,
    postKandidaterTilKandidatliste,
    fetchNotater,
    postNotat,
    putKandidatliste,
    postKandidatliste,
    putNotat,
    deleteNotat,
    fetchEgneKandidatlister,
    fetchKandidatlisteMedAnnonsenummer
} from '../api';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';
import { LAGRE_STATUS } from '../../felles/konstanter';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const OPPRETT_KANDIDATLISTE = 'OPPRETT_KANDIDATLISTE';
export const OPPRETT_KANDIDATLISTE_SUCCESS = 'OPPRETT_KANDIDATLISTE_SUCCESS';
export const OPPRETT_KANDIDATLISTE_FAILURE = 'OPPRETT_KANDIDATLISTE_FAILURE';

export const HENT_KANDIDATLISTE_MED_STILLINGS_ID = 'HENT_KANDIDATLISTE_MED_STILLINGS_ID';
export const HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS = 'HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS';
export const HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE = 'HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE';

export const HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID = 'HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID';
export const HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS = 'HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS';
export const HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE = 'HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE';

export const RESET_LAGRE_STATUS = 'RESET_LAGRE_STATUS';

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

export const LAGRE_KANDIDAT_I_KANDIDATLISTE = 'LAGRE_KANDIDAT_I_KANDIDATLISTE';
export const LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS = 'LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS';
export const LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE = 'LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE';

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

export const HENT_KANDIDATLISTER = 'HENT_KANDIDATLISTER';
export const HENT_KANDIDATLISTER_SUCCESS = 'HENT_KANDIDATLISTER_SUCCESS';
export const HENT_KANDIDATLISTER_FAILURE = 'HENT_KANDIDATLISTER_FAILURE';

export const HENT_KANDIDATLISTE_MED_ANNONSENUMMER = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER';
export const HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS';
export const HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND';
export const HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE = 'HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE';

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
    opprett: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        opprettetKandidatlisteTittel: undefined
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
        antallLagredeKandidater: 0,
        lagretListe: {}
    },
    notater: undefined,
    hentListerStatus: HENT_STATUS.IKKE_HENTET,
    egneKandidatlister: {
        liste: []
    },
    hentListeMedAnnonsenummerStatus: HENT_STATUS.IKKE_HENTET,
    kandidatlisteMedAnnonsenummer: undefined,
    lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.UNSAVED
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
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
        case OPPRETT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.FAILURE,
                    opprettetKandidatlisteTittel: undefined
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
        case HENT_KANDIDATLISTE_MED_STILLINGS_ID:
        case HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    fetching: true
                }
            };
        case HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS:
        case HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS:
            return {
                ...state,
                detaljer: {
                    ...state.detaljer,
                    kandidatliste: action.kandidatliste,
                    fetching: false
                }
            };
        case HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE:
        case HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE:
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
                    antallLagredeKandidater: action.antallLagredeKandidater,
                    lagretListe: action.lagretListe
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
        case LAGRE_KANDIDAT_I_KANDIDATLISTE:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.LOADING
            };
        case LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.SUCCESS
            };
        case LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                lagreKandidatIKandidatlisteStatus: LAGRE_STATUS.FAILURE
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
        case HENT_KANDIDATLISTER:
            return {
                ...state,
                hentListerStatus: HENT_STATUS.LOADING
            };
        case HENT_KANDIDATLISTER_SUCCESS:
            return {
                ...state,
                hentListerStatus: HENT_STATUS.SUCCESS,
                egneKandidatlister: {
                    liste: action.egneKandidatlister.liste
                }
            };
        case HENT_KANDIDATLISTER_FAILURE:
            return {
                ...state,
                hentListerStatus: HENT_STATUS.FAILURE
            };
        case HENT_KANDIDATLISTE_MED_ANNONSENUMMER:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HENT_STATUS.LOADING
            };
        case HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HENT_STATUS.SUCCESS,
                kandidatlisteMedAnnonsenummer: {
                    ...action.kandidatliste,
                    markert: true
                }
            };
        case HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HENT_STATUS.FINNES_IKKE
            };
        case HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE:
            return {
                ...state,
                hentListeMedAnnonsenummerStatus: HENT_STATUS.FAILURE
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
        yield postKandidatliste(action.kandidatlisteInfo);
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

function* opprettKandidatlisteForStilling(stillingsId, opprinneligError) {
    try {
        yield putKandidatliste(stillingsId);
        const kandidatliste = yield fetchKandidatlisteMedStillingsId(stillingsId);
        yield put({ type: HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS, kandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE, error: opprinneligError });
        } else {
            throw e;
        }
    }
}

function* hentKandidatlisteMedStillingsId(action) {
    const { stillingsId } = action;
    try {
        const kandidatliste = yield fetchKandidatlisteMedStillingsId(stillingsId);
        yield put({ type: HENT_KANDIDATLISTE_MED_STILLINGS_ID_SUCCESS, kandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield opprettKandidatlisteForStilling(stillingsId, e);
            } else {
                yield put({ type: HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE, error: e });
            }
        } else {
            throw e;
        }
    }
}

function* hentKandidatlisteMedKandidatlisteId(action) {
    const { kandidatlisteId } = action;
    try {
        const kandidatliste = yield fetchKandidatlisteMedKandidatlisteId(kandidatlisteId);
        yield put({ type: HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_SUCCESS, kandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE, error: e });
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
        const response = yield postKandidaterTilKandidatliste(action.kandidatliste.kandidatlisteId, action.kandidater);
        yield put({
            type: LEGG_TIL_KANDIDATER_SUCCESS,
            kandidatliste: response,
            antallLagredeKandidater: action.kandidater.length,
            lagretListe: action.kandidatliste
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: LEGG_TIL_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* lagreKandidatIKandidatliste(action) {
    try {
        const response = yield call(fetchKandidatMedFnr, action.fodselsnummer);
        yield call(leggTilKandidater,
            {
                kandidatliste: action.kandidatliste,
                kandidater:
                [{
                    kandidatnr: response.arenaKandidatnr,
                    sisteArbeidserfaring: response.mestRelevanteYrkeserfaring ? response.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : ''
                }]
            });

        yield put({ type: LAGRE_KANDIDAT_I_KANDIDATLISTE_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE, error: e });
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

function* hentEgneLister() {
    try {
        const egneKandidatlister = yield fetchEgneKandidatlister();
        yield put({ type: HENT_KANDIDATLISTER_SUCCESS, egneKandidatlister });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: HENT_KANDIDATLISTER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* hentKandidatlisteMedAnnonsenummer(action) {
    try {
        const kandidatliste = yield fetchKandidatlisteMedAnnonsenummer(action.annonsenummer);
        yield put({ type: HENT_KANDIDATLISTE_MED_ANNONSENUMMER_SUCCESS, kandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({ type: HENT_KANDIDATLISTE_MED_ANNONSENUMMER_NOT_FOUND });
            } else {
                yield put({ type: HENT_KANDIDATLISTE_MED_ANNONSENUMMER_FAILURE, error: e });
            }
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
    yield takeLatest(OPPRETT_KANDIDATLISTE, opprettKandidatliste);
    yield takeLatest(HENT_KANDIDATLISTE_MED_STILLINGS_ID, hentKandidatlisteMedStillingsId);
    yield takeLatest(HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID, hentKandidatlisteMedKandidatlisteId);
    yield takeLatest(PRESENTER_KANDIDATER, presenterKandidater);
    yield takeLatest(ENDRE_STATUS_KANDIDAT, endreKandidatstatus);
    yield takeLatest(HENT_KANDIDAT_MED_FNR, hentKandidatMedFnr);
    yield takeLatest(LEGG_TIL_KANDIDATER, leggTilKandidater);
    yield takeLatest(HENT_NOTATER, hentNotater);
    yield takeLatest(OPPRETT_NOTAT, opprettNotat);
    yield takeLatest(ENDRE_NOTAT, endreNotat);
    yield takeLatest(SLETT_NOTAT, slettNotat);
    yield takeLatest(HENT_KANDIDATLISTER, hentEgneLister);
    yield takeLatest(HENT_KANDIDATLISTE_MED_ANNONSENUMMER, hentKandidatlisteMedAnnonsenummer);
    yield takeLatest(LAGRE_KANDIDAT_I_KANDIDATLISTE, lagreKandidatIKandidatliste);
    yield takeLatest([
        OPPRETT_KANDIDATLISTE_FAILURE,
        HENT_KANDIDATLISTE_MED_STILLINGS_ID_FAILURE,
        HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID_FAILURE,
        SLETT_KANDIDATER_FAILURE,
        ENDRE_STATUS_KANDIDAT_FAILURE,
        PRESENTER_KANDIDATER_FAILURE,
        HENT_KANDIDAT_MED_FNR_FAILURE,
        LEGG_TIL_KANDIDATER_FAILURE,
        OPPRETT_NOTAT_FAILURE,
        ENDRE_NOTAT_FAILURE,
        SLETT_NOTAT_FAILURE,
        HENT_KANDIDATLISTER_FAILURE,
        LAGRE_KANDIDAT_I_KANDIDATLISTE_FAILURE
    ],
    sjekkError);
}

