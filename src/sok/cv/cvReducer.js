import { call, put, takeLatest, select } from 'redux-saga/effects';
import { SearchApiError, fetchCv, fetchMatchExplain } from '../api';
import { kategoriserMatchKonsepter, oversettUtdanning } from '../utils';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_CV = 'FETCH_CV';
export const FETCH_CV_BEGIN = 'FETCH_CV_BEGIN';
export const FETCH_CV_SUCCESS = 'FETCH_CV_SUCCESS';
export const FETCH_CV_FAILURE = 'FETCH_CV_FAILURE';

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

        const forerkortListe = state.forerkort.forerkortList.includes('Førerkort: Kl. M (Moped)') ?
        [...state.forerkort.forerkortList, 'Mopedførerbevis'] : state.forerkort.forerkortList;

        const criteriaValues = {
            stillinger: state.stilling.stillinger,
            arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
            utdanninger: state.utdanning.utdanninger,
            kompetanser: state.kompetanse.kompetanser,
            geografiList: state.geografi.geografiList,
            totalErfaring: state.arbeidserfaring.totalErfaring,
            utdanningsniva: state.utdanning.utdanningsniva,
            sprak: state.sprakReducer.sprak,
            kandidatnr: action.arenaKandidatnr,
            lokasjoner: [...state.geografi.geografiListKomplett].map((sted) => `${sted.geografiKodeTekst}:${sted.geografiKode}`),
            forerkort: forerkortListe
        };

        const hasValues = Object.values(criteriaValues).some((v) => Array.isArray(v) && v.length);
        if (hasValues && state.search.featureToggles['vis-matchforklaring']) {
            const matchForklaringRespons = yield call(fetchMatchExplain, criteriaValues);

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
