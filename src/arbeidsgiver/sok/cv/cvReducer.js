import { call, put, takeLatest } from 'redux-saga/effects';
import { SearchApiError, fetchCv, fetchMatchExplainFraId } from '../api';
import { kategoriserMatchKonsepter, oversettUtdanning } from '../../../felles/sok/utils';
import { INVALID_RESPONSE_STATUS, SEARCH_SUCCESS } from '../searchReducer';
import { USE_JANZZ } from '../../common/fasitProperties';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_CV = 'FETCH_CV';
export const FETCH_CV_BEGIN = 'FETCH_CV_BEGIN';
export const FETCH_CV_SUCCESS = 'FETCH_CV_SUCCESS';
export const FETCH_CV_NOT_FOUND = 'FETCH_CV_NOT_FOUND';
export const FETCH_CV_FAILURE = 'FETCH_CV_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

export const HENT_CV_STATUS = {
    IKKE_HENTET: 'IKKE_HENTET',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    FINNES_IKKE: 'FINNES_IKKE',
    FAILURE: 'FAILURE'
};

const initialState = {
    cv: {
        utdanning: [],
        yrkeserfaring: [],
        kurs: [],
        sertifikater: [],
        sprak: []
    },
    hentStatus: HENT_CV_STATUS.IKKE_HENTET,
    matchforklaring: undefined,
    sisteSokId: undefined
};

export default function cvReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CV_BEGIN:
            return {
                ...state,
                hentStatus: HENT_CV_STATUS.LOADING
            };
        case FETCH_CV_SUCCESS:
            return {
                ...state,
                hentStatus: HENT_CV_STATUS.SUCCESS,
                cv: action.response,
                matchforklaring: action.matchforklaring
            };
        case FETCH_CV_FAILURE:
            return {
                ...state,
                hentStatus: HENT_CV_STATUS.FAILURE,
                error: action.error
            };
        case FETCH_CV_NOT_FOUND:
            return {
                ...state,
                hentStatus: HENT_CV_STATUS.FINNES_IKKE
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                sisteSokId: action.response.sokId
            };
        default:
            return state;
    }
}

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* fetchCvForKandidat(action) {
    try {
        yield put({ type: FETCH_CV_BEGIN });
        const response = yield call(fetchCv, { kandidatnr: action.arenaKandidatnr });
        let medUtdanningstekst;

        if (USE_JANZZ && action.sisteSokId && action.sisteSokId !== 'null' && action.profilId && action.profilId !== 'null') {
            const matchForklaringRespons = yield call(fetchMatchExplainFraId, { sisteSokId: action.sisteSokId, profilId: action.profilId });

            const omstrukturertForklaring = kategoriserMatchKonsepter(matchForklaringRespons);

            medUtdanningstekst = {
                ...omstrukturertForklaring,
                matchedeKonsepter: oversettUtdanning(omstrukturertForklaring.matchedeKonsepter),
                stillingskonsepterUtenMatch: oversettUtdanning(omstrukturertForklaring.stillingskonsepterUtenMatch),
                kandidatkonsepterUtenMatch: oversettUtdanning(omstrukturertForklaring.kandidatkonsepterUtenMatch)
            };
        }
        yield put({ type: FETCH_CV_SUCCESS, response, matchforklaring: medUtdanningstekst });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.status === 404) {
                yield put({ type: FETCH_CV_NOT_FOUND });
            } else {
                yield put({ type: FETCH_CV_FAILURE, error: e });
            }
        } else {
            throw e;
        }
    }
}

function* sjekkError(action) {
    yield put({ type: INVALID_RESPONSE_STATUS, error: action.error });
}

export const cvSaga = function* cvSaga() {
    yield takeLatest(FETCH_CV, fetchCvForKandidat);
    yield takeLatest(FETCH_CV_FAILURE, sjekkError);
};
