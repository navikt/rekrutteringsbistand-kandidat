import { put, takeLatest } from 'redux-saga/effects';
import { postKandidatliste, SearchApiError, deleteKandidater, fetchKandidatliste } from '../sok/api';
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

export const SLETT_KANDIDATER = 'SLETT_KANDIDATER';
export const SLETT_KANDIDATER_SUCCESS = 'SLETT_KANDIDATER_SUCCESS';
export const SLETT_KANDIDATER_FAILURE = 'SLETT_KANDIDATER_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    lagreStatus: LAGRE_STATUS.UNSAVED,
    kandidatliste: {
        beskrivelse: '',
        kandidatlisteId: '',
        oppdragsgiver: '',
        opprettetAv: '',
        opprettetTidspunkt: undefined,
        organisasjonNavn: '',
        organisasjonReferanse: '',
        stillingId: '',
        tittel: '',
        kandidater: []
    },
    opprettetKandidatlisteTittel: undefined
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case OPPRETT_KANDIDATLISTE:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.LOADING,
                opprettetKandidatlisteTittel: undefined
            };
        case OPPRETT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.SUCCESS,
                opprettetKandidatlisteTittel: action.tittel
            };
        case OPPRETT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.FAILURE,
                opprettetKandidatlisteTittel: undefined
            };
        case RESET_LAGRE_STATUS:
            return {
                ...state,
                lagreStatus: LAGRE_STATUS.UNSAVED
            };
        case HENT_KANDIDATLISTE_SUCCESS:
            return {
                ...state,
                kandidatliste: action.kandidatliste
            };
        case HENT_KANDIDATLISTE_FAILURE:
            return {
                ...state,
                kandidatliste: {
                    kandidater: []
                }
            };
        case SLETT_KANDIDATER_SUCCESS: {
            const { slettKandidatnr } = action;
            return {
                ...state,
                kandidatliste: {
                    ...state.kandidatliste,
                    kandidater: state.kandidatliste.kandidater.filter((k) => !(slettKandidatnr.indexOf(k.kandidatnr) > -1))
                }
            };
        }
        case SLETT_KANDIDATER_FAILURE:
            return {
                ...state
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
        yield deleteKandidater(kandidatlisteId, slettKandidatnr);
        yield put({ type: SLETT_KANDIDATER_SUCCESS, slettKandidatnr });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SLETT_KANDIDATER_FAILURE });
        } else {
            throw e;
        }
    }
}

export function* kandidatlisteSaga() {
    yield takeLatest(OPPRETT_KANDIDATLISTE, opprettKandidatliste);
    yield takeLatest(HENT_KANDIDATLISTE, hentKandidatListe);
    yield takeLatest(SLETT_KANDIDATER, slettKandidater);
}

