import { put, select, takeLatest } from 'redux-saga/effects';
import {
    deleteKandidatliste,
    fetchKandidatlister,
    postKandidaterTilKandidatliste,
    postKandidatliste,
    putKandidatliste,
    SearchApiError
} from '../sok/api';
import { LAGRE_STATUS, SLETTE_STATUS } from '../../felles/konstanter';
import { INVALID_RESPONSE_STATUS } from '../sok/searchReducer';
import { sortKandidatlisteByDato } from '../../felles/common/SortByDato';
import { Reducer } from 'redux';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export enum KandidatlisteTypes {
    OPPRETT_KANDIDATLISTE = 'OPPRETT_KANDIDATLISTE',
    OPPRETT_KANDIDATLISTE_SUCCESS = 'OPPRETT_KANDIDATLISTE_SUCCESS',
    OPPRETT_KANDIDATLISTE_FAILURE = 'OPPRETT_KANDIDATLISTE_FAILURE',
    HENT_KANDIDATLISTER = 'HENT_KANDIDATLISTER',
    HENT_KANDIDATLISTER_SUCCESS = 'HENT_KANDIDATLISTER_SUCCESS',
    HENT_KANDIDATLISTER_FAILURE = 'HENT_KANDIDATLISTER_FAILURE',
    RESET_LAGRE_STATUS = 'RESET_LAGRE_STATUS',
    SLETT_KANDIDATLISTE = 'SLETT_KANDIDATLISTE',
    SLETT_KANDIDATLISTE_SUCCESS = 'SLETT_KANDIDATLISTE_SUCCESS',
    SLETT_KANDIDATLISTE_FAILURE = 'SLETT_KANDIDATLISTE_FAILURE',
    SLETT_KANDIDATLISTE_RESET_STATUS = 'SLETT_KANDIDATLISTE_RESET_STATUS',
    LEGG_TIL_KANDIDATER = 'LEGG_TIL_KANDIDATER',
    LEGG_TIL_KANDIDATER_SUCCESS = 'LEGG_TIL_KANDIDATER_SUCCESS',
    LEGG_TIL_KANDIDATER_FAILURE = 'LEGG_TIL_KANDIDATER_FAILURE',
    OPPDATER_KANDIDATLISTE = 'OPPDATER_KANDIDATLISTE_BEGIN',
    OPPDATER_KANDIDATLISTE_SUCCESS = 'OPPDATER_KANDIDATLISTE_SUCCESS',
    OPPDATER_KANDIDATLISTE_FAILURE = 'OPPDATER_KANDIDATLISTE_FAILURE'
}

export interface KandidatlisteInfo {
    tittel: string;
    beskrivelse: string;
    oppdragsgiver: string;
}

export interface OpprettKandidatlisteAction {
    type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE,
    kandidatlisteInfo: KandidatlisteInfo
}

export interface OppdaterKandidatlisteAction {
    type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE,
    kandidatlisteInfo: KandidatlisteInfo
}

export interface OpprettKandidatlisteSuccessAction {
    type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE_SUCCESS;
    tittel: string;
}

export interface OppdaterKandidatlisteFailureAction {
    type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE_FAILURE;
}

export interface OpprettKandidatlisteFailureAction {
    type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE_FAILURE;
}

export interface OppdaterKandidatlisteSuccessAction {
    type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE_SUCCESS;
}

export interface ResetLagreStatusAction {
    type: KandidatlisteTypes.RESET_LAGRE_STATUS;
}

export interface HentKandidatlisterAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTER;
    kandidatlisteId: string;
}

export interface HentKandidatlisterSuccessAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTER_SUCCESS;
    kandidatlister: Array<KandidatlisteBeskrivelse>
}

export interface HentKandidatlisterFailureAction {
    type: KandidatlisteTypes.HENT_KANDIDATLISTER_FAILURE;
}

export interface LeggTilKandidaterAction {
    type: KandidatlisteTypes.LEGG_TIL_KANDIDATER;
    kandidatlisteIder: Array<string>;
    kandidater: Array<{
        kandidatnr: string;
        sisteArbeidserfaring: string;
    }>;
}

export interface LeggTilKandidaterSuccessAction {
    type: KandidatlisteTypes.LEGG_TIL_KANDIDATER_SUCCESS;
    antallLagredeKandidater: number
}

export interface LeggTilKandidaterFailureAction {
    type: KandidatlisteTypes.LEGG_TIL_KANDIDATER_FAILURE;
}

export interface SlettKandidatlisteAction {
    type: KandidatlisteTypes.SLETT_KANDIDATLISTE;
    kandidatlisteId: string;
}

export interface SlettKandidatlisteSuccessAction {
    type: KandidatlisteTypes.SLETT_KANDIDATLISTE_SUCCESS;
}

export interface SlettKandidatlisteFailureAction {
    type: KandidatlisteTypes.SLETT_KANDIDATLISTE_FAILURE;
}

export interface SlettKandidatlisteResetStatusAction {
    type: KandidatlisteTypes.SLETT_KANDIDATLISTE_RESET_STATUS;
}

export type KandidatlisteAction =
    | OpprettKandidatlisteAction
    | OppdaterKandidatlisteAction
    | OpprettKandidatlisteSuccessAction
    | OppdaterKandidatlisteFailureAction
    | OpprettKandidatlisteFailureAction
    | OppdaterKandidatlisteSuccessAction
    | ResetLagreStatusAction
    | HentKandidatlisterAction
    | HentKandidatlisterSuccessAction
    | HentKandidatlisterFailureAction
    | LeggTilKandidaterAction
    | LeggTilKandidaterSuccessAction
    | LeggTilKandidaterFailureAction
    | SlettKandidatlisteAction
    | SlettKandidatlisteSuccessAction
    | SlettKandidatlisteFailureAction
    | SlettKandidatlisteResetStatusAction

/** *********************************************************
 * REDUCER
 ********************************************************* */

export interface KandidatlisteBeskrivelse {
    tittel: string,
    kandidatlisteId: string,
    antallKandidater: number,
    opprettetTidspunkt: string,
    opprettetAvNav: boolean,
    oppdragsgiver?: string,
}

interface KandidatlisteState {
    lagreStatus: string;
    opprett: {
        lagreStatus: string;
        opprettetKandidatlisteTittel?: string;
    };
    slett: {
        sletteStatus: string;
    };
    leggTilKandidater: {
        lagreStatus: string;
        antallLagredeKandidater: number;
    };
    fetchingKandidatlister: boolean;
    kandidatlister?: Array<KandidatlisteBeskrivelse>;
}

const initialState: KandidatlisteState = {
    lagreStatus: LAGRE_STATUS.UNSAVED,
    opprett: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        opprettetKandidatlisteTittel: undefined
    },
    slett: {
        sletteStatus: SLETTE_STATUS.FINISHED
    },
    leggTilKandidater: {
        lagreStatus: LAGRE_STATUS.UNSAVED,
        antallLagredeKandidater: 0
    },
    fetchingKandidatlister: false,
    kandidatlister: undefined
};

const kandidatlisteReducer: Reducer<KandidatlisteState, KandidatlisteAction> = (state = initialState, action) => {
    switch (action.type) {
        case KandidatlisteTypes.OPPDATER_KANDIDATLISTE:
        case KandidatlisteTypes.OPPRETT_KANDIDATLISTE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.LOADING,
                    opprettetKandidatlisteTittel: undefined
                }
            };
        case KandidatlisteTypes.OPPRETT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.SUCCESS,
                    opprettetKandidatlisteTittel: action.tittel
                }
            };
        case KandidatlisteTypes.OPPDATER_KANDIDATLISTE_FAILURE:
        case KandidatlisteTypes.OPPRETT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.FAILURE,
                    opprettetKandidatlisteTittel: undefined
                }
            };
        case KandidatlisteTypes.OPPDATER_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.SUCCESS
                }
            };
        case KandidatlisteTypes.RESET_LAGRE_STATUS:
            return {
                ...state,
                opprett: {
                    ...state.opprett,
                    lagreStatus: LAGRE_STATUS.UNSAVED
                }
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTER:
            return {
                ...state,
                fetchingKandidatlister: true
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTER_SUCCESS:
            return {
                ...state,
                kandidatlister: action.kandidatlister,
                fetchingKandidatlister: false
            };
        case KandidatlisteTypes.HENT_KANDIDATLISTER_FAILURE:
            return {
                ...state,
                fetchingKandidatlister: false
            };
        case KandidatlisteTypes.LEGG_TIL_KANDIDATER:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.LOADING
                }
            };
        case KandidatlisteTypes.LEGG_TIL_KANDIDATER_SUCCESS:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.SUCCESS,
                    antallLagredeKandidater: action.antallLagredeKandidater
                }
            };
        case KandidatlisteTypes.LEGG_TIL_KANDIDATER_FAILURE:
            return {
                ...state,
                leggTilKandidater: {
                    ...state.leggTilKandidater,
                    lagreStatus: LAGRE_STATUS.FAILURE
                }
            };
        case KandidatlisteTypes.SLETT_KANDIDATLISTE: {
            return {
                ...state,
                slett: {
                    ...state.slett,
                    sletteStatus: SLETTE_STATUS.LOADING
                }
            };
        }
        case KandidatlisteTypes.SLETT_KANDIDATLISTE_SUCCESS: {
            return {
                ...state,
                slett: {
                    sletteStatus: SLETTE_STATUS.SUCCESS
                }
            };
        }
        case KandidatlisteTypes.SLETT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                slett: {
                    ...state.slett,
                    sletteStatus: SLETTE_STATUS.FAILURE
                }
            };
        case KandidatlisteTypes.SLETT_KANDIDATLISTE_RESET_STATUS:
            return {
                ...state,
                slett: {
                    ...state.slett,
                    sletteStatus: SLETTE_STATUS.FINISHED
                }
            };
        default:
            return state;
    }
};

export default kandidatlisteReducer;

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* opprettKandidatliste(action: OpprettKandidatlisteAction) {
    try {
        const state = yield select();
        const orgNr = state.mineArbeidsgivere.valgtArbeidsgiverId;
        yield postKandidatliste(action.kandidatlisteInfo, orgNr);
        yield put({ type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE_SUCCESS, tittel: action.kandidatlisteInfo.tittel });
        yield put({ type: KandidatlisteTypes.HENT_KANDIDATLISTER });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.OPPRETT_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* slettKandidatListe(action: SlettKandidatlisteAction) {
    try {
        const kandidatlisteId = action.kandidatlisteId;
        yield deleteKandidatliste(kandidatlisteId);
        yield put({ type: KandidatlisteTypes.SLETT_KANDIDATLISTE_SUCCESS });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.SLETT_KANDIDATLISTE_FAILURE, error: e });
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
        yield put({ type: KandidatlisteTypes.HENT_KANDIDATLISTER_SUCCESS, kandidatlister: sortertKandidatliste });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.HENT_KANDIDATLISTER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* leggTilKandidater(action: LeggTilKandidaterAction) {
    try {
        for (let i = 0; i < action.kandidatlisteIder.length; i += 1) {
            yield postKandidaterTilKandidatliste(action.kandidatlisteIder[i], action.kandidater);
        }
        yield put({
            type: KandidatlisteTypes.LEGG_TIL_KANDIDATER_SUCCESS,
            antallLagredeKandidater: action.kandidater.length
        });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.LEGG_TIL_KANDIDATER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* oppdaterKandidatliste(action: OppdaterKandidatlisteAction) {
    try {
        yield putKandidatliste(action.kandidatlisteInfo);
        yield put({ type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE_SUCCESS, tittel: action.kandidatlisteInfo.tittel });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: KandidatlisteTypes.OPPDATER_KANDIDATLISTE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* sjekkError(action) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

export function* kandidatlisterSaga() {
    yield takeLatest(KandidatlisteTypes.OPPRETT_KANDIDATLISTE, opprettKandidatliste);
    yield takeLatest(KandidatlisteTypes.SLETT_KANDIDATLISTE, slettKandidatListe);
    yield takeLatest(KandidatlisteTypes.LEGG_TIL_KANDIDATER, leggTilKandidater);
    yield takeLatest(KandidatlisteTypes.HENT_KANDIDATLISTER, hentKandidatlister);
    yield takeLatest(KandidatlisteTypes.OPPDATER_KANDIDATLISTE, oppdaterKandidatliste);
    yield takeLatest([
            KandidatlisteTypes.OPPRETT_KANDIDATLISTE_FAILURE,
            KandidatlisteTypes.HENT_KANDIDATLISTER_FAILURE
        ],
        sjekkError);
}

