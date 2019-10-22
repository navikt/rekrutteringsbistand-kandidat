import { call, put, select, takeLatest } from 'redux-saga/effects';
import { fetchArbeidsgivere, fetchArbeidsgiverClass, logArbeidsgiverMetrics } from '../sok/api.ts';
import { GODTA_VILKAR_SUCCESS, SETT_MANGLER_SAMTYKKE } from '../samtykke/samtykkeReducer';
import { SearchApiError } from '../../felles/api.ts';

/** *********************************************************
 * ACTIONS
 ********************************************************* */
export const HENT_ARBEIDSGIVERE_BEGIN = 'HENT_ARBEIDSGIVERE_BEGIN';
export const HENT_ARBEIDSGIVERE_SUCCESS = 'HENT_ARBEIDSGIVERE_SUCCESS';
export const HENT_ARBEIDSGIVERE_FAILURE = 'HENT_ARBEIDSGIVERE_FAILURE';
export const VELG_ARBEIDSGIVER = 'VELG_ARBEIDSGIVER';
export const RESET_ARBEIDSGIVER = 'RESET_ARBEIDSGIVER';


/** *********************************************************
 * REDUCER
 ********************************************************* */

function hentPersistertValgtArbeidsgiver() {
    const sessionStorageId = sessionStorage.getItem('orgnr');
    if (sessionStorageId) {
        localStorage.setItem('orgnr', sessionStorageId);
        return sessionStorageId;
    }
    const localStorageId = localStorage.getItem('orgnr');
    if (localStorageId) {
        sessionStorage.setItem('orgnr', localStorageId);
        return localStorageId;
    }
    return undefined;
}

function logValgAvArbeidsgiver(arbeidsgiver) {
    if (!arbeidsgiver) return;
    fetchArbeidsgiverClass(arbeidsgiver.orgnr)
        .then((r) => r.body.getReader()
            .read()
            .then(async (cls) => {
                const jsonResponse = JSON.parse(String.fromCharCode.apply(null, cls.value));
                const agPayload = {
                    navn: arbeidsgiver.navn,
                    organizationNumber: arbeidsgiver.orgnr,
                    type: arbeidsgiver.type || 'BEDR',
                    klasse: jsonResponse.companyClass,
                    antallAnsatte: jsonResponse.antallAnsatte
                };
                logArbeidsgiverMetrics(agPayload, arbeidsgiver.orgnr);
            }));
}

function persisterValgtArbeidsgiver(arbeidsgiverId, arbeidsgivere) {
    if (arbeidsgiverId) {
        if (arbeidsgivere) {
            const arbeidsgiver = arbeidsgivere.filter((ag) => ag.orgnr === arbeidsgiverId)[0] || undefined;
            logValgAvArbeidsgiver(arbeidsgiver);
        }
        sessionStorage.setItem('orgnr', arbeidsgiverId);
        localStorage.setItem('orgnr', arbeidsgiverId);
    } else {
        sessionStorage.removeItem('orgnr');
        localStorage.removeItem('orgnr');
    }
}

window.onfocus = function () { // eslint-disable-line func-names
    const sessionStorageId = sessionStorage.getItem('orgnr');
    if (sessionStorageId) {
        localStorage.setItem('orgnr', sessionStorageId);
    }
};

const initialState = {
    valgtArbeidsgiverId: hentPersistertValgtArbeidsgiver(),
    arbeidsgivere: [],
    isFetchingArbeidsgivere: true,
    error: undefined
};

const valgtArbeidsgiverIdVedEndring = (arbeidsgivere, valgtArbeidsgiverId) => {
    if (arbeidsgivere.length === 1) {
        return arbeidsgivere[0].orgnr;
    } else if (valgtArbeidsgiverId && arbeidsgivere.map((arbeidsgiver) => (arbeidsgiver.orgnr))
        .includes(valgtArbeidsgiverId)) {
        return valgtArbeidsgiverId;
    }
    return undefined;
};


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case HENT_ARBEIDSGIVERE_SUCCESS:
            return {
                ...state,
                arbeidsgivere: action.response,
                valgtArbeidsgiverId: action.nyValgtArbeidsgiverId,
                isFetchingArbeidsgivere: false
            };
        case VELG_ARBEIDSGIVER:
            logValgAvArbeidsgiver(state.arbeidsgivere.filter((ag) => ag.orgnr === action.data)[0] || undefined);
            return {
                ...state,
                valgtArbeidsgiverId: action.data
            };
        case RESET_ARBEIDSGIVER:
            return {
                ...state,
                valgtArbeidsgiverId: undefined
            };
        case HENT_ARBEIDSGIVERE_BEGIN:
            return {
                ...state,
                isFetchingArbeidsgivere: true
            };
        case HENT_ARBEIDSGIVERE_FAILURE:
            return {
                ...state,
                isFetchingArbeidsgivere: false,
                error: action.error
            };
        case GODTA_VILKAR_SUCCESS:
            return {
                ...state,
                error: undefined
            };
        default:
            return state;
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */
function* hentArbeidsgivere() {
    try {
        const response = yield call(fetchArbeidsgivere);
        const state = yield select();
        const nyValgtArbeidsgiverId = valgtArbeidsgiverIdVedEndring(response, state.mineArbeidsgivere.valgtArbeidsgiverId);
        persisterValgtArbeidsgiver(nyValgtArbeidsgiverId, response);
        yield put({ type: HENT_ARBEIDSGIVERE_SUCCESS, response, nyValgtArbeidsgiverId });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 406) {
                yield put({ type: SETT_MANGLER_SAMTYKKE });
            }
            yield put({ type: HENT_ARBEIDSGIVERE_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function velgArbeidsgiver(action) {
    persisterValgtArbeidsgiver(action.data);
}

function resetArbeidsgiver() {
    persisterValgtArbeidsgiver();
}

export const mineArbeidsgivereSaga = function* mineArbeidsgivereSaga() {
    yield takeLatest(HENT_ARBEIDSGIVERE_BEGIN, hentArbeidsgivere);
    yield takeLatest(VELG_ARBEIDSGIVER, velgArbeidsgiver);
    yield takeLatest(RESET_ARBEIDSGIVER, resetArbeidsgiver);
};
