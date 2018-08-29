import { call, put, takeLatest, select } from 'redux-saga/effects';
import { SearchApiError, fetchCv, fetchMatchExplain } from '../api';
import { kategoriserMatchKonsepter } from '../utils';
import { oversettUtdanning } from '../utils';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_CV = 'FETCH_CV';
export const FETCH_CV_BEGIN = 'FETCH_CV_BEGIN';
export const FETCH_CV_SUCCESS = 'FETCH_CV_SUCCESS';
export const FETCH_CV_FAILURE = 'FETCH_CV_FAILURE';

export const OPEN_CV_MODAL = 'OPEN_CV_MODAL';
export const CLOSE_CV_MODAL = 'CLOSE_CV_MODAL';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    cv: {
        utdanning: [],
        yrkeserfaring: [],
        kurs: [],
        sertifikater: [],
        sprak: []
    },
    isCvModalOpen: false,
    isFetchingCv: false,
    matchforklaring: undefined
};

export default function cvReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CV_BEGIN:
            return {
                ...state,
                isFetchingCv: true
            };
        case FETCH_CV_SUCCESS:
            return {
                ...state,
                isFetchingCv: false,
                cv: action.response,
                matchforklaring: action.matchforklaring
            };
        case FETCH_CV_FAILURE:
            return {
                ...state,
                isFetchingCv: false,
                error: action.error
            };
        case OPEN_CV_MODAL:
            return {
                ...state,
                isCvModalOpen: true
            };
        case CLOSE_CV_MODAL:
            return {
                ...state,
                cv: { ...initialState.cv },
                isCvModalOpen: false
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
        const state = yield select();
        yield put({ type: FETCH_CV_BEGIN });
        const response = yield call(fetchCv, { kandidatnr: action.arenaKandidatnr });

        let medUtdanningstekst;

        if (state.search.featureToggles['vis-matchforklaring']) {
            const matchForklaringRespons = yield call(fetchMatchExplain, {
                stillinger: state.stilling.stillinger,
                arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
                utdanninger: state.utdanning.utdanninger,
                kompetanser: state.kompetanse.kompetanser,
                geografiList: state.geografi.geografiList,
                totalErfaring: state.arbeidserfaring.totalErfaring,
                utdanningsniva: state.utdanning.utdanningsniva,
                sprak: state.sprakReducer.sprak,
                kandidatnr: action.arenaKandidatnr,
                lokasjoner: [...state.geografi.geografiListKomplett].map((sted) => `${sted.geografiKodeTekst}:${sted.geografiKode}`)
            });

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
            yield put({ type: FETCH_CV_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const cvSaga = function* cvSaga() {
    yield takeLatest(FETCH_CV, fetchCvForKandidat);
};
